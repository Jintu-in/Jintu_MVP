-- Operations: outbound messages, link health, audit trail.
-- Baseline 5 of 5. All three tables are server-side surfaces: RLS is on with
-- no policies, which denies every client, and the service role bypasses RLS.

create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  channel    text not null check (channel in ('email', 'push', 'whatsapp', 'sms')),
  template   text not null,
  payload    jsonb not null default '{}'::jsonb,
  status     text not null default 'queued'
             check (status in ('queued', 'sent', 'failed', 'suppressed')),
  cost_paise int not null default 0 check (cost_paise >= 0),
  sent_at    timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.notifications is
  'Outbound message log — the one well-timed daily reminder lives here. service-role only: written by edge functions, never by a client.';

alter table public.notifications enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- link_checks — a dead link on the main surface is worse than a missing one
-- ─────────────────────────────────────────────────────────────────────────────

create table public.link_checks (
  id          uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources (id) on delete cascade,
  status_code int,
  ok          boolean not null,
  checked_at  timestamptz not null default now()
);

comment on table public.link_checks is
  'Crawler results for resource URLs; the latest verdict is mirrored to resources.health/last_checked_at. service-role only.';

create index link_checks_resource_idx on public.link_checks (resource_id, checked_at desc);

alter table public.link_checks enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- audit_log
-- ─────────────────────────────────────────────────────────────────────────────

create table public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references public.profiles (id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  diff       jsonb,
  created_at timestamptz not null default now()
);

comment on table public.audit_log is
  'Append-only record of privileged actions. service-role only: a client that could write here could forge it.';

alter table public.audit_log enable row level security;
