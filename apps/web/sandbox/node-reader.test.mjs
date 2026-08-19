/**
 * The node reader's load-bearing promises.
 *
 * Written against the source because these are structural: a section that
 * is null must be absent rather than empty, Check Yourself must sit after
 * the challenge, and no YouTube iframe may exist in the DOM before someone
 * asks for it. Each of those is a rule you can break silently.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const blocks = readFileSync(join(SRC, "lib", "blocks.ts"), "utf8");
const page = readFileSync(join(SRC, "components", "lesson", "lesson-page.tsx"), "utf8");
const route = readFileSync(join(SRC, "components", "lesson", "lesson-route.tsx"), "utf8");
const facade = readFileSync(join(SRC, "components", "video-facade.tsx"), "utf8");

test("check yourself comes after the challenge", () => {
  const challenge = blocks.indexOf('id: "challenge"');
  const check = blocks.indexOf('id: "check-yourself"');
  const mistake = blocks.indexOf('id: "mistake"');
  assert.ok(challenge > 0 && check > 0, "both sections should be built");
  assert.ok(check > challenge, "retrieval practice belongs after doing, not before");
  assert.ok(mistake > check, "the mistake follows the checks");
});

test("a null section is omitted, never rendered as an empty heading", () => {
  for (const guard of ["if (node.whyToday)", "if (node.challenge)", "if (node.commonMistake)"]) {
    assert.ok(blocks.includes(guard), `${guard} missing — a null field would render an empty block`);
  }
  assert.match(blocks, /if \(topics\.length\)/);
  assert.match(blocks, /if \(node\.resources\.length\)/);
  assert.match(blocks, /if \(node\.checks\.length\)/);
});

test("a day is six sections, in the design's order", () => {
  const order = ["why-today", "today", "read-and-do", "challenge", "check-yourself", "mistake"];
  const at = order.map((id) => blocks.indexOf(`id: "${id}"`));
  assert.ok(
    at.every((i) => i > 0),
    `missing section: ${order.filter((_, i) => at[i] < 0).join(", ")}`,
  );
  assert.deepEqual(at, [...at].sort((a, b) => a - b), "the six sections are out of order");
});

test("the principle is a lead, not one of the six", () => {
  // An unheaded italic line under the meta — never pushed as a section, so
  // it is not tickable and not counted.
  assert.doesNotMatch(blocks, /id: "principle"/);
  assert.match(page, /\{principle\}/);
  assert.match(page, /italic/);
});

/** ResourceRow's body — bounded by the next top-level function, since the
 *  destructured signature contains a brace at column 0 of its own. */
function resourceRowSource() {
  const start = page.indexOf("function ResourceRow");
  const end = page.indexOf("function CheckRow", start);
  assert.ok(start > 0 && end > start, "ResourceRow should exist before CheckRow");
  return page.slice(start, end);
}

test("the editorial note keeps full contrast when the section is ticked", () => {
  // It is the proof a person curated the page. Dimming it to grey with the
  // rest of the section would flatten the one thing a crawler cannot fake.
  const row = resourceRowSource();
  assert.match(row, /Why this one/);
  assert.match(row, /text-brand-700 italic/);
});

test("a dead resource keeps its row, struck through, with a report link", () => {
  const row = resourceRowSource();
  assert.match(row, /line-through/);
  assert.match(row, /Link broken/);
  assert.match(row, /This source stopped responding/);
  assert.match(row, /\/report/);
});

test("signed out renders everything, with only the action inert", () => {
  assert.match(route, /Sign in to mark this day done/);
  // No gate of any kind around the content.
  assert.doesNotMatch(page, /blur|line-clamp-\[|Sign in to continue/i);
  assert.doesNotMatch(route, /signedIn \? \(?\s*<LessonPage/, "content must not be behind a session");
});

test("ticks work signed out and persist locally", () => {
  assert.match(page, /window\.localStorage\.getItem\(tickStorageKey\)/);
  assert.match(page, /window\.localStorage\.setItem\(tickStorageKey/);
  assert.match(route, /tickStorageKey=\{`jintu:ticks:\$\{nodeId\}`\}/);
  // Never conditioned on a session.
  assert.doesNotMatch(page, /signedIn/);
});

test("a ticked section dims but stays readable, and is never hidden", () => {
  assert.match(page, /const body = ticked \? "text-ink-500" : "text-ink-900"/);
  // ink-500 is 5.12:1. Nothing collapses or unmounts on tick.
  assert.doesNotMatch(page, /ticked \?\s*null/);
  assert.doesNotMatch(page, /ticked && .*hidden/);
});

test("scroll progress is 3px, animated, and coalesced into a frame", () => {
  assert.match(page, /h-\[3px\] bg-brand-700/);
  assert.match(page, /transition-\[width\]/);
  assert.match(page, /requestAnimationFrame/);
});

test("the desktop rail carries per-section ticks and a done count", () => {
  assert.match(page, /isTicked\(b\) \?/, "the rail should read tick state");
  assert.match(page, /\{doneCount\} of \{blocks\.length\} done/);
});

test("no iframe exists until asked for, and it is the nocookie host", () => {
  assert.match(facade, /nocookie/);
  // The iframe must be behind state, not rendered on mount.
  const eager = /^\s*<iframe/m.test(facade) && !/\{(loaded|shown|open|playing)/.test(facade);
  assert.equal(eager, false, "the player must be click-to-load");
  assert.match(facade, /useState/);
});
