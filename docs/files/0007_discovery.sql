-- 0007_discovery.sql
-- Topic search, votes, and cached draft outlines.
--
-- THE COST MECHANIC: generation is keyed to the normalised TOPIC, never to the
-- person. Ten thousand people typing "data analyst" cost zero API calls
-- because the outline is cached forever against a hash. Only a genuinely novel
-- string generates, once, on the cheap model — a few rupees, then free for
-- everyone after.
--
-- The by-product is more valuable than the feature: topic_queries is a ranked
-- answer to "which track do we build next", measured rather than guessed.

create table topic_queries (
  id              bigserial primary key,
  raw_query       text not null check (length(raw_query) between 1 and 200),
  normalized_key  text not null,
  -- Which of the three routes the search resolved to.
  route           text not null check (route in ('verified','community','closest','draft','none')),
  matched_track   uuid references tracks on delete set null,
  user_id         uuid references profiles on delete set null,
  session_hash    text,
  created_at      timestamptz not null default now()
);
create index on topic_queries (normalized_key, created_at desc);
create index on topic_queries (created_at desc);

-- Normalisation is what makes caching work. "Data Analyst", "data analyst",
-- "i want to become a data analyst" and "DATA  ANALYST!" must all collapse to
-- one key, or the cache never hits and every search costs money.
create or replace function normalize_topic(q text)
returns text language sql immutable as $$
  select regexp_replace(
    regexp_replace(
      regexp_replace(
        lower(trim(q)),
        -- Strip lead-ins people actually type.
        '^(i want to (be|become|learn)( an?)?|how to (be|become|learn)|learn|become|study|teach me)\s+', '', 'g'
      ),
      '[^a-z0-9 ]+', ' ', 'g'          -- punctuation out
    ),
    '\s+', '-', 'g'                     -- collapse whitespace to hyphens
  )
$$;

create table topic_votes (
  id              bigserial primary key,
  normalized_key  text not null,
  user_id         uuid references profiles on delete cascade,
  -- Pre-account voting is allowed, deduped on a hashed identifier. A vote is a
  -- demand signal, not a credential, so a soft identity is the right trade.
  voter_hash      text,
  created_at      timestamptz not null default now(),
  constraint vote_has_identity check (user_id is not null or voter_hash is not null)
);
create unique index topic_votes_user_unique
  on topic_votes (normalized_key, user_id) where user_id is not null;
create unique index topic_votes_hash_unique
  on topic_votes (normalized_key, voter_hash) where user_id is null;
create index on topic_votes (normalized_key);

-- Cached once, served forever. cost_paise records what the single generation
-- cost so the cache's value is measurable.
create table draft_outlines (
  normalized_key  text primary key,
  display_title   text not null,
  outline         jsonb not null,
  model           text,
  cost_paise      integer not null default 0,
  -- Resources in a draft are validated at generation time: generated, fetched,
  -- and discarded if they do not return 2xx. A hallucinated URL on the main
  -- public surface is a credibility problem that is hard to undo.
  urls_validated  boolean not null default false,
  generated_at    timestamptz not null default now(),
  -- Drafts are noindex. A hundred thin auto-generated pages is exactly what
  -- Google's March 2024 scaled-content-abuse policy targets, and a manual
  -- action would take down the verified tracks with them.
  indexable       boolean not null default false
);

-- The build queue, ranked by measured demand.
create or replace view topic_demand as
select
  coalesce(v.normalized_key, q.normalized_key) as normalized_key,
  coalesce(d.display_title, initcap(replace(coalesce(v.normalized_key, q.normalized_key), '-', ' '))) as title,
  coalesce(v.votes, 0)    as votes,
  coalesce(q.searches, 0) as searches,
  d.generated_at is not null as has_draft,
  t.id                    as existing_track,
  t.tier                  as existing_tier
from (select normalized_key, count(*) as votes from topic_votes group by 1) v
full outer join (
  select normalized_key, count(*) as searches from topic_queries group by 1
) q on q.normalized_key = v.normalized_key
left join draft_outlines d on d.normalized_key = coalesce(v.normalized_key, q.normalized_key)
left join tracks t on t.slug = coalesce(v.normalized_key, q.normalized_key)
order by coalesce(v.votes, 0) desc, coalesce(q.searches, 0) desc;

-- Promotion threshold: 100 votes turns a draft into a track worth building.
create or replace view ready_to_promote as
select * from topic_demand
where votes >= 100 and existing_track is null
order by votes desc;

-- Rate limit: three novel generations per session. Nobody needs a fourth, and
-- without this a scripted client can mint API spend at will.
create or replace function novel_generations_today(p_session text)
returns integer language sql stable security definer set search_path = public as $$
  select count(distinct q.normalized_key)::int
  from topic_queries q
  left join draft_outlines d on d.normalized_key = q.normalized_key
  where q.session_hash = p_session
    and q.created_at > now() - interval '24 hours'
    and (d.generated_at is null or d.generated_at > q.created_at)
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table topic_queries  enable row level security;
alter table topic_votes    enable row level security;
alter table draft_outlines enable row level security;

-- Anyone may search and vote, including before signing up.
create policy topic_queries_insert on topic_queries for insert with check (true);
create policy topic_votes_insert   on topic_votes   for insert with check (true);
create policy topic_votes_own      on topic_votes   for select
  using (user_id = (select auth.uid()));
-- Cached outlines are public reading.
create policy drafts_public on draft_outlines for select using (true);

comment on function normalize_topic is
  'Collapses query variants to one cache key. Without this the cache never hits and every search costs money.';
comment on column draft_outlines.indexable is
  'Drafts are noindex. Mass auto-generated pages are what Googles scaled-content-abuse policy targets.';
