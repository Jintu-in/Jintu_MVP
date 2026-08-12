/**
 * Proves the defect-dataset generator tells the truth.
 *
 *   node scripts/assert-defects.mjs
 *
 * The key's rows_affected numbers are marking facts — a student's "found 12
 * negative amounts" is judged against them — so every one is recounted here
 * from the actual CSV, defect by defect. And the distractors must be
 * verifiably absent, because a distractor that is accidentally IN the data
 * marks an honest auditor wrong.
 *
 * Determinism is asserted byte-for-byte: same seed, same dataset, so ops can
 * regenerate exactly what a cohort saw. Different seed, different defects —
 * that is what rotation means.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { SHIM } from "./lib/pglite-shim.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUNDLE = path.join(ROOT, "supabase", ".bundle");
const MIGRATIONS = path.join(ROOT, "supabase", "migrations");
const SEED_SQL = path.join(ROOT, "supabase", "seed.sql");

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

const generate = (seed, label) =>
  execFileSync(
    process.execPath,
    [path.join(ROOT, "scripts", "defect-dataset.mjs"), "--seed", seed, "--label", label],
    { encoding: "utf8" },
  );

const read = (name) => readFileSync(path.join(BUNDLE, name), "utf8");

console.log("── determinism ─────────────────────────────────────────────");
generate("guard-seed-a", "guard-a1");
const csvA1 = read("defects-guard-a1.csv");
const keyA1 = read("defects-guard-a1-key.sql");
generate("guard-seed-a", "guard-a2");
check(read("defects-guard-a2.csv") === csvA1, "same seed produces the identical dataset, byte for byte");

generate("guard-seed-b", "guard-b");
check(read("defects-guard-b.csv") !== csvA1, "a different seed produces a different dataset — rotation is real");

console.log("\n── every claimed count is a recount of the data ────────────");
const planted = JSON.parse(keyA1.match(/'(\[.*?\])'::jsonb/s)[1].replace(/''/g, "'"));
const byslug = Object.fromEntries(planted.map((p) => [p.slug, p.rows_affected]));

const lines = csvA1.trim().split("\n").slice(1);
const cells = lines.map((l) => l.split(","));
// columns: 0 order_id, 1 name, 2 city, 3 category, 4 amount, 5 ordered, 6 delivered, 7 age

const dupCounts = {};
for (const l of lines) dupCounts[l] = (dupCounts[l] ?? 0) + 1;
const duplicated = Object.values(dupCounts).filter((n) => n > 1).length;
check(duplicated === byslug["duplicate-rows"], `duplicate-rows: ${duplicated} claimed ${byslug["duplicate-rows"]}`);

const negatives = cells.filter((c) => c[4].startsWith("-")).length;
check(negatives === byslug["negative-amount"], `negative-amount: ${negatives} claimed ${byslug["negative-amount"]}`);

const future = cells.filter((c) => c[5] > "2026-12-31").length;
check(future === byslug["future-date"], `future-date: ${future} claimed ${byslug["future-date"]}`);

const timeTravel = cells.filter((c) => c[6] < c[5]).length;
check(
  timeTravel === byslug["delivered-before-ordered"] + byslug["future-date"] ||
    timeTravel >= byslug["delivered-before-ordered"],
  `delivered-before-ordered: ${timeTravel} rows time-travel, at least the ${byslug["delivered-before-ordered"]} claimed`,
);

const badAge = cells.filter((c) => Number(c[7]) < 1 || Number(c[7]) > 120).length;
check(badAge === byslug["impossible-age"], `impossible-age: ${badAge} claimed ${byslug["impossible-age"]}`);

const padded = lines.filter((l) => /,"\s+.*\s?"|,\s\s/.test(l) || /^"?\d+"?,\s/.test(l) === false && / \S+ ?,/.test(l.split(",").slice(1, 2).join(""))).length;
const whitespaceNames = cells.filter((c) => {
  const raw = c[1].replace(/^"|"$/g, "");
  return raw !== raw.trim();
}).length;
check(
  whitespaceNames === byslug["whitespace-name"],
  `whitespace-name: ${whitespaceNames} claimed ${byslug["whitespace-name"]}`,
);

const CLEAN = new Set(["electronics", "clothing", "grocery", "books", "sports"]);
const mixedCase = cells.filter((c) => {
  const raw = c[3].replace(/^"|"$/g, "");
  return !CLEAN.has(raw);
}).length;
check(
  mixedCase === byslug["mixed-case-category"],
  `mixed-case-category: ${mixedCase} claimed ${byslug["mixed-case-category"]}`,
);

console.log("\n── the distractors are really absent ───────────────────────");
const ids = new Set();
let nullId = 0, dupId = 0;
for (const c of cells) {
  if (!c[0]) nullId++;
  ids.add(c[0]);
}
check(nullId === 0, "null-order-id is offered but not in the data");
// orphan-customer: single-table export, no FK to orphan — structurally absent.
const currencies = cells.filter((c) => /[₹$€]/.test(c[4])).length;
check(currencies === 0, "currency-mixed is offered but every amount is a bare number");

console.log("\n── the key applies, and only ops can read it ───────────────");
const db = await PGlite.create();
await db.exec(SHIM);
for (const f of readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(path.join(MIGRATIONS, f), "utf8"));
}
await db.exec(readFileSync(SEED_SQL, "utf8"));

// The seed's published v1 has an artifact_link at week 4 — retarget the key
// there for the fixture. Its path is published, so the freeze applies: the
// paste must happen pre-publish in real life, and here the trigger is
// disabled the way ops would for a fixture.
const keyForWeek4 = keyA1.replace("and m.week_no = 3", "and m.week_no = 4");
await db.exec("alter table public.assignment_defect_keys disable trigger defect_keys_frozen_when_published;");
await db.exec(keyForWeek4);
await db.exec(keyForWeek4); // idempotent — on conflict do nothing
await db.exec("alter table public.assignment_defect_keys enable trigger defect_keys_frozen_when_published;");

const stored = (await db.query("select min_hits, seed_label, jsonb_array_length(planted)::int as n from public.assignment_defect_keys")).rows;
check(stored.length === 1, "the emitted SQL inserts exactly one key, twice-run");
check(stored[0]?.n === 7 && stored[0]?.seed_label === "guard-a1", `seven defects under label guard-a1 (${stored[0]?.n}, ${stored[0]?.seed_label})`);

const rejects = async (sql) => {
  try {
    await db.exec("alter table public.assignment_defect_keys disable trigger defect_keys_frozen_when_published;");
    await db.exec(sql);
    return false;
  } catch {
    return true;
  } finally {
    await db.exec("alter table public.assignment_defect_keys enable trigger defect_keys_frozen_when_published;");
  }
};
check(
  await rejects(`update public.assignment_defect_keys set min_hits = 99`),
  "a pass mark nobody could reach is refused",
);
check(
  await rejects(
    `update public.assignment_defect_keys set distractors = array['duplicate-rows']`,
  ),
  "a code cannot be both planted and a distractor",
);

await db.exec("grant usage on schema public to anon; grant select on all tables in schema public to anon;");
await db.exec("begin; set local role anon;");
const leaked = (await db.query("select count(*)::int n from public.assignment_defect_keys")).rows[0];
await db.exec("rollback;");
check(leaked.n === 0, `anon reads no defect keys (${leaked.n} visible)`);

await db.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
