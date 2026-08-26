/**
 * The licence map and the schema agree, and nothing links to an unclassified
 * host.
 *
 *   node scripts/assert-licences.mjs
 *
 * Four lists have to say the same thing, and they live in four files:
 *
 *   scripts/lib/licenses.mjs   LICENSES  — the vocabulary
 *   scripts/lib/licenses.mjs   REUSABLE  — which of them permit reuse
 *   migration 0023             the CHECK — the same vocabulary, in the database
 *   migration 0023             may_reuse — the same reusable set, generated
 *
 * They drift silently. A licence added to the map but not the CHECK fails the
 * paste, not the build; a licence added to REUSABLE but not to may_reuse means
 * the code and the database disagree about whether something may be quoted,
 * which is the disagreement with a legal consequence.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";
import { BY_HOST, LICENSES, REUSABLE, licenseForUrl } from "./lib/licenses.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
const fail = (m) => {
  console.log(`  FAIL  ${m}`);
  failures++;
};

// ── 1. the vocabulary matches the CHECK ─────────────────────────────────────
console.log("── the map and the schema agree ──");
const sql = readFileSync(path.join(ROOT, "supabase", "migrations", "0023_resource_licences.sql"), "utf8");
const inCheck = [...sql.matchAll(/'([a-z0-9-]+)',?\s*(?:--[^\n]*)?\n/g)]
  .map((m) => m[1])
  .filter((v) => LICENSES.includes(v) || /^(cc|public|permissive|proprietary|unknown)/.test(v));
for (const l of LICENSES) {
  if (!sql.includes(`'${l}'`)) fail(`licence "${l}" is in LICENSES but not in the CHECK`);
}
if (failures === 0) console.log(`  ok    all ${LICENSES.length} licences appear in the CHECK`);

const generated = /generated always as \(\s*license in \(([^)]*)\)/s.exec(sql)?.[1] ?? "";
const genSet = new Set([...generated.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]));
const same =
  genSet.size === REUSABLE.size && [...REUSABLE].every((l) => genSet.has(l));
if (!same)
  fail(
    `REUSABLE is {${[...REUSABLE].sort()}} but may_reuse is generated from {${[...genSet].sort()}} — the code and the database disagree about what may be quoted`,
  );
else console.log(`  ok    may_reuse is generated from exactly the ${REUSABLE.size} reusable licences`);

// ── 2. every host a spec links to is classified ─────────────────────────────
console.log("\n── every linked host is classified ──");
const specs = readdirSync(path.join(ROOT, "docs", "roadmaps")).filter((f) => f.endsWith(".mjs"));
const unclassified = new Map();
let total = 0;
let reusable = 0;
const mix = {};
for (const f of specs) {
  const spec = (await import(pathToFileURL(path.join(ROOT, "docs", "roadmaps", f)).href)).default;
  for (const m of spec.modules) {
    for (const n of m.nodes) {
      for (const r of n.resources) {
        total++;
        const found = r.license ? { license: r.license } : licenseForUrl(r.url);
        if (!found) {
          const host = new URL(r.url).hostname.replace(/^www\./, "");
          unclassified.set(host, (unclassified.get(host) ?? 0) + 1);
          continue;
        }
        mix[found.license] = (mix[found.license] ?? 0) + 1;
        if (REUSABLE.has(found.license)) reusable++;
      }
    }
  }
}
for (const [host, n] of unclassified) {
  fail(`${host} (${n} link${n > 1 ? "s" : ""}) is not in the licence map`);
}
if (unclassified.size === 0) console.log(`  ok    all ${total} links across ${specs.length} specs resolve to a licence`);

// ── 3. what the corpus actually is ──────────────────────────────────────────
console.log("\n── the corpus ──");
for (const [l, n] of Object.entries(mix).sort((a, b) => b[1] - a[1]))
  console.log(`    ${String(n).padStart(4)}  ${l}${REUSABLE.has(l) ? "  (reusable)" : ""}`);
console.log(`\n    ${reusable} of ${total} links (${Math.round((reusable / total) * 100)}%) may be quoted or adapted with attribution.`);
console.log("    The rest may be linked and never quoted, which is what this product does anyway.");

// ── 4. nothing in the map is unrecorded ─────────────────────────────────────
console.log("\n── every entry says how it was established ──");
const noBasis = Object.entries(BY_HOST).filter(([, v]) => !v.basis);
if (noBasis.length) fail(`${noBasis.length} entr(y|ies) with no basis: ${noBasis.map(([h]) => h).join(", ")}`);
else {
  const verified = Object.values(BY_HOST).filter((v) => v.basis.startsWith("stated")).length;
  console.log(
    `  ok    ${Object.keys(BY_HOST).length} hosts, ${verified} with a stated licence, ${Object.keys(BY_HOST).length - verified} defaulted to restrictive`,
  );
}

console.log(`\n${failures === 0 ? "Licence rules hold." : `${failures} failure(s).`}`);
process.exit(failures === 0 ? 0 : 1);
