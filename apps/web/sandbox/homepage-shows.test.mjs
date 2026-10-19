/**
 * The job-first homepage: every count on it is read, never written.
 *
 *   node apps/web/sandbox/homepage-shows.test.mjs
 *
 * This replaced an earlier aggregator-style homepage (search bar, a 91-day
 * grid, a module "spine") with the redesign's job-first one: pick a field,
 * meet the roles in it, then the roadmap. The one rule carried over from the
 * old suite is the one that matters most: a number on this page must come
 * off a real row, never be typed in because the mockup showed a round one.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const home = readFileSync(join(SRC, "components", "marketing", "homepage.tsx"), "utf8");
const route = readFileSync(join(SRC, "app", "(home)", "page.tsx"), "utf8");
const art = readFileSync(join(SRC, "components", "marketing", "homepage-field-art.tsx"), "utf8");

test("the old aggregator miniatures are gone, not just unused", () => {
  assert.ok(
    !existsSync(join(SRC, "components", "marketing", "product-miniatures.tsx")),
    "ModuleSpine/DayCardMini/StreakStrip/ContribGrid had no caller left after the rebuild " +
      "and were deleted rather than kept as dead weight the guard would otherwise flag",
  );
});

test("the hero's role chips and their count are both read, not written", () => {
  assert.match(route, /rolesInDomain\(d\.key\)\[0\]\?\.title/, "one real role per field, not file order");
  assert.match(route, /ROLES\.length - heroChips\.length/, "the '+N more' count is derived");
  assert.match(home, /heroChips\.map/, "and the component renders whatever it is handed");
  assert.ok(!/\+53 more/.test(home), "the mockup's own illustrative count must not survive as a literal");
});

test("every field tile's role list and overflow count are derived per-domain", () => {
  assert.match(route, /rolesInDomain\(d\.key\)/);
  assert.match(route, /Math\.max\(0, roles\.length - 2\)/, "moreCount is never typed in");
  assert.match(home, /field\.roleTitles\.join/);
  assert.match(home, /field\.moreCount > 0/, "the '+N more' span hides itself rather than ever showing +0");
});

test("the ten field illustrations are keyed by the real role domain, not a grid position", () => {
  assert.match(art, /RoleDomain/);
  for (const domain of [
    "software",
    "data",
    "product",
    "gtm",
    "marketing",
    "design",
    "operations",
    "health",
    "finance",
    "other",
  ]) {
    assert.match(art, new RegExp(`${domain}:\\s*\\w+FieldArt`), `${domain} should have an illustration`);
  }
});

test("'open now' is read from the real catalogue, never asserted", () => {
  assert.match(route, /listPublishedRoadmaps\(\)/);
  assert.match(route, /openSlugs\.has\(p\.slug\)/, "a planned roadmap is 'open' only once it is actually published");
  assert.match(home, /r\.open \? \(/, "the badge itself is conditional on the real flag");
  // The mockup's own illustrative framing — a round "ten roadmaps" and "one
  // open today" — must not survive as a hardcoded string once this reads a
  // real, currently-smaller-or-larger catalogue.
  assert.ok(!/Ten roadmaps, opening one at a time/.test(home), "the literal mockup copy must not survive verbatim");
  assert.match(home, /\{openRoadmapCount\} of \{totalRoadmapCount\}/, "the heading itself interpolates the real counts");
});

test("the planned-roadmap list is real content, not invented titles", () => {
  // Every title in PLANNED_ROADMAPS must correspond to an actual file this
  // repo ships — docs/roadmaps/<slug>.mjs — so the "coming soon" list can
  // never claim a roadmap that does not exist anywhere as real content.
  const slugs = [...route.matchAll(/slug:\s*"([a-z-]+)"/g)].map((m) => m[1]);
  assert.ok(slugs.length >= 9, "the planned catalogue should list the real docs/roadmaps/*.mjs files");
  assert.ok(!slugs.includes("dsa-starter"), "a roadmap with no content file anywhere must not be listed as planned");
});

test("the self-check copy says what it is: no score, no grading", () => {
  // CLAUDE.md's hard invariant: no grading, no verification, as an option or
  // otherwise. The homepage's own "inside a lesson" section is the one place
  // a visitor could read this as a graded product if it slipped back in.
  assert.match(home, /No score is kept/);
  assert.ok(!/\bgrade[ds]?\b/i.test(home), "no grading language anywhere on the page");
  assert.ok(!/\bcorrect answer\b/i.test(home), "nor language implying a right answer is checked for you");
});

test("what this is not says the job line is a negation, never a guarantee", () => {
  assert.match(home, /We do not promise you a job\./);
  assert.ok(!/\bguarantee/i.test(home), "no guarantee language anywhere on the page");
  // Not a bare "100%" — the svg illustrations legitimately carry
  // width="100%" — only the banned claim shapes themselves.
  assert.ok(!/100% placement|job assured|job[- ]?placement/i.test(home), "nor any of the other banned claim shapes");
});

test("there is no third-party imagery on the page — illustration only", () => {
  assert.ok(!/<img/.test(home), "every visual is drawn (svg), never someone else's screenshot or logo");
});

test("the sections run in the order the story is told in", () => {
  const at = (needle) => {
    const i = home.indexOf(needle);
    assert.ok(i > -1, `missing: ${needle}`);
    return i;
  };
  const order = [
    'id="fields"',
    'id="how-it-works"',
    "Inside a lesson",
    "As you learn</div>",
    "From twelve open tabs",
    'id="all"',
    'id="free"',
    'id="faq"',
    "Your first lesson takes about 15 minutes",
  ].map(at);
  assert.deepEqual(order, [...order].sort((a, b) => a - b), "sections are out of order");
});

test("the hero CTA points at a real route — not the mockup's unbuilt goal screen", () => {
  // The design's own "Find my roadmap" button targets a goal-picker screen
  // (V2Goal.dc.html) that was never built as a real flow. Pointing there
  // would pixel-match a button into a 404, which is worse than landing on
  // the real catalogue page it is standing in for.
  assert.ok((home.match(/Find my roadmap/g) ?? []).length >= 2, "both CTAs carry the label");
  assert.ok(!/href="\/goal"|V2Goal/.test(home), "no link to the unbuilt goal-picker flow anywhere on the page");
});

test("the 'As you learn' share card is a labelled illustration, not a claim about a real learner", () => {
  assert.match(home, /is an illustration of/i, "the comment says plainly that this is not real user data");
  assert.match(home, /Asha is on a 3 day streak/);
});
