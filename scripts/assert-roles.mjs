/**
 * The roles layer's guard.
 *
 *   node scripts/assert-roles.mjs
 *
 * Role pages are prose, so almost nothing about them can be type-checked.
 * The two rules that matter are exactly the two a type cannot express, and
 * both decay silently as pages are edited:
 *
 *   1. EVERY PAGE ENDS SOMEWHERE. A role either routes into roadmaps that
 *      exist, or says honestly that we have not built one and names what to
 *      read instead. A role page that stops without routing anywhere is a
 *      blog post; one pointing at a renamed roadmap slug is worse, because
 *      it is a dead end that looks like a route.
 *
 *   2. NO SALARY NUMBERS. Figures vary by city, company and year, and one
 *      invented to look authoritative would be the least honest thing on a
 *      site whose entire pitch is that a person checked. Cite a dated
 *      source or say nothing.
 *
 * The content is TypeScript and Node 20 cannot import it, so it is
 * transpiled with the tsc this repo already depends on and required from a
 * temp directory. That step is NOT wrapped in a fallback that degrades to
 * "prose checks only": a guard that silently stops checking is a failure
 * this repo has had before, and it is worse than no guard because it still
 * reports success.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "apps", "web", "src", "content", "roles");
const ROADMAPS = path.join(ROOT, "docs", "roadmaps");

const failures = [];
const fail = (m) => failures.push(m);

const roadmapSlugs = new Set(
  readdirSync(ROADMAPS)
    .filter((f) => f.endsWith(".mjs"))
    .map((f) => f.replace(/\.mjs$/, "")),
);

const files = readdirSync(CONTENT).filter((f) => f.endsWith(".ts"));

// ── rule 2, over the prose ───────────────────────────────────────────────
// Deliberately broad — the point is that no figure reaches the page, not
// that one format is caught. A line citing a dated source is the one honest
// way to publish a range, so it is allowed.
const MONEY =
  /(₹\s?\d|Rs\.?\s?\d|\$\s?\d|\bINR\s?\d|\b\d+(\.\d+)?\s?(lakh|lakhs|crore|crores|LPA|CTC)\b|\b\d+\s?k\s?(per|\/)\s?(month|year|annum)\b)/i;
const CITED = /source:|as of \d{4}|survey \d{4}/i;

for (const file of files) {
  // Strip comments first: this guard's own documentation contains an example
  // figure, and a guard that trips on its own explanation is one people delete.
  const prose = readFileSync(path.join(CONTENT, file), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  prose.split("\n").forEach((line, i) => {
    if (MONEY.test(line) && !CITED.test(line)) {
      fail(`${file}:${i + 1}: salary figure — cite a dated source or say nothing\n      ${line.trim().slice(0, 110)}`);
    }
  });
}

// ── load the content for the structural rules ────────────────────────────
const outDir = mkdtempSync(path.join(os.tmpdir(), "jintu-roles-"));
let ROLES, COMPARISONS;
try {
  // tsc's own entrypoint, run through this node. Going via npx or the .bin
  // shim means a shell and a platform-specific extension, and the shim does
  // not resolve reliably on Windows from inside a workspace.
  const req0 = createRequire(import.meta.url);
  const tsc = req0.resolve("typescript/lib/tsc.js");
  execFileSync(
    process.execPath,
    [
      tsc,
      ...files.map((f) => path.join(CONTENT, f)),
      "--outDir",
      outDir,
      "--module",
      "commonjs",
      "--target",
      "es2022",
      "--skipLibCheck",
    ],
    { cwd: ROOT, stdio: "pipe" },
  );
  const req = createRequire(import.meta.url);
  ({ ROLES, COMPARISONS } = req(path.join(outDir, "index.js")));
} finally {
  rmSync(outDir, { recursive: true, force: true });
}

if (!Array.isArray(ROLES) || !Array.isArray(COMPARISONS)) {
  console.error("assert-roles: content did not load — refusing to report success");
  process.exit(1);
}

// ── rule 1, and the sections that make a page worth reading ──────────────
const slugs = new Set();
for (const r of ROLES) {
  if (slugs.has(r.slug)) fail(`duplicate role slug: ${r.slug}`);
  slugs.add(r.slug);

  if (r.startHere.kind === "roadmaps") {
    if (!r.startHere.picks.length) fail(`${r.slug}: startHere routes to no roadmap`);
    for (const p of r.startHere.picks) {
      if (!roadmapSlugs.has(p.slug)) {
        fail(`${r.slug}: routes to roadmap "${p.slug}", which is not in docs/roadmaps/`);
      }
      if (!p.note?.trim()) fail(`${r.slug}: roadmap ${p.slug} has no note saying why`);
    }
  } else {
    if (!r.startHere.readInstead.length) {
      fail(`${r.slug}: says no roadmap exists and names nothing to read — that is a dead end`);
    }
    if (!r.startHere.note?.trim()) fail(`${r.slug}: notYet without an explanation`);
  }

  if (r.typicalWeek.length < 4) fail(`${r.slug}: a typical week needs at least four entries`);
  if (r.whatItIsNot.length < 2) fail(`${r.slug}: needs at least two "what it is not" lines`);
  if (!r.whatIsHard?.trim()) fail(`${r.slug}: no honest paragraph about what is hard`);
  if (!r.skills.overrated.length) {
    fail(`${r.slug}: no overrated skills — the section readers cannot get elsewhere`);
  }
}

const comparisonSlugs = new Set(COMPARISONS.map((c) => c.slug));
for (const r of ROLES) {
  for (const n of r.whatItIsNot) {
    if (n.compare && !comparisonSlugs.has(n.compare)) {
      fail(`${r.slug}: links to comparison "${n.compare}", which does not exist`);
    }
  }
}
for (const c of COMPARISONS) {
  if (c.rows.length < 3) fail(`${c.slug}: a comparison needs at least three rows`);
  for (const row of c.rows) {
    if (row.role && !slugs.has(row.role)) {
      fail(`${c.slug}: row references role "${row.role}", which does not exist`);
    }
  }
  if (c.nuance.length < 2) fail(`${c.slug}: needs at least two paragraphs of nuance`);
}

if (failures.length) {
  console.error(`assert-roles: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}

const routed = ROLES.filter((r) => r.startHere.kind === "roadmaps").length;
console.error(
  `assert-roles: ${ROLES.length} roles (${routed} into roadmaps, ${ROLES.length - routed} honestly unbuilt), ` +
    `${COMPARISONS.length} comparisons, every route lands, no salary figures.`,
);
