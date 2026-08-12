-- 0004_work.sql
-- Enrollments, submissions, gradings, rep submissions, peer review.
--
-- No cohorts. A learner starts a track whenever they want; accountability
-- comes from streaks, self-set targets, and review-to-unlock rather than a
-- fixed start date.
--
-- The peer review policy here is the one to read carefully: reviewers can see
-- the submission and never the author. If reviewers see names they grade their
-- friends generously, and the entire rubric dataset becomes noise — which
-- means the moat becomes noise.

create table enrollments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles on delete cascade,
  track_id      uuid not null references tracks on delete cascade,
  -- The learner's own commitment, shown on their public profile. Weaker than a
  -- cohort deadline, considerably better than nothing.
  target_date   date,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  abandoned_at  timestamptz,
  unique (user_id, track_id)
);
create index on enrollments (user_id, started_at desc);
create index on enrollments (track_id) where completed_at is not null;

create table submissions (
  id             uuid primary key default gen_random_uuid(),
  enrollment_id  uuid not null references enrollments on delete cascade,
  assignment_id  uuid not null references assignments on delete cascade,
  attempt        smallint not null default 1 check (attempt > 0),
  payload        jsonb not null default '{}'::jsonb,
  -- Facts gathered by impure adapters before grading: sqlResults, mediaProbe,
  -- httpProbe, parsedCells, cellFormulas, parsedTable, priorSubmissions.
  facts          jsonb not null default '{}'::jsonb,
  status         submission_status not null default 'submitted',
  submitted_at   timestamptz not null default now(),
  unique (enrollment_id, assignment_id, attempt)
);
create index on submissions (assignment_id, submitted_at desc);
create index on submissions (status) where status in ('submitted','grading','needs_human');

-- Latest attempt per assignment, which is what the UI and the profile use.
create unique index submissions_latest
  on submissions (enrollment_id, assignment_id, attempt desc);

create table gradings (
  id               uuid primary key default gen_random_uuid(),
  submission_id    uuid not null references submissions on delete cascade,
  rubric_id        uuid not null references rubrics on delete restrict,
  score            numeric(6,2) not null default 0,
  max_score        numeric(6,2) not null,
  -- Points from executable/detectable/structural only. THIS is the number that
  -- may appear on a public profile; `score` includes AI and peer and is for
  -- the learner's own progress view.
  evidenced_score  numeric(6,2) not null default 0,
  passed           boolean not null default false,
  fully_verified   boolean not null default false,
  cost_paise       integer not null default 0 check (cost_paise >= 0),
  -- Per-criterion CheckResult array straight from the grading package.
  results          jsonb not null default '[]'::jsonb,
  pending_human    text[] not null default '{}',
  graded_at        timestamptz not null default now(),

  constraint evidenced_within_score check (evidenced_score <= score),
  constraint score_within_max check (score <= max_score)
);
create index on gradings (submission_id, graded_at desc);

create table rep_submissions (
  id             uuid primary key default gen_random_uuid(),
  enrollment_id  uuid not null references enrollments on delete cascade,
  rep_id         uuid not null references reps on delete cascade,
  payload        jsonb not null default '{}'::jsonb,
  facts          jsonb not null default '{}'::jsonb,
  passed         boolean not null default false,
  -- Date-stamped, not backfillable. A rep submitted Thursday cannot claim
  -- Tuesday, which is what stops streaks being reconstructed after the fact.
  submitted_on   date not null default current_date,
  submitted_at   timestamptz not null default now(),
  unique (enrollment_id, rep_id)
);
create index on rep_submissions (enrollment_id, submitted_on desc);

-- ---------------------------------------------------------------------------
-- Peer review: async, anonymous, review-to-unlock.
-- ---------------------------------------------------------------------------
create table peer_reviews (
  id                 uuid primary key default gen_random_uuid(),
  submission_id      uuid not null references submissions on delete cascade,
  reviewer_id        uuid not null references profiles on delete cascade,
  scores             jsonb not null default '{}'::jsonb,
  did_well           text,
  to_improve         text,
  status             review_status not null default 'assigned',
  assigned_at        timestamptz not null default now(),
  submitted_at       timestamptz,
  -- Set when a spot-audit finds the review was low-effort. The reviewer's own
  -- consistency points for it are voided too.
  voided_at          timestamptz,
  voided_reason      text,
  unique (submission_id, reviewer_id)
);
create index on peer_reviews (reviewer_id, status);
create index on peer_reviews (submission_id) where status = 'submitted';

