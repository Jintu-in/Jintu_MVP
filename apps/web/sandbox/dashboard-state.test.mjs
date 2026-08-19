/**
 * The dashboard's three states, and the promises each one makes.
 *
 *   node --test sandbox/dashboard-state.test.mjs
 *
 * Two kinds of assertion here, because the screen makes two kinds of claim.
 *
 * The state RULE is duplicated below rather than imported, following the
 * house pattern (lib/ is TypeScript and this runner is plain node). Copied
 * logic drifts, so every copy is paired with a drift check that greps the
 * real source for the same thresholds — change 4 or 3 in lib/dashboard.ts
 * and this suite fails rather than quietly testing a fossil.
 *
 * The LAYOUT claims — no strip in the lapsed state, no zeros in the new
 * state, one filled button each — are checked against the component source,
 * because the three states are compile-time branches rather than runtime
 * data. That is what "the shape changes" means in practice.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const dashboardTs = readFileSync(join(SRC, "lib", "dashboard.ts"), "utf8");
const blocksTs = readFileSync(join(SRC, "lib", "blocks.ts"), "utf8");
const screenTsx = readFileSync(
  join(SRC, "components", "dashboard", "dashboard-screen.tsx"),
  "utf8",
);
const tintedTsx = readFileSync(
  join(SRC, "components", "dashboard", "dashboard-tinted.tsx"),
  "utf8",
);

/** Mirror of the rule in lib/dashboard.ts — kept honest by the drift test. */
const dashboardState = (totalDays, daysSince) =>
  totalDays < 4 ? "new" : daysSince !== null && daysSince >= 3 ? "lapsed" : "habitual";

test("the rule this file mirrors is still the rule in lib/dashboard.ts", () => {
  assert.match(dashboardTs, /totalDays < 4/, "the `new` threshold moved");
  assert.match(dashboardTs, /daysSince >= 3/, "the `lapsed` threshold moved");
  assert.match(
    dashboardTs,
    /totalDays < 4 \? "new" : daysSince !== null && daysSince >= 3 \? "lapsed" : "habitual"/,
    "the state expression changed shape",
  );
});

test("a brand-new account is `new` until it has four days", () => {
  assert.equal(dashboardState(0, null), "new");
  assert.equal(dashboardState(1, 0), "new");
  assert.equal(dashboardState(3, 0), "new");
  assert.equal(dashboardState(4, 0), "habitual");
});

test("`new` wins over `lapsed` — someone two days in has nothing to have lost", () => {
  assert.equal(dashboardState(2, 40), "new");
});

test("three days away is lapsed; two is still habitual", () => {
  assert.equal(dashboardState(47, 0), "habitual");
  assert.equal(dashboardState(47, 1), "habitual");
  assert.equal(dashboardState(47, 2), "habitual");
  assert.equal(dashboardState(47, 3), "lapsed");
  assert.equal(dashboardState(47, 9), "lapsed");
});

test("a long-running account that has never lapsed has no days_since", () => {
  assert.equal(dashboardState(47, null), "habitual");
});

// ── the Resume card's arithmetic ─────────────────────────────────────────────

/** Mirror of minutesLeft in lib/blocks.ts. */
const minutesLeft = (est, blocks, position) => {
  if (!blocks || position === null || position <= 0) return est;
  const remaining = Math.max(0, blocks - position);
  if (remaining === 0) return 1;
  return Math.max(1, Math.round((est * remaining) / blocks));
};

test("the mirrored minutesLeft matches lib/blocks.ts", () => {
  assert.match(blocksTs, /Math\.round\(\(estMinutes \* remaining\) \/ blocks\)/);
});

test("minutes remaining, not day length — the whole point of the card", () => {
  // Twelve blocks into sixteen of a sixty-minute day: a quarter is left.
  assert.equal(minutesLeft(60, 16, 12), 15);
  assert.ok(minutesLeft(60, 16, 12) < 60, "must never quote the full day once started");
});

test("an unopened day quotes its real length, because nothing is done yet", () => {
  assert.equal(minutesLeft(60, 16, null), 60);
});

test("a day read to the last block never says 0 min left", () => {
  assert.equal(minutesLeft(60, 16, 16), 1);
  assert.equal(minutesLeft(60, 16, 99), 1);
});

// ── the layouts ──────────────────────────────────────────────────────────────

/** The source of one state's branch, so claims are scoped to that state. */
function branch(state) {
  const marks = {
    new: ['if (data.state === "new")', 'if (data.state === "lapsed")'],
    lapsed: ['if (data.state === "lapsed")', "// ── HABITUAL"],
    habitual: ["// ── HABITUAL", "\n/**\n * One section's worth"],
  }[state];
  const a = screenTsx.indexOf(marks[0]);
  const b = screenTsx.indexOf(marks[1], a + 1);
  assert.ok(a !== -1 && b > a, `could not isolate the ${state} branch`);
  return screenTsx.slice(a, b);
}

