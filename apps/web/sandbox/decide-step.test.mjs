/**
 * The Decide step (design pack update 3 §B, V2Decide/V2DecideReveal/
 * DeskDecide) — the ninth authored kind, and the first with its own
 * two-phase interaction (lock in, then reveal) instead of a worked
 * example shown up front. Source-text assertions, same convention as the
 * rest of this directory; schema-level validation (realCase.sourceUrl
 * required, etc.) lives in packages/contracts/src/steps.test.ts instead,
 * and the storage/RLS behavior (change-my-answer updates in place, a
 * short reason refused) in scripts/assert-baseline.mjs — this file is the
 * one place that reads step-reader.tsx's own text.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const reader = readFileSync(join(SRC, "components", "lesson", "step-reader.tsx"), "utf8");
const steps = readFileSync(join(SRC, "lib", "steps.ts"), "utf8");
const lessonRoute = readFileSync(join(SRC, "components", "lesson", "lesson-route.tsx"), "utf8");
const dayPage = readFileSync(join(SRC, "app", "(learning)", "learn", "[slug]", "[node]", "page.tsx"), "utf8");
const decisionsAction = readFileSync(join(SRC, "actions", "decisions.ts"), "utf8");
const decisionsLib = readFileSync(join(SRC, "lib", "decisions.ts"), "utf8");

test("buildLessonSteps maps the decide kind straight through, carrying the user's existing answer separately from the authored content", () => {
  const fn = steps.slice(steps.indexOf("function authoredToLessonSteps"), steps.indexOf("export function buildLessonSteps"));
  assert.match(fn, /kind: "decide"/);
  assert.match(fn, /scenario: a\.scenario/);
  assert.match(fn, /realCase: a\.realCase/);
  // existingDecision is never set here — buildLessonSteps(node) has no
  // user context; it's merged in by the day page afterward.
  assert.doesNotMatch(fn, /existingDecision/);
});

test("Lock in stays disabled until an option is picked AND the reason is at least 15 characters", () => {
  assert.match(reader, /const canLockIn = Boolean\(decideOption\) && decideReason\.trim\(\)\.length >= 15/);
  assert.match(reader, /footerDisabled = isUnlockedDecide \? savingDecision \|\| !canLockIn/);
});

test('the pre-lock footer button says "Lock in and see what happened", not the generic Continue', () => {
  assert.match(reader, /"Lock in and see what happened"/);
});

test('a locked decide step\'s footer says "Next step", never "Continue"', () => {
  const fn = reader.slice(reader.indexOf("function ctaLabelFor"), reader.indexOf("const STEP_GROUPS"));
  assert.match(fn, /if \(step\.kind === "decide"\) return stepIndex \+ 1 === total \? "Finish" : "Next step"/);
});

test("the reveal shows the real case's prose AND a working, clickable source link — never a placeholder", () => {
  const fn = reader.slice(reader.indexOf("function DecideBody"));
  assert.match(fn, /step\.realCase\.who.*step\.realCase\.chose.*step\.realCase\.outcome/s);
  assert.match(fn, /href=\{step\.realCase\.sourceUrl\}/);
  assert.match(fn, /target="_blank"/);
  assert.match(fn, /step\.realCase\.sourceTitle/);
});

test("Change my answer unlocks the step without discarding the draft — same component, same local state, just re-opened", () => {
  const fn = reader.slice(reader.indexOf("function DecideBody"));
  assert.match(fn, /onChangeAnswer/);
  // The handler only flips `locked`; option/reason/covered state is not
  // reset anywhere near it.
  const handler = reader.slice(reader.indexOf("const lockInDecide ="), reader.indexOf("const canLockIn"));
  assert.doesNotMatch(handler, /setDecideOption\(null\)|setDecideReason\(""\)/);
});

test("the covered checklist re-saves on its own once already locked, rather than waiting for a button that no longer exists", () => {
  assert.match(reader, /if \(decideLocked\) saveDecideDraft\(next\)/);
});

test("the Decide step is self-report only — never graded against the content (CLAUDE.md: no grading)", () => {
  const fn = reader.slice(reader.indexOf("function DecideBody"));
  assert.doesNotMatch(fn, /correct|score|grade/i);
});

test("the server action saves on (user, node, step), the same key the table's own unique constraint upserts on", () => {
  assert.match(decisionsAction, /onConflict: "user_id,node_id,step_id"/);
  // The 15-character floor is enforced here too, not only in the UI.
  assert.match(decisionsAction, /min\(15,/);
});

test("the founder log orders decisions oldest first, and degrades to an empty list rather than throwing", () => {
  assert.match(decisionsLib, /order\("created_at", \{ ascending: true \}\)/);
  assert.match(decisionsLib, /catch \{\s*\n?\s*\/\//);
  assert.match(decisionsLib, /return \[\];/);
});

test("the day page reads the user's own decisions and the founder log only when this day actually has a decide step — same cost discipline as the DSA language switch", () => {
  assert.match(dayPage, /if \(decideSteps\.length > 0\)/);
  assert.match(dayPage, /getMyDecision\(node\.id, s\.id\)/);
  assert.match(dayPage, /getFounderLog\(slug, roadmap\.id,/);
});

test("founderLog threads server → LessonRoute → StepReader as a plain prop, not a client-side fetch", () => {
  assert.match(lessonRoute, /founderLog: FounderLogEntry\[\]/);
  assert.match(lessonRoute, /founderLog=\{founderLog\}/);
  assert.match(reader, /founderLog: FounderLogEntry\[\]/);
});
