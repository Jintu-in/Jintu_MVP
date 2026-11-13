-- ─────────────────────────────────────────────────────────────────────────────
-- 0036 — decisions: the Decide step's storage (design pack update 3 §B,
-- V2Decide/V2DecideReveal/DeskDecide).
--
-- One row per (user, step): choose an option, explain why, tick which parts
-- of your own reasoning you think covered the case. "Change my answer"
-- (CHANGES.md) updates the SAME row rather than inserting a new one — the
-- founder log shows your current thinking per decision, not a history of
-- edits. No score anywhere in this table, on purpose (CLAUDE.md: no
-- grading): option_id is never compared against a "correct" answer, and
-- there is no such column.
--
-- No real roadmap authors a decide step yet (same position migration 0033's
-- DSA language switch shipped from) — this table, like that one, is
-- genuinely exercised today only by the baseline guard's synthetic fixture.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.decisions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  roadmap_id  uuid not null references public.roadmaps (id) on delete cascade,
  node_id     uuid not null references public.nodes (id) on delete cascade,
  -- Matches LessonStep's own id shape ("authored-<node-slug>-<index>") —
  -- a decide step has no separate numeric identity of its own.
  step_id     text not null check (char_length(step_id) between 1 and 200),
  option_id   text not null check (char_length(option_id) between 1 and 100),
  -- The 15-character floor mirrors V2Decide's own CTA gate ("Lock in" stays
  -- disabled below it) — enforced here too so the floor holds regardless of
  -- which client writes the row.
  reason      text not null check (char_length(reason) between 15 and 2000),
  -- Self-ticked against the learner's OWN reason, never graded against the
  -- step's content (CLAUDE.md: no grading) — see coverStepSchema's own
  -- comment in packages/contracts/src/steps.ts. Empty is valid: ticking
  -- nothing is itself the honest self-report sometimes.
  covered     text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, node_id, step_id)
);

comment on table public.decisions is
  'The Decide step''s storage (update 3 §B) — one row per user per step, updated in place by "Change my answer". No score column: option_id is never a right/wrong answer, only what was chosen.';

create index decisions_roadmap_idx on public.decisions (user_id, roadmap_id, created_at);

alter table public.decisions enable row level security;

create policy "users read their own decisions"
  on public.decisions for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "users create their own decisions"
  on public.decisions for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "users update their own decisions"
  on public.decisions for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- No delete policy: a decision is kept or changed, never removed on its
-- own — same append-then-amend posture the founder log relies on. (The
-- account-delete cascade above still removes it with the rest of the user.)

grant select, insert, update on public.decisions to authenticated;
