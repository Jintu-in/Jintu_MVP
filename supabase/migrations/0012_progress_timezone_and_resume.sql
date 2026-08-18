-- ─────────────────────────────────────────────────────────────────────────────
-- 0012 — the progress data layer, finished: per-user timezone, block-level
--        resume, and the node-named RPCs the dashboard calls.
--
-- 0008 and 0011 already built most of this subsystem: node_progress,
-- activity_days, streaks, point_events, RLS with no client write path, the
-- decaying streak_status view, and traps 2 (idempotency), 3 (restart at 1)
-- and 4 (stale reads as unbroken). This migration closes the gaps that
-- remained, all of which are trap 1 or the dashboard's resume affordance:
--
--   1. profiles.timezone — trap 1 done properly. 0011 hardcoded IST, which
--      is wrong the day someone opens this from Dubai or Toronto. The day
--      boundary is now the USER'S midnight. ist_today() survives only as a
--      deprecated shim; nothing in this subsystem calls it any more.
--   2. node_progress.last_block_position + save_block_position() — the
--      dashboard's "Resume at block 12 of 16" cannot exist without it.
--      Distinct from the older last_position, which counts RESOURCES.
--   3. complete_node / uncomplete_node — the spec's names, now also
--      returning points_awarded. complete_day / uncomplete_day stay as thin
--      wrappers so the deployed app keeps working between this paste and
--      the next deploy.
--
-- Re-runnable in full, like every bundle since FIX-2.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────────────────────
-- Trap 1 · the user's own midnight
-- ─────────────────────────────────────────────────────────────────────────────

-- The backfill runs ONLY on the run that adds the column. Every profile that
-- existed before this migration accumulated its streak under 0011's
-- hardcoded IST, so defaulting them to UTC would silently move their day
-- boundary by 5h30m and could break a live streak overnight — their
-- history's own clock is written in explicitly. Guarding on the column's
-- existence rather than on `where timezone = 'UTC'` is what makes a second
-- paste harmless: by then a real UTC user may exist, and they must not be
-- dragged to Kolkata.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'timezone'
  ) then
    alter table public.profiles add column timezone text not null default 'UTC';
    update public.profiles set timezone = 'Asia/Kolkata';
  end if;
end $$;

comment on column public.profiles.timezone is
  'IANA name captured at signup from Intl.DateTimeFormat().resolvedOptions().timeZone. The streak day boundary is this timezone''s midnight — never UTC, never a hardcoded IST.';

-- A bad IANA string makes `at time zone` throw, which would wedge
-- complete_node for that user permanently. Validate on write, where it is
-- cheap and recoverable, so the read path can stay a plain conversion.
create or replace function public.profiles_validate_timezone()
  returns trigger
  language plpgsql
as $$
begin
  if not exists (select 1 from pg_catalog.pg_timezone_names where name = new.timezone) then
    raise exception 'unknown timezone: %', new.timezone using errcode = '22023';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_timezone_valid on public.profiles;
create trigger profiles_timezone_valid
  before insert or update of timezone on public.profiles
  for each row execute function public.profiles_validate_timezone();

-- user_today — one clock per user, keeping 0011's jintu.now test seam so the
-- guards can move time without waiting for it.
create or replace function public.user_today(p_user uuid)
  returns date
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select (
    coalesce(nullif(current_setting('jintu.now', true), '')::timestamptz, now())
    at time zone coalesce(
      (select p.timezone from public.profiles p where p.id = p_user), 'UTC')
  )::date;
$$;

comment on function public.user_today(uuid) is
  'The calendar date it is right now for this user. Security definer because it reads profiles.timezone, and the streak_status view (security_invoker) must resolve it for the row it is already allowed to see.';

-- Executable by clients: the view below calls it as the invoker. The only
-- thing another user''s id could reveal is a date, which is at most one bit
-- about their offset and only around midnight.
revoke execute on function public.user_today(uuid) from public;
grant execute on function public.user_today(uuid) to authenticated;

comment on function public.ist_today() is
  'DEPRECATED as of 0012 — superseded by user_today(uuid). Nothing in the progress subsystem calls this; it survives only so older pasted objects do not break.';

-- ─────────────────────────────────────────────────────────────────────────────
-- Resume · where in the day they stopped
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.node_progress
  add column if not exists last_block_position smallint
    check (last_block_position >= 1);

alter table public.node_progress
  add column if not exists updated_at timestamptz not null default now();

comment on column public.node_progress.last_block_position is
  'Which content block of the day they last reached — the number behind "Resume at block 12 of 16". Distinct from last_position, which counts resources.';

