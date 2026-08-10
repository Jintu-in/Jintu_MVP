/**
 * Proves the catch-up bundle applies to a database in the state production is
 * actually in.
 *
 *   node scripts/assert-catch-up.mjs
 *
 * A bundle that applies to an empty database proves very little. The failure
 * this guards against is the one that happens on a project halfway through:
 * a migration that assumes a clean slate meets rows that already exist, one
 * statement aborts, and because the SQL editor runs the whole paste as a
 * transaction, everything after it silently does not happen.
 *
 * So this builds the live shape first — the migrations already applied, plus
 * the nineteen published tracks that are really there — and only then applies
 * the bundle. Then it asks whether the two things that were broken now work.
 *
 * LIVE_THROUGH is the last migration confirmed applied on the project, checked
 * by probing the REST API for tables. Move it when that changes.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");

const LIVE_THROUGH = "20260809050000";
const BROWSER = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

let passed = 0;
const failures = [];
const check = (ok, label, detail) => {
  if (ok) {
    passed++;
    console.log(`  ok    ${label}`);
  } else {
    failures.push(label);
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
};

const stamp = (f) => f.split("_")[0];
const all = readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort();
const applied = all.filter((f) => stamp(f) <= LIVE_THROUGH);
const pending = all.filter((f) => stamp(f) > LIVE_THROUGH);

const db = await PGlite.create();
await db.exec(SHIM);

console.log("── rebuild the live shape ──────────────────────────────────");
for (const f of applied) await db.exec(readFileSync(path.join(MIGRATIONS, f), "utf8"));
check(applied.length === 6, `${applied.length} migrations already on the project`);

// Nineteen published tracks, which is what is really there. The count matters:
// the tier backfill and the draft/published constraint both run over these
// rows, and a migration that works on an empty table can still fail on data.
for (let i = 1; i <= 19; i++) {
  await db.query(
    "insert into public.tracks (slug, title, summary, is_published) values ($1, $2, $3, true)",
    [`track-${i}-fresher`, `Track ${i}`, "A summary."],
  );
}
const before = await db.query("select count(*)::int n from public.tracks where is_published");
check(before.rows[0].n === 19, `${before.rows[0].n} published tracks, as in production`);

console.log("\n── apply the catch-up bundle ───────────────────────────────");
execFileSync(
  process.execPath,
  [path.join(ROOT, "scripts", "bundle-migrations.mjs"), "--since", LIVE_THROUGH],
  { encoding: "utf8" },
);
const bundle = readFileSync(
  path.join(ROOT, "supabase", ".bundle", `catch-up-since-${LIVE_THROUGH}.sql`),
  "utf8",
);
check(
  !applied.some((f) => bundle.includes(f)),
  "the bundle contains none of the already-applied migrations",
);
check(
  pending.every((f) => bundle.includes(f)),
  `and all ${pending.length} of the pending ones`,
);

let applyError = null;
try {
  await db.exec(bundle);
} catch (e) {
  applyError = e.message;
}
check(!applyError, "it applies cleanly to a database in the live state", applyError);

if (applyError) {
  await db.close();
  console.log(`\n${passed} passed, ${failures.length} failed`);
  process.exit(1);
}

console.log("\n── the two things that were broken ─────────────────────────");

// Filing needs a session as of 20260810040000. Asserted here rather than
// assumed, because this suite is the one that answers "will the paste fix the
// box?" — and after that migration the honest answer is "for somebody signed
// in". Without this the guard called it as anon and failed on 28000, which is
// the function working.
let anonCode = null;
try {
  await db.query("select public.request_course($1, $2)", ["A request from nobody at all", BROWSER]);
} catch (e) {
  anonCode = e.code ?? null;
}
check(anonCode === "28000", `filing without a session is refused with 28000 (${anonCode})`);

const USER = "55555555-5555-4555-8555-0000000000aa";
await db.query("insert into auth.users (id) values ($1) on conflict (id) do nothing", [USER]);
await db.query(`set jintu.uid = '${USER}'`);

const filed = await db.query("select public.request_course($1, $2) as id", [
  "Backend engineer at a product company, I know Python",
  BROWSER,
]);
check(Boolean(filed.rows[0]?.id), "and a signed-in person can file one");

const mine = await db.query("select * from public.my_course_requests($1)", [BROWSER]);
check(mine.rows.length === 1, `and read it back with a status (${mine.rows[0]?.status})`);

const shared = await db.query("select * from public.shared_course_request($1)", [
  filed.rows[0].id,
]);
check(shared.rows.length === 1, "and the shared link resolves");

await db.query("reset jintu.uid");

const proposals = await db.query("select * from public.proposed_courses()");
check(Array.isArray(proposals.rows), "proposed_courses() answers instead of 404ing");

console.log("\n── existing data survived ──────────────────────────────────");
const after = await db.query(
  "select count(*)::int n, count(*) filter (where tier = 'sprint')::int sprints from public.tracks where is_published",
);
check(after.rows[0].n === 19, `still 19 published tracks (${after.rows[0].n})`);
check(
  after.rows[0].sprints === 19,
  `each backfilled to tier 'sprint' rather than defaulting to draft (${after.rows[0].sprints})`,
);

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
