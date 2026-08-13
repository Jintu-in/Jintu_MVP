-- Retention: the award machinery, streaks with freezes, spaced review.
--
-- Everything that mints a point lives in this file, server-side, behind
-- SECURITY DEFINER — clients still have no write path to point_events or
-- streaks. The prices live on nodes (0007); the RULES live here:
--
--   finish a node        → its points, once ever          (cap per day)
--   finish a module      → +50, once ever
--   clear a review card  → +1, once per card per day
--   7-day streak         → +5 on each active day thereafter
--   30-day streak        → +10 instead
--
-- Week bonuses from the 91-day plan are NOT implemented: the schema has no
-- week entity (week_range is display text), and a bonus computed from prose
-- would be a guess wearing a number. Module bonuses cover the milestone.
--
-- Un-ticking a node does not claw points back. Points are momentum, not a
-- balance; a revocable point turns every undo into an accounting question.

-- ─────────────────────────────────────────────────────────────────────────────
-- point_events: per-source dedup rules replace the one-size unique
-- ─────────────────────────────────────────────────────────────────────────────
-- The baseline's unique(user, source_type, source_id) is right for nodes and
-- modules (once ever) but wrong for reviews (a card cleared today AND next
-- week is the system working) and meaningless for streak bonuses. One rule
-- per source type, as partial unique indexes.

alter table public.point_events
  drop constraint if exists point_events_user_id_source_type_source_id_key;

alter table public.point_events
  drop constraint if exists point_events_source_type_check;
alter table public.point_events
  add constraint point_events_source_type_check
  check (source_type in ('node', 'module', 'review', 'streak'));

create unique index point_events_once_ever
  on public.point_events (user_id, source_type, source_id)
  where source_type in ('node', 'module');

create unique index point_events_review_daily
  on public.point_events (user_id, source_id, awarded_on)
  where source_type = 'review';

create unique index point_events_streak_daily
  on public.point_events (user_id, awarded_on)
  where source_type = 'streak';

-- ─────────────────────────────────────────────────────────────────────────────
-- today() — one clock, with a test seam
-- ─────────────────────────────────────────────────────────────────────────────
-- Streak logic is date arithmetic, and date arithmetic that can only be
-- tested by waiting a day never gets tested. The override GUC is settable
-- only by a role that can run raw SQL — PostgREST exposes no path to
-- set_config — so in production this is current_date with extra steps.

create function public.jintu_today()
  returns date
  language sql
  stable
  set search_path = ''
as $$
  select coalesce(nullif(current_setting('jintu.today', true), '')::date, current_date);
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- touch_streak — activity happened today; do the date arithmetic once
-- ─────────────────────────────────────────────────────────────────────────────
create function public.touch_streak(p_user uuid)
  returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  today date := public.jintu_today();
  s public.streaks%rowtype;
  gap int;
  bonus int;
begin
  insert into public.streaks (user_id, current_days, longest_days, last_active_on, freezes_reset_on)
  values (p_user, 1, 1, today, date_trunc('month', today)::date)
  on conflict (user_id) do nothing;

  select * into s from public.streaks where user_id = p_user for update;

  -- Freezes refill monthly: two per calendar month, never banked.
  if s.freezes_reset_on is null or s.freezes_reset_on < date_trunc('month', today)::date then
    s.freezes_remaining := 2;
    s.freezes_reset_on := date_trunc('month', today)::date;
  end if;

  if s.last_active_on is null or s.last_active_on > today then
    -- New row from the insert above, or a clock that went backwards (the
    -- test seam, or DST weirdness): treat as a fresh day-one.
    s.current_days := greatest(s.current_days, 1);
    s.last_active_on := today;
  elsif s.last_active_on = today then
    null; -- second activity today: nothing to do
  else
    gap := today - s.last_active_on; -- 1 = consecutive
    if gap = 1 then
      s.current_days := s.current_days + 1;
    elsif gap - 1 <= s.freezes_remaining then
      -- Power cuts, exams, festivals: the missed days are frozen, the
      -- streak survives, and today still counts as the next day.
      s.freezes_remaining := s.freezes_remaining - (gap - 1);
      s.current_days := s.current_days + 1;
    else
      s.current_days := 1;
    end if;
    s.last_active_on := today;
  end if;

  s.longest_days := greatest(s.longest_days, s.current_days);

  update public.streaks
  set current_days = s.current_days,
      longest_days = s.longest_days,
      last_active_on = s.last_active_on,
      freezes_remaining = s.freezes_remaining,
      freezes_reset_on = s.freezes_reset_on
  where user_id = p_user;

  -- The streak bonus: +5 per active day after a week, +10 after a month.
  -- Once per day regardless of how much was done (the partial index is the
  -- backstop; the ON CONFLICT makes it a no-op rather than an error).
  bonus := case
    when s.current_days >= 30 then 10
    when s.current_days >= 7 then 5
    else 0
  end;
  if bonus > 0 then
    insert into public.point_events (user_id, source_type, source_id, points, awarded_on)
    values (p_user, 'streak', p_user, bonus, today)
    on conflict do nothing;
  end if;
