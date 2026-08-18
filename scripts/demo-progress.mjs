/**
 * The 0012 acceptance run, demonstrated rather than asserted.
 *
 *   node scripts/demo-progress.mjs
 *
 * Every item in the session spec's ACCEPTANCE list is executed against a
 * real Postgres (PGlite) loaded with every migration in order, through the
 * RPCs as the `authenticated` role — never an owner write. Each step prints
 * the query and the rows it returned, so the numbers can be read rather
 * than taken on trust.
 *
 * Time travels through the jintu.now seam, so the timezone conversions are
 * genuine: the clock is set to a UTC instant and the database works out
 * which local date that is for the user in question.
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

/** Run as an authenticated user at a given UTC instant. */
const as = async (uid, atUtc, sql) => {
  await db.exec(
    `begin; set local role authenticated; set local jintu.uid = '${uid}'; set local jintu.now = '${atUtc}';`,
  );
  try {
    return await rows(sql);
  } finally {
    await db.exec("commit;");
  }
};

let step = 0;
const show = (title, sql, result) => {
  step += 1;
  console.log(`\n─── ${step}. ${title}`);
  console.log(`    ${sql.trim().replace(/\s+/g, " ").slice(0, 150)}`);
  for (const r of result) {
    console.log(
      `    → ${Object.entries(r)
        .map(([k, v]) => `${k}=${v === null ? "null" : v}`)
        .join("  ")}`,
    );
  }
  if (result.length === 0) console.log("    → (no rows)");
};

// ── fixture ──────────────────────────────────────────────────────────────────
const rm = (
  await one(`insert into public.roadmaps (slug, title, summary, difficulty, status)
  values ('demo', 'Demo', 'Fixture roadmap.', 'beginner', 'published') returning id`)
).id;
const mod = (
  await one(
    `insert into public.modules (roadmap_id, position, title) values ('${rm}', 1, 'M1') returning id`,
  )
).id;
const nodes = [];
for (let i = 1; i <= 8; i++) {
  nodes.push(
    (
      await one(`insert into public.nodes (module_id, position, title, est_minutes, points)
      values ('${mod}', ${i}, 'Day ${i}', 30, 25) returning id`)
    ).id,
  );
}
const mkUser = async (tag, tz) => {
  const id = (await one(`insert into auth.users (id) values (gen_random_uuid()) returning id`)).id;
  await db.exec(`insert into public.profiles (id, phone, is_adult_confirmed, timezone)
    values ('${id}', '+91${tag}${id.slice(0, 6)}', true, '${tz}')`);
  return id;
};
const ua = await mkUser("a", "Asia/Kolkata");
const ny = await mkUser("n", "America/New_York");

/** Noon UTC on 2026-09-0n — unambiguous in both zones. */
const D = (n) => `2026-09-${String(n).padStart(2, "0")}T12:00:00Z`;
const totals = [];
const track = (label, r) => {
  totals.push({ label, total_days: r.total_days });
  return r;
};

console.log("═══ 0012 acceptance — every claim is a query result ═══");

// ── 1. two different nodes, same day → the streak advances once ──────────────
const a1 = (await as(ua, D(1), `select * from public.complete_node('${nodes[0]}')`))[0];
show("complete node 1 on 1 Sep", "select * from complete_node(<node 1>)", [a1]);
track("first completion", a1);

const a2 = (await as(ua, D(1), `select * from public.complete_node('${nodes[1]}')`))[0];
show(
  "complete a SECOND node the same day → is_new_day false, streak unmoved (trap 2)",
  "select * from complete_node(<node 2>)",
  [a2],
);
track("second node same day", a2);

show(
  "activity_days proves volume accumulated without moving the streak",
  "select done_on, nodes from activity_days",
  await rows(`select done_on::text, nodes from public.activity_days where user_id = '${ua}'`),
);

// ── 2. the same node twice → nothing changes at all ──────────────────────────
const before = await one(
  `select current_days, total_days, (select count(*) from public.point_events where user_id = '${ua}') as point_rows from public.streaks where user_id = '${ua}'`,
);
const a3 = (await as(ua, D(1), `select * from public.complete_node('${nodes[0]}')`))[0];
show("complete the SAME node again → no change", "select * from complete_node(<node 1>)", [a3]);
show(
  "…and nothing moved underneath it either",
  "select current_days, total_days, count(point_events) before vs after",
  [
    before,
    await one(
      `select current_days, total_days, (select count(*) from public.point_events where user_id = '${ua}') as point_rows from public.streaks where user_id = '${ua}'`,
    ),
  ],
);

// ── 3. complete → uncomplete → complete, on a fresh day ──────────────────────
const b1 = (await as(ua, D(2), `select * from public.complete_node('${nodes[2]}')`))[0];
show("2 Sep: complete", "select * from complete_node(<node 3>)", [b1]);
track("day 2 complete", b1);

const b2 = (await as(ua, D(2), `select * from public.uncomplete_node('${nodes[2]}')`))[0];
show("2 Sep: uncomplete — the day empties and un-counts", "select * from uncomplete_node(<node 3>)", [b2]);
track("day 2 undone", b2);

const b3 = (await as(ua, D(2), `select * from public.complete_node('${nodes[2]}')`))[0];
show("2 Sep: complete again → identical to having done it once", "select * from complete_node(<node 3>)", [b3]);
track("day 2 redone", b3);

show(
  "the round trip left the same state a single completion would have",
  "select current_days, longest_days, total_days, last_done_on from streaks",
  await rows(
    `select current_days, longest_days, total_days, last_done_on::text from public.streaks where user_id = '${ua}'`,
  ),
);

