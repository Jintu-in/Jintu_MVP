-- V3: review-to-unlock — async peer review without a cohort forcing it.
--
-- The mechanism, from V3.md: your submission enters the review queue only
-- after you have reviewed others. You need the queue, so you feed the
-- queue. Three pieces:
--
--   review_debt()        how many reviews someone still owes. The first
--                        submission is free — a brand-new learner cannot
--                        owe reviews before anyone's work existed for them
--                        to review — and every submission after it costs
--                        two, which is the same 2:1 ratio the cohort model
--                        enforced by allocation.
--   claim_review()       a reviewer PICKS UP work instead of being handed
--                        it: the oldest claimable submission on a track
--                        they are enrolled in, never their own, never one
--                        they already hold, and never one whose author has
--                        not fed the queue. SKIP LOCKED, so two people
--                        claiming at once get two different submissions.
--   suspected_reciprocal_reviews
--                        collusion surface for ops. Without a cohort
--                        assigning reviewers, two accounts trading
--                        favourable reviews is the obvious attack; a HUMAN
--                        decides, because a genuine study pair looks the
--                        same from here. Ops-only: the view itself is the
--                        cross-user data it exists to inspect.
--
-- The existing allocate_peer_reviews() (cohort-era, assigns two reviewers
-- at grading time) keeps running unchanged: it fills queues in the cold
-- start this claim flow would deadlock in, and both paths write the same
-- peer_reviews rows under the same unique constraint.

-- ─────────────────────────────────────────────────────────────────────────────
-- how many reviews someone still owes
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.review_debt(p_user uuid default null)
returns integer
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select greatest(0,
    -- Two owed per first-attempt submission after the first…
    2 * greatest(0, (
      select count(*)::int - 1
      from public.submissions s
      join public.enrollments e on e.id = s.enrollment_id
      where e.user_id = coalesce(p_user, (select auth.uid()))
    ))
    -- …minus reviews actually delivered.
    - (
      select count(*)::int
      from public.peer_reviews pr
      join public.enrollments e on e.id = pr.reviewer_enrollment_id
      where e.user_id = coalesce(p_user, (select auth.uid()))
        and pr.status = 'submitted'
    )
  )
$$;

comment on function public.review_debt is
  'Reviews owed: two per submission after the first, minus reviews delivered. The first submission is free — nobody owes reviews before there was work to review.';

grant execute on function public.review_debt(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- claiming a review
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.claim_review()
returns uuid
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user       uuid := (select auth.uid());
  v_enrolment  uuid;
  v_submission uuid;
  v_review     uuid;
begin
  if v_user is null then
    raise exception 'Sign in to review' using errcode = '28000';
  end if;
  if not exists (select 1 from public.profiles where id = v_user) then
    raise exception 'Finish signing up first' using errcode = 'P0002';
  end if;

  -- The claimable pool: submitted work on tracks the caller is actively on,
  -- not their own, not already held by them, still short of two reviewers,
  -- and whose author has fed the queue. Oldest first — the person waiting
  -- longest is served first. SKIP LOCKED turns a double-claim race into two
  -- different claims instead of one error.
  select s.id, my.id into v_submission, v_enrolment
  from public.submissions s
  join public.enrollments author_e on author_e.id = s.enrollment_id
  join public.cohorts c on c.id = author_e.cohort_id
  join public.enrollments my
    on my.user_id = v_user
   and my.status = 'active'
   and my.cohort_id in (
     select c2.id from public.cohorts c2 where c2.path_id = c.path_id
   )
  where s.status in ('graded', 'needs_review')
    and author_e.user_id <> v_user
    and not exists (
      select 1 from public.peer_reviews held
      where held.submission_id = s.id and held.reviewer_enrollment_id = my.id
    )
    and (
      select count(*) from public.peer_reviews pr
      where pr.submission_id = s.id and pr.status <> 'skipped'
    ) < 2
    -- Review-to-unlock, applied where it bites — PER SUBMISSION. Each
    -- submission enters the pool once the author has delivered two reviews
    -- for every submission of theirs that came before it: the first is
    -- free (nobody owes reviews before work existed to review), the second
    -- waits for two, the third for four. A submission that has entered
    -- never leaves — the gate is an entry condition, not a hostage
    -- situation. Their work is stored and machine-graded either way; what
    -- waits is the human attention.
    and 2 * (
      select count(*) from public.submissions prior
      join public.enrollments pe on pe.id = prior.enrollment_id
      where pe.user_id = author_e.user_id
        and prior.submitted_at < s.submitted_at
    ) <= (
      select count(*) from public.peer_reviews delivered
      join public.enrollments de on de.id = delivered.reviewer_enrollment_id
      where de.user_id = author_e.user_id
        and delivered.status = 'submitted'
    )
  order by s.submitted_at asc
  limit 1
  for update of s skip locked;

  if v_submission is null then
    raise exception 'Nothing is waiting for review right now. Check back after the next submissions land.'
      using errcode = 'P0001';
  end if;

  insert into public.peer_reviews (submission_id, reviewer_enrollment_id, status, due_at)
  values (v_submission, v_enrolment, 'pending', now() + interval '3 days')
  returning id into v_review;

  return v_review;
end;
$$;

comment on function public.claim_review is
  'Async peer review: pick up the oldest claimable submission. 28000 = sign in, P0002 = onboard, P0001 = queue empty. Authors who owe reviews are not in the pool.';

grant execute on function public.claim_review() to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- reciprocal-review detection — ops only
-- ─────────────────────────────────────────────────────────────────────────────

create or replace view public.suspected_reciprocal_reviews as
with pairs as (
  select re.user_id as reviewer, ae.user_id as author, count(*) as n
  from public.peer_reviews pr
  join public.enrollments re on re.id = pr.reviewer_enrollment_id
  join public.submissions s on s.id = pr.submission_id
  join public.enrollments ae on ae.id = s.enrollment_id
  where pr.status = 'submitted'
  group by 1, 2
)
select p1.reviewer as a, p1.author as b,
       p1.n as a_reviewed_b, p2.n as b_reviewed_a,
       least(p1.n, p2.n) as mutual_depth
from pairs p1
join pairs p2 on p1.reviewer = p2.author and p1.author = p2.reviewer
where p1.reviewer < p1.author and least(p1.n, p2.n) >= 3;

comment on view public.suspected_reciprocal_reviews is
  'Pairs who have reviewed each other three or more times each. A human decides — a genuine study pair looks identical from here. Ops only.';

-- The view is cross-user by nature; no client may read it.
revoke all on public.suspected_reciprocal_reviews from public, anon, authenticated;
