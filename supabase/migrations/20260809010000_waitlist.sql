-- Phase 0 waitlist. ARCHITECTURE.md §6.
--
-- This is a pre-auth table: someone joining the waitlist has no auth.users
-- row, so their consent cannot live in `consents` (which is keyed to
-- profiles). The consent columns here are the pre-auth equivalent and carry
-- the same obligations — see docs/LEGAL.md §2.2.
--
-- When a waitlist signup converts to an enrolment, the consent is re-taken
-- against the profile. It is not migrated across: a consent given to "tell me
-- about the cohort" is not consent to be scored and profiled.

create table public.waitlist_signups (
  id                 uuid primary key default gen_random_uuid(),
  phone              text not null unique,
  full_name          text,
  -- Free text, not a colleges FK: at waitlist stage we have not yet built a
  -- college list, and forcing a dropdown would drop anyone whose institution
  -- is missing from it.
  college_name       text,

  -- Law 3. Same hard gate as profiles: the row is unrepresentable without an
  -- affirmative 18+ confirmation, and the false default makes a forgetful
  -- insert fail loudly rather than quietly record a minor.
  is_adult_confirmed boolean not null default false
                     constraint waitlist_must_be_adult check (is_adult_confirmed),

  -- The purpose of the form. Required, because without it there is nothing to
  -- deliver — you cannot join a waitlist and refuse to be contacted.
  consent_contact    boolean not null default false
                     constraint waitlist_must_consent_contact check (consent_contact),

  -- Optional and genuinely refusable. Declining must not block the signup:
  -- a consent that is a condition of service is not freely given.
  consent_whatsapp   boolean not null default false,

  -- Which privacy notice they were shown. A consent record that cannot show
  -- what the user read proves nothing (docs/LEGAL.md §2.2).
  notice_version     text not null,

  source             text,
  created_at         timestamptz not null default now(),

  -- Indian mobile numbers in E.164. Validated here as well as in Zod because
  -- the database is the only layer that cannot be bypassed.
  constraint waitlist_phone_is_indian_mobile
    check (phone ~ '^\+91[6-9][0-9]{9}$')
);

comment on table public.waitlist_signups is
  'Phase 0 waitlist. Pre-auth, so consent is recorded on the row rather than in consents.';
comment on column public.waitlist_signups.consent_whatsapp is
  'Optional. Declining must never block signup — see docs/LEGAL.md §2.2.';

create index waitlist_signups_created_at_idx on public.waitlist_signups (created_at desc);

alter table public.waitlist_signups enable row level security;

-- Insert only, and deliberately nothing else.
--
-- There is no SELECT policy, and that is the entire security design of this
-- table. The anon key ships inside the client bundle by definition — it is
-- public. If this table had a select policy readable by anon, every phone
-- number we collect would be downloadable by anyone who opened devtools.
-- Ops reads the list through the service role, server-side.
--
-- Consequence for callers: `insert ... returning` will fail, because RETURNING
-- needs select rights. Use .insert() without .select() from supabase-js.
create policy "anyone may join the waitlist"
  on public.waitlist_signups for insert
  to anon, authenticated
  with check (true);
