/**
 * Proves a generated track publishes, completely, twice.
 *
 *   pnpm track:verify docs/tracks/my-track.mjs
 *
 * Runs the generator, applies the real migrations + seed + YOUR track's SQL
 * in real Postgres (PGlite) — twice, because the file will be pasted into
 * the SQL editor by a person, quite possibly more than once. Asserts the
 * platform's standing promises against it: every week has resources, every
 * artifact a rubric, every sql artifact a key, anon reads no keys, prior
 * published versions untouched, re-running a no-op.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const specPath = process.argv[2];
if (!specPath) {
  console.error("Usage: pnpm track:verify docs/tracks/<name>.mjs");
  process.exit(1);
}
const spec = (await import(pathToFileURL(path.resolve(specPath)).href)).default;

execFileSync(process.execPath, [path.join(ROOT, "scripts", "generate-track.mjs"), specPath], {
  stdio: "inherit",
});
const sql = readFileSync(
  path.join(ROOT, "supabase", ".bundle", `track-${spec.slug}-v${spec.version}.sql`),
  "utf8",
);

let passed = 0;
const failures = [];
const check = (ok, label, detail) => {
  if (ok) { passed++; console.log(`  ok    ${label}`); }
  else { failures.push(label); console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`); }
};

const db = await PGlite.create();
await db.exec(SHIM);
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");
for (const f of readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(path.join(MIGRATIONS, f), "utf8"));
}
await db.exec(readFileSync(path.join(ROOT, "supabase", "seed.sql"), "utf8"));

const one = async (q, p = []) => (await db.query(q, p)).rows[0];
const priorPublished = (await one(
  "select count(*)::int n from public.paths p join public.tracks t on t.id = p.track_id where t.slug = $1 and p.status = 'published'",
  [spec.slug],
)).n;

console.log(`\n── first apply ─────────────────────────────────────────────`);
await db.exec(sql);

const stats = async () =>
  one(`
    select p.status,
      (select count(*)::int from public.modules where path_id = p.id) weeks,
      (select count(*)::int from public.resources r join public.modules m on m.id = r.module_id where m.path_id = p.id) resources,
      (select count(*)::int from public.assignments a join public.modules m on m.id = a.module_id where m.path_id = p.id) artifacts,
      (select count(*)::int from public.assignments a join public.modules m on m.id = a.module_id where m.path_id = p.id and a.rubric_id is null) unrubriced,
      (select count(*)::int from public.daily_reps dr join public.modules m on m.id = dr.module_id where m.path_id = p.id) reps,
      (select count(*)::int from public.assignment_answer_keys k join public.assignments a on a.id = k.assignment_id
        join public.modules m on m.id = a.module_id where m.path_id = p.id) keys
    from public.paths p join public.tracks t on t.id = p.track_id
    where t.slug = $1 and p.version = $2`, [spec.slug, spec.version]);

const s = await stats();
const wantReps = spec.weeks.reduce((n, w) => n + (w.reps?.length ?? 0), 0);
const wantKeys = spec.weeks.filter((w) => w.artifact.kind === "sql").length;

check(s?.status === "published", `version ${spec.version} is published (${s?.status})`);
check(s?.weeks === spec.weeks.length, `${spec.weeks.length} weeks (${s?.weeks})`);
check(s?.artifacts === spec.weeks.length, `an artifact every week (${s?.artifacts})`);
check(s?.unrubriced === 0, `every artifact has a rubric (${s?.unrubriced} without)`);
check(s?.reps === wantReps, `${wantReps} daily reps (${s?.reps})`);
check(s?.keys === wantKeys, `${wantKeys} sql answer key(s) (${s?.keys})`);
const empty = await one(`
  select count(*)::int n from public.modules m
  join public.paths p on p.id = m.path_id join public.tracks t on t.id = p.track_id
  where t.slug = $1 and p.version = $2
    and not exists (select 1 from public.resources where module_id = m.id)`, [spec.slug, spec.version]);
check(empty.n === 0, `no week is left without resources (${empty.n} empty)`);

const live = await one(`
  select max(p.version)::int v from public.paths p
  join public.tracks t on t.id = p.track_id
  where t.slug = $1 and p.status = 'published'`, [spec.slug]);
check(live.v === spec.version, `the site would serve version ${live.v}`);

const noLeak = await db.query(`
  select a.spec from public.assignments a
  join public.modules m on m.id = a.module_id
  join public.paths p on p.id = m.path_id join public.tracks t on t.id = p.track_id
  where t.slug = $1 and p.version = $2 and a.kind = 'sql'`, [spec.slug, spec.version]);
check(
  noLeak.rows.every((r) => !("expected" in (r.spec ?? {})) && !("setup" in (r.spec ?? {}))),
  "no sql artifact publishes its answer in the public spec",
);

await db.exec("grant usage on schema public to anon; grant select on all tables in schema public to anon;");
await db.exec("begin; set local role anon;");
const leaked = await one("select count(*)::int n from public.assignment_answer_keys");
await db.exec("rollback;");
check(leaked.n === 0, `anon cannot read answer keys (${leaked.n} visible)`);

console.log(`\n── second apply (a person will paste this twice) ───────────`);
let reran = true;
try { await db.exec(sql); } catch (e) { reran = false; check(false, "re-running does not error", e.message); }
if (reran) {
  check(true, "re-running does not error");
  const again = await stats();
  check(
    again.weeks === s.weeks && again.resources === s.resources && again.artifacts === s.artifacts && again.reps === s.reps,
    "nothing was duplicated",
  );
}
const priorStill = (await one(
  "select count(*)::int n from public.paths p join public.tracks t on t.id = p.track_id where t.slug = $1 and p.status = 'published' and p.version < $2",
  [spec.slug, spec.version],
)).n;
check(priorStill === priorPublished, `prior published versions untouched (${priorStill})`);

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
