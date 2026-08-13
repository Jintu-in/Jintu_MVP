-- Auth v3 support: the existence check and the attempt ledger.
--
-- The v3 flow (AUTH.md) branches on "does an account exist for this email"
-- — the deliberate enumeration tradeoff. The disclosure is contained by two
-- things this file provides: the check is callable ONLY through the service
-- role (revoked from anon and authenticated, so no client can ever probe
-- it), and the server action that calls it rate-limits against
-- auth_attempts before asking.

-- ─────────────────────────────────────────────────────────────────────────────
-- email_registered — security definer so auth.users stays unreadable
-- ─────────────────────────────────────────────────────────────────────────────
-- lower() on both sides rather than citext: auth.users.email is text managed
-- by Supabase (stored lowercased on signup, but OAuth providers have mixed
-- historical behaviour), and a case-insensitive compare with no extension
-- dependency is the version that cannot drift.

create or replace function public.email_registered(p_email text)
  returns boolean
  language sql
  security definer
  set search_path = ''
as $$
  select exists (
    select 1 from auth.users where lower(email) = lower(p_email)
  );
$$;

comment on function public.email_registered(text) is
  'Does an account exist for this email. Service-role only — a client that could call this could enumerate the userbase.';

revoke execute on function public.email_registered(text) from public, anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- auth_attempts — the ledger the rate limits count against
-- ─────────────────────────────────────────────────────────────────────────────
-- One row per attempt at the two sensitive doors: the existence check and a
-- password sign-in (failed ones only, for backoff and abuse review). Email
-- and IP arrive as SHA-256 hex, hashed in the server action — the ledger is
-- for counting and pattern-spotting, and a table of plaintext addresses and
-- IPs would be a liability doing a job a hash does equally well.

create table public.auth_attempts (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('exists_check', 'password_fail')),
  email_hash text not null check (email_hash ~ '^[0-9a-f]{64}$'),
  ip_hash    text check (ip_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now()
);

comment on table public.auth_attempts is
  'Rate-limit and abuse ledger for the auth flow. Hashes only, never plaintext. service-role only: written and read by server actions, never by a client.';

create index auth_attempts_email_idx on public.auth_attempts (kind, email_hash, created_at desc);
create index auth_attempts_ip_idx on public.auth_attempts (kind, ip_hash, created_at desc);

alter table public.auth_attempts enable row level security;