test("the new state renders no streak strip, no stat cards, no roadmap list", () => {
  const s = branch("new");
  assert.doesNotMatch(s, /<StreakStrip/, "a strip of empty squares on day two");
  assert.doesNotMatch(s, /<CountCard/, "stat cards full of zeros on day two");
  assert.doesNotMatch(s, /<RoadmapList/, "a roadmap list before there is a habit");
});

test("the new state contains no zero — no 0 streak, no 0 of N", () => {
  const s = branch("new");
  assert.doesNotMatch(s, /\b0 day\b/);
  assert.doesNotMatch(s, /\{0\}/);
  assert.doesNotMatch(s, /0 of /);
  // currentDays is the number that would be 0 here; it must not be rendered.
  assert.doesNotMatch(s, /streak\.currentDays/);
});

test("the lapsed state renders no streak strip", () => {
  assert.doesNotMatch(branch("lapsed"), /<StreakStrip/);
});

test("the lapsed state leads with what survived, then one small action", () => {
  const s = branch("lapsed");
  assert.match(s, /days are still here/);
  assert.match(s, /The smallest way back/);
  assert.match(s, /Read one section/);
  assert.match(s, /Reread day/, "the escape hatch to the previous day");
  assert.match(s, /they can keep/, "explicit permission to ignore review and saved");
});

test("the habitual state delegates to the tinted dashboard", () => {
  // The returning learner's home is the design project's "Dashboard
  // tinted". New and lapsed keep their own layouts here, because the rule
  // that produced them is unchanged.
  assert.ok(branch("habitual").includes("<TintedDashboard data={data} />"));
});

test("the tinted dashboard carries the strip, the resume card and the list", () => {
  assert.match(tintedTsx, /role="img"/, "the fourteen-day strip");
  assert.match(tintedTsx, /Pick up where you stopped/);
  assert.match(tintedTsx, /Your roadmaps/);
  assert.ok(tintedTsx.includes("No deadlines here. These wait for you."));
});

test("exactly one filled button per state", () => {
  for (const state of ["new", "lapsed", "habitual"]) {
    const s = branch(state);
    const filled = [...s.matchAll(/<PrimaryAction/g)].length;
    if (state === "new") {
      // Two mutually exclusive branches (a resume target, or none at all),
      // so at most one can render.
      assert.equal(filled, 2, "the new state's two exclusive branches");
      assert.match(s, /data\.resume \? \(/, "and they are exclusive");
    } else if (state === "habitual") {
      // Delegated entirely — the filled button lives in the tinted file.
      assert.equal(filled, 0);
      assert.equal([...s.matchAll(/<TintedDashboard/g)].length, 1);
    } else {
      assert.equal(filled, 1);
    }
  }
  // In the tinted layout the one filled control is Resume; every other
  // action on that screen is outlined or a plain link.
  assert.ok(tintedTsx.includes("Resume →"), "the tinted dashboard needs its primary action");
  assert.equal(
    (tintedTsx.match(/bg-brand-700 text-white/g) ?? []).length,
    2,
    "exactly two filled surfaces: the Resume button and the Continue card action",
  );
});

test("the streak strip is one element, not fourteen tab stops", () => {
  // Lives in the tinted file now — the habitual layout moved there.
  const strip = tintedTsx.slice(
    tintedTsx.indexOf("function ActivityStrip"),
    tintedTsx.indexOf("The 6px cap"),
  );
  assert.ok(strip.length > 0, "ActivityStrip should be findable");
  assert.match(strip, /role="img"/);
  assert.match(strip, /aria-label=/);
  assert.match(strip, /aria-hidden/, "every square is hidden from the reader");
  assert.doesNotMatch(strip, /<button|tabIndex|href/, "squares must not be focusable");
});

test("the points total is present, and deliberately so", () => {
  // TWO BRIEFS DISAGREE HERE, and this test records which one won.
  //
  // S6 said "DO NOT add a points total" — anything that is not the next
  // action competes with the next action. "Dashboard tinted" then shows
  // "1,240 pts" as a chip in the stats row. The later design wins, but the
  // original reason has not evaporated: the number is a quiet chip beside
  // "days learned", never a headline, and nothing ranks or compares it
  // (invariant 5 — momentum, never a credential).
  //
  // If the ban is reinstated, delete the chip and flip this back.
  assert.ok(tintedTsx.includes("data.points"), "the chip should render a points total");
  assert.ok(tintedTsx.includes(" pts"), "and label it");
  assert.match(tintedTsx, /Momentum, not a credential/);
  assert.doesNotMatch(tintedTsx, /rank|percentile|top \d+%/i);
});

test("the streak is never read from the cache table", () => {
  assert.doesNotMatch(dashboardTs, /from\("streaks"\)/, "must read streak_status, which decays");
  assert.match(dashboardTs, /from\("streak_status"\)/);
});
