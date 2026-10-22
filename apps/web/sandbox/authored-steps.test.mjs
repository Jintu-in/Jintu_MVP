/**
 * Phase 5 Part B — authored steps, migration 0030. Source-text assertions,
 * same convention as the rest of this directory. Covers all seven authored
 * kinds: command/turn (V2Step/V2Turn, Git & GitHub) and the five Uni* kinds
 * (choose/find/formula/number/write) piloted on their own real roadmaps.
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
const contractsSteps = readFileSync(join(ROOT, "packages", "contracts", "src", "steps.ts"), "utf8");
const gitGithub = readFileSync(join(ROOT, "docs", "roadmaps", "git-and-github.mjs"), "utf8");
const thinkingM1to3 = readFileSync(
  join(ROOT, "docs", "roadmaps", "thinking-under-uncertainty", "modules-01-03.mjs"),
  "utf8",
);
const thinkingM4to5 = readFileSync(
  join(ROOT, "docs", "roadmaps", "thinking-under-uncertainty", "modules-04-05.mjs"),
  "utf8",
);
const medicalCoding = readFileSync(join(ROOT, "docs", "roadmaps", "medical-coding", "modules-01-04.mjs"), "utf8");
const startupFinance = readFileSync(join(ROOT, "docs", "roadmaps", "startup-finance", "modules-01-04.mjs"), "utf8");
const excelAtWork = readFileSync(join(ROOT, "docs", "roadmaps", "excel-at-work.mjs"), "utf8");

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
  assert.match(reader, /step\.kind === "turnRich" \? step\.timeLabel : `Step \$\{stepIndex \+ 1\} of \$\{total\}`/);
});

test("the footer CTA uses each authored kind's own words, not generic Continue/Finish — shared by both the mobile sticky footer and the desktop inline row via one ctaLabelFor() helper", () => {
  const fn = reader.slice(reader.indexOf("function ctaLabelFor"), reader.indexOf("const STEP_GROUPS"));
  assert.match(fn, /step\.kind === "command"/);
  assert.match(fn, /return "I see this"/);
  assert.match(fn, /step\.kind === "turnRich" \|\|/);
  assert.match(fn, /return step\.ctaLabel/);
});

test("the terminal card is decorative dark chrome, not the Phase 7 dark-theme tokens", () => {
  const fn = reader.slice(reader.indexOf("function TerminalCard"), reader.indexOf("function CheckStep"));
  assert.match(fn, /bg-night-950/);
  assert.doesNotMatch(fn, /dark-bg|dark-text|dark-muted|dark-link/);
});

test('the terminal prompt glyph never carries a brand-500 text class — CLAUDE.md: fill only, never text', () => {
  const fn = reader.slice(reader.indexOf("function TerminalCard"), reader.indexOf("function CheckStep"));
  const glyphLine = fn.slice(fn.indexOf("<span aria-hidden className={promptGlyph"));
  assert.match(glyphLine, /\{promptGlyph\}/);
  assert.doesNotMatch(glyphLine.slice(0, 160), /text-brand-500/);
});

test('formula steps use "fx" as the terminal glyph, not the shell "$"', () => {
  assert.match(reader, /promptGlyph="fx"/);
});

test("import-roadmap.mjs hand-validates all seven authored kinds (plain node cannot import the TS schema)", () => {
  for (const kind of ["command", "turn", "choose", "find", "formula", "number", "write"]) {
    assert.match(importer, new RegExp(`s\\.kind === "${kind}"`));
  }
  assert.match(importer, /one of command\/turn\/choose\/find\/formula\/number\/write/);
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

// ── the five Uni* kinds ──────────────────────────────────────────────────

test("all eight authored kinds share one discriminated union in @jintu/contracts (Phase 5 Part C adds codeMulti, the DSA language switch)", () => {
  assert.match(
    contractsSteps,
    /z\.discriminatedUnion\("kind", \[\s*commandStepSchema,\s*turnStepSchema,\s*chooseStepSchema,\s*findStepSchema,\s*formulaStepSchema,\s*numberStepSchema,\s*writeStepSchema,\s*codeMultiStepSchema,\s*\]\)/,
  );
});

test("a choose step's correctIndex is refined to actually index into its own options", () => {
  const schema = contractsSteps.slice(
    contractsSteps.indexOf("export const chooseStepSchema"),
    contractsSteps.indexOf("export const findStepSchema"),
  );
  assert.match(schema, /\.refine\(\(v\) => v\.correctIndex < v\.options\.length/);
});

test("number and write steps carry a worked example only — no live, gradeable input (CLAUDE.md: no grading, no verification)", () => {
  const numberSchema = contractsSteps.slice(
    contractsSteps.indexOf("export const numberStepSchema"),
    contractsSteps.indexOf("export const writeStepSchema"),
  );
  const writeSchema = contractsSteps.slice(contractsSteps.indexOf("export const writeStepSchema"));
  assert.match(numberSchema, /no-grading posture/);
  assert.match(writeSchema, /same\s*\n?\s*\*?\s*no-grading posture/);
});

test("buildLessonSteps maps all five Uni* kinds through authoredToLessonSteps, railTitle from the step's own title", () => {
  const fn = steps.slice(steps.indexOf("function authoredToLessonSteps"), steps.indexOf("export function buildLessonSteps"));
  for (const kind of ["choose", "find", "formula", "number", "write"]) {
    assert.match(fn, new RegExp(`if \\(a\\.kind === "${kind}"\\) \\{`));
  }
  // codeMulti (Phase 5 Part C) is the final fallthrough now — still
  // asserted present via its own kind literal, not an explicit if-branch.
  assert.match(fn, /kind: "codeMulti"/);
  // Every branch assigns railTitle from a.title, never a literal.
  const literalRailTitles = fn.match(/railTitle: "[^"]*"/g) ?? [];
  assert.deepEqual(literalRailTitles, []);
});

test("each Uni* kind gets its own small pill next to the eyebrow, matching its mockup's badge", () => {
  assert.match(reader, /choose: "Choose"/);
  assert.match(reader, /find: "Find"/);
  assert.match(reader, /formula: "Formula"/);
  assert.match(reader, /number: "Number"/);
  assert.match(reader, /write: "Write"/);
  // The pill lives next to "Step N" — the Uni* kinds do NOT swap in V2Turn's
  // "Your turn" badge, unlike challenge/turnRich.
  const badgeLine = reader.slice(reader.indexOf('step.kind === "challenge"'), reader.indexOf("Your turn") + 20);
  assert.doesNotMatch(badgeLine, /"choose"|"find"|"formula"|"number"|"write"/);
});

test("the footer CTA for every Uni* kind is the step's own ctaLabel, not generic Continue/Finish", () => {
  const cta = reader.slice(reader.indexOf("function ctaLabelFor"), reader.indexOf("const STEP_GROUPS"));
  assert.match(
    cta,
    /step\.kind === "turnRich" \|\|\s*step\.kind === "choose" \|\|\s*step\.kind === "find" \|\|\s*step\.kind === "formula" \|\|\s*step\.kind === "number" \|\|\s*step\.kind === "write"/,
  );
});

test('no "mine is different" / "Ask about this step" buttons on any Uni* kind — same CHANGES.md item 6 deferral as command/turn', () => {
  assert.doesNotMatch(reader, /mine is different/i);
  assert.doesNotMatch(reader, /I picked a different one/);
  assert.doesNotMatch(reader, /I got something else/);
  assert.doesNotMatch(reader, /Help me fix mine/);
  assert.doesNotMatch(reader, /Ask about this step/);
});

test("a choose step's correct option is styled with the measured ok-bg/ok-700 pairing, not an unmeasured green", () => {
  const fn = reader.slice(reader.indexOf('case "choose"'), reader.indexOf('case "find"'));
  assert.match(fn, /border-ok-600 bg-ok-bg text-ok-700/);
});

test("a write step's checkmark badge follows the Done screen's own precedent: inline hex stroke on a decorative, aria-hidden icon, not a text-color class", () => {
  const fn = reader.slice(reader.indexOf('case "write"'), reader.indexOf('case "check"'));
  assert.match(fn, /aria-hidden className="flex size-\[22px\]/);
  assert.match(fn, /stroke="#0B4A32"/);
});

test("Thinking under uncertainty's Bayes'-theorem day carries a worked choose step using its OWN real numbers (1-in-1,000, not the mockup's 1-in-100)", () => {
  const node = thinkingM1to3.slice(
    thinkingM1to3.indexOf('title: "Bayes\' theorem, mechanically"'),
    thinkingM1to3.indexOf('title: "Incremental updating"'),
  );
  assert.match(node, /kind: "choose"/);
  assert.match(node, /1 in 1,000/);
  assert.match(node, /correctIndex: 2/);
  // The real challenge/challengeMinutes stay exactly as authored before.
  assert.match(node, /challengeMinutes: 50/);
});

test("Thinking under uncertainty's forecasting-practice day carries a worked write step", () => {
  const titleStart = thinkingM4to5.indexOf('title: "Forecasting practice, in public"');
  const node = thinkingM4to5.slice(titleStart, thinkingM4to5.indexOf("resources: [", titleStart) + 500);
  assert.match(node, /kind: "write"/);
  assert.match(node, /I am __% sure that __ by __\./);
  assert.match(node, /challengeMinutes: 40/);
});

test("Medical coding's index-and-tabular day carries a worked find step with the real E11.9 example", () => {
  const node = medicalCoding.slice(
    medicalCoding.indexOf('title: "The alphabetic index and the tabular list"'),
    medicalCoding.indexOf('title: "Excludes1 and Excludes2"'),
  );
  assert.match(node, /kind: "find"/);
  assert.match(node, /answerCode: "E11\.9"/);
  assert.match(node, /challengeMinutes: 40/);
});

test("Startup finance's pre/post-money day carries a worked number step matching its own check's figures (₹5cr at ₹20cr pre-money)", () => {
  const node = startupFinance.slice(
    startupFinance.indexOf('title: "Pre-money, post-money and the arithmetic"'),
    startupFinance.indexOf('title: "Building a cap table from scratch in Excel"'),
  );
  assert.match(node, /kind: "number"/);
  assert.match(node, /₹25 crore/);
  assert.match(node, /20%/);
  assert.match(node, /challengeMinutes: 25/);
});

test("Excel at work's day 1 carries a worked formula step tied to ITS OWN lesson (labelled inputs, not a disconnected SUM example)", () => {
  const node = excelAtWork.slice(
    excelAtWork.indexOf('title: "What a spreadsheet is actually for"'),
    excelAtWork.indexOf('title: "Relative, absolute and mixed references"'),
  );
  assert.match(node, /kind: "formula"/);
  assert.match(node, /formula: "=B2\*\(1\+\$D\$1\)"/);
  assert.match(node, /inputs: \[/);
  assert.match(node, /challengeMinutes: 25/);
});

test("import-roadmap.mjs requires the fields each Uni* kind actually needs", () => {
  assert.match(importer, /correctIndex must index into options/);
  assert.match(importer, /\(find\) needs sourceTitle and sourceUrl/);
  assert.match(importer, /\(formula\) needs cellLabel and formula/);
  assert.match(importer, /\(number\) needs facts/);
  assert.match(importer, /\(write\) needs template and example/);
});
