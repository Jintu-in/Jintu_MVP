-- 0006_ops.sql
-- AI cost tracking, budget guards, notifications, link health.
--
-- LAW 1 from the architecture, made operational: every LLM call writes a row
-- here with its cost in paise, and a guard hard-fails calls past the ceiling.
-- The original design was modelled at Rs 3,500-6,000 per user per month
-- against Rs 1,300 of revenue. These two tables are why that cannot recur.

create table ai_usage (
  id             bigserial primary key,
  user_id        uuid references profiles on delete set null,
  submission_id  uuid references submissions on delete set null,
  function_name  text not null,
  model          text not null,
  input_tokens   integer not null default 0 check (input_tokens >= 0),
  output_tokens  integer not null default 0 check (output_tokens >= 0),
  cost_paise     integer not null check (cost_paise >= 0),
  created_at     timestamptz not null default now()
);
create index on ai_usage (created_at desc);
create index on ai_usage (user_id, created_at desc);
create index on ai_usage (function_name, created_at desc);

-- One row per scope per period. 'global' is the circuit breaker; 'user' catches
-- the individual who has found something expensive to do repeatedly.
create table budget_guards (
  id             uuid primary key default gen_random_uuid(),
  scope          text not null check (scope in ('global','track','user')),
  scope_id       text not null default 'all',
  ceiling_paise  integer not null check (ceiling_paise > 0),
  spent_paise    integer not null default 0 check (spent_paise >= 0),
  period_start   date not null default date_trunc('month', current_date)::date,
  period_days    smallint not null default 30,
  unique (scope, scope_id, period_start)
);

-- Called before every paid model call. Returns false rather than raising, so
-- the caller degrades to manual review instead of erroring at the learner.
create or replace function budget_ok(
  p_scope text, p_scope_id text, p_estimated_paise integer default 0
) returns boolean language plpgsql security definer set search_path = public as $$
declare g budget_guards;
begin
  select * into g from budget_guards
  where scope = p_scope and scope_id = p_scope_id
    and period_start = date_trunc('month', current_date)::date;
  if not found then return true; end if;   -- unbudgeted scope is unrestricted
  return (g.spent_paise + p_estimated_paise) <= g.ceiling_paise;
end $$;

-- Recording spend and checking it must not drift apart, so ai_usage inserts
-- update the guards automatically.
create or replace function accrue_spend()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update budget_guards
    set spent_paise = spent_paise + new.cost_paise
  where period_start = date_trunc('month', current_date)::date
    and (
      (scope = 'global')
      or (scope = 'user' and scope_id = new.user_id::text)
      -- 'track' was in the allowed scopes but never accrued, so a track
      -- ceiling would silently never fill. Derived through the submission,
      -- which is the only thing an ai_usage row reliably knows.
      or (scope = 'track' and new.submission_id is not null and scope_id in (
        select e.track_id::text
        from submissions s join enrollments e on e.id = s.enrollment_id
        where s.id = new.submission_id
      ))
    );
  return new;
end $$;
create trigger ai_usage_accrue after insert on ai_usage
  for each row execute function accrue_spend();

-- Daily cost by function. The first thing to open when a bill looks wrong.
create or replace view ai_cost_daily as
select date_trunc('day', created_at)::date as day,
       function_name, model,
       count(*) as calls,
       sum(input_tokens) as in_tokens,
       sum(output_tokens) as out_tokens,
       sum(cost_paise) as paise,
       round(sum(cost_paise) / 100.0, 2) as rupees
from ai_usage
group by 1, 2, 3
order by 1 desc, paise desc;

-- Cost per learner per track. If this exceeds Rs 120 the model routing is wrong.
create or replace view cost_per_learner as
select e.user_id, e.track_id, t.slug,
       coalesce(sum(u.cost_paise), 0) as paise,
       round(coalesce(sum(u.cost_paise), 0) / 100.0, 2) as rupees