// ── 4. a nine-day gap reads 0 with NO write having occurred ──────────────────
show(
  "no write happens here — only a read, nine days after 2 Sep",
  "select * from streak_status  (as the user, clock = 11 Sep)",
  await as(
    ua,
    D(11),
    `select current_days, longest_days, total_days, last_done_on::text, done_today, days_since from public.streak_status where user_id = '${ua}'`,
  ),
);
show(
  "the cached row underneath is still the stale 2 — which is why the UI reads the view (trap 4)",
  "select current_days from streaks",
  await rows(`select current_days, last_done_on::text from public.streaks where user_id = '${ua}'`),
);

// ── 5. completing after the gap ──────────────────────────────────────────────
const c1 = (await as(ua, D(11), `select * from public.complete_node('${nodes[3]}')`))[0];
show(
  "11 Sep: complete after the gap → restart at 1, was_broken, total_days marches on (trap 3)",
  "select * from complete_node(<node 4>)",
  [c1],
);
track("after the gap", c1);
console.log(
  `    NOTE  last activity 2 Sep, back on 11 Sep: the empty days are 3–10 Sep = 8, and\n` +
    `          the raw difference is 9. days_missed=${c1.days_missed} is what "You missed N days"\n` +
    `          must print; days_since=${c1.days_since} is the difference. The spec's acceptance line\n` +
    `          says 9 — that is days_since, not the count of missed days. Ruling needed.`,
);

// ── 6. total_days never decreased ────────────────────────────────────────────
console.log(`\n─── ${++step}. total_days across every step above`);
for (const t of totals) console.log(`    ${String(t.total_days).padStart(2)}  ← ${t.label}`);
const dips = totals.filter((t, i) => i > 0 && t.total_days < totals[i - 1].total_days);
console.log(
  dips.length === 0
    ? "    → never decreased."
    : `    → decreased only at: ${dips.map((d) => d.label).join(", ")} — the undo the spec itself\n` +
      "      specifies ('decrement total_days only in that case'). The completing path never lowers it.",
);

// ── 7. no current_date in the subsystem ──────────────────────────────────────
const sql0012 = readFileSync(
  path.join(ROOT, "supabase", "migrations", "0012_progress_timezone_and_resume.sql"),
  "utf8",
);
const hits = sql0012.split("\n").filter((l) => /current_date/i.test(l) && !l.trim().startsWith("--"));
show(
  "grep current_date in the streak subsystem (0012)",
  "grep -in current_date 0012_*.sql",
  hits.length ? hits.map((h) => ({ line: h.trim() })) : [{ matches: 0 }],
);

// ── 8. the timezone boundary is the USER'S midnight (trap 1) ─────────────────
// 02:00 UTC on 10 Sep is 07:30 on 10 Sep in Kolkata, but still 22:00 on
// 9 Sep in New York. Same instant, two users, two different credited dates.
const instant = "2026-09-10T02:00:00Z";
const nyRow = (await as(ny, instant, `select * from public.complete_node('${nodes[4]}')`))[0];
show(
  `New York user completes at ${instant}`,
  "select * from complete_node(<node 5>)",
  [nyRow],
);
show(
  "…credited to 9 Sep local, not 10 Sep UTC",
  "select done_on from activity_days  +  user_today() for each user at the same instant",
  await rows(
    `select (select done_on::text from public.activity_days where user_id = '${ny}') as ny_credited_day,
            (select public.user_today('${ny}')) as ny_today,
            (select public.user_today('${ua}')) as kolkata_today`,
    [],
  ).then(async () => {
    await db.exec(`begin; set local jintu.now = '${instant}';`);
    const r = await rows(
      `select (select done_on::text from public.activity_days where user_id = '${ny}') as ny_credited_day,
              public.user_today('${ny}')::text as ny_today,
              public.user_today('${ua}')::text as kolkata_today`,
    );
    await db.exec("commit;");
    return r;
  }),
);

// ── 9. resume: save_block_position ───────────────────────────────────────────
await as(ua, D(12), `select public.save_block_position('${nodes[5]}', 12::smallint)`);
await as(ua, D(12), `select public.save_block_position('${nodes[5]}', 7::smallint)`);
show(
  "save_block_position(12) then (7) — scrolling back up must not move the bookmark back",
  "select last_block_position from node_progress",
  await rows(
    `select last_block_position, status from public.node_progress where user_id = '${ua}' and node_id = '${nodes[5]}'`,
  ),
);

// ── 10. the client still cannot mint anything ────────────────────────────────
const denied = async (sql, role = "authenticated") => {
  await db.exec(`begin; set local role ${role}; set local jintu.uid = '${ua}';`);
  try {
    await rows(sql);
    return "ALLOWED — this is a hole";
  } catch (e) {
    return `refused: ${String(e.message).slice(0, 60)}`;
  } finally {
    await db.exec("rollback;");
  }
};
show("a client trying to write the tables directly", "insert / update as authenticated", [
  { point_events: await denied(`insert into public.point_events (user_id, source_type, source_id, points, awarded_on) values ('${ua}', 'node', '${nodes[7]}', 9999, '2026-09-12')`) },
  { streaks: await denied(`update public.streaks set total_days = 999 where user_id = '${ua}'`) },
  { activity_days: await denied(`insert into public.activity_days (user_id, done_on) values ('${ua}', '2026-09-13')`) },
  { anon_calls_complete_node: await denied(`select public.complete_node('${nodes[7]}')`, "anon") },
  { anon_calls_save_block: await denied(`select public.save_block_position('${nodes[7]}', 3::smallint)`, "anon") },
]);

console.log("\n═══ end of run ═══");
await db.close();
