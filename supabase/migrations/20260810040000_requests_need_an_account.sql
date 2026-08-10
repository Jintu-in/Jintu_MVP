-- ─────────────────────────────────────────────────────────────────────────────
-- Course requests need an account, and can be shared
--
-- Two changes that belong together.
--
-- Requesting now requires signing in. The reason is not gatekeeping: a request
-- we cannot answer is a request we should not have taken. Anonymous asks had
-- nowhere to send the answer, and the reply had to say so — "there is nothing
-- for you to do now" is a poor thing to tell somebody who just asked you for
-- something.
--
-- And a request can be shared. The link opens for anybody signed in, which is
-- how a student sends "I asked for this, back me up" to a classmate. It stays
-- shut for anon, because the row is free text somebody typed.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.request_course(p_prompt text, p_requester uuid)
returns uuid
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_user   uuid := (select auth.uid());
  v_prompt text := btrim(coalesce(p_prompt, ''));
  v_recent int;
  v_id     uuid;
begin
  -- The gate. errcode 28000 (invalid_authorization_specification) so the
  -- caller can tell "sign in first" apart from "your text is too short" and
  -- open the sign-in dialog instead of printing a sentence at somebody who
  -- cannot act on it.
  if v_user is null then
    raise exception 'Sign in to request a course'
      using errcode = '28000';
  end if;

  if length(v_prompt) < 10 then
    raise exception 'Tell us a little more about the course you want — a few words is not enough to write one from.'
      using errcode = 'check_violation';
  end if;

  if length(v_prompt) > 600 then
    raise exception 'That is longer than we can file. Six hundred characters is plenty to describe a job.'
      using errcode = 'check_violation';
  end if;

  -- Counted per account now, not per browser. The browser key was the best
  -- available handle while these were anonymous; an account is a better one,
  -- and clearing site data no longer resets the limit.
  select count(*) into v_recent
  from public.course_requests
  where user_id = v_user
    and created_at > now() - interval '24 hours';

  if v_recent >= 5 then
    raise exception 'You have sent us five of these today. We have them — give us a day to read them.'
      using errcode = 'too_many_rows';
  end if;

  -- Same person asking for the same thing twice is one request. Returns the
  -- original id, so the caller still gets a success and a link to share.
  select id into v_id
  from public.course_requests
  where user_id = v_user
    and lower(btrim(prompt)) = lower(v_prompt)
  limit 1;

  if v_id is not null then
    return v_id;
  end if;

  -- requester_key is still recorded. It is no longer what authorises anything,
  -- but one account filing from nine browsers and nine accounts filing from
  -- one browser look different, and only one of them is a person.
  insert into public.course_requests (prompt, requester_key, user_id)
  values (v_prompt, p_requester, v_user)
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.request_course(text, uuid) to authenticated;
revoke execute on function public.request_course(text, uuid) from anon;

comment on function public.request_course(text, uuid) is
  'Files a course request. Requires a session — raises 28000 for anon so the client can open sign-in rather than show an error.';

-- ─────────────────────────────────────────────────────────────────────────────
-- Sharing
-- ─────────────────────────────────────────────────────────────────────────────

-- One request, by id, for anybody signed in.
--
-- Deliberately not restricted to the author: the point is that the author can
-- send the link to someone else. It is also deliberately not open to anon —
-- the prompt is free text a person typed, and a link that leaks out of a
-- WhatsApp group should not publish it to the web.
--
-- No author identity is returned. Whoever opens the link learns what was asked
-- and where it got to, not who asked.
create or replace function public.shared_course_request(p_id uuid)
returns table (
  id         uuid,
  prompt     text,
  status     text,
  created_at timestamptz,
  is_mine    boolean
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select r.id,
         r.prompt,
         r.status,
         r.created_at,
         r.user_id is not distinct from (select auth.uid()) as is_mine
  from public.course_requests r
  where r.id = p_id
    and (select auth.uid()) is not null
$$;

grant execute on function public.shared_course_request(uuid) to authenticated;
revoke execute on function public.shared_course_request(uuid) from anon;

-- ─────────────────────────────────────────────────────────────────────────────
-- Narrowing what a browser key unlocks
-- ─────────────────────────────────────────────────────────────────────────────

-- my_course_requests matched on `requester_key OR user_id`, which was right
-- while requests were anonymous: the key was the only handle anyone had.
--
-- Now that every new request has an owner, that same clause makes the key a
-- second credential for account data — anybody who came by a uuid from
-- localStorage could read that person's requests without signing in. The key
-- was never meant to authorise anything.
--
-- So the key now unlocks only rows that have no owner, which is exactly the
-- set it was introduced for: requests filed before this migration, still
-- waiting to be claimed.
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
    -- Signed in: everything filed under this account, on any browser.
    r.user_id = (select auth.uid())
    -- Or a legacy anonymous row this browser filed and nobody has claimed.
    or (p_requester is not null and r.requester_key = p_requester and r.user_id is null)
  order by r.created_at desc
  limit 20
$$;

grant execute on function public.my_course_requests(uuid) to anon, authenticated;
