/**
 * Phase 5 Part D (2/2) — the Done screen's "Share your progress" card
 * (V2Done/DeskDone), deferred since Part A. Source-text assertions, same
 * convention as the rest of this directory.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

const shareLib = readFileSync(join(SRC, "lib", "share-card.ts"), "utf8");
const states = readFileSync(join(SRC, "components", "lesson", "lesson-states.tsx"), "utf8");
const route = readFileSync(join(SRC, "components", "lesson", "lesson-route.tsx"), "utf8");
const dayPage = readFileSync(join(SRC, "app", "(learning)", "learn", "[slug]", "[node]", "page.tsx"), "utf8");
const imageRoute = readFileSync(join(SRC, "app", "api", "share-card", "[slug]", "[node]", "route.tsx"), "utf8");

test("getMyFirstName takes just the first word, and degrades to null rather than throwing", () => {
  assert.match(shareLib, /function firstNameOf\(name: string \| null\): string \| null/);
  assert.match(shareLib, /name\?\.trim\(\)\.split\(\/\\s\+\/\)\[0\]/);
  assert.match(shareLib, /catch \{\s*\n\s*return null;/);
});

test("shareHeadline falls back to \"You\" when no name is known — never blank, never a stray undefined", () => {
  assert.match(shareLib, /`\$\{firstName \?\? "You"\} finished \$\{nodeTitle\}\.`/);
});

test("shareStreakLine stays singular \"day streak\" at every count, matching StatCard's own label", () => {
  assert.match(shareLib, /`\$\{days\} day streak`/);
  assert.doesNotMatch(shareLib, /days streak/);
});

test("the day page computes the share strings once, with the same helpers the downloadable image uses, and threads them to LessonRoute", () => {
  assert.match(dayPage, /getMyFirstName, shareHeadline, shareLessonLine/);
  assert.match(dayPage, /getMyFirstName\(\)/);
  assert.match(dayPage, /shareHeadline=\{shareHeadline\(firstName, node\.title\)\}/);
  assert.match(dayPage, /shareLessonLine=\{shareLessonLine\(at \+ 1, flat\.length, roadmap\.title\)\}/);
});

test("shareUrl is absolute (built from getSiteUrl) and shareImagePath is a relative, same-origin path", () => {
  assert.match(dayPage, /shareUrl=\{new URL\(`\/learn\/\$\{slug\}\/\$\{node\.slug\}`, getSiteUrl\(\)\)\.toString\(\)\}/);
  assert.match(dayPage, /shareImagePath=\{`\/api\/share-card\/\$\{slug\}\/\$\{node\.slug\}`\}/);
});

test("lesson-route.tsx threads all four share props through to LessonDoneScreen unchanged", () => {
  for (const prop of ["shareHeadline", "shareLessonLine", "shareUrl", "shareImagePath"]) {
    assert.match(route, new RegExp(`${prop}=\\{${prop}\\}`));
  }
});

test("ShareCard uses brand-500/on-brand — the one fill in this codebase where brand-500 is allowed to carry text", () => {
  const fn = states.slice(states.indexOf("function ShareCard"), states.indexOf("async function copyShareUrl"));
  assert.match(fn, /bg-brand-500 p-\[18px\] text-on-brand/);
  assert.match(fn, /bg-on-brand px-3 text-\[12\.5px\] font-semibold text-white/);
  assert.match(fn, /\{streakDays\} day streak/);
});

test("Share tries a file attachment first, falls back to a text+link share, and falls back again to copying the link when there is no Web Share API at all", () => {
  const fn = states.slice(states.indexOf("function ShareButtons"), states.indexOf("function StatCard"));
  assert.match(fn, /if \(!nav\.share\) \{\s*\n\s*flashCopied\(await copyShareUrl\(shareUrl\)\);/);
  assert.match(fn, /nav\.canShare\(\{ files: \[file\] \}\)/);
  assert.match(fn, /await nav\.share\(\{ title: "jintu", text: shareText, url: shareUrl \}\);/);
});

test("Copy link shows \"Copied\" feedback and reverts on its own, rather than a silent no-op", () => {
  const fn = states.slice(states.indexOf("function ShareButtons"), states.indexOf("function StatCard"));
  assert.match(fn, /copied \? "Copied" : "Copy link"/);
  assert.match(fn, /setTimeout\(\(\) => setCopied\(false\), 2000\)/);
});

test("the share-card image route never takes an identity from the URL — slug/node pick the lesson, the caller's own session supplies the name and streak", () => {
  assert.doesNotMatch(imageRoute, /userId|user_id|\?.*uid/);
  assert.match(imageRoute, /getMyMomentum\(\)/);
  assert.match(imageRoute, /getMyFirstName\(\)/);
});

test("the share-card route 401s with no session and 404s on an unknown lesson, before ever reaching ImageResponse", () => {
  assert.match(imageRoute, /if \(!momentum\) return new Response\("Sign in to get your card\.", \{ status: 401 \}\);/);
  assert.match(imageRoute, /if \(!roadmap \|\| at === -1\) return new Response\("Lesson not found\.", \{ status: 404 \}\);/);
});

test("the rendered PNG uses the exact same three helpers as the on-screen preview, and the same brand-500/on-brand hexes", () => {
  assert.match(imageRoute, /shareHeadline\(firstName, node\.title\)/);
  assert.match(imageRoute, /shareLessonLine\(at \+ 1, flat\.length, roadmap\.title\)/);
  assert.match(imageRoute, /shareStreakLine\(momentum\.streakDays\)/);
  assert.match(imageRoute, /background: "#43b4c8"/);
  assert.match(imageRoute, /color: "#06262c"/);
});
