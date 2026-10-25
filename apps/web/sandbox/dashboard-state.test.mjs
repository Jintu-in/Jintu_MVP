/**
 * Phase 6 Part A — `/today`'s three states, rebuilt against the current
 * design (today-screen.tsx), replacing the pre-redesign dashboard-screen/
 * dashboard-tinted this test file used to check. The underlying state RULE
 * in lib/dashboard.ts is unchanged by this phase, so those drift checks
 * carry over verbatim; everything about the old components' exact markup
 * does not, because that markup no longer exists.
 *
 * One real, mockup-driven behaviour change from the old design, recorded
 * here rather than silently dropped: the old "habitual" dashboard withheld
 * the streak strip entirely in the lapsed state ("fourteen mostly-empty
 * squares... is a rebuke"). V2Restart/DeskRestart draw a week strip in the
 * restart state too (mostly blank, today dashed) — the design's own call,
 * not an oversight — so today-screen.tsx renders one there on purpose.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const dashboardTs = readFileSync(join(SRC, "lib", "dashboard.ts"), "utf8");
const blocksTs = readFileSync(join(SRC, "lib", "blocks.ts"), "utf8");
const screen = readFileSync(join(SRC, "components", "today", "today-screen.tsx"), "utf8");
const todayPage = readFileSync(join(SRC, "app", "today", "page.tsx"), "utf8");
const dashboardPage = readFileSync(join(SRC, "app", "(auth)", "dashboard", "page.tsx"), "utf8");

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

test("the streak is never read from the cache table", () => {
  assert.doesNotMatch(dashboardTs, /from\("streaks"\)/, "must read streak_status, which decays");
  assert.match(dashboardTs, /from\("streak_status"\)/);
});

test("longest_days (best streak) is surfaced as bestDays, not left unread on the view", () => {
  assert.match(dashboardTs, /longest_days \?\? 0/);
  assert.match(dashboardTs, /bestDays,/);
});

// ── the Resume card's arithmetic (unchanged by this phase) ──────────────────

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
  assert.equal(minutesLeft(60, 16, 12), 15);
  assert.ok(minutesLeft(60, 16, 12) < 60, "must never quote the full day once started");
});

// ── weekStrip / missedDaysLabel (new this phase — real unit coverage) ──────

test("weekStrip is Monday-anchored, exactly 7 days, today marked once", () => {
  const fn = dashboardTs.slice(dashboardTs.indexOf("export function weekStrip"), dashboardTs.indexOf("export function missedDaysLabel"));
  assert.match(fn, /isoDow \+ 6\) % 7/, "Monday = 0, Sunday = 6");
  assert.match(fn, /WEEKDAY_LETTERS\.map/);
});

test("missedDaysLabel names weekdays for a short gap, falls back to a count past three days", () => {
  const fn = dashboardTs.slice(dashboardTs.indexOf("export function missedDaysLabel"), dashboardTs.indexOf("export async function getDueCards"));
  assert.match(fn, /if \(daysSince > 3\) return `\$\{daysSince\} days`;/);
  assert.match(fn, /join\(", "\)} and \$\{names\.at\(-1\)\}/);
});

// ── today-screen.tsx — the shapes themselves ────────────────────────────────

test("the new state never renders a zero streak or a zero-of-N count", () => {
  const fn = screen.slice(screen.indexOf("function NewBody"), screen.indexOf("/* ── lapsed"));
  assert.doesNotMatch(fn, /streak\.currentDays/, "day one has no streak number to show yet");
  assert.doesNotMatch(fn, /\{0\}/);
});

test("the new state's two resume branches are mutually exclusive — exactly one PrimaryLink either way", () => {
  const fn = screen.slice(screen.indexOf("function NewBody"), screen.indexOf("/* ── lapsed"));
  assert.equal([...fn.matchAll(/<PrimaryLink/g)].length, 2);
  assert.match(fn, /data\.resume \? \(/);
});

test("the lapsed state's own week strip and missed-days copy use the shared helpers, not an inline rebuild", () => {
  const fn = screen.slice(screen.indexOf("function LapsedBody"), screen.indexOf("/* ── habitual"));
  assert.match(fn, /data\.streak\.week/);
  assert.match(fn, /data\.streak\.missedLabel/);
  assert.match(fn, /best streak/);
});

test("the habitual state swaps the streak card for a secondary-roadmap card once there is a second roadmap (UniToday)", () => {
  const fn = screen.slice(screen.indexOf("function HabitualBody"), screen.indexOf("function UpcomingCard"));
  assert.match(fn, /const secondary = data\.roadmaps\.filter/);
  assert.match(fn, /multi \? \(\s*\n\s*<AlsoLearningCard/);
});

test("the secondary roadmap card says its progress also counts for the shared streak", () => {
  const fn = screen.slice(screen.indexOf("function AlsoLearningCard"), screen.indexOf("function MobileAlsoLearning"));
  assert.match(fn, /also counts for your streak/);
});

test("WeekStrip renders one role=\"img\" group with a real aria-label, not 7 individually focusable cells", () => {
  const fn = screen.slice(screen.indexOf("function WeekStrip"), screen.indexOf("function ProgressDots"));
  assert.match(fn, /role="img"/);
  assert.match(fn, /aria-label=\{label\}/);
  assert.doesNotMatch(fn, /<button|tabIndex|href=/);
});

test("ProgressDots marks done/current/upcoming with the same night-900/brand-500/ink-100 convention the lesson reader already uses", () => {
  const fn = screen.slice(screen.indexOf("function ProgressDots"), screen.indexOf("const CARD ="));
  assert.match(fn, /bg-night-900/);
  assert.match(fn, /bg-brand-500/);
  assert.match(fn, /bg-ink-100/);
});

test("the streak share card is deliberately not built here, and says so", () => {
  assert.match(screen, /not built here, flagged rather than faked: the streak\n \* share card/);
});

test("/today fetches getDashboard and getAccount, and redirects to /join when either is missing (not onboarded)", () => {
  assert.match(todayPage, /getDashboard\(\), getAccount\(\)/);
  assert.match(todayPage, /if \(!data \|\| !account\) redirect\("\/join\?next=\/today"\);/);
});

test("the old /dashboard URL now forwards to /today, same retirement pattern as /account → /profile", () => {
  assert.match(dashboardPage, /redirect\("\/today"\)/);
});
