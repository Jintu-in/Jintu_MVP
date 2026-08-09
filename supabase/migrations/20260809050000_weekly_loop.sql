-- The weekly loop: allocation, peer grades, readiness, rollover.
-- ARCHITECTURE.md §4 and §6 Phase 1.
--
-- 20260809030000_sprint_loop.sql created the tables the loop writes to and
-- said, in as many words, that nothing populates `peer_reviews` yet. This is
-- the file that closes that gap. Everything here is a database function
-- rather than application code for one reason: each of these operations reads
-- rows belonging to several students at once, which is precisely what RLS is
-- there to prevent. Doing it in the app would mean handing the app a
-- service-role key and a loop over other people's work. Doing it here means
-- the privileged step is a named function with a fixed shape, callable by
-- nothing that a browser can reach.
--
-- Every function below is `security definer` with an empty `search_path`, and
-- every one of them has EXECUTE revoked from `public`. A security-definer
-- function that anon can call is a policy with a hole in it.

-- ─────────────────────────────────────────────────────────────────────────────
-- Answer keys
-- ─────────────────────────────────────────────────────────────────────────────
-- What the SQL grader needs to grade: a fixture to run the query against and
-- the result the reference query produces.
--
-- This is a separate table rather than more keys in `assignments.spec` for one
-- reason: `assignments` is anon-readable. It has to be — the prompt and the
-- rubric are the free curriculum, and /learn renders them for a crawler. An
-- expected result set stored there would be the answer, published, next to the
-- question.
--
-- So the answer key gets RLS with no policy at all. That denies everyone;
-- the service role bypasses RLS and is the only thing that reads it. The
-- pattern and the `service-role only` marker in the comment are the same ones
-- `ai_usage` and `audit_log` use, and the RLS guard in
-- scripts/simulate-migrations.mjs reads that marker.
create table public.assignment_answer_keys (
  assignment_id uuid primary key references public.assignments (id) on delete cascade,
  -- DDL and rows, applied to an empty database before the student's query.
  -- Authored input, so it runs with full rights; it has to, it creates tables.
  setup         text not null,
  -- The query that produced `expected`. Stored so that CI can re-run it and
  -- fail if the two ever disagree — an expected result no query can produce
  -- marks every correct submission wrong, and does it silently.
  reference_sql text not null,
  expected      jsonb not null,
  order_matters boolean not null default false,
  constraint answer_keys_expected_shape
    check (jsonb_typeof(expected -> 'columns') = 'array'
       and jsonb_typeof(expected -> 'rows') = 'array')
);

alter table public.assignment_answer_keys enable row level security;

comment on table public.assignment_answer_keys is
  'The SQL grader''s fixture and expected result. service-role only: this table is the answer, and `assignments` next to it is public.';

-- Published curriculum is immutable, and since this table now decides what a
-- submission scores, it is part of the curriculum. Without this the answer key
-- is the one way left to change what a cohort is graded against mid-sprint.
create or replace function public.reject_published_answer_key_change()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
declare
  target_assignment uuid;
  parent_status     text;
begin
  if tg_op = 'DELETE' then
    target_assignment := old.assignment_id;
  else
    target_assignment := new.assignment_id;
  end if;

  select p.status into parent_status
  from public.assignments a
  join public.modules m on m.id = a.module_id
  join public.paths p on p.id = m.path_id
  where a.id = target_assignment;

  if parent_status is distinct from 'published' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  raise exception
    'Cannot change the answer key of a published assignment. Create a new path version instead.'
    using errcode = 'restrict_violation';
end;
$$;

create trigger answer_keys_frozen_when_published
  before insert or update or delete on public.assignment_answer_keys
  for each row execute function public.reject_published_answer_key_change();

-- ─────────────────────────────────────────────────────────────────────────────
-- What a reviewer may write, and what they may not
-- ─────────────────────────────────────────────────────────────────────────────

-- Numbers without words are not review. Week 4 onwards the peer comment is
-- the only prose a student gets before the AI scorer exists (Phase 2), and
-- even after it exists it is the only feedback written by someone who had to
-- do the same assignment.
alter table public.peer_reviews add column feedback text;

