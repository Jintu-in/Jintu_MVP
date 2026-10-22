/**
 * "One source of truth" (CHANGES.md item 2) — flipping a switch on
 * /settings and the matching one on /settings/consents must read and write
 * the same data. The only way that is guaranteed to hold, rather than hoped
 * for, is if both screens call the literal same action. This asserts that
 * structurally, by reading the source rather than rendering it: no Supabase
 * project exists in CI to render against (see smoke.spec.ts's own header).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, "..", "src", p), "utf8");

const settingsSrc = read("components/settings/settings-page.tsx");
const consentsSrc = read("components/settings/consents-page.tsx");
const accountSrc = read("components/settings/account-page.tsx");
const accountActionsSrc = read("actions/account.ts");
const authActionsSrc = read("actions/auth.ts");
const accountLibSrc = read("lib/account.ts");

test("Settings and Settings/Consents both call updateReminders for the reminders switch", () => {
  assert.match(settingsSrc, /useAction\(updateReminders\)/);
  assert.match(consentsSrc, /useAction\(updateReminders,/);
});

test("Settings and Settings/Consents both call updatePublicProfile for the public-profile switch", () => {
  assert.match(settingsSrc, /useAction\(updatePublicProfile,/);
  assert.match(consentsSrc, /useAction\(updatePublicProfile,/);
});

test("Settings and Settings/Consents both call toggleConsent for the analytics switch", () => {
  assert.match(settingsSrc, /execute\(\{ purpose: "analytics"/);
  assert.match(consentsSrc, /execute\(\{ purpose: "analytics"/);
});

test("core_service has no switch on the Consents screen — it is not a withdrawable choice", () => {
  const coreBlock = consentsSrc.slice(
    consentsSrc.indexOf("Core service"),
    consentsSrc.indexOf("ReminderConsentRow state={reminders}"),
  );
  assert.doesNotMatch(coreBlock, /<Switch/);
  assert.match(coreBlock, /required/);
});

test("updateReminders and updatePublicProfile each log a consent_events row alongside their table write", () => {
  assert.match(accountActionsSrc, /recordConsentEventBestEffort\(supabase, user\.id, "reminders"/);
  assert.match(accountActionsSrc, /recordConsentEventBestEffort\(supabase, user\.id, "public_profile"/);
});

test("toggleConsent writes the append-only consent_events log, not the old consents table", () => {
  const fn = authActionsSrc.slice(
    authActionsSrc.indexOf("export const toggleConsent"),
    authActionsSrc.indexOf("export async function signOut"),
  );
  assert.match(fn, /recordConsentEvent\(supabase, user\.id, parsedInput\.purpose, parsedInput\.granted\)/);
  assert.doesNotMatch(fn, /from\("consents"\)/);
});

test("setPassword writes password_set_at and signs out every other session", () => {
  const fn = authActionsSrc.slice(
    authActionsSrc.indexOf("export const setPassword"),
    authActionsSrc.indexOf("export const requestPasswordReset"),
  );
  assert.match(fn, /password_set_at:\s*new Date\(\)\.toISOString\(\)/);
  assert.match(fn, /signOut\(\{ scope: "others" \}\)/);
});

test("the two-state Account screen reads passwordSetAt, not auth user_metadata", () => {
  assert.match(accountSrc, /hasPassword = Boolean\(passwordSetAt\)/);
  assert.doesNotMatch(accountSrc, /user_metadata/);
});

test("getAccount() reads consent state from the append-only log, not the old consents table", () => {
  assert.match(accountLibSrc, /latestConsents\(supabase, user\.id\)/);
  assert.doesNotMatch(accountLibSrc, /from\("consents"\)/);
});
