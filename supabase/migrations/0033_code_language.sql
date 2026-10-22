-- ─────────────────────────────────────────────────────────────────────────────
-- 0033 — profiles.code_language: the DSA language switch (V2Dsa/DeskDsa),
-- BUILD-PLAN.md §3.4: "one choice remembered per user, applies to every
-- code block."
--
-- Infrastructure only, by explicit decision — no DSA/algorithms roadmap
-- exists anywhere in docs/roadmaps/ yet (the mockup's own subtitle: "Sample
-- step, not a written lesson yet"), so there is no real lesson to pilot the
-- new codeMulti step kind on. The column, the schema and the switch are
-- built and tested against synthetic fixtures now; a real pilot is a
-- separate, later content-authoring task once a multi-language roadmap
-- exists to anchor it to.
--
-- Nullable: null means "no preference set yet", and the app defaults to
-- Python in that case rather than treating null as an error.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles
  add column if not exists code_language text
    check (code_language is null or code_language in ('py', 'java', 'cpp', 'js', 'c'));

comment on column public.profiles.code_language is
  'The DSA language switch''s remembered choice (V2Dsa/DeskDsa) — one of py/java/cpp/js/c, or null before the learner has ever picked one.';
