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
 *   A. text-<token>            must be >= 4.5:1 on its surface (WCAG AA)
 *   B. bg-<token> + text-white must be >= 4.5:1              (white ON the fill)
 *
 * The surface is the background declared on the SAME element, falling back to
 * the page ground read from globals.css. `/NN` opacity modifiers are
 * composited before measuring, because `text-brand-950/80` is not brand-950
 * and the mix can fall below AA while the solid token passes comfortably.
 *
 * KNOWN BLIND SPOT — inherited backgrounds. The scanner reads one className at
 * a time and cannot see an ancestor's `bg-`. Text on a descendant of a tinted
 * section is measured against the page ground instead of that section, so a
 * pattern like
 *
 *     <section className="bg-brand-500">
 *       <dt className="text-brand-950/80">…</dt>      <-- NOT checked correctly
 *
 * passes here and still has to be caught by review. Fixing it properly needs
 * JSX ancestry, not regex over class strings. Stated plainly because a guard
 * whose limits are undocumented gets read as coverage it does not have.
 *
 * Deliberately NOT checked: border and ring colours. WCAG's 3:1 applies to UI
 * components that carry meaning, not to decorative hairlines, and flagging
 * every `border-ink-100` divider would drown the real findings — which is how
 * a guard gets switched off.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRESET = path.join(ROOT, "packages/config/tailwind/preset.css");
const GLOBALS = path.join(ROOT, "apps/web/src/app/globals.css");
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
const toHex = (rgb) =>
  "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

/**
 * Tailwind's `/NN` opacity modifier composites the colour over whatever is
 * behind it. `text-brand-950/80` is not brand-950 — it is 80% of it mixed
 * with the surface, and that mix can fall below AA while the solid token
 * comfortably passes. Ignoring the modifier is how a 3.84:1 label reads as
 * compliant.
 */
const composite = (fg, bg, alpha) => {
  const [f, b] = [parseHex(fg), parseHex(bg)];
  return toHex(f.map((v, i) => v * alpha + b[i] * (1 - alpha)));
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

/**
 * The page ground, read from globals.css rather than assumed to be white.
 * It is not: the body sits on ink-50, and measuring against #ffffff quietly
 * overstates every ratio by about 7% — enough to pass something that fails.
 */
function readGround() {
  try {
    const css = readFileSync(GLOBALS, "utf8");
    const m = /body\s*\{[^}]*background-color:\s*var\(--color-([a-z]+-\d+)\)/m.exec(css);
    if (m?.[1] && tokens.has(m[1])) return { hex: tokens.get(m[1]), name: m[1] };
    if (/body\s*\{[^}]*background-color:\s*var\(--color-white\)/m.test(css)) {
      return { hex: "#ffffff", name: "white" };
    }
  } catch {
    // globals.css absent in a package-only run; white is the safe default.
  }
  return { hex: "#ffffff", name: "white (assumed)" };
}
const GROUND = readGround();

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

    // Rule A runs per string literal, not over the whole block.
    //
    // A `cn(cond ? "bg-ok-600/10 text-ok-600" : "bg-warn-600/10 text-warn-600")`
    // has two backgrounds that never coexist. Merging the block pairs the text
    // of one branch with the background of the other and reports a colour
    // combination that cannot occur — the sort of false positive that gets a
    // guard switched off within a week.
    for (const literal of block.text.split(/["'`]/)) {
      const own = [...literal.matchAll(/\bbg-([a-z]+-\d+)(?:\/(\d+))?\b/g)].at(-1);
      const ownBase = own ? tokens.get(own[1]) : undefined;

      // A tinted background is not the solid token: bg-ok-600/10 is 10% of
      // ok-600 over the page ground, which is nearly the ground itself.
      const surface = ownBase
        ? own[2]
          ? composite(ownBase, GROUND.hex, Number(own[2]) / 100)
          : ownBase
        : GROUND.hex;
      const surfaceName = ownBase
        ? `bg-${own[1]}${own[2] ? `/${own[2]}` : ""}`
        : GROUND.name;

      for (const m of literal.matchAll(/\btext-([a-z]+-\d+)(?:\/(\d+))?\b/g)) {
        const base = tokens.get(m[1]);
        if (!base) continue;
        const alpha = m[2] ? Number(m[2]) / 100 : 1;
        const effective = alpha === 1 ? base : composite(base, surface, alpha);
        const r = ratio(effective, surface);
        if (r < AA_TEXT) {
          violations.push({
            file: rel,
            line,
            message:
              `text-${m[1]}${m[2] ? `/${m[2]}` : ""} on ${surfaceName} is ${r.toFixed(2)}:1, ` +
              `below AA's ${AA_TEXT}.` +
              (alpha < 1
                ? ` The /${m[2]} modifier mixes it down to ${effective} — drop the opacity or use a darker step.`
                : " Use a darker step."),
          });
        }
      }
    }

    // Rule B — white text on a fill that cannot carry it.
    //
    // Block-scoped rather than per literal, unlike Rule A: the case this was
    // written for puts `text-white` in one string of a cn() and the background
    // in another, and text-white is unambiguous enough that pairing it with
    // every background in the element does not misfire.
    if (/\btext-white\b/.test(block.text)) {
      for (const m of block.text.matchAll(/\bbg-([a-z]+-\d+)(?:\/(\d+))?\b/g)) {
        const base = tokens.get(m[1]);
        if (!base) continue;
        const fill = m[2] ? composite(base, GROUND.hex, Number(m[2]) / 100) : base;
        const r = ratio(fill, "#ffffff");
        if (r < AA_TEXT) {
          violations.push({
            file: rel,
            line,
            message:
              `text-white on bg-${m[1]}${m[2] ? `/${m[2]}` : ""} is ${r.toFixed(2)}:1. ` +
              `Put ink-900 on that fill, or darken the background.`,
          });
        }
      }
    }
  }
}

console.log(
  `Checked ${checked} className block(s) in ${files.length} file(s) against ${tokens.size} tokens, ground = ${GROUND.name} ${GROUND.hex}.`,
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
