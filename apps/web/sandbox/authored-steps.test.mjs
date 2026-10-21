/**
 * Phase 5 Part B — authored steps (V2Step's "run a command", V2Turn's
 * fuller "your turn"), migration 0030. Source-text assertions, same
 * convention as the rest of this directory.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const steps = readFileSync(join(SRC, "lib", "steps.ts"), "utf8");
const reader = readFileSync(join(SRC, "components", "lesson", "step-reader.tsx"), "utf8");
const roadmaps = readFileSync(join(SRC, "lib", "roadmaps.ts"), "utf8");
const importer = readFileSync(join(ROOT, "scripts", "import-roadmap.mjs"), "utf8");
const gitGithub = readFileSync(join(ROOT, "docs", "roadmaps", "git-and-github.mjs"), "utf8");

test("authored steps replace the generic challenge step only when present and non-empty", () => {
  const challengeBlock = steps.slice(steps.indexOf("if (node.authoredSteps"), steps.indexOf("// One step per check"));
  assert.match(challengeBlock, /if \(node\.authoredSteps && node\.authoredSteps\.length > 0\)/);
  assert.match(challengeBlock, /} else if \(node\.challenge\) \{/);
});

test("a turn step's railTitle is its own title, not the generic \"Your turn\" (the badge already says that)", () => {
  const fn = steps.slice(steps.indexOf("function authoredToLessonSteps"));
  assert.match(fn, /railTitle: a\.title/);
  assert.doesNotMatch(fn, /railTitle: "Your turn"/);
});

test("an authored node.steps that fails to parse degrades to null, not a thrown error", () => {
  const fn = roadmaps.slice(roadmaps.indexOf("function parseAuthoredSteps"), roadmaps.indexOf("export type RoadmapNode"));
  assert.match(fn, /safeParse/);
  assert.match(fn, /return null/);
  assert.doesNotMatch(fn, /throw/);
});

test("a challenge or turnRich step shows V2Turn's \"Your turn\" badge instead of the step counter", () => {
  assert.match(reader, /step\.kind === "challenge" \|\| step\.kind === "turnRich"/);
});

test("a turnRich step's eyebrow is its own time label, not \"Step N\"", () => {
  assert.match(reader, /step\.kind === "turnRich" \? step\.timeLabel : `Step \$\{stepIndex \+ 1\}`/);
});

test("the footer CTA uses each authored kind's own words, not generic Continue/Finish", () => {
  const cta = reader.slice(reader.indexOf('{continuing\n'), reader.indexOf("{continuing ? null : ARROW_RIGHT}"));
  assert.match(cta, /step\.kind === "command"\s*\?\s*"I see this"/);
  assert.match(cta, /step\.kind === "turnRich"\s*\?\s*step\.ctaLabel/);
});

test("the terminal card is decorative dark chrome, not the Phase 7 dark-theme tokens", () => {
  const fn = reader.slice(reader.indexOf("function TerminalCard"), reader.indexOf("function CheckStep"));
  assert.match(fn, /bg-night-950/);
  assert.doesNotMatch(fn, /dark-bg|dark-text|dark-muted|dark-link/);
});

test('the "$" prompt glyph never uses brand-500 as text — CLAUDE.md: fill only, never text', () => {
  const fn = reader.slice(reader.indexOf("function TerminalCard"), reader.indexOf("function CheckStep"));
  // The glyph itself: no text-brand-* class anywhere near the $ span.
  const dollarLine = fn.slice(fn.indexOf('aria-hidden>$'));
  assert.doesNotMatch(dollarLine.slice(0, 80), /text-brand-500/);
});

test("import-roadmap.mjs validates each authored step's kind and required fields by hand (plain node cannot import the TS schema)", () => {
  assert.match(importer, /s\.kind === "command"/);
  assert.match(importer, /s\.kind === "turn"/);
  assert.match(importer, /kind "\$\{s\.kind\}" — "command" or "turn"/);
});

test("import-roadmap.mjs emits nodes.steps as a real jsonb literal, null when absent", () => {
  assert.match(importer, /const qjsonb = /);
  assert.match(importer, /qjsonb\(n\.steps\)/);
});

test("Git & GitHub's day 2 carries real authored steps, and its old challenge field is untouched (lib/blocks.ts/the dashboard still reads it)", () => {
  const day2 = gitGithub.slice(
    gitGithub.indexOf("The three places a change can be"),
    gitGithub.indexOf("Your first repository, commit by commit"),
  );
  assert.match(day2, /kind: "command"/);
  assert.match(day2, /kind: "turn"/);
  assert.match(day2, /challenge:\s*\n\s*"Make a repository/);
  assert.match(day2, /challengeMinutes: 25/);
});
