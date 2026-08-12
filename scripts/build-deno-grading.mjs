/**
 * Mirrors packages/grading/src into supabase/functions/_shared/grading with
 * explicit .ts extensions on relative imports — the one thing Deno requires
 * and tsc refuses (allowImportingTsExtensions conflicts with emitting
 * declarations).
 *
 *   node scripts/build-deno-grading.mjs           # write the mirror
 *   node scripts/build-deno-grading.mjs --check   # fail if the mirror drifts
 *
 * The trade-off, stated once: the extensionless source stays the single
 * source of truth (Next/tsc consume it directly, as apps/web already does),
 * and Deno gets this generated copy. A generated copy can go stale, so
 * --check runs in CI and fails the build the moment src and mirror disagree.
 * No bundler, no new dependency — the transform is a regex over relative
 * import specifiers, which the smoke test then actually executes.
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "packages", "grading", "src");
const OUT = path.join(ROOT, "supabase", "functions", "_shared", "grading");

const HEADER = `// GENERATED from packages/grading/src by scripts/build-deno-grading.mjs.
// Do not edit: edit the package source and re-run the build. CI fails on drift.
`;

/** Relative specifiers gain .ts; bare (package) specifiers are left alone —
 *  the package has none, and the purity guard keeps it that way. */
const addExtensions = (code) =>
  code.replace(
    /(from\s+|import\s*\(\s*)(["'])(\.{1,2}\/[^"']+)\2/g,
    (whole, lead, quote, spec) =>
      spec.endsWith(".ts") ? whole : `${lead}${quote}${spec}.ts${quote}`,
  );

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) yield p;
  }
}

const expected = new Map();
for (const file of walk(SRC)) {
  const rel = path.relative(SRC, file).split(path.sep).join("/");
  expected.set(rel, HEADER + addExtensions(readFileSync(file, "utf8")));
}

if (process.argv.includes("--check")) {
  const problems = [];
  for (const [rel, want] of expected) {
    const target = path.join(OUT, rel);
    if (!existsSync(target)) problems.push(`missing: ${rel}`);
    else if (readFileSync(target, "utf8") !== want) problems.push(`stale: ${rel}`);
  }
  if (existsSync(OUT)) {
    for (const file of walk(OUT)) {
      const rel = path.relative(OUT, file).split(path.sep).join("/");
      if (!expected.has(rel)) problems.push(`orphan: ${rel}`);
    }
  }
  if (problems.length) {
    console.error("Deno grading mirror is out of date:\n  " + problems.join("\n  "));
    console.error("Run: node scripts/build-deno-grading.mjs");
    process.exit(1);
  }
  console.log(`Deno grading mirror is fresh (${expected.size} files).`);
} else {
  rmSync(OUT, { recursive: true, force: true });
  for (const [rel, content] of expected) {
    const target = path.join(OUT, rel);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  console.log(`Wrote ${expected.size} files to supabase/functions/_shared/grading.`);
}