-- The update policy from 20260809030000 checks WHO is writing the row. It
-- cannot check WHAT they are writing, because a policy sees the whole row and
-- not the columns that changed. So a reviewer could satisfy that policy while
-- pushing their own `due_at` a week out, or re-pointing `submission_id` at
-- another submission and scoring it. Column-level grants would express this,
-- but PostgREST issues UPDATE against the columns in the request body, so a
-- grant-based rule surfaces to the student as a bare permission error with no
-- indication of which field was the problem.
create or replace function public.freeze_peer_review_assignment()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  if new.submission_id is distinct from old.submission_id
     or new.reviewer_enrollment_id is distinct from old.reviewer_enrollment_id
     or new.due_at is distinct from old.due_at
  then
    raise exception
      'A peer review assignment cannot be re-pointed or rescheduled. Only scores, feedback and status may change.'
      using errcode = 'restrict_violation';
  end if;

  -- A submitted review is final for the same reason a submission is: the
  -- author has already read it, and a score that can be revised after the
  -- fact is not evidence of anything.
  if old.status = 'submitted' and new.status = 'submitted' then
    raise exception 'This review has already been submitted.'
      using errcode = 'restrict_violation';
  end if;

  return new;
end;
$$;

create trigger peer_reviews_assignment_is_fixed
  before update on public.peer_reviews
  for each row execute function public.freeze_peer_review_assignment();

-- ─────────────────────────────────────────────────────────────────────────────
-- The reviewer's window onto the work
-- ─────────────────────────────────────────────────────────────────────────────
-- `peer_review_queue` was created with `security_invoker = true`, which meant
-- it read `submissions` as the caller — and the only select policy on
-- `submissions` is "authors read their own". A reviewer therefore saw an
-- empty queue. The obvious fix is the policy in ARCHITECTURE.md §3 that lets
-- an assigned reviewer select the submission row, and it is the wrong one:
-- that row carries `enrollment_id`, so granting it hands every reviewer a
-- join back to the author. Anonymity would then rest on the UI not selecting
-- a column.
--
-- Instead the view stops being invoker-rights and carries its own predicate.
-- The reviewer has no route to `submissions` at all — the only way to reach
-- another student's work is through a view that has no column naming them.
create or replace view public.peer_review_queue
  with (security_invoker = false)
  as select
       pr.id            as peer_review_id,
       pr.due_at,
       pr.status,
       s.id             as submission_id,
       s.week_no,
       s.payload,
       s.assignment_id
     from public.peer_reviews pr
     join public.submissions s on s.id = pr.submission_id
     where pr.reviewer_enrollment_id in (
       select e.id from public.enrollments e where e.user_id = (select auth.uid())
     );

comment on view public.peer_review_queue is
  'What a peer reviewer may see. Omits every column that identifies the author, and is definer-rights so that reviewers need no policy on `submissions` at all.';

-- ─────────────────────────────────────────────────────────────────────────────
-- Allocation
-- ─────────────────────────────────────────────────────────────────────────────
-- Two reviewers per submission (§6, Phase 1), drawn only from students who
-- submitted the same assignment in the same cohort.
--
-- "Who submitted it too" is the load-bearing constraint. Allocating to anyone
-- enrolled would hand week 3's work to someone who never attempted it, and
-- their review would be worth nothing to the author and nothing to the
-- readiness score. It also makes the incentive honest: you get read because
-- you did the work.
--
-- The allocation is a ring. Order the cohort's submissions for this
-- assignment by id — a uuid, so the order is stable but not the order they
-- arrived in, which stops the same two people reviewing each other every week
-- — and give submission i the authors of submissions i+1 … i+n as reviewers.
-- A ring gives every student exactly the same number of reviews to do as they
-- receive, which no random draw guarantees.
create or replace function public.allocate_peer_reviews(
  p_assignment_id uuid,
  p_reviewers     int      default 2,
  p_window        interval default interval '3 days'
)
  returns int
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  allocated int;
  kind      text;
