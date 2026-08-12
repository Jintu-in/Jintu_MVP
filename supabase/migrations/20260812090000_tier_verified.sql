-- The tier says what it means: 'sprint' -> 'verified'.
--
-- "Sprint" was the cohort-era name; cohorts are dead (V3.md) and the tier
-- describes VERIFICATION STRENGTH, not a format. The display rename shipped
-- weeks ago; this is the column catching up, which also closes the standing
-- V3 ledger item and the naming drift the authoring review flagged: docs,
-- schema and code now use one word.
--
-- Also here, from the same review: daily reps may be 'detectable' — the
-- schema previously allowed only executable/structural, but a rep like
-- "report the exact spend on keywords with zero conversions" checked against
-- a seeded export is exactly the kind of rep the best tracks want, and
-- detectable is as free to run as the other two.

-- ── the rename ───────────────────────────────────────────────────────────────

alter table public.tracks drop constraint if exists tracks_tier_valid;

update public.tracks set tier = 'verified' where tier = 'sprint';

alter table public.tracks
  add constraint tracks_tier_valid
  check (tier in ('verified', 'community', 'draft'));

-- The margin constraint, re-stated in the new vocabulary. Same rule: a
-- share, once computed, must clear the bar for the paid-verification tier.
alter table public.tracks
  drop constraint if exists tracks_sprint_needs_deterministic;
alter table public.tracks
  add constraint tracks_verified_needs_deterministic
  check (tier <> 'verified'
         or deterministic_share is null
         or deterministic_share >= 0.50);

comment on column public.tracks.tier is
  'verified (machine-checked, the strong badge) | community (structural + peer, never a model) | draft (an outline, no points). Renamed from sprint/community/draft — sprint implied a cohort.';

-- ── reps may be detectable ───────────────────────────────────────────────────

alter table public.daily_reps drop constraint if exists daily_reps_verification_check;
alter table public.daily_reps
  add constraint daily_reps_verification_check
  check (verification in ('executable', 'detectable', 'structural'));

comment on column public.daily_reps.verification is
  'The free archetypes only — executable, detectable, structural. rubric_ai on a daily rep would be an unbounded per-user AI cost, and peer review does not scale to a daily cadence.';
