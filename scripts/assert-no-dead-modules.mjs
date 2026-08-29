/**
 * Files nothing imports.
 *
 *   node scripts/assert-no-dead-modules.mjs
 *
 * A component that no longer renders anywhere is worse than clutter: it is a
 * second answer to a question the codebase has already answered. Somebody
 * greps for "the header", finds two, and edits the wrong one — which has
 * happened here, and is why site-header.tsx was deleted.
 *
 * Route files are entry points: Next imports page/layout/route/loading and
 * the rest by convention, so nothing in src will ever reference them.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "apps", "web", "src");
const norm = (p) => p.split(path.sep).join("/");

const walk = (d, out = []) => {
  for (const e of readdirSync(d)) {
    const f = path.join(d, e);
    if (statSync(f).isDirectory()) walk(f, out);
    else if (/\.tsx?$/.test(e) && !/\.d\.ts$/.test(e)) out.push(f);
  }
  return out;
};

const files = walk(SRC);
const imported = new Set();
for (const f of files) {
  const s = readFileSync(f, "utf8");
  for (const m of s.matchAll(/(?:from\s+"([^"]+)")|(?:import\("([^"]+)"\))/g)) {
    const spec = m[1] ?? m[2];
    if (!spec) continue;
    const p = spec.startsWith("@/")
      ? path.join(SRC, spec.slice(2))
      : spec.startsWith(".")
        ? path.resolve(path.dirname(f), spec)
        : null;
    if (!p) continue;
    const base = norm(p).replace(/\.(tsx?|css)$/, "");
    imported.add(base);
    // A specifier naming a directory resolves to its index, and nothing in
    // the tree will ever literally import ".../index". Without this an
    // index.ts is reported dead while every route depends on it — which is
    // a false positive, and a guard people learn to ignore is worse than no
    // guard at all.
    imported.add(`${base}/index`);
  }
}

/**
 * Next's file conventions. It imports these; nothing in src does.
 *
 * proxy.ts is Next 16's rename of middleware.ts — same convention, new name.
 * sw.ts is the service worker, wired through next.config.ts's swSrc rather
 * than by an import, so nothing in src will ever reference it.
 */
const ENTRY =
  /(^|\/)(page|layout|route|loading|error|not-found|template|default|global-error|opengraph-image|twitter-image|icon|apple-icon|sitemap|robots|manifest|middleware|proxy|sw|instrumentation(-client)?)\.tsx?$/;

const dead = files
  .filter((f) => !ENTRY.test(norm(f)))
  .filter((f) => {
    const k = norm(f).replace(/\.tsx?$/, "");
    return !imported.has(k) && !imported.has(`${k}/index`);
  });

if (dead.length === 0) {
  console.log("Every module is imported by something.");
  process.exit(0);
}

let lines = 0;
console.log(`${dead.length} module(s) imported by nothing:\n`);
for (const f of dead.sort()) {
  const n = readFileSync(f, "utf8").split("\n").length;
  lines += n;
  console.log(`  ${String(n).padStart(4)}  ${norm(path.relative(SRC, f))}`);
}
console.log(`\n  ${lines} lines. Delete them, or import them.`);
process.exit(1);
