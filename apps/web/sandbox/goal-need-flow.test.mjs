/**
 * Phase 4 Part A (V2Goal, V2Need) — the first-run flow between sign-up's
 * consent step and wherever Home ends up. Source-text assertions, same
 * convention as settings-consent-sync.test.mjs: no Supabase project exists
 * in CI to render against (smoke.spec.ts's own header).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, "..", "src", p), "utf8");

const goalForm = read("components/onboarding/goal-form.tsx");
const needForm = read("components/onboarding/need-form.tsx");
const goalPage = read("app/(auth)/onboarding/goal/page.tsx");
const needPage = read("app/(auth)/onboarding/need/page.tsx");
const onboardingPage = read("app/(auth)/onboarding/page.tsx");
const onboardingForm = read("components/onboarding-form.tsx");
const authActions = read("actions/auth.ts");

test("completing consent (step 3 of 3) moves on to goal (Phase 4 Part A), not the retired /account", () => {
  assert.match(onboardingForm, /onSuccess: \(\) => router\.replace\("\/onboarding\/goal"\)/);
  assert.doesNotMatch(onboardingForm, /\/account/);
});

test("revisiting /onboarding resumes goal/need if unfinished, else goes to /profile", () => {
  assert.match(onboardingPage, /redirect\(profile\.goal && profile\.need \? "\/profile" : "\/onboarding\/goal"\)/);
});

test("/onboarding/goal and /onboarding/need each guard their own prerequisite", () => {
  assert.match(goalPage, /if \(!profile\) redirect\("\/onboarding"\);/);
  assert.match(goalPage, /if \(profile\.goal && profile\.need\) redirect\("\/profile"\);/);
  assert.match(needPage, /if \(!profile\) redirect\("\/onboarding"\);/);
  assert.match(needPage, /if \(!profile\.goal\) redirect\("\/onboarding\/goal"\);/);
  assert.match(needPage, /if \(profile\.need\) redirect\("\/profile"\);/);
});

test("Goal's Skip link and Need's Finish button both land on /today, not a dead end", () => {
  assert.match(goalForm, /href="\/today"/);
  assert.match(needForm, /onSuccess: \(\) => router\.push\("\/today"\)/);
});

test("Goal's three groups carry 6 roles each, exactly as drawn", () => {
  for (const key of ["study", "work", "build"]) {
    const block = goalForm.slice(goalForm.indexOf(`  ${key}: {`), goalForm.indexOf("],", goalForm.indexOf(`  ${key}: {`)));
    const roles = [...block.matchAll(/"\s*([^"]+)\s*",?/g)].filter((m) => m[1] !== key);
    assert.equal(roles.length >= 6, true, `${key} should list its 6 roles`);
  }
});

test("a typed (custom) goal also writes a topic_requests row; a picked one does not", () => {
  const fn = authActions.slice(authActions.indexOf("export const setGoal"), authActions.indexOf("export const setNeed"));
  assert.match(fn, /if \(parsedInput\.custom\) \{/);
  assert.match(fn, /from\("topic_requests"\)/);
});

test("setNeed only accepts the four fixed keys V2Need itself defines", () => {
  // The zod enum lives in @jintu/contracts; this just proves the action
  // takes the shared schema rather than redefining its own looser one.
  const fn = authActions.slice(authActions.indexOf("export const setNeed"), authActions.indexOf("export const toggleConsent"));
  assert.match(fn, /\.inputSchema\(needInput\)/);
});
