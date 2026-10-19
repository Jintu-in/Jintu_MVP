-- ─────────────────────────────────────────────────────────────────────────────
-- Fix review_card_grade() calling a function that no longer exists
-- ─────────────────────────────────────────────────────────────────────────────
-- touch_streak(uuid) was dropped in 0011_streaks_v2.sql when streak-touching
-- was centralised into complete_node()/uncomplete_node() — but
-- review_card_grade() (0008_retention.sql) was never updated to stop calling
-- it. As written since 0011, grading a review card raises an
-- undefined-function error and the whole call rolls back: no rating is
-- saved, no point is awarded, nothing happens. This is a live bug, found
-- while auditing the schema for an unrelated redesign, not a new feature.
--
-- The fix removes the dead call rather than resurrecting touch_streak() or
-- wiring review grading into the current per-node streak machinery. Those
-- are both bigger, more opinionated changes than "stop the function from
-- erroring" — complete_node()/uncomplete_node() are shaped around a single
-- node_id, not a generic "touch today's activity" call, so restoring the
-- old behaviour (reviewing a card also extends the daily streak) needs a
-- shared helper factored out of complete_node() first. Until that is done
-- deliberately, review_card_grade() awards its point and reschedules the
-- card — which is everything its own comment ever promised ("reschedules it
-- and awards 1 point") — and simply no longer touches the streak.
--
-- Not touched here, flagged for later: this function stamps `today` from
-- jintu_today() (the old global-IST clock), not user_today(c.user_id) (the
-- per-user-timezone clock complete_node() uses since 0012). That is a
-- second, milder inconsistency — a review's day boundary doesn't match the
-- grading user's own local day — but it is a product-shaped question, not
-- a crash, so it is left alone rather than bundled into this fix.

create or replace function public.review_card_grade(p_card uuid, p_rating text)
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

  -- touch_streak(uuid) removed here — see header. Rescheduling and the
  -- point award above are unchanged.

  return query select (today + interval_days)::date, c.stability;
end;
$$;

grant execute on function public.review_card_grade(uuid, text) to authenticated;
revoke execute on function public.review_card_grade(uuid, text) from public, anon;

comment on function public.review_card_grade(uuid, text) is
  'Rate your own due card (again|hard|good|easy): reschedules it and awards 1 point, once per card per day. The only client-callable path that mints anything, and it mints one.';
