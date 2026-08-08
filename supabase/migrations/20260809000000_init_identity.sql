-- Identity and compliance: colleges, profiles, consents.
-- ARCHITECTURE.md §3. Read §0 Law 3 before changing anything in this file.
--
-- Two rules govern every policy below:
--   1. RLS is on for every table, with no exceptions and no "we'll add it
--      later". A table without RLS in Postgres is world-readable to anyone
--      holding the anon key, which ships in the client bundle by design.
--   2. Every policy uses `(select auth.uid())`, never bare `auth.uid()`.
--      The subquery form is evaluated once per statement; the bare call is
--      evaluated once per row. On a 600-student batch that is the difference
--      between fast and unusable.

-- ─────────────────────────────────────────────────────────────────────────────
-- colleges
-- ─────────────────────────────────────────────────────────────────────────────

create table public.colleges (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  city       text not null,
  state      text not null,
  tier       text check (tier in ('tier1', 'tier2', 'tier3')),
  -- TPO contact details are personal data belonging to a named individual,
  -- not public reference data. Kept on this table but never exposed to
  -- students — see the public_colleges view below.
  tpo_name   text,
  tpo_phone  text,
  created_at timestamptz not null default now()
);

comment on table public.colleges is
  'Institutions. Reference data, except the tpo_* columns which are personal data.';

create unique index colleges_name_city_key on public.colleges (lower(name), lower(city));

alter table public.colleges enable row level security;

-- No student-facing policy: students read the public_colleges view instead,
-- which omits the TPO's name and phone number. Staff access arrives with the
-- staff table in the TPO phase.
create policy "colleges are readable by authenticated users"
  on public.colleges for select
  to authenticated
  using (true);

-- The signup form needs a college list before the user has an account, so
-- this view is the only pre-auth surface — and it cannot leak tpo_phone
-- because the column is not in it.
create view public.public_colleges
  with (security_invoker = true)
  as select id, name, city, state, tier from public.colleges;

comment on view public.public_colleges is
  'College list for the signup dropdown. Deliberately omits tpo_name/tpo_phone.';

grant select on public.public_colleges to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────────────────────────────────────

create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  phone              text not null unique,
  full_name          text,
  college_id         uuid references public.colleges (id) on delete set null,
  batch_year         int check (batch_year between 1980 and 2100),
  -- Law 3. DPDP Rule 10 prohibits profiling children outright, and readiness
  -- scoring is profiling. The check makes a minor's profile unrepresentable:
  -- a row cannot exist unless adulthood was affirmed. The `false` default is
  -- the safety net — an insert that forgets the column fails loudly here
  -- rather than quietly creating a profile we are not permitted to hold.
  is_adult_confirmed boolean not null default false
                     constraint profiles_must_be_adult check (is_adult_confirmed),
  created_at         timestamptz not null default now()
);

comment on table public.profiles is
  '1:1 with auth.users. Cannot exist without an affirmative 18+ confirmation (Law 3).';
comment on column public.profiles.is_adult_confirmed is
  'Law 3 hard gate. Constrained to true — see profiles_must_be_adult.';

create index profiles_college_id_idx on public.profiles (college_id);

alter table public.profiles enable row level security;

create policy "users read their own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "users create their own profile"
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

create policy "users update their own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Deliberately no delete policy. DPDP erasure requests are handled by an
-- audited server-side path, not by a client holding the anon key.

-- ─────────────────────────────────────────────────────────────────────────────
-- consents
-- ─────────────────────────────────────────────────────────────────────────────
-- DPDP requires consent to be free, specific, informed, unconditional and
-- unambiguous, with a clear affirmative action — and it must be as easy to
-- withdraw as to give. That is why this is a table and not a boolean on
-- profiles: a boolean cannot record WHICH purpose was agreed to, WHICH notice
-- the user actually saw, or WHEN they took it back.

create table public.consents (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  purpose        text not null check (purpose in (
                   'core_service',      -- required to deliver the sprint
                   'analytics',         -- PostHog
                   'whatsapp_updates',  -- nudges and deadlines
                   'public_profile'     -- publish /p/[slug]
                 )),
  -- Which privacy notice they were shown. Without this, a consent record
  -- proves nothing: you cannot show what the user agreed to.
  notice_version text not null,
  granted_at     timestamptz not null default now(),
  withdrawn_at   timestamptz,
  constraint consents_withdrawn_after_granted
    check (withdrawn_at is null or withdrawn_at >= granted_at)
);

comment on table public.consents is
  'Granular, purpose-specific DPDP consent. Never collapse this into a boolean.';

-- At most one live consent per purpose; withdrawn rows stay as the audit
-- trail. Re-granting inserts a new row rather than resurrecting an old one.
create unique index consents_one_active_per_purpose
  on public.consents (user_id, purpose)
  where withdrawn_at is null;

create index consents_user_id_idx on public.consents (user_id);

alter table public.consents enable row level security;

create policy "users read their own consents"
  on public.consents for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "users grant their own consents"
  on public.consents for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- Withdrawal must be as easy as granting, so users can update their own rows.
-- No delete policy: erasing the record would destroy the evidence that
-- consent was ever given, which is the opposite of what DPDP asks for.
create policy "users withdraw their own consents"
  on public.consents for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
