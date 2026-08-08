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
  select string_agg(c.relname, ', ' order by c.relname) into offenders
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind = 'r'
    and c.relrowsecurity
    and not exists (select 1 from pg_policy p where p.polrelid = c.oid);

  if offenders is not null then
    raise exception 'Tables with RLS but no policy: %', offenders;
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

  raise notice 'All schema guarantees hold.';
end $$;
