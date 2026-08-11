-- Community tier — user-authored tracks. TRACK_MODEL Part 12 item 9.
--
-- The deal, from Part 3: anyone can author a track; it is verified by
-- structure and peers only; it never calls a model; it is free. The "never"
-- is the load-bearing word — unlimited breadth is affordable precisely
-- because a community track's marginal cost is zero — so it is enforced
-- here as triggers, not remembered as a convention. Three doors lead to a
-- paid check reaching a community track, and all three get a lock:
--
--   1. wiring an assignment to a paid rubric   (trigger on assignments)
--   2. editing a wired rubric to become paid   (trigger on rubrics)
--   3. flipping a paid track's tier down       (trigger on tracks)
--
-- Authoring itself follows the house pattern: definer RPCs with errcodes as
-- client signals (28000 sign in, P0002 onboarding, P0001 not yours), never
-- table-level insert grants. Publishing stays with ops — an author writes
-- their track, and a human decides when it is fit to be public.

-- ─────────────────────────────────────────────────────────────────────────────
-- authorship
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.tracks
  add column if not exists author_id uuid references public.profiles (id) on delete set null;

comment on column public.tracks.author_id is
  'Who wrote it. Set for community tracks; null for house-authored sprints and for drafts nobody has claimed.';

create index if not exists tracks_author_idx on public.tracks (author_id) where author_id is not null;

-- Authors see their own work before it is published; nobody else does. The
-- public policies on these tables are untouched — this is a second door,
-- not a wider first one.
create policy "authors see their own tracks"
  on public.tracks for select
  to authenticated
  using (author_id = (select auth.uid()));

create policy "authors see paths of their own tracks"
  on public.paths for select
  to authenticated
  using (exists (
    select 1 from public.tracks t
    where t.id = track_id and t.author_id = (select auth.uid())
  ));

create policy "authors see modules of their own tracks"
  on public.modules for select
  to authenticated
  using (exists (
    select 1 from public.paths p
    join public.tracks t on t.id = p.track_id
    where p.id = path_id and t.author_id = (select auth.uid())
  ));

-- ─────────────────────────────────────────────────────────────────────────────
-- the wall: community never pays
-- ─────────────────────────────────────────────────────────────────────────────

-- A rubric is free when every criterion is judged by structure or by peers.
-- Fail-closed: a criterion with no archetype at all does not get the benefit
-- of the doubt, because the doubt is exactly where money leaks.
create or replace function public.rubric_is_free(p_criteria jsonb)
returns boolean
language sql
immutable
set search_path = public, pg_temp
as $$
  select not exists (
    select 1 from jsonb_array_elements(coalesce(p_criteria, '[]'::jsonb)) c
    where coalesce(c->>'check', '') not in ('structural', 'peer')
  );
$$;

comment on function public.rubric_is_free is
  'True when every criterion is structural or peer — the only checks a community track may use. Missing archetypes count as paid, on purpose.';

-- Door 1: an assignment on a community track takes only free rubrics.
create or replace function public.community_assignments_stay_free()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_tier text;
  v_criteria jsonb;
begin
  if new.rubric_id is null then
    return new;
  end if;

  select t.tier into v_tier
  from public.modules m
  join public.paths p on p.id = m.path_id
  join public.tracks t on t.id = p.track_id
  where m.id = new.module_id;

  if v_tier = 'community' then
    select criteria into v_criteria from public.rubrics where id = new.rubric_id;
    if not public.rubric_is_free(v_criteria) then
      raise exception 'community tracks are verified by structure and peers only — this rubric carries a paid check'
        using errcode = 'check_violation';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists community_assignments_stay_free on public.assignments;
create trigger community_assignments_stay_free
  before insert or update of rubric_id, module_id on public.assignments
  for each row execute function public.community_assignments_stay_free();

-- Door 2: a rubric in use on a community track cannot be edited into a paid
-- one. The edit is refused, not the wiring — the wiring already passed.
create or replace function public.community_rubrics_stay_free()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if not public.rubric_is_free(new.criteria) and exists (
    select 1
    from public.assignments a
    join public.modules m on m.id = a.module_id
    join public.paths p on p.id = m.path_id
    join public.tracks t on t.id = p.track_id
    where a.rubric_id = new.id and t.tier = 'community'
  ) then
    raise exception 'this rubric grades a community track, which is verified by structure and peers only'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists community_rubrics_stay_free on public.rubrics;
create trigger community_rubrics_stay_free
  before update of criteria on public.rubrics
  for each row execute function public.community_rubrics_stay_free();

-- Door 3: a track whose curriculum uses paid checks cannot be re-tiered to
-- community. Demoting Data Analyst to community would not make its SQL
-- grading free; it would make the tier a lie.
create or replace function public.community_tier_takes_no_paid_checks()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.tier = 'community' and old.tier is distinct from 'community' and exists (
    select 1
    from public.assignments a
    join public.rubrics r on r.id = a.rubric_id
    join public.modules m on m.id = a.module_id
    join public.paths p on p.id = m.path_id
    where p.track_id = new.id and not public.rubric_is_free(r.criteria)
  ) then
    raise exception 'this track''s curriculum uses paid checks; strip them before calling it community'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists community_tier_takes_no_paid_checks on public.tracks;
create trigger community_tier_takes_no_paid_checks
  before update of tier on public.tracks
  for each row execute function public.community_tier_takes_no_paid_checks();

