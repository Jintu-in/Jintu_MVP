-- 0008_views_guards.sql
-- Public views, the readiness definition, and the publish guard.
--
-- Two things here are the whole integrity story:
--
--   1. readiness reads ONLY ledger='proof', enforced in the VIEW definition
--      rather than in application code, so no future feature can quietly break
--      it by forgetting a filter.
--
--   2. A track cannot reach 'verified' tier unless >=50% of its POINTS are
--      machine-checked. Points, not criteria count — five 1-point structural
--      checks beside an 8-point AI criterion is 5 of 6 criteria and only 38% of
--      points, which is how a careful author accidentally ships an
--      unverifiable credential.

-- ---------------------------------------------------------------------------
-- Public assignment view. Postgres RLS is row-level, not column-level, so the
-- answer key is excluded by projection rather than by policy.
-- ---------------------------------------------------------------------------
-- security_invoker = FALSE, and that is load-bearing: assignments has no
-- client select policy at all (the table would expose answer_key_ref), so an
-- invoker view runs as the caller, hits that empty policy set, and returns
-- ZERO rows to every client — the public curriculum read was broken. As a
-- definer view it bypasses the table's RLS, which is exactly the intent, so
-- it must scope itself to published tracks the way the table policies on
-- units/resources do — a definer view with no WHERE would leak unpublished
-- assignments.
create or replace view assignments_public
with (security_invoker = false) as
select a.id, a.unit_id, a.rubric_id, a.kind, a.prompt, a.points, a.reads_prior
from assignments a
where exists (
  select 1 from units u join tracks t on t.id = u.track_id
  where u.id = a.unit_id and t.published_at is not null
);
-- answer_key_ref is absent. Deliberately. Never add it here.

grant select on assignments_public to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Readiness. The number a recruiter might see.
-- ---------------------------------------------------------------------------
create or replace view readiness as
select
  p.id as user_id,
  p.handle,
  t.id   as track_id,
  t.slug as track_slug,
  -- Total proof points, whatever the mechanism.
  coalesce(sum(pe.points), 0) as proof_points,
  -- Of those, the machine-checked subset. This is the publishable figure.
  coalesce(sum(pe.points) filter (
    where pe.verification in ('executable','detectable','structural')
  ), 0) as evidenced_points,
  coalesce(sum(pe.points) filter (where pe.verification = 'peer'), 0)      as peer_points,
  coalesce(sum(pe.points) filter (where pe.verification = 'rubric_ai'), 0) as model_points,
  t.badge_threshold,
  coalesce(sum(pe.points), 0) >= coalesce(t.badge_threshold, 2147483647) as badge_earned,
  count(distinct s.assignment_id) as artifacts_submitted,
  e.started_at,
  e.completed_at
from profiles p
join enrollments e on e.user_id = p.id
join tracks t on t.id = e.track_id
left join submissions s on s.enrollment_id = e.id
-- gradings used to be joined here and no column of it was selected: a pure
-- row multiplier. A submission with two grading rows (re-grade, appeal)
-- doubled its proof points in this view. [audit: join removed]
left join point_events pe
       on pe.user_id = p.id
      and pe.source_id = s.id
      and pe.ledger = 'proof'          -- THE FILTER. Consistency never counts.
      and pe.voided_at is null
group by p.id, p.handle, t.id, t.slug, t.badge_threshold, e.started_at, e.completed_at;

-- Consistency is shown, separately and honestly, and buys nothing on the credential.
create or replace view consistency_summary as
select
  p.id as user_id,
  p.handle,
  coalesce(sum(pe.points), 0) as consistency_points,
  st.current_days,
  st.longest_days,
  st.freezes_remaining
from profiles p
left join streaks st on st.user_id = p.id
left join point_events pe
       on pe.user_id = p.id and pe.ledger = 'consistency' and pe.voided_at is null
group by p.id, p.handle, st.current_days, st.longest_days, st.freezes_remaining;

-- ---------------------------------------------------------------------------
-- The public proof profile at /p/[handle].
-- Gated on explicit public_profile consent, not on a global default.
-- ---------------------------------------------------------------------------
create or replace view public_profiles
with (security_invoker = false) as
select
  p.handle,
  p.full_name,
  p.avatar_url,
  r.track_slug,
  r.proof_points,
  r.evidenced_points,
  r.artifacts_submitted,
  r.badge_earned,
  r.completed_at,
  cs.current_days as streak_days
from profiles p
join readiness r on r.user_id = p.id
left join consistency_summary cs on cs.user_id = p.id
where has_consent(p.id, 'public_profile');

grant select on public_profiles to anon, authenticated;

-- ---------------------------------------------------------------------------
-- The publish guard.
-- ---------------------------------------------------------------------------
create or replace function track_deterministic_share(p_track uuid)
returns numeric language sql stable as $$
  with pts as (
    select rc.check_by, sum(rc.weight) as w
    from units u
    join assignments a on a.unit_id = u.id
    join rubric_criteria rc on rc.rubric_id = a.rubric_id
    where u.track_id = p_track
    group by rc.check_by
  )
  select case
    when coalesce(sum(w), 0) = 0 then 0
    else round(
      coalesce(sum(w) filter (where check_by in ('executable','detectable','structural')), 0)
      / sum(w), 4)
  end
  from pts
