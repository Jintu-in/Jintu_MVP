-- Curriculum: tracks, paths, modules, resources, rubrics, assignments.
-- ARCHITECTURE.md §3. This is the file Law 2 lives in.
--
-- The whole curriculum is an ordering of other people's work plus assignments
-- we wrote. The ordering and the assignments are ours. The videos and
-- articles are not, and this schema is built so that we cannot accidentally
-- start behaving as though they were: there is nowhere to put a transcript,
-- a summary, or a body of text, and there never will be. A CI check fails the
-- build if such a column appears (scripts/assert-schema-rules.mjs).
--
-- Published curriculum is deliberately world-readable. It is the free public
-- top-of-funnel — indexable, linkable, no account required (§6, Phase 1).

-- ─────────────────────────────────────────────────────────────────────────────
-- tracks
-- ─────────────────────────────────────────────────────────────────────────────

create table public.tracks (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        text not null,
  summary      text not null,
  is_published boolean not null default false,
  created_at   timestamptz not null default now()
);

comment on table public.tracks is
  'A role we prepare people for, e.g. data-analyst-fresher.';

alter table public.tracks enable row level security;

-- anon, not just authenticated: /learn/[track] must render for a search
-- crawler and for someone who has never signed up.
create policy "published tracks are public"
  on public.tracks for select
  to anon, authenticated
  using (is_published);

-- ─────────────────────────────────────────────────────────────────────────────
-- paths — versioned, immutable once published
-- ─────────────────────────────────────────────────────────────────────────────

create table public.paths (
  id           uuid primary key default gen_random_uuid(),
  track_id     uuid not null references public.tracks (id) on delete cascade,
  version      int not null check (version >= 1),
  status       text not null default 'draft'
               check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  unique (track_id, version),
  -- A published path without a timestamp cannot be cited later as "this is
  -- what the cohort was taught on that date".
  constraint paths_published_has_timestamp
    check (status <> 'published' or published_at is not null)
);

comment on table public.paths is
  'A version of a track''s curriculum. Immutable once published — publish a new version instead.';

create index paths_track_id_idx on public.paths (track_id);

alter table public.paths enable row level security;

