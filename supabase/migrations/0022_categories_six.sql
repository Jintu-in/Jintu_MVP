-- ─────────────────────────────────────────────────────────────────────────────
-- 0022 — six categories, because four cannot hold what is coming.
--
-- 0017 closed the category set at data / software / marketing / judgement, on
-- purpose: an open set grows a filter per import, which is how a catalogue
-- ends up with nineteen facets each returning one result. That decision was
-- right and it is why this is a deliberate amendment rather than a default.
--
-- The four stopped fitting the moment the catalogue grew past developers:
--
--   Git, Linux and Excel are all filed under software/data, but none of them
--   is a subject — they are the things every subject assumes. Three of the
--   seven roadmaps are prerequisites wearing a subject's label.
--
--   Sales is not marketing. Entrepreneurship is not judgement. Medical coding
--   is none of the four, and filing it under "Data & analytics" is a mistake
--   a reader can see.
--
-- Six, and they hold about twenty roadmaps without growing again:
--
--   data          analysis, bioinformatics, epidemiology
--   software      backend, frontend, security — things you build
--   business      Amazon Ads, sales, product marketing, entrepreneurship
--   health        medical coding, clinical research
--   judgement     thinking, writing, how to learn
--   foundations   Git, Linux, Excel — the prerequisites
--
-- MOVES, and why each:
--   amazon-ads          marketing -> business      "marketing" was too narrow
--                                                  a name for the column that
--                                                  will also hold sales
--   git-and-github      software  -> foundations   a prerequisite, not a subject
--   linux-command-line  software  -> foundations   same
--   excel-at-work       data      -> foundations   same
--
-- Nothing else moves. data-analyst stays data, java stays software,
-- thinking-under-uncertainty stays judgement.
--
-- The UI reads categories from lib/catalogue-filters.ts, which must list the
-- same six in the same order or the catalogue silently drops a facet.
--
-- Re-runnable.
-- ─────────────────────────────────────────────────────────────────────────────

-- Widen the constraint BEFORE moving anything, or the updates fail the old
-- CHECK on the way through.
alter table public.roadmaps drop constraint if exists roadmaps_category_is_known;

alter table public.roadmaps
  add constraint roadmaps_category_is_known
  check (category in ('data', 'software', 'business', 'health', 'judgement', 'foundations'));

comment on column public.roadmaps.category is
  'Navigation facet: one of six. subject_tags is description and may grow freely; this may not. Widening it is a migration and a deliberate act — see 0022.';

update public.roadmaps set category = 'business'    where slug = 'amazon-ads';
update public.roadmaps set category = 'foundations' where slug in ('git-and-github', 'linux-command-line', 'excel-at-work');

-- Anything still filed under the retired name. There should be none after the
-- statement above; this catches a roadmap imported between the two pastes.
update public.roadmaps set category = 'business' where category = 'marketing';
