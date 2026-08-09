-- The sprint loop and the moat tables. ARCHITECTURE.md §3.
--
-- Cohorts and enrolments, submissions and grading, peer review, readiness,
-- outcomes, and the Law 1 cost ledger.
--
-- Two things in here are load-bearing beyond the feature they serve:
--   * peer reviewers must never learn whose work they are reading
--   * `outcomes` rows are evidence and are never deleted (§3, docs/LEGAL.md §3)

-- ─────────────────────────────────────────────────────────────────────────────
-- cohorts and enrolments
-- ─────────────────────────────────────────────────────────────────────────────

create table public.cohorts (
  id         uuid primary key default gen_random_uuid(),
  path_id    uuid not null references public.paths (id) on delete restrict,
  college_id uuid references public.colleges (id) on delete set null,
  mode       text not null check (mode in ('public', 'campus')),
  starts_on  date not null,
  ends_on    date not null,
  capacity   int not null check (capacity > 0),
  status     text not null default 'planned'
             check (status in ('planned', 'open', 'running', 'finished', 'cancelled')),
  created_at timestamptz not null default now(),
  constraint cohorts_ends_after_start check (ends_on > starts_on),
  -- A campus cohort without a college is a data-entry error that would later
  -- send a TPO report to nobody.
  constraint cohorts_campus_has_college
    check (mode <> 'campus' or college_id is not null)
);

alter table public.cohorts enable row level security;

create policy "open cohorts are visible"
  on public.cohorts for select
  to anon, authenticated
  using (status in ('open', 'running'));

create table public.enrollments (
  id           uuid primary key default gen_random_uuid(),
  cohort_id    uuid not null references public.cohorts (id) on delete restrict,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  status       text not null default 'active'
               check (status in ('active', 'withdrawn', 'completed')),
  joined_at    timestamptz not null default now(),
  completed_at timestamptz,
  unique (cohort_id, user_id)
);

create index enrollments_user_id_idx on public.enrollments (user_id);

alter table public.enrollments enable row level security;

create policy "users read their own enrolments"
  on public.enrollments for select
  to authenticated
  using (user_id = (select auth.uid()));

-- ─────────────────────────────────────────────────────────────────────────────
-- submissions and grading
-- ─────────────────────────────────────────────────────────────────────────────

create table public.submissions (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  assignment_id uuid not null references public.assignments (id) on delete restrict,
  week_no       int not null check (week_no >= 1),
  payload       jsonb not null,
  submitted_at  timestamptz not null default now(),
  status        text not null default 'submitted'
                check (status in ('submitted', 'grading', 'graded', 'needs_review')),
  unique (enrollment_id, assignment_id)
);

create index submissions_enrollment_idx on public.submissions (enrollment_id);

alter table public.submissions enable row level security;

create policy "authors read their own submissions"
  on public.submissions for select
  to authenticated
  using (
    enrollment_id in (
      select id from public.enrollments where user_id = (select auth.uid())
    )
  );

create policy "authors create their own submissions"
  on public.submissions for insert
  to authenticated
  with check (
    enrollment_id in (
      select id from public.enrollments where user_id = (select auth.uid())
    )
  );

create table public.gradings (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions (id) on delete cascade,
  grader_type   text not null
                check (grader_type in ('deterministic', 'ai', 'peer', 'mentor')),
  scores        jsonb not null,
  total         numeric not null,
  feedback      text,
  model         text,
  -- Law 1: every AI call is attached to a countable event and priced. A
  -- grading row with grader_type 'ai' and no model is a call we cannot cost.
  cost_paise    int not null default 0 check (cost_paise >= 0),
  created_at    timestamptz not null default now(),
  constraint gradings_ai_names_its_model
    check (grader_type <> 'ai' or model is not null),
  constraint gradings_only_ai_costs
    check (grader_type = 'ai' or cost_paise = 0)
);

create index gradings_submission_idx on public.gradings (submission_id);

alter table public.gradings enable row level security;

