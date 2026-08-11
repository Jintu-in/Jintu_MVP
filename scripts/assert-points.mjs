/**
 * Proves the points system's rules hold in the database.
 *
 *   node scripts/assert-points.mjs
 *
 * TRACK_MODEL Part 6 names four anti-gaming rules and one wall. All five are
 * asserted here against real Postgres, because every one of them is a rule a
 * bored student with a keyboard will eventually push on:
 *
 *   1. at most 30 consistency points per calendar day
 *   2. reps are day-stamped, never backfillable
 *   3. points can be voided retroactively, and the row survives as evidence
 *   4. proof points wait until your peer reviews are done
 *   —  and the wall: proof_totals never contains a consistency point
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

// A student, enrolled in the seed cohort; and a bystander.
const STUDENT = "55555555-5555-4555-8555-0000000000aa";
const OTHER = "55555555-5555-4555-8555-0000000000bb";
await db.query("insert into auth.users (id) values ($1), ($2)", [STUDENT, OTHER]);
await db.query(
  `insert into public.profiles (id, phone, is_adult_confirmed)
   values ($1, '+919000000111', true), ($2, '+919000000222', true)`,
  [STUDENT, OTHER],
);
const { rows: [cohort] } = await db.query(
  "select id from public.cohorts where status = 'open' limit 1",
);
const { rows: [enrolment] } = await db.query(
  "insert into public.enrollments (cohort_id, user_id) values ($1, $2) returning id",
  [cohort.id, STUDENT],
);

// Four reps on week 1 of the seeded (published v1) path. The freeze trigger
// refuses inserts under a published path — correct for content, but these are
// fixture rows, so they go in with the trigger disabled the way ops would.
const { rows: [week1] } = await db.query(
  `select m.id from public.modules m
   join public.paths p on p.id = m.path_id
   where p.status = 'published' and m.week_no = 1 limit 1`,
);
await db.exec("alter table public.daily_reps disable trigger daily_reps_frozen_when_published;");
const repIds = [];
for (const [day, points] of [[1, 10], [2, 10], [3, 10], [4, 25]]) {
  const { rows: [r] } = await db.query(
    `insert into public.daily_reps (module_id, day_no, prompt, verification, checks, points)
     values ($1, $2, $3, 'structural', array['non_empty'], $4)
     returning id`,
    [week1.id, day, `Do the thing for day ${day}`, points],
  );
  repIds.push(r.id);
}
await db.exec("alter table public.daily_reps enable trigger daily_reps_frozen_when_published;");

console.log("── rep checks are validated ────────────────────────────────");
let badCheck = false;
try {
  await db.exec("alter table public.daily_reps disable trigger daily_reps_frozen_when_published;");
  await db.query(
    `insert into public.daily_reps (module_id, day_no, prompt, verification, checks)
     values ($1, 7, 'x', 'structural', array['tarot_reading'])`,
    [week1.id],
  );
} catch {
  badCheck = true;
} finally {
  await db.exec("alter table public.daily_reps enable trigger daily_reps_frozen_when_published;");
}
check(badCheck, "a rep naming a checker that does not exist is refused");

console.log("\n── who can log a rep ───────────────────────────────────────");
await db.exec("reset jintu.uid;");
let code = null;
try {
  await db.query("select public.submit_rep($1)", [repIds[0]]);
} catch (e) {
  code = e.code;
}
check(code === "28000", `no session is 28000 (${code})`);

await db.exec(`set jintu.uid = '${OTHER}';`);
code = null;
try {
  await db.query("select public.submit_rep($1)", [repIds[0]]);
} catch (e) {
  code = e.code;
}
check(code === "P0001", `enrolled-elsewhere is P0001 — reading is free, the loop is the cohort's (${code})`);

console.log("\n── logging, the cap, and the day stamp ─────────────────────");
await db.exec(`set jintu.uid = '${STUDENT}';`);
const first = (await one("select public.submit_rep($1) as r", [repIds[0]])).r;
check(first.points_awarded === 10 && first.streak_days === 1, `first rep: 10 points, streak 1 (${first.points_awarded}, ${first.streak_days})`);

const again = (await one("select public.submit_rep($1) as r", [repIds[0]])).r;
check(again.already_logged === true && again.points_awarded === 0, "logging the same rep twice is one rep, said politely");

await one("select public.submit_rep($1) as r", [repIds[1]]);
await one("select public.submit_rep($1) as r", [repIds[2]]);
const fourth = (await one("select public.submit_rep($1) as r", [repIds[3]])).r;
check(
  fourth.points_awarded === 0 && fourth.capped === true,
  `rule 1: the 25-point rep after 30 points today awards 0, capped (${fourth.points_awarded})`,
);

const sub = await one(
  "select submitted_on = current_date as today from public.rep_submissions limit 1",
);
check(sub.today === true, "rule 2: submissions are stamped today — the function accepts no date at all");

console.log("\n── streaks ─────────────────────────────────────────────────");
// Yesterday's activity, then a rep today: the streak continues. The fixture
// rewrites last_active_date because the test cannot wait a day.
await db.query(
  "update public.streaks set last_active_date = current_date - 1, current_days = 5, longest_days = 5 where user_id = $1",
  [STUDENT],
);
await db.query("delete from public.rep_submissions where daily_rep_id = $1", [repIds[3]]);
const cont = (await one("select public.submit_rep($1) as r", [repIds[3]])).r;
check(cont.streak_days === 6, `a consecutive day extends the streak (${cont.streak_days})`);

await db.query(
  "update public.streaks set last_active_date = current_date - 2, current_days = 8, longest_days = 8, freezes_remaining = 2 where user_id = $1",
  [STUDENT],
);
await db.query("delete from public.rep_submissions where daily_rep_id = $1", [repIds[2]]);
const froze = (await one("select public.submit_rep($1) as r", [repIds[2]])).r;
check(
  froze.streak_days === 9 && froze.freezes_remaining === 1,
  `one missed day consumes a freeze and the streak lives (${froze.streak_days}, ${froze.freezes_remaining} left)`,
);

await db.query(
  "update public.streaks set last_active_date = current_date - 5, current_days = 9 where user_id = $1",
  [STUDENT],
);
await db.query("delete from public.rep_submissions where daily_rep_id = $1", [repIds[1]]);
const reset = (await one("select public.submit_rep($1) as r", [repIds[1]])).r;
check(reset.streak_days === 1, `a longer gap resets to 1 (${reset.streak_days})`);
const longest = await one("select longest_days from public.streaks where user_id = $1", [STUDENT]);
check(longest.longest_days === 9, `longest never goes down (${longest.longest_days})`);

console.log("\n── the wall between the ledgers ────────────────────────────");
const wall = await db.query("select * from public.proof_totals");
check(
  wall.rows.length === 0,
  `a day of consistency points appears nowhere in proof_totals (${wall.rows.length} rows)`,
);

console.log("\n── proof waits for peer reviews (rule 4) ───────────────────");
// A graded artifact for the student, plus one pending review THEY owe.
const { rows: [assignment] } = await db.query(
  `select a.id from public.assignments a
   join public.modules m on m.id = a.module_id
   join public.paths p on p.id = m.path_id
   where p.status = 'published' limit 1`,
);
const { rows: [submission] } = await db.query(
  `insert into public.submissions (enrollment_id, assignment_id, week_no, payload, status)
   values ($1, $2, 1, '{"sql":"select 1"}', 'graded') returning id`,
  [enrolment.id, assignment.id],
);
await db.query(
  "insert into public.gradings (submission_id, grader_type, scores, total) values ($1, 'deterministic', '{}', 5)",
  [submission.id],
);

// Somebody else's submission for the student to owe a review on.
const { rows: [otherEnrol] } = await db.query(
  "insert into public.enrollments (cohort_id, user_id) values ($1, $2) returning id",
  [cohort.id, OTHER],
);
const { rows: [otherSub] } = await db.query(
  `insert into public.submissions (enrollment_id, assignment_id, week_no, payload, status)
   values ($1, $2, 1, '{"sql":"select 2"}', 'submitted') returning id`,
  [otherEnrol.id, assignment.id],
);
const { rows: [review] } = await db.query(
  `insert into public.peer_reviews (submission_id, reviewer_enrollment_id, status, due_at)
   values ($1, $2, 'pending', now() + interval '2 days') returning id`,
  [otherSub.id, enrolment.id],
);

const locked = (await one("select public.award_artifact_points($1) as r", [submission.id])).r;
check(
  locked.awarded === 0 && locked.reason === "peer reviews pending",
  `points stay locked while a review is owed (${locked.reason})`,
);

await db.query(
  `update public.peer_reviews set status = 'submitted', scores = '{"overall": 4}' where id = $1`,
  [review.id],
);
const paid = (await one("select public.award_artifact_points($1) as r", [submission.id])).r;
check(paid.awarded === 5, `reviews done, the grade pays out (${paid.awarded})`);

const rerun = (await one("select public.award_artifact_points($1) as r", [submission.id])).r;
check(rerun.awarded === 5, "re-running awards nothing twice — the unique constraint absorbs the retry");
const proofCount = await one(
  "select count(*)::int n from public.point_events where ledger = 'proof'",
);
check(proofCount.n === 1, `exactly one proof event exists (${proofCount.n})`);

const totals = await one("select proof_points from public.proof_totals where user_id = $1", [STUDENT]);
check(totals.proof_points === 5, `proof_totals reads 5 — and only the proof ledger (${totals.proof_points})`);

console.log("\n── voiding (rule 3) ────────────────────────────────────────");
const { rows: [event] } = await db.query(
  "select id from public.point_events where ledger = 'proof' limit 1",
);
const voided = await one("select public.void_point_event($1) as ok", [event.id]);
check(voided.ok === true, "ops can void a point event");

const afterVoid = await db.query("select * from public.proof_totals where user_id = $1", [STUDENT]);
check(afterVoid.rows.length === 0, "the voided points leave every total");
const survives = await one("select voided_at is not null as v from public.point_events where id = $1", [event.id]);
check(survives.v === true, "but the row survives as the record that it happened");

console.log("\n── who sees what ───────────────────────────────────────────");
await db.exec("grant usage on schema public to authenticated; grant select on all tables in schema public to authenticated;");
await db.exec(`begin; set local role authenticated; set local jintu.uid = '${OTHER}';`);
const theirs = await one("select count(*)::int n from public.point_events");
await db.exec("rollback;");
check(theirs.n === 0, `another student sees none of these points (${theirs.n})`);

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
