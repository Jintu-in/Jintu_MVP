-- ─────────────────────────────────────────────────────────────────────────────
-- 0029 — Phase 4 Part B: the avatar (V2Avatar/DeskAvatar).
--
-- Both nullable with real defaults applied at write time (not a column
-- DEFAULT), so an existing account with neither set still reads as
-- fox/teal everywhere avatar-kit.tsx's DEFAULT_ANIMAL/DEFAULT_COLOR are
-- used — same 16 names and 8 colours as the design's own renderVals().
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.profiles
  add column if not exists avatar_animal text
    check (avatar_animal is null or avatar_animal in (
      'bear', 'lion', 'elephant', 'hippo', 'koala', 'panda', 'monkey', 'pig',
      'penguin', 'rabbit', 'fox', 'sheep', 'tiger', 'cat', 'owl', 'frog'
    ));

alter table public.profiles
  add column if not exists avatar_color text
    check (avatar_color is null or avatar_color in (
      'teal', 'amber', 'green', 'coral', 'pink', 'violet', 'sky', 'sand'
    ));

comment on column public.profiles.avatar_animal is
  'One of 16 fixed animals (V2Avatar/AvatarKit). Null = not chosen yet; the app defaults to fox.';
comment on column public.profiles.avatar_color is
  'One of 8 fixed background colours (V2Avatar/AvatarKit). Null = not chosen yet; the app defaults to teal.';