create policy "published paths are public"
  on public.paths for select
  to anon, authenticated
  using (
    status = 'published'
    and track_id in (select id from public.tracks where is_published)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- modules
-- ─────────────────────────────────────────────────────────────────────────────

create table public.modules (
  id        uuid primary key default gen_random_uuid(),
  path_id   uuid not null references public.paths (id) on delete cascade,
  week_no   int not null check (week_no >= 1),
  title     text not null,
  objective text not null,
  unique (path_id, week_no)
);

comment on column public.modules.objective is
  'What the student can do after this week. Our words, about our assignment.';

alter table public.modules enable row level security;

create policy "modules of published paths are public"
  on public.modules for select
  to anon, authenticated
  using (path_id in (select id from public.paths where status = 'published'));

-- ─────────────────────────────────────────────────────────────────────────────
-- resources — Law 2 lives here
-- ─────────────────────────────────────────────────────────────────────────────

create table public.resources (
  id              uuid primary key default gen_random_uuid(),
  module_id       uuid not null references public.modules (id) on delete cascade,
  kind            text not null
                  check (kind in ('video', 'article', 'docs', 'dataset', 'tool')),
  provider        text not null check (provider in ('youtube', 'web')),
  external_url    text not null check (external_url ~ '^https://'),

  -- Present only for the official IFrame embed. Never used to fetch, proxy,
  -- download, or transcribe anything.
  youtube_video_id text check (youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),

  -- Our own words, or public metadata (title, duration). NOT a description of
  -- the content, not a summary, not an extract.
  title           text not null,
  duration_sec    int check (duration_sec is null or duration_sec > 0),
  position        int not null check (position >= 0),

  health          text not null default 'ok'
                  check (health in ('ok', 'degraded', 'dead')),
  last_checked_at timestamptz,

  unique (module_id, position),

  -- A youtube resource without a video id cannot be embedded; a web resource
  -- with one is a sign someone is storing YouTube data on the wrong row.
  constraint resources_youtube_has_video_id
    check ((provider = 'youtube') = (youtube_video_id is not null))
);

comment on table public.resources is
  'Law 2: URLs and metadata only. No transcript, summary, full_text or content column — not now, not later.';
comment on column public.resources.youtube_video_id is
  'For the official youtube-nocookie IFrame embed only.';

alter table public.resources enable row level security;

create policy "resources of published paths are public"
  on public.resources for select
  to anon, authenticated
  using (
    module_id in (
      select m.id from public.modules m
      join public.paths p on p.id = m.path_id
      where p.status = 'published'
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- rubrics and assignments
-- ─────────────────────────────────────────────────────────────────────────────

create table public.rubrics (
  id        uuid primary key default gen_random_uuid(),
  name      text not null unique,
  criteria  jsonb not null,
  max_score numeric not null check (max_score > 0),
  constraint rubrics_criteria_is_array check (jsonb_typeof(criteria) = 'array')
);

alter table public.rubrics enable row level security;

-- Public on purpose. The landing page tells people the work is "graded
-- against a rubric you can read before you start" — if this were private,
-- our own marketing copy would be false.
create policy "rubrics are public"
  on public.rubrics for select
  to anon, authenticated
  using (true);

create table public.assignments (
  id        uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  kind      text not null
            check (kind in ('sql', 'artifact_link', 'file', 'recording')),
  spec      jsonb not null,
  rubric_id uuid references public.rubrics (id) on delete restrict,
  weight    numeric not null default 1 check (weight > 0),
  unique (module_id, kind)
);

comment on column public.assignments.kind is
  'sql and artifact_link grade deterministically — zero AI cost (Law 1).';

alter table public.assignments enable row level security;

create policy "assignments of published paths are public"
  on public.assignments for select
  to anon, authenticated
  using (
    module_id in (
      select m.id from public.modules m
      join public.paths p on p.id = m.path_id
      where p.status = 'published'
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Immutability of published paths
-- ─────────────────────────────────────────────────────────────────────────────
-- "Immutable once published" is stated in §3 as a property of the data model,
-- so it is enforced by the data model. Without this it is a convention, and a
-- convention is what you break at 1am fixing a typo in week 3 — silently
-- changing what a cohort mid-sprint is being graded against.
--
-- search_path is pinned empty and every identifier is schema-qualified: an
-- unpinned search_path on a trigger function is a privilege-escalation route
-- and Supabase's own linter flags it.

create or replace function public.reject_published_path_change()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
begin
  -- DELETE first and on its own: NEW is unassigned during a delete, and SQL
  -- does not promise to short-circuit AND, so a condition mentioning
  -- new.status can fail even when guarded by `tg_op = 'UPDATE'`.
  if tg_op = 'DELETE' then
    if old.status = 'published' then
      raise exception
        'Path % is published and immutable. Archive it instead of deleting it.', old.id
        using errcode = 'restrict_violation';
    end if;
    return old;
  end if;

  -- UPDATE from here down, so NEW is safe to read.
  if old.status is distinct from 'published' then
    return new;
  end if;

  -- Archiving is the one permitted transition: it retires a version without
  -- rewriting what it said.
  if new.status = 'archived'
     and (to_jsonb(new) - 'status') = (to_jsonb(old) - 'status')
  then
    return new;
  end if;

  raise exception
    'Path % is published and immutable. Create a new version instead.', old.id
    using errcode = 'restrict_violation';
end;
$$;

create trigger paths_immutable_once_published
  before update or delete on public.paths
  for each row execute function public.reject_published_path_change();

create or replace function public.reject_published_content_change()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
declare
  target_path   uuid;
  owning_module uuid;
  parent_status text;
begin
  -- Every NEW/OLD field reference below sits in its own statement, guarded by
  -- the table and the operation it is valid for.
  --
  -- plpgsql resolves record fields when the *statement* runs, not per branch
  -- of an expression. A CASE with `new.path_id` in one arm and
  -- `new.module_id` in another therefore fails on `modules` — where NEW has
  -- no module_id — even though that arm is never taken. Likewise NEW is
  -- unassigned during DELETE and OLD during INSERT, so neither may appear in
  -- an expression that also runs for the other operation.
  if tg_table_name = 'modules' then
    if tg_op = 'DELETE' then
      target_path := old.path_id;
    else
      target_path := new.path_id;
    end if;
  else
    if tg_op = 'DELETE' then
      owning_module := old.module_id;
    else
      owning_module := new.module_id;
    end if;

    select m.path_id into target_path
    from public.modules m where m.id = owning_module;
  end if;

  select p.status into parent_status
  from public.paths p where p.id = target_path;

  if parent_status is distinct from 'published' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  -- Link health is the one thing that must stay writable on a published
  -- path. The check-link-health cron (§6) marks dead resources so a human
  -- can fix them; freezing these two columns would break that job and leave
  -- students clicking 404s in a curriculum nobody is allowed to touch.
  if tg_op = 'UPDATE' and tg_table_name = 'resources' then
    if (to_jsonb(new) - 'health' - 'last_checked_at')
     = (to_jsonb(old) - 'health' - 'last_checked_at')
    then
      return new;
    end if;
  end if;

  raise exception
    'Cannot modify % of a published path. Create a new path version instead.',
    tg_table_name
    using errcode = 'restrict_violation';
end;
$$;

create trigger modules_frozen_when_published
  before insert or update or delete on public.modules
  for each row execute function public.reject_published_content_change();

create trigger resources_frozen_when_published
  before insert or update or delete on public.resources
  for each row execute function public.reject_published_content_change();

create trigger assignments_frozen_when_published
  before insert or update or delete on public.assignments
  for each row execute function public.reject_published_content_change();
