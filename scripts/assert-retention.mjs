/**
 * Proves the retention machinery — streaks v2 (0011) + awards (0008).
 *
 *   node scripts/assert-retention.mjs
 *
 * Every assertion runs through the real path: the complete_day /
 * uncomplete_day RPCs as an authenticated role, never owner writes. The
 * owner spec's verification checklist, mechanized:
 *
 *   - the IST boundary: 23:30 IST on a UTC machine credits the IST date
 *   - two nodes one day → streak advances once (volume ≠ consistency)
 *   - complete, undo, complete → identical to one completion
 *   - a 9-day gap reads 0 through streak_status WITHOUT any write
 *   - completing after the gap → current 1, was_broken, days_missed 9,
 *     total_days incremented — never decreased anywhere
 *   - no freezes exist; restart is 1; points still pay exactly once
 *   - no current_date survives in the streak subsystem
 *
 * Dates travel via the jintu.now seam (timestamptz → IST conversion is
 * REAL, which is the whole point of trap 1).
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
for (const f of readdirSync(path.join(ROOT, "supabase", "migrations")).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(path.join(ROOT, "supabase", "migrations", f), "utf8"));
}

const rows = async (q, p = []) => (await db.query(q, p)).rows;
const one = async (q, p = []) => (await rows(q, p))[0];

// ── fixture ──────────────────────────────────────────────────────────────────
const rm = (await one(`insert into public.roadmaps (slug, title, summary, difficulty, status)
  values ('fixture', 'Fixture', 'Test roadmap.', 'beginner', 'published') returning id`)).id;
const m1 = (await one(`insert into public.modules (roadmap_id, position, title) values ('${rm}', 1, 'M1') returning id`)).id;
const m2 = (await one(`insert into public.modules (roadmap_id, position, title) values ('${rm}', 2, 'M2') returning id`)).id;
const node = async (mod, pos, pts, optional = false) =>
  (await one(`insert into public.nodes (module_id, position, title, est_minutes, points, is_optional)
    values ('${mod}', ${pos}, 'n${mod === m1 ? "" : "b"}${pos}', 30, ${pts}, ${optional}) returning id`)).id;
const n1 = await node(m1, 1, 25);
const n2 = await node(m1, 2, 30);
const nOpt = await node(m1, 3, 40, true);
const bigNodes = [];
for (let i = 1; i <= 12; i++) bigNodes.push(await node(m2, i, 40));

const mkUser = async (tag) => {
  const id = (await one(`insert into auth.users (id) values (gen_random_uuid()) returning id`)).id;
  await db.exec(`insert into public.profiles (id, phone, is_adult_confirmed) values ('${id}', '+91${tag}${id.slice(0, 6)}', true)`);
  return id;
};
const [ua, ub, uc] = [await mkUser("a"), await mkUser("b"), await mkUser("c")];

/** Run SQL as an authenticated user at a given UTC instant. */
const as = async (uid, atUtc, sql) => {
  await db.exec(`begin; set local role authenticated; set local jintu.uid = '${uid}'; set local jintu.now = '${atUtc}';`);
  try { return await rows(sql); } finally { await db.exec("commit;"); }
};
const asFails = async (uid, atUtc, sql) => {
  await db.exec(`begin; set local role authenticated; set local jintu.uid = '${uid}'; set local jintu.now = '${atUtc}';`);
  try { await rows(sql); return null; }
  catch (e) { return e; }
  finally { await db.exec("rollback;"); }
};
const complete = (uid, atUtc, nodeId) =>
  as(uid, atUtc, `select * from public.complete_day('${nodeId}')`).then((r) => r[0]);
const undo = (uid, atUtc, nodeId) =>
  as(uid, atUtc, `select * from public.uncomplete_day('${nodeId}')`).then((r) => r[0]);
const status = (uid, atUtc) =>
  as(uid, atUtc, `select * from public.streak_status`).then((r) => r[0]);
const pts = async (uid, type) =>
  Number((await one(`select coalesce(sum(points), 0) s from public.point_events
    where user_id = '${uid}'${type ? ` and source_type = '${type}'` : ""}`)).s);

// Noon UTC on Sep N = evening IST, safely inside the same IST date.
const D = (n, t = "12:00:00") => `2026-09-${String(n).padStart(2, "0")}T${t}Z`;

console.log("── trap 1: the IST boundary ────────────────────────────────");
// 18:45 UTC on Sep 1 is 00:15 IST on Sep 2. The credit must go to Sep 2.
const r1 = await complete(ua, "2026-09-01T18:45:00Z", n1);
const day = await one(`select done_on from public.activity_days where user_id = '${ua}'`);
const dayIso = new Date(day.done_on).toISOString().slice(0, 10);
check(dayIso === "2026-09-02", `00:15-IST completion on a Sep-1 UTC clock credits Sep 2 IST (${dayIso})`);
check(r1.current_days === 1 && r1.total_days === 1 && r1.is_new_day === true, "first ever day: current 1, total 1");

