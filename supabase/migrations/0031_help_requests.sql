-- ─────────────────────────────────────────────────────────────────────────────
-- 0031 — help_requests: "Mine looks different" (V2Help/DeskHelp, CHANGES.md
-- item 6 / BUILD-PLAN.md §3.4).
--
-- A step's "Stuck? Tell us what you see" box, free-text only for now — the
-- mockup's richer "pick the closest wrong output, see the canned fix" list
-- needs its own authored content (a per-step list of known-wrong outputs and
-- fixes) that doesn't exist on any step yet, on any roadmap. Shipping that
-- list empty would be a dead UI; the free-text fallback alone is a complete,
-- honest feature, and the canned list is additive later, not a breaking
-- change to this table.
--
-- Insert-and-read-your-own only. No update or delete policy for the owner:
-- a help request is a message sent once, not a thing you edit afterwards.
-- Review happens by someone reading these directly via the service role,
-- which bypasses RLS by default — no separate "staff" policy needed yet.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.help_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  node_id      uuid not null references public.nodes (id) on delete cascade,
  step_context text not null,
  message      text not null check (char_length(message) between 1 and 2000),
  status       text not null default 'open' check (status in ('open', 'reviewed')),
  created_at   timestamptz not null default now()
);

comment on table public.help_requests is
  'A learner''s "Stuck? Tell us what you see" submission from one lesson step. Free text only, reviewed out of band; never updated or deleted by its owner.';

create index help_requests_user_idx on public.help_requests (user_id, created_at desc);
create index help_requests_node_idx on public.help_requests (node_id);

alter table public.help_requests enable row level security;

create policy "users read their own help requests"
  on public.help_requests for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "users insert their own help requests"
  on public.help_requests for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- No update or delete policy, for either role — see the header comment.

grant select, insert on public.help_requests to authenticated;
