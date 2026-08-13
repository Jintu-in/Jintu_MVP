/**
 * Proves the roadmap import pipeline holds its two promises.
 *
 *   node scripts/assert-import.mjs
 *
 * Promise 1 (rule 2, CLAUDE.md): an UNCHECKED import cannot reach the public.
 * The default paste leaves the roadmap draft with every resource
 * needs_verification = true, and anon sees nothing.
 *
 * Promise 2: a checked import serves the whole tree to anon, with counts
 * matching the spec exactly, and re-pasting is deterministic.
 *
 * Uses --assume-checked for the publish path because CI must not depend on
 * nineteen third-party sites being up; the real --check path is exercised by
 * a human before every real paste, and the paste header records the mode.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SPEC_PATH = path.join(ROOT, "docs", "roadmaps", "data-analyst.mjs");

let passed = 0;
const failures = [];
const check = (ok, label, detail) => {
  if (ok) { passed++; console.log(`  ok    ${label}`); }
  else { failures.push(label); console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`); }
};

const spec = (await import(pathToFileURL(SPEC_PATH).href)).default;
const specCounts = {
  modules: spec.modules.length,
  nodes: spec.modules.reduce((a, m) => a + m.nodes.length, 0),
  resources: spec.modules.reduce((a, m) => a + m.nodes.reduce((b, n) => b + n.resources.length, 0), 0),
};

const gen = (...flags) =>
  execFileSync(process.execPath, [path.join(ROOT, "scripts", "import-roadmap.mjs"), SPEC_PATH, ...flags], {
    encoding: "utf8",
    maxBuffer: 33554432,
  });

const db = await PGlite.create();
await db.exec(SHIM);
for (const f of readdirSync(path.join(ROOT, "supabase", "migrations")).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(path.join(ROOT, "supabase", "migrations", f), "utf8"));
}

const one = async (q) => (await db.query(q)).rows[0];
const asAnon = async (q) => {
  await db.exec("begin; set local role anon;");
  try { return (await db.query(q)).rows; } finally { await db.exec("commit;"); }
};

console.log("── promise 1: unchecked cannot reach the public ────────────");
await db.exec(gen());
const draft = await one(`select status from public.roadmaps where slug = '${spec.slug}'`);
check(draft?.status === "draft", `unchecked import stays draft (${draft?.status})`);
const unverified = await one(
  `select count(*)::int n from public.resources where needs_verification`,
);
check(unverified.n === specCounts.resources, `every resource lands needs_verification (${unverified.n}/${specCounts.resources})`);
check((await asAnon("select 1 from public.roadmaps")).length === 0, "anon sees nothing");

console.log("\n── promise 2: a checked import serves the whole tree ───────");
await db.exec(gen("--assume-checked"));
const pub = await one(`
  select r.status,
    (select count(*)::int from public.modules where roadmap_id = r.id) modules,
    (select count(*)::int from public.nodes n join public.modules m on m.id = n.module_id where m.roadmap_id = r.id) nodes,
    (select count(*)::int from public.resources res join public.nodes n on n.id = res.node_id
      join public.modules m on m.id = n.module_id where m.roadmap_id = r.id) resources
  from public.roadmaps r where r.slug = '${spec.slug}'`);
check(pub?.status === "published", `checked import publishes (${pub?.status})`);
check(
  pub?.modules === specCounts.modules && pub?.nodes === specCounts.nodes && pub?.resources === specCounts.resources,
  `counts match the spec (${pub?.modules}m/${pub?.nodes}n/${pub?.resources}r)`,
);
check(
  (await one("select count(*)::int n from public.resources where needs_verification")).n === 0,
  "nothing needs verification after a checked import",
);
check(
  (await asAnon(`select slug from public.roadmaps where slug = '${spec.slug}'`)).length === 1 &&
  (await asAnon("select 1 from public.resources")).length === specCounts.resources,
  "anon reads the full tree without an account",
);
// The metered-data rule bites on EMBEDDABLE videos: a specific video has a
// knowable cost and must declare it. A channel pointer ("search this channel
// for the current best version") has no single duration — demanding one
// would force a fabricated number, which is the worse failure.
const sized = await one(
  `select count(*)::int n from public.resources
   where youtube_video_id is not null and (duration_sec is null or est_size_mb is null)`,
);
check(sized.n === 0, "every embeddable video carries duration and estimated size");

console.log("\n── deterministic re-paste ──────────────────────────────────");
await db.exec(gen("--assume-checked"));
const again = await one(`
  select (select count(*)::int from public.roadmaps where slug = '${spec.slug}') roadmaps,
         (select count(*)::int from public.resources) resources`);
check(again.roadmaps === 1 && again.resources === specCounts.resources, `re-paste keeps exactly one copy (${again.roadmaps}/${again.resources})`);

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
