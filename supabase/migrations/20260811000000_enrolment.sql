-- ─────────────────────────────────────────────────────────────────────────────
-- Self-serve enrolment
--
-- /tracks and /dashboard have read enrollments since they shipped, but nothing
-- in the product could create one — the concierge plan was ops inserting rows
-- by hand after payment. This keeps the concierge model (payment is still UPI
-- plus a human reconciling, per ARCHITECTURE Phase 0) but moves the seat
-- reservation into the product, because "message us and wait for a row" is not
-- an enrolment flow anyone can see working.
--
-- The gate order matters and is Law 3's: an enrolment needs a PROFILE, not
-- just a session, because profiles is where the 18+ confirmation lives and
-- grading is profiling. The foreign key enforces this at the bottom; the
-- function raises a readable code first so the client can send the person to
-- onboarding instead of showing them a constraint name.
-- ─────────────────────────────────────────────────────────────────────────────

-- The open cohort for a track, if there is one. Anon-callable on purpose: the
-- track page shows the date and the honest seat count to somebody deciding
-- whether to sign in at all. Aggregated — no enrollee data leaves this.
create or replace function public.open_cohort(p_track_slug text)
returns table (
  cohort_id  uuid,
  starts_on  date,
  ends_on    date,
  capacity   int,
  seats_left int
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select c.id,
         c.starts_on,
         c.ends_on,
         c.capacity,
         greatest(c.capacity - count(e.id) filter (where e.status <> 'withdrawn'), 0)::int
  from public.cohorts c
  join public.paths p on p.id = c.path_id
  join public.tracks t on t.id = p.track_id
  left join public.enrollments e on e.cohort_id = c.id
  where t.slug = p_track_slug
    and c.status = 'open'
  group by c.id
  order by c.starts_on asc
  limit 1
$$;

grant execute on function public.open_cohort(text) to anon, authenticated;

-- Reserve a seat.
create or replace function public.enrol_me(p_cohort_id uuid)
returns uuid
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user     uuid := (select auth.uid());
  v_capacity int;
  v_status   text;
  v_taken    int;
  v_id       uuid;
  v_existing text;
begin
  if v_user is null then
    raise exception 'Sign in to enrol' using errcode = '28000';
  end if;

  -- Law 3. The profiles row is the 18+ confirmation; the enrollments FK
  -- would refuse anyway, but this is the difference between "finish signing
  -- up" and a foreign-key error on somebody's screen.
  if not exists (select 1 from public.profiles where id = v_user) then
    raise exception 'Finish signing up before enrolling' using errcode = 'P0002';
  end if;

  -- Locked so two people cannot take the last seat at once. The count below
  -- happens inside the same lock, which is the whole point of taking it.
  select capacity, status into v_capacity, v_status
  from public.cohorts where id = p_cohort_id
  for update;

  if v_capacity is null then
    raise exception 'That cohort does not exist' using errcode = 'P0002';
  end if;

  if v_status <> 'open' then
    raise exception 'Enrolment for this cohort is closed' using errcode = 'P0001';
  end if;

  -- Re-enrolling is idempotent, and someone who withdrew and changed their
  -- mind gets their place back if there is one. Their old row keeps its
  -- joined_at — history is not rewritten, only the status.
  select id, status into v_id, v_existing
  from public.enrollments
  where cohort_id = p_cohort_id and user_id = v_user;

  if v_id is not null then
    if v_existing = 'withdrawn' then
      update public.enrollments set status = 'active' where id = v_id;
    end if;
    return v_id;
  end if;

  select count(*) into v_taken
  from public.enrollments
  where cohort_id = p_cohort_id and status <> 'withdrawn';

  if v_taken >= v_capacity then
    raise exception 'This cohort is full' using errcode = 'P0003';
  end if;

  insert into public.enrollments (cohort_id, user_id)
  values (p_cohort_id, v_user)
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.enrol_me(uuid) to authenticated;
revoke execute on function public.enrol_me(uuid) from anon;

comment on function public.enrol_me(uuid) is
  'Reserves a seat in an open cohort. Raises 28000 (sign in), P0002 (finish onboarding / unknown cohort), P0001 (closed), P0003 (full) — each mapped by the client to an action, not a message.';
