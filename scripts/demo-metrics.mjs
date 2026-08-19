/**
 * The metrics views, demonstrated against seeded data.
 *
 *   node scripts/demo-metrics.mjs
 *
 * Twenty users with deliberately varied histories, including the three
 * cases the views exist to catch: somebody who signed up and never came
 * back, a node everybody abandons, and a lapsed streak that still holds
 * its total. Each view prints its rows so the numbers can be read rather
 * than trusted.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const db = await PGlite.create();
await db.exec(SHIM);
for (const f of readdirSync(path.join(ROOT, "supabase", "migrations"))
  .filter((f) => f.endsWith(".sql"))
  .sort()) {
  await db.exec(readFileSync(path.join(ROOT, "supabase", "migrations", f), "utf8"));
}

const rows = async (q, p = []) => (await db.query(q, p)).rows;
const one = async (q, p = []) => (await rows(q, p))[0];

let failures = 0;
const check = (ok, label) => {
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}`);
  if (!ok) failures++;
};
const table = (title, rs, cols) => {
  console.log(`\n─── ${title}`);
  if (!rs.length) return console.log("    (no rows)");
  for (const r of rs) {
    console.log(
      "    " +
        (cols ?? Object.keys(r))
          .map((c) => `${c}=${r[c] === null ? "—" : r[c]}`)
          .join("  "),
    );
  }
};

// ── curriculum ───────────────────────────────────────────────────────────────
const rm = (
  await one(`insert into public.roadmaps (slug, title, summary, difficulty, status)
    values ('metrics', 'Metrics fixture', 'Fixture.', 'beginner', 'published') returning id`)
).id;
const mod = (
  await one(
    `insert into public.modules (roadmap_id, position, title) values ('${rm}', 1, 'M1') returning id`,
  )
).id;
const nodes = [];
for (let i = 1; i <= 5; i++) {
  nodes.push(
    (
      await one(`insert into public.nodes (module_id, position, title, est_minutes, points)
        values ('${mod}', ${i}, 'Day ${i} name', 30, 25) returning id`)
    ).id,
  );
}
await db.exec(`insert into public.resources (node_id, position, type, title, url, source_name)
  values ('${nodes[0]}', 1, 'read', 'Good read', 'https://a.example/x', 'Quartz'),
         ('${nodes[3]}', 1, 'read', 'Ignored read', 'https://b.example/y', 'Nobody Reads This')`);

// ── twenty users ─────────────────────────────────────────────────────────────
// Signup dates are staggered so cohorts are distinguishable; activity is
// varied so every bucket in every view has something in it.
const SIGNUP = "2026-09-01";
const mkUser = async (tag, signupDate) => {
  const id = (await one(`insert into auth.users (id) values (gen_random_uuid()) returning id`)).id;
  await db.exec(`insert into public.profiles (id, phone, is_adult_confirmed, timezone, created_at)
    values ('${id}', '+91${tag}', true, 'Asia/Kolkata', '${signupDate}T09:00:00Z')`);
  return id;
};
/** Complete a node on a given date, through the real RPC. */
const completeOn = async (uid, atUtc, nodeId) => {
  await db.exec(
    `begin; set local role authenticated; set local jintu.uid = '${uid}'; set local jintu.now = '${atUtc}';`,
  );
  try {
    await rows(`select public.complete_node('${nodeId}')`);
  } finally {
    await db.exec("commit;");
  }
};
const D = (n) => `2026-09-${String(n).padStart(2, "0")}T12:00:00Z`;

const users = [];
for (let i = 0; i < 20; i++) users.push(await mkUser(String(700000000 + i), SIGNUP));

// u0–u3: signed up and NEVER returned. The row the LEFT JOIN protects.
// u4–u9: day 0 only.
for (const u of users.slice(4, 10)) await completeOn(u, D(1), nodes[0]);
// u10–u14: days 0 and 1.
for (const u of users.slice(10, 15)) {
  await completeOn(u, D(1), nodes[0]);
  await completeOn(u, D(2), nodes[1]);
}
// u15–u17: days 0, 1, 3 — they cleared the day-3 bar.
for (const u of users.slice(15, 18)) {
  await completeOn(u, D(1), nodes[0]);
  await completeOn(u, D(2), nodes[1]);
  await completeOn(u, D(4), nodes[2]);
}
// u18: an eight-day run, then nothing. Cycles the first three nodes so it
// never touches node 4 — that one has to stay genuinely abandoned.
for (let d = 1; d <= 8; d++) await completeOn(users[18], D(d), nodes[(d - 1) % 3]);
// u19: finished days long ago and stopped — LAPSED, total intact.
for (let d = 1; d <= 3; d++) await completeOn(users[19], D(d), nodes[d - 1]);

