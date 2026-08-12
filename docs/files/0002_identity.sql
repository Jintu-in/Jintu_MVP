-- 0002_identity.sql
-- Profiles, granular consent, colleges, staff.
--
-- Two constraints here are legal requirements expressed as database rules
-- rather than application checks, because application checks get refactored
-- away at 2am and DPDP penalties reach Rs 200 crore for children's data:
--   1. must_confirm_adult  — no profile can exist without affirmative 18+
--   2. consents is a table — never a bundled boolean on profiles

create table colleges (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  city        text,
  state       text,
  tier        smallint check (tier between 1 and 3),
  created_at  timestamptz not null default now()
);
create index on colleges (lower(name));

create table profiles (
  id                  uuid primary key references auth.users on delete cascade,
  email               citext not null unique,
  -- Optional. Identity is the email; phone is a notification preference only.
  phone_e164          text unique,
  handle              text not null unique,
  full_name           text,
  avatar_url          text,
  college_id          uuid references colleges on delete set null,
  batch_year          smallint,
  is_adult_confirmed  boolean not null default false,
  push_subscription   jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  last_active_on      date,

  -- DPDP Rule 10 prohibits profiling minors, and readiness scoring IS
  -- profiling. This makes an under-18 row structurally impossible rather
  -- than merely discouraged.
  constraint must_confirm_adult check (is_adult_confirmed = true),

  -- URL-safe, reserved-word-free handles for /p/[handle].
  constraint handle_format check (handle ~ '^[a-z0-9][a-z0-9-]{2,29}$'),
  constraint handle_not_reserved check (handle not in (
    'admin','api','app','auth','build','dashboard','help','jintu','learn',
    'login','p','pricing','review','root','settings','signin','signup',
    'static','support','terms','privacy','submit','track','tracks','www'
  )),

  -- E.164 or nothing. Normalising phone formats later is genuinely painful
  -- because you cannot distinguish a malformed number from a foreign one.
  constraint phone_e164_format check (phone_e164 is null or phone_e164 ~ '^\+[1-9][0-9]{7,14}$')
);
create trigger profiles_updated before update on profiles
  for each row execute function set_updated_at();
create index on profiles (college_id) where college_id is not null;
create index on profiles (last_active_on desc);

-- One row per purpose per user. Withdrawal is recorded, never deleted, so we
-- can prove what was consented to and when.
create table consents (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles on delete cascade,
  purpose        consent_purpose not null,
  -- Which privacy notice text they actually saw. Required for DPDP: consent
  -- to a notice you have since rewritten is not consent.
  notice_version text not null,
  granted_at     timestamptz not null default now(),
  withdrawn_at   timestamptz,
  constraint withdrawn_after_granted check (withdrawn_at is null or withdrawn_at >= granted_at)
);
create unique index consents_active_unique
  on consents (user_id, purpose) where withdrawn_at is null;
create index on consents (user_id);

create or replace function has_consent(target_user uuid, p consent_purpose)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from consents
    where user_id = target_user and purpose = p and withdrawn_at is null
  )
$$;

create table staff (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles on delete cascade,
  college_id  uuid not null references colleges on delete cascade,
  role        text not null default 'tpo' check (role in ('tpo','hod','admin')),
  granted_at  timestamptz not null default now(),
  revoked_at  timestamptz,
  unique (user_id, college_id)
);
create index on staff (college_id) where revoked_at is null;

-- Is the caller staff at the given college? Used by TPO-scoped policies.
-- Lives here rather than 0001 because Postgres validates this body at
-- creation time and the table it reads is created just above.
create or replace function is_college_staff(target_college uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff s
    where s.user_id = (select auth.uid())
      and s.college_id = target_college
      and s.revoked_at is null
  )
$$;

-- Append-only. Written by triggers and edge functions, never by clients.
create table audit_log (
  id         bigserial primary key,
  actor_id   uuid references profiles on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  text,
  diff       jsonb,
  created_at timestamptz not null default now()
);
create index on audit_log (entity, entity_id, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table colleges  enable row level security;
alter table profiles  enable row level security;
alter table consents  enable row level security;
alter table staff     enable row level security;
alter table audit_log enable row level security;

-- Colleges are a public lookup for the signup search box.
create policy colleges_read_all on colleges for select using (true);

-- Own profile, full access.
create policy profiles_own on profiles for select
  using (id = (select auth.uid()));
create policy profiles_own_update on profiles for update
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Public profile fields are exposed through a view (0008), not this table, so
-- there is no policy granting other users direct row access here.

-- A TPO sees their own college's learners, and only while not revoked.
create policy profiles_college_staff on profiles for select
  using (college_id is not null and is_college_staff(college_id));

create policy consents_own on consents for select
  using (user_id = (select auth.uid()));
create policy consents_own_insert on consents for insert
  with check (user_id = (select auth.uid()));
-- Withdrawal is an update setting withdrawn_at; granting rows stay immutable.
create policy consents_own_withdraw on consents for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy staff_own on staff for select
  using (user_id = (select auth.uid()));

-- audit_log: no client policy at all. Service role only.

comment on constraint must_confirm_adult on profiles is
  'DPDP Rule 10: profiling minors is prohibited and readiness scoring is profiling. 18+ only, enforced structurally.';
