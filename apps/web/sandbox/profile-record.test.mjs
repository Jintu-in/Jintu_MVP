/**
 * Phase 6 Part B — /profile's record half (V2Profile/DeskProfile),
 * deferred since Part A of the account rework. Source-text assertions,
 * same convention as the rest of this directory.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

const recordLib = readFileSync(join(SRC, "lib", "profile-record.ts"), "utf8");
const recordUi = readFileSync(join(SRC, "components", "profile", "profile-record.tsx"), "utf8");
const header = readFileSync(join(SRC, "components", "profile", "profile-header.tsx"), "utf8");
const page = readFileSync(join(SRC, "app", "(auth)", "profile", "page.tsx"), "utf8");

test("getMyRecord degrades to null when signed out or never onboarded, same posture as getAccount", () => {
  assert.match(recordLib, /if \(!user\) return null;/);
  assert.match(recordLib, /if \(!profileRes\.data\) return null;/);
});

test("the grid is Monday-aligned using the same arithmetic as lib/dashboard.ts's weekStrip", () => {
  assert.match(recordLib, /isoDow \+ 6\) % 7/);
  assert.match(recordLib, /WEEKS \* 7 - 1|WEEKS - 1\) \* 7/);
});

test("one 112-cell query serves both breakpoints — no second fetch for the mobile 5-week slice", () => {
  assert.match(recordLib, /const WEEKS = 16;/);
  assert.doesNotMatch(recordLib, /WEEKS = 5/);
  assert.match(recordUi, /weeks\.slice\(-35\)/);
});

test("each cell knows done, isToday and isFuture — the three states the mockup's own cell generator distinguishes", () => {
  assert.match(recordLib, /done: doneDates\.has\(date\), isToday: date === today, isFuture: date > today/);
});

test("finished nodes group by roadmap — \"Finished in X\" per roadmap, not one undifferentiated list", () => {
  assert.match(recordLib, /const groups = new Map<string, FinishedGroup>\(\);/);
  assert.match(recordLib, /roadmapTitle: roadmap\.title, roadmapSlug: roadmap\.slug/);
});

test("the weeks grid reuses the exact same flat array for both layouts — CSS auto-flow reshapes it, not a JS transpose", () => {
  assert.match(recordUi, /grid-flow-row/);
  assert.match(recordUi, /grid-flow-col/);
  assert.match(recordUi, /<WeekCells cells={last35} \/>/);
  assert.match(recordUi, /<WeekCells cells={weeks} \/>/);
  assert.doesNotMatch(recordUi, /transpose|reverse\(\)/i);
});

test("WeekCells marks done/today/future with the mockup's own three treatments: amber fill, dashed amber ring, dashed grey ring", () => {
  const fn = recordUi.slice(recordUi.indexOf("function WeekCells"), recordUi.indexOf("const WEEKDAY_LETTERS"));
  assert.match(fn, /bg-amber-500/);
  assert.match(fn, /border-2 border-dashed border-amber-600/);
  assert.match(fn, /border border-dashed border-ink-200/);
});

test("the day-one empty state and the real record are mutually exclusive on /profile", () => {
  assert.match(page, /!record \? \(\s*\n\s*<RecordEmptyState \/>/);
  assert.match(page, /const record = account\.hasRecord \? await getMyRecord\(\) : null;/);
});

test("the record is fetched only when hasRecord is true — day one pays nothing for a record it doesn't have", () => {
  const fn = page.slice(page.indexOf("export default async function ProfilePage"));
  assert.match(fn, /account\.hasRecord \? await getMyRecord\(\) : null/);
});

test("ProfileHeader's desktop hero gets a bigger mark and the stat trio inside the card; mobile keeps them separate", () => {
  const fn = header.slice(header.indexOf("hidden items-center gap-7"), header.indexOf("{copied ?"));
  assert.match(fn, /IdentityMark avatarAnimal=\{avatarAnimal\} avatarColor=\{avatarColor\} size=\{104\}/);
  assert.match(fn, /stats \? \(/);
  assert.match(fn, /day streak/);
  assert.match(fn, /days learned/);
});

test("the desktop share button is labelled text, not the icon-only mobile circle", () => {
  const fn = header.slice(header.indexOf("hidden items-center gap-7"), header.indexOf("{copied ?"));
  assert.match(fn, /<span>Share profile<\/span>/);
});

test("mobile's stat row shows lessons (not days-learned) — the two breakpoints draw genuinely different metric sets, faithfully", () => {
  const fn = page.slice(page.indexOf("const [account, momentum]"), page.indexOf("<section"));
  assert.match(fn, /record\.lessonsDone/);
  assert.match(fn, />lessons</);
});
