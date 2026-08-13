/**
 * Proves the Data Analyst v3 curriculum earns the verified tier for real.
 *
 *   node scripts/assert-data-analyst-v3.mjs
 *
 * v3 exists to fix the site-wide contradiction a reviewer caught: the
 * homepage counted one Verified track while the track itself computed 28%
 * machine-checked and rendered the community template. This guard asserts
 * the arithmetic that resolves it — 21 of 36 rubric points machine-checked
 * — plus the standing promises: additive over v1 AND v2, idempotent, codes
 * public but nothing key-shaped in any public spec.
 */
import { execFileSync } from "node:child_process";
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
await db.exec(readFileSync(path.join(ROOT, "supabase", "seed.sql"), "utf8"));

const gen = (name) =>
  execFileSync(process.execPath, [path.join(ROOT, "scripts", name)], { encoding: "utf8", maxBuffer: 33554432 });
const v2sql = gen("generate-data-analyst-v2.mjs");
const v3sql = gen("generate-data-analyst-v3.mjs");
await db.exec(v2sql); // prod reality: v2 is live before v3 arrives

const one = async (q, p = []) => (await db.query(q, p)).rows[0];
const snapshot = async (v) =>
  one(`select count(m.id)::int weeks,
       (select count(*)::int from public.assignments a join public.modules m2 on m2.id = a.module_id where m2.path_id = p.id) artifacts
       from public.paths p left join public.modules m on m.path_id = p.id
       join public.tracks t on t.id = p.track_id
       where t.slug = 'data-analyst-fresher' and p.version = $1 group by p.id`, [v]);

const v1Before = await snapshot(1);
const v2Before = await snapshot(2);

console.log("── v3 applies ──────────────────────────────────────────────");
await db.exec(v3sql);

const v3 = await one(`
  select p.status,
    (select count(*)::int from public.modules where path_id = p.id) weeks,
    (select count(*)::int from public.resources r join public.modules m on m.id = r.module_id where m.path_id = p.id) resources,
    (select count(*)::int from public.assignments a join public.modules m on m.id = a.module_id where m.path_id = p.id) artifacts,
    (select count(*)::int from public.daily_reps dr join public.modules m on m.id = dr.module_id where m.path_id = p.id) reps
  from public.paths p join public.tracks t on t.id = p.track_id
  where t.slug = 'data-analyst-fresher' and p.version = 3`);
check(v3?.status === "published", `version 3 is published (${v3?.status})`);
check(v3?.weeks === 6 && v3?.artifacts === 6, `six weeks, an artifact each (${v3?.weeks}/${v3?.artifacts})`);
check(v3?.resources === 15, `fifteen resources — the export plus 311 kept as optional practice (${v3?.resources})`);
check(v3?.reps === 18, `the eighteen reps travelled (${v3?.reps})`);

const live = await one(`
  select max(p.version)::int v from public.paths p
  join public.tracks t on t.id = p.track_id
  where t.slug = 'data-analyst-fresher' and p.status = 'published'`);
check(live.v === 3, `the site would serve version ${live.v}`);

console.log("\n── the arithmetic that earns the tier ──────────────────────");
const mix = await one(`
  select
    sum((c->>'weight')::numeric) filter (where c->>'check' in ('executable','detectable','structural'))::numeric machine,
    sum((c->>'weight')::numeric)::numeric total
  from public.assignments a
  join public.modules m on m.id = a.module_id
  join public.paths p on p.id = m.path_id
  join public.tracks t on t.id = p.track_id
  join public.rubrics r on r.id = a.rubric_id
  cross join lateral jsonb_array_elements(r.criteria) c
  where t.slug = 'data-analyst-fresher' and p.version = 3`);
check(
  Number(mix.machine) === 21 && Number(mix.total) === 36,
  `21 of 36 points machine-checked (${mix.machine}/${mix.total} = ${Math.round(mix.machine / mix.total * 100)}%)`,
);
const share = await one("select deterministic_share from public.tracks where slug = 'data-analyst-fresher'");
check(Number(share.deterministic_share) >= 0.5, `deterministic_share recorded above the bar (${share.deterministic_share})`);
check(
  (await one("select tier from public.tracks where slug = 'data-analyst-fresher'")).tier === "verified",
  "and the tier is verified — the page and the homepage stop contradicting each other",
);

console.log("\n── the audit's codes are public; nothing key-shaped is ─────");
const spec = (await one(`
  select a.spec from public.assignments a
  join public.modules m on m.id = a.module_id
  join public.paths p on p.id = m.path_id
  join public.tracks t on t.id = p.track_id
  where t.slug = 'data-analyst-fresher' and p.version = 3 and m.week_no = 3`)).spec;
check(Array.isArray(spec.codes) && spec.codes.length === 11, `week 3 offers 11 candidate codes (${spec.codes?.length})`);
check(
  !("planted" in spec) && !("expected" in spec) && !JSON.stringify(spec).includes("rows_affected"),
  "the public spec carries codes only — nothing that separates planted from decoy",
);

console.log("\n── additive, idempotent ────────────────────────────────────");
const v1After = await snapshot(1);
const v2After = await snapshot(2);
check(
  v1After.weeks === v1Before.weeks && v1After.artifacts === v1Before.artifacts &&
  v2After.weeks === v2Before.weeks && v2After.artifacts === v2Before.artifacts,
  "versions 1 and 2 are untouched",
);
let reran = true;
try { await db.exec(v3sql); } catch (e) { reran = false; check(false, "re-running does not error", e.message); }
if (reran) {
  check(true, "re-running does not error");
  const again = await one(`
    select count(*)::int n from public.paths p join public.tracks t on t.id = p.track_id
    where t.slug = 'data-analyst-fresher'`);
  check(again.n === 3, `still exactly three versions (${again.n})`);
}

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
