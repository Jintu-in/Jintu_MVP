-- ─────────────────────────────────────────────────────────────────────────────
-- 0016 — the five numbers we will actually act on, computed in Postgres.
--
-- Not in a vendor dashboard: these join user activity to curriculum
-- structure, which no analytics product can see, and shipping the joins to
-- one would mean shipping the data too.
--
-- Every view here is service_role only. They are aggregates, but a cohort
-- table on a few hundred users is re-identifiable — a cohort of one is a
-- person — and we tell people we take less than everyone else does.
--
-- security_invoker stays off (the default): these run as owner so they can
-- see across users, which is the whole point. The grant is the control.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1 · retention by signup cohort ──────────────────────────────────────────
-- D3 is the one to watch. Day 1 is curiosity; day 3 is a habit forming or
-- not, and no amount of content depth fixes a day-3 problem.
--
-- LEFT JOIN, not inner: a person who signed up and never came back is the
-- most important row in this table, and an inner join deletes them —
-- signed_up would shrink and every cohort would look healthier than it is.
create or replace view public.retention_cohorts as
with cohorts as (
  select p.id as user_id, p.created_at::date as cohort_day
  from public.profiles p
),
activity as (
  select c.user_id,
         c.cohort_day,
         (a.done_on - c.cohort_day) as day_offset
  from cohorts c
  left join public.activity_days a on a.user_id = c.user_id
)
select
  cohort_day,
  count(distinct user_id)                                             as signed_up,
  count(distinct user_id) filter (where day_offset = 0)               as d0,
  count(distinct user_id) filter (where day_offset = 1)               as d1,
  count(distinct user_id) filter (where day_offset = 3)               as d3,
  count(distinct user_id) filter (where day_offset = 7)               as d7,
  count(distinct user_id) filter (where day_offset between 28 and 30) as d30,
  -- Named rather than left to be inferred by subtraction.
  count(distinct user_id) filter (where day_offset is null)           as never_returned
from activity
group by cohort_day
order by cohort_day desc;

comment on view public.retention_cohorts is
  'Signup cohorts and which days they came back on. LEFT JOIN so somebody who never returned still counts in signed_up — that row is the point of the table.';

-- ── 2 · where people stop ───────────────────────────────────────────────────
-- Reached = a progress row of any status. Completed = done. Drop-off is
-- measured against the previous day IN THE SAME ROADMAP, so the window
-- partitions by roadmap rather than running across all of them.
--
-- Sorted worst-first: the top rows are the content backlog, measured
-- rather than guessed.
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
  where r.status = 'published'
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

comment on view public.node_dropoff is
  'Per day: who reached it, who finished it, and the fall from the day before within the same roadmap. Worst-first — the top rows are the content backlog.';

-- ── 3 · streak length distribution ──────────────────────────────────────────
-- Read through the same decay rule the UI uses, so "lapsed" means what the
-- person sees on their own dashboard rather than a stale cache value.
create or replace view public.streak_distribution as
-- From profiles, not from streaks: a streaks row is only created by the
-- first completion, so reading the cache directly makes everybody who
-- signed up and never started vanish from the distribution — which is the
-- group most worth seeing.
with live as (
  select
    p.id as user_id,
    coalesce(s.total_days, 0) as total_days,
    case
      when s.last_done_on >= public.user_today(p.id) - 1 then s.current_days
      else 0
    end as current_days
  from public.profiles p
  left join public.streaks s on s.user_id = p.id
),
bucketed as (
  select
    case
      when total_days = 0                 then '0 · never finished a day'
      when current_days = 0               then 'lapsed · recoverable'
      when current_days = 1               then '1 day'
      when current_days between 2 and 6   then '2-6 days'
      when current_days between 7 and 13  then '7-13 days'
      when current_days between 14 and 29 then '14-29 days'
      else '30+ days'
    end as bucket,
    total_days
  from live
)
select
  bucket,
  count(*)        as users,
  sum(total_days) as total_days_held
from bucketed
group by bucket
order by
  case bucket
    when '0 · never finished a day' then 0
    when 'lapsed · recoverable'     then 1
    when '1 day'                    then 2
    when '2-6 days'                 then 3
    when '7-13 days'                then 4
    when '14-29 days'               then 5
    else 6
  end;

comment on view public.streak_distribution is
  'Live streak buckets, decayed exactly as streak_status decays them. The lapsed row is the recoverable audience: days behind them, none today.';

-- ── 4 · time to first completed day ─────────────────────────────────────────
-- If this reads in days rather than minutes, the signup flow ends in the
-- wrong place — it should hand somebody into a day, not into a dashboard
-- they then have to navigate out of.
create or replace view public.time_to_first_day as
with firsts as (
  select
    p.id,
    p.created_at,
    (select min(a.done_on) from public.activity_days a where a.user_id = p.id) as first_day
  from public.profiles p
),
gaps as (
  select
    -- activity_days stores a DATE, so the finest honest resolution is the
    -- gap to the start of that day. Anything finer would be invented.
    extract(epoch from (first_day::timestamp - date_trunc('day', created_at))) / 3600.0 as hours
  from firsts
  where first_day is not null
)
select
  (select count(*) from gaps)                                           as users_with_a_first_day,
  (select count(*) from firsts where first_day is null)                 as users_with_none,
  round(percentile_cont(0.5) within group (order by hours)::numeric, 1) as median_hours,
  round(percentile_cont(0.9) within group (order by hours)::numeric, 1) as p90_hours,
  count(*) filter (where hours <= 24)                                   as within_a_day
from gaps;

comment on view public.time_to_first_day is
  'Hours from signup to the first completed day. Measured to the start of the completion date, because activity_days holds a date — no invented precision.';

-- ── 5 · resource engagement ─────────────────────────────────────────────────
-- We do not store resource clicks, so this is an APPROXIMATION and the name
-- of the column says so: a resource counts as likely-opened when its node
-- was completed. It cannot tell an opened link from one skipped inside a
-- finished day.
--
-- What it is good for is the other end. A source sitting on nodes nobody
-- finishes is either badly placed or badly chosen, and both are curation
-- errors we can act on.
create or replace view public.resource_engagement as
select
  res.source_name,
  res.type,
  count(distinct res.id)                                       as resources,
  count(distinct np.user_id) filter (where np.status = 'done') as likely_opened_by,
  count(distinct np.user_id)                                   as on_nodes_reached_by,
  count(distinct res.id) filter (where res.health = 'broken')  as broken,
  count(distinct res.id) filter (where res.needs_verification) as unverified
from public.resources res
join public.nodes n on n.id = res.node_id
left join public.node_progress np on np.node_id = n.id
group by res.source_name, res.type
order by likely_opened_by desc, resources desc;

comment on view public.resource_engagement is
  'APPROXIMATE — we store no clicks, so likely_opened_by counts completions of the node a resource sits on. Read it for the ignored tail, not the popular head.';

-- ── grants ──────────────────────────────────────────────────────────────────
-- service_role only. These are aggregates, but a cohort of one is a person.
do $do$
declare v text;
begin
  foreach v in array array[
    'retention_cohorts', 'node_dropoff', 'streak_distribution',
    'time_to_first_day', 'resource_engagement'
  ] loop
    execute format('revoke all on public.%I from anon, authenticated', v);
    execute format('grant select on public.%I to service_role', v);
  end loop;
end
$do$;
