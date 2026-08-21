/**
 * The day number appears exactly once, everywhere.
 *
 * It lives in `nodes.position` and every surface renders it from there, so
 * a stored title that also begins "Day 3 — " prints it twice. That is how
 * "Day 3 · Day 3 — Reading a dataset before you touch it" happened: the
 * data-analyst spec carried the prefix, the import faithfully stored it,
 * and four surfaces doubled it at once.
 *
 * Three layers had to change, and this checks all three — the database
 * (migration + CHECK), the source specs, and the import kit that turns one
 * into the other. Fixing only the database means the next re-import brings
 * it straight back.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..", "..", "..");
const SRC = join(here, "..", "src");

const migration = readFileSync(
  join(ROOT, "supabase", "migrations", "0014_strip_day_prefix.sql"),
  "utf8",
);
const importKit = readFileSync(join(ROOT, "scripts", "import-roadmap.mjs"), "utf8");
const roadmapPage = readFileSync(
  join(SRC, "components", "roadmap", "roadmap-page.tsx"),
  "utf8",
);

const PREFIX = /title: "Day \d+ [—·-] /;

test("no roadmap spec carries the prefix any more", () => {
  const specs = join(ROOT, "docs", "roadmaps");
  const offenders = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".mjs") && PREFIX.test(readFileSync(p, "utf8"))) offenders.push(e.name);
    }
  };
  walk(specs);
  assert.deepEqual(offenders, [], `these specs restate the day number: ${offenders.join(", ")}`);
});

test("the import kit refuses a title that restates the number", () => {
  assert.match(importKit, /\^Day\\s\+\\d\+/, "no guard on node titles");
  assert.match(importKit, /drop the "Day N" prefix/);
});

test("the migration strips existing titles and stops them returning", () => {
  assert.match(migration, /update public\.nodes/);
  assert.match(migration, /regexp_replace\(title, '\^Day/);
  // A one-off UPDATE without the constraint would be undone by the next
  // import that predates the guard.
  assert.match(migration, /add constraint nodes_title_carries_no_day_number/);
  assert.match(migration, /check \(title !~/);
});

test("the migration is safe to run twice", () => {
  assert.match(migration, /where title ~ '\^Day/, "the UPDATE should be filtered");
  assert.match(migration, /exception when duplicate_object then null/);
});

test("the roadmap shows its day count once at every width", () => {
  // The desktop-only sticky bar that carried the second copy is gone — the
  // shared SiteNav replaced it. One count survives, and it must not be
  // breakpoint-gated, or the width its twin used to cover loses the number.
  const uses = [...roadmapPage.matchAll(/progress\.daysCount/g)];
  assert.equal(uses.length, 1, "expected exactly one count, in the card");
  const card = /text-\[15px\] leading-\[1\.4\] text-ink-900">/.test(roadmapPage);
  assert.ok(card, "the card count should render at every width");
  assert.ok(
    !/text-\[15px\] leading-\[1\.4\] text-ink-900 lg:hidden/.test(roadmapPage),
    "the surviving count must not be hidden at any breakpoint",
  );
});
