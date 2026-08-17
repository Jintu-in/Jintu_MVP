-- Streaks v2 (owner spec, 2026-08-17): hard reset, total_days, IST always.
--
-- SUPERSEDES 0008's streak semantics. The product decision reversed:
-- freezes are OUT (hard reset on a missed day), and total_days — which
-- never decreases — is the mitigation that stops someone quitting after a
-- break. The streak resets; the investment does not.
--
-- The four traps, each handled and each guarded in assert-retention:
--   1. Timezone: every date here is Asia/Kolkata. On UTC an Indian evening
--      credits tomorrow and an early morning credits yesterday — a person
--      who studied every evening watches their streak break for no reason
--      they can see. ist_today() everywhere; the bare SQL date function is banned here.
--   2. Idempotency: one calendar day is one streak day regardless of
--      volume, or the streak measures binges, not consistency.
--   3. Restart is 1, not 0: completing a day always shows at least 1.
--   4. Staleness: streaks.current_days is only written on completion, so a
--      nine-days-gone user would still read "11-day streak". The UI reads
--      streak_status, which decays; never the raw table.
--
-- activity_days is the source of truth; streaks is a derived cache. If
-- they ever disagree, rebuild from activity_days (uncomplete_day does
-- exactly that).

-- ─────────────────────────────────────────────────────────────────────────────
-- ist_today — one clock, IST, with the test seam 0008 established
-- ─────────────────────────────────────────────────────────────────────────────
-- The seam is jintu.now (a timestamptz), not a date: trap 1 is about the
-- conversion, and a guard that cannot place "23:30 IST" on a UTC machine
-- cannot prove the trap is closed. PostgREST exposes no path to set_config,
-- so in production this is now() with extra steps.

create or replace function public.ist_today()
  returns date
  language sql
  stable
  set search_path = ''
as $$
  select (coalesce(
    nullif(current_setting('jintu.now', true), '')::timestamptz,
    now()
  ) at time zone 'Asia/Kolkata')::date;
$$;

-- 0008's jintu_today() had the same job with a date-typed seam and an
-- implicit UTC date. Repoint it so anything still calling it gets IST.
create or replace function public.jintu_today()
  returns date
  language sql
  stable
  set search_path = ''
as $$
  select public.ist_today();
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- streaks reshaped: freezes out, total_days in
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.streaks
  add column if not exists total_days int not null default 0
    constraint streaks_total_days_positive check (total_days >= 0),
  add column if not exists last_done_on date,
  add column if not exists updated_at timestamptz not null default now();

-- Carry what exists: last_active_on was the same fact under the old name,
-- and a user's history so far counts toward the number that never resets.
-- Guarded, because a re-paste runs after the column below is dropped.
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'streaks'
      and column_name = 'last_active_on'
  ) then
    update public.streaks
    set last_done_on = coalesce(last_done_on, last_active_on),
        total_days = greatest(total_days, current_days)
    where last_done_on is null;
  end if;
end $$;

alter table public.streaks
  drop column if exists freezes_remaining,
  drop column if exists freezes_reset_on,
  drop column if exists last_active_on;

do $$ begin
  alter table public.streaks
    add constraint streaks_total_gte_current check (total_days >= current_days);
exception when duplicate_object then null; end $$;

comment on table public.streaks is
  'Derived cache over activity_days — rebuild from there if they disagree. current_days hard-resets on a miss; total_days NEVER decreases (except an undo emptying a day). No freezes, by product decision. Clients read streak_status, never this.';

-- ─────────────────────────────────────────────────────────────────────────────
-- activity_days — the source of truth
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.activity_days (
  user_id uuid not null references public.profiles (id) on delete cascade,
  done_on date not null,
  nodes   int not null default 1 check (nodes >= 1),
  primary key (user_id, done_on)
);

comment on table public.activity_days is
  'One row per user per IST calendar day with at least one completion. Source of truth for streaks.';

create index if not exists activity_days_user_idx on public.activity_days (user_id, done_on desc);

alter table public.activity_days enable row level security;

do $$ begin
  create policy "users read their own activity"
    on public.activity_days for select
    to authenticated
    using (user_id = (select auth.uid()));
exception when duplicate_object then null; end $$;

grant select on public.activity_days to authenticated;
-- No client write path: completions go through complete_day only.

-- ─────────────────────────────────────────────────────────────────────────────
-- 0008's trigger loses its streak duty; points stay exactly as they were
-- ─────────────────────────────────────────────────────────────────────────────
-- The award trigger keeps paying node points and module bonuses on any done
-- transition, but the STREAK only moves through complete_day — "what
-- counts is marking a day complete", and a raw row write is not that.

create or replace function public.award_on_node_done()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  today date := public.ist_today();
  node_points int;
  node_module uuid;
  spent_today int;
begin
  if new.status <> 'done' then return new; end if;
  if tg_op = 'UPDATE' and old.status = 'done' then return new; end if;

  select points, module_id into node_points, node_module
  from public.nodes where id = new.node_id;
  if node_points is null then return new; end if;

  select coalesce(sum(points), 0) into spent_today
  from public.point_events
  where user_id = new.user_id and source_type = 'node' and awarded_on = today;

  if spent_today < 150 then
    insert into public.point_events (user_id, source_type, source_id, points, awarded_on)
    values (new.user_id, 'node', new.node_id, node_points, today)
    on conflict do nothing;
  end if;

  if not exists (
    select 1 from public.nodes n
    left join public.node_progress p
      on p.node_id = n.id and p.user_id = new.user_id and p.status = 'done'
    where n.module_id = node_module and not n.is_optional and p.node_id is null
  ) then
    insert into public.point_events (user_id, source_type, source_id, points, awarded_on)
    values (new.user_id, 'module', node_module, 50, today)
    on conflict do nothing;
  end if;

  return new;
