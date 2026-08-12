-- V3: "Start this track" — open, self-paced, free.
--
-- The cohort model is dead as a product (V3.md), but the schema underneath
-- it is how everything else works: enrollments hang off cohorts, and
-- submissions, grading, peer review, points and readiness all hang off
-- enrollments. So the open platform starts a track by enrolling into a
-- ROLLING INTAKE — a cohort row no page ever mentions, with no real dates,
-- no seat scarcity and no price. One intake per live path, created lazily,
-- shared by everyone who starts that track.
--
-- This keeps every rule that still matters (session gate, 18+ profile gate,
-- idempotent re-start, withdraw-and-return) because start_track delegates
-- to enrol_me rather than reimplementing it.

alter table public.cohorts
  add column if not exists is_intake boolean not null default false;

comment on column public.cohorts.is_intake is
  'V3 rolling intake: an implementation detail, not a product. Intakes have no real dates and effectively no capacity; the UI never shows them as cohorts.';

create or replace function public.start_track(p_slug text)
returns uuid
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_track  uuid;
  v_path   uuid;
  v_intake uuid;
begin
  -- Published and startable. Draft tier is an outline nobody wrote — there
  -- is nothing to submit to, so there is nothing to start. Unknown slug and
  -- draft answer identically on purpose.
  select t.id into v_track
  from public.tracks t
  where t.slug = p_slug and t.is_published and t.tier <> 'draft';

  if v_track is null then
    raise exception 'No open track has that address.'
      using errcode = 'P0001';
  end if;

  -- The live path: highest published version, same rule the pages apply.
  select p.id into v_path
  from public.paths p
  where p.track_id = v_track and p.status = 'published'
  order by p.version desc
  limit 1;

  if v_path is null then
    raise exception 'No open track has that address.'
      using errcode = 'P0001';
  end if;

  -- One intake per live path. The advisory lock serialises the
  -- find-or-create so two first-starters cannot race a duplicate into
  -- existence; it releases at commit.
  perform pg_advisory_xact_lock(hashtextextended('jintu_intake:' || p_slug, 0));

  select c.id into v_intake
  from public.cohorts c
  where c.path_id = v_path and c.is_intake and c.status = 'open'
  limit 1;

  if v_intake is null then
    -- Dates and capacity exist because the columns are NOT NULL, not
    -- because they mean anything: the window is a decade and the capacity
    -- is a number no organic use reaches. Nothing renders either.
    insert into public.cohorts (path_id, mode, starts_on, ends_on, capacity, status, is_intake)
    values (v_path, 'public', current_date, current_date + interval '10 years', 1000000, 'open', true)
    returning id into v_intake;
  end if;

  -- All the gates that still matter live in enrol_me and stay there:
  -- 28000 without a session, P0002 without a profile (the 18+ gate),
  -- idempotent on re-start, reactivating after a withdrawal.
  return public.enrol_me(v_intake);
end;
$$;

comment on function public.start_track is
  'V3 open start: find-or-create the rolling intake for a track''s live path and enrol the caller through enrol_me. Free, self-paced, no seats.';

-- Same audience as enrol_me: anon may call and will get 28000, which is the
-- signal the client turns into the sign-in dialog.
grant execute on function public.start_track(text) to anon, authenticated;
