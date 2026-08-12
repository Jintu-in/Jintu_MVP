-- The spend gate for rubric_ai — the first and only paid call.
--
-- TRACK_MODEL Part 12 item 8, and CLAUDE.md invariant 2 made mechanical:
-- every LLM call attaches to one graded submission and writes an ai_usage
-- row, and the budget_guards ceiling is checked BEFORE the money leaves,
-- not after. The shape is reserve → call → settle (or release):
--
--   ai_spend_reserve   worst-case cost is added to spent_paise under a row
--                      lock, and the call is refused outright if it would
--                      cross any applicable ceiling. Fail-closed: no global
--                      guard row means no spending at all.
--   ai_spend_settle    the actual cost replaces the estimate, and the
--                      ai_usage row is written. Called even when the model's
--                      answer turned out to be unusable — the money was
--                      spent, and the ledger records what happened, not what
--                      we wished had happened.
--   ai_spend_release   the estimate is returned. Only for calls that never
--                      cost anything: network failure, HTTP error.
--
-- All three are service-role only. A client that could reserve could burn
-- the budget; a client that could release could refund itself.

-- ─────────────────────────────────────────────────────────────────────────────
-- reserve
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.ai_spend_reserve(
  p_estimate_paise int,
  p_cohort_id uuid default null
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_global public.budget_guards%rowtype;
  v_cohort public.budget_guards%rowtype;
begin
  if p_estimate_paise is null or p_estimate_paise <= 0 then
    raise exception 'estimate must be a positive number of paise'
      using errcode = '22023';
  end if;

  -- Global first, cohort second, always in that order: two concurrent
  -- reservations then queue on the same lock instead of deadlocking.
  select * into v_global
  from public.budget_guards
  where scope = 'global'
  order by period_start desc
  limit 1
  for update;

  if not found then
    -- Fail closed. An unconfigured budget is a budget of zero, not a budget
    -- of infinity — invariant 2 is only as good as this branch.
    raise exception 'no global budget guard is configured; refusing to spend'
      using errcode = '53400';
  end if;

  if v_global.spent_paise + p_estimate_paise > v_global.ceiling_paise then
    raise exception 'global ai budget exhausted (% of % paise spent)',
      v_global.spent_paise, v_global.ceiling_paise
      using errcode = '53400';
  end if;

  if p_cohort_id is not null then
    select * into v_cohort
    from public.budget_guards
    where scope = 'cohort' and scope_id = p_cohort_id
    order by period_start desc
    limit 1
    for update;

    -- A cohort without its own guard row spends against the global ceiling
    -- alone. The cohort guard is a tighter optional ring, not a second gate
    -- every cohort must configure.
    if found and v_cohort.spent_paise + p_estimate_paise > v_cohort.ceiling_paise then
      raise exception 'cohort ai budget exhausted (% of % paise spent)',
        v_cohort.spent_paise, v_cohort.ceiling_paise
        using errcode = '53400';
    end if;
  end if;

  -- Both checks passed; take the estimate from every ring that applies.
  update public.budget_guards set spent_paise = spent_paise + p_estimate_paise
  where id = v_global.id;

  if v_cohort.id is not null then
    update public.budget_guards set spent_paise = spent_paise + p_estimate_paise
    where id = v_cohort.id;
  end if;
end;
$$;

comment on function public.ai_spend_reserve is
  'Adds a worst-case estimate to every applicable budget ring, or refuses (53400) if any would overflow. Fail-closed when no global guard exists.';

-- ─────────────────────────────────────────────────────────────────────────────
-- settle
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.ai_spend_settle(
  p_estimate_paise int,
  p_actual_paise   int,
  p_function_name  text,
  p_model          text,
  p_input_tokens   int,
  p_output_tokens  int,
  p_cohort_id      uuid default null,
  p_enrollment_id  uuid default null
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_delta int := p_actual_paise - p_estimate_paise;
begin
  if p_actual_paise is null or p_actual_paise < 0 then
    raise exception 'actual cost must be zero or more paise'
      using errcode = '22023';
  end if;

  -- Replace the estimate with the truth. greatest(0, …) because a release
  -- that raced a settle must never drive a ring negative; overshooting the
  -- ceiling, on the other hand, is allowed to STAND — the money is spent,
  -- and the honest consequence is that the next reserve fails.
  update public.budget_guards set spent_paise = greatest(0, spent_paise + v_delta)
  where id = (
    select id from public.budget_guards
    where scope = 'global'
    order by period_start desc limit 1
  );

  if p_cohort_id is not null then
    update public.budget_guards set spent_paise = greatest(0, spent_paise + v_delta)
    where id = (
      select id from public.budget_guards
      where scope = 'cohort' and scope_id = p_cohort_id
      order by period_start desc limit 1
    );
  end if;

  -- The ledger row. This is the invariant-2 artifact: one call, one row,
  -- priced in paise, attached to the cohort and enrolment it graded for.
  insert into public.ai_usage
    (cohort_id, enrollment_id, function_name, model, input_tokens, output_tokens, cost_paise)
  values
    (p_cohort_id, p_enrollment_id, p_function_name, p_model,
     coalesce(p_input_tokens, 0), coalesce(p_output_tokens, 0), p_actual_paise);
end;
$$;

comment on function public.ai_spend_settle is
  'Swaps a reservation''s estimate for the actual cost and writes the ai_usage ledger row. One call, one row — invariant 2.';

-- ─────────────────────────────────────────────────────────────────────────────
-- release
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.ai_spend_release(
  p_estimate_paise int,
  p_cohort_id uuid default null
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- Only for calls that never happened — the fetch failed, nothing was
  -- billed, no ai_usage row is owed. A call that returned tokens settles.
  update public.budget_guards set spent_paise = greatest(0, spent_paise - p_estimate_paise)
  where id = (
    select id from public.budget_guards
    where scope = 'global'
    order by period_start desc limit 1
  );

  if p_cohort_id is not null then
    update public.budget_guards set spent_paise = greatest(0, spent_paise - p_estimate_paise)
    where id = (
      select id from public.budget_guards
      where scope = 'cohort' and scope_id = p_cohort_id
      order by period_start desc limit 1
    );
  end if;
end;
$$;

comment on function public.ai_spend_release is
  'Returns a reservation whose call never happened. Clamped at zero so a double release cannot mint budget.';

-- ─────────────────────────────────────────────────────────────────────────────
-- who may call these: the service role and nobody else
-- ─────────────────────────────────────────────────────────────────────────────

revoke all on function public.ai_spend_reserve(int, uuid) from public, anon, authenticated;
revoke all on function public.ai_spend_settle(int, int, text, text, int, int, uuid, uuid) from public, anon, authenticated;
revoke all on function public.ai_spend_release(int, uuid) from public, anon, authenticated;

grant execute on function public.ai_spend_reserve(int, uuid) to service_role;
grant execute on function public.ai_spend_settle(int, int, text, text, int, int, uuid, uuid) to service_role;
grant execute on function public.ai_spend_release(int, uuid) to service_role;
