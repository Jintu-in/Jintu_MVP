-- ─────────────────────────────────────────────────────────────────────────────
-- 0035 — notify_requests: the holding page's "tell me when this opens" form
-- (design pack update 3 §A, V2Holding/DeskHolding).
--
-- Insert-only from the client, by design — there is no "my notify requests"
-- screen drawn, so there is nothing to read back. The actual sending job
-- (moving a roadmap from draft to open triggers one message per subscriber)
-- and the unsubscribe-link route are NOT built here: CHANGES.md itself asks
-- "ask Saurav which email provider, and whether WhatsApp sending is in
-- scope" before that exists. This migration and the form that uses it only
-- ever promise "we recorded that you asked" — sending is a separate,
-- explicitly gated piece of work.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.notify_requests (
  id              uuid primary key default gen_random_uuid(),
  email           text not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  -- Only meaningful when channel = 'whatsapp'. The form never pre-ticks
  -- WhatsApp, so most rows never populate this.
  phone           text,
  roadmap_id      uuid not null references public.roadmaps (id) on delete cascade,
  channel         text not null check (channel in ('email', 'whatsapp')),
  -- The exact sentence the person agreed to when they ticked the box —
  -- DPDP: show what was agreed, not just that something was.
  consent_text    text not null check (char_length(consent_text) between 1 and 500),
  created_at      timestamptz not null default now(),
  sent_at         timestamptz,
  unsubscribed_at timestamptz,
  unique (email, roadmap_id, channel)
);

comment on table public.notify_requests is
  'One row per person per roadmap per channel, from the holding page''s notify-me form. Sending and unsubscribe-token handling are separate, not-yet-built pieces — this table only records the ask.';

create index notify_requests_roadmap_idx on public.notify_requests (roadmap_id, channel) where unsubscribed_at is null and sent_at is null;

alter table public.notify_requests enable row level security;

-- Signed-out visitors submit this as often as signed-in ones — the form has
-- no "who are you" requirement beyond the email itself. Insert-only: no
-- select, update or delete policy for anon/authenticated, matching the
-- "nothing to read back" posture above.
create policy "anyone can ask to be notified"
  on public.notify_requests for insert
  to anon, authenticated
  with check (true);

grant insert on public.notify_requests to anon, authenticated;

-- ── reuse the existing rate-limit ledger rather than a parallel one ────────
-- auth_attempts (0006) already hashes an email + IP pair into a time-windowed
-- count, service-role only. It was auth-only in name; this is the first
-- other surface to reuse it, so the comment below says so.

alter table public.auth_attempts
  drop constraint auth_attempts_kind_check;

alter table public.auth_attempts
  add constraint auth_attempts_kind_check
    check (kind in ('exists_check', 'password_fail', 'notify_request'));

comment on table public.auth_attempts is
  'Rate-limit and abuse ledger — the auth flow''s two doors, plus any other public form that asks lib/auth-limits.ts to count attempts (the holding page''s notify-me form is the first). Hashes only, never plaintext. service-role only: written and read by server actions, never by a client.';
