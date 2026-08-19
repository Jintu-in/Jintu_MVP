-- ─────────────────────────────────────────────────────────────────────────────
-- 0015 — a roadmap we have not written is a demand signal, not a dead end.
--
-- /learn/<unknown> currently 404s into nothing. The edge-state design turns
-- that page into "We have not written that one yet.", lists what does exist,
-- and takes one line of input. This is where that line goes, so the most
-- asked-for subject is a query rather than a hunch.
--
-- Deliberately writable by anon: the person most likely to ask for a subject
-- is the one who does not have an account yet, and demanding a signup to
-- request a roadmap would collect nothing.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.topic_requests (
  id         uuid primary key default gen_random_uuid(),
  -- What they typed, and the slug that failed them. Both matter: the slug
  -- says which link sent them here, the text says what they wanted.
  wanted     text not null check (length(btrim(wanted)) between 2 and 200),
  from_slug  text,
  -- Null for a logged-out visitor, which is most of them.
  user_id    uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

comment on table public.topic_requests is
  'What people looked for and did not find. Anon-writable on purpose — the person asking usually has no account. Never shown back to any client.';

create index if not exists topic_requests_created_idx on public.topic_requests (created_at desc);

alter table public.topic_requests enable row level security;

-- Insert for anyone; read only your own. An attributed request is the
-- person's own words held against their account, which makes it their data
-- under DPDP and puts it in the export. A logged-out request has no owner
-- and is readable by nobody.
do $$ begin
  create policy "anyone may ask for a subject"
    on public.topic_requests for insert
    to anon, authenticated
    with check (
      -- A logged-in request is attributed; a logged-out one is not. Neither
      -- may claim to be somebody else.
      user_id is null or user_id = (select auth.uid())
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "you may read what you asked for"
    on public.topic_requests for select
    to authenticated
    using (user_id = (select auth.uid()));
exception when duplicate_object then null; end $$;

grant insert on public.topic_requests to anon, authenticated;
grant select on public.topic_requests to authenticated;
