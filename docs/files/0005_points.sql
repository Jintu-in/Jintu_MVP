-- 0005_points.sql
-- The two-ledger points model, streaks, and the five anti-gaming rules.
--
-- THE RULE THIS FILE EXISTS TO ENFORCE: consistency points can never become
-- proof points. readiness reads only ledger='proof'. If daily activity could
-- nudge readiness upward, the score would stop meaning "this person can do the
-- work" and start meaning "this person opened the app a lot" — at which point
-- the public profile is worthless to a recruiter, and so is the moat.

create table point_events (
  id            bigserial primary key,
  user_id       uuid not null references profiles on delete cascade,
  ledger        ledger not null,
  source_type   text not null check (source_type in ('rep','artifact','peer_review','refresh')),
  source_id     uuid not null,
  points        numeric(6,2) not null check (points > 0),
  -- Which mechanism paid out. Makes a profile auditable: a reader can see that
  -- 34 of someone's 42 points came from machine checks rather than from peers
  -- being kind.
  verification  archetype not null,
  awarded_on    date not null default current_date,
  awarded_at    timestamptz not null default now(),
  voided_at     timestamptz,
  voided_reason text,

  -- Rule 1: one payout per source. Re-grading updates, never duplicates.
  unique (user_id, source_type, source_id, ledger)
);
create index on point_events (user_id, ledger) where voided_at is null;
create index on point_events (user_id, awarded_on) where voided_at is null;

-- Rule 2: proof points only ever come from a graded artifact; consistency
-- points never do. Enforced here so no future feature can quietly cross over.
create or replace function assert_ledger_source()
returns trigger language plpgsql as $$
begin
  if new.ledger = 'proof' and new.source_type <> 'artifact' then
    raise exception 'proof points may only come from a graded artifact, not %', new.source_type;
  end if;
  if new.ledger = 'consistency' and new.source_type = 'artifact' then
    raise exception 'an artifact pays into the proof ledger, not consistency';
  end if;
  if new.ledger = 'proof' and new.verification in ('peer','mentor') then
    -- Peer-scored points are real but are not evidence; they land in proof
    -- with verification recorded, which the readiness view weights separately.
    null;
  end if;
  return new;
end $$;
create trigger point_events_ledger_source before insert or update on point_events
  for each row execute function assert_ledger_source();

-- Rule 3: daily consistency cap. Grinding twelve reps on Sunday must not buy
-- a week's worth of streak credit.
create or replace function assert_daily_cap()
returns trigger language plpgsql as $$
declare today_total numeric;
begin
  if new.ledger <> 'consistency' then return new; end if;
  select coalesce(sum(points), 0) into today_total
  from point_events
  where user_id = new.user_id and ledger = 'consistency'
    and awarded_on = new.awarded_on and voided_at is null
    and id <> coalesce(new.id, -1);
  if today_total + new.points > 30 then
    raise exception 'daily consistency cap of 30 points reached for %', new.awarded_on;
  end if;
  return new;
end $$;
create trigger point_events_daily_cap before insert or update on point_events
  for each row execute function assert_daily_cap();

-- Rule 4: reps are day-stamped from the submission, never chosen by the client.
create or replace function assert_rep_date_matches()
returns trigger language plpgsql as $$
declare sub_date date;
begin
  if new.source_type <> 'rep' then return new; end if;
  select submitted_on into sub_date from rep_submissions where id = new.source_id;
  if sub_date is not null and new.awarded_on <> sub_date then
    raise exception 'rep points must be dated to the submission date (%), not %', sub_date, new.awarded_on;
  end if;
  return new;
end $$;
create trigger point_events_rep_date before insert on point_events
  for each row execute function assert_rep_date_matches();

-- Rule 5: voiding a peer review voids its points. Learners find out this
-- happens, which is most of why it works.
create or replace function cascade_review_void()
returns trigger language plpgsql as $$
begin
  if new.voided_at is not null and old.voided_at is null then
    update point_events
      set voided_at = new.voided_at,
          voided_reason = coalesce(new.voided_reason, 'review voided on audit')
    where source_type = 'peer_review' and source_id = new.id and voided_at is null;
  end if;
  return new;
end $$;
create trigger peer_reviews_void_points after update on peer_reviews
  for each row execute function cascade_review_void();

-- ---------------------------------------------------------------------------
-- Streaks
-- ---------------------------------------------------------------------------
create table streaks (
  user_id           uuid primary key references profiles on delete cascade,
  current_days      integer not null default 0 check (current_days >= 0),
  longest_days      integer not null default 0 check (longest_days >= 0),
  last_active_on    date,
  -- Two per month, auto-applied. Power cuts, exam weeks, festivals and a
  -- sibling's wedding are not motivation failures, and a streak that snaps on
  -- day 19 for reasons outside the learner's control converts a motivated
  -- person into a churned one.
  freezes_remaining smallint not null default 2 check (freezes_remaining >= 0),
  freezes_reset_on  date not null default (date_trunc('month', current_date) + interval '1 month')::date,
  updated_at        timestamptz not null default now()
);

create or replace function touch_streak(target_user uuid, on_date date default current_date)
returns void language plpgsql security definer set search_path = public as $$
declare s streaks;
begin
  insert into streaks (user_id, current_days, longest_days, last_active_on)
  values (target_user, 1, 1, on_date)
  on conflict (user_id) do nothing;

  select * into s from streaks where user_id = target_user for update;
  if s.last_active_on = on_date then return; end if;

  -- Monthly freeze top-up.
  if on_date >= s.freezes_reset_on then
    update streaks set freezes_remaining = 2,
      freezes_reset_on = (date_trunc('month', on_date) + interval '1 month')::date
      where user_id = target_user;
    select * into s from streaks where user_id = target_user;
  end if;

  if s.last_active_on = on_date - 1 then
    update streaks set current_days = s.current_days + 1,
      longest_days = greatest(s.longest_days, s.current_days + 1),
      last_active_on = on_date, updated_at = now()
    where user_id = target_user;
  elsif s.last_active_on = on_date - 2 and s.freezes_remaining > 0 then
    -- One missed day, one freeze spent, streak survives.
    update streaks set current_days = s.current_days + 1,
      longest_days = greatest(s.longest_days, s.current_days + 1),
      last_active_on = on_date, freezes_remaining = s.freezes_remaining - 1,
      updated_at = now()
    where user_id = target_user;
  else
    update streaks set current_days = 1, last_active_on = on_date, updated_at = now()
    where user_id = target_user;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table point_events enable row level security;
alter table streaks      enable row level security;

create policy points_own on point_events for select
  using (user_id = (select auth.uid()));
-- Inserts come from the grading edge function under the service role. No
-- client-side insert policy exists: a client that can mint points is a client
-- that will.

create policy streaks_own on streaks for select
  using (user_id = (select auth.uid()));

comment on table point_events is
  'Two ledgers, never convertible. verification records how each point was earned so a profile can be audited.';
comment on column streaks.freezes_remaining is
  'Two per month, auto-applied. Designed for Indian conditions: power cuts, exams, festivals.';
