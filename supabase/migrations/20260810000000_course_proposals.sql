-- ─────────────────────────────────────────────────────────────────────────────
-- Course proposals and votes
--
-- Eighteen tracks were published as six-week courses carrying three resources
-- and three artifacts each. Spread over six weeks that is not a course, it is
-- a sketch, and publishing it meant every visitor who clicked past the one
-- finished track found the product unfinished. The free curriculum is the
-- entire conversion mechanism, so that was working directly against the funnel.
--
-- Deleting them would throw away the useful part: the titles and summaries are
-- good, and the fact that someone wants an Android track is worth knowing. So
-- a track can now be a *proposal* instead — not a course you can start, a
-- thing you can ask for. The emptiness stops being a broken promise and starts
-- being a demand signal, and the ranked list of what to build second comes
-- free.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.tracks
  add column if not exists is_proposed boolean not null default false;

comment on column public.tracks.is_proposed is
  'A course we have not built. Renders a vote page, never a curriculum.';

-- Published and proposed are mutually exclusive by construction. Without this
-- a track could be both, and the /learn index would list the same slug as a
-- finished course and as something to vote for.
alter table public.tracks
  drop constraint if exists tracks_not_both_published_and_proposed;
alter table public.tracks
  add constraint tracks_not_both_published_and_proposed
  check (not (is_published and is_proposed));

-- NOTE: the "published tracks are public" policy is deliberately NOT widened
-- to include proposals. RLS stays the single answer to "is this a live
-- course?", which is what keeps listPublishedTracks free of an is_published
-- filter it could forget. Proposals are reachable only through the two
-- security-definer functions at the bottom of this file, which return exactly
-- the columns a vote page needs and nothing else.

-- ─────────────────────────────────────────────────────────────────────────────
-- votes
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.track_votes (
  id         uuid primary key default gen_random_uuid(),
  track_id   uuid not null references public.tracks (id) on delete cascade,

  -- A random id the browser mints and keeps in localStorage. Deliberately not
  -- an IP address, a fingerprint, or a user id: under DPDP an IP is personal
  -- data, and this feature does not need to know who anyone is to count how
  -- many people want an Android track.
  --
  -- It is weak. Clearing site data lets someone vote twice, and nothing here
  -- pretends otherwise — which is why the UI says "votes", never "people", and
  -- why this number must never appear in marketing copy as evidence of demand.
  voter_key  uuid not null,

  created_at timestamptz not null default now(),

  unique (track_id, voter_key)
);

-- Written as one literal, not adjacent concatenated strings: Postgres joins
-- those but assert-schema-rules.mjs reads the migration text and only sees the
-- first, so the "service-role only" declaration would go unnoticed by the
-- guard while looking correct in the database.
comment on table public.track_votes is
  'One vote for an unbuilt course. Anonymous by design — see voter_key. No policy on purpose: service-role only for direct access, because the raw rows would let anyone enumerate voter keys and correlate which courses one browser asked for. Clients read counts through proposed_courses() and write through cast_course_vote(), both security definer.';

create index if not exists track_votes_track_id_idx
  on public.track_votes (track_id);

alter table public.track_votes enable row level security;

-- No select policy, and none is wanted: the raw rows would let anyone
-- enumerate voter keys and correlate which courses one browser asked for.
-- Counts come from proposed_courses() below, which aggregates before
-- returning. Insert goes through cast_course_vote() rather than a policy, so
-- the "one vote per browser per track" rule lives in one place.
--
-- service-role only for direct access.

-- ─────────────────────────────────────────────────────────────────────────────
-- read + write API
-- ─────────────────────────────────────────────────────────────────────────────

-- Every proposal with its vote count, most wanted first.
--
-- security definer because proposals are invisible to anon under RLS by
-- design. search_path is pinned: a definer function that resolves names
-- through the caller's search_path is the classic privilege-escalation hole.
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
  where t.is_proposed
  group by t.slug, t.title, t.summary
  order by count(v.id) desc, t.title asc
$$;

grant execute on function public.proposed_courses() to anon, authenticated;

-- Records a vote and returns the new count for that course.
--
-- Returns the count rather than void so the page can update without a second
-- round trip, and `on conflict do nothing` makes a repeat vote a no-op instead
-- of an error — pressing the button twice is not a failure worth showing
-- someone.
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
  -- this, a caller could vote for an unpublished draft, or for a real course.
  select id into v_track
  from public.tracks
  where slug = p_slug and is_proposed;

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

grant execute on function public.cast_course_vote(text, uuid) to anon, authenticated;