end;
$$;

drop function if exists public.touch_streak(uuid);

-- ─────────────────────────────────────────────────────────────────────────────
-- complete_day — the one write path for the streak
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.complete_day(p_node_id uuid)
  returns table (
    current_days int, longest_days int, total_days int,
    is_new_day boolean, was_broken boolean, days_missed int
  )
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  today date := public.ist_today();
  s public.streaks%rowtype;
  gap int;
  new_current int;
  bonus int;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- The progress row (fires the points trigger). completed_at is kept from
  -- the first completion — an undo/redo does not rewrite history.
  insert into public.node_progress (user_id, node_id, status, completed_at)
  values (uid, p_node_id, 'done', now())
  on conflict (user_id, node_id) do update
    set status = 'done',
        completed_at = coalesce(public.node_progress.completed_at, now());

  -- Trap 2: the day row. Volume accumulates; the streak below moves only
  -- when this is the first completion of the calendar day.
  insert into public.activity_days (user_id, done_on, nodes)
  values (uid, today, 1)
  on conflict (user_id, done_on) do update
    set nodes = public.activity_days.nodes + 1;

  insert into public.streaks (user_id) values (uid) on conflict do nothing;
  select * into s from public.streaks where user_id = uid for update;

  if s.last_done_on = today then
    return query select s.current_days, s.longest_days, s.total_days, false, false, 0;
    return;
  end if;

  gap := case when s.last_done_on is null then 0
              else (today - s.last_done_on) - 1 end;

  -- Trap 3: a restart is 1, never 0.
  new_current := case when s.last_done_on = today - 1 then s.current_days + 1 else 1 end;

  update public.streaks set
    current_days = new_current,
    longest_days = greatest(streaks.longest_days, new_current),
    total_days   = streaks.total_days + 1, -- unconditional, always
    last_done_on = today,
    updated_at   = now()
  where user_id = uid;

  -- The 91-day plan's streak bonus survives the freeze removal: +5 per
  -- active day from a week, +10 from a month, once per IST day.
  bonus := case when new_current >= 30 then 10
                when new_current >= 7 then 5
                else 0 end;
  if bonus > 0 then
    insert into public.point_events (user_id, source_type, source_id, points, awarded_on)
    values (uid, 'streak', uid, bonus, today)
    on conflict do nothing;
  end if;

  return query
    select st.current_days, st.longest_days, st.total_days, true, (gap > 0), gap
    from public.streaks st where st.user_id = uid;
end;
$$;

revoke execute on function public.complete_day(uuid) from public, anon;
grant execute on function public.complete_day(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- uncomplete_day — undo that rebuilds from the source of truth
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.uncomplete_day(p_node_id uuid)
  returns table (current_days int, longest_days int, total_days int)
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  today date := public.ist_today();
  remaining int;
  last_day date;
  cur int;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  update public.node_progress
  set status = 'in_progress', completed_at = null
  where user_id = uid and node_id = p_node_id and status = 'done';
  if not found then
    return query select s.current_days, s.longest_days, s.total_days
    from public.streaks s where s.user_id = uid;
    return;
  end if;

  update public.activity_days
  set nodes = nodes - 1
  where user_id = uid and done_on = today and nodes > 1
  returning nodes into remaining;

  if remaining is null then
    -- Today's row was at 1 (or absent): the day empties and un-counts.
    delete from public.activity_days where user_id = uid and done_on = today;

    -- Rebuild the cache from the source of truth. current = length of the
    -- consecutive run ending at the most recent activity day.
    select max(done_on) into last_day from public.activity_days where user_id = uid;
    if last_day is null then
      cur := 0;
    else
      select count(*) into cur
      from (
        select done_on,
               done_on + (row_number() over (order by done_on desc))::int as grp
        from public.activity_days where user_id = uid
      ) runs
      where grp = last_day + 1;
    end if;

    update public.streaks set
      current_days = cur,
      -- longest is historical; an undo of today cannot shrink what was
      -- genuinely achieved on other days, and recomputing it from
      -- activity_days here would also be correct — cheaper to leave.
      total_days   = greatest(0, streaks.total_days - 1),
      last_done_on = last_day,
      updated_at   = now()
    where user_id = uid;
  end if;

  return query select s.current_days, s.longest_days, s.total_days
  from public.streaks s where s.user_id = uid;
end;
$$;

revoke execute on function public.uncomplete_day(uuid) from public, anon;
grant execute on function public.uncomplete_day(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- streak_status — trap 4: the read that decays
-- ─────────────────────────────────────────────────────────────────────────────

create or replace view public.streak_status
  with (security_invoker = true)
as
select
  s.user_id,
  case
    when s.last_done_on = public.ist_today()     then s.current_days
    when s.last_done_on = public.ist_today() - 1 then s.current_days -- alive, not yet done today
    else 0                                                          -- lapsed
  end as current_days,
  s.longest_days,
  s.total_days,
  s.last_done_on,
  s.last_done_on = public.ist_today() as done_today,
  case when s.last_done_on is null then null
       else public.ist_today() - s.last_done_on end as days_since
from public.streaks s;

comment on view public.streak_status is
  'The only streak surface the UI may read: current_days decays to 0 when lapsed without waiting for a write. security_invoker + streaks RLS = own row only.';

grant select on public.streak_status to authenticated;
