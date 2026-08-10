-- ─────────────────────────────────────────────────────────────────────────────
-- Course requests
--
-- The first thing on the landing page is now a box that asks what you want to
-- get hired for. There is no model behind it and the UI says so: the text is
-- filed, a person reads it, and a curriculum gets written by hand.
--
-- It sits one step below the vote pages from 20260810000000. A vote says "I
-- want this one of the eighteen we already named"; this says "you have not
-- named the thing I want". Both are demand capture, and neither is evidence of
-- demand that may be quoted as a number in marketing copy.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.course_requests (
  id            uuid primary key default gen_random_uuid(),

  -- What they typed. Length is constrained at the database rather than only in
  -- the form, because the form is not the only way to reach the function and a
  -- text column with no bound is a free disk-filling primitive for anyone who
  -- finds the endpoint.
  prompt        text not null
                check (length(btrim(prompt)) between 10 and 600),

  -- Same anonymous browser id as track_votes: a uuid minted into localStorage,
  -- never an IP or a fingerprint. It exists to rate-limit, not to identify.
  requester_key uuid not null,

  -- Set when the request came from someone signed in, which is the only case
  -- where we can actually tell them it is ready. Null is the common case and
  -- is fine — see the note on the reply copy in the component.
  user_id       uuid references auth.users (id) on delete set null,

  -- Ops queue. 'new' until a human looks at it.
  status        text not null default 'new'
                check (status in ('new', 'triaged', 'writing', 'published', 'declined')),

  created_at    timestamptz not null default now()
);

comment on table public.course_requests is
  'Free-text asks for a course we have not built. No policy on purpose: service-role only for direct access, because these are unmoderated strings typed by strangers and a readable table would publish them. Clients write through request_course(), which is security definer and rate limited.';

create index if not exists course_requests_status_idx
  on public.course_requests (status, created_at desc);

create index if not exists course_requests_requester_idx
  on public.course_requests (requester_key, created_at desc);

alter table public.course_requests enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- write API
-- ─────────────────────────────────────────────────────────────────────────────

-- Files a request and returns its id.
--
-- security definer because the table has no insert policy: putting the rules
-- in one function means there is no second path that skips them. search_path
-- is pinned for the usual reason — a definer function that resolves names
-- through the caller's search_path is the classic escalation hole.
create or replace function public.request_course(p_prompt text, p_requester uuid)
returns uuid
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_prompt text := btrim(coalesce(p_prompt, ''));
  v_recent int;
  v_id     uuid;
begin
  -- Checked here as well as by the column constraint so the caller gets a
  -- sentence rather than a constraint violation. The constraint is what makes
  -- it true; this is what makes it kind.
  if length(v_prompt) < 10 then
    raise exception 'Tell us a little more about the course you want — a few words is not enough to write one from.'
      using errcode = 'check_violation';
  end if;

  if length(v_prompt) > 600 then
    raise exception 'That is longer than we can file. Six hundred characters is plenty to describe a job.'
      using errcode = 'check_violation';
  end if;

  -- One browser cannot file more than five in a day. Weak by construction —
  -- clearing site data resets it — and that is the right amount of effort for
  -- an unauthenticated box on a landing page: enough to stop a bored person
  -- with a keyboard, not enough to pretend it is authentication.
  select count(*) into v_recent
  from public.course_requests
  where requester_key = p_requester
    and created_at > now() - interval '24 hours';

  if v_recent >= 5 then
    raise exception 'You have sent us five of these today. We have them — give us a day to read them.'
      using errcode = 'too_many_rows';
  end if;

  -- The same browser asking for the same thing twice is one request, not two.
  -- Returns the original id so the caller still gets a success, because from
  -- where the person is standing nothing went wrong.
  select id into v_id
  from public.course_requests
  where requester_key = p_requester
    and lower(btrim(prompt)) = lower(v_prompt)
  limit 1;

  if v_id is not null then
    return v_id;
  end if;

  -- (select auth.uid()), not a bare call: the repo-wide rule from
  -- assert-schema-rules.mjs. It matters in a policy, where a bare call is
  -- re-evaluated per row; here it is one row and the wrapping buys nothing
  -- except that the rule stays a rule rather than a rule with exceptions.
  insert into public.course_requests (prompt, requester_key, user_id)
  values (v_prompt, p_requester, (select auth.uid()))
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.request_course(text, uuid) to anon, authenticated;
