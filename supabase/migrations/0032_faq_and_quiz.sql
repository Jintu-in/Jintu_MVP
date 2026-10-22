-- ─────────────────────────────────────────────────────────────────────────────
-- 0032 — faq and quiz on nodes (V2Questions/DeskQuestions, V2Quiz/DeskQuiz;
-- BUILD-PLAN.md §3.4: "questions/FAQ + common mistake + go deeper link",
-- "quiz (no score kept)").
--
-- Nullable, additive, same posture as 0030's `steps`: shape validated by
-- @jintu/contracts zod schemas on read (lib/roadmaps.ts), not a CHECK —
-- a jsonb shape constraint would duplicate what the shared schema already
-- enforces, and a malformed row degrades to null (no faq/quiz step) rather
-- than taking the day down.
--
-- The mockup's "Common mistake" card inside V2Questions is deliberately NOT
-- reproduced in the faq step: node.common_mistake already renders as its
-- own "gotcha" step later in the same lesson (Phase 5 Part A), and showing
-- it twice in one lesson would be a real duplication, not fidelity.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.nodes
  add column if not exists faq jsonb,
  add column if not exists quiz jsonb;

comment on column public.nodes.faq is
  'Questions you might have (V2Questions) — [{question, answer}], validated by @jintu/contracts faqSchema. Null = no faq step for this day.';
comment on column public.nodes.quiz is
  'No-score-kept quiz (V2Quiz) — [{question, options, correctIndex, explanation}], validated by @jintu/contracts quizSchema. Null = no quiz for this day.';
