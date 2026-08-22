-- ─────────────────────────────────────────────────────────────────────────────
-- 0020 — the hours stop being a guess, and a prerequisite becomes an edge.
--
-- TWO FIXES, both found by reconciling the catalogue against its own days.
--
-- 1. estimated_hours did not agree with the roadmap underneath it. Stored:
--    340 / 280 / 120 / 150, summing to 890 — which is the figure the homepage
--    prints. Summing each roadmap's own nodes.est_minutes gives 85 / 50 / 28 /
--    32, totalling 195. Every one of them is off by almost exactly 4×.
--
--    est_minutes is not a secondary number. It is what a day states before
--    anybody opens it, and the product's whole promise is that the length is
--    honest. A roadmap total that contradicts the sum of its own days is the
--    same promise broken one level up — and "340 hours over 13 weeks" implies
--    26 hours a week, which nobody signed up for. 85 hours is 6.5 a week,
--    which is 56 minutes a day: exactly what the days say.
--
--    So the column becomes derived. Authors stop typing it.
--
-- 2. has_prereqs (0017) is a boolean with nothing on the other end of it. It
--    can say a roadmap assumes something; it cannot say WHAT, so no surface
--    can offer the thing you are missing. A boolean is a dead end printed on
--    a page. This adds the edge, and makes the boolean derived from it.
--
-- Re-runnable.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. estimated_hours, derived from the days
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.recompute_estimated_hours()
  returns integer
  language plpgsql
  security definer
  set search_path = ''
as $fn$
declare
  touched integer;
begin
  with summed as (
    select r.id as roadmap_id,
           greatest(1, round(sum(n.est_minutes)::numeric / 60))::int as hours
    from public.roadmaps r
    join public.modules m on m.roadmap_id = r.id
    join public.nodes n on n.module_id = m.id
    group by r.id
  )
  update public.roadmaps r
  set estimated_hours = s.hours
  from summed s
  where s.roadmap_id = r.id
    and r.estimated_hours is distinct from s.hours;

  get diagnostics touched = row_count;
  return touched;
end;
$fn$;

comment on function public.recompute_estimated_hours() is
  'Sets roadmaps.estimated_hours to the sum of its own nodes.est_minutes. Returns rows changed. Run after any import — the number must never be typed in.';

revoke execute on function public.recompute_estimated_hours() from public, anon, authenticated;

comment on column public.roadmaps.estimated_hours is
  'DERIVED by recompute_estimated_hours() from the sum of nodes.est_minutes. Never hand-set: a roadmap total that disagrees with its own days breaks the one promise the day pages make.';

select public.recompute_estimated_hours();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. prerequisites — an edge, not a flag
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.roadmap_prerequisites (
  roadmap_id  uuid not null references public.roadmaps (id) on delete cascade,
  requires_id uuid not null references public.roadmaps (id) on delete cascade,
  position    smallint not null default 0,
  -- One line in our words, shown on the card: "Assumes you are comfortable
  -- at a terminal." Optional — the roadmap's own title usually says it.
  note        text,
  primary key (roadmap_id, requires_id),
  constraint roadmap_prerequisites_not_self check (roadmap_id <> requires_id)
);

comment on table public.roadmap_prerequisites is
  'What a roadmap assumes you already did. Renders as a visible path — a fourteen-week commitment with a two-week first step is a different offer from a fourteen-week commitment.';

create index if not exists roadmap_prerequisites_requires_idx
  on public.roadmap_prerequisites (requires_id);

-- A cycle would hang whatever walks the chain to draw the path. The primary
-- key stops A→A; nothing stops A→B→A, so this does.
create or replace function public.reject_prerequisite_cycle()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $fn$
begin
  if exists (
    with recursive chain as (
      select new.roadmap_id as id
      union
      select p.roadmap_id
      from public.roadmap_prerequisites p
      join chain c on c.id = p.requires_id
    )
    select 1 from chain where id = new.requires_id
  ) then
    raise exception 'prerequisite cycle: % already depends on %', new.requires_id, new.roadmap_id;
  end if;
  return new;
end;
$fn$;

drop trigger if exists roadmap_prerequisites_no_cycles on public.roadmap_prerequisites;
create trigger roadmap_prerequisites_no_cycles
  before insert or update on public.roadmap_prerequisites
  for each row execute function public.reject_prerequisite_cycle();

-- has_prereqs stops being something an author remembers to set.
create or replace function public.recompute_has_prereqs()
  returns integer
  language plpgsql
  security definer
  set search_path = ''
as $fn$
declare
  touched integer;
begin
  update public.roadmaps r
  set has_prereqs = exists (
    select 1 from public.roadmap_prerequisites p where p.roadmap_id = r.id
  )
  where r.has_prereqs is distinct from exists (
    select 1 from public.roadmap_prerequisites p where p.roadmap_id = r.id
  );
  get diagnostics touched = row_count;
  return touched;
end;
$fn$;

comment on function public.recompute_has_prereqs() is
  'Derives roadmaps.has_prereqs from roadmap_prerequisites. The catalogue facet reads the boolean; this keeps it true.';

revoke execute on function public.recompute_has_prereqs() from public, anon, authenticated;

comment on column public.roadmaps.has_prereqs is
  'DERIVED from roadmap_prerequisites by recompute_has_prereqs(). Do not set by hand — a true with no edge behind it is a warning the reader cannot act on.';

alter table public.roadmap_prerequisites enable row level security;

-- Visible only when BOTH ends are published. A path that points at a draft is
-- a dead end wearing a signpost.
do $$ begin
  create policy "prerequisites between published roadmaps are public"
    on public.roadmap_prerequisites for select
    to anon, authenticated
    using (
      exists (select 1 from public.roadmaps r where r.id = roadmap_id  and r.status = 'published')
      and
      exists (select 1 from public.roadmaps r where r.id = requires_id and r.status = 'published')
    );
exception when duplicate_object then null; end $$;

grant select on public.roadmap_prerequisites to anon, authenticated;

select public.recompute_has_prereqs();