create policy "authors read grades on their own work"
  on public.gradings for select
  to authenticated
  using (
    submission_id in (
      select s.id from public.submissions s
      join public.enrollments e on e.id = s.enrollment_id
      where e.user_id = (select auth.uid())
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- peer review
-- ─────────────────────────────────────────────────────────────────────────────

create table public.peer_reviews (
  id                     uuid primary key default gen_random_uuid(),
  submission_id          uuid not null references public.submissions (id) on delete cascade,
  reviewer_enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  scores                 jsonb,
  status                 text not null default 'pending'
                         check (status in ('pending', 'submitted', 'skipped')),
  due_at                 timestamptz not null,
  unique (submission_id, reviewer_enrollment_id)
  -- Self-review is blocked by the trigger below. A CHECK cannot express it:
  -- the author's enrolment lives on `submissions`, and a CHECK constraint may
  -- not read another table.
);

create index peer_reviews_reviewer_idx on public.peer_reviews (reviewer_enrollment_id);

alter table public.peer_reviews enable row level security;

create policy "reviewers see their own assignments"
  on public.peer_reviews for select
  to authenticated
  using (
    reviewer_enrollment_id in (
      select id from public.enrollments where user_id = (select auth.uid())
    )
  );

create policy "reviewers submit their own reviews"
  on public.peer_reviews for update
  to authenticated
  using (
    reviewer_enrollment_id in (
      select id from public.enrollments where user_id = (select auth.uid())
    )
  )
  with check (
    reviewer_enrollment_id in (
      select id from public.enrollments where user_id = (select auth.uid())
    )
  );

-- Reviewers read the work through this view and never through `submissions`.
-- There is deliberately no enrollment_id and no user_id on it: anonymity is a
-- property of the shape of the data the reviewer can reach, not of the UI
-- remembering not to render a name.
create view public.peer_review_queue
  with (security_invoker = true)
  as select
       pr.id            as peer_review_id,
       pr.due_at,
       pr.status,
       s.id             as submission_id,
       s.week_no,
       s.payload,
       s.assignment_id
     from public.peer_reviews pr
     join public.submissions s on s.id = pr.submission_id;

comment on view public.peer_review_queue is
  'What a peer reviewer may see. Omits every column that identifies the author.';

grant select on public.peer_review_queue to authenticated;

-- Blocks self-review at write time. A student assigned their own work would
-- otherwise be able to mark it however they liked.
create or replace function public.reject_self_review()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
declare
  author_enrollment uuid;
begin
  select s.enrollment_id into author_enrollment
  from public.submissions s where s.id = new.submission_id;

  if author_enrollment = new.reviewer_enrollment_id then
    raise exception 'A student cannot be assigned their own submission to review.'
      using errcode = 'restrict_violation';
  end if;

  return new;
end;
$$;

create trigger peer_reviews_no_self_review
  before insert or update on public.peer_reviews
  for each row execute function public.reject_self_review();

-- ─────────────────────────────────────────────────────────────────────────────
-- readiness, outcomes, public profile
-- ─────────────────────────────────────────────────────────────────────────────

create table public.readiness_scores (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  computed_at   timestamptz not null default now(),
  overall       numeric not null check (overall between 0 and 100),
  breakdown     jsonb not null,
  unique (enrollment_id, computed_at)
);

alter table public.readiness_scores enable row level security;

create policy "students read their own readiness"
  on public.readiness_scores for select
  to authenticated
  using (
    enrollment_id in (
      select id from public.enrollments where user_id = (select auth.uid())
    )
  );

-- The anon-readable policy for readiness lives further down, after
-- public_profiles exists — a policy cannot reference a table created later.

-- THE defensible asset. Rows are never deleted: an outcome is the evidence
-- behind any claim we make, and §3 plus docs/LEGAL.md §3.1 both depend on it
-- still being there years later.
create table public.outcomes (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete restrict,
  event         text not null check (event in ('interview_call', 'offer', 'joined')),
  company       text,
  role          text,
  reported_at   timestamptz not null default now(),
  source        text not null
                check (source in ('self_reported', 'tpo_confirmed', 'document_verified')),
  -- Only document_verified rows may ever be published, and only with written
  -- consent on file. This records the second half of that.
  publish_consent_at timestamptz,
  constraint outcomes_publishable_is_verified
    check (publish_consent_at is null or source = 'document_verified')
);

create index outcomes_enrollment_idx on public.outcomes (enrollment_id);

alter table public.outcomes enable row level security;

create policy "students read their own outcomes"
  on public.outcomes for select
  to authenticated
  using (
    enrollment_id in (
      select id from public.enrollments where user_id = (select auth.uid())
    )
  );

create table public.public_profiles (
  slug          text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  enrollment_id uuid not null unique references public.enrollments (id) on delete cascade,
  visibility    text not null default 'private'
                check (visibility in ('private', 'public')),
  published_at  timestamptz,
  headline      text,
  constraint public_profiles_published_has_timestamp
    check (visibility <> 'public' or published_at is not null)
);

alter table public.public_profiles enable row level security;

-- Anon by design: the profile is the shareable artifact. Private is the
-- default, and it only becomes readable once the student turns it on — which
-- the app may only offer after the `public_profile` consent purpose is
-- granted (docs/LEGAL.md §2.2).
create policy "public profiles are readable by anyone"
  on public.public_profiles for select
  to anon, authenticated
  using (visibility = 'public');

create policy "students manage their own profile"
  on public.public_profiles for update
  to authenticated
  using (
    enrollment_id in (
      select id from public.enrollments where user_id = (select auth.uid())
    )
  )
  with check (
    enrollment_id in (
      select id from public.enrollments where user_id = (select auth.uid())
    )
  );

-- A proof-of-readiness profile that nobody can read is not proof. This is the
-- only route by which a readiness score leaves the student's own session, and
-- it is gated on their profile being switched to public — which the app may
-- only offer once the `public_profile` consent purpose is granted.
--
-- Note what is NOT published: the submissions themselves. A score and its
-- breakdown are what the student agreed to show; their actual coursework is
-- not part of that bargain and stays author-only.
create policy "readiness behind a public profile is readable"
  on public.readiness_scores for select
  to anon, authenticated
  using (
    enrollment_id in (
      select enrollment_id from public.public_profiles where visibility = 'public'
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Law 1: the cost ledger
-- ─────────────────────────────────────────────────────────────────────────────

create table public.ai_usage (
  id            uuid primary key default gen_random_uuid(),
  cohort_id     uuid references public.cohorts (id) on delete set null,
  enrollment_id uuid references public.enrollments (id) on delete set null,
  function_name text not null,
  model         text not null,
  input_tokens  int not null check (input_tokens >= 0),
  output_tokens int not null check (output_tokens >= 0),
  cost_paise    int not null check (cost_paise >= 0),
  created_at    timestamptz not null default now()
);

create index ai_usage_cohort_idx on public.ai_usage (cohort_id, created_at desc);

alter table public.ai_usage enable row level security;

comment on table public.ai_usage is
  'Law 1 cost ledger. service-role only: no client ever reads or writes this.';

create table public.budget_guards (
  id            uuid primary key default gen_random_uuid(),
  scope         text not null check (scope in ('cohort', 'global')),
  scope_id      uuid,
  ceiling_paise int not null check (ceiling_paise > 0),
  spent_paise   int not null default 0 check (spent_paise >= 0),
  period_start  timestamptz not null default now(),
  unique (scope, scope_id, period_start)
);

alter table public.budget_guards enable row level security;

comment on table public.budget_guards is
  'Law 1 ceiling. service-role only: a client that could raise this could spend without limit.';

-- ─────────────────────────────────────────────────────────────────────────────
-- ops
-- ─────────────────────────────────────────────────────────────────────────────

create table public.orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete restrict,
  cohort_id         uuid not null references public.cohorts (id) on delete restrict,
  amount_paise      int not null check (amount_paise > 0),
  provider          text not null default 'razorpay',
  provider_order_id text unique,
  status            text not null default 'created'
                    check (status in ('created', 'paid', 'failed', 'refunded')),
  created_at        timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "users read their own orders"
  on public.orders for select
  to authenticated
  using (user_id = (select auth.uid()));

create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  channel    text not null check (channel in ('whatsapp', 'email', 'sms')),
  template   text not null,
  payload    jsonb not null default '{}'::jsonb,
  status     text not null default 'queued'
             check (status in ('queued', 'sent', 'failed', 'suppressed')),
  cost_paise int not null default 0 check (cost_paise >= 0),
  sent_at    timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

comment on table public.notifications is
  'Outbound message log. service-role only: written by edge functions, never by a client.';

create table public.link_health_checks (
  id          uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources (id) on delete cascade,
  checked_at  timestamptz not null default now(),
  status_code int,
  ok          boolean not null
);

create index link_health_resource_idx on public.link_health_checks (resource_id, checked_at desc);

alter table public.link_health_checks enable row level security;

comment on table public.link_health_checks is
  'Crawler results for resource URLs. service-role only.';

create table public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references public.profiles (id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  diff       jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

comment on table public.audit_log is
  'Append-only record of privileged actions. service-role only: a client that could write here could forge it.';
