-- Runtime assertions against a database that has actually applied the
-- migrations. The static checker in scripts/assert-schema-rules.mjs reads SQL
-- text and can be fooled by anything it does not parse; this reads the
-- Postgres catalog, so it reports what the database really did.
--
--   supabase start
--   supabase db query --file supabase/tests/schema_guarantees.sql
--
-- Every assertion is catalog-based on purpose: no fixture rows, no auth.users
-- seeding, nothing that rots when the schema grows.

do $$
declare
  offenders text;
begin
  -- ── §7: RLS enabled on every table ─────────────────────────────────────────
  select string_agg(c.relname, ', ' order by c.relname) into offenders
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and not c.relrowsecurity;

  if offenders is not null then
    raise exception 'Tables without RLS: %. A table without RLS is readable by anyone holding the anon key.', offenders;
  end if;

  -- ── RLS with no policy denies everyone; that is a bug, not a lockdown ──────
  --
  -- Unless denying everyone is the point. A cost ledger, an outbound message
  -- log and an append-only audit trail are written by edge functions holding
  -- the service role, which bypasses RLS entirely — a policy on those tables
  -- would only ever grant a client access it must not have.
  --
  -- The exemption is declared in the table's own comment, which is the same
  -- marker scripts/assert-schema-rules.mjs reads. Two guards checking the same
  -- rule against two different lists is how one of them ends up wrong, and the
  -- one that gets edited is whichever is failing that afternoon.
  select string_agg(c.relname, ', ' order by c.relname) into offenders
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and c.relrowsecurity
    and not exists (select 1 from pg_policy p where p.polrelid = c.oid)
    and coalesce(obj_description(c.oid, 'pg_class'), '') !~* 'service-role only';

  if offenders is not null then
    raise exception
      'Tables with RLS but no policy: %. If that is intended, say so in a table comment containing "service-role only".',
      offenders;
  end if;

  -- ── Law 3: a minor's profile must be unrepresentable ──────────────────────
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_must_be_adult'
      and pg_get_constraintdef(oid) ilike '%is_adult_confirmed%'
  ) then
    raise exception 'Law 3: profiles_must_be_adult constraint is missing — a profile could be created without an 18+ confirmation.';
  end if;

  -- ── DPDP: consent is purpose-scoped, not a boolean ────────────────────────
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.consents'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%purpose%'
  ) then
    raise exception 'consents.purpose has no CHECK constraint — any string would be accepted as a lawful basis.';
  end if;

  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and indexname = 'consents_one_active_per_purpose'
  ) then
    raise exception 'consents_one_active_per_purpose index is missing — a user could hold two live consents for one purpose.';
  end if;

  -- ── TPO contact details must not reach the pre-auth surface ───────────────
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'public_colleges'
      and column_name in ('tpo_name', 'tpo_phone')
  ) then
    raise exception 'public_colleges exposes TPO contact details to anon.';
  end if;

  -- ── Law 2: the resources table cannot hold content ────────────────────────
  select string_agg(column_name, ', ' order by column_name) into offenders
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'resources'
    and column_name in ('transcript', 'summary', 'full_text', 'content', 'body', 'text');

  if offenders is not null then
    raise exception 'Law 2: resources has content column(s): %. URLs and metadata only.', offenders;
  end if;

  -- ── Published curriculum is immutable ─────────────────────────────────────
  select string_agg(t.tbl, ', ' order by t.tbl) into offenders
  from (values ('paths'), ('modules'), ('resources'), ('assignments')) as t(tbl)
  where not exists (
    select 1 from pg_trigger g
    where g.tgrelid = ('public.' || t.tbl)::regclass
      and not g.tgisinternal
  );

  if offenders is not null then
    raise exception 'No immutability trigger on: %. A published path could be rewritten under a running cohort.', offenders;
  end if;

  -- ── The free curriculum really is public ──────────────────────────────────
  -- §6 makes /learn/[track] the top of the funnel: indexable, no account.
  -- If the anon grant regresses, the funnel silently closes and the only
  -- symptom is traffic that never converts.
  select string_agg(t.tbl, ', ' order by t.tbl) into offenders
  from (values ('tracks'), ('paths'), ('modules'), ('resources')) as t(tbl)
  where not exists (
    select 1
    from pg_policy p
    join pg_roles r on r.oid = any (p.polroles)
    where p.polrelid = ('public.' || t.tbl)::regclass
      and p.polcmd = 'r'
      and r.rolname = 'anon'
  );

  if offenders is not null then
    raise exception 'Published curriculum is not readable by anon on: %.', offenders;
  end if;

  raise notice 'All schema guarantees hold.';
end $$;
