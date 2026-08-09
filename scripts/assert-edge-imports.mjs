/**
 * Checks that every module an edge function imports can actually be resolved
 * by Deno.
 *
 *   node scripts/assert-edge-imports.mjs
 *
 * Deno resolves nothing without a file extension. The rest of this repo is
 * deliberately extensionless — `moduleResolution: "bundler"` plus Turbopack,
 * see the note in @jintu/contracts index.ts — so a shared package written in
 * the house style is a package Deno cannot load, and §2's whole premise is
 * that packages/grading and packages/notify load in both.
 *
 * That bug reached CI once and was caught by `supabase start` failing with
 * "failed to read file: open packages/notify/src/webhook". Which is fine,
 * except that job needs Docker, runs for minutes, and pulls half a registry
 * before it gets there. This walks the import graph statically instead and
 * fails in milliseconds, in the job that everyone actually watches.
 *
 * It is deliberately not a bundler. It answers one question — does this
 * specifier name a file that exists — because that is the question that keeps
 * being answered wrongly.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FUNCTIONS = path.join(ROOT, "supabase", "functions");

/** `import x from "y"`, `export … from "y"`, and the dynamic form. */
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(\s*)["']([^"']+)["']/g;

const problems = [];
const visited = new Set();
let checked = 0;

function resolveFrom(file, specifier) {
  const dir = path.dirname(file);
  const target = path.resolve(dir, specifier);
  return target;
}

function walk(file, importedBy) {
  if (visited.has(file)) return;
  visited.add(file);
  checked++;

  let source;
  try {
    source = readFileSync(file, "utf8");
  } catch {
    problems.push(
      `${path.relative(ROOT, importedBy ?? file)} imports ${path.relative(ROOT, file)}, which does not exist`,
    );
    return;
  }

  for (const [, specifier] of source.matchAll(SPECIFIER)) {
    // Bare specifiers are npm:/jsr:/https: or an import map's business, not
    // ours. Only relative paths are resolved against the filesystem, and only
    // those can be wrong in the way this guard exists to catch.
    if (!specifier.startsWith(".")) continue;

    if (!/\.(ts|tsx|js|mjs|json)$/.test(specifier)) {
      problems.push(
        `${path.relative(ROOT, file)} imports "${specifier}" with no file extension — ` +
          `Deno will not resolve it. Write "${specifier}.ts".`,
      );
      continue;
    }

    const target = resolveFrom(file, specifier);
    if (!existsSync(target)) {
      problems.push(
        `${path.relative(ROOT, file)} imports "${specifier}", which resolves to ` +
          `${path.relative(ROOT, target)} — no such file`,
      );
      continue;
    }

    walk(target, file);
  }
}

if (!existsSync(FUNCTIONS)) {
  console.log("No supabase/functions yet — nothing to check.");
  process.exit(0);
}

const entrypoints = readdirSync(FUNCTIONS)
  .filter((name) => statSync(path.join(FUNCTIONS, name)).isDirectory())
  .map((name) => path.join(FUNCTIONS, name, "index.ts"))
  .filter((file) => existsSync(file));

if (entrypoints.length === 0) {
  console.log("No function entrypoints found.");
  process.exit(0);
}

for (const entry of entrypoints) walk(entry, null);

console.log(
  `Checked ${checked} module(s) reachable from ${entrypoints.length} edge function entrypoint(s).`,
);

if (problems.length > 0) {
  console.error(`\n${problems.length} unresolvable import(s):\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error(
    "\nDeno needs the extension in the specifier. A package shared with an edge",
  );
  console.error("function cannot use the extensionless style the web app uses.");
  process.exit(1);
}

console.log("Every edge function import resolves.");
