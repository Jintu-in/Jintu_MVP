-- ─────────────────────────────────────────────────────────────────────────────
-- 0028 — Phase 4 Part A: the first-run goal and need (V2Goal, V2Need).
--
-- Both live on profiles, both nullable, both purely additive:
--   goal  — what they want to become. Picked from a list or typed; typed
--           goals also get a topic_requests row (0015/0017), same table the
--           catalogue's "not here yet?" box already writes to.
--   need  — one of four fixed options, decides what /today opens on. /today
--           does not exist yet (Phase 6) — this column has nothing reading
--           it until then, same position reminder_prefs was in before its
--           sender existed.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles
  add column if not exists goal text
    check (goal is null or length(btrim(goal)) between 2 and 200);

alter table public.profiles
  add column if not exists need text
    check (need is null or need in ('start', 'finish', 'time', 'show'));

comment on column public.profiles.goal is
  'What they want to become (V2Goal) — picked from a list or typed. Null until first run; editable later, never re-asked automatically.';
comment on column public.profiles.need is
  'What Home should open on (V2Need): start | finish | time | show. Null until Phase 6 builds /today to read it.';
