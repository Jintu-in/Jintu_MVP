/**
 * Phase 6 Part D — /review restyled against V2Review/DeskReview.
 * Source-text assertions, same convention as the rest of this directory.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

const dashboardTs = readFileSync(join(SRC, "lib", "dashboard.ts"), "utf8");
const session = readFileSync(join(SRC, "components", "review", "review-session.tsx"), "utf8");
const page = readFileSync(join(SRC, "app", "(auth)", "review", "page.tsx"), "utf8");
const actions = readFileSync(join(SRC, "actions", "reviews.ts"), "utf8");

test("getDueCards reads the due date in the viewer's own timezone, not the server's UTC day", () => {
  const fn = dashboardTs.slice(dashboardTs.indexOf("export async function getDueCards"));
  assert.match(fn, /todayIn\(profileRes\.data\?\.timezone \?\? "UTC"\)/);
  assert.match(fn, /\.lte\("due_on", today\)/);
  assert.doesNotMatch(fn, /new Date\(\)\.toISOString\(\)\.slice\(0, 10\)/);
});

test("\"Lesson N · title\" needs the node's place across the WHOLE roadmap — one getRoadmap() per distinct roadmap, not per card", () => {
  const fn = dashboardTs.slice(dashboardTs.indexOf("export async function getDueCards"));
  assert.match(fn, /const roadmapSlugs = \[/);
  assert.match(fn, /positionByNodeSlug/);
  assert.match(fn, /from: published && position && c\.nodes \? `Lesson \$\{position\} · \$\{c\.nodes\.title\}` : null/);
});

test("grading revalidates /today, not the retired /dashboard", () => {
  assert.match(actions, /revalidatePath\("\/today"\)/);
  assert.doesNotMatch(actions, /revalidatePath\("\/dashboard"\)/);
});

test("/review has no AppShell — chromeless like the lesson reader's Quiz route, matching both mockups drawing no sidebar or tab bar", () => {
  assert.doesNotMatch(page, /AppShell/);
  assert.match(page, /Two minutes, before today/);
});

test("the whole batch is fetched once and advanced on the client — no server round-trip per card", () => {
  assert.match(page, /getDueCards\(20\)/);
  assert.match(session, /const \[i, setI\] = useState\(0\)/);
  assert.match(session, /setI\(\(n\) => n \+ 1\)/);
});

test("no fabricated \"why\" explanation and no presumed terminal/code styling — a card is only ever front and back", () => {
  assert.doesNotMatch(session, /\bwhy\b/i);
  assert.doesNotMatch(session, /\$\{cur\.prompt\}|prompt:|bg-\[#0A1F24\]|#0a1f24/i);
});

test("the revealed answer renders cur.back as plain text", () => {
  const fn = session.slice(session.indexOf("export function ReviewSession"));
  assert.match(fn, /\{cur\.back\}/);
});

test("the four ratings match review_card_grade's own accepted values, in order, with Easy the one filled action", () => {
  const fn = session.slice(session.indexOf("const RATINGS"), session.indexOf("export function ReviewSession"));
  assert.match(fn, /key: "again".*key: "hard".*key: "good".*key: "easy"/s);
  assert.match(fn, /strong: true/);
});

test("progress pills and the due count both derive from the live client index i, not a server re-fetch", () => {
  const fn = session.slice(session.indexOf("export function ReviewSession"));
  assert.match(fn, /aria-label=\{`\$\{i\} of \$\{cards\.length\} cards done`\}/);
});

test("a rating is optimistic (advances immediately) and a failed save surfaces inline without blocking progress", () => {
  const fn = session.slice(session.indexOf("const onRate ="), session.indexOf("return ("));
  assert.match(fn, /execute\(\{ cardId: cur\.id, rating \}\);/);
  assert.match(fn, /setI\(\(n\) => n \+ 1\);/);
  assert.match(session, /onError: \(\) => setHadError\(true\)/);
});
