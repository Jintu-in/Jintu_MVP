-- Engagement: points, streaks, spaced review.
-- Baseline 4 of 5.
--
-- Points are for momentum, not a credential — the UI says so and nothing in
-- this schema can say otherwise: there is ONE ledger, no verification
-- column, no readiness score, no evidenced anything. If a future feature
-- needs points to prove something to a third party, that feature is wrong.

-- ─────────────────────────────────────────────────────────────────────────────
-- point_events — one ledger
-- ─────────────────────────────────────────────────────────────────────────────

create table public.point_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  source_type text not null check (source_type in ('node', 'review', 'streak')),
  source_id   uuid not null,
  points      int not null check (points between 1 and 100),
  -- Day-stamped so daily caps and streak maths are cheap and unambiguous.
  awarded_on  date not null default current_date,
  awarded_at  timestamptz not null default now(),
  -- One award per thing: finishing the same node twice earns once.
  unique (user_id, source_type, source_id)
);

comment on table public.point_events is
  'One ledger, points for momentum only. Clients read; only the server awards — a client that could insert here could mint points.';

create index point_events_user_day_idx on public.point_events (user_id, awarded_on desc);

alter table public.point_events enable row level security;

create policy "users read their own points"
  on public.point_events for select
  to authenticated
  using (user_id = (select auth.uid()));

-- No insert/update/delete policies: awards happen server-side (service role
-- or definer RPCs added with the retention phase).

-- ─────────────────────────────────────────────────────────────────────────────
-- streaks
-- ─────────────────────────────────────────────────────────────────────────────

create table public.streaks (
  user_id           uuid primary key references public.profiles (id) on delete cascade,
  current_days      int not null default 0 check (current_days >= 0),
  longest_days      int not null default 0 check (longest_days >= 0),
  last_active_on    date,
  -- Two a month, auto-applied. Power cuts, exams, festivals — the freeze is
  -- what keeps a streak humane instead of tyrannical.
  freezes_remaining int not null default 2 check (freezes_remaining between 0 and 2),
  freezes_reset_on  date,
  constraint streaks_longest_holds check (longest_days >= current_days)
);

comment on table public.streaks is
  'One row per user. Clients read; the server maintains it — a client that could write here could fake a streak.';

alter table public.streaks enable row level security;

create policy "users read their own streak"
  on public.streaks for select
  to authenticated
  using (user_id = (select auth.uid()));

-- ─────────────────────────────────────────────────────────────────────────────
-- review_cards — FSRS spaced repetition over what YOU learned
-- ─────────────────────────────────────────────────────────────────────────────

create table public.review_cards (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  node_id          uuid not null references public.nodes (id) on delete cascade,
  -- The card text is the USER'S OWN recall prompt in their own words. It is
  -- never an excerpt of, or a generated summary of, the third-party resource
  -- — that would be storing someone else's content under another name.
  front            text not null check (char_length(front) between 1 and 500),
  back             text not null check (char_length(back) between 1 and 2000),
  stability        real not null default 0 check (stability >= 0),
  difficulty       real not null default 5 check (difficulty between 1 and 10),
  due_on           date not null default current_date,
  last_reviewed_at timestamptz,
  reps             int not null default 0 check (reps >= 0),
  lapses           int not null default 0 check (lapses >= 0)
);

comment on table public.review_cards is
  'Per-user FSRS cards, authored by the user in their own words about a node they finished.';

create index review_cards_due_idx on public.review_cards (user_id, due_on);

alter table public.review_cards enable row level security;

create policy "users read their own cards"
  on public.review_cards for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "users create their own cards"
  on public.review_cards for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "users update their own cards"
  on public.review_cards for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "users delete their own cards"
  on public.review_cards for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Grants: points and streaks are read-only for clients — the server awards
-- and maintains them. Cards are fully the user's own.
grant select on public.point_events, public.streaks to authenticated;
grant select, insert, update, delete on public.review_cards to authenticated;
