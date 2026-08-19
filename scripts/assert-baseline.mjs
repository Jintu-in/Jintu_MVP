/**
 * Proves the fresh baseline is what the pivot says it is.
 *
 *   node scripts/assert-baseline.mjs
 *
 * The repo used to implement a verification platform; the baseline replaces
 * it with an aggregator/roadmap schema. This guard asserts the properties
 * that define the new product and the ones that must not regress:
 *
 *   - applies cleanly from scratch, seed included
 *   - RLS is enabled on EVERY public table, no exceptions
 *   - a published roadmap is readable with no account; a draft never is
 *   - progress, saves, points, streaks and cards are private per user
 *   - clients cannot mint points or fake streaks (no write policies)
 *   - ONE points ledger — no ledger/verification/archetype columns anywhere
 *   - no third-party content columns (transcript/full_text) anywhere
 *   - the 18+ gate and granular consents survived the pivot intact
 *
 * PGlite does not enforce role grants the way live Postgres does unless the
 * role is actually assumed; we `set local role` inside transactions exactly
 * as the previous guards did.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
const failures = [];
const check = (ok, label, detail) => {
  if (ok) { passed++; console.log(`  ok    ${label}`); }
  else { failures.push(label); console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`); }
};

const db = await PGlite.create();
await db.exec(SHIM);

console.log("── applies cleanly from scratch ────────────────────────────");
for (const f of readdirSync(path.join(ROOT, "supabase", "migrations")).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(path.join(ROOT, "supabase", "migrations", f), "utf8"));
}
await db.exec(readFileSync(path.join(ROOT, "supabase", "seed.sql"), "utf8"));
check(true, "migrations + seed applied");

const rows = async (q, p = []) => (await db.query(q, p)).rows;
const one = async (q, p = []) => (await rows(q, p))[0];

// Every table the pivot specifies, nothing the old product left behind.
const expected = [
  "activity_days", "audit_log", "auth_attempts", "colleges", "consents",
  "link_checks", "modules", "nodes", "node_checks", "node_progress",
  "node_topics", "notifications", "point_events", "profiles",
  "review_cards", "roadmap_enrollments", "roadmaps", "resources",
  "public_profiles", "reminder_prefs", "saved_resources", "streaks",
].sort();
const actual = (await rows(
  `select relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r' order by relname`,
)).map((r) => r.relname);
check(
  JSON.stringify(actual) === JSON.stringify(expected),
  `exactly the twenty-two baseline tables exist`,
  `got: ${actual.join(", ")}`,
);

const noRls = (await rows(
  `select relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity`,
)).map((r) => r.relname);
check(noRls.length === 0, "RLS is enabled on every table", noRls.join(", "));

console.log("\n── nothing of the old product survived ─────────────────────");
const oldTables = (await rows(
  `select table_name from information_schema.tables where table_schema = 'public'
   and table_name in ('tracks','paths','assignments','rubrics','submissions','gradings',
     'peer_reviews','answer_keys','assignment_answer_keys','assignment_defect_keys',
     'daily_reps','ai_usage','budget_guards','readiness_scores','topic_votes',
     'course_proposals','enrollments','cohorts','waitlist','orders')`,
)).map((r) => r.table_name);
check(oldTables.length === 0, "no verification-product table exists", oldTables.join(", "));

const badCols = (await rows(
  `select table_name || '.' || column_name as c from information_schema.columns
   where table_schema = 'public' and column_name in
     ('ledger','verification','archetype','evidenced_score','transcript','full_text')`,
)).map((r) => r.c);
check(badCols.length === 0, "one ledger, no verification columns, no content columns", badCols.join(", "));

console.log("\n── the catalogue is public; drafts are not ─────────────────");
// seed ships one DRAFT roadmap; publish a second one to test both sides.
const pub = await one(`
  insert into public.roadmaps (slug, title, summary, difficulty, status)
  values ('spring-boot', 'Spring Boot', 'From servlet to production service.', 'intermediate', 'published')
  returning id`);
const mod = await one(
  `insert into public.modules (roadmap_id, position, title) values ($1, 1, 'HTTP and the container') returning id`,
  [pub.id],
);
const node = await one(
  `insert into public.nodes (module_id, position, title, est_minutes) values ($1, 1, 'What a servlet is', 25) returning id`,
  [mod.id],
);
await db.exec(
  `insert into public.resources (node_id, position, type, title, url, source_name)
   values ('${node.id}', 1, 'read', 'Official servlet overview', 'https://example.org/servlets', 'Spring docs')`,
);

const asAnon = async (sql) => {
  await db.exec("begin; set local role anon;");
  try { return await rows(sql); } finally { await db.exec("commit;"); }
};
const anonSees = await asAnon("select slug from public.roadmaps order by slug");
check(
  anonSees.length === 1 && anonSees[0].slug === "spring-boot",
  "anon reads the published roadmap and cannot see the draft",
  JSON.stringify(anonSees),
);
const anonNodes = await asAnon("select title from public.nodes");
check(anonNodes.length === 1, "anon reads nodes of published roadmaps only", JSON.stringify(anonNodes));
const anonResources = await asAnon("select url from public.resources");
check(anonResources.length === 1, "anon reads resources of published roadmaps only");

console.log("\n── progress is private per user ────────────────────────────");
const [ua, ub] = (await rows(
  `insert into auth.users (id) values (gen_random_uuid()), (gen_random_uuid()) returning id`,
)).map((r) => r.id);
for (const u of [ua, ub]) {
  await db.exec(
    `insert into public.profiles (id, phone, is_adult_confirmed) values ('${u}', '+91${u.slice(0, 8)}', true)`,
  );
}
const as = async (uid, sql) => {
  await db.exec(`begin; set local role authenticated; set local jintu.uid = '${uid}';`);
  try { return await rows(sql); } finally { await db.exec("commit;"); }
};
const asFails = async (uid, sql) => {
  await db.exec(`begin; set local role authenticated; set local jintu.uid = '${uid}';`);
  try { await rows(sql); return false; }
  catch { return true; }
  finally { await db.exec("rollback;"); }
};

await as(ua, `insert into public.node_progress (user_id, node_id, status, completed_at)
              values ('${ua}', '${node.id}', 'done', now()) returning node_id`);
check(
  (await as(ub, "select * from public.node_progress")).length === 0,
  "one user's progress is invisible to another",
);
check(
  await asFails(ub, `insert into public.node_progress (user_id, node_id) values ('${ua}', '${node.id}')`),
  "nobody can write progress as someone else",
);

await as(ua, `insert into public.saved_resources (user_id, resource_id)
              select '${ua}', id from public.resources returning resource_id`);
check(
  (await as(ua, "delete from public.saved_resources returning resource_id")).length === 1 &&
  (await as(ub, "delete from public.saved_resources returning resource_id")).length === 0,
  "saves are unsaveable by their owner only",
);

console.log("\n── clients cannot mint momentum ────────────────────────────");
check(
  await asFails(ua, `insert into public.point_events (user_id, source_type, source_id, points)
                     values ('${ua}', 'node', '${node.id}', 10)`),
  "a client cannot insert point_events",
);
check(
  await asFails(ua, `insert into public.streaks (user_id, current_days) values ('${ua}', 400)`),
  "a client cannot write streaks",
);
// ub, not ua: ua's tick above already earned through the award trigger
// (0008), so the owner-level seed insert here must use a user with no
// award yet — the point is the uniqueness rule, not the trigger.
await db.exec(`insert into public.point_events (user_id, source_type, source_id, points)
               values ('${ub}', 'node', '${node.id}', 10)`);
let doubled = false;
try {
  await db.exec(`insert into public.point_events (user_id, source_type, source_id, points)
                 values ('${ub}', 'node', '${node.id}', 10)`);
  doubled = true;
} catch { /* point_events_once_ever */ }
check(!doubled, "finishing the same node twice earns once");

