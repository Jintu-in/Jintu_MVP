-- ─────────────────────────────────────────────────────────────────────────────
-- 0019 — node_checks becomes a question bank as well as a day section.
--
-- One table, two audiences. A check written for the end of a day is a
-- comprehension question: it asks whether you followed what you just read.
-- An interview question is a different object — it is asked cold, by someone
-- who has not read the day, and it is usually harder and more specific. The
-- same table can hold both, but only if a row says which it is; otherwise
-- the bank shows comprehension questions to someone preparing for an
-- interview and the day page shows interview questions to someone who has
-- read four paragraphs.
--
-- So: three columns, and the whole design of the bank follows from them.
--
--   kind         which audience the question was written for
--   difficulty   easy / medium / hard, the interview convention — NOT the
--                node's intro/core/stretch, which describes a day's place in
--                a curriculum rather than a question's hardness
--   asked_in_interviews  a person has actually seen this asked. Distinct from
--                kind: an interview-SHAPED question we wrote is not the same
--                claim as one somebody was really asked, and only the second
--                deserves to be labelled as such on the page.
--
-- NOTE ON THE STATE OF THE DATA AT THE TIME OF WRITING: node_checks has zero
-- rows. Every column here is preparation for authoring, not exposure of
-- something already sitting in the database. See docs/COURSE_STANDARD.md.
--
-- Re-runnable.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.node_checks
  add column if not exists kind                text not null default 'comprehension',
  add column if not exists difficulty          text not null default 'medium',
  add column if not exists asked_in_interviews boolean not null default false;

do $$ begin
  alter table public.node_checks
    add constraint node_checks_kind_is_known
    check (kind in ('comprehension', 'interview'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.node_checks
    add constraint node_checks_difficulty_is_known
    check (difficulty in ('easy', 'medium', 'hard'));
exception when duplicate_object then null; end $$;

-- A question nobody has seen asked cannot claim to be one that is asked, and
-- a comprehension check is by definition not an interview question. Both
-- directions of that are worth enforcing rather than trusting.
do $$ begin
  alter table public.node_checks
    add constraint node_checks_asked_implies_interview
    check (not asked_in_interviews or kind = 'interview');
exception when duplicate_object then null; end $$;

comment on column public.node_checks.kind is
  'comprehension = asked at the end of the day it belongs to. interview = asked cold, by someone who has not read it. The day page shows the first; /interview shows the second.';
comment on column public.node_checks.difficulty is
  'easy / medium / hard — how hard the QUESTION is. nodes.difficulty is intro/core/stretch and describes where a DAY sits in a curriculum; they are not the same axis and must not be merged.';
comment on column public.node_checks.asked_in_interviews is
  'A person reports having been asked this. Never inferred, never set in bulk — it is a claim about the world, and the bank labels it as one.';

-- The bank's only two queries: everything of one kind at one difficulty, and
-- everything for one roadmap. The second goes through nodes, so the existing
-- node_checks_node_idx covers it; this covers the first.
create index if not exists node_checks_bank_idx
  on public.node_checks (kind, difficulty)
  where kind = 'interview';

-- No new grants and no new policies: 0010 already grants select to anon and
-- gates it on the roadmap being published, which is exactly right for a bank
-- that is readable without an account.
