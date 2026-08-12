-- V3: every point records how it was earned.
--
-- point_events gains `verification` — the archetype that checked the work
-- the point was awarded for. NEVER null: an unattributed point is exactly
-- the "peers being nice" ambiguity the open platform cannot afford. With it,
-- the public profile can show that 34 of someone's 41 points came from
-- deterministic checks, which is what makes the credential auditable by a
-- recruiter or a college rather than taken on faith.

-- ── the column ───────────────────────────────────────────────────────────────

alter table public.point_events
  add column if not exists verification text;

-- Backfill before the constraint. Two writers existed before this migration:
--
--   daily_rep  → the rep row declares its own archetype (executable or
--                structural), copy it
--   artifact   → derived the same way the function below derives it from
--                now on: the grader type that produced the score, refined by
--                what kind of assignment it was
update public.point_events pe
   set verification = dr.verification
  from public.daily_reps dr
 where pe.source_type = 'daily_rep'
   and pe.verification is null
   and dr.id = pe.source_id;

update public.point_events pe
   set verification = sub.v
  from (
    select s.id as submission_id,
           case
             when g.grader_type = 'ai' then 'rubric_ai'
             when g.grader_type = 'mentor' then 'mentor_sample'
             when g.grader_type = 'deterministic' and a.kind = 'sql' then 'executable'
             when g.grader_type = 'deterministic' then 'detectable'
             else 'peer'
           end as v
    from public.submissions s
    join public.assignments a on a.id = s.assignment_id
    join lateral (
      select grader_type from public.gradings
      where submission_id = s.id
      order by created_at desc limit 1
    ) g on true
  ) sub
 where pe.source_type = 'artifact'
   and pe.verification is null
   and sub.submission_id = pe.source_id;

-- Anything still unattributed was written by no code path we know. 'peer'
-- would be a guess dressed as a fact; refuse instead, loudly, at migration
-- time — this runs before the NOT NULL and would leave the migration failed
-- and the operator looking at exactly the rows that need explaining.
do $$
declare v_orphans int;
begin
  select count(*) into v_orphans from public.point_events where verification is null;
  if v_orphans > 0 then
    raise exception '% point_events rows have no derivable verification — attribute them by hand before applying this migration', v_orphans;
  end if;
end;
$$;

alter table public.point_events
  alter column verification set not null;

alter table public.point_events
  add constraint point_events_verification_is_an_archetype
  check (verification in ('executable', 'detectable', 'structural', 'rubric_ai', 'peer', 'mentor_sample'));

comment on column public.point_events.verification is
  'V3: which archetype checked the work this point was awarded for. Never null — an unattributed point is the ambiguity the open platform exists to remove.';

-- ── writers now attribute ────────────────────────────────────────────────────

create or replace function public.submit_rep(p_daily_rep_id uuid, p_payload jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user         uuid := (select auth.uid());
  v_enrolment    uuid;
  v_points       int;
  v_verification text;
  v_today        int;
  v_award        int;
  v_streak       public.streaks;
  v_existing     uuid;
begin
  if v_user is null then
    raise exception 'Sign in to log a rep' using errcode = '28000';
  end if;
  if not exists (select 1 from public.profiles where id = v_user) then
    raise exception 'Finish signing up first' using errcode = 'P0002';
  end if;

  -- The rep must belong to a track this person has actively started — the
  -- reading is free, the loop is for people in it.
  select e.id, r.points, r.verification into v_enrolment, v_points, v_verification
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
    raise exception 'This rep is not part of a track you have started'
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
    -- The rep declares its own archetype (executable or structural — daily
    -- reps never cost money), and the point carries it.
    insert into public.point_events (user_id, ledger, source_type, source_id, points, verification)
    values (v_user, 'consistency', 'daily_rep', p_daily_rep_id, v_award, v_verification);
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

create or replace function public.award_artifact_points(p_submission_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user         uuid;
  v_enrol        uuid;
  v_total        numeric;
  v_verification text;
  v_pending      int;
begin
  -- The newest grading is the one that scored it, and its grader type —
  -- refined by what kind of assignment this was — is how the point was
  -- verified. SQL that ran is executable; a deterministic mark on anything
  -- else is the defect key; a model is rubric_ai; people are peer/mentor.
  select e.user_id, e.id, g.total,
         case
           when g.grader_type = 'ai' then 'rubric_ai'
           when g.grader_type = 'mentor' then 'mentor_sample'
           when g.grader_type = 'deterministic' and a.kind = 'sql' then 'executable'
           when g.grader_type = 'deterministic' then 'detectable'
           else 'peer'
         end
    into v_user, v_enrol, v_total, v_verification
  from public.submissions s
  join public.enrollments e on e.id = s.enrollment_id
  join public.assignments a on a.id = s.assignment_id
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

  insert into public.point_events (user_id, ledger, source_type, source_id, points, verification)
  values (v_user, 'proof', 'artifact', p_submission_id, round(v_total)::int, v_verification)
  on conflict (user_id, source_type, source_id) do nothing;

  return jsonb_build_object('awarded', round(v_total)::int, 'verification', v_verification);
end;
$$;

revoke execute on function public.award_artifact_points(uuid) from public, anon, authenticated;

-- ── reading the attribution ──────────────────────────────────────────────────

-- The owner's own view of it: RLS on point_events already scopes this to
-- auth.uid(), and security_invoker keeps it that way.
create or replace view public.verification_breakdown
with (security_invoker = true) as
select user_id, ledger, verification, sum(points)::int as points
from public.point_events
where voided_at is null
group by user_id, ledger, verification;

comment on view public.verification_breakdown is
  'Per-archetype point totals. Through RLS this shows a student their own; the public see a published profile''s via public_point_verification().';

-- The public's view of it: only for profiles their owner published, only
-- proof points, only the totals. This is the auditable half of the
-- credential — how much of the score a machine stands behind.
create or replace function public.public_point_verification(p_slug text)
returns table (verification text, points int)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select pe.verification, sum(pe.points)::int
  from public.public_profiles pp
  join public.enrollments e on e.id = pp.enrollment_id
  join public.point_events pe on pe.user_id = e.user_id
  where pp.slug = p_slug
    and pp.visibility = 'public'
    and pe.ledger = 'proof'
    and pe.voided_at is null
  group by pe.verification
  order by sum(pe.points) desc;
$$;

comment on function public.public_point_verification is
  'The verification breakdown a recruiter sees on /p/[slug]: proof points per archetype, for published profiles only.';

grant execute on function public.public_point_verification(text) to anon, authenticated;