-- ─────────────────────────────────────────────────────────────────────────────
-- authoring
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.author_community_track(p_title text, p_summary text)
returns text
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user    uuid := (select auth.uid());
  v_title   text := btrim(coalesce(p_title, ''));
  v_summary text := btrim(coalesce(p_summary, ''));
  v_slug    text;
  v_open    int;
  v_track   uuid;
begin
  if v_user is null then
    raise exception 'Sign in to write a track'
      using errcode = '28000';
  end if;

  if not exists (select 1 from public.profiles where id = v_user) then
    raise exception 'Finish onboarding before writing a track'
      using errcode = 'P0002';
  end if;

  if length(v_title) < 4 or length(v_title) > 80 then
    raise exception 'Give the track a title between four and eighty characters.'
      using errcode = 'check_violation';
  end if;

  if length(v_summary) < 20 or length(v_summary) > 300 then
    raise exception 'Say what the track prepares someone for — a sentence or two, up to three hundred characters.'
      using errcode = 'check_violation';
  end if;

  -- Three unfinished tracks is a library of good intentions. Finish one.
  select count(*) into v_open
  from public.tracks
  where author_id = v_user and not is_published;

  if v_open >= 3 then
    raise exception 'You have three unpublished tracks already. Finish one before starting another.'
      using errcode = 'too_many_rows';
  end if;

  -- Retrying your own title is not a second track. Checked on the title,
  -- not the slug — the suffixing below would otherwise hand the same author
  -- the same track twice under two addresses.
  if exists (
    select 1 from public.tracks
    where author_id = v_user and lower(title) = lower(v_title)
  ) then
    raise exception 'You already have a track by this title.'
      using errcode = 'unique_violation';
  end if;

  -- Slug from the title; on collision, a short stable suffix from the
  -- author, so two people can independently write "Guitar for beginners".
  v_slug := btrim(regexp_replace(lower(v_title), '[^a-z0-9]+', '-', 'g'), '-');
  if v_slug = '' then
    raise exception 'The title needs some letters or numbers in it.'
      using errcode = 'check_violation';
  end if;
  if exists (select 1 from public.tracks where slug = v_slug) then
    v_slug := v_slug || '-' || substr(md5(v_user::text || v_title), 1, 6);
  end if;

  insert into public.tracks (slug, title, summary, tier, is_published, author_id)
  values (v_slug, v_title, v_summary, 'community', false, v_user)
  returning id into v_track;

  insert into public.paths (track_id, version, status)
  values (v_track, 1, 'draft');

  return v_slug;
end;
$$;

comment on function public.author_community_track is
  'Starts an unpublished community track owned by the caller. 28000 = sign in, P0002 = onboard first, too_many_rows = finish one of your three.';

-- The outline: replace the weeks of the author's own unpublished track.
-- Whole-list replacement, not patching — the caller sends what the outline
-- should be, and the database makes it so or refuses it whole.
create or replace function public.set_community_outline(p_slug text, p_weeks jsonb)
returns int
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user  uuid := (select auth.uid());
  v_track uuid;
  v_path  uuid;
  v_count int;
begin
  if v_user is null then
    raise exception 'Sign in to edit a track'
      using errcode = '28000';
  end if;

  -- Ownership and mutability in one lookup: not yours and does-not-exist are
  -- deliberately the same error, so the RPC confirms nothing about other
  -- people's unpublished work.
  select t.id into v_track
  from public.tracks t
  where t.slug = p_slug and t.author_id = v_user and not t.is_published;

  if v_track is null then
    raise exception 'No unpublished track of yours has that address.'
      using errcode = 'P0001';
  end if;

  if jsonb_typeof(p_weeks) is distinct from 'array'
     or jsonb_array_length(p_weeks) < 1
     or jsonb_array_length(p_weeks) > 12 then
    raise exception 'An outline is one to twelve weeks.'
      using errcode = 'check_violation';
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_weeks) w
    where length(btrim(coalesce(w->>'title', ''))) not between 4 and 80
       or length(btrim(coalesce(w->>'objective', ''))) not between 10 and 300
  ) then
    raise exception 'Every week needs a title (4–80 characters) and an objective (10–300).'
      using errcode = 'check_violation';
  end if;

  select id into v_path
  from public.paths
  where track_id = v_track and status = 'draft'
  order by version desc
  limit 1;

  if v_path is null then
    raise exception 'This track has no draft to edit.'
      using errcode = 'P0001';
  end if;

  -- Replace, in order. Week numbers come from position, not from the caller
  -- — the one thing an outline cannot be is out of sequence.
  delete from public.modules where path_id = v_path;

  insert into public.modules (path_id, week_no, title, objective)
  select v_path, ord, btrim(w->>'title'), btrim(w->>'objective')
  from jsonb_array_elements(p_weeks) with ordinality as e (w, ord);

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

comment on function public.set_community_outline is
  'Replaces the weekly outline of the caller''s own unpublished community track. P0001 = not yours or not editable; refuses malformed outlines whole.';

-- Who may call what. Both RPCs gate on auth.uid() themselves; the grants
-- keep anon from even reaching that check.
revoke all on function public.author_community_track(text, text) from public, anon;
revoke all on function public.set_community_outline(text, jsonb) from public, anon;
grant execute on function public.author_community_track(text, text) to authenticated;
grant execute on function public.set_community_outline(text, jsonb) to authenticated;
