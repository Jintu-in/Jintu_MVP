/**
 * Proves the course-proposal rules hold in the database, not just in the UI.
 *
 *   node scripts/assert-course-proposals.mjs
 *
 * Every rule worth having here is a rule the client must not be able to talk
 * its way around, so each one is checked against real Postgres rather than
 * read off the migration:
 *
 *   - one vote per browser per course, enforced by a constraint
 *   - you cannot vote for a real course, only for a proposal
 *   - a track cannot be published and proposed at once
 *   - anon cannot read the votes table, only the aggregate
 *
 * The last one matters most. voter_key is anonymous but it is still a stable
 * per-browser id, and a readable votes table would let anyone correlate which
 * courses a single browser asked for.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");
const SEED = path.join(ROOT, "supabase", "seed.sql");

const KEY_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const KEY_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

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

const db = await PGlite.create();
await db.exec(SHIM);
for (const f of readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(path.join(MIGRATIONS, f), "utf8"));
}
await db.exec(readFileSync(SEED, "utf8"));

const one = async (q, p = []) => (await db.query(q, p)).rows[0];

// The seed publishes data-analyst-fresher. Add a proposal beside it so both
// states exist.
await db.exec(`
  insert into public.tracks (slug, title, summary, is_published, is_proposed)
  values ('android-kotlin-fresher', 'Android — first job', 'Ship one app.', false, true)
  on conflict (slug) do update set is_published = false, is_proposed = true;
`);

console.log("── the two states are exclusive ────────────────────────────");
let rejected = false;
try {
  await db.exec(`update public.tracks set is_published = true where slug = 'android-kotlin-fresher';`);
} catch {
  rejected = true;
}
check(rejected, "a track cannot be published and proposed at once");

console.log("\n── what anon can see ───────────────────────────────────────");
await db.exec(`
  grant usage on schema public to anon;
  grant select on all tables in schema public to anon;
`);

const proposals = await db.query(`select * from public.proposed_courses()`);
check(proposals.rows.length === 1, `proposed_courses() returns the proposal (${proposals.rows.length})`);
check(
  proposals.rows[0]?.slug === "android-kotlin-fresher",
  "and not the published course, which is not a proposal",
);
check(Number(proposals.rows[0]?.votes) === 0, "a proposal with no votes reports 0, not null");

// RLS is only enforced for non-owner roles, so the read has to be attempted
// as anon to mean anything.
await db.exec("begin; set local role anon;");
const votesVisible = await one(`select count(*)::int n from public.track_votes`);
await db.exec("rollback;");
check(votesVisible.n === 0, "anon reads no vote rows (RLS, no select policy)");

console.log("\n── voting ──────────────────────────────────────────────────");
const first = await one(`select public.cast_course_vote('android-kotlin-fresher', $1) as votes`, [KEY_A]);
check(Number(first.votes) === 1, `first vote counts (${first.votes})`);

const repeat = await one(`select public.cast_course_vote('android-kotlin-fresher', $1) as votes`, [KEY_A]);
check(Number(repeat.votes) === 1, `the same browser voting twice still counts once (${repeat.votes})`);

const second = await one(`select public.cast_course_vote('android-kotlin-fresher', $1) as votes`, [KEY_B]);
check(Number(second.votes) === 2, `a different browser adds a vote (${second.votes})`);

let refusedRealCourse = false;
try {
  await db.query(`select public.cast_course_vote('data-analyst-fresher', $1)`, [KEY_A]);
} catch {
  refusedRealCourse = true;
}
check(refusedRealCourse, "voting for a real published course is refused");

let refusedUnknown = false;
try {
  await db.query(`select public.cast_course_vote('no-such-course', $1)`, [KEY_A]);
} catch {
  refusedUnknown = true;
}
check(refusedUnknown, "voting for a slug that does not exist is refused");

const ranked = await db.query(`select slug, votes from public.proposed_courses()`);
check(Number(ranked.rows[0]?.votes) === 2, `the count is reflected in the listing (${ranked.rows[0]?.votes})`);

console.log("\n── demoting a course hides its curriculum ──────────────────");
// The point of is_published rather than deleting rows: modules survive, they
// just stop being reachable, so republishing is one update away.
await db.exec(`
  update public.tracks set is_published = false, is_proposed = true
  where slug = 'data-analyst-fresher';
`);
const orphaned = await one(`
  select (select count(*)::int from public.modules m
          join public.paths p on p.id = m.path_id
          join public.tracks t on t.id = p.track_id
          where t.slug = 'data-analyst-fresher') kept`);
check(orphaned.kept > 0, `the curriculum rows are kept, not deleted (${orphaned.kept} modules)`);

await db.exec("begin; set local role anon;");
const visiblePaths = await one(`
  select count(*)::int n from public.paths p
  join public.tracks t on t.id = p.track_id
  where t.slug = 'data-analyst-fresher'`);
await db.exec("rollback;");
check(visiblePaths.n === 0, `but anon can no longer reach them (${visiblePaths.n} visible)`);

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
