/**
 * The step reader's load-bearing promises (Phase 5 Part A — one step at a
 * time, V2Step/V2Turn, replacing the old six-section scrolling page).
 *
 * Written against the source because these are structural: a step whose
 * field is null must be absent rather than empty, checks come after the
 * challenge, finishing the last step is the one progress event, and an
 * already-done revisit must never re-trigger it. Each of those is a rule
 * you can break silently.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const steps = readFileSync(join(SRC, "lib", "steps.ts"), "utf8");
const reader = readFileSync(join(SRC, "components", "lesson", "step-reader.tsx"), "utf8");
const route = readFileSync(join(SRC, "components", "lesson", "lesson-route.tsx"), "utf8");
const states = readFileSync(join(SRC, "components", "lesson", "lesson-states.tsx"), "utf8");
const facade = readFileSync(join(SRC, "components", "video-facade.tsx"), "utf8");
const blocks = readFileSync(join(SRC, "lib", "blocks.ts"), "utf8");

test("checks come after the challenge, the mistake after checks", () => {
  const challenge = steps.indexOf('id: "challenge"');
  const check = steps.indexOf('id: `check-');
  const mistake = steps.indexOf('id: "mistake"');
  assert.ok(challenge > 0 && check > 0 && mistake > 0, "all three should be built");
  assert.ok(check > challenge, "retrieval practice belongs after doing, not before");
  assert.ok(mistake > check, "the mistake follows the checks");
});

test("a null field is a missing step, never an empty one", () => {
  for (const guard of ["if (node.whyToday)", "if (node.challenge)", "if (node.commonMistake)"]) {
    assert.ok(steps.includes(guard), `${guard} missing — a null field would render an empty step`);
  }
  assert.match(steps, /if \(topics\.length\)/);
});

test("a day is six kinds of step, in the design's order, every resource and check its own", () => {
  // "id: " anchors each search to the real push site inside
  // buildLessonSteps — without it, e.g. "challenge" also matches the
  // LessonStep type union declared above the function, which comes first
  // in the file regardless of runtime order.
  const order = ['id: "why-today"', 'id: "today"', "id: `resource-", 'id: "challenge"', "id: `check-", 'id: "mistake"'];
  const at = order.map((id) => steps.indexOf(id));
  assert.ok(
    at.every((i) => i > 0),
    `missing step group: ${order.filter((_, i) => at[i] < 0).join(", ")}`,
  );
  assert.deepEqual(at, [...at].sort((a, b) => a - b), "the six step groups are out of order");
  // One step per resource/check, not one grouped section — the old
  // "resources"/"checks" plural kinds must not reappear here.
  assert.doesNotMatch(steps, /kind: "resources"/);
  assert.doesNotMatch(steps, /kind: "checks"/);
  assert.match(steps, /for \(const r of node\.resources\)/);
  assert.match(steps, /node\.checks\.forEach/);
});

test("self-check only: a check step never stores or compares an answer, it just reveals one", () => {
  const checkStep = reader.slice(reader.indexOf("function CheckStep"));
  assert.match(checkStep, /setOpen/);
  assert.doesNotMatch(checkStep, /correct|score|grade/i);
});

test("the progress bar shows done, current and upcoming as three distinct fills", () => {
  assert.match(reader, /i < furthest \? "bg-night-900" : i === furthest \? "bg-brand-500" : "bg-ink-300"/);
});

test('a challenge step swaps the step counter for a "Your turn" badge, matching V2Turn', () => {
  assert.match(reader, /step\.kind === "challenge"/);
  assert.match(reader, />\s*Your turn\s*</);
});

test("the footer says Continue, except Finish on the last step — Part B's command/turnRich CTAs layer on top of this, not instead of it", () => {
  // Part B inserted two more rungs ahead of this one (command -> "I see
  // this", turnRich -> step.ctaLabel), so the literal adjacency from Part A
  // is gone, but the base fallback for every other step kind must still be
  // exactly this pair.
  assert.match(reader, /: stepIndex \+ 1 === total\s*\?\s*"Finish"\s*:\s*"Continue"/);
});

test("no Stuck/Ask box yet — Part A and B ship the step shell and its authored content, not CHANGES.md item 6", () => {
  // CHANGES.md item 6: a step with no richer panel shows only the Stuck
  // box. No real destination exists for it yet (no help_requests table, no
  // "Mine looks different" flow) — a dead button is worse than a missing
  // one, same reasoning as the old page's bookmark button.
  assert.doesNotMatch(reader, />\s*Stuck\s*</);
  assert.doesNotMatch(reader, /Mine looks different/);
});

test("Part B's command/turnRich content (Type this / You should see) is real now, not a placeholder", () => {
  assert.match(reader, /promptLabel/);
  assert.match(reader, /outputLabel/);
});

test("finishing the last step is the one progress event, and it is idempotent on a revisit", () => {
  assert.match(route, /const isLast = index === steps\.length - 1/);
  assert.match(route, /if \(done\) \{/);
  // The already-done branch must return before ever calling execute(...).
  const alreadyDone = route.slice(route.indexOf("if (done) {"), route.indexOf("if (!signedIn)"));
  assert.doesNotMatch(alreadyDone, /execute\(/);
});

test("signed out, finishing the last step redirects to join rather than silently failing", () => {
  assert.match(route, /router\.push\(`\/join\?next=\/learn\/\$\{slug\}\/\$\{nodeSlug\}`\)/);
});

test("step position resumes from the furthest point reached, not step zero", () => {
  assert.match(route, /window\.localStorage\.getItem\(storageKey\)/);
  assert.match(route, /window\.localStorage\.setItem\(storageKey/);
  assert.match(route, /jintu:step:\$\{nodeId\}/);
});

test("a save failure is named inline, with the place kept — never a toast", () => {
  assert.match(route, /onError: \(\) => \{\s*setFailed\(true\);/);
  assert.match(reader, /role="alert"/);
  assert.match(route, /That did not save\. Your place is kept — try again\./);
});

test("the done screen is a full screen, not an inline card — V2Done, not the old EndOfDayCard", () => {
  assert.match(states, /export function LessonDoneScreen/);
  assert.doesNotMatch(states, /EndOfDayCard/);
  assert.match(states, /Lesson \{lessonNumber\} done/);
});

test("lib/blocks.ts (the dashboard's own builder) is untouched — six sections, not steps", () => {
  assert.match(blocks, /export function buildLessonBlocks/);
  assert.match(blocks, /id: "check-yourself"/);
});

test("no iframe exists until asked for, and it is the nocookie host", () => {
  assert.match(facade, /nocookie/);
  const eager = /^\s*<iframe/m.test(facade) && !/\{(loaded|shown|open|playing)/.test(facade);
  assert.equal(eager, false, "the player must be click-to-load");
  assert.match(facade, /useState/);
});
