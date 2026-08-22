/**
 * Typography rules a stylesheet cannot enforce.
 *
 *   node scripts/assert-typography.mjs
 *
 * Two of these are about the same mistake, made in two places.
 *
 * A hand-placed <br> in a heading is correct at exactly the width it was
 * chosen for. At every other width it breaks mid-phrase or leaves a gap in
 * the middle of a sentence, and it cannot know how long the copy will be
 * after the next edit. `text-wrap: balance` picks the break at the actual
 * width, which is why the base layer sets it on every h1–h3 and why a manual
 * break has to be argued for rather than typed.
 *
 * A display size written per breakpoint — text-[38px] sm:text-[64px]
 * lg:text-[88px] — is correct at three widths and wrong between them. The
 * clamp() scale in packages/config/tailwind/type-scale.css is continuous.
 *
 * Body and UI type is deliberately NOT in scope. 15px is a reading size and
 * it should be 15px on a phone and on a monitor; type that grows with the
 * viewport is worse for prose, not better. This guard is about display type.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "apps", "web", "src");

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const full = path.join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (e.endsWith(".tsx")) out.push(full);
  }
  return out;
};

const files = walk(SRC);
let failures = 0;
const fail = (msg) => {
  console.log(`  FAIL  ${msg}`);
  failures++;
};

// ── 1. hand-placed breaks ───────────────────────────────────────────────────
// The hero is the one allowed exception and it must disappear below sm, so a
// bare <br /> inside a heading is always wrong and a responsive one needs the
// right display pair: `hidden sm:inline`, not `sm:block`. A <br> is inline by
// definition and giving it display:block is a different element.
console.log("── hand-placed line breaks ──");
let bareBreaks = 0;
let blockBreaks = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const rel = path.relative(ROOT, f);
  for (const m of src.matchAll(/<h[1-3][\s\S]{0,600}?<\/h[1-3]>/g)) {
    for (const br of m[0].matchAll(/<br([^/>]*)\/>/g)) {
      const attrs = br[1].trim();
      if (!attrs) {
        bareBreaks++;
        fail(`${rel}: a bare <br /> inside a heading — balance should choose the break`);
      } else if (/sm:block/.test(attrs)) {
        blockBreaks++;
        fail(`${rel}: <br className="hidden sm:block" /> — a <br> is inline; use sm:inline`);
      }
    }
  }
}
if (!bareBreaks && !blockBreaks) console.log("  ok    no bare or block-displayed breaks in any heading");

// ── 2. display type is fluid ────────────────────────────────────────────────
// Anything at or above 24px is display type and belongs on the clamp scale.
// A breakpoint-stepped size at that scale is the thing this guard exists for.
console.log("\n── display sizes ──");
const DISPLAY_MIN = 24;
let stepped = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const rel = path.relative(ROOT, f);
  for (const m of src.matchAll(/className="([^"]*)"/g)) {
    const cls = m[1];
    const sizes = [...cls.matchAll(/(?:^|\s)(sm:|md:|lg:|xl:)?text-\[([0-9.]+)px\]/g)];
    const display = sizes.filter((s) => Number(s[2]) >= DISPLAY_MIN);
    // One fixed display size is a considered choice; two at different
    // breakpoints is a scale someone built by hand.
    if (display.length >= 2) {
      stepped++;
      fail(`${rel}: display type stepped across breakpoints (${display.map((d) => (d[1] ?? "") + d[2] + "px").join(", ")}) — use .t-hero/.t-page/.t-sect`);
    }
  }
}
if (!stepped) console.log(`  ok    no display size (>=${DISPLAY_MIN}px) is stepped across breakpoints`);

// ── 3. the scale is actually wired ──────────────────────────────────────────
console.log("\n── the scale is loaded ──");
const globals = readFileSync(path.join(SRC, "app", "globals.css"), "utf8");
const scale = readFileSync(path.join(ROOT, "packages", "config", "tailwind", "type-scale.css"), "utf8");
if (!globals.includes("type-scale.css")) fail("globals.css does not import the type scale");
else console.log("  ok    globals.css imports type-scale.css");
if (!/h1,\s*h2,\s*h3\s*\{[^}]*text-wrap:\s*balance/s.test(globals))
  fail("the base layer does not balance h1-h3 — a heading with no .t-* class would wrap unevenly");
else console.log("  ok    every h1-h3 is balanced by the base layer");
for (const c of ["t-hero", "t-page", "t-sect", "t-sub", "t-card", "t-lead", "t-body"]) {
  if (!scale.includes(`.${c}`)) fail(`the scale is missing .${c}`);
}
if (!/clamp\(/.test(scale)) fail("the scale contains no clamp() — it is not fluid");
else console.log("  ok    the display classes are clamp()-based");

// ── 4. inline runs ──────────────────────────────────────────────────────────
// "⚡4 roadmaps" is what you get when two spans sit adjacent with no gap. Any
// container holding several text spans needs an explicit gap, never a space.
console.log("\n── inline runs have explicit gaps ──");
const pill = readFileSync(path.join(SRC, "components", "marketing", "homepage.tsx"), "utf8");
// A window after the declaration, not a brace-matched slice: StatPill's
// destructured props close with a brace at column 0 before the body starts,
// so a lazy match to the first "\n}" stops before the className it is
// checking — and the guard passes itself while testing nothing.
const at = pill.indexOf("function StatPill");
const stat = at < 0 ? "" : pill.slice(at, at + 1200);
if (!/inline-flex[^"]*gap-\d/.test(stat))
  fail("StatPill has no gap — the glyph and the number will touch");
else console.log("  ok    StatPill separates its glyph and label with a gap");

// ── 5. nothing wider than the narrowest screen ──────────────────────────────
// 320px is the floor. Minus the standard px-5 gutter that leaves 280px of
// content, so an unprefixed fixed width above that overflows on a small
// phone — and once a page scrolls sideways every centred thing on it looks
// broken, which is usually what gets reported rather than the width itself.
//
// Exempt: anything hidden, absolutely positioned or behind a breakpoint
// prefix, since none of those occupy flow at 320px.
console.log("\n── nothing wider than a 320px screen ──");
const FLOOR = 280;
let wide = 0;
for (const f of files) {
  const src = readFileSync(f, "utf8");
  const rel = path.relative(ROOT, f);
  for (const m of src.matchAll(/className=[{"`]([^"`]*)["`]/g)) {
    const cls = m[1];
    if (/\bhidden\b|\babsolute\b|\bfixed\b|max-w-/.test(cls)) continue;
    for (const w of cls.matchAll(/(?:^|\s)w-\[(\d+)px\]/g)) {
      if (Number(w[1]) > FLOOR) {
        wide++;
        fail(`${rel}: w-[${w[1]}px] with no breakpoint prefix — overflows a 320px screen`);
      }
    }
  }
}
if (!wide) console.log(`  ok    no unprefixed fixed width exceeds ${FLOOR}px`);

// ── 6. the measure is capped and can break ──────────────────────────────────
// A heading with no max-inline-size runs as wide as the viewport allows, and
// one with no overflow-wrap is pushed sideways by a single long word.
console.log("\n── display type cannot leave its container ──");
for (const c of ["t-hero", "t-page", "t-sect", "t-sub"]) {
  const block = new RegExp(`\\.${c} \\{[^}]*\\}`).exec(scale)?.[0] ?? "";
  if (!/max-inline-size:\s*20ch/.test(block)) fail(`.${c} has no measure cap`);
  if (!/overflow-wrap:\s*break-word/.test(block)) fail(`.${c} cannot break a long word`);
}
if (!/overflow-x:\s*clip/.test(globals))
  fail("no overflow-x net on the root — a stray wide element scrolls the whole page");
else console.log("  ok    capped, breakable, and the root clips rather than scrolls");

console.log(`\n${failures === 0 ? "Typography rules hold." : `${failures} failure(s).`}`);
process.exit(failures === 0 ? 0 : 1);
