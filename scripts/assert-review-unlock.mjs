/**
 * Proves review-to-unlock holds its rules in the database.
 *
 *   node scripts/assert-review-unlock.mjs
 *
 * The V3 mechanism: reviewers claim work instead of being handed it, and an
 * author who owes reviews does not get reviewed. Every rule here is one a
 * learner gaming for points will push on:
 *
 *   - the gates travel (28000 sign-in, P0002 onboarding)
 *   - first submission is free; the second waits until the author has fed
 *     the queue
 *   - nobody claims their own work, nothing twice, oldest first
 *   - two accounts trading reviews surface for ops, and clients cannot read
 *     the surface
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
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
for (const f of readdirSync(path.join(ROOT, "supabase", "migrations")).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(path.join(ROOT, "supabase", "migrations", f), "utf8"));
}
await db.exec(readFileSync(path.join(ROOT, "supabase", "seed.sql"), "utf8"));
// The seed publishes v1 only (two assignments). The fixture burns one
// assignment per submission, so apply the full v2 curriculum too.
await db.exec(execFileSync(process.execPath, [path.join(ROOT, "scripts", "generate-data-analyst-v2.mjs")], { encoding: "utf8", maxBuffer: 33554432 }));

const one = async (q, p = []) => (await db.query(q, p)).rows[0];
const codeOf = async (q, p = []) => {
  try { await db.query(q, p); return null; } catch (e) { return e.code ?? "unknown"; }
};

// Three learners on the seeded track's open cohort, via the same fixtures
// the enrolment guard uses.
const A = "88888888-8888-4888-8888-0000000000aa"; // the author under test
const B = "88888888-8888-4888-8888-0000000000bb"; // a reviewer
const C = "88888888-8888-4888-8888-0000000000cc"; // a second reviewer
const HALF = "88888888-8888-4888-8888-0000000000dd";
await db.query("insert into auth.users (id) values ($1), ($2), ($3), ($4)", [A, B, C, HALF]);
await db.query(
  `insert into public.profiles (id, phone, is_adult_confirmed) values
   ($1, '+919000000441', true), ($2, '+919000000442', true), ($3, '+919000000443', true)`,
  [A, B, C],
);
const { rows: [cohort] } = await db.query("select id from public.cohorts where status = 'open' limit 1");
const enrol = async (user) =>
  (await db.query("insert into public.enrollments (cohort_id, user_id) values ($1, $2) returning id", [cohort.id, user])).rows[0].id;
const EA = await enrol(A), EB = await enrol(B), EC = await enrol(C);

// The live schema allows ONE submission per assignment per enrolment, so
// every fixture submission gets its own assignment.
const { rows: assignments } = await db.query(`
  select a.id from public.assignments a
  join public.modules m on m.id = a.module_id
  join public.paths p on p.id = m.path_id
  where p.status = 'published' order by m.week_no, a.kind`);
let nextAssignment = 0;

const perEnrolment = new Map();
const submit = async (enrolment) => {
  const used = perEnrolment.get(enrolment) ?? 0;
  perEnrolment.set(enrolment, used + 1);
  const a = assignments[used];
  if (!a) throw new Error('fixture ran out of assignments');
  return (await db.query(
    `insert into public.submissions (enrollment_id, assignment_id, week_no, payload, status)
     values ($1, $2, $3, '{"sql":"select 1"}', 'graded') returning id`,
    [enrolment, a.id, used + 1],
  )).rows[0].id;
};

console.log("── the gates travel ────────────────────────────────────────");
await db.exec("reset jintu.uid;");
check((await codeOf("select public.claim_review()")) === "28000", "no session is told to sign in (28000)");
await db.exec(`set jintu.uid = '${HALF}';`);
check((await codeOf("select public.claim_review()")) === "P0002", "no profile is sent to onboarding (P0002)");

console.log("\n── the empty queue says so ─────────────────────────────────");
await db.exec(`set jintu.uid = '${B}';`);
check((await codeOf("select public.claim_review()")) === "P0001", "an empty queue is P0001, not an error page");

console.log("\n── first submission is free ────────────────────────────────");
const SA1 = await submit(EA);
check((await one("select public.review_debt($1) as d", [A])).d === 0, "one submission, zero debt — the first is free");

await db.exec(`set jintu.uid = '${B}';`);
const claim1 = await one("select public.claim_review() as id");
check(Boolean(claim1.id), "a stranger claims the first submission");
const claimed = await one("select submission_id, reviewer_enrollment_id from public.peer_reviews where id = $1", [claim1.id]);
check(claimed.submission_id === SA1 && claimed.reviewer_enrollment_id === EB, "the claim is a pending review held by the claimer");

check((await codeOf("select public.claim_review()")) === "P0001", "the same reviewer cannot claim the same submission twice");

console.log("\n── review-to-unlock bites on the second submission ─────────");
await submit(EA);
check((await one("select public.review_debt($1) as d", [A])).d === 2, "a second submission puts the author two reviews in debt");

await db.exec(`set jintu.uid = '${C}';`);
const c1 = await one("select public.claim_review() as id");
const c1sub = await one("select submission_id from public.peer_reviews where id = $1", [c1.id]);
check(c1sub.submission_id === SA1, "the indebted author's NEW submission is not in the pool — only the old one");
check((await codeOf("select public.claim_review()")) === "P0001", "and once the old one is exhausted the pool is empty");

// The author pays the debt: two submitted reviews on others' work.
const SB1 = await submit(EB);
const SC1 = await submit(EC);
await db.exec(`set jintu.uid = '${A}';`);
const a1 = await one("select public.claim_review() as id");
const a2 = await one("select public.claim_review() as id");
check(Boolean(a1.id && a2.id), "the indebted author can still claim work to pay the debt down");
await db.query(
  `update public.peer_reviews set status = 'submitted', scores = '{"overall": 4}' where id = any($1)`,
  [[a1.id, a2.id]],
);
check((await one("select public.review_debt($1) as d", [A])).d === 0, "two delivered reviews clear the debt");

await db.exec(`set jintu.uid = '${C}';`);
const c2 = await one("select public.claim_review() as id");
const c2sub = await one("select submission_id from public.peer_reviews where id = $1", [c2.id]);
check(c2sub.submission_id !== SA1, "with the debt paid, the author's second submission enters the queue");

console.log("\n── nobody reviews their own work ───────────────────────────");
await db.exec(`set jintu.uid = '${B}';`);
// B's own submission SB1 is in the pool but must never come back to B.
let own = false;
for (;;) {
  let id;
  try { id = (await one("select public.claim_review() as id")).id; } catch { break; }
  const s = await one("select submission_id from public.peer_reviews where id = $1", [id]);
  if (s.submission_id === SB1) { own = true; break; }
}
check(!own, "claiming drained the pool without ever handing B their own submission");

console.log("\n── collusion surfaces, and only for ops ────────────────────");
// A and B review each other three times each via direct rows (ops fixture).
for (let w = 5; w <= 7; w++) {
  const sa = await submit(EA);
  const sb = await submit(EB);
  await db.query(
    `insert into public.peer_reviews (submission_id, reviewer_enrollment_id, status, scores, due_at)
     values ($1, $2, 'submitted', '{"overall":5}', now()),
            ($3, $4, 'submitted', '{"overall":5}', now())`,
    [sa, EB, sb, EA],
  );
}
const pair = await one("select mutual_depth from public.suspected_reciprocal_reviews limit 1");
check(Number(pair?.mutual_depth) >= 3, `the trading pair surfaces (mutual depth ${pair?.mutual_depth})`);

await db.exec("grant usage on schema public to authenticated;");
await db.exec(`begin; set local role authenticated; set local jintu.uid = '${A}';`);
const clientSees = await codeOf("select * from public.suspected_reciprocal_reviews");
await db.exec("rollback;");
check(clientSees !== null, "clients cannot read the collusion surface");

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
