/**
 * GlossaryKit's guard (design pack update 3 §C).
 *
 *   node scripts/assert-glossary.mjs
 *
 * Two things a type cannot express, both checked against the real roadmap
 * content, not a fixture:
 *
 *   1. ORDER. A term marked [[term]] in a lesson that comes before the
 *      lesson its own glossary entry names as taughtIn would send a reader
 *      to a popover about something they have not reached yet — the exact
 *      failure this repo calls "the Order lens" elsewhere.
 *   2. LENGTH. meaning is one line, 25 words at most (CHANGES.md) — a
 *      popover is not where a second paragraph belongs.
 *
 * apps/web/src/lib/glossary.ts is TypeScript and Node cannot import it
 * directly; same posture as scripts/assert-roles.mjs (see its own header
 * for why a text-regex fallback is refused, not just this guard's): it is
 * transpiled with the tsc this repo already depends on and required from
 * a temp directory, with no fallback that degrades to a weaker check.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WEB = path.join(ROOT, "apps", "web");
const GLOSSARY_FILE = path.join(WEB, "src", "lib", "glossary.ts");
const ROADMAPS = path.join(ROOT, "docs", "roadmaps");

const failures = [];
const fail = (m) => failures.push(m);

// ── load the registry ───────────────────────────────────────────────────
// glossary.ts has one `import type` from "@/lib/steps" (for the Rich/
// LessonStep shapes applyGlossary() works with) — type-only, erased from
// the emitted JS, but tsc still has to RESOLVE it during type-checking
// even so. A bare `tsc file.ts --module commonjs` has no idea what "@/"
// means (that mapping lives only in apps/web/tsconfig.json's `paths`,
// which the CLI has no flag for), so this writes a throwaway tsconfig
// carrying just that one mapping rather than compiling the whole app.
const outDir = mkdtempSync(path.join(os.tmpdir(), "jintu-glossary-"));
let REGISTRY;
try {
  const tempTsconfig = path.join(outDir, "tsconfig.json");
  writeFileSync(
    tempTsconfig,
    JSON.stringify({
      compilerOptions: {
        baseUrl: WEB,
        paths: { "@/*": [path.join(WEB, "src", "*")] },
        module: "commonjs",
        target: "es2022",
        moduleResolution: "node",
        skipLibCheck: true,
        outDir,
      },
      files: [GLOSSARY_FILE],
    }),
  );
  const req0 = createRequire(import.meta.url);
  const tsc = req0.resolve("typescript/lib/tsc.js");
  execFileSync(process.execPath, [tsc, "--project", tempTsconfig], { cwd: ROOT, stdio: "pipe" });
  const req = createRequire(import.meta.url);
  ({ REGISTRY } = req(path.join(outDir, "glossary.js")));
} finally {
  rmSync(outDir, { recursive: true, force: true });
}

if (!REGISTRY || typeof REGISTRY !== "object") {
  console.error("assert-glossary: REGISTRY did not load — refusing to report success");
  process.exit(1);
}

const roadmapSlugs = Object.keys(REGISTRY);
if (roadmapSlugs.length === 0) {
  console.log("assert-glossary: no roadmap has a glossary yet — nothing to check.");
  process.exit(0);
}

// ── validate each registered roadmap ────────────────────────────────────
for (const slug of roadmapSlugs) {
  const entries = REGISTRY[slug];
  const specPath = path.join(ROADMAPS, `${slug}.mjs`);
  const { default: spec } = await import(pathToFileURL(specPath).href).catch(() => ({ default: null }));
  if (!spec) {
    fail(`${slug}: has a glossary but docs/roadmaps/${slug}.mjs does not exist`);
    continue;
  }

  // One entry per node, in authored order, with the SAME prose fields
  // concatenated in the SAME order lib/steps.ts's buildLessonSteps()
  // actually renders them — whyToday, then challenge (but only when no
  // authoredSteps override it, same "authoredSteps replace the generic
  // challenge step" rule that file itself documents), then each check's
  // question and answer, then commonMistake.
  const nodes = spec.modules.flatMap((m) => m.nodes).map((n) => {
    const parts = [];
    if (n.whyToday) parts.push(n.whyToday);
    if (!(n.steps && n.steps.length > 0) && n.challenge) parts.push(n.challenge);
    for (const c of n.checks ?? []) {
      if (c.question) parts.push(c.question);
      if (c.answer) parts.push(c.answer);
    }
    if (n.commonMistake) parts.push(n.commonMistake);
    return { title: n.title, prose: parts.join(" \n ") };
  });

  const MARKER = /\[\[([^\]]+)\]\]/g;
  const firstUseNodeIndex = new Map(); // lowercased term -> node index

  for (let i = 0; i < nodes.length; i++) {
    let m;
    MARKER.lastIndex = 0;
    while ((m = MARKER.exec(nodes[i].prose))) {
      const key = m[1].trim().toLowerCase();
      if (!firstUseNodeIndex.has(key)) firstUseNodeIndex.set(key, i);
    }
  }

  for (const entry of entries) {
    const words = entry.meaning.trim().split(/\s+/).filter(Boolean);
    if (words.length > 25) {
      fail(`${slug}: "${entry.term}" — meaning is ${words.length} words, 25 is the limit`);
    }
    if (!entry.meaning.trim()) {
      fail(`${slug}: "${entry.term}" — meaning is empty`);
    }

    const taughtInIndex = nodes.findIndex((n) => n.title === entry.taughtIn);
    if (taughtInIndex === -1) {
      fail(`${slug}: "${entry.term}" — taughtIn "${entry.taughtIn}" matches no node title in docs/roadmaps/${slug}.mjs`);
      continue;
    }

    const names = [entry.term, ...(entry.aliases ?? [])].map((n) => n.toLowerCase());
    const firstUseIndex = names
      .map((n) => firstUseNodeIndex.get(n))
      .filter((i) => i !== undefined)
      .reduce((min, i) => (min === undefined || i < min ? i : min), undefined);

    if (firstUseIndex !== undefined && firstUseIndex < taughtInIndex) {
      fail(
        `${slug}: "${entry.term}" is used in "${nodes[firstUseIndex].title}" (lesson ${firstUseIndex + 1}) ` +
          `before it is taught in "${entry.taughtIn}" (lesson ${taughtInIndex + 1}) — the Order lens`,
      );
    }
  }
}

console.log(`assert-glossary: checked ${roadmapSlugs.length} roadmap(s) with a glossary.`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("Glossary rules hold.");
