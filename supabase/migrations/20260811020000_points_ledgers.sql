-- ─────────────────────────────────────────────────────────────────────────────
-- Daily reps, two point ledgers, and streaks
--
-- TRACK_MODEL.md Parts 6 and 12 (item 6): the habit loop. Free by
-- construction — everything here is a row write, no model is ever called.
--
-- The rule that shapes all of it is project rule 5: consistency points NEVER
-- become proof points. Consistency is earned by showing up (daily reps, peer
-- reviews) and buys motivation — streaks, eventually discounts. Proof is
-- earned by graded artifacts and is the only thing a readiness score may
-- read. A streak on a profile is honest and recruiters really do read it;
-- what it must never do is add a single point to the score that claims you
-- can do the work. The enforcement lives in proof_totals below — a view, so
-- no future feature can quietly join the wrong ledger into readiness.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── daily reps: small, day-sized prompts under each week ────────────────────

create table public.daily_reps (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid not null references public.modules (id) on delete cascade,
  day_no       int not null check (day_no between 1 and 7),
  prompt       text not null,
  -- Reps are checked only by the free archetypes. rubric_ai on a daily rep
  -- would be an unbounded per-user AI cost, which is Law 1's exact target.
  verification text not null check (verification in ('executable', 'structural')),
  -- Registry check specs, e.g. {'non_empty','contains_join'}. Validated
  -- against the eleven names by the trigger below.
  checks       text[] not null default '{}',
  points       int not null default 10 check (points between 1 and 30),
  unique (module_id, day_no)
);

comment on table public.daily_reps is
  'Day-sized prompts under a week. Consistency points only — never proof.';

alter table public.daily_reps enable row level security;

-- Public like resources: the reps are curriculum, and the curriculum is free.
create policy "reps of published paths are public"
  on public.daily_reps for select
  to anon, authenticated
  using (
    module_id in (
      select m.id from public.modules m
      join public.paths p on p.id = m.path_id
      where p.status = 'published'
    )
  );

-- Same freeze as every other piece of published curriculum: a student who
-- started the week against one set of reps must not find them rewritten.
create or replace function public.reject_published_rep_change()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
declare
  owning_module uuid;
  parent_status text;
begin
  if tg_op = 'DELETE' then
    owning_module := old.module_id;
  else
    owning_module := new.module_id;
  end if;

  select p.status into parent_status
  from public.modules m
  join public.paths p on p.id = m.path_id
  where m.id = owning_module;

  if parent_status is distinct from 'published' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  raise exception 'Cannot modify daily reps of a published path. Create a new path version instead.';
end;
$$;

create trigger daily_reps_frozen_when_published
  before insert or update or delete on public.daily_reps
  for each row execute function public.reject_published_rep_change();

-- Check specs must name real checkers. Same eleven as the rubric trigger,
-- duplicated deliberately: the project rules fix the list forever.
create or replace function public.validate_rep_checks()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
declare
  c text;
begin
  foreach c in array new.checks loop
    if split_part(c, ':', 1) not in
      ('sql_diff', 'code_test_suite', 'answer_key_match', 'non_empty',
       'duration_between', 'has_sections', 'url_reachable', 'media_has_audio',
       'contains_join', 'row_count_ceiling', 'rubric_score')
    then
      raise exception 'daily rep: no checker named "%" exists', split_part(c, ':', 1);
    end if;
  end loop;
  return new;
end;
$$;

create trigger daily_reps_checks_valid
  before insert or update on public.daily_reps
  for each row execute function public.validate_rep_checks();

-- ── rep submissions ──────────────────────────────────────────────────────────

create table public.rep_submissions (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  daily_rep_id  uuid not null references public.daily_reps (id) on delete cascade,
  payload       jsonb not null default '{}'::jsonb,
  -- Anti-gaming rule 2: reps are day-stamped, not backfillable. The function
  -- below never accepts a date, so a rep submitted Thursday cannot claim
  -- Tuesday. current_date is the only writer.
  submitted_on  date not null default current_date,
  unique (enrollment_id, daily_rep_id)
);

alter table public.rep_submissions enable row level security;

create policy "students read their own rep submissions"
  on public.rep_submissions for select
  to authenticated
  using (
    enrollment_id in (
      select e.id from public.enrollments e where e.user_id = (select auth.uid())
    )
  );

-- ── the two ledgers ──────────────────────────────────────────────────────────

