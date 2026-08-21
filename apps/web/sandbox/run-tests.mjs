/**
 * Runs every suite in this directory.
 *
 *   pnpm --filter @jintu/web test
 *
 * Discovery plus a manifest, because each alone has a hole. `node --test
 * sandbox/` on its own exits 0 when it finds nothing at all — verified, not
 * assumed — so a merge that dropped every test file would report a green test
 * run. A hand-written list alone means a new suite silently never runs until
 * someone remembers to wire it up, which has already happened three times in
 * this repo to other guards.
 *
 * So: REQUIRED is the floor and discovery is the ceiling. A suite that lands
 * here runs automatically; a suite that disappears is a hard failure. Two
 * branches each adding a required suite will conflict on the list below — that
 * conflict is the point, and resolving it means keeping both lines.
 */

import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/** Suites that must exist. Add a line when a suite becomes load-bearing. */
const REQUIRED = ["retry.test.mjs", "initials.test.mjs", "dashboard-state.test.mjs", "export-completeness.test.mjs", "saved-queue.test.mjs", "day-number.test.mjs", "node-reader.test.mjs", "catalogue-filters.test.mjs", "site-nav.test.mjs"];

const found = readdirSync(here).filter((f) => f.endsWith(".test.mjs"));

const missing = REQUIRED.filter((f) => !found.includes(f));
if (missing.length) {
  console.error(
    `Required test suite(s) missing from apps/web/sandbox: ${missing.join(", ")}\n` +
      "A merge probably dropped the file. Restore it rather than editing REQUIRED.",
  );
  process.exit(1);
}

if (!found.length) {
  console.error("No test suites found in apps/web/sandbox.");
  process.exit(1);
}

console.log(`Running ${found.length} suite(s): ${found.join(", ")}\n`);

const result = spawnSync(
  process.execPath,
  ["--test", ...found.map((f) => join(here, f))],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);
