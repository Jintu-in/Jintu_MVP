-- 0003_curriculum.sql
-- Tracks, units, resources, assignments, rubrics, criteria, answer keys.
--
-- LAW 2 from the architecture, enforced by what is absent: there is no
-- transcript column, no summary column, no full_text column, and there never
-- will be. We store URLs and metadata. The difference between the Google Books
-- safe harbour and the Thomson Reuters v. Ross outcome is exactly this line.
--
-- Answer keys live in their own table with NO client-facing RLS policy. There
-- is no code path from a browser to a key.

create table tracks (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  title           text not null,
  one_line        text,
  tier            track_tier not null default 'draft',
  competency      text not null,
  version         smallint not null default 1,
  author_id       uuid references profiles on delete set null,  -- community tracks
  suggested_pace  text,                                          -- guidance only, never enforced
  badge_threshold integer,                                       -- published on the page
  reviewed_at     date,                                          -- the freshness signal
  changelog       jsonb not null default '[]'::jsonb,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (slug, version)
);
create trigger tracks_updated before update on tracks
  for each row execute function set_updated_at();
create index on tracks (tier, published_at desc);
create index on tracks (competency);

create table units (
  id            uuid primary key default gen_random_uuid(),
  track_id      uuid not null references tracks on delete cascade,
  unit_no       smallint not null check (unit_no > 0),
  title         text not null,
  objective     text not null,
  est_minutes   integer check (est_minutes > 0),
  -- Stated, never enforced. Self-paced learners arrive with uneven prior
  -- knowledge; walling someone behind a unit they already know loses them.
  builds_on     text,
  unique (track_id, unit_no)
);

create table resources (
  id               uuid primary key default gen_random_uuid(),
  unit_id          uuid not null references units on delete cascade,
  kind             text not null check (kind in
                     ('video','article','docs','dataset','tool','practice','book','export')),
  provider         text,
  title            text not null,          -- our own words or public metadata
  external_url     text,
  youtube_video_id text,                   -- official IFrame embed ONLY
  source_label     text,
  duration_sec     integer,
  position         smallint not null default 0,
  required         boolean not null default true,
  -- True when we have not yet verified the URL. Renders as unlinked text
  -- rather than shipping a fabricated link.
  needs_verification boolean not null default false,
  health           text not null default 'ok' check (health in ('ok','degraded','dead')),
  last_checked_at  timestamptz,

  -- A resource must point somewhere, or be explicitly marked unverified.
  constraint resource_has_target check (
    external_url is not null or youtube_video_id is not null or needs_verification
  )
);
create index on resources (unit_id, position);
create index on resources (health) where health <> 'ok';

create table rubrics (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,       -- e.g. 'sql-correctness-v3'
  total        integer not null check (total > 0),
  -- Shown to the learner, e.g. "graded by running your SQL". Per-rubric, not
  -- hardcoded in the component — a shared footer printed a false claim on the
  -- model-graded weeks of the live site.
  grading_note text,
  created_at   timestamptz not null default now()
);

-- Maps 1:1 to the Criterion interface in @jintu/grading. A mismatch between
-- these columns and that type is a bug.
create table rubric_criteria (
  id        uuid primary key default gen_random_uuid(),
  rubric_id uuid not null references rubrics on delete cascade,
  position  smallint not null default 0,
  name      text not null,
  weight    numeric(5,2) not null check (weight > 0),
  check_by  archetype not null,
  checker   text,                          -- registry key; null for peer/mentor
  config    jsonb not null default '{}'::jsonb,

  -- peer and mentor criteria have no checker; everything else must name one.
  constraint checker_matches_archetype check (
    (check_by in ('peer','mentor') and checker is null)
    or (check_by not in ('peer','mentor') and checker is not null)
  )
);
create index on rubric_criteria (rubric_id, position);

-- Weights must sum to the rubric total, or every score built on it silently
-- misreports. Deferred so a rubric can be assembled criterion by criterion
-- inside one transaction.
create or replace function assert_rubric_weights()
returns trigger language plpgsql as $$
declare s numeric; t integer; rid uuid;
begin
  rid := coalesce(new.rubric_id, old.rubric_id);
  select sum(weight) into s from rubric_criteria where rubric_id = rid;
  select total into t from rubrics where id = rid;
  if s is not null and t is not null and s <> t then
    raise exception 'rubric % weights sum to % but total is %', rid, s, t;
  end if;
  return null;
