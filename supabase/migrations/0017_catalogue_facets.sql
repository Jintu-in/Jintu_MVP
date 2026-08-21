-- ─────────────────────────────────────────────────────────────────────────────
-- 0017 — the catalogue's facets become columns, not guesses.
--
-- /learn built its Subject filter from subject_tags[0]. Tags are description:
-- they are per-roadmap, unbounded, and they grow every time somebody imports
-- something. Deriving navigation from them is how a catalogue ends up with
-- nineteen filters that each return one result.
--
-- So: a small closed set of categories for navigation, and subject_tags stays
-- exactly what it is — search terms and card chips. Two facets that no other
-- learning site offers (free certification, no prerequisites) and one that
-- matters on metered mobile data (format) become columns too.
--
-- Re-runnable in full.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. category — navigation, closed set
-- ─────────────────────────────────────────────────────────────────────────────
-- The default is deliberate and load-bearing for the ALTER (an existing table
-- cannot gain a not-null column without one) but it is also a trap: an import
-- that forgets to set a category lands silently in Data. Nothing enforces it
-- yet; when a maintainer surface exists, category should be required there.

alter table public.roadmaps
  add column if not exists category text not null default 'data';

do $$ begin
  alter table public.roadmaps
    add constraint roadmaps_category_is_known
    check (category in ('data', 'software', 'marketing', 'judgement'));
exception when duplicate_object then null; end $$;

comment on column public.roadmaps.category is
  'Navigation facet: one of four. subject_tags is description and may grow freely; this may not.';

update public.roadmaps set category = case slug
  when 'data-analyst'               then 'data'
  when 'java-spring-boot'           then 'software'
  when 'amazon-ads'                 then 'marketing'
  when 'thinking-under-uncertainty' then 'judgement'
  else category
end
where slug in ('data-analyst', 'java-spring-boot', 'amazon-ads', 'thinking-under-uncertainty');

create index if not exists roadmaps_category_idx on public.roadmaps (category);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. derived facet columns
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.roadmaps
  add column if not exists has_free_cert boolean not null default false,
  add column if not exists has_prereqs   boolean not null default false,
  add column if not exists media_mix     text not null default 'mixed';

do $$ begin
  alter table public.roadmaps
    add constraint roadmaps_media_mix_is_known
    check (media_mix in ('reading', 'mixed', 'video'));
exception when duplicate_object then null; end $$;

comment on column public.roadmaps.has_free_cert is
  'The subject has a free certification worth naming (AWS Skill Builder, Amazon Ads certification). Not ours — we issue nothing.';
comment on column public.roadmaps.has_prereqs is
  'Set by a maintainer when the roadmap genuinely assumes earlier knowledge. False is the honest default, not a placeholder.';
comment on column public.roadmaps.media_mix is
  'Computed by recompute_media_mix(). Powers the Format filter, which is the one facet that matters on metered mobile data.';

-- Amazon Ads is the one subject here with a free, real, first-party
-- certification behind it.
update public.roadmaps set has_free_cert = true where slug = 'amazon-ads';

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. media_mix is computed, and stays computable
-- ─────────────────────────────────────────────────────────────────────────────
-- A one-off UPDATE would be wrong the next time a roadmap gains a video, so
-- this is a function the importer and any later job can call again.
--
-- The rule: video minutes as a share of the roadmap's estimated minutes.
-- Under 20% is reading, 50% or more is video, between them is mixed.
--
-- KNOWN DATA GAP, stated rather than papered over: duration_sec is null on
-- most video rows today, so the numerator is far smaller than the truth and
-- every roadmap currently computes to 'reading'. That is a backfill problem
-- (the link checker sees each video; it could record the duration), not a
-- reason to invent a number here. The Format filter renders as soon as the
-- data can tell two roadmaps apart.

create or replace function public.recompute_media_mix()
  returns integer
  language plpgsql
  security definer
  set search_path = ''
as $fn$
declare
  touched integer;
begin
  with node_minutes as (
    select r.id as roadmap_id, sum(n.est_minutes)::numeric as est_min
    from public.roadmaps r
    join public.modules m on m.roadmap_id = r.id
    join public.nodes n on n.module_id = m.id
    group by r.id
  ),
  video_minutes as (
    -- Joined through nodes, not through node_minutes: aggregating both in one
    -- join would multiply every node's estimate by its resource count.
    select r.id as roadmap_id,
           sum(coalesce(res.duration_sec, 0))::numeric / 60 as vid_min
    from public.roadmaps r
    join public.modules m on m.roadmap_id = r.id
    join public.nodes n on n.module_id = m.id
    join public.resources res on res.node_id = n.id
    where res.type = 'video'
    group by r.id
  ),
  share as (
    select nm.roadmap_id,
           case when nm.est_min > 0
                then coalesce(vm.vid_min, 0) / nm.est_min
                else 0
           end as ratio
    from node_minutes nm
    left join video_minutes vm on vm.roadmap_id = nm.roadmap_id
  )
  update public.roadmaps r
  set media_mix = case
        when s.ratio >= 0.50 then 'video'
        when s.ratio >= 0.20 then 'mixed'
        else 'reading'
      end
  from share s
  where s.roadmap_id = r.id
    and r.media_mix is distinct from (case
        when s.ratio >= 0.50 then 'video'
        when s.ratio >= 0.20 then 'mixed'
        else 'reading'
      end);

  get diagnostics touched = row_count;
  return touched;
end;
$fn$;

comment on function public.recompute_media_mix() is
  'Recomputes roadmaps.media_mix from resource durations. Returns rows changed. Run after any import.';

revoke execute on function public.recompute_media_mix() from public, anon, authenticated;

select public.recompute_media_mix();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. topic_requests grows a source and an IP hash
-- ─────────────────────────────────────────────────────────────────────────────
-- 0015 built this for the 404 page. The catalogue's "not here yet?" box is a
-- second mouth on the same table, and knowing which one produced a row is the
-- difference between "people search for kubernetes" and "people follow dead
-- links to kubernetes".
--
-- ip_hash is SHA-256, never an address, and exists only so the rate limit has
-- something to count. Same posture as auth_attempts (0006).

alter table public.topic_requests
  add column if not exists source  text not null default 'sidebar',
  add column if not exists ip_hash text;

do $$ begin
  alter table public.topic_requests
    add constraint topic_requests_source_is_known
    check (source in ('sidebar', 'no_results', 'not_found'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.topic_requests
    add constraint topic_requests_ip_hash_is_a_hash
    check (ip_hash is null or ip_hash ~ '^[0-9a-f]{64}$');
exception when duplicate_object then null; end $$;

comment on column public.topic_requests.source is
  'Which surface asked: the catalogue sidebar, the catalogue no-results state, or a 404 on a roadmap slug.';
comment on column public.topic_requests.ip_hash is
  'SHA-256 of the requesting IP. Counted by the rate limit, readable by nobody, never a plaintext address.';

-- Rows written before this migration came from the 404 page.
update public.topic_requests set source = 'not_found' where from_slug is not null;

-- The rate limit counts by (ip_hash, created_at); nothing else reads it.
create index if not exists topic_requests_ip_recent_idx
  on public.topic_requests (ip_hash, created_at desc)
  where ip_hash is not null;

-- No new grants: the insert policy from 0015 still covers anon, and the
-- counting side runs as the service role, which RLS does not apply to.