create or replace function public.save_block_position(p_node_id uuid, p_position smallint)
  returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Called while someone scrolls, so it stays a single cheap upsert and
  -- never touches the streak. Reading is not completing.
  insert into public.node_progress (user_id, node_id, status, last_block_position, updated_at)
  values (uid, p_node_id, 'in_progress', p_position, now())
  on conflict (user_id, node_id) do update
    set last_block_position = greatest(
          coalesce(public.node_progress.last_block_position, 0), excluded.last_block_position),
        updated_at = now();
end;
$$;

comment on function public.save_block_position(uuid, smallint) is
  'Furthest-block bookmark. Monotonic on purpose: scrolling back up must not move the resume point backwards.';

revoke execute on function public.save_block_position(uuid, smallint) from public, anon;
grant execute on function public.save_block_position(uuid, smallint) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Points still land on the user's own calendar day
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.award_on_node_done()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  today date := public.user_today(new.user_id);
  node_points int;
  node_module uuid;
  spent_today int;
begin
  if new.status <> 'done' then return new; end if;
  if tg_op = 'UPDATE' and old.status = 'done' then return new; end if;

  select points, module_id into node_points, node_module
  from public.nodes where id = new.node_id;
  if node_points is null then return new; end if;

  select coalesce(sum(points), 0) into spent_today
  from public.point_events
  where user_id = new.user_id and source_type = 'node' and awarded_on = today;

  if spent_today < 150 then
    insert into public.point_events (user_id, source_type, source_id, points, awarded_on)
    values (new.user_id, 'node', new.node_id, node_points, today)
    on conflict do nothing;
  end if;

  if not exists (
    select 1 from public.nodes n
    left join public.node_progress p
      on p.node_id = n.id and p.user_id = new.user_id and p.status = 'done'
    where n.module_id = node_module and not n.is_optional and p.node_id is null
  ) then
    insert into public.point_events (user_id, source_type, source_id, points, awarded_on)
    values (new.user_id, 'module', node_module, 50, today)
    on conflict do nothing;
  end if;

  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- complete_node — the one write path for the streak
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.complete_node(p_node_id uuid)
  returns table (
    current_days int, longest_days int, total_days int,
    is_new_day boolean, was_broken boolean, days_missed int,
    days_since int, points_awarded int
  )
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  today date;
  s public.streaks%rowtype;
  gap int;
  since int;
  new_current int;
  bonus int;
  pts_before int;
  pts_after int;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  today := public.user_today(uid);

  select coalesce(sum(points), 0) into pts_before
  from public.point_events where user_id = uid and awarded_on = today;

  -- The progress row (fires the points trigger). completed_at is kept from
  -- the first completion — an undo/redo does not rewrite history.
  insert into public.node_progress (user_id, node_id, status, completed_at, updated_at)
  values (uid, p_node_id, 'done', now(), now())
  on conflict (user_id, node_id) do update
    set status = 'done',
        completed_at = coalesce(public.node_progress.completed_at, now()),
        updated_at = now();

  -- Trap 2: the day row. Volume accumulates here; the streak below moves
  -- only when this is the first completion of the calendar day.
  insert into public.activity_days (user_id, done_on, nodes)
  values (uid, today, 1)
  on conflict (user_id, done_on) do update
    set nodes = public.activity_days.nodes + 1;

  insert into public.streaks (user_id) values (uid) on conflict do nothing;
  select * into s from public.streaks where user_id = uid for update;

  select coalesce(sum(points), 0) into pts_after
  from public.point_events where user_id = uid and awarded_on = today;

  if s.last_done_on = today then
    -- Second node of the same day: points may have moved, the streak did not.
    return query select s.current_days, s.longest_days, s.total_days,
                        false, false, 0, 0, (pts_after - pts_before);
    return;
  end if;

  -- days_missed counts the EMPTY days between the two completions; days_since
  -- is the raw difference. Last done Monday, back on Thursday → missed 2,
  -- since 3. The UI copy ("You missed N days") wants days_missed.
  since := case when s.last_done_on is null then 0 else today - s.last_done_on end;
  gap   := case when s.last_done_on is null then 0 else since - 1 end;

  -- Trap 3: a restart is 1, never 0.
  new_current := case when s.last_done_on = today - 1 then s.current_days + 1 else 1 end;

  update public.streaks set
    current_days = new_current,
    longest_days = greatest(streaks.longest_days, new_current),
    total_days   = streaks.total_days + 1, -- unconditional, always
    last_done_on = today,
    updated_at   = now()
  where user_id = uid;

  -- The 91-day plan's streak bonus survives the freeze removal: +5 per
  -- active day from a week, +10 from a month, once per local day.
  bonus := case when new_current >= 30 then 10
                when new_current >= 7 then 5
                else 0 end;
  if bonus > 0 then
    insert into public.point_events (user_id, source_type, source_id, points, awarded_on)
    values (uid, 'streak', uid, bonus, today)
    on conflict do nothing;
  end if;

  select coalesce(sum(points), 0) into pts_after
  from public.point_events where user_id = uid and awarded_on = today;

  return query
    select st.current_days, st.longest_days, st.total_days,
           true, (gap > 0), gap, since, (pts_after - pts_before)
    from public.streaks st where st.user_id = uid;