console.log("\n── trap 2: one calendar day is one streak day ──────────────");
const r2 = await complete(ua, "2026-09-02T10:00:00Z", n2); // still Sep 2 IST
check(r2.current_days === 1 && r2.total_days === 1 && r2.is_new_day === false, `second node same IST day advances nothing (${r2.current_days}/${r2.total_days})`);
check((await pts(ua, "node")) === 55, "but both nodes paid their points");

console.log("\n── consecutive days and the hard reset ─────────────────────");
const r3 = await complete(ua, D(3), nOpt);
check(r3.current_days === 2 && r3.was_broken === false, "next IST day → 2");
const r4 = await complete(ua, D(6), bigNodes[0]);
check(
  r4.current_days === 1 && r4.was_broken === true && r4.days_missed === 2 && r4.total_days === 3,
  `a 2-day gap hard-resets to 1 — no freezes — and names the miss (missed ${r4.days_missed}, total ${r4.total_days})`,
);
check(r4.longest_days === 2, "longest survives the reset");

console.log("\n── trap 4: staleness decays through the view ───────────────");
const stale = await status(ua, D(15));
check(stale.current_days === 0, `nine days later the view reads 0 with no write (${stale.current_days})`);
check(Number(stale.days_since) === 9 && stale.done_today === false, `and says how long it has been (${stale.days_since})`);
check(
  (await one(`select current_days from public.streaks where user_id = '${ua}'`)).current_days === 1,
  "while the raw cache still holds the stale 1 — which is why the UI never reads it",
);
const r5 = await complete(ua, D(15), bigNodes[1]);
check(
  r5.current_days === 1 && r5.was_broken === true && r5.days_missed === 8 && r5.total_days === 4,
  `completing after the gap: 1 again, was_broken, missed 8, total marches on (${r5.total_days})`,
);

console.log("\n── undo: complete, undo, complete ──────────────────────────");
await complete(ub, D(1), n1);
const afterOne = await one(`select current_days, total_days from public.streaks where user_id = '${ub}'`);
await complete(ub, D(1), n2);
await undo(ub, D(1), n2);
const afterUndo1 = await one(`select current_days, total_days from public.streaks where user_id = '${ub}'`);
check(
  afterUndo1.current_days === afterOne.current_days && afterUndo1.total_days === afterOne.total_days,
  "undoing the second node of a day changes nothing (day still has one)",
);
await undo(ub, D(1), n1);
const emptied = await status(ub, D(1));
check(emptied.current_days === 0 && Number(emptied.total_days) === 0, "undoing the last node empties the day: current 0, total 0");
const r6 = await complete(ub, D(1), n1);
check(
  r6.current_days === afterOne.current_days && r6.total_days === afterOne.total_days,
  "complete → undo → complete ends exactly where one completion does",
);

console.log("\n── undo rebuilds from the source of truth ──────────────────");
await complete(uc, D(1), n1);
await complete(uc, D(2), n2);
await complete(uc, D(3), nOpt);
await undo(uc, D(3), nOpt);
const rebuilt = await one(`select current_days, total_days, last_done_on from public.streaks where user_id = '${uc}'`);
check(
  rebuilt.current_days === 2 && rebuilt.total_days === 2 &&
    new Date(rebuilt.last_done_on).toISOString().slice(0, 10) === "2026-09-02",
  `undoing today rewinds to the run ending yesterday (${rebuilt.current_days}d, total ${rebuilt.total_days})`,
);

console.log("\n── the 7-day bonus rides the new streak ────────────────────");
// Re-complete Sep 3 (the undone day) then run to Sep 9 — a continuous run.
for (let d = 3; d <= 9; d++) await complete(uc, D(d), bigNodes[d]);
check(
  (await one(`select current_days from public.streaks where user_id = '${uc}'`)).current_days === 9,
  "run rebuilt to 9 consecutive days",
);
check((await pts(uc, "streak")) === 15, `+5 landed on days 7, 8 and 9, once each (${await pts(uc, "streak")})`);

console.log("\n── nothing else can mint or move ───────────────────────────");
check((await asFails(ua, D(16), `select public.touch_streak('${ua}')`)) !== null, "touch_streak is gone");
check(
  (await asFails(ua, D(16), `insert into public.activity_days (user_id, done_on) values ('${ua}', '2026-09-16')`)) !== null,
  "activity_days has no client write path",
);
check(
  (await asFails(ua, D(16), `update public.streaks set total_days = 999 where user_id = '${ua}'`)) !== null ||
  (await one(`select total_days from public.streaks where user_id = '${ua}'`)).total_days !== 999,
  "streaks still unwritable by clients",
);
check(
  (await asFails(null, D(16), `select * from public.complete_day('${n1}')`)) !== null,
  "anon cannot complete a day",
);

console.log("\n── no current_date survived in the streak subsystem ────────");
const streakSql = readFileSync(path.join(ROOT, "supabase", "migrations", "0011_streaks_v2.sql"), "utf8");
check(!/\bcurrent_date\b/i.test(streakSql), "0011 is current_date-free");

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
