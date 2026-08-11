/**
 * Proves the enrolment rules hold in the database.
 *
 *   node scripts/assert-enrolment.mjs
 *
 * Enrolment is where a person becomes a student, so every gate on it is one
 * that will eventually be pushed on:
 *
 *   - no session -> refused with the code that opens sign-in
 *   - session without a profile -> refused with the code that sends them to
 *     onboarding, because the profile is the 18+ confirmation (Law 3)
 *   - a closed cohort refuses; a full cohort refuses
 *   - enrolling twice is one row; withdrawing and returning restores it
 *   - the enrolled can read their own enrolment and nobody else's
 *   - open_cohort() tells the truth about seats without leaking enrollees
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");
const SEED = path.join(ROOT, "supabase", "seed.sql");

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
const codeOf = async (q, p = []) => {
  try {
    await db.query(q, p);
    return null;
  } catch (e) {
    return e.code ?? "unknown";
  }
};

// Two users: one fully onboarded (profile = 18+ confirmed), one who only
// verified an email and never finished.
const ADULT = "55555555-5555-4555-8555-0000000000aa";
const HALFWAY = "55555555-5555-4555-8555-0000000000bb";
await db.query("insert into auth.users (id) values ($1), ($2)", [ADULT, HALFWAY]);
await db.query(
  "insert into public.profiles (id, phone, is_adult_confirmed) values ($1, '+919000000111', true)",
  [ADULT],
);

// A two-seat cohort on the seeded track's published path.
const { rows: [path1] } = await db.query(
  "select id from public.paths where status = 'published' limit 1",
);
const { rows: [cohort] } = await db.query(
  `insert into public.cohorts (path_id, mode, starts_on, ends_on, capacity, status)
   values ($1, 'public', current_date + 7, current_date + 49, 2, 'open') returning id`,
  [path1.id],
);
const COHORT = cohort.id;

console.log("── who may enrol ───────────────────────────────────────────");
await db.exec("reset jintu.uid;");
check(
  (await codeOf("select public.enrol_me($1)", [COHORT])) === "28000",
  "no session is refused with 28000 — the code that opens sign-in",
);

await db.exec(`set jintu.uid = '${HALFWAY}';`);
check(
  (await codeOf("select public.enrol_me($1)", [COHORT])) === "P0002",
  "a session without a profile is refused with P0002 — onboarding, which is the 18+ gate",
);

console.log("\n── enrolling ───────────────────────────────────────────────");
await db.exec(`set jintu.uid = '${ADULT}';`);
const first = await one("select public.enrol_me($1) as id", [COHORT]);
check(Boolean(first.id), "an onboarded adult enrols");

const again = await one("select public.enrol_me($1) as id", [COHORT]);
check(again.id === first.id, "enrolling twice is the same enrolment, not an error");

const row = await one("select status from public.enrollments where id = $1", [first.id]);
check(row.status === "active", `and it is active (${row.status})`);

console.log("\n── the dashboard reads it ──────────────────────────────────");
// The exact shape getMySprint() and /tracks depend on, read as the user
// through RLS — not as the owner role.
await db.exec("grant usage on schema public to authenticated; grant select on all tables in schema public to authenticated;");
await db.exec(`begin; set local role authenticated; set local jintu.uid = '${ADULT}';`);
const mine = await one(
  "select count(*)::int n from public.enrollments where status = 'active'",
);
await db.exec("rollback;");
check(mine.n === 1, `the student sees their enrolment through RLS (${mine.n})`);

await db.exec(`begin; set local role authenticated; set local jintu.uid = '${HALFWAY}';`);
const theirs = await one("select count(*)::int n from public.enrollments");
await db.exec("rollback;");
check(theirs.n === 0, `and nobody else sees it (${theirs.n} visible to another user)`);

console.log("\n── seats ───────────────────────────────────────────────────");
const seats1 = await one("select seats_left from public.open_cohort('data-analyst-fresher')");
check(seats1.seats_left === 1, `open_cohort reports one seat left of two (${seats1.seats_left})`);

// Fill the last seat with a second adult, then a third must be refused.
const ADULT2 = "55555555-5555-4555-8555-0000000000cc";
await db.query("insert into auth.users (id) values ($1)", [ADULT2]);
await db.query(
  "insert into public.profiles (id, phone, is_adult_confirmed) values ($1, '+919000000222', true)",
  [ADULT2],
);
await db.exec(`set jintu.uid = '${ADULT2}';`);
await db.query("select public.enrol_me($1)", [COHORT]);

const ADULT3 = "55555555-5555-4555-8555-0000000000dd";
await db.query("insert into auth.users (id) values ($1)", [ADULT3]);
await db.query(
  "insert into public.profiles (id, phone, is_adult_confirmed) values ($1, '+919000000333', true)",
  [ADULT3],
);
await db.exec(`set jintu.uid = '${ADULT3}';`);
check(
  (await codeOf("select public.enrol_me($1)", [COHORT])) === "P0003",
  "the seat past capacity is refused with P0003",
);

const seats0 = await one("select seats_left from public.open_cohort('data-analyst-fresher')");
check(seats0.seats_left === 0, `and open_cohort reports zero left (${seats0.seats_left})`);

console.log("\n── withdrawing and coming back ─────────────────────────────");
await db.query("update public.enrollments set status = 'withdrawn' where id = $1", [first.id]);
const freed = await one("select seats_left from public.open_cohort('data-analyst-fresher')");
check(freed.seats_left === 1, `a withdrawal frees the seat (${freed.seats_left})`);

await db.exec(`set jintu.uid = '${ADULT}';`);
const back = await one("select public.enrol_me($1) as id", [COHORT]);
const restored = await one("select status from public.enrollments where id = $1", [first.id]);
check(back.id === first.id && restored.status === "active", "returning restores the same enrolment");

console.log("\n── closed doors stay closed ────────────────────────────────");
await db.query("update public.cohorts set status = 'running' where id = $1", [COHORT]);
await db.exec(`set jintu.uid = '${ADULT3}';`);
check(
  (await codeOf("select public.enrol_me($1)", [COHORT])) === "P0001",
  "a cohort that has started refuses new enrolments with P0001",
);
// The seed ships its own open cohort on this path, so the track still has one
// to offer — the assertion is that the CLOSED one is never it. The first
// version of this check expected an empty result and failed against the
// function behaving correctly, which is worth remembering: the guard tests the
// door, not the number of doors the fixture happens to contain.
const offered = await db.query("select cohort_id from public.open_cohort('data-analyst-fresher')");
check(
  offered.rows.every((r) => r.cohort_id !== COHORT),
  "and open_cohort never offers the closed one",
);

check(
  (await codeOf("select public.enrol_me($1)", ["99999999-9999-4999-8999-999999999999"])) === "P0002",
  "a cohort that does not exist is P0002, not a different sentence for probing ids",
);

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