$$;

create or replace function assert_verified_tier_is_verifiable()
returns trigger language plpgsql as $$
declare share numeric; missing text;
begin
  if new.tier <> 'verified' then return new; end if;

  share := track_deterministic_share(new.id);
  if share < 0.50 then
    -- %%% is one value placeholder followed by a literal percent sign; the
    -- original '%%' was a literal-only, which left RAISE with two arguments
    -- for one placeholder and failed at CREATE FUNCTION.
    raise exception
      'track % cannot be verified: only %%% of points are machine-checked (50%% required)',
      new.slug, round(share * 100, 1);
  end if;

  -- A criterion naming a checker that does not exist would silently route
  -- every submission to a human forever.
  select string_agg(rc.name || ' -> ' || coalesce(rc.checker, 'none'), '; ')
  into missing
  from units u
  join assignments a on a.unit_id = u.id
  join rubric_criteria rc on rc.rubric_id = a.rubric_id
  where u.track_id = new.id
    and rc.check_by not in ('peer','mentor')
    and rc.checker not in (
      'sql_diff','numeric_cells','formula_present','consistent_with',
      'answer_key_match','non_empty','has_sections','duration_between',
      'media_has_audio','url_reachable','contains_pattern','row_count_ceiling',
      'rubric_score'
    );
  if missing is not null then
    raise exception 'track % declares unknown checkers: %', new.slug, missing;
  end if;

  -- Every detectable criterion needs a key that actually exists, or the
  -- checker returns "cannot verify" for every learner forever.
  if exists (
    select 1 from units u
    join assignments a on a.unit_id = u.id
    join rubric_criteria rc on rc.rubric_id = a.rubric_id
    where u.track_id = new.id and rc.check_by = 'detectable'
      and (a.answer_key_ref is null
           or not exists (select 1 from answer_keys k where k.ref = a.answer_key_ref))
  ) then
    raise exception 'track % has a detectable criterion with no answer key', new.slug;
  end if;

  return new;
end $$;

create trigger tracks_verified_guard before insert or update of tier on tracks
  for each row execute function assert_verified_tier_is_verifiable();

-- Community tracks must never call a paid model. This is what makes unlimited
-- breadth affordable; a single rubric_ai criterion in a community track would
-- turn hundreds of free tracks into an open-ended bill.
create or replace function assert_community_is_free()
returns trigger language plpgsql as $$
begin
  if new.tier = 'community' and exists (
    select 1 from units u
    join assignments a on a.unit_id = u.id
    join rubric_criteria rc on rc.rubric_id = a.rubric_id
    where u.track_id = new.id and rc.check_by = 'rubric_ai'
  ) then
    raise exception 'community track % may not use rubric_ai — structural and peer only', new.slug;
  end if;
  return new;
end $$;

create trigger tracks_community_guard before insert or update of tier on tracks
  for each row execute function assert_community_is_free();

-- Drafts award nothing. Guards against the failure mode where 18 unfinished
-- tracks quietly start minting points and poison the credential on day one.
create or replace function assert_draft_awards_nothing()
returns trigger language plpgsql security definer set search_path = public as $$
declare tier_of track_tier;
begin
  if new.source_type <> 'artifact' then return new; end if;
  select t.tier into tier_of
  from submissions s
  join enrollments e on e.id = s.enrollment_id
  join tracks t on t.id = e.track_id
  where s.id = new.source_id;
  if tier_of = 'draft' then
    raise exception 'draft tracks award no points';
  end if;
  return new;
end $$;
create trigger point_events_no_draft_points before insert on point_events
  for each row execute function assert_draft_awards_nothing();

-- ---------------------------------------------------------------------------
-- Operational sanity checks. Run after any curriculum change.
-- ---------------------------------------------------------------------------
create or replace view schema_health as
select 'tables without RLS' as check_name, count(*)::text as value
from pg_tables t
where t.schemaname = 'public'
  and not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = t.tablename and c.relrowsecurity)
union all
select 'verified tracks below 50% deterministic',
       count(*)::text from tracks
where tier = 'verified' and track_deterministic_share(id) < 0.50
union all
select 'resources marked dead', count(*)::text from resources where health = 'dead'
union all
select 'submissions stuck needing humans',
       count(*)::text from submissions
where status = 'needs_human' and submitted_at < now() - interval '7 days'
union all
select 'suspected reciprocal review pairs',
       count(*)::text from suspected_reciprocal_reviews;

comment on view readiness is
  'Reads ONLY ledger=proof. The filter lives here rather than in app code so no feature can quietly break it.';
comment on function assert_verified_tier_is_verifiable is
  'The 50% rule as a database constraint. Computed from points, not criteria count.';