end;
$$;

revoke execute on function public.touch_streak(uuid) from public, anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- the node award — a trigger on the progress row itself
-- ─────────────────────────────────────────────────────────────────────────────
-- Riding on node_progress means there is no separate "claim points" call to
-- forget, race, or spoof: the same row the RLS policy let the user write is
-- the row that pays. SECURITY DEFINER because the invoking role has no
-- grant on point_events — that absence is the security model.

create function public.award_on_node_done()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  today date := public.jintu_today();
  node_points int;
  node_module uuid;
  spent_today int;
begin
  if new.status <> 'done' then return new; end if;
  if tg_op = 'UPDATE' and old.status = 'done' then return new; end if;

  select points, module_id into node_points, node_module
  from public.nodes where id = new.node_id;
  if node_points is null then return new; end if;

  -- The daily cap: ticking ninety nodes in an evening is not ninety days of
  -- momentum. Progress is always recorded; points beyond the cap are not.
  -- 150 ≈ three generous days of the 91-day plan.
  select coalesce(sum(points), 0) into spent_today
  from public.point_events
  where user_id = new.user_id and source_type = 'node' and awarded_on = today;

  if spent_today < 150 then
    insert into public.point_events (user_id, source_type, source_id, points, awarded_on)
    values (new.user_id, 'node', new.node_id, node_points, today)
    on conflict do nothing;
  end if;

  -- Module complete? +50, once ever. Count is against required nodes:
  -- optional nodes are optional — a bonus that demands them is a lie about
  -- the word.
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

  perform public.touch_streak(new.user_id);
  return new;
end;
$$;

create trigger node_progress_awards
  after insert or update of status on public.node_progress
  for each row execute function public.award_on_node_done();

-- ─────────────────────────────────────────────────────────────────────────────
-- review_card_grade — the spaced-review step, and the 1-point award
-- ─────────────────────────────────────────────────────────────────────────────
-- The scheduler is a deliberately simple stability-based spacing (the FSRS
-- COLUMN SHAPE, not the fitted FSRS weights — fitting comes when there is
-- review history to fit to): again resets, hard grows slowly, good grows
-- with stability, easy jumps. Cards are the user's own rows; what needs the
-- server is only the part that mints — one point per card per day.

create function public.review_card_grade(p_card uuid, p_rating text)
  returns table (next_due date, new_stability real)
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  today date := public.jintu_today();
  c public.review_cards%rowtype;
  mult real;
  interval_days int;
begin
  if p_rating not in ('again', 'hard', 'good', 'easy') then
    raise exception 'rating must be again|hard|good|easy';
  end if;

  select * into c from public.review_cards
  where id = p_card and user_id = (select auth.uid())
  for update;
  if not found then
    raise exception 'no such card' using errcode = 'P0002';
  end if;

  if p_rating = 'again' then
    c.stability := greatest(0.5, c.stability * 0.4);
    c.difficulty := least(10, c.difficulty + 0.8);
    c.lapses := c.lapses + 1;
    interval_days := 1;
  else
    mult := case p_rating when 'hard' then 1.2 when 'good' then 2.2 else 3.5 end;
    -- Harder cards grow slower: difficulty 1 keeps the full multiplier,
    -- difficulty 10 roughly halves it.
    mult := mult * (1.15 - (c.difficulty / 20.0));
    c.stability := greatest(0.5, greatest(c.stability, 0.5) * mult);
    c.difficulty := greatest(1, least(10,
      c.difficulty + case p_rating when 'hard' then 0.3 when 'easy' then -0.5 else -0.1 end));
    interval_days := greatest(1, round(c.stability));
  end if;

  c.reps := c.reps + 1;
  update public.review_cards
  set stability = c.stability,
      difficulty = c.difficulty,
      due_on = today + interval_days,
      last_reviewed_at = now(),
      reps = c.reps,
      lapses = c.lapses
  where id = c.id;

  insert into public.point_events (user_id, source_type, source_id, points, awarded_on)
  values (c.user_id, 'review', c.id, 1, today)
  on conflict do nothing;

  perform public.touch_streak(c.user_id);

  return query select (today + interval_days)::date, c.stability;
end;
$$;

grant execute on function public.review_card_grade(uuid, text) to authenticated;
revoke execute on function public.review_card_grade(uuid, text) from public, anon;

comment on function public.review_card_grade(uuid, text) is
  'Rate your own due card (again|hard|good|easy): reschedules it and awards 1 point, once per card per day. The only client-callable path that mints anything, and it mints one.';
