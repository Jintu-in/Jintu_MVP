-- The catalogue: roadmaps → modules → nodes → resources.
-- Baseline 2 of 5.
--
-- A roadmap is a deep, sequenced curriculum for one subject, built entirely
-- from curated third-party free content. A module spans weeks ("Weeks 5–9");
-- a node is one concept ("Window functions — frames") holding a couple of
-- reads and a video; a resource is a URL plus metadata — never the content.
--
-- Reading a published roadmap requires NO account. That is the SEO surface
-- and the trust argument, so the select policies below are granted to anon.
-- Drafts are invisible to every client; authoring happens through the
-- service role until a maintainer surface exists.

create table public.roadmaps (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title           text not null,
  summary         text not null,          -- our own one-line blurb, our words
  subject_tags    text[] not null default '{}',
  difficulty      text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  estimated_weeks int check (estimated_weeks between 1 and 104),
  estimated_hours int check (estimated_hours between 1 and 2000),
  maintainer_id   uuid references public.profiles (id) on delete set null,
  -- Licence of anything imported wholesale (OSSU, freeCodeCamp curriculum,
  -- free-programming-books, awesome lists). Checked at import time, recorded
  -- here, shown on the page. NULL means every entry was hand-curated.
  license_note    text,
  status          text not null default 'draft' check (status in ('draft', 'published')),
  reviewed_at     timestamptz,
  changelog       jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.roadmaps is
  'A curated curriculum for one subject. URLs and metadata only — the platform never stores or re-hosts third-party content.';

alter table public.roadmaps enable row level security;

create policy "published roadmaps are public"
  on public.roadmaps for select
  to anon, authenticated
  using (status = 'published');

create trigger roadmaps_touch_updated_at
  before update on public.roadmaps
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- modules
-- ─────────────────────────────────────────────────────────────────────────────

create table public.modules (
  id          uuid primary key default gen_random_uuid(),
  roadmap_id  uuid not null references public.roadmaps (id) on delete cascade,
  position    int not null check (position >= 1),
  title       text not null,
  week_range  text,                        -- display text: "Weeks 5–9"
  objective   text,                        -- what you can DO after this module
  deliverable text,                        -- the artefact worth having at the end
  est_hours   int check (est_hours between 1 and 500),
  unique (roadmap_id, position)
);

comment on table public.modules is
  'An ordered slice of a roadmap spanning several weeks. Weeks are size, not deadlines — there are no cohorts and no clocks.';

alter table public.modules enable row level security;

create policy "modules of published roadmaps are public"
  on public.modules for select
  to anon, authenticated
  using (exists (
    select 1 from public.roadmaps r
    where r.id = roadmap_id and r.status = 'published'
  ));

-- ─────────────────────────────────────────────────────────────────────────────
-- nodes
-- ─────────────────────────────────────────────────────────────────────────────

create table public.nodes (
  id                    uuid primary key default gen_random_uuid(),
  module_id             uuid not null references public.modules (id) on delete cascade,
  position              int not null check (position >= 1),
  title                 text not null,
  summary               text,             -- our own framing of the concept
  learning_objectives   text[] not null default '{}',
  -- A node is a single sitting. The cap keeps authors honest: if it takes
  -- longer than two hours it is two nodes.
  est_minutes           int not null check (est_minutes between 2 and 120),
  difficulty            text check (difficulty in ('intro', 'core', 'stretch')),
  is_optional           boolean not null default false,
  prerequisite_node_ids uuid[] not null default '{}',
  unique (module_id, position)
);

comment on table public.nodes is
  'One concept, one sitting: a handful of resources and an estimate. The unit of progress — finishing a node IS the progress event.';

alter table public.nodes enable row level security;

create policy "nodes of published roadmaps are public"
  on public.nodes for select
  to anon, authenticated
  using (exists (
    select 1 from public.modules m
    join public.roadmaps r on r.id = m.roadmap_id
    where m.id = module_id and r.status = 'published'
  ));

-- ─────────────────────────────────────────────────────────────────────────────
-- resources
-- ─────────────────────────────────────────────────────────────────────────────

create table public.resources (
  id                 uuid primary key default gen_random_uuid(),
  node_id            uuid not null references public.nodes (id) on delete cascade,
  position           int not null check (position >= 1),
  type               text not null check (type in ('read', 'video', 'doc', 'case_study', 'tool', 'latest')),
  title              text not null,
  url                text not null check (url ~ '^https://'),
  source_name        text not null,       -- "Mode SQL tutorial", "freeCodeCamp"
  author             text,
  -- Official IFrame embed only, youtube-nocookie, click-to-load. We store the
  -- id, never the transcript — that is the line between an aggregator and an
  -- infringer, and what Section 79 safe harbour depends on.
  youtube_video_id   text check (youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),
  duration_sec       int check (duration_sec > 0),
  -- Users are on metered mobile data; a 20-minute video is ~150 MB and they
  -- deserve to know before tapping.
  est_size_mb        numeric(7, 1) check (est_size_mb >= 0),
  is_free            boolean not null default true,
  editor_note        text,                -- one line, our words: why THIS link
  added_at           timestamptz not null default now(),
  last_checked_at    timestamptz,
  health             text not null default 'unchecked'
                     check (health in ('unchecked', 'ok', 'flaky', 'broken')),
  -- Set on anything a model suggested. NEVER publishable while true: roughly
  -- a fifth of LLM-suggested references are fabricated, and a dead link on
  -- the main surface is worse than a missing one.
  needs_verification boolean not null default false,
  unique (node_id, position),
  constraint resources_video_id_only_on_videos
    check (youtube_video_id is null or type = 'video')
);

comment on table public.resources is
  'A pointer to third-party content: URL and metadata only, never the content itself. No transcripts, no summaries of other people''s work, no TTS, no offline bundles.';

create index resources_node_id_idx on public.resources (node_id);

alter table public.resources enable row level security;

create policy "resources of published roadmaps are public"
  on public.resources for select
  to anon, authenticated
  using (exists (
    select 1 from public.nodes n
    join public.modules m on m.id = n.module_id
    join public.roadmaps r on r.id = m.roadmap_id
    where n.id = node_id and r.status = 'published'
  ));

-- Grants: the catalogue is read-only for every client, account or not.
-- Writes happen through the service role until a maintainer surface exists.
grant select on public.roadmaps, public.modules, public.nodes, public.resources to anon, authenticated;