begin
  if p_reviewers < 1 then
    raise exception 'A submission needs at least one reviewer.';
  end if;

  -- `file` and `recording` submissions are objects in a private bucket, and
  -- the reviewer cannot be given a path to one without being given the
  -- author's uid — see the note at the foot of this file. Allocating them
  -- anyway would put a task in someone's queue that they cannot complete and
  -- then count it against their readiness for not completing it.
  select a.kind into kind from public.assignments a where a.id = p_assignment_id;
  if kind is null or kind not in ('sql', 'artifact_link') then
    return 0;
  end if;

  with ring as (
    select
      s.id            as submission_id,
      s.enrollment_id,
      e.cohort_id,
      row_number() over (partition by e.cohort_id order by s.id) - 1 as pos,
      count(*)        over (partition by e.cohort_id)                as n
    from public.submissions s
    join public.enrollments e on e.id = s.enrollment_id
    where s.assignment_id = p_assignment_id
      and e.status = 'active'
  ),
  pairs as (
    select
      author.submission_id,
      reviewer.enrollment_id as reviewer_enrollment_id
    from ring author
    -- offset 1 … p_reviewers, capped at n-1 so that a cohort of two allocates
    -- one review each instead of asking a student to review themselves twice.
    cross join lateral generate_series(1, least(p_reviewers, author.n - 1)) as k
    join ring reviewer
      on reviewer.cohort_id = author.cohort_id
     and reviewer.pos = (author.pos + k) % author.n
  )
  insert into public.peer_reviews (submission_id, reviewer_enrollment_id, due_at)
  select submission_id, reviewer_enrollment_id, now() + p_window
  from pairs
  -- Idempotent: re-running after five more students submit tops up the ring
  -- without disturbing reviews already assigned or already written.
  on conflict (submission_id, reviewer_enrollment_id) do nothing;

  get diagnostics allocated = row_count;
  return allocated;
end;
$$;

comment on function public.allocate_peer_reviews(uuid, int, interval) is
  'Assigns peer reviewers for one assignment, ring-wise within each cohort. Idempotent.';

revoke execute on function public.allocate_peer_reviews(uuid, int, interval) from public;

-- ─────────────────────────────────────────────────────────────────────────────
-- A submitted peer review becomes a grade
-- ─────────────────────────────────────────────────────────────────────────────
-- `gradings` is where a student reads their marks, and it has no reviewer
-- column — which is what keeps peer feedback anonymous in the direction that
-- matters. The reviewer never learns whose work they read; the author never
-- learns who read theirs.
--
-- The total is summed from the scores object rather than sent by the client.
-- A reviewer's browser is not a trustworthy adding machine, and the same
-- number reaching the database twice by two routes is one of them being
-- wrong eventually.
create or replace function public.record_peer_grade()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  peer_total numeric;
begin
  if new.status <> 'submitted' or old.status = 'submitted' then
    return new;
  end if;

  if new.scores is null or jsonb_typeof(new.scores) <> 'object' then
    raise exception 'A submitted peer review must carry a scores object.'
      using errcode = 'restrict_violation';
  end if;

  select coalesce(sum((value)::numeric), 0)
    into peer_total
  from jsonb_each_text(new.scores)
  where value ~ '^-?\d+(\.\d+)?$';

  insert into public.gradings (submission_id, grader_type, scores, total, feedback)
  values (new.submission_id, 'peer', new.scores, peer_total, new.feedback);

  return new;
end;
$$;

create trigger peer_reviews_record_grade
  after update on public.peer_reviews
  for each row execute function public.record_peer_grade();

