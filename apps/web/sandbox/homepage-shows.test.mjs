/**
 * The homepage shows the product rather than describing it.
 *
 *   node apps/web/sandbox/homepage-shows.test.mjs
 *
 * The rule: if a sentence describes something visual, the sentence goes and
 * the thing appears. That is easy to apply once and easy to undo by accident
 * — a later edit that "adds a bit of explanation" under a heading puts the
 * claim back without removing the component, and the page is describing
 * itself again with the evidence sitting right there unread.
 *
 * So each section that was converted gets a line here naming the sentence
 * that must stay gone and the component that must stay.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const home = readFileSync(join(SRC, "components", "marketing", "homepage.tsx"), "utf8");
const mini = readFileSync(join(SRC, "components", "marketing", "product-miniatures.tsx"), "utf8");
const route = readFileSync(join(SRC, "app", "(home)", "page.tsx"), "utf8");

test("the spine is real modules, not a drawn approximation", () => {
  assert.match(route, /listModules\(FLAGSHIP\)/, "read from the database");
  assert.match(home, /<ModuleSpine modules=\{spine\}/, "and handed to the component");
  assert.ok(
    !home.includes("Twenty modules in one order"),
    'the sentence claiming a spine must not sit next to the spine',
  );
});

test("each of the four steps carries the component it names", () => {
  const block = /\{STEPS\.map\(\(\[n, head, body\], i\) => \([\s\S]*?\)\)\}/.exec(home)?.[0] ?? "";
  for (const c of ["ModuleSpine", "DayCardMini", "StreakStrip", "ContribGrid"]) {
    assert.ok(block.includes(c), `${c} should ride in a step`);
  }
  assert.match(block, /className="mt-4 h-24"/, "96px, per the brief");
});

test("the streak card is the strip, and the strip has a gap in it", () => {
  assert.match(home, /<h3[^>]*>The streak<\/h3>\s*\{\/\*[\s\S]*?\*\/\}\s*<StreakStrip/);
  const days = /const STREAK_DAYS = \[([^\]]*)\]/.exec(mini)?.[1] ?? "";
  assert.ok(days.includes("0"), "a strip with no missed day illustrates a claim nobody made");
});

test("checked-by-a-person shows a real note, not a written-out example", () => {
  assert.match(home, /<LinkCardMini resource=\{samples\[1\]\}/);
  assert.match(route, /sampleResources\(/);
  assert.match(mini, /not \(select 1|editorNote/, "the note is what the card is for");
});

test("the highlight carries the day it came from", () => {
  assert.match(home, /<cite[\s\S]{0,200}Day 31/, "a quote with no citation is not 'yours to keep'");
});

test("the day page's notes are anchored, not a second list beside it", () => {
  assert.match(home, /const ANNOTATIONS = \[/);
  assert.match(home, /h-px w-14 flex-none bg-brand-500/, "a connector runs to the card at lg");
  assert.ok(!home.includes("const BULLETS"), "the unanchored list is gone");
});

test("pricing is the number, not a tick list", () => {
  assert.ok(!home.includes("FREE_INCLUDES"), "the three bullets are gone");
  assert.match(home, /text-\[92px\][^"]*sm:text-\[128px\]/, "₹0 at display size");
});

test("the close has cards cropped by the section, and only where they can crop", () => {
  assert.match(home, /overflow-hidden px-5 py-16 text-center/, "the section does the cropping");
  assert.match(home, /rotate-\[-7deg\]/);
  assert.match(home, /hidden lg:block/, "at 390px there is no margin to crop into");
});

test("the source wall stays names — never logos, never a screenshot", () => {
  assert.match(home, /Names, never logos/, "the reason is written down where the change would be made");
  assert.match(home, /samples\.slice\(2\)\.map/, "our own rendering of their link, not their page");
  assert.ok(!/<img/.test(home), "no third-party imagery on this page at all");
});

test("every miniature is decorative and paired with words that carry the claim", () => {
  for (const c of ["ModuleSpine", "StreakStrip", "ContribGrid", "DayCardMini", "CategoryCap"]) {
    const body = new RegExp(`export function ${c}\\(`).exec(mini);
    assert.ok(body, `${c} should exist`);
  }
  // A screen reader should hear each claim once, in words.
  assert.equal((mini.match(/aria-hidden/g) ?? []).length >= 5, true);
});

test("the contribution grid is deterministic", () => {
  assert.ok(!mini.includes("Math.random("), "a random fill differs between server and client");
  assert.match(mini, /const filled = \(i: number\)/);
});
