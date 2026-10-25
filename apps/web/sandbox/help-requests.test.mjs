/**
 * Phase 5 Part C — "Stuck? Tell us what you see" (V2Help/DeskHelp),
 * migration 0031. Free-text only for this pass: the mockup's richer
 * "pick the closest wrong output, see the canned fix" list needs its own
 * authored content that doesn't exist on any step yet (see
 * node-reader.test.mjs for that narrower guard). Source-text assertions,
 * same convention as the rest of this directory.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const reader = readFileSync(join(SRC, "components", "lesson", "step-reader.tsx"), "utf8");
const route = readFileSync(join(SRC, "components", "lesson", "lesson-route.tsx"), "utf8");
const action = readFileSync(join(SRC, "actions", "help.ts"), "utf8");
const exportRoute = readFileSync(join(SRC, "app", "(auth)", "profile", "export", "route.ts"), "utf8");
const contractsIndex = readFileSync(join(ROOT, "packages", "contracts", "src", "index.ts"), "utf8");
const contractsSchema = readFileSync(join(ROOT, "packages", "contracts", "src", "help-requests.ts"), "utf8");
const migration = readFileSync(join(ROOT, "supabase", "migrations", "0031_help_requests.sql"), "utf8");
const baseline = readFileSync(join(ROOT, "scripts", "assert-baseline.mjs"), "utf8");

test("migration 0031 bundles the table, RLS policies AND the grant together — learning from 0026/0027's split mistake", () => {
  assert.match(migration, /create table public\.help_requests/);
  assert.match(migration, /alter table public\.help_requests enable row level security/);
  assert.match(migration, /create policy "users read their own help requests"/);
  assert.match(migration, /create policy "users insert their own help requests"/);
  assert.match(migration, /grant select, insert on public\.help_requests to authenticated/);
});

test("help_requests has no update or delete policy for its owner — a message sent once, not edited afterwards", () => {
  assert.doesNotMatch(migration, /for update/i);
  assert.doesNotMatch(migration, /for delete/i);
});

test("a help request cannot be empty — the message column has a length CHECK", () => {
  assert.match(migration, /check \(char_length\(message\) between 1 and 2000\)/);
});

test("scripts/assert-baseline.mjs expects help_requests among the baseline tables, and covers its RLS", () => {
  assert.match(baseline, /"help_requests"/);
  assert.match(baseline, /exactly the twenty-six baseline tables exist/);
  assert.match(baseline, /RLS stops user A reading user B's help requests/);
  assert.match(baseline, /a help request cannot be edited after the fact, even by its own owner/);
  assert.match(baseline, /a help request cannot be deleted by its own owner/);
  assert.match(baseline, /a help request cannot be empty/);
});

test("the export-completeness guard knows about help_requests — /profile/export would otherwise silently omit it", () => {
  assert.match(exportRoute, /\["help_requests", "\*",/);
});

test("the contracts package exports a helpRequestInput schema with bounded message length", () => {
  assert.match(contractsSchema, /nodeId: z\.string\(\)\.uuid\(\)/);
  assert.match(contractsSchema, /message: z\.string\(\)\.trim\(\)\.min\(1,/);
  assert.match(contractsSchema, /\.max\(2000,/);
  assert.match(contractsIndex, /helpRequestInput, type HelpRequestInput/);
});

test("submitHelpRequest follows the same shape as reviews.ts's createCard — UserFacingError when signed out, FK violation mapped to a friendly message", () => {
  assert.match(action, /if \(!user\) throw new UserFacingError\("Sign in to ask for help on a step\."\)/);
  assert.match(action, /error\.code === "23503"/);
  assert.match(action, /from\("help_requests"\)\.insert/);
});

test("submitHelpRequest does not revalidate any path — nothing on the page reads help_requests back", () => {
  assert.doesNotMatch(action, /revalidatePath/);
});

test("only the seven authored kinds are help-eligible — the six generic kinds keep their existing look, unchanged", () => {
  const fn = reader.slice(reader.indexOf("const HELP_ELIGIBLE"), reader.indexOf("const ARROW_RIGHT"));
  for (const kind of ["command", "turnRich", "choose", "find", "formula", "number", "write"]) {
    assert.match(fn, new RegExp(`"${kind}"`));
  }
  for (const kind of ["concept", "topics", "resource", "challenge", "check", "gotcha"]) {
    assert.doesNotMatch(fn, new RegExp(`"${kind}"`));
  }
});

test("HelpBox remounts fresh on every step via key={step.id} — no leaking open/sent/draft state across steps", () => {
  assert.match(reader, /<HelpBox key=\{step\.id\} nodeId=\{nodeId\} stepContext=\{step\.railTitle\} online=\{online\} \/>/);
});

test("HelpBox is a three-state disclosure: closed link, open form, sent confirmation — never a live textbox left open with no way to send", () => {
  const fn = reader.slice(reader.indexOf("function HelpBox"), reader.indexOf("function WorkPanel"));
  assert.match(fn, /Stuck\? Tell us what you see/);
  assert.match(fn, /What does your screen show\?/);
  assert.match(fn, /Thanks — we'll look into it\./);
  assert.match(fn, /disabled=\{isExecuting \|\| !message\.trim\(\)\}/);
});

test("HelpBox calls submitHelpRequest with the step's own railTitle as context, not a bare index that would drift if steps reorder", () => {
  const fn = reader.slice(reader.indexOf("function HelpBox"), reader.indexOf("function WorkPanel"));
  assert.match(fn, /execute\(\{ nodeId, stepContext, message: message\.trim\(\) \}\)/);
});

test("lesson-route.tsx threads nodeId through to StepReader for the help box's own use", () => {
  assert.match(route, /nodeId=\{nodeId\}/);
});
