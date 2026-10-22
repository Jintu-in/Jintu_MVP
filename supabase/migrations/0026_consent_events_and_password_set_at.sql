-- ─────────────────────────────────────────────────────────────────────────────
-- 0026 — append-only consent log, and a real column for "is a password set".
--
-- Design update 2 (jintu-design/CHANGES.md items 2 and 3) needs two things
-- the schema doesn't have yet, for the new /settings/consents and
-- /settings/account screens:
--
--   1. consents (0001) is a row-per-purpose table that UPDATEs
--      withdrawn_at in place. DPDP requires being able to show what was
--      agreed and when, for every change, not just the latest state — so
--      this adds consent_events, an append-only log, alongside it.
--      consents itself is untouched (still live, still read by existing
--      code) and becomes legacy once the app switches to reading/writing
--      consent_events instead; not dropped here.
--   2. "Is a password set" is currently read from Supabase auth's
--      user_metadata.has_password (apps/web/src/actions/auth.ts:351,431),
--      not a database column. profiles.password_set_at replaces that.
--
-- Purely additive. Nothing existing changes shape or loses data.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── consent_events ───────────────────────────────────────────────────────────

create table public.consent_events (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  purpose        text not null check (purpose in (
                   'core_service', 'analytics', 'reminders', 'public_profile'
                 )),
  granted        boolean not null,
  -- core_service is granted once at sign-up and never withdrawn — ending it
  -- means deleting the account, which is a different act (profile/delete),
  -- not a consent toggle. Same enforcement style as profiles_must_be_adult.
  constraint consent_events_core_service_never_withdrawn
    check (purpose <> 'core_service' or granted),
  notice_version text not null,
  -- Where the change came from, for support/debugging — not DPDP-required,
  -- but cheap and already asked for ("source" in the suggested shape).
  source         text not null default 'settings',
  at             timestamptz not null default now()
);

comment on table public.consent_events is
  'Append-only DPDP consent log. One row per grant/withdraw event; current state for a purpose = its latest row. Never updated or deleted, except the account-delete cascade.';

create index consent_events_user_purpose_idx
  on public.consent_events (user_id, purpose, at desc);

alter table public.consent_events enable row level security;

create policy "users read their own consent events"
  on public.consent_events for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "users insert their own consent events"
  on public.consent_events for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- No update or delete policy, for either role: the log is append-only by
-- construction. A correction is a new event, not an edit to an old one.

-- Backfill from the existing ledger, so current users don't see "Not
-- agreed" for things they already agreed to. Every live consents row
-- becomes a grant event at its real granted_at; a withdrawn row also gets
-- its withdrawal event at its real withdrawn_at. Dates are real, not
-- migration-time guesses — consents already recorded both timestamps.
insert into public.consent_events (user_id, purpose, granted, notice_version, source, at)
select user_id, purpose, true, notice_version, 'backfill', granted_at
from public.consents;

insert into public.consent_events (user_id, purpose, granted, notice_version, source, at)
select user_id, purpose, false, notice_version, 'backfill', withdrawn_at
from public.consents
where withdrawn_at is not null;

-- ── profiles.password_set_at ────────────────────────────────────────────────

alter table public.profiles
  add column if not exists password_set_at timestamptz;

comment on column public.profiles.password_set_at is
  'When a password was last saved. Null = sign-in is email-code-only. Source of truth for /settings/account — read this, not auth user_metadata.has_password.';

-- Backfill from the existing auth-metadata flag. Approximate: this is the
-- migration's run time, not each person's true original set date, because
-- user_metadata never recorded one — the flag was boolean-only. Good enough
-- for "set [date]" to read a real, if slightly late, date instead of none.
update public.profiles p
set password_set_at = now()
from auth.users u
where u.id = p.id
  and (u.raw_user_meta_data ->> 'has_password') = 'true'
  and p.password_set_at is null;
