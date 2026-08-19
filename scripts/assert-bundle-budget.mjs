/**
 * The first-load JS budget, reported on every run and enforced on a node
 * page.
 *
 *   pnpm bundle:budget
 *
 * Why this reads the build output rather than the build log: Next 16 with
 * Turbopack no longer prints the per-route size table, and
 * `app-build-manifest.json` — which used to map a route to its chunks — is
 * not emitted either. Verified, not assumed. So the number is computed
 * from the files themselves.
 *
 * What is measured, precisely, so nobody reads more into it than it says:
 *
 *   SHARED    the entrypoint every page loads (rootMainFiles + polyfills),
 *             gzipped. This is the floor for every route, and in practice
 *             it dominates first-load JS on this site.
 *   ROUTE     the largest single additional client chunk, gzipped. Without
 *             a route→chunk map this is an upper bound on what one page
 *             adds, not an exact attribution — and it is labelled as such.
 *
 * The budget is enforced against SHARED + ROUTE, which is the pessimistic
 * reading. A budget that flatters itself is not a budget.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NEXT = path.join(ROOT, "apps", "web", ".next");
const BUDGET_KB = Number(process.env.BUNDLE_BUDGET_KB ?? 130);

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;
const gzipOf = (file) => {
  try {
    return gzipSync(readFileSync(file)).length;
  } catch {
    return 0;
  }
};

let manifest;
try {
  manifest = JSON.parse(readFileSync(path.join(NEXT, "build-manifest.json"), "utf8"));
} catch {
  console.error(
    "No build output found. Run `pnpm build` first — this reads apps/web/.next.",
  );
  process.exit(1);
}

// ── shared: what every page pays before it renders anything of its own ──────
const sharedFiles = [
  ...(manifest.rootMainFiles ?? []),
  ...(manifest.polyfillFiles ?? []),
].filter((f) => f.endsWith(".js"));

let shared = 0;
for (const f of sharedFiles) shared += gzipOf(path.join(NEXT, f));

// ── route: the largest client chunk that is not already in shared ───────────
const chunkDir = path.join(NEXT, "static", "chunks");
const sharedSet = new Set(sharedFiles.map((f) => path.basename(f)));
let biggest = { name: "(none)", size: 0 };
let chunkCount = 0;

const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(p);
      continue;
    }
    // main-*.js is the PAGES-router entry. No App Router page loads it,
    // so counting it as a route chunk overstates the worst case by ~100 KB.
    if (!e.name.endsWith(".js") || sharedSet.has(e.name)) continue;
    if (/^main-[a-f0-9]+.js$/.test(e.name)) continue;
    chunkCount++;
    const size = gzipOf(p);
    if (size > biggest.size) biggest = { name: path.relative(NEXT, p), size };
  }
};
try {
  if (statSync(chunkDir).isDirectory()) walk(chunkDir);
} catch {
  /* no chunks directory — a build with no client JS at all */
}

const worst = shared + biggest.size;

// ── the report, printed whether it passes or fails ──────────────────────────
console.log("First-load JS, gzipped");
console.log(`  shared entrypoint      ${kb(shared)} KB   (${sharedFiles.length} files)`);
console.log(`  largest route chunk    ${kb(biggest.size)} KB   ${biggest.name}`);
console.log(`  worst-case first load  ${kb(worst)} KB`);
console.log(`  budget                 ${BUDGET_KB} KB`);
console.log(`  scanned                ${chunkCount} route chunks`);
console.log(
  "\n  Turbopack emits no route→chunk map, so the route figure is the\n" +
    "  largest single chunk: an upper bound on what one page adds, not an\n" +
    "  exact attribution. The budget is checked against the pessimistic sum.",
);

if (worst > BUDGET_KB * 1024) {
  console.error(
    `\nFAIL  worst-case first load is ${kb(worst)} KB, over the ${BUDGET_KB} KB budget by ${kb(worst - BUDGET_KB * 1024)} KB.\n` +
      "      A node page is opened on a metered connection on a mid-range phone.\n" +
      "      Either drop the weight or raise BUNDLE_BUDGET_KB deliberately, in a commit.",
  );
  process.exit(1);
}

console.log(`\nOK  ${kb(worst)} KB of ${BUDGET_KB} KB.`);
