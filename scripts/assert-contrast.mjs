/**
 * Fails the build when a colour token is used somewhere it is not legible.
 *
 *   node scripts/assert-contrast.mjs [dir ...]
 *
 * The palette annotates every step with its measured ratio, but a comment
 * does not stop anyone writing `text-brand-500`. Two rules, both derived from
 * the ramp itself rather than a hardcoded list, so adding a token to the
 * preset automatically brings it under the rule:
 *
 *   A. text-<token>            must be >= 4.5:1 on white  (WCAG AA, body text)
 *   B. bg-<token> + text-white must be >= 4.5:1           (white ON the fill)
 *
 * Deliberately NOT checked: border and ring colours. WCAG's 3:1 applies to UI
 * components that carry meaning, not to decorative hairlines, and flagging
 * every `border-ink-100` divider would drown the real findings — which is how
 * a guard gets switched off.
 *
 * The 4.5 threshold assumes a white ground. Every token that clears it on
 * white also clears it on our tinted surfaces, so this under-reports rather
 * than over-reports, which is the right direction for a build-breaking check.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRESET = path.join(ROOT, "packages/config/tailwind/preset.css");
const DEFAULT_TARGETS = ["apps/web/src", "packages/ui"];
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".turbo", "dist", "coverage"]);
const AA_TEXT = 4.5;

// ── contrast maths (WCAG 2.1) ────────────────────────────────────────────────
const toLinear = (c) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) =>
  0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
const parseHex = (h) => {
  const s = h.replace("#", "");
  const full = s.length === 3 ? [...s].map((c) => c + c).join("") : s;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(parseHex(a)), luminance(parseHex(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// ── the palette is the source of truth ───────────────────────────────────────
const preset = readFileSync(PRESET, "utf8");
const tokens = new Map();
for (const m of preset.matchAll(/--color-([a-z]+-\d+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
  tokens.set(m[1], m[2]);
}
if (tokens.size === 0) {
  console.error(`No colour tokens found in ${path.relative(ROOT, PRESET)}.`);
  process.exit(1);
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(path.extname(entry))) out.push(full);
  }
  return out;
}

/**
 * Pull out each complete `className=` value, including multi-line cn(...)
 * calls. Line-based scanning would split an element across units and miss
 * `bg-x` on one line paired with `text-white` on another.
 */
function classNameBlocks(source) {
  const blocks = [];
  const re = /className\s*=\s*/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    let i = m.index + m[0].length;
    const opener = source[i];
    if (opener === '"' || opener === "'" || opener === "`") {
      const end = source.indexOf(opener, i + 1);
      if (end === -1) continue;
      blocks.push({ text: source.slice(i + 1, end), index: i });
    } else if (opener === "{") {
      let depth = 0;
      let j = i;
      for (; j < source.length; j++) {
        if (source[j] === "{") depth++;
        else if (source[j] === "}") {
          depth--;
          if (depth === 0) break;
        }
      }
      blocks.push({ text: source.slice(i + 1, j), index: i });
    }
  }
  return blocks;
}

const targets = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_TARGETS;
const files = targets.flatMap((t) => walk(path.resolve(ROOT, t)));
const violations = [];
let checked = 0;

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  const lineOf = (i) => source.slice(0, i).split("\n").length;

  for (const block of classNameBlocks(source)) {
    checked++;
    const line = lineOf(block.index);

    // Rule A — text-<token>
    for (const m of block.text.matchAll(/\btext-([a-z]+-\d+)\b/g)) {
      const hex = tokens.get(m[1]);
      if (!hex) continue;
      const r = ratio(hex, "#ffffff");
      if (r < AA_TEXT) {
        violations.push({
          file: rel,
          line,
          message: `text-${m[1]} is ${r.toFixed(2)}:1 on white, below AA's ${AA_TEXT}. Use a darker step.`,
        });
      }
    }

    // Rule B — white text on a fill that cannot carry it
    if (/\btext-white\b/.test(block.text)) {
      for (const m of block.text.matchAll(/\bbg-([a-z]+-\d+)\b/g)) {
        const hex = tokens.get(m[1]);
        if (!hex) continue;
        const r = ratio(hex, "#ffffff");
        if (r < AA_TEXT) {
          violations.push({
            file: rel,
            line,
            message: `text-white on bg-${m[1]} is ${r.toFixed(2)}:1. Put ink-900 on that fill, or darken the background.`,
          });
        }
      }
    }
  }
}

console.log(
  `Checked ${checked} className block(s) in ${files.length} file(s) against ${tokens.size} tokens.`,
);

if (violations.length) {
  console.error(`\n${violations.length} contrast violation(s):\n`);
  for (const v of violations) console.error(`  ${v.file}:${v.line}  ${v.message}`);
  console.error(
    "\nRatios are in packages/config/tailwind/preset.css next to each token.\n" +
      "Cheap Android screens in daylight are the environment this is for.",
  );
  process.exit(1);
}

console.log("Every colour token is used somewhere it is legible.");
