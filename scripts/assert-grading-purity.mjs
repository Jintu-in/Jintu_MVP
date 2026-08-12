/**
 * The grading package's one architectural rule, enforced: comparison is
 * pure, execution is not. The package must run unchanged in Node and Deno,
 * which means NO Node built-ins, no filesystem, no process, no Buffer —
 * fetch and the language, nothing else.
 *
 *   node scripts/assert-grading-purity.mjs
 *
 * Also checks the generated Deno mirror is fresh, because a pure package
 * with a stale mirror still breaks the Deno consumer.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "packages", "grading", "src");

// Each entry: the forbidden pattern and what reaching for it usually means.
// The node: pattern is scoped to import specifiers on purpose: a bare /node:/
// flags `(node: unknown)` type annotations and even the comment stating this
// rule — both hit on the first run of this guard.
const FORBIDDEN = [
  [/(?:from\s+|import\s*\(\s*|import\s+)['"]node:/, "a node: builtin import"],
  [/\brequire\s*\(/, "CommonJS require()"],
  [/from\s+['"]fs['"]/, "the filesystem"],
  [/from\s+['"]path['"]/, "the path module"],
  [/\bprocess\./, "process (env, cwd, exit)"],
  [/__dirname/, "__dirname"],
  [/\bBuffer\b/, "Buffer"],
];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.name.endsWith(".ts")) yield p;
  }
}

let failures = 0;
let files = 0;
for (const file of walk(SRC)) {
  files++;
  const code = readFileSync(file, "utf8");
  const lines = code.split("\n");
  for (const [pattern, meaning] of FORBIDDEN) {
    lines.forEach((line, i) => {
      if (pattern.test(line)) {
        failures++;
        console.error(
          `IMPURE  ${path.relative(ROOT, file)}:${i + 1} uses ${meaning}: ${line.trim()}`,
        );
      }
    });
  }
}

if (failures) {
  console.error(
    `\n${failures} impurity(ies). This package runs in Deno edge functions; ` +
      "anything impure belongs in an adapter that writes submission.facts.",
  );
  process.exit(1);
}
console.log(`packages/grading/src is runtime-pure (${files} files, ${FORBIDDEN.length} patterns).`);

// A pure package with a stale Deno mirror still breaks the Deno consumer.
execFileSync(process.execPath, [path.join(ROOT, "scripts", "build-deno-grading.mjs"), "--check"], {
  stdio: "inherit",
});