end;
$$;

revoke execute on function public.complete_node(uuid) from public, anon;
grant execute on function public.complete_node(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- uncomplete_node — undo that rebuilds from the source of truth
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.uncomplete_node(p_node_id uuid)
  returns table (current_days int, longest_days int, total_days int)
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  today date;
  remaining int;
  last_day date;
  cur int;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  today := public.user_today(uid);

  update public.node_progress
  set status = 'in_progress', completed_at = null, updated_at = now()
  where user_id = uid and node_id = p_node_id and status = 'done';
  if not found then
    return query select s.current_days, s.longest_days, s.total_days
    from public.streaks s where s.user_id = uid;
    return;
  end if;

  update public.activity_days
  set nodes = nodes - 1
  where user_id = uid and done_on = today and nodes > 1
  returning nodes into remaining;

  if remaining is null then
    -- Today's row was at 1 (or absent): the day empties and un-counts.
    delete from public.activity_days where user_id = uid and done_on = today;

    -- Rebuild the cache from the source of truth. current = length of the
    -- consecutive run ending at the most recent activity day.
    select max(done_on) into last_day from public.activity_days where user_id = uid;
    if last_day is null then
      cur := 0;
    else
      select count(*) into cur
      from (
        select done_on,
               done_on + (row_number() over (order by done_on desc))::int as grp
        from public.activity_days where user_id = uid
      ) runs
      where grp = last_day + 1;
    end if;

    update public.streaks set
      current_days = cur,
      -- longest is historical; an undo of today cannot shrink what was
      -- genuinely achieved on other days.
      total_days   = greatest(0, streaks.total_days - 1),
      last_done_on = last_day,
      updated_at   = now()
    where user_id = uid;
  end if;

  return query select s.current_days, s.longest_days, s.total_days
  from public.streaks s where s.user_id = uid;
end;
$$;

revoke execute on function public.uncomplete_node(uuid) from public, anon;
grant execute on function public.uncomplete_node(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 0011's names stay alive as wrappers
-- ─────────────────────────────────────────────────────────────────────────────
-- The SQL is pasted by hand before the code that calls it deploys, so the
-- old names must keep working across that window. Same body, one hop.

drop function if exists public.complete_day(uuid);
create or replace function public.complete_day(p_node_id uuid)
  returns table (
    current_days int, longest_days int, total_days int,
    is_new_day boolean, was_broken boolean, days_missed int
  )
  language sql
  security invoker
  set search_path = ''
as $$
  select current_days, longest_days, total_days, is_new_day, was_broken, days_missed
  from public.complete_node(p_node_id);
$$;

comment on function public.complete_day(uuid) is
  'DEPRECATED as of 0012 — call complete_node, which also returns points_awarded and days_since.';

revoke execute on function public.complete_day(uuid) from public, anon;
grant execute on function public.complete_day(uuid) to authenticated;

drop function if exists public.uncomplete_day(uuid);
create or replace function public.uncomplete_day(p_node_id uuid)
  returns table (current_days int, longest_days int, total_days int)
  language sql
  security invoker
  set search_path = ''
as $$
  select current_days, longest_days, total_days from public.uncomplete_node(p_node_id);
$$;

comment on function public.uncomplete_day(uuid) is
  'DEPRECATED as of 0012 — call uncomplete_node.';

revoke execute on function public.uncomplete_day(uuid) from public, anon;
grant execute on function public.uncomplete_day(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Trap 4 · the read that decays, now on the user's own clock
-- ─────────────────────────────────────────────────────────────────────────────

create or replace view public.streak_status
  with (security_invoker = true)
as
select
  s.user_id,
  case
    when s.last_done_on >= public.user_today(s.user_id) - 1 then s.current_days
    else 0                                                    -- lapsed
  end as current_days,
  s.longest_days,
  s.total_days,
  s.last_done_on,
  s.last_done_on = public.user_today(s.user_id) as done_today,
  case when s.last_done_on is null then null
       else public.user_today(s.user_id) - s.last_done_on end as days_since
from public.streaks s;

comment on view public.streak_status is
  'The only streak surface the UI may read: current_days decays to 0 when lapsed without waiting for a write. security_invoker + streaks RLS = own row only.';

grant select on public.streak_status to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Timezone capture at signup
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.set_my_timezone(p_tz text)
  returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  -- The trigger validates; an unknown zone raises rather than silently
  -- leaving the streak on the wrong clock.
  update public.profiles set timezone = p_tz where id = uid;
end;
$$;

revoke execute on function public.set_my_timezone(text) from public, anon;
grant execute on function public.set_my_timezone(text) to authenticated;