end $$;

create constraint trigger rubric_weights_balance
  after insert or update or delete on rubric_criteria
  deferrable initially deferred
  for each row execute function assert_rubric_weights();

create table assignments (
  id           uuid primary key default gen_random_uuid(),
  unit_id      uuid not null references units on delete cascade,
  rubric_id    uuid not null references rubrics on delete restrict,
  kind         text not null check (kind in
                 ('sql_file','sheet','artifact_link','file','recording','audit_log','text','spec')),
  prompt       text not null,
  points       numeric(5,2) not null check (points > 0),
  -- Optional cross-unit dependency the consistent_with checker uses.
  reads_prior  text,
  -- One artifact per unit. Two means the unit is really two units.
  unique (unit_id)
);

-- Daily reps: 10-20 minutes, free to verify, never rubric_ai or peer.
create table reps (
  id        uuid primary key default gen_random_uuid(),
  unit_id   uuid not null references units on delete cascade,
  rep_no    smallint not null check (rep_no > 0),
  prompt    text not null,
  check_by  archetype not null,
  checker   text not null,
  config    jsonb not null default '{}'::jsonb,
  points    integer not null default 10 check (points between 1 and 10),
  unique (unit_id, rep_no),

  -- A rep is done daily. AI cost and peer load both make that impossible.
  constraint reps_are_free check (check_by in ('executable','detectable','structural'))
);

-- ---------------------------------------------------------------------------
-- Answer keys: isolated table, service role only.
-- ---------------------------------------------------------------------------
create table answer_keys (
  ref         text primary key,            -- e.g. 'keys/da3/u3-audit.json'
  payload     jsonb not null,
  -- Rotate every quarter. Assume any key older than three rotations is public.
  rotation    smallint not null default 1,
  created_at  timestamptz not null default now(),
  rotated_at  timestamptz
);

-- Linkage is one-way: an assignment or rep names a ref, and only the service
-- role can resolve it. Storing the ref rather than a foreign key means a
-- leaked assignment row leaks a filename, not an answer.
alter table assignments add column answer_key_ref text references answer_keys(ref) on delete set null;
alter table reps        add column answer_key_ref text references answer_keys(ref) on delete set null;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table tracks          enable row level security;
alter table units           enable row level security;
alter table resources       enable row level security;
alter table rubrics         enable row level security;
alter table rubric_criteria enable row level security;
alter table assignments     enable row level security;
alter table reps            enable row level security;
alter table answer_keys     enable row level security;

-- Curricula are fully public and require no account. This is the SEO surface
-- and the trust argument; never gate it.
create policy tracks_public   on tracks   for select using (published_at is not null);
create policy units_public    on units    for select using (
  exists (select 1 from tracks t where t.id = track_id and t.published_at is not null));
create policy resources_public on resources for select using (
  exists (select 1 from units u join tracks t on t.id = u.track_id
          where u.id = unit_id and t.published_at is not null));
create policy rubrics_public  on rubrics  for select using (true);
create policy criteria_public on rubric_criteria for select using (true);
create policy reps_public     on reps     for select using (
  exists (select 1 from units u join tracks t on t.id = u.track_id
          where u.id = unit_id and t.published_at is not null));

-- Assignments are public EXCEPT answer_key_ref. Postgres RLS is row-level, not
-- column-level, so the public read goes through a view in 0008 that omits the
-- column, and this table gets no client select policy at all.

-- answer_keys: deliberately no policy. Service role only. If you find yourself
-- adding one, stop.

-- Community authors manage their own drafts.
create policy tracks_author_all on tracks for all
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()) and tier in ('draft','community'));

comment on table answer_keys is
  'Service role only. No RLS policy exists by design. Adding one exposes every planted-defect answer on the platform.';
comment on table resources is
  'URLs and metadata only. No transcript, summary, or full_text column may ever be added here.';