-- Nobody reviews their own work.
create or replace function assert_reviewer_not_author()
returns trigger language plpgsql as $$
declare author uuid;
begin
  select e.user_id into author
  from submissions s join enrollments e on e.id = s.enrollment_id
  where s.id = new.submission_id;
  if author = new.reviewer_id then
    raise exception 'a learner cannot review their own submission';
  end if;
  return new;
end $$;
create trigger peer_reviews_not_self before insert on peer_reviews
  for each row execute function assert_reviewer_not_author();

-- Reciprocal-review detection. Without a cohort assigning reviewers,
-- two accounts trading favourable reviews is the obvious attack. This view
-- surfaces pairs who have reviewed each other more than twice; a human
-- decides, because a genuine study pair looks the same from here.
create or replace view suspected_reciprocal_reviews as
with pairs as (
  select pr.reviewer_id as a, e.user_id as b, count(*) as n
  from peer_reviews pr
  join submissions s on s.id = pr.submission_id
  join enrollments e on e.id = s.enrollment_id
  where pr.status = 'submitted' and pr.voided_at is null
  group by 1, 2
)
select p1.a, p1.b, p1.n as a_reviewed_b, p2.n as b_reviewed_a,
       least(p1.n, p2.n) as mutual_depth
from pairs p1
join pairs p2 on p1.a = p2.b and p1.b = p2.a
where p1.a < p1.b and least(p1.n, p2.n) >= 3;

-- Review-to-unlock: a submission enters the queue only once its author has
-- completed two reviews. This is how async peer review actually happens
-- without a cohort forcing it — you need the queue, so you feed the queue.
create or replace function reviews_completed_by(target_user uuid)
returns integer language sql stable security definer set search_path = public as $$
  select count(*)::int from peer_reviews
  where reviewer_id = target_user and status = 'submitted' and voided_at is null
$$;

create or replace function review_debt(target_user uuid)
returns integer language sql stable security definer set search_path = public as $$
  -- Two reviews owed per artifact submitted, minus reviews delivered.
  select greatest(0,
    (select count(*)::int * 2 from submissions s
       join enrollments e on e.id = s.enrollment_id
      where e.user_id = target_user and s.attempt = 1)
    - reviews_completed_by(target_user)
  )
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table enrollments     enable row level security;
alter table submissions     enable row level security;
alter table gradings        enable row level security;
alter table rep_submissions enable row level security;
alter table peer_reviews    enable row level security;

create policy enrollments_own on enrollments for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy enrollments_staff on enrollments for select
  using (exists (
    select 1 from profiles p where p.id = user_id
      and p.college_id is not null and is_college_staff(p.college_id)));

create policy submissions_own on submissions for all
  using (exists (select 1 from enrollments e
                 where e.id = enrollment_id and e.user_id = (select auth.uid())))
  with check (exists (select 1 from enrollments e
                      where e.id = enrollment_id and e.user_id = (select auth.uid())));

-- A reviewer reads the submission they were assigned. They never learn who
-- wrote it: enrollments is not readable to them, so there is no join back to
-- a profile from here.
create policy submissions_assigned_reviewer on submissions for select
  using (exists (
    select 1 from peer_reviews pr
    where pr.submission_id = id
      and pr.reviewer_id = (select auth.uid())
      and pr.status <> 'voided'));

create policy gradings_own on gradings for select
  using (exists (
    select 1 from submissions s join enrollments e on e.id = s.enrollment_id
    where s.id = submission_id and e.user_id = (select auth.uid())));

create policy reps_own on rep_submissions for all
  using (exists (select 1 from enrollments e
                 where e.id = enrollment_id and e.user_id = (select auth.uid())))
  with check (exists (select 1 from enrollments e
                      where e.id = enrollment_id and e.user_id = (select auth.uid())));

-- Reviewers see and write their own assigned reviews.
create policy peer_reviews_reviewer on peer_reviews for select
  using (reviewer_id = (select auth.uid()));
create policy peer_reviews_reviewer_write on peer_reviews for update
  using (reviewer_id = (select auth.uid()) and status = 'assigned')
  with check (reviewer_id = (select auth.uid()));

-- Authors read the review CONTENT on their own submissions, and the policy
-- returns no reviewer identity because reviewer_id joins to nothing they can read.
create policy peer_reviews_author_reads on peer_reviews for select
  using (exists (
    select 1 from submissions s join enrollments e on e.id = s.enrollment_id
    where s.id = submission_id and e.user_id = (select auth.uid())));

comment on policy submissions_assigned_reviewer on submissions is
  'Reviewers see the work, never the author. Named reviews make peers generous and turn the rubric dataset into noise.';
