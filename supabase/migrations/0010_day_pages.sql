-- Day pages: the seven-block content model (owner spec, 2026-08-17).
--
-- A node stops being title+summary+links and becomes a day: why it exists
-- in the sequence, its topics each with a line of why, the challenge, the
-- named mistake, the practitioner's principle, and three self-check
-- questions. All additive and nullable — a day renders whatever blocks it
-- has, so the four existing roadmaps stay valid while their content grows
-- into the model.
--
-- node_checks doubles as the seed for spaced repetition later: a day's
-- three questions become that day's three review cards. Built now because
-- it costs nothing and saves a migration.

alter table public.nodes
  add column if not exists why_today text,
  add column if not exists common_mistake text,
  add column if not exists principle text,
  add column if not exists challenge text,
  add column if not exists challenge_minutes int
    constraint nodes_challenge_minutes_range check (challenge_minutes between 5 and 120);

comment on column public.nodes.why_today is
  'Where this day sits: what yesterday gave you, what today adds, what tomorrow needs from it. The accent callout.';
comment on column public.nodes.common_mistake is
  'A specific, named mistake with the symptom it produces. Not a caveat.';
comment on column public.nodes.principle is
  'One sentence an experienced practitioner would actually say.';
comment on column public.nodes.challenge is
  'The task: concrete, 20–40 minutes, produces something.';

-- ─────────────────────────────────────────────────────────────────────────────
-- node_topics — topics get a line of why, not just a name
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.node_topics (
  id       uuid primary key default gen_random_uuid(),
  node_id  uuid not null references public.nodes (id) on delete cascade,
  position smallint not null default 0,
  title    text not null,
  detail   text not null,
  unique (node_id, position)
);

comment on table public.node_topics is
  'A day''s numbered topics, each with one sentence of why it matters. Our own words. Supersedes nodes.learning_objectives as content grows into the model.';

create index if not exists node_topics_node_idx on public.node_topics (node_id, position);

alter table public.node_topics enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- node_checks — retrieval practice, three per day
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.node_checks (
  id       uuid primary key default gen_random_uuid(),
  node_id  uuid not null references public.nodes (id) on delete cascade,
  position smallint not null default 0,
  question text not null,
  answer   text not null,
  unique (node_id, position)
);

comment on table public.node_checks is
  'Self-check questions, collapsed until asked. Retrieval practice after doing is learning; before doing it is a quiz — the page order enforces which one this is.';

create index if not exists node_checks_node_idx on public.node_checks (node_id, position);

alter table public.node_checks enable row level security;

-- Public reading gated the same way as every other catalogue table: only
-- through a published roadmap. The owner draft said `using (true)`; the
-- established pattern is tighter and there is no reason these two tables
-- should leak draft content when nodes themselves do not.
do $$ begin
  create policy "topics of published roadmaps are public"
    on public.node_topics for select
    to anon, authenticated
    using (exists (
      select 1 from public.nodes n
      join public.modules m on m.id = n.module_id
      join public.roadmaps r on r.id = m.roadmap_id
      where n.id = node_id and r.status = 'published'
    ));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "checks of published roadmaps are public"
    on public.node_checks for select
    to anon, authenticated
    using (exists (
      select 1 from public.nodes n
      join public.modules m on m.id = n.module_id
      join public.roadmaps r on r.id = m.roadmap_id
      where n.id = node_id and r.status = 'published'
    ));
exception when duplicate_object then null; end $$;

grant select on public.node_topics, public.node_checks to anon, authenticated;
