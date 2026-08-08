/**
 * Fails the build if a banned outcome claim reaches user-facing text.
 * docs/LEGAL.md §3, ARCHITECTURE.md §7.
 *
 *   node scripts/assert-claims.mjs [dir ...]
 *
 * "guaranteed" is matched only near an outcome word, so a comment saying a
 * value is "guaranteed non-null" does not fail the build while "guaranteed
 * placement" does. The absolute phrases need no such qualification — there is
 * no innocent use of "100% placement".
 *
 * This cannot catch a misleading claim written in words we did not predict.
 * It catches the four phrases that have actually drawn enforcement in this
 * sector. Everything else is what review is for.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mdx", ".json"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".turbo", "dist", "coverage"]);

// Scanned by default: everything a student could read. docs/ is excluded
// because LEGAL.md necessarily quotes the banned phrases in order to ban them.
const DEFAULT_TARGETS = ["apps/web/src", "apps/web/public", "packages/notify"];

const ABSOLUTE = [
  { re: /100\s*%\s*placement/i, label: '"100% placement"' },
  { re: /\bjobs?\s+assured\b/i, label: '"job assured"' },
  { re: /\bplacements?\s+assured\b/i, label: '"placement assured"' },
  { re: /\bassured\s+(selection|placement|job|offer)\b/i, label: '"assured selection"' },
];

const OUTCOME_WORDS =
  /\b(job|jobs|placement|placements|offer|offers|hire|hired|hiring|selection|selected|package|salary|career|interview)\b/i;
const GUARANTEE = /\bguarantee(?:d|s|ing)?\b/gi;
const PROXIMITY = 80;

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out; // target not present yet — packages/notify arrives in Phase 2
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(path.extname(entry))) out.push(full);
  }
  return out;
}

const targets = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_TARGETS;
const files = targets.flatMap((t) => walk(path.resolve(ROOT, t)));
const violations = [];

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const lineOf = (i) => text.slice(0, i).split("\n").length;

  for (const { re, label } of ABSOLUTE) {
    const m = re.exec(text);
    if (m) violations.push({ file: rel, line: lineOf(m.index), found: label });
  }

  for (const m of text.matchAll(GUARANTEE)) {
    const window = text.slice(
      Math.max(0, m.index - PROXIMITY),
      m.index + m[0].length + PROXIMITY,
    );
    if (OUTCOME_WORDS.test(window))
      violations.push({
        file: rel,
        line: lineOf(m.index),
        found: `"${m[0]}" next to an outcome word`,
      });
  }
}

console.log(`Scanned ${files.length} file(s) in: ${targets.join(", ")}`);

if (violations.length) {
  console.error(`\n${violations.length} banned outcome claim(s):\n`);
  for (const v of violations) console.error(`  ${v.file}:${v.line}  ${v.found}`);
  console.error(
    "\nSee docs/LEGAL.md §3. Describe the process, not the outcome — and if the\n" +
      "claim is true and evidenced, it still needs document_verified rows and\n" +
      "written consent before it goes public.",
  );
  process.exit(1);
}

console.log("No banned outcome claims found.");