// Node 4 is the deliberate cliff: several people reach it, nobody finishes.
for (const u of users.slice(15, 18)) {
  await db.exec(`insert into public.node_progress (user_id, node_id, status)
    values ('${u}', '${nodes[3]}', 'in_progress') on conflict do nothing`);
}

// The clock for every read below: 30 Sep, long after u19 lapsed.
const NOW = "2026-09-30T12:00:00Z";
const readAs = async (sql) => {
  await db.exec(`begin; set local jintu.now = '${NOW}';`);
  try {
    return await rows(sql);
  } finally {
    await db.exec("commit;");
  }
};

console.log("═══ 20 users seeded ═══");

// ── 1 ────────────────────────────────────────────────────────────────────────
const cohorts = await readAs(`select * from public.retention_cohorts`);
table("1 · retention_cohorts", cohorts);
const c0 = cohorts[0];
check(Number(c0.signed_up) === 20, `all 20 counted in the cohort (${c0.signed_up})`);
check(
  Number(c0.never_returned) === 4,
  `the 4 who signed up and never returned are visible, not dropped (${c0.never_returned})`,
);
check(Number(c0.d0) === 16, `d0 = 16 (${c0.d0})`);
check(Number(c0.d1) === 10, `d1 = 10 — u10..u19 came back the next day (${c0.d1})`);
check(Number(c0.d3) === 4, `d3 = 4 — three who pushed on, plus the eight-day runner (${c0.d3})`);

// ── 2 ────────────────────────────────────────────────────────────────────────
const drop = await readAs(
  `select day_number, node_title, reached, completed, reached_previous, dropoff_rate
   from public.node_dropoff where roadmap = 'metrics' order by day_number`,
);
table("2 · node_dropoff (in day order; the view itself sorts worst-first)", drop);
const cliff = drop.find((r) => Number(r.day_number) === 4);
check(
  Number(cliff.reached) > 0 && Number(cliff.completed) === 0,
  `day 4 is reached by ${cliff.reached} and completed by ${cliff.completed} — the abandoned node is identified`,
);
const worst = (await readAs(
  `select day_number, dropoff_rate from public.node_dropoff
   where roadmap = 'metrics' and dropoff_rate is not null order by dropoff_rate desc limit 1`,
))[0];
check(Number(worst.dropoff_rate) > 0, `the worst fall is day ${worst.day_number} at ${worst.dropoff_rate}`);

// ── 3 ────────────────────────────────────────────────────────────────────────
const dist = await readAs(`select * from public.streak_distribution`);
table("3 · streak_distribution", dist);
const lapsed = dist.find((r) => r.bucket === "lapsed · recoverable");
check(Boolean(lapsed) && Number(lapsed.users) > 0, `the lapsed bucket holds the recoverable audience (${lapsed?.users})`);
check(
  Number(lapsed.total_days_held) > 0,
  `and their finished days are still counted (${lapsed?.total_days_held})`,
);
const never = dist.find((r) => r.bucket === "0 · never finished a day");
check(Boolean(never), `the never-finished bucket exists too (${never?.users ?? 0})`);

// ── 4 ────────────────────────────────────────────────────────────────────────
const ttf = await readAs(`select * from public.time_to_first_day`);
table("4 · time_to_first_day", ttf);
check(Number(ttf[0].users_with_none) === 4, `the 4 who never finished a day are counted apart (${ttf[0].users_with_none})`);
check(ttf[0].median_hours !== null, `a median exists (${ttf[0].median_hours} h)`);

// ── 5 ────────────────────────────────────────────────────────────────────────
const eng = await readAs(`select * from public.resource_engagement`);
table("5 · resource_engagement (APPROXIMATE — completions, not clicks)", eng);
const ignored = eng.find((r) => r.source_name === "Nobody Reads This");
check(
  Boolean(ignored) && Number(ignored.likely_opened_by) === 0,
  `the source on the abandoned node shows 0 — a curation error, surfaced`,
);

// ── the grant ────────────────────────────────────────────────────────────────
console.log("\n─── access");
for (const v of [
  "retention_cohorts",
  "node_dropoff",
  "streak_distribution",
  "time_to_first_day",
  "resource_engagement",
]) {
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`begin; set local role ${role};`);
    let refused = false;
    try {
      await rows(`select * from public.${v} limit 1`);
    } catch {
      refused = true;
    } finally {
      await db.exec("rollback;");
    }
    check(refused, `${role} cannot read ${v}`);
  }
}

await db.close();
console.log(`\n${failures === 0 ? "every view behaves." : `${failures} problem(s).`}`);
process.exit(failures === 0 ? 0 : 1);