create table public.point_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  ledger      text not null check (ledger in ('consistency', 'proof')),
  source_type text not null check (source_type in ('daily_rep', 'artifact', 'peer_review')),
  source_id   uuid not null,
  points      int not null check (points > 0),
  awarded_at  timestamptz not null default now(),
  -- Anti-gaming rule 3: a mentor sample that finds a low-effort peer review
  -- voids its points retroactively. The row stays — history is evidence —
  -- but every total in this file excludes it.
  voided_at   timestamptz,
  unique (user_id, source_type, source_id)
);

comment on table public.point_events is
  'Both ledgers, one table, never convertible. consistency = showing up; proof = graded artifacts. readiness reads ONLY proof, via proof_totals.';

create index point_events_user_ledger_idx on public.point_events (user_id, ledger)
  where voided_at is null;

alter table public.point_events enable row level security;

create policy "students read their own points"
  on public.point_events for select
  to authenticated
  using (user_id = (select auth.uid()));

-- ── streaks ──────────────────────────────────────────────────────────────────

create table public.streaks (
  user_id           uuid primary key references public.profiles (id) on delete cascade,
  current_days      int not null default 0,
  longest_days      int not null default 0,
  last_active_date  date,
  -- Two per sprint, auto-applied. Power cuts, exam weeks and festivals are
  -- not motivation failures, and a streak that snaps on day 19 for reasons
  -- outside the student's control converts a motivated learner into a
  -- churned one.
  freezes_remaining int not null default 2 check (freezes_remaining >= 0)
);

alter table public.streaks enable row level security;

create policy "students read their own streak"
  on public.streaks for select
  to authenticated
  using (user_id = (select auth.uid()));

-- ── the wall between the ledgers ────────────────────────────────────────────

-- The ONLY sanctioned path from points into readiness. security_invoker, so a
-- student selecting it sees their own rows under point_events' RLS, and the
-- compute job reads it with the service role.
--
-- Project rule 5 lives in this WHERE clause. A feature that wants consistency
-- to count towards readiness has to edit this view in a reviewed migration —
-- it cannot drift there through application code.
create view public.proof_totals
with (security_invoker = true) as
select user_id, sum(points)::int as proof_points
from public.point_events
where ledger = 'proof' and voided_at is null
group by user_id;

comment on view public.proof_totals is
  'Readiness reads points from here and nowhere else. The WHERE clause is project rule 5: consistency never becomes proof.';

-- ── submitting a rep ─────────────────────────────────────────────────────────

