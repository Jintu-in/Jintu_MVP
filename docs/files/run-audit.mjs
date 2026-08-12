/**
 * Audit runner for the v3 schema drop (0001–0008).
 *
 *   node docs/files/run-audit.mjs            # apply migrations, stop at first error
 *   node docs/files/run-audit.mjs --tests    # apply + run 9999_tests.sql assertions
 *
 * Docker is not available on this machine, so `supabase db reset` cannot run;
 * this uses PGlite — a real Postgres — which is what "let Postgres tell you"
 * requires. The shim below reproduces the Supabase surface faithfully where
 * it matters and mocks only what a WASM Postgres cannot host:
 *
 *   real     auth schema, auth.uid() reading request.jwt.claims (exactly how
 *            GoTrue does it), anon/authenticated/service_role roles, and
 *            Supabase's default grants (RLS is the gate, not GRANT)
 *   real     citext, via PGlite's bundled contrib extension
 *   skipped  pgcrypto (gen_random_uuid() is core since PG13; the extension
 *            line is harmless on Supabase and unloadable here)
 *   mocked   pg_cron / pgmq / pg_net — server-daemon extensions that exist on
 *            Supabase but cannot run in WASM. Signatures mirror the real ones
 *            so a call-shape error would still surface.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { citext } from "@electric-sql/pglite/contrib/citext";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const FILES = [
  "0001_init.sql", "0002_identity.sql", "0003_curriculum.sql", "0004_work.sql",
  "0005_points.sql", "0006_ops.sql", "0007_discovery.sql", "0008_views_guards.sql",
];

const SHIM = `
-- Supabase surface -----------------------------------------------------------
create schema if not exists auth;
create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text
);
-- auth.uid() exactly as Supabase defines it: the sub claim of the request JWT.
create or replace function auth.uid() returns uuid
language sql stable as $$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'sub')::uuid
$$;
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end $$;

-- Server-daemon extensions, mocked with the real signatures ------------------
create schema if not exists cron;
create or replace function cron.schedule(jobname text, schedule text, command text)
returns bigint language sql as $$ select 1::bigint $$;
create schema if not exists pgmq;
create or replace function pgmq.create(queue_name text)
returns void language plpgsql as $mock$
begin
  execute format('create table if not exists pgmq.q_%I (msg_id bigserial primary key, message jsonb)', queue_name);
end $mock$;
create or replace function pgmq.send(queue_name text, msg jsonb)
returns bigint language plpgsql as $mock$
declare id bigint;
begin
  execute format('insert into pgmq.q_%I (message) values ($1) returning msg_id', queue_name)
    using msg into id;
  return id;
end $mock$;
create schema if not exists net;
create or replace function net.http_post(url text, body jsonb default '{}'::jsonb, params jsonb default '{}'::jsonb, headers jsonb default '{}'::jsonb)
returns bigint language sql as $$ select 1::bigint $$;
`;

// Supabase grants broadly and lets RLS gate. Reproduce that after migrations.
const GRANTS = `
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;
`;

// gen_random_uuid() is core; pgcrypto/pg_cron/pgmq/pg_net cannot load in WASM.
// Only these exact lines are neutralised, and only in this runner — the files
// keep them for Supabase.
const ENV_SKIP = [
  `create extension if not exists "pgcrypto";`,
  `create extension if not exists "pg_cron";`,
  `create extension if not exists "pgmq";`,
  `create extension if not exists "pg_net";`,
];

const db = await PGlite.create({ extensions: { citext } });
await db.exec(SHIM);

let failed = false;
for (const file of FILES) {
  let sql = readFileSync(path.join(DIR, file), "utf8");
  for (const line of ENV_SKIP) sql = sql.replace(line, `-- [runner] env-skip: ${line}`);
  try {
    await db.exec(sql);
    console.log(`ok    ${file}`);
  } catch (e) {
    failed = true;
    console.log(`FAIL  ${file}`);
    console.log(`      ${e.message}`);
    if (e.position) {
      const upto = sql.slice(0, Number(e.position));
      const line = upto.split("\n").length;
      console.log(`      at approx line ${line}: ${sql.split("\n")[line - 1]?.trim()}`);
    }
    break;
  }
}

if (!failed && process.argv.includes("--tests")) {
  const tests = readFileSync(path.join(DIR, "9999_tests.sql"), "utf8");
  await db.exec(GRANTS);
  // The test file is a sequence of DO blocks separated by lines of dashes;
  // each block asserts one thing and raises on failure. Run them one at a
  // time so a failure names its block.
  const blocks = tests.split(/^-- ={10,}.*$/m).map((b) => b.trim()).filter(Boolean);
  let pass = 0;
  const fails = [];
  for (const block of blocks) {
    const title = (block.match(/^--\s*TEST:\s*(.+)$/m) ?? [])[1] ?? block.slice(0, 60);
    try {
      await db.exec(block);
      pass++;
      console.log(`  ok    ${title}`);
    } catch (e) {
      fails.push(title);
      console.log(`  FAIL  ${title}`);
      console.log(`        ${e.message.split("\n")[0]}`);
      await db.exec("rollback;").catch(() => {});
    }
  }
  console.log(`\n${pass} passed, ${fails.length} failed`);
  if (fails.length) process.exit(1);

  const health = await db.query("select * from schema_health");
  console.log("\nschema_health:");
  for (const row of health.rows) console.log(`  ${row.check_name}: ${row.value}`);
}

await db.close();
if (failed) process.exit(1);
