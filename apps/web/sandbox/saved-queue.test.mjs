/**
 * The saved queue's promises, checked against the source.
 *
 * The two that matter are behavioural and easy to get wrong later:
 * marking read must MOVE a row (consumed_at) rather than delete it, and
 * the list must page rather than scroll forever.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const actions = readFileSync(join(SRC, "actions", "saves.ts"), "utf8");
const lib = readFileSync(join(SRC, "lib", "saved.ts"), "utf8");
const list = readFileSync(join(SRC, "components", "account", "saved-list.tsx"), "utf8");
const page = readFileSync(
  join(SRC, "app", "(auth)", "profile", "saved", "page.tsx"),
  "utf8",
);

test("marking read sets consumed_at and does not delete", () => {
  const fn = /export const consumeSave[\s\S]*?\n  \}\);/.exec(actions);
  assert.ok(fn, "consumeSave should exist");
  assert.match(fn[0], /update\(\{ consumed_at/);
  assert.doesNotMatch(fn[0], /\.delete\(\)/, "consuming must never delete the row");
});

test("removing is a different act, and does delete", () => {
  const fn = /export const removeSave[\s\S]*?\n  \}\);/.exec(actions);
  assert.ok(fn, "removeSave should exist");
  assert.match(fn[0], /\.delete\(\)/);
});

test("the queue hides consumed rows, so a read item leaves the list", () => {
  assert.match(lib, /\.is\("consumed_at", null\)/);
});

test("the header states the cost, not just the count", () => {
  assert.match(page, /queue\.count/);
  assert.match(page, /totalMinutes/);
  assert.match(lib, /totalMinutes: Math\.round\(totalSeconds \/ 60\)/);
});

test("the source line is built from real columns", () => {
  for (const col of ["duration_sec", "est_size_mb", "source_name", "editor_note"]) {
    assert.ok(lib.includes(col), `${col} missing from the query`);
  }
});

test("a saved item links back to the node it came from", () => {
  assert.match(lib, /nodeHref/);
  assert.match(lib, /\/learn\/\$\{roadmap\.slug\}\/\$\{res\.nodes\.slug\}/);
  // Never into a draft roadmap: that link would 404 for its own owner.
  assert.match(lib, /roadmap\.status === "published"/);
});

test("fifty at a time, behind a button — never infinite scroll", () => {
  assert.match(list, /const PAGE = 50/);
  assert.match(list, /Show more/);
  assert.doesNotMatch(list, /IntersectionObserver|onScroll|scrollTop/);
});

test("the empty state names the action that fills it", () => {
  assert.match(list, /Tap save on any resource you want to come back to/);
  assert.match(list, /not in\s*\n?\s*a browser tab you will close/);
});
