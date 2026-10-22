/**
 * Phase 5 Part C (3/3) — the DSA language switch (V2Dsa/DeskDsa),
 * migration 0033. Infrastructure only, by explicit decision: no DSA
 * roadmap exists anywhere in docs/roadmaps/ yet (the mockup's own
 * subtitle: "Sample step, not a written lesson yet"), so there is no
 * real content to pilot the new codeMulti step kind on — this is tested
 * against synthetic fixtures instead. Source-text assertions, same
 * convention as the rest of this directory.
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
const dayPage = readFileSync(join(SRC, "app", "(learning)", "learn", "[slug]", "[node]", "page.tsx"), "utf8");
const codeLanguageLib = readFileSync(join(SRC, "lib", "code-language.ts"), "utf8");
const accountAction = readFileSync(join(SRC, "actions", "account.ts"), "utf8");
const contractsAccount = readFileSync(join(ROOT, "packages", "contracts", "src", "account.ts"), "utf8");
const contractsSteps = readFileSync(join(ROOT, "packages", "contracts", "src", "steps.ts"), "utf8");
const migration = readFileSync(join(ROOT, "supabase", "migrations", "0033_code_language.sql"), "utf8");
const baseline = readFileSync(join(ROOT, "scripts", "assert-baseline.mjs"), "utf8");
const importer = readFileSync(join(ROOT, "scripts", "import-roadmap.mjs"), "utf8");

test("migration 0033 adds code_language as nullable, with a real CHECK against the five fixed languages", () => {
  assert.match(migration, /add column if not exists code_language text/);
  assert.match(migration, /check \(code_language is null or code_language in \('py', 'java', 'cpp', 'js', 'c'\)\)/);
});

test("scripts/assert-baseline.mjs guards the code_language CHECK and its null-by-default start state", () => {
  assert.match(baseline, /the DSA language switch is one of the five fixed languages — no made-up value/);
  assert.match(baseline, /code_language starts null/);
});

test("CODE_LANGUAGES is the mockup's own five languages, with a Python default", () => {
  assert.match(contractsAccount, /key: "py", name: "Python"/);
  assert.match(contractsAccount, /key: "java", name: "Java"/);
  assert.match(contractsAccount, /key: "cpp", name: "C\+\+"/);
  assert.match(contractsAccount, /key: "js", name: "JavaScript"/);
  assert.match(contractsAccount, /key: "c", name: "C"/);
  assert.match(contractsAccount, /DEFAULT_CODE_LANGUAGE: CodeLanguageKey = "py"/);
});

test("a codeMulti step requires at least two language variants, each language at most once", () => {
  const schema = contractsSteps.slice(
    contractsSteps.indexOf("export const codeMultiStepSchema"),
    contractsSteps.indexOf("export const authoredStepSchema"),
  );
  assert.match(schema, /variants: z\.array\(codeVariantSchema\)\.min\(2\)/);
  assert.match(schema, /each language may appear at most once in variants/);
});

test("codeMulti joins the SAME discriminated union as every other authored kind — not a parallel, separately-read field", () => {
  const union = contractsSteps.slice(
    contractsSteps.indexOf("export const authoredStepSchema = z.discriminatedUnion"),
    contractsSteps.indexOf("export const authoredStepsSchema"),
  );
  assert.match(union, /codeMultiStepSchema/);
});

test("getMyCodeLanguage() is forgiving like lib/momentum.ts — a failed read falls back to the default, never throws", () => {
  const fn = codeLanguageLib.slice(codeLanguageLib.indexOf("export async function getMyCodeLanguage"));
  assert.match(fn, /catch \{\s*\n\s*return DEFAULT_CODE_LANGUAGE;/);
});

test("the day page only reads the stored preference when the day actually has a codeMulti step — no wasted query on the other lessons", () => {
  const fn = dayPage.slice(dayPage.indexOf("const codeLanguage ="), dayPage.indexOf("return ("));
  assert.match(fn, /steps\.some\(\(s\) => s\.kind === "codeMulti"\)/);
  assert.match(fn, /DEFAULT_CODE_LANGUAGE/);
});

test("setCodeLanguage follows the same shape as setAvatar — requireUser, a plain profiles update, a user-facing error on failure", () => {
  const fn = accountAction.slice(accountAction.indexOf("export const setCodeLanguage"));
  assert.match(fn, /requireUser\(\)/);
  assert.match(fn, /\.update\(\{ code_language: parsedInput\.codeLanguage \}\)/);
  assert.match(fn, /UserFacingError/);
});

test("the language choice is shared lesson-wide state in lesson-route.tsx, not per-step local state — \"applies to every code block\"", () => {
  assert.match(route, /const \[codeLanguage, setCodeLanguageState\] = useState\(initialCodeLanguage\)/);
  assert.match(route, /codeLanguage=\{codeLanguage\}/);
  assert.match(route, /onCodeLanguageChange=\{onCodeLanguageChange\}/);
});

test("picking a language is optimistic and signed-out-friendly — local state always updates, the server call is skipped when signed out", () => {
  const fn = route.slice(route.indexOf("const onCodeLanguageChange ="), route.indexOf("if (showDone)"));
  assert.match(fn, /setCodeLanguageState\(next\)/);
  assert.match(fn, /if \(signedIn\) persistCodeLanguage/);
});

test("CodeMultiBody falls back to the step's own first variant when the shared language isn't one this step offers — never renders blank", () => {
  const fn = reader.slice(reader.indexOf("function CodeMultiBody"), reader.indexOf("/** \"Questions you might have\""));
  assert.match(fn, /step\.variants\.find\(\(v\) => v\.language === codeLanguage\) \?\? step\.variants\[0\]!/);
});

test("the highlighted \"key line\" is a background pill (bg-brand-500/25), the same already-measured highlight convention TerminalCard uses — not a new unmeasured colour", () => {
  const fn = reader.slice(reader.indexOf("function CodeMultiBody"), reader.indexOf("/** \"Questions you might have\""));
  assert.match(fn, /isKeyLine\(line\) && "bg-brand-500\/25"/);
});

test("the language switch's own CTA uses the step's ctaLabel (\"Mine prints 9\"-style), not generic Continue/Finish", () => {
  const fn = reader.slice(reader.indexOf("function ctaLabelFor"), reader.indexOf("const STEP_GROUPS"));
  assert.match(fn, /step\.kind === "codeMulti"/);
});

test("codeMulti is NOT help-eligible — the mockup's own secondary button is \"Mine prints something else\", a different, separately-deferred escape, not the Stuck box", () => {
  const fn = reader.slice(reader.indexOf("const HELP_ELIGIBLE"), reader.indexOf("const ARROW_RIGHT"));
  assert.doesNotMatch(fn, /"codeMulti"/);
});

test("import-roadmap.mjs hand-validates codeMulti the same as every other kind — a friendly early check for whoever eventually authors one", () => {
  assert.match(importer, /s\.kind === "codeMulti"/);
  assert.match(importer, /language "\$\{v\.language\}" repeated — each may appear once/);
  assert.match(importer, /one of command\/turn\/choose\/find\/formula\/number\/write\/codeMulti/);
});
