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

console.log("\n── sprint loop ─────────────────────────────────────────────");
const COHORT = "66666666-6666-4666-8666-000000000001";
const ENROL_A = "77777777-7777-4777-8777-00000000000a";
const ENROL_B = "77777777-7777-4777-8777-00000000000b";
const USER_2 = "55555555-5555-4555-8555-000000000002";
const ASSIGNMENT = await db.query(
  `select id from public.assignments where kind = 'sql' limit 1`,
);
const ASSIGN_ID = ASSIGNMENT.rows[0]?.id;

await db.exec(`
  insert into auth.users (id, phone) values ('${USER_2}', '+919876543212');
  insert into public.profiles (id, phone, is_adult_confirmed)
    values ('${USER_2}', '+919876543212', true);
  insert into public.cohorts (id, path_id, mode, starts_on, ends_on, capacity, status)
    values ('${COHORT}', '${PATH_ID}', 'public', date '2026-09-01', date '2026-10-13', 20, 'open');
  insert into public.enrollments (id, cohort_id, user_id)
    values ('${ENROL_A}', '${COHORT}', '${USER_1}'),
           ('${ENROL_B}', '${COHORT}', '${USER_2}');
  insert into public.submissions (id, enrollment_id, assignment_id, week_no, payload)
    values ('88888888-8888-4888-8888-000000000001', '${ENROL_A}', '${ASSIGN_ID}', 1, '{"sql":"select 1"}'::jsonb);
`);
record(true, "cohort, enrolments and a submission insert cleanly");

// A student marking their own work is not peer review.
await rejects(
  "assigning a student their own submission to review",
  `insert into public.peer_reviews (submission_id, reviewer_enrollment_id, due_at)
   values ('88888888-8888-4888-8888-000000000001', '${ENROL_A}', now() + interval '3 days');`,
);
await allows(
  "assigning a different student as reviewer",
  `insert into public.peer_reviews (submission_id, reviewer_enrollment_id, due_at)
   values ('88888888-8888-4888-8888-000000000001', '${ENROL_B}', now() + interval '3 days');`,
);

// Law 1: an AI grade that cannot be costed, or a free grade that charges.
await rejects(
  "an AI grading with no model recorded",
  `insert into public.gradings (submission_id, grader_type, scores, total, cost_paise)
   values ('88888888-8888-4888-8888-000000000001', 'ai', '{}'::jsonb, 4, 120);`,
);
await rejects(
  "a deterministic grading that claims an AI cost",
  `insert into public.gradings (submission_id, grader_type, scores, total, cost_paise)
   values ('88888888-8888-4888-8888-000000000001', 'deterministic', '{}'::jsonb, 4, 120);`,
);
await allows(
  "a deterministic grading at zero cost",
  `insert into public.gradings (submission_id, grader_type, scores, total)
   values ('88888888-8888-4888-8888-000000000001', 'deterministic', '{"returns_expected_rows":3}'::jsonb, 4);`,
);

// docs/LEGAL.md §3.1: only document_verified outcomes may ever be published.
await rejects(
  "publish consent on a self-reported outcome",
  `insert into public.outcomes (enrollment_id, event, source, publish_consent_at)
   values ('${ENROL_A}', 'offer', 'self_reported', now());`,
);
await allows(
  "publish consent on a document-verified outcome",
  `insert into public.outcomes (enrollment_id, event, source, publish_consent_at)
   values ('${ENROL_A}', 'offer', 'document_verified', now());`,
);

await rejects(
  "a public profile with no published_at",
  `insert into public.public_profiles (slug, enrollment_id, visibility)
   values ('asha-r', '${ENROL_A}', 'public');`,
);
await allows(
  "a private profile by default",
  `insert into public.public_profiles (slug, enrollment_id)
   values ('asha-r', '${ENROL_A}');`,
);

// The reviewer-facing view must not expose who wrote the work.
const queueCols = await db.query(`
  select column_name from information_schema.columns
  where table_schema='public' and table_name='peer_review_queue'`);
const leaked = queueCols.rows
  .map((r) => r.column_name)
  .filter((c) => /enrollment|user_id|reviewer/.test(c));
record(
  leaked.length === 0,
  "peer_review_queue exposes no column identifying the author",
  leaked.join(", "),
);
console.log("\n── data isolation between students ─────────────────────────");
// Everything above runs as the owner, which bypasses RLS entirely. These
// assertions switch to the `authenticated` role so the policies actually
// apply — otherwise "RLS is enabled" is a fact about the catalog and not
// about who can read whose work.
{
  await db.exec(`
    grant usage on schema public to authenticated;
    grant select, insert, update on all tables in schema public to authenticated;
    insert into public.submissions (id, enrollment_id, assignment_id, week_no, payload)
      values ('88888888-8888-4888-8888-000000000002', '${ENROL_B}', '${ASSIGN_ID}', 1, '{"sql":"select 2"}'::jsonb);
  `);

  const asUser = async (uid, sql) => {
    await db.exec(`begin; set local role authenticated; set local jintu.uid = '${uid}';`);
    try {
      return await db.query(sql);
    } finally {
      await db.exec("rollback;");
    }
  };

  const mine = await asUser(USER_1, "select id from public.submissions");
  record(
    mine.rows.length === 1,
    "a student sees only their own submission",
    `saw ${mine.rows.length}, expected 1`,
  );

  const theirs = await asUser(
    USER_1,
    `select id from public.submissions where enrollment_id = '${ENROL_B}'`,
  );
  record(
    theirs.rows.length === 0,
    "a student cannot read another student's submission",
    `leaked ${theirs.rows.length} row(s)`,
  );

  const otherConsents = await asUser(USER_2, "select purpose from public.consents");
  record(
    otherConsents.rows.length === 0,
    "a student cannot read another student's consents",
    `leaked ${otherConsents.rows.length} row(s)`,
  );

  // The waitlist has an insert policy and deliberately no select policy: the
  // anon key is public, so a readable waitlist is a downloadable phone list.
  const waitlist = await asUser(USER_1, "select phone from public.waitlist_signups");
  record(
    waitlist.rows.length === 0,
    "the waitlist phone list is not readable by a signed-in user",
    `leaked ${waitlist.rows.length} row(s)`,
  );

  // Published curriculum is meant to be readable by everyone.
  const tracks = await asUser(USER_1, "select slug from public.tracks");
  record(tracks.rows.length > 0, "published curriculum is still readable while signed in");
}

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

// Cost ledgers, audit logs and crawler output are correctly unreachable from
// any client: RLS on with no policy denies everyone, and the service role
// bypasses RLS. The exemption is read from the table comment so it has to be
// declared in the schema, not inferred from a table that simply forgot one.
const noPolicy = await db.query(`
  select c.relname from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
    and not exists (select 1 from pg_policy p where p.polrelid = c.oid)
    and coalesce(obj_description(c.oid, 'pg_class'), '') not ilike '%service-role only%'
  order by c.relname`);
record(
  noPolicy.rows.length === 0,
  "every table with RLS has a policy, or is declared service-role only",
  noPolicy.rows.map((r) => r.relname).join(", "),
);

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f.label}${f.detail ? `: ${f.detail}` : ""}`);
  process.exit(1);
}
