-- Progress: what YOU have done with the catalogue.
-- Baseline 3 of 5.
--
-- Everything in this file is per-user and private by default. The catalogue
-- is world-readable; nobody's progress is.

-- ─────────────────────────────────────────────────────────────────────────────
-- node_progress — the unit of progress is finishing a node
-- ─────────────────────────────────────────────────────────────────────────────

create table public.node_progress (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  node_id       uuid not null references public.nodes (id) on delete cascade,
  status        text not null default 'in_progress'
                check (status in ('in_progress', 'done', 'skipped')),
  -- Where they were in the node's resource list, so a 2-minute metro session
  -- resumes exactly where the last one stopped.
  last_position int check (last_position >= 1),
  completed_at  timestamptz,
  constraint node_progress_done_is_stamped
    check ((status = 'done') = (completed_at is not null)),
  primary key (user_id, node_id)
);

comment on table public.node_progress is
  'Per-user, private. Getting through a node IS the progress event.';

create index node_progress_node_idx on public.node_progress (node_id);

alter table public.node_progress enable row level security;

create policy "users read their own progress"
  on public.node_progress for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "users record their own progress"
  on public.node_progress for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "users update their own progress"
  on public.node_progress for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ─────────────────────────────────────────────────────────────────────────────
-- roadmap_enrollments — "I am following this roadmap"
-- ─────────────────────────────────────────────────────────────────────────────

create table public.roadmap_enrollments (
  user_id      uuid not null references public.profiles (id) on delete cascade,
  roadmap_id   uuid not null references public.roadmaps (id) on delete cascade,
  started_at   timestamptz not null default now(),
  -- The one thing the UI must answer instantly: what do I tap now.
  last_node_id uuid references public.nodes (id) on delete set null,
  completed_at timestamptz,
  primary key (user_id, roadmap_id)
);

comment on table public.roadmap_enrollments is
  'Following a roadmap. Free, self-paced, abandonable — no cohort, no deadline.';

alter table public.roadmap_enrollments enable row level security;

create policy "users read their own enrollments"
  on public.roadmap_enrollments for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "users start roadmaps"
  on public.roadmap_enrollments for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "users update their own enrollments"
  on public.roadmap_enrollments for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "users leave roadmaps"
  on public.roadmap_enrollments for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- ─────────────────────────────────────────────────────────────────────────────
-- saved_resources — save-for-later that leads to doing, not a graveyard
-- ─────────────────────────────────────────────────────────────────────────────

create table public.saved_resources (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  resource_id uuid not null references public.resources (id) on delete cascade,
  saved_at    timestamptz not null default now(),
  -- A save stays attached to its node and shows up in the daily loop until
  -- it is consumed. This column is what separates a queue from a graveyard.
  consumed_at timestamptz,
  primary key (user_id, resource_id)
);

comment on table public.saved_resources is
  'Per-user save-for-later. Stays attached to its node; surfaces in the daily loop until consumed.';

alter table public.saved_resources enable row level security;

create policy "users read their own saves"
  on public.saved_resources for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "users save resources"
  on public.saved_resources for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "users mark saves consumed"
  on public.saved_resources for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "users unsave resources"
  on public.saved_resources for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- Grants: progress is the signed-in user's own to write; anon gets nothing.
grant select, insert, update on public.node_progress to authenticated;
grant select, insert, update, delete on public.roadmap_enrollments to authenticated;
grant select, insert, update, delete on public.saved_resources to authenticated;