-- ─────────────────────────────────────────────────────────────────────────────
-- Readiness
-- ─────────────────────────────────────────────────────────────────────────────
-- The number on the public profile. It is a claim about a person's work, so
-- what goes into it is written down here and nowhere else:
--
--   submitted (40)  — did the work exist, out of every assignment on the path
--   attainment (40) — what the deterministic and AI graders scored it, as a
--                     fraction of the rubric maximum for what was submitted
--   review (20)     — peer reviews written, out of peer reviews assigned
--
-- Peer *scores received* are deliberately not in the total. They are a
-- classmate's opinion, they are gameable by a friendly pair, and a readiness
-- number that moves when someone else is generous is not readiness. The peer
-- comments are shown to the author; only the reviewing is scored.
--
-- Attainment is over what was submitted, not over the whole path, so it does
-- not double-count the submission rate. Someone who submitted two of six
-- assignments and aced both reads as 13 + 40 + review — high attainment, low
-- coverage — which is the true statement about them.
create or replace function public.compute_readiness(p_enrollment_id uuid)
  returns numeric
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  total_assignments int;
  submitted_count   int;
  earned            numeric;
  available         numeric;
  reviews_assigned  int;
  reviews_written   int;
  submitted_pct     numeric;
  attainment_pct    numeric;
  review_pct        numeric;
  overall           numeric;
begin
  select count(*)
    into total_assignments
  from public.assignments a
  join public.modules m on m.id = a.module_id
  join public.cohorts c on c.path_id = m.path_id
  join public.enrollments e on e.cohort_id = c.id
  where e.id = p_enrollment_id;

  if total_assignments = 0 then
    raise exception 'Enrolment % is not attached to a path with assignments.', p_enrollment_id;
  end if;

  select count(*) into submitted_count
  from public.submissions s where s.enrollment_id = p_enrollment_id;

  -- Only machine grades count towards attainment. Peer rows in `gradings`
  -- are excluded here for the reason given above.
  --
  -- The grades are aggregated in a lateral subquery rather than joined
  -- directly: a submission that has been regraded has two rows in `gradings`,
  -- and a plain join would then count its rubric's max_score twice, quietly
  -- halving the attainment of the one student whose work someone looked at
  -- again.
  select
    coalesce(sum(coalesce(g.total, 0)), 0),
    coalesce(sum(coalesce(r.max_score, 0)), 0)
  into earned, available
  from public.submissions s
  join public.assignments a on a.id = s.assignment_id
  left join public.rubrics r on r.id = a.rubric_id
  left join lateral (
    select sum(gr.total) as total
    from public.gradings gr
    where gr.submission_id = s.id
      and gr.grader_type in ('deterministic', 'ai')
  ) g on true
  where s.enrollment_id = p_enrollment_id;

  select
    count(*),
    count(*) filter (where pr.status = 'submitted')
  into reviews_assigned, reviews_written
  from public.peer_reviews pr
  where pr.reviewer_enrollment_id = p_enrollment_id;

  submitted_pct  := 100.0 * submitted_count / total_assignments;
  attainment_pct := case when available > 0 then least(100.0, 100.0 * earned / available) else 0 end;
  -- No reviews assigned yet is not a failure to review. Week 1 would
  -- otherwise cap everyone at 80 for a queue that does not exist.
  review_pct     := case when reviews_assigned > 0
                         then 100.0 * reviews_written / reviews_assigned
                         else 100.0 end;

  overall := round(0.40 * submitted_pct + 0.40 * attainment_pct + 0.20 * review_pct, 1);
  overall := greatest(0, least(100, overall));

  insert into public.readiness_scores (enrollment_id, computed_at, overall, breakdown)
  values (
    p_enrollment_id,
    -- clock_timestamp(), not now(): now() is the transaction timestamp, so
    -- rolling a whole cohort in one transaction would collide on
    -- unique (enrollment_id, computed_at) the moment anything recomputed.
    clock_timestamp(),
    overall,
    jsonb_build_object(
      'submitted',  jsonb_build_object('weight', 40, 'pct', round(submitted_pct, 1),
                                       'done', submitted_count, 'of', total_assignments),
      'attainment', jsonb_build_object('weight', 40, 'pct', round(attainment_pct, 1),
                                       'earned', earned, 'of', available),
      'review',     jsonb_build_object('weight', 20, 'pct', round(review_pct, 1),
                                       'written', reviews_written, 'of', reviews_assigned)
    )
  );

  return overall;
end;
$$;

