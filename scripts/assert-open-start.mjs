/**
 * Proves V3's "Start this track" holds its rules in the database.
 *
 *   node scripts/assert-open-start.mjs
 *
 * The open platform starts a track by enrolling into a rolling intake — a
 * cohort row demoted to an implementation detail. What must hold:
 *
 *   - the same gates as enrolment: 28000 without a session, P0002 without
 *     the 18+ profile
 *   - drafts and unknown slugs are the same refusal — nothing to start
 *   - one intake per live path, however many people start it
 *   - starting twice is one enrolment; the seeded seat-limited cohort is
 *     never touched by any of it
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");

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
await db.exec(readFileSync(path.join(ROOT, "supabase", "seed.sql"), "utf8"));

const one = async (q, p = []) => (await db.query(q, p)).rows[0];
const codeOf = async (q, p = []) => {
  try {
    await db.query(q, p);
    return null;
  } catch (e) {
    return e.code ?? "unknown";
  }
};

const A = "77777777-7777-4777-8777-0000000000aa";
const B = "77777777-7777-4777-8777-0000000000bb";
const HALF = "77777777-7777-4777-8777-0000000000cc";
await db.query("insert into auth.users (id) values ($1), ($2), ($3)", [A, B, HALF]);
await db.query(
  "insert into public.profiles (id, phone, is_adult_confirmed) values ($1, '+919000000331', true), ($2, '+919000000332', true)",
  [A, B],
);

const SLUG = "data-analyst-fresher";
const intakes = () =>
  one("select count(*)::int n from public.cohorts where is_intake", []).then((r) => r.n);
const seatCohortEnrolments = async () =>
  (
    await one(
      "select count(*)::int n from public.enrollments e join public.cohorts c on c.id = e.cohort_id where not c.is_intake",
    )
  ).n;

// The seed ships its own demo enrolment on the seat-limited cohort; what
// start_track must never do is add to that number.
const seatBaseline = await seatCohortEnrolments();

console.log("── the gates travel with it ────────────────────────────────");
await db.exec("reset jintu.uid;");
check((await codeOf("select public.start_track($1)", [SLUG])) === "28000", "no session is told to sign in (28000)");

await db.exec(`set jintu.uid = '${HALF}';`);
check((await codeOf("select public.start_track($1)", [SLUG])) === "P0002", "no profile is sent to onboarding (P0002)");

check((await codeOf("select public.start_track('a-course-nobody-wrote')")) === "P0001", "an unknown slug has nothing to start");

console.log("\n── starting ────────────────────────────────────────────────");
await db.exec(`set jintu.uid = '${A}';`);
const first = await one("select public.start_track($1) as id", [SLUG]);
check(Boolean(first.id), "an onboarded person starts the track");
check((await intakes()) === 1, "which lazily created exactly one intake");

const again = await one("select public.start_track($1) as id", [SLUG]);
check(again.id === first.id, "starting twice is the same enrolment");

await db.exec(`set jintu.uid = '${B}';`);
const second = await one("select public.start_track($1) as id", [SLUG]);
check(Boolean(second.id) && second.id !== first.id, "a second person gets their own enrolment");
check((await intakes()) === 1, "on the same shared intake — still exactly one");

const mine = await one(
  "select count(*)::int n from public.enrollments e join public.cohorts c on c.id = e.cohort_id where c.is_intake",
);
check(mine.n === 2, `both enrolments live on the intake (${mine.n})`);
check(
  (await seatCohortEnrolments()) === seatBaseline,
  "and the seat-limited cohorts gained nothing from any of it",
);

console.log("\n── what cannot be started ──────────────────────────────────");
// A draft-tier track: published drafts are forbidden by CHECK, so this is an
// unpublished one — the same refusal either way.
await db.query(
  "insert into public.tracks (slug, title, summary, tier, is_published) values ('someday-maybe', 'Someday', 'An outline nobody wrote yet, waiting on votes.', 'draft', false)",
);
await db.exec(`set jintu.uid = '${A}';`);
check((await codeOf("select public.start_track('someday-maybe')")) === "P0001", "a draft cannot be started — nothing to submit to");

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
