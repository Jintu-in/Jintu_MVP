/**
 * Proves the Data Analyst v2 curriculum applies, publishes, and is re-runnable.
 *
 *   node scripts/test-data-analyst-v2.mjs
 *
 * Runs the real migrations, the real seed and the generated SQL inside PGlite,
 * twice. The second run is the point: this script is the thing someone will
 * paste into the Supabase SQL editor, quite possibly more than once, and the
 * standing requirement for these files is that re-running is a no-op rather
 * than a duplicate-key error.
 *
 * It also asserts what must NOT happen — that version 1 is left exactly as it
 * was. Publishing v2 has to be additive, because a student mid-sprint is
 * reading v1 and their submissions point at v1's assignment rows.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
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

for (const file of readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(path.join(MIGRATIONS, file), "utf8"));
}
await db.exec(readFileSync(SEED, "utf8"));

const sql = execFileSync(process.execPath, [path.join(ROOT, "scripts", "generate-data-analyst-v2.mjs")], {
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
});

const one = async (q) => (await db.query(q)).rows[0];

console.log("── before ──────────────────────────────────────────────────");
const before = await one(`
  select count(*)::int versions,
         (select count(*)::int from public.modules m
          join public.paths p on p.id = m.path_id
          join public.tracks t on t.id = p.track_id
          where t.slug = 'data-analyst-fresher' and p.version = 1) v1_modules
  from public.paths p join public.tracks t on t.id = p.track_id
  where t.slug = 'data-analyst-fresher'`);
check(before.versions === 1, `starts with one path version (${before.versions})`);

console.log("\n── first run ───────────────────────────────────────────────");
await db.exec(sql);

const v2 = async () =>
  one(`
    select p.status,
      (select count(*)::int from public.modules where path_id = p.id) modules,
      (select count(*)::int from public.resources r join public.modules m on m.id = r.module_id where m.path_id = p.id) resources,
      (select count(*)::int from public.assignments a join public.modules m on m.id = a.module_id where m.path_id = p.id) assignments,
      (select count(*)::int from public.assignments a join public.modules m on m.id = a.module_id where m.path_id = p.id and a.rubric_id is null) no_rubric
    from public.paths p join public.tracks t on t.id = p.track_id
    where t.slug = 'data-analyst-fresher' and p.version = 2`);

let r = await v2();
check(r.status === "published", `version 2 is published (${r.status})`);
check(r.modules === 6, `six weeks (${r.modules})`);
check(r.resources === 14, `fourteen resources (${r.resources})`);
check(r.assignments === 6, `an artifact every week (${r.assignments})`);
check(r.no_rubric === 0, `every artifact has a rubric (${r.no_rubric} without)`);

const empty = await one(`
  select count(*)::int n from public.modules m
  join public.paths p on p.id = m.path_id
  join public.tracks t on t.id = p.track_id
  where t.slug = 'data-analyst-fresher' and p.version = 2
    and not exists (select 1 from public.resources where module_id = m.id)`);
check(empty.n === 0, `no week is left without resources (${empty.n} empty)`);

// The whole reason v2 exists: the reader takes the highest published version.
const live = await one(`
  select p.version from public.paths p
  join public.tracks t on t.id = p.track_id
  where t.slug = 'data-analyst-fresher' and p.status = 'published'
  order by p.version desc limit 1`);
check(live.version === 2, `the site would serve version ${live.version}`);

const sqlSpecs = await db.query(`
  select a.spec from public.assignments a
  join public.modules m on m.id = a.module_id
  join public.paths p on p.id = m.path_id
  join public.tracks t on t.id = p.track_id
  where t.slug = 'data-analyst-fresher' and p.version = 2 and a.kind = 'sql'`);
check(sqlSpecs.rows.length === 2, `two auto-graded SQL assignments (${sqlSpecs.rows.length})`);
check(
  sqlSpecs.rows.every((row) => !("expected" in (row.spec ?? {})) && !("orderMatters" in (row.spec ?? {}))),
  "no SQL assignment publishes its answer in the public spec",
);

// The bug this replaced: expected rows were put in assignments.spec, which
// anon reads through the public curriculum. The answer key has its own
// service-role-only table precisely because assignments is public.
const keys = await db.query(`
  select k.setup, k.expected, k.order_matters
  from public.assignment_answer_keys k
  join public.assignments a on a.id = k.assignment_id
  join public.modules m on m.id = a.module_id
  join public.paths p on p.id = m.path_id
  join public.tracks t on t.id = p.track_id
  where t.slug = 'data-analyst-fresher' and p.version = 2`);
check(keys.rows.length === 2, `both SQL assignments have an answer key (${keys.rows.length})`);
check(
  keys.rows.every((r) => (r.expected?.rows?.length ?? 0) > 0 && (r.setup ?? "").includes("create table")),
  "each key carries a fixture and a non-empty expected result",
);

await db.exec("grant usage on schema public to anon; grant select on all tables in schema public to anon;");
await db.exec("begin; set local role anon;");
const leaked = await one("select count(*)::int n from public.assignment_answer_keys");
await db.exec("rollback;");
check(leaked.n === 0, `anon cannot read answer keys (${leaked.n} visible)`);

console.log("\n── v1 must be untouched ────────────────────────────────────");
const after1 = await one(`
  select count(*)::int n from public.modules m
  join public.paths p on p.id = m.path_id
  join public.tracks t on t.id = p.track_id
  where t.slug = 'data-analyst-fresher' and p.version = 1`);
check(after1.n === before.v1_modules, `version 1 still has ${before.v1_modules} modules (${after1.n})`);

console.log("\n── second run (idempotence) ────────────────────────────────");
let reran = true;
try {
  await db.exec(sql);
} catch (e) {
  reran = false;
  check(false, "re-running does not error", e.message);
}
if (reran) {
  check(true, "re-running does not error");
  const again = await v2();
  check(again.modules === 6 && again.resources === 14 && again.assignments === 6, "nothing was duplicated");
  const versions = await one(`
    select count(*)::int n from public.paths p join public.tracks t on t.id = p.track_id
    where t.slug = 'data-analyst-fresher'`);
  check(versions.n === 2, `still exactly two versions (${versions.n})`);
}

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
