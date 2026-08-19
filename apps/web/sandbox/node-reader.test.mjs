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
  const check = blocks.indexOf("id: `check-");
  const mistake = blocks.indexOf('id: "mistake"');
  assert.ok(challenge > 0 && check > 0, "both sections should be built");
  assert.ok(check > challenge, "retrieval practice belongs after doing, not before");
  assert.ok(mistake > check, "the mistake follows the checks");
});

test("a null section is omitted, never rendered as an empty heading", () => {
  for (const guard of [
    "if (node.summary)",
    "if (node.whyToday)",
    "if (node.challenge)",
    "if (node.commonMistake)",
    "if (node.principle)",
  ]) {
    assert.ok(blocks.includes(guard), `${guard} missing — a null field would render an empty block`);
  }
  assert.match(blocks, /if \(node\.topics\.length > 0\)/);
  assert.match(blocks, /for \(const c of node\.checks\)/);
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