console.log("\n── review cards are the user's own words, own rows ─────────");
await as(ua, `insert into public.review_cards (user_id, node_id, front, back)
              values ('${ua}', '${node.id}', 'What is a servlet?', 'A Java class handling HTTP inside a container.')
              returning id`);
check(
  (await as(ub, "select * from public.review_cards")).length === 0,
  "cards are invisible across users",
);

console.log("\n── the auth v3 surface stays server-side ───────────────────");
// The enumeration tradeoff is contained by grants: only the service role may
// ask whether an email exists. PGlite enforces EXECUTE for assumed roles the
// same way live Postgres does.
const probeAs = async (role, uid) => {
  await db.exec(`begin; set local role ${role};${uid ? ` set local jintu.uid = '${uid}';` : ""}`);
  try { await rows(`select public.email_registered('probe@example.org')`); return "allowed"; }
  catch { return "denied"; }
  finally { await db.exec("rollback;"); }
};
check((await probeAs("anon")) === "denied", "anon cannot call email_registered");
check((await probeAs("authenticated", ua)) === "denied", "authenticated cannot call email_registered");
check(
  (await one(`select public.email_registered('probe@example.org') ok`)).ok === false &&
  (await (async () => {
    await db.exec(`insert into auth.users (id, email) values (gen_random_uuid(), 'probe@example.org')`);
    return (await one(`select public.email_registered('PROBE@Example.Org') ok`)).ok;
  })()) === true,
  "email_registered answers case-insensitively for the service role",
);

console.log("\n── the compliance posture survived the pivot ───────────────");
let minor = false;
try {
  const u = (await rows(`insert into auth.users (id) values (gen_random_uuid()) returning id`))[0].id;
  await db.exec(`insert into public.profiles (id, phone, is_adult_confirmed) values ('${u}', '+919999', false)`);
  minor = true;
} catch { /* profiles_must_be_adult */ }
check(!minor, "a profile cannot exist without an affirmative 18+ confirmation");

await as(ua, `insert into public.consents (user_id, purpose, notice_version) values ('${ua}', 'analytics', 'v1') returning id`);
let doubleConsent = false;
try {
  await as(ua, `insert into public.consents (user_id, purpose, notice_version) values ('${ua}', 'analytics', 'v1') returning id`);
  doubleConsent = true;
} catch { /* one active per purpose */ }
check(!doubleConsent, "at most one live consent per purpose");
let bundled = false;
try {
  await as(ua, `insert into public.consents (user_id, purpose, notice_version) values ('${ua}', 'everything', 'v1') returning id`);
  bundled = true;
} catch { /* purpose CHECK */ }
check(!bundled, "consent purposes are a closed list — no bundled catch-all");

console.log("\n── service-side tables are unreachable from clients ────────");
// With no grant at all, the select is DENIED outright — stronger than an
// empty result, and exactly what "service-role only" should mean.
const deniedOrEmpty = async (role, uid, sql) => {
  await db.exec(`begin; set local role ${role};${uid ? ` set local jintu.uid = '${uid}';` : ""}`);
  try { return (await rows(sql)).length === 0; }
  catch { return true; }
  finally { await db.exec("rollback;"); }
};
for (const t of ["notifications", "link_checks", "audit_log", "auth_attempts"]) {
  check(
    (await deniedOrEmpty("authenticated", ua, `select * from public.${t}`)) &&
    (await deniedOrEmpty("anon", null, `select * from public.${t}`)),
    `${t} is invisible to every client`,
  );
}

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