comment on function public.compute_readiness(uuid) is
  'Recomputes and records one enrolment''s readiness score. Weights are documented in the function body — change them there, not in the app.';

revoke execute on function public.compute_readiness(uuid) from public;

create or replace function public.compute_cohort_readiness(p_cohort_id uuid)
  returns int
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  enrolment record;
  done int := 0;
begin
  for enrolment in
    select e.id from public.enrollments e
    where e.cohort_id = p_cohort_id and e.status in ('active', 'completed')
  loop
    perform public.compute_readiness(enrolment.id);
    done := done + 1;
  end loop;
  return done;
end;
$$;

revoke execute on function public.compute_cohort_readiness(uuid) from public;

-- ─────────────────────────────────────────────────────────────────────────────
-- Rollover
-- ─────────────────────────────────────────────────────────────────────────────
-- Cohort status is a function of the calendar, and until this existed it was
-- a function of somebody remembering. A cohort left on 'open' after it starts
-- keeps selling places in a sprint that is already in week 3; one left on
-- 'running' after it ends keeps its students' dashboards live and never marks
-- anyone completed.
--
-- Phase 2 puts this on pg_cron (§6). Until then it is callable by hand and by
-- the ops CLI, which is why it reports what it changed rather than returning
-- void — a rollover you cannot see the result of is one nobody trusts enough
-- to run.
create or replace function public.roll_cohorts()
  returns table (cohort_id uuid, from_status text, to_status text)
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  return query
  with finished as (
    update public.cohorts c
       set status = 'finished'
     where c.status = 'running' and c.ends_on < current_date
    returning c.id, 'running'::text as was, 'finished'::text as now
  ),
  started as (
    update public.cohorts c
       set status = 'running'
     where c.status = 'open' and c.starts_on <= current_date
    returning c.id, 'open'::text as was, 'running'::text as now
  ),
  -- Enrolment closes two weeks out. Anything still 'planned' inside that
  -- window is a cohort nobody opened, and opening it late sells a place in a
  -- sprint the student has already missed the start of.
  opened as (
    update public.cohorts c
       set status = 'open'
     where c.status = 'planned'
       and c.starts_on - interval '14 days' <= current_date
       and c.starts_on > current_date
    returning c.id, 'planned'::text as was, 'open'::text as now
  ),
  -- Only enrolments in a cohort that just finished. `completed` is a claim
  -- that someone reached the end of a sprint, and it is read later by the
  -- public profile — so it is set exactly once, by the calendar, and never by
  -- a student action.
  completed as (
    update public.enrollments e
       set status = 'completed', completed_at = now()
     where e.status = 'active'
       and e.cohort_id in (select id from finished)
    returning e.id
  )
  select f.id, f.was, f.now from finished f
  union all
  select s.id, s.was, s.now from started s
  union all
  select o.id, o.was, o.now from opened o
  union all
  -- Forces the `completed` CTE to run. A data-modifying CTE that nothing
  -- reads from is still executed by Postgres, but relying on that is relying
  -- on a detail of the executor; counting it into the result is not.
  select null::uuid, 'enrolments'::text, count(*)::text from completed
  having count(*) > 0;
end;
$$;

comment on function public.roll_cohorts() is
  'Advances cohort status by the calendar and completes enrolments of finished cohorts. Idempotent; safe to run every day.';

revoke execute on function public.roll_cohorts() from public;

-- ─────────────────────────────────────────────────────────────────────────────
-- Still deliberately absent
-- ─────────────────────────────────────────────────────────────────────────────
-- A reviewer read policy on the `submissions` storage bucket. 20260809040000
-- said it would arrive "with the allocation logic", and now that the
-- allocation logic is here the reason it still cannot is clear: the object
-- key is `<author_uid>/<assignment_id>/<filename>`. Any policy that lets a
-- reviewer read the object requires the reviewer to know the path, and the
-- path names the author. Peer review of a file therefore needs the server to
-- mint a signed URL with the service role and hand back only the URL — the
-- work is a Phase 2 item alongside the file upload UI, and until then peer
-- review covers the two kinds that submit as text.
