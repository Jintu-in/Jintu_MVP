/**
 * Applies every migration and the seed to a real Postgres, then asserts the
 * behaviour the schema is supposed to guarantee.
 *
 *   pnpm db:simulate
 *
 * Postgres runs in-process via PGlite (WASM), so this needs no Docker, no
 * network, no project, and no secrets. That matters: the Docker-based
 * `database` CI job and `supabase start` were both unavailable on the machine
 * this schema was written on, which is exactly how a trigger that raises
 * "record new has no field module_id" reached main with three green checks.
 *
 * Static analysis cannot catch that class of bug. plpgsql resolves record
 * fields when a statement executes, so the only way to know a trigger works
 * is to fire it.
 *
 * This is not a replacement for the Docker job: PGlite has no Supabase auth
 * schema, no anon/authenticated roles, and does not enforce RLS the way a
 * real project does — the shims below fake just enough for the DDL to apply.
 * It catches schema and trigger logic. The Docker job catches the rest.
 */
import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");
const SEED = path.join(ROOT, "supabase", "seed.sql");

/** Objects Supabase provides that the migrations depend on but do not create. */
const SHIM = `
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
`;

const PATH_ID = "22222222-2222-4222-8222-222222222222";
const MODULE_1 = "33333333-3333-4333-8333-000000000001";
const USER_1 = "55555555-5555-4555-8555-000000000001";

let passed = 0;
const failures = [];

function record(ok, label, detail) {
  if (ok) {
    passed++;
    console.log(`  ok    ${label}`);
  } else {
    failures.push({ label, detail });
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const db = await PGlite.create();
await db.exec(SHIM);

console.log("── migrations ──────────────────────────────────────────────");
const files = readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort();
if (files.length === 0) {
  console.error("No migrations found.");
  process.exit(1);
}
for (const file of files) {
  try {
    await db.exec(readFileSync(path.join(MIGRATIONS, file), "utf8"));
    record(true, file);
  } catch (e) {
    record(false, file, e.message);
    console.error("\nMigration failed; later assertions would be meaningless.");
    process.exit(1);
  }
}

if (existsSync(SEED)) {
  console.log("\n── seed ────────────────────────────────────────────────────");
  try {
    await db.exec(readFileSync(SEED, "utf8"));
    // The seed publishes last on purpose; if the triggers are wrong it is the
    // first thing that breaks.
    record(true, "seed.sql applies (exercises insert-then-publish ordering)");
  } catch (e) {
    record(false, "seed.sql", e.message);
  }
}

async function rejects(label, sql) {
  try {
    await db.exec(sql);
    record(false, label, "succeeded, should have been rejected");
  } catch {
    record(true, label);
  }
}

async function allows(label, sql) {
  try {
    await db.exec(sql);
    record(true, label);
  } catch (e) {
    record(false, label, e.message.split("\n")[0]);
  }
}

console.log("\n── published curriculum is immutable ───────────────────────");
await rejects(
  "insert a module into a published path",
  `insert into public.modules (path_id, week_no, title, objective)
   values ('${PATH_ID}', 9, 'Sneaky', 'nope');`,
);
await rejects(
  "rewrite a module title",
  `update public.modules set title = 'Rewritten' where id = '${MODULE_1}';`,
);
await rejects("delete a module", `delete from public.modules where id = '${MODULE_1}';`);
await rejects(
  "rewrite a resource title",
  `update public.resources set title = 'Rewritten' where module_id = '${MODULE_1}';`,
);
await rejects(
  "insert an assignment",
  `insert into public.assignments (module_id, kind, spec)
   values ('${MODULE_1}', 'file', '{}'::jsonb);`,
);
await rejects("delete a published path", `delete from public.paths where id = '${PATH_ID}';`);
await rejects(
  "rewrite a published path's version",
  `update public.paths set version = 99 where id = '${PATH_ID}';`,
);
// The exception to all of the above, and the reason the trigger is not a
// blanket freeze — see §6's check-link-health cron.
await allows(
  "the link-health cron may still mark a resource dead",
  `update public.resources set health = 'dead', last_checked_at = now()
   where module_id = '${MODULE_1}';`,
);
await allows(
  "archiving a published path",
  `update public.paths set status = 'archived' where id = '${PATH_ID}';`,
);

console.log("\n── Law 3 and DPDP consent ──────────────────────────────────");
await db.exec(`insert into auth.users (id, phone) values ('${USER_1}', '+919876543210');`);
await rejects(
  "a profile without the 18+ confirmation",
  `insert into public.profiles (id, phone, is_adult_confirmed)
   values ('${USER_1}', '+919876543210', false);`,
);
await allows(
  "a profile with the 18+ confirmation",
  `insert into public.profiles (id, phone, is_adult_confirmed)
   values ('${USER_1}', '+919876543210', true);`,
);
await allows(
  "granting a purpose-scoped consent",
  `insert into public.consents (user_id, purpose, notice_version)
   values ('${USER_1}', 'analytics', '2026-08-09.v1');`,
);
await rejects(
  "two live consents for the same purpose",
  `insert into public.consents (user_id, purpose, notice_version)
   values ('${USER_1}', 'analytics', '2026-08-09.v1');`,
);
await allows(
  "withdrawing then re-granting keeps the audit trail",
  `update public.consents set withdrawn_at = now()
     where user_id = '${USER_1}' and purpose = 'analytics';
   insert into public.consents (user_id, purpose, notice_version)
     values ('${USER_1}', 'analytics', '2026-08-09.v2');`,
);
await rejects(
  "a purpose that is not in the allowed set",
  `insert into public.consents (user_id, purpose, notice_version)
   values ('${USER_1}', 'sell_to_advertisers', 'v1');`,
);

console.log("\n── waitlist ────────────────────────────────────────────────");
await rejects(
  "a waitlist row without the 18+ confirmation",
  `insert into public.waitlist_signups (phone, is_adult_confirmed, consent_contact, notice_version)
   values ('+919876543211', false, true, 'v1');`,
);
await rejects(
  "a waitlist row without contact consent",
  `insert into public.waitlist_signups (phone, is_adult_confirmed, consent_contact, notice_version)
   values ('+919876543211', true, false, 'v1');`,
);
await rejects(
  "a non-Indian mobile number",
  `insert into public.waitlist_signups (phone, is_adult_confirmed, consent_contact, notice_version)
   values ('+14155550123', true, true, 'v1');`,
);
// Declining the optional purpose must never block the signup, or the consent
// stops being freely given — docs/LEGAL.md §2.2.
await allows(
  "a valid signup that declines WhatsApp updates",
  `insert into public.waitlist_signups
     (phone, is_adult_confirmed, consent_contact, consent_whatsapp, notice_version)
   values ('+919876543211', true, true, false, 'v1');`,
);

console.log("\n── RLS ─────────────────────────────────────────────────────");
const noRls = await db.query(`
  select c.relname from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity
  order by c.relname`);
record(
  noRls.rows.length === 0,
  "every public table has RLS enabled",
  noRls.rows.map((r) => r.relname).join(", "),
);

const noPolicy = await db.query(`
  select c.relname from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
    and not exists (select 1 from pg_policy p where p.polrelid = c.oid)
  order by c.relname`);
record(
  noPolicy.rows.length === 0,
  "every table with RLS has at least one policy",
  noPolicy.rows.map((r) => r.relname).join(", "),
);

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f.label}${f.detail ? `: ${f.detail}` : ""}`);
  process.exit(1);
}
