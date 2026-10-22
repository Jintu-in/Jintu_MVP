-- ─────────────────────────────────────────────────────────────────────────────
-- 0030 — Phase 5 Part B: authored steps (V2Step's "run a command" card,
-- V2Turn's richer "your turn"), starting with Git & GitHub.
--
-- Nullable, additive. A node with steps = null keeps rendering exactly as
-- Part A built it (lib/steps.ts auto-converts the six existing fields); a
-- node with real content here gets its generic "challenge" step replaced
-- by this richer, hand-authored sequence instead — see lib/steps.ts's
-- buildLessonSteps() for exactly where the splice happens.
--
-- Shape is validated by @jintu/contracts' authoredStepsSchema at write
-- time (both the importer and any future admin surface), not by a DB
-- CHECK — the two authored kinds (command/turn) are still growing (Part B
-- adds five more), and a jsonb shape constraint would need editing in
-- lockstep with every new kind, which a CHECK cannot express as cleanly
-- as a shared zod schema already being imported on both ends.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.nodes
  add column if not exists steps jsonb;

comment on column public.nodes.steps is
  'Hand-authored rich steps (command/turn/…), validated by @jintu/contracts authoredStepsSchema. Null = this day uses the auto-converted generic steps (lib/steps.ts) instead.';