from enrollments e
join tracks t on t.id = e.track_id
left join submissions s on s.enrollment_id = e.id
left join ai_usage u on u.submission_id = s.id
group by 1, 2, 3;

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------
create table notifications (
  id          bigserial primary key,
  user_id     uuid not null references profiles on delete cascade,
  channel     text not null check (channel in ('push','email','whatsapp')),
  template    text not null,
  payload     jsonb not null default '{}'::jsonb,
  status      text not null default 'queued' check (status in ('queued','sent','failed','skipped')),
  cost_paise  integer not null default 0,
  sent_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index on notifications (user_id, created_at desc);
create index on notifications (status) where status = 'queued';

-- Never notify without consent, and never twice for the same thing in a day.
-- created_at::date is NOT immutable (it reads the session timezone), so
-- Postgres refuses it in an index. AT TIME ZONE with a constant zone IS
-- immutable — and pinning the day to IST is also the honest boundary, since
-- "once a day" means the learner's day, not the server's.
create unique index notifications_daily_dedupe
  on notifications (user_id, template, ((created_at at time zone 'Asia/Kolkata')::date))
  where status <> 'failed';

create or replace function assert_nudge_consent()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.template like 'nudge%' and not has_consent(new.user_id, 'nudges') then
    new.status := 'skipped';
  end if;
  return new;
end $$;
create trigger notifications_consent before insert on notifications
  for each row execute function assert_nudge_consent();

-- ---------------------------------------------------------------------------
-- Link health. Detection is automatic; replacement is not.
-- Silently swapping a resource under a learner mid-unit is worse than a dead
-- link, so this table only ever flags.
-- ---------------------------------------------------------------------------
create table link_checks (
  id           bigserial primary key,
  resource_id  uuid not null references resources on delete cascade,
  status_code  integer,
  ok           boolean not null,
  checked_at   timestamptz not null default now()
);
create index on link_checks (resource_id, checked_at desc);

create or replace function record_link_check(p_resource uuid, p_status integer)
returns void language plpgsql security definer set search_path = public as $$
declare recent_failures integer;
begin
  insert into link_checks (resource_id, status_code, ok)
  values (p_resource, p_status, p_status between 200 and 399);

  select count(*) into recent_failures
  from (select ok from link_checks where resource_id = p_resource
        order by checked_at desc limit 3) recent
  where not ok;

  -- Two consecutive failures degrade it; three mark it dead for a human to fix.
  update resources set
    health = case when recent_failures >= 3 then 'dead'
                  when recent_failures >= 2 then 'degraded'
                  else 'ok' end,
    last_checked_at = now()
  where id = p_resource;
end $$;

-- ---------------------------------------------------------------------------
-- Scheduled jobs — NOT scheduled here, deliberately. Two reasons:
--
--   1. The original jobs read current_setting('app.functions_url') and
--      current_setting('app.service_key'), which nothing ever set: both jobs
--      would fail at execution, silently, forever.
--   2. Worse than the failure, the obvious "fix" — ALTER DATABASE ... SET
--      app.service_key — hands the service key to EVERY role, because
--      current_setting() is callable by any SQL client. A cron job must read
--      secrets from Vault, which only elevated roles can decrypt.
--
-- Scheduling is therefore an ops step run once per environment in the SQL
-- editor, after storing the two secrets in Vault (Dashboard -> Vault:
-- 'functions_url', 'service_key'):
--
--   select cron.schedule('link-health-weekly', '0 3 * * 1', $job$
--     select net.http_post(
--       url := (select decrypted_secret from vault.decrypted_secrets where name = 'functions_url') || '/check-link-health',
--       headers := jsonb_build_object('Authorization', 'Bearer ' ||
--         (select decrypted_secret from vault.decrypted_secrets where name = 'service_key'))
--     );
--   $job$);
--
--   select cron.schedule('nudges-daily', '30 12 * * *', $job$
--     select net.http_post(
--       url := (select decrypted_secret from vault.decrypted_secrets where name = 'functions_url') || '/send-nudges',
--       headers := jsonb_build_object('Authorization', 'Bearer ' ||
--         (select decrypted_secret from vault.decrypted_secrets where name = 'service_key'))
--     );
--   $job$);
--
-- (cron.schedule(name, schedule, command) and net.http_post(url, body,
-- params, headers) are the correct current signatures; pg_cron, pgmq and
-- pg_net all exist on Supabase but must be enabled for the project first.)

-- ---------------------------------------------------------------------------
-- Grading queue
-- ---------------------------------------------------------------------------
select pgmq.create('grading');

create or replace function enqueue_grading()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'submitted' then
    perform pgmq.send('grading', jsonb_build_object('submission_id', new.id));
  end if;
  return new;
end $$;
create trigger submissions_enqueue after insert on submissions
  for each row execute function enqueue_grading();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table ai_usage      enable row level security;
alter table budget_guards enable row level security;
alter table notifications enable row level security;
alter table link_checks   enable row level security;

-- ai_usage, budget_guards, link_checks: no client policy. Service role only.
create policy notifications_own on notifications for select
  using (user_id = (select auth.uid()));

comment on function budget_ok is
  'Called before every paid model call. Returns false so the caller degrades to manual review rather than overspending.';
comment on table link_checks is
  'Detection only. AI never auto-replaces a resource — silently changing a curriculum under a learner is worse than a dead link.';
