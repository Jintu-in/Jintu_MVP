/**
 * Phase 5 Part D — offline mode (V2Offline/DeskOffline). Reading content
 * offline is already handled by the pre-existing Serwist service worker
 * (NetworkFirst on documents/RSC, apps/web/src/sw.ts) — nothing new there.
 * This covers the three pieces that needed real code: the "You are
 * offline" banner, HelpBox's disabled "Ask needs internet" state, and
 * auto-retrying a failed lesson completion once the connection returns.
 * Source-text assertions, same convention as the rest of this directory.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");

const reader = readFileSync(join(SRC, "components", "lesson", "step-reader.tsx"), "utf8");
const route = readFileSync(join(SRC, "components", "lesson", "lesson-route.tsx"), "utf8");

test("useOnlineStatus starts true (matching the server-rendered guess) and tracks the browser's online/offline events", () => {
  const fn = route.slice(route.indexOf("function useOnlineStatus"), route.indexOf("export interface LessonRouteProps"));
  assert.match(fn, /useState\(true\)/);
  assert.match(fn, /setOnline\(window\.navigator\.onLine\)/);
  assert.match(fn, /addEventListener\("online", goOnline\)/);
  assert.match(fn, /addEventListener\("offline", goOffline\)/);
});

test("a failed completion retries itself automatically once back online — no manual \"try again\" needed", () => {
  const fn = route.slice(route.indexOf("useEffect(() => {\n    if (online && failed)"), route.indexOf("const onContinue ="));
  assert.match(fn, /setFailed\(false\)/);
  assert.match(fn, /execute\(\{ nodeId, roadmapId, roadmapSlug: slug, done: true \}\)/);
  assert.match(fn, /\}, \[online\]\);/);
});

test("the inline completion error names the offline case distinctly from a generic save failure", () => {
  assert.match(route, /You're offline — this will save as soon as you're back\./);
  assert.match(route, /That did not save\. Your place is kept — try again\./);
});

test("online is threaded from lesson-route's single subscription down to StepReader, not re-subscribed there", () => {
  assert.match(route, /online=\{online\}/);
  assert.match(reader, /online: boolean;/);
});

test("OfflineBanner only renders when offline, and uses the mockups' own measured tokens (warn-bg/warn-700 container, warn-600 icon)", () => {
  assert.match(reader, /\{online \? null : <OfflineBanner \/>\}/);
  const fn = reader.slice(reader.indexOf("function OfflineBanner"), reader.indexOf("const ARROW_RIGHT"));
  assert.match(fn, /bg-warn-bg p-3\.5 text-warn-700/);
  assert.match(fn, /text-warn-600/);
  assert.match(fn, /You are offline/);
  assert.match(fn, /Your progress syncs when you are back\./);
});

test("the banner's saved-location copy differs by breakpoint — \"your phone\" on mobile, \"this computer\" on desktop", () => {
  const fn = reader.slice(reader.indexOf("function OfflineBanner"), reader.indexOf("const ARROW_RIGHT"));
  assert.match(fn, /lg:hidden">This lesson is saved on your phone\./);
  assert.match(fn, /hidden lg:inline">This lesson is saved on this computer\./);
});

test("HelpBox is disabled with the drawn copy when offline, before it even looks at open/sent state", () => {
  const fn = reader.slice(reader.indexOf("function HelpBox"), reader.indexOf("if (!open)"));
  assert.match(fn, /if \(!online\)/);
  assert.match(fn, /disabled/);
  assert.match(fn, /Ask needs internet/);
  assert.match(fn, /border-dashed border-ink-400/);
  assert.match(fn, /text-ink-500/);
});

test("HelpBox's offline check comes first — a learner who opened the box or is mid-type loses that state the moment the connection drops", () => {
  const helpBox = reader.slice(reader.indexOf("function HelpBox"), reader.indexOf("/**\n * The desktop-only"));
  const offlineIdx = helpBox.indexOf("if (!online)");
  const openIdx = helpBox.indexOf("if (!open)");
  const sentIdx = helpBox.indexOf("if (sent)");
  assert.ok(offlineIdx > -1 && offlineIdx < openIdx && offlineIdx < sentIdx);
});
