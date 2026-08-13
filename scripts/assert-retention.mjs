/**
 * Proves the retention machinery (0008) mints exactly what it promises.
 *
 *   node scripts/assert-retention.mjs
 *
 * The award rules, each asserted through the REAL write path (RLS role +
 * trigger / RPC, never owner inserts):
 *   - a done tick pays the node's points once ever, and touches the streak
 *   - the daily node cap holds — progress recorded, excess unpaid
 *   - module completion pays +50 when required nodes are done (optional
 *     nodes stay optional)
 *   - streaks: +1 per consecutive day, freezes absorb short gaps, long
 *     gaps reset, the 7-day bonus lands once per day
 *   - review_card_grade reschedules, pays 1/card/day, and refuses other
 *     people's cards; touch_streak is not client-callable
 *
 * Dates advance via the jintu.today seam (set local, transaction-scoped).
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

// ── fixture: one published roadmap, two modules, users ──────────────────────
const rm = (await one(`insert into public.roadmaps (slug, title, summary, difficulty, status)
  values ('fixture', 'Fixture', 'Test roadmap.', 'beginner', 'published') returning id`)).id;
const m1 = (await one(`insert into public.modules (roadmap_id, position, title) values ('${rm}', 1, 'M1') returning id`)).id;
const m2 = (await one(`insert into public.modules (roadmap_id, position, title) values ('${rm}', 2, 'M2') returning id`)).id;

const node = async (mod, pos, pts, optional = false) =>
  (await one(`insert into public.nodes (module_id, position, title, est_minutes, points, is_optional)
    values ('${mod}', ${pos}, 'n${pos}', 30, ${pts}, ${optional}) returning id`)).id;

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
const [ua, ub, uc, ud] = [await mkUser("a"), await mkUser("b"), await mkUser("c"), await mkUser("d")];

/** Run SQL as an authenticated user on a given "today". */
const as = async (uid, today, sql) => {
  await db.exec(`begin; set local role authenticated; set local jintu.uid = '${uid}'; set local jintu.today = '${today}';`);
  try { return await rows(sql); } finally { await db.exec("commit;"); }
};
const asFails = async (uid, today, sql) => {
  await db.exec(`begin; set local role authenticated; set local jintu.uid = '${uid}'; set local jintu.today = '${today}';`);
  try { await rows(sql); return null; }
  catch (e) { return e; }
  finally { await db.exec("rollback;"); }
};
const tick = (uid, today, nodeId) =>
  as(uid, today, `insert into public.node_progress (user_id, node_id, status, completed_at)
    values ('${uid}', '${nodeId}', 'done', now())
    on conflict (user_id, node_id) do update set status = 'done', completed_at = now()`);
const untick = (uid, today, nodeId) =>
  as(uid, today, `update public.node_progress set status = 'in_progress', completed_at = null
    where user_id = '${uid}' and node_id = '${nodeId}'`);

const pts = async (uid, type) =>
  Number((await one(`select coalesce(sum(points), 0) s from public.point_events
    where user_id = '${uid}'${type ? ` and source_type = '${type}'` : ""}`)).s);
const streak = (uid) => one(`select * from public.streaks where user_id = '${uid}'`);

const D = (n) => `2026-09-${String(n).padStart(2, "0")}`;

console.log("── a tick pays once, through the real write path ───────────");
await tick(ua, D(1), n1);
check((await pts(ua, "node")) === 25, `done pays the node's points (${await pts(ua, "node")})`);
check((await streak(ua)).current_days === 1, "and starts the streak");

await untick(ua, D(1), n1);
await tick(ua, D(1), n1);
check((await pts(ua, "node")) === 25, "untick + re-tick does not pay twice");

console.log("\n── module completion pays +50; optional stays optional ─────");
await tick(ua, D(1), n2);
check((await pts(ua, "module")) === 50, `both required nodes done → +50 (optional n3 untouched)`);
check((await pts(ua, "node")) === 55, "second node paid too");

console.log("\n── streak arithmetic ────────────────────────────────────────");
await tick(ua, D(2), nOpt);
check((await streak(ua)).current_days === 2, "next day → 2");
await tick(ua, D(5), bigNodes[0]);
const s5 = await streak(ua);
check(s5.current_days === 3 && s5.freezes_remaining === 0, `two missed days eat both freezes, streak survives (${s5.current_days}d, ${s5.freezes_remaining} freezes)`);
await tick(ua, D(9), bigNodes[1]);
check((await streak(ua)).current_days === 1, "a gap with no freezes left resets to 1");

console.log("\n── the 7-day bonus, once per day ────────────────────────────");
for (let d = 1; d <= 7; d++) await tick(uc, D(d), bigNodes[d - 1]);
check((await pts(uc, "streak")) === 5, `day seven pays +5 (${await pts(uc, "streak")})`);
await tick(uc, D(7), bigNodes[7]);
check((await pts(uc, "streak")) === 5, "a second tick the same day does not pay again");

console.log("\n── the daily cap ────────────────────────────────────────────");
for (const bn of bigNodes.slice(0, 6)) await tick(ud, D(1), bn); // 6 × 40 = 240 offered
const udNode = await pts(ud, "node");
check(udNode >= 150 && udNode < 190, `node points stop at the cap (${udNode}; progress still recorded)`);
check(
  Number((await one(`select count(*) c from public.node_progress where user_id = '${ud}' and status = 'done'`)).c) === 6,
  "all six ticks recorded regardless",
);

console.log("\n── review cards: reschedule, 1/card/day, own cards only ────");
const card = (await as(ub, D(1), `insert into public.review_cards (user_id, node_id, front, back)
  values ('${ub}', '${n1}', 'Q', 'A') returning id`))[0].id;
const graded = await as(ub, D(1), `select * from public.review_card_grade('${card}', 'good')`);
check(
  graded.length === 1 && new Date(graded[0].next_due).getTime() > new Date(D(1)).getTime(),
  `good reschedules forward (${new Date(graded[0].next_due).toISOString().slice(0, 10)})`,
);
check((await pts(ub, "review")) === 1, "clearing pays 1");
await as(ub, D(1), `select * from public.review_card_grade('${card}', 'again')`);
check((await pts(ub, "review")) === 1, "same card same day pays once");
const lapsed = await one(`select lapses, reps from public.review_cards where id = '${card}'`);
check(lapsed.lapses === 1 && lapsed.reps === 2, "again counts a lapse; reps count both");
const theft = await asFails(ua, D(1), `select * from public.review_card_grade('${card}', 'good')`);
check(theft !== null, "grading someone else's card is refused");

console.log("\n── nothing else can mint ────────────────────────────────────");
check(
  (await asFails(ua, D(1), `select public.touch_streak('${ua}')`)) !== null,
  "touch_streak is not client-callable",
);
check(
  (await asFails(ua, D(1), `insert into public.point_events (user_id, source_type, source_id, points)
    values ('${ua}', 'node', '${bigNodes[9]}', 99)`)) !== null,
  "direct point inserts still refused",
);
check(
  (await asFails(ua, D(1), `update public.streaks set current_days = 400 where user_id = '${ua}'`)) !== null ||
  (await streak(ua)).current_days !== 400,
  "streaks still unwritable by clients",
);

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
