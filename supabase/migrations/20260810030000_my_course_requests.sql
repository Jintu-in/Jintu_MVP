-- ─────────────────────────────────────────────────────────────────────────────
-- Reading your own course requests back
--
-- The landing page files a request and says "check your courses to see the
-- status". Until now there was nowhere to check: course_requests has no select
-- policy, deliberately, because the rows are unmoderated strings typed by
-- strangers and a readable table would publish them.
--
-- So the same shape as everything else here — a security-definer function that
-- returns exactly one person's rows and nothing else.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.my_course_requests(p_requester uuid default null)
returns table (
  id         uuid,
  prompt     text,
  status     text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select r.id, r.prompt, r.status, r.created_at
  from public.course_requests r
  where
    -- Signed in: everything filed under this account, on any browser. This is
    -- the branch that matters once someone enrols, because the account is the
    -- thing that follows them between phone and laptop.
    --
    -- No "auth.uid() is not null" guard: for an anonymous caller the
    -- comparison is NULL, which is not TRUE, so the row simply does not match.
    -- The guard would have been a bare auth.uid() call as well, which the
    -- repo-wide rule in assert-schema-rules.mjs rejects.
    r.user_id = (select auth.uid())
    -- Or anonymous: only what this browser filed. The key is a uuid nobody can
    -- guess, which makes it a bearer token for reading your own requests and
    -- nothing more. Worth saying out loud: anyone holding the key can read
    -- those rows, which is why it is a random uuid in localStorage and never
    -- anything derived from a person.
    or (p_requester is not null and r.requester_key = p_requester)
  order by r.created_at desc
  limit 20
$$;

grant execute on function public.my_course_requests(uuid) to anon, authenticated;

comment on function public.my_course_requests(uuid) is
  'One person''s course requests. Never all of them — course_requests has no select policy and must not get one.';

-- ─────────────────────────────────────────────────────────────────────────────
-- Claiming anonymous requests on sign-in
-- ─────────────────────────────────────────────────────────────────────────────

-- Somebody asks for a course, likes the look of the place, and signs up. Their
-- request was filed anonymously and would otherwise stay that way — invisible
-- the moment they clear site data, and unreachable when we want to tell them
-- it is ready.
--
-- This attaches the browser's earlier requests to the account. Only rows that
-- have no owner yet: a request already claimed by someone else is never moved,
-- so holding a key cannot steal another account's history.
create or replace function public.claim_course_requests(p_requester uuid)
returns int
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user    uuid := (select auth.uid());
  v_claimed int;
begin
  if v_user is null then
    raise exception 'Sign in before claiming requests'
      using errcode = 'insufficient_privilege';
  end if;

  update public.course_requests
     set user_id = v_user
   where requester_key = p_requester
     and user_id is null;

  get diagnostics v_claimed = row_count;
  return v_claimed;
end;
$$;

grant execute on function public.claim_course_requests(uuid) to authenticated;
