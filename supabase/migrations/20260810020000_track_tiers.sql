-- ─────────────────────────────────────────────────────────────────────────────
-- Track tiers
--
-- TRACK_MODEL.md Part 3 defines three tiers, and Part 11 records that what
-- shipped instead was a boolean: `is_proposed`. The boolean is a strict subset
-- — a proposal is a draft — so this is a rename with room in it, done now
-- because every week it stays a boolean is another caller to migrate later.
--
--   sprint     Jontu writes it. Paid cohort. Must clear the margin bar below.
--   community  A user writes it. Structural + peer verification only, so it
--              never costs an API call. Free.
--   draft      Nobody has written it. Renders a vote page.
--
-- `is_published` stays and keeps its meaning — "this is live and anon can read
-- it". Tier says what kind of thing it is; is_published says whether it is
-- open yet. RLS continues to gate on is_published alone, which is what keeps
-- "is this a live course?" a question with one answer.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.tracks
  add column if not exists tier text;

-- Backfill before the NOT NULL. A proposal becomes a draft; anything already
-- published is a sprint, since sprint is the only tier that has ever been
-- published. Anything neither published nor proposed is half-written, which is
-- also a draft.
update public.tracks
   set tier = case when is_published then 'sprint' else 'draft' end
 where tier is null;

alter table public.tracks
  alter column tier set default 'draft';

alter table public.tracks
  alter column tier set not null;

alter table public.tracks
  drop constraint if exists tracks_tier_valid;
alter table public.tracks
  add constraint tracks_tier_valid
  check (tier in ('sprint', 'community', 'draft'));

comment on column public.tracks.tier is
  'sprint = paid, must be >=50% deterministically verified. community = user-authored, structural and peer only, never an API call. draft = unwritten, renders a vote page. See TRACK_MODEL.md Part 3.';

-- Replaces tracks_not_both_published_and_proposed. Same invariant, said in
-- terms of the tier: a draft is by definition unwritten, so it cannot be live.
alter table public.tracks
  drop constraint if exists tracks_not_both_published_and_proposed;
alter table public.tracks
  drop constraint if exists tracks_draft_is_not_published;
alter table public.tracks
  add constraint tracks_draft_is_not_published
  check (not (is_published and tier = 'draft'));

-- ─────────────────────────────────────────────────────────────────────────────
-- The margin, as a constraint
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.tracks
  add column if not exists verification_profile jsonb;

alter table public.tracks
  add column if not exists deterministic_share numeric;

alter table public.tracks
  drop constraint if exists tracks_share_is_a_fraction;
alter table public.tracks
  add constraint tracks_share_is_a_fraction
  check (deterministic_share is null
         or (deterministic_share >= 0 and deterministic_share <= 1));

comment on column public.tracks.deterministic_share is
  'Fraction of artifact POINTS verified by archetypes 1-3. Points, not artifact count: a 1-point structural check must not offset an 8-point AI-rubric artifact (TRACK_MODEL.md Part 10).';

/*
  TRACK_MODEL.md Part 7 asks for this as a generated column. It cannot be one.

  A generated column may only read other columns of the same row, and the
  share is computed from assignment points hanging off modules hanging off
  paths. Postgres will reject the expression outright. It has to be maintained
  by whatever writes the verification model — a trigger on assignments, or the
  job that publishes a path — and neither exists yet, because assignments do
  not carry a verification archetype at all.

  So it is a plain nullable column today, and the constraint below is written
  to permit NULL. That is deliberate and it is the honest state: the database
  cannot yet compute the number, so it does not pretend to enforce it. What it
  DOES enforce is that a share, once set, must clear the bar for a sprint —
  which is the case that would actually cost money.
*/
alter table public.tracks
  drop constraint if exists tracks_sprint_needs_deterministic;
alter table public.tracks
  add constraint tracks_sprint_needs_deterministic
  check (tier <> 'sprint'
         or deterministic_share is null
         or deterministic_share >= 0.50);

-- ─────────────────────────────────────────────────────────────────────────────
-- Callers
-- ─────────────────────────────────────────────────────────────────────────────

-- Unchanged in signature and behaviour; reads tier instead of the boolean.
create or replace function public.proposed_courses()
returns table (slug text, title text, summary text, votes bigint)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select t.slug,
         t.title,
         t.summary,
         count(v.id) as votes
  from public.tracks t
  left join public.track_votes v on v.track_id = t.id
  where t.tier = 'draft' and not t.is_published
  group by t.slug, t.title, t.summary
  order by count(v.id) desc, t.title asc
$$;

create or replace function public.cast_course_vote(p_slug text, p_voter_key uuid)
returns bigint
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_track uuid;
  v_count bigint;
begin
  -- Resolved here rather than trusting a track id from the client: without
  -- this, a caller could vote for a half-written draft, or for a real course.
  select id into v_track
  from public.tracks
  where slug = p_slug and tier = 'draft' and not is_published;

  if v_track is null then
    raise exception 'No course proposal with slug %', p_slug
      using errcode = 'no_data_found';
  end if;

  insert into public.track_votes (track_id, voter_key)
  values (v_track, p_voter_key)
  on conflict (track_id, voter_key) do nothing;

  select count(*) into v_count
  from public.track_votes
  where track_id = v_track;

  return v_count;
end;
$$;

-- Dropped last, so nothing above is left reading a column that has gone.
alter table public.tracks
  drop column if exists is_proposed;
