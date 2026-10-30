-- ─────────────────────────────────────────────────────────────────────────────
-- 0034 — roadmaps.status grows from draft/published to three honest levels
-- (design pack update 3 §A, StatusKit).
--
-- The old two-value status conflated "visible" with "fully reviewed" — a
-- roadmap that passed its own self-checks went straight to the same
-- `published` value a practitioner-reviewed one would. The three values
-- below separate those: `self_checked` is the new default public state
-- (every lesson scored 10/12+, finished by 3 test learners, no practitioner
-- sign-off yet); `practitioner_reviewed` adds a named reviewer's sign-off;
-- `draft` is unchanged — never public, same as before.
--
-- This migration only ever MOVES existing `published` rows to `self_checked`
-- (today's actual review state, per the relaunch decision) — nothing goes
-- offline and no RLS policy becomes more permissive. Every policy that used
-- to check `status = 'published'` now checks
-- `status in ('self_checked', 'practitioner_reviewed')`, i.e. "not draft" —
-- exactly the same set of rows is visible before and after this migration,
-- since no roadmap is `draft` today.
--
-- Setting a roadmap to `draft` after this migration is a content decision,
-- not something this migration does — see CHANGES.md update 3 §A: "ask
-- Saurav before setting any roadmap to draft in production".

alter table public.roadmaps
  drop constraint roadmaps_status_check;

update public.roadmaps set status = 'self_checked' where status = 'published';

alter table public.roadmaps
  add constraint roadmaps_status_check
    check (status in ('draft', 'self_checked', 'practitioner_reviewed'));

alter table public.roadmaps
  add column if not exists reviewed_by_name  text,
  add column if not exists reviewed_by_title text,
  add column if not exists reviewed_on       date;

alter table public.roadmaps
  add constraint roadmaps_review_fields_required_when_reviewed
    check (
      status <> 'practitioner_reviewed'
      or (reviewed_by_name is not null and reviewed_by_title is not null and reviewed_on is not null)
    );

comment on column public.roadmaps.status is
  'draft (never public) / self_checked (public, not yet practitioner-reviewed) / practitioner_reviewed (public, named reviewer signed off) — StatusKit''s three labels.';
comment on column public.roadmaps.reviewed_by_name is
  'Required once status is practitioner_reviewed — a named person, never anonymous.';
comment on column public.roadmaps.reviewed_by_title is
  'The reviewer''s job title, shown alongside their name.';
comment on column public.roadmaps.reviewed_on is
  'The date that reviewer signed off — a date, not a timestamp; shown to the public.';

-- ── every policy that gated on the old single `published` value ────────────
-- Same rows visible before and after: `status = 'published'` and
-- `status in ('self_checked', 'practitioner_reviewed')` match an identical
-- set of roadmaps today, since this migration already moved every
-- `published` row to `self_checked` above.

drop policy "published roadmaps are public" on public.roadmaps;
create policy "non-draft roadmaps are public"
  on public.roadmaps for select
  to anon, authenticated
  using (status in ('self_checked', 'practitioner_reviewed'));

drop policy "modules of published roadmaps are public" on public.modules;
create policy "modules of non-draft roadmaps are public"
  on public.modules for select
  to anon, authenticated
  using (exists (
    select 1 from public.roadmaps r
    where r.id = roadmap_id and r.status in ('self_checked', 'practitioner_reviewed')
  ));

drop policy "nodes of published roadmaps are public" on public.nodes;
create policy "nodes of non-draft roadmaps are public"
  on public.nodes for select
  to anon, authenticated
  using (exists (
    select 1 from public.modules m
    join public.roadmaps r on r.id = m.roadmap_id
    where m.id = module_id and r.status in ('self_checked', 'practitioner_reviewed')
  ));

drop policy "resources of published roadmaps are public" on public.resources;
create policy "resources of non-draft roadmaps are public"
  on public.resources for select
  to anon, authenticated
  using (exists (
    select 1 from public.nodes n
    join public.modules m on m.id = n.module_id
    join public.roadmaps r on r.id = m.roadmap_id
    where n.id = node_id and r.status in ('self_checked', 'practitioner_reviewed')
  ));

drop policy "topics of published roadmaps are public" on public.node_topics;
create policy "topics of non-draft roadmaps are public"
  on public.node_topics for select
  to anon, authenticated
  using (exists (
    select 1 from public.nodes n
    join public.modules m on m.id = n.module_id
    join public.roadmaps r on r.id = m.roadmap_id
    where n.id = node_id and r.status in ('self_checked', 'practitioner_reviewed')
  ));

drop policy "checks of published roadmaps are public" on public.node_checks;
create policy "checks of non-draft roadmaps are public"
  on public.node_checks for select
  to anon, authenticated
  using (exists (
    select 1 from public.nodes n
    join public.modules m on m.id = n.module_id
    join public.roadmaps r on r.id = m.roadmap_id
    where n.id = node_id and r.status in ('self_checked', 'practitioner_reviewed')
  ));

drop policy "prerequisites between published roadmaps are public" on public.roadmap_prerequisites;
create policy "prerequisites between non-draft roadmaps are public"
  on public.roadmap_prerequisites for select
  to anon, authenticated
  using (
    exists (select 1 from public.roadmaps r where r.id = roadmap_id  and r.status in ('self_checked', 'practitioner_reviewed'))
    and
    exists (select 1 from public.roadmaps r where r.id = requires_id and r.status in ('self_checked', 'practitioner_reviewed'))
  );

-- The metrics view (service-role only; 0016) — same "not draft" scope, every
-- other line unchanged from its own definition.
create or replace view public.node_dropoff as
with ordered as (
  select
    r.slug  as roadmap,
    r.title as roadmap_title,
    n.id    as node_id,
    n.title as node_title,
    row_number() over (partition by r.id order by m.position, n.position) as day_number
  from public.nodes n
  join public.modules m  on m.id = n.module_id
  join public.roadmaps r on r.id = m.roadmap_id
  where r.status in ('self_checked', 'practitioner_reviewed')
),
counts as (
  select
    o.roadmap,
    o.roadmap_title,
    o.node_id,
    o.node_title,
    o.day_number,
    count(distinct np.user_id)                                   as reached,
    count(distinct np.user_id) filter (where np.status = 'done') as completed
  from ordered o
  left join public.node_progress np on np.node_id = o.node_id
  group by o.roadmap, o.roadmap_title, o.node_id, o.node_title, o.day_number
)
select
  roadmap,
  roadmap_title,
  day_number,
  node_title,
  reached,
  completed,
  lag(reached) over (partition by roadmap order by day_number) as reached_previous,
  case
    when lag(reached) over (partition by roadmap order by day_number) > 0
      then round(
        1 - (reached::numeric
             / lag(reached) over (partition by roadmap order by day_number)),
        3)
    else null
  end as dropoff_rate
from counts
order by dropoff_rate desc nulls last, roadmap, day_number;
