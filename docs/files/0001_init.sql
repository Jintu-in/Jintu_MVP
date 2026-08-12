-- 0001_init.sql
-- Extensions, enums, and shared helpers.
-- Region note: create the project in ap-south-1 (Mumbai) before running this.

create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "citext";        -- case-insensitive email
create extension if not exists "pg_cron";       -- scheduled jobs
create extension if not exists "pgmq";          -- grading queue
create extension if not exists "pg_net";        -- edge function invocation

-- ---------------------------------------------------------------------------
-- Enums. Kept as enums rather than text+check because these are closed sets
-- referenced by the grading package's TypeScript union types; a mismatch
-- between the two is a bug we want the database to catch.
-- ---------------------------------------------------------------------------

-- Mirrors Archetype in @jintu/grading/types.ts. Keep in sync.
create type archetype as enum (
  'executable',   -- ran it, compared to expected output      | free
  'detectable',   -- matched against a private answer key     | free
  'structural',   -- form and completeness, not quality       | free
  'rubric_ai',    -- a model scored prose                     | COSTS MONEY
  'peer',         -- humans scored it
  'mentor'        -- spot-audit
);

create type track_tier as enum (
  'verified',     -- Jintu-built, >=50% of points machine-checked
  'community',    -- user-built, structural + peer only, never calls a model
  'draft'         -- generated outline, awards zero points
);

create type ledger as enum (
  'consistency',  -- daily reps and completed reviews. Never feeds readiness.
  'proof'         -- graded artifacts only. The credential.
);

create type submission_status as enum (
  'submitted', 'grading', 'graded', 'needs_human', 'withdrawn'
);

create type review_status as enum ('assigned', 'submitted', 'voided');

create type consent_purpose as enum (
  'core_service',      -- required to hold an account at all
  'analytics',
  'nudges',            -- push / email reminders
  'public_profile'     -- publishing artifacts at /p/[handle]
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- Every RLS policy in this schema calls (select auth.uid()) rather than
-- auth.uid() directly. Postgres caches the subquery once per statement instead
-- of re-evaluating per row; on a 600-row batch that is the difference between
-- fast and unusable.
create or replace function current_profile_id()
returns uuid language sql stable as $$
  select (select auth.uid())
$$;

-- Is the caller staff at the given college? Used by TPO-scoped policies.
create or replace function is_college_staff(target_college uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff s
    where s.user_id = (select auth.uid())
      and s.college_id = target_college
      and s.revoked_at is null
  )
$$;

comment on type archetype is
  'Verification mechanism. executable/detectable/structural are free and count as evidenced. rubric_ai is the only paid one.';
comment on type ledger is
  'Two-ledger points model. readiness reads ONLY proof. Consistency can never become proof.';
