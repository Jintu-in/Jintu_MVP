/**
 * The Supabase-provided objects the migrations depend on but do not create.
 *
 * Shared by scripts/simulate-migrations.mjs and scripts/test-data-analyst-v2.mjs
 * rather than copied into each. A second copy would have drifted the first time
 * a migration started using something new, and the symptom — one suite passing
 * and the other failing on a schema error unrelated to what it tests — reads
 * like a flaky test rather than a stale shim.
 *
 * This is not the real thing. PGlite has no Supabase auth schema and does not
 * enforce RLS the way a live project does; see the caveat at the top of
 * simulate-migrations.mjs.
 */
export const SHIM = `
create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  phone text unique
);
create or replace function auth.uid() returns uuid
  language sql stable
  as $fn$ select nullif(current_setting('jintu.uid', true), '')::uuid $fn$;
do $do$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role; end if;
end $do$;

-- Storage. Only the three objects the migrations touch: the bucket registry,
-- the object table policies attach to, and foldername(), which is how a path
-- convention becomes an ownership check. Column set matches the real
-- storage.buckets closely enough for the insert to be meaningful — if a
-- migration references a column that does not exist here, that is a finding,
-- not a shim to widen.
create schema if not exists storage;
create table if not exists storage.buckets (
  id                 text primary key,
  name               text not null,
  public             boolean not null default false,
  file_size_limit    bigint,
  allowed_mime_types text[],
  created_at         timestamptz not null default now()
);
create table if not exists storage.objects (
  id         uuid primary key default gen_random_uuid(),
  bucket_id  text references storage.buckets (id),
  name       text,
  owner      uuid,
  created_at timestamptz not null default now()
);
alter table storage.objects enable row level security;
-- The real implementation returns the path minus the filename, so the first
-- element is the top folder. Matching that exactly matters: a shim that
-- returned every segment would make [1] the same value either way and the
-- ownership assertions below would pass against a broken policy.
create or replace function storage.foldername(name text) returns text[]
  language sql immutable
  as $fn$
    select case
      when array_length(string_to_array(name, '/'), 1) > 1
        then (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1]
      else array[]::text[]
    end
  $fn$;
`;
