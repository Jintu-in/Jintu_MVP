-- ─────────────────────────────────────────────────────────────────────────────
-- 0013 — the account half of /profile: identity, reminders, public handle.
--
-- Three of the session brief's five schema items already exist and are NOT
-- recreated here:
--   · profiles.timezone   — shipped in 0012, live in prod
--   · saved_resources     — shipped in 0003, identical shape to the brief
--   · consents            — shipped in 0001, already carries withdrawn_at and
--                           the four purposes the consent page lists
--
-- What was actually missing is below. Re-runnable, like every bundle since
-- FIX-2.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── identity ─────────────────────────────────────────────────────────────────
-- Separate from full_name: full_name is the legal-ish name given at signup,
-- display_name is what the person wants shown. Nullable — the profile falls
-- back to full_name, and nobody is forced to invent a second name.
alter table public.profiles
  add column if not exists display_name text
    check (display_name is null or length(btrim(display_name)) between 1 and 60);

comment on column public.profiles.display_name is
  'What the person wants shown. Falls back to full_name when null.';

-- ── reminders ────────────────────────────────────────────────────────────────
create table if not exists public.reminder_prefs (
  user_id        uuid primary key references public.profiles (id) on delete cascade,
  daily_enabled  boolean not null default false,
  daily_at       time not null default '20:30',
  streak_warning boolean not null default false,
  updated_at     timestamptz not null default now()
);

comment on table public.reminder_prefs is
  'One row per user. Off by default: a reminder is a message we send, and DPDP consent for the reminders purpose is a separate record in consents.';

alter table public.reminder_prefs enable row level security;

do $$ begin
  create policy "own reminder prefs, read"
    on public.reminder_prefs for select to authenticated
    using (user_id = (select auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "own reminder prefs, create"
    on public.reminder_prefs for insert to authenticated
    with check (user_id = (select auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "own reminder prefs, change"
    on public.reminder_prefs for update to authenticated
    using (user_id = (select auth.uid()))
    with check (user_id = (select auth.uid()));
exception when duplicate_object then null; end $$;

-- A preference is not a point: the owner writing their own row directly is
-- correct here, so the grants are real rather than RPC-only.
grant select, insert, update on public.reminder_prefs to authenticated;

-- ── the public page ──────────────────────────────────────────────────────────
create table if not exists public.public_profiles (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  handle     text not null unique
             check (handle ~ '^[a-z0-9][a-z0-9-]{2,29}$'),
  is_public  boolean not null default false,
  created_at timestamptz not null default now()
);

-- Route collisions, not vanity: every name here is a path segment we own or
-- may own. Enforced in the database because the app is not the only thing
-- that will ever write this table.
do $$ begin
  alter table public.public_profiles
    add constraint public_profiles_handle_not_reserved
    check (handle not in (
      'admin', 'api', 'app', 'auth', 'help', 'jintu', 'learn', 'login',
      'profile', 'roadmap', 'settings', 'signin', 'signup', 'support',
      'u', 'www'
    ));
exception when duplicate_object then null; end $$;

comment on table public.public_profiles is
  'Opt-in, off by default. is_public=false keeps the row (so the handle stays reserved for its owner) while /u/[handle] 404s.';

alter table public.public_profiles enable row level security;

do $$ begin
  create policy "own public profile, read"
    on public.public_profiles for select to authenticated
    using (user_id = (select auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "own public profile, create"
    on public.public_profiles for insert to authenticated
    with check (user_id = (select auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "own public profile, change"
    on public.public_profiles for update to authenticated
    using (user_id = (select auth.uid()))
    with check (user_id = (select auth.uid()));
exception when duplicate_object then null; end $$;

-- The one policy that lets a logged-out stranger render /u/[handle]. Scoped
-- to is_public = true, so switching the toggle off makes the page vanish on
-- the next request rather than on the next deploy.
do $$ begin
  create policy "a published profile is readable by anyone"
    on public.public_profiles for select to anon, authenticated
    using (is_public = true);
exception when duplicate_object then null; end $$;

grant select, insert, update on public.public_profiles to authenticated;
grant select on public.public_profiles to anon;