create or replace function public.submit_rep(p_daily_rep_id uuid, p_payload jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user      uuid := (select auth.uid());
  v_enrolment uuid;
  v_points    int;
  v_today     int;
  v_award     int;
  v_streak    public.streaks;
  v_existing  uuid;
begin
  if v_user is null then
    raise exception 'Sign in to log a rep' using errcode = '28000';
  end if;
  if not exists (select 1 from public.profiles where id = v_user) then
    raise exception 'Finish signing up first' using errcode = 'P0002';
  end if;

  -- The rep must belong to a track this person is actively enrolled in. This
  -- is what stops a visitor logging reps against a course they read for free
  -- — the reading is free, the loop is the cohort's.
  select e.id, r.points into v_enrolment, v_points
  from public.daily_reps r
  join public.modules m on m.id = r.module_id
  join public.paths p on p.id = m.path_id
  join public.cohorts c on c.path_id = p.id
  join public.enrollments e on e.cohort_id = c.id
  where r.id = p_daily_rep_id
    and e.user_id = v_user
    and e.status = 'active'
    and c.status in ('open', 'running')
  limit 1;

  if v_enrolment is null then
    raise exception 'This rep is not part of a cohort you are enrolled in'
      using errcode = 'P0001';
  end if;

  -- Logging the same rep twice is one rep. The submission stands, no second
  -- points, and the reply says so instead of erroring.
  select id into v_existing
  from public.rep_submissions
  where enrollment_id = v_enrolment and daily_rep_id = p_daily_rep_id;

  if v_existing is not null then
    select * into v_streak from public.streaks where user_id = v_user;
    return jsonb_build_object(
      'already_logged', true, 'points_awarded', 0,
      'streak_days', coalesce(v_streak.current_days, 0),
      'freezes_remaining', coalesce(v_streak.freezes_remaining, 2));
  end if;

  insert into public.rep_submissions (enrollment_id, daily_rep_id, payload)
  values (v_enrolment, p_daily_rep_id, coalesce(p_payload, '{}'::jsonb));

  -- Anti-gaming rule 1: at most 30 consistency points per calendar day.
  -- Grinding twelve reps on Sunday does not buy a week. The submission above
  -- still stands — the work counts, the points cap.
  select coalesce(sum(points), 0) into v_today
  from public.point_events
  where user_id = v_user
    and ledger = 'consistency'
    and voided_at is null
    and awarded_at >= current_date;

  v_award := least(v_points, greatest(30 - v_today, 0));

  if v_award > 0 then
    insert into public.point_events (user_id, ledger, source_type, source_id, points)
    values (v_user, 'consistency', 'daily_rep', p_daily_rep_id, v_award);
  end if;

  -- The streak. A freeze silently covers exactly one missed day; a longer
  -- gap starts over. longest_days never goes down.
  insert into public.streaks (user_id, current_days, longest_days, last_active_date)
  values (v_user, 1, 1, current_date)
  on conflict (user_id) do update set
    current_days = case
      when public.streaks.last_active_date = current_date then public.streaks.current_days
      when public.streaks.last_active_date = current_date - 1 then public.streaks.current_days + 1
      when public.streaks.last_active_date = current_date - 2
       and public.streaks.freezes_remaining > 0 then public.streaks.current_days + 1
      else 1
    end,
    freezes_remaining = case
      when public.streaks.last_active_date = current_date - 2
       and public.streaks.freezes_remaining > 0 then public.streaks.freezes_remaining - 1
      else public.streaks.freezes_remaining
    end,
    last_active_date = current_date;

  update public.streaks
     set longest_days = greatest(longest_days, current_days)
   where user_id = v_user
  returning * into v_streak;

  return jsonb_build_object(
    'already_logged', false,
    'points_awarded', v_award,
    'capped', v_award < v_points,
    'streak_days', v_streak.current_days,
    'freezes_remaining', v_streak.freezes_remaining);
end;
$$;

grant execute on function public.submit_rep(uuid, jsonb) to authenticated;

-- ── proof points, awarded by the grading pipeline ───────────────────────────

-- Anti-gaming rule 4: proof points require the peer reviews to be done. Ship
-- an artifact and review nobody, and the points wait until the reviews are
-- in. This is what makes peer review actually happen, and peer review is
-- what makes the community tier free.
--
-- Service-role only: the grading pipeline calls it after writing a grading
-- row. Idempotent via the unique constraint — the pipeline retries.
create or replace function public.award_artifact_points(p_submission_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user    uuid;
  v_enrol   uuid;
  v_total   numeric;
  v_pending int;
begin
  select e.user_id, e.id, g.total into v_user, v_enrol, v_total
  from public.submissions s
  join public.enrollments e on e.id = s.enrollment_id
  join public.gradings g on g.submission_id = s.id
  where s.id = p_submission_id
  order by g.created_at desc
  limit 1;

  if v_user is null then
    return jsonb_build_object('awarded', 0, 'reason', 'no grading for this submission yet');
  end if;

  if v_total is null or v_total <= 0 then
    return jsonb_build_object('awarded', 0, 'reason', 'grade is zero');
  end if;

  select count(*) into v_pending
  from public.peer_reviews pr
  where pr.reviewer_enrollment_id = v_enrol
    and pr.status = 'pending';

  if v_pending > 0 then
    return jsonb_build_object(
      'awarded', 0,
      'reason', 'peer reviews pending',
      'pending', v_pending);
  end if;

  insert into public.point_events (user_id, ledger, source_type, source_id, points)
  values (v_user, 'proof', 'artifact', p_submission_id, round(v_total)::int)
  on conflict (user_id, source_type, source_id) do nothing;

  return jsonb_build_object('awarded', round(v_total)::int);
end;
$$;

revoke execute on function public.award_artifact_points(uuid) from public, anon, authenticated;

-- ── retroactive voiding ──────────────────────────────────────────────────────

-- Anti-gaming rule 3's teeth. Ops only. The row survives with voided_at set:
-- students learn this happens, and the history of it happening is the record.
create or replace function public.void_point_event(p_event_id uuid)
returns boolean
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
begin
  update public.point_events
     set voided_at = now()
   where id = p_event_id
     and voided_at is null;
  return found;
end;
$$;

revoke execute on function public.void_point_event(uuid) from public, anon, authenticated;
