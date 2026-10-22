/**
 * Phase 5 Part C (2/3) — "Questions you might have" (V2Questions/
 * DeskQuestions) and the no-score quiz (V2Quiz/DeskQuiz), migration 0032.
 * Source-text assertions, same convention as the rest of this directory.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const steps = readFileSync(join(SRC, "lib", "steps.ts"), "utf8");
const reader = readFileSync(join(SRC, "components", "lesson", "step-reader.tsx"), "utf8");
const route = readFileSync(join(SRC, "components", "lesson", "lesson-route.tsx"), "utf8");
const roadmaps = readFileSync(join(SRC, "lib", "roadmaps.ts"), "utf8");
const quizRoute = readFileSync(join(SRC, "components", "lesson", "quiz-route.tsx"), "utf8");
const quizPage = readFileSync(join(SRC, "app", "(learning)", "learn", "[slug]", "[node]", "quiz", "page.tsx"), "utf8");
const contractsSchema = readFileSync(join(ROOT, "packages", "contracts", "src", "faq-quiz.ts"), "utf8");
const contractsIndex = readFileSync(join(ROOT, "packages", "contracts", "src", "index.ts"), "utf8");
const migration = readFileSync(join(ROOT, "supabase", "migrations", "0032_faq_and_quiz.sql"), "utf8");
const importer = readFileSync(join(ROOT, "scripts", "import-roadmap.mjs"), "utf8");
const gitGithub = readFileSync(join(ROOT, "docs", "roadmaps", "git-and-github.mjs"), "utf8");

test("migration 0032 adds faq and quiz as nullable jsonb, no CHECK — shape is validated by the shared zod schema on read, same posture as 0030's steps", () => {
  assert.match(migration, /add column if not exists faq jsonb/);
  assert.match(migration, /add column if not exists quiz jsonb/);
  assert.doesNotMatch(migration, /check\s*\(/i);
});

test("the contracts package exports faqSchema and quizSchema; a quiz question's correctIndex is refined to actually index into its own options", () => {
  assert.match(contractsSchema, /export const faqSchema = z\.array\(faqItemSchema\)\.min\(1\)/);
  assert.match(contractsSchema, /\.refine\(\(v\) => v\.correctIndex < v\.options\.length/);
  assert.match(contractsIndex, /faqItemSchema,\s*\n\s*faqSchema,\s*\n\s*quizQuestionSchema,\s*\n\s*quizSchema,/);
});

test("lib/roadmaps.ts reads and validates faq/quiz on the way out of the database; a malformed row degrades to null, never throws", () => {
  assert.match(roadmaps, /steps, faq, quiz,/);
  const fn = roadmaps.slice(roadmaps.indexOf("function parseJsonbOrNull"), roadmaps.indexOf("/**\n * Read layer"));
  assert.match(fn, /safeParse/);
  assert.match(fn, /return null/);
  assert.doesNotMatch(fn, /throw/);
});

test("a faq step is appended last, after the mistake/gotcha step — not spliced into the challenge position like the authored Uni* steps", () => {
  const fn = steps.slice(steps.indexOf("if (node.commonMistake)"), steps.indexOf("export const countSteps") === -1 ? steps.length : steps.indexOf("export const countSteps"));
  const mistakeAt = fn.indexOf('kind: "gotcha"');
  const faqAt = fn.indexOf('kind: "faq"');
  assert.ok(mistakeAt !== -1 && faqAt !== -1 && mistakeAt < faqAt, "gotcha must be pushed before faq");
});

test("the faq step does NOT repeat node.commonMistake — it already rendered once as its own gotcha step", () => {
  const faqPush = steps.slice(steps.indexOf('id: "faq"'), steps.indexOf('id: "faq"') + 300);
  assert.doesNotMatch(faqPush, /commonMistake/);
});

test("hasQuiz is independent of faq — a day can have one without the other", () => {
  assert.match(steps, /hasQuiz: Boolean\(node\.quiz && node\.quiz\.length > 0\)/);
});

test("FaqAccordion opens the first item by default and lets any item toggle — matching V2Questions, not a reveal-once check step", () => {
  const fn = reader.slice(reader.indexOf("function FaqAccordion"));
  assert.match(fn, /useState\(0\)/);
  assert.match(fn, /onClick=\{\(\) => setOpenIndex\(open \? -1 : i\)\}/);
});

test('"Quiz me first" only renders on a faq step that actually has a quiz, on both the desktop and mobile footers', () => {
  const matches = reader.match(/step\.kind === "faq" && step\.hasQuiz/g) ?? [];
  assert.equal(matches.length, 2, "expected one guard in the desktop footer and one in the mobile footer");
});

test("lesson-route.tsx computes quizHref from the real slug/nodeSlug, not a hard-coded path", () => {
  assert.match(route, /quizHref=\{`\/learn\/\$\{slug\}\/\$\{nodeSlug\}\/quiz`\}/);
});

test("the quiz page 404s when a node has no quiz authored — there is no empty-quiz state to render", () => {
  assert.match(quizPage, /if \(!node\.quiz \|\| node\.quiz\.length === 0\) notFound\(\);/);
});

test("the quiz page is deliberately unindexed (robots: noindex) — a quiz has no canonical content of its own", () => {
  assert.match(quizPage, /robots: \{ index: false \}/);
});

test("QuizRoute keeps no score: i/pick are plain useState, nothing is posted anywhere", () => {
  const body = quizRoute.slice(quizRoute.indexOf("export default function QuizRoute"));
  assert.match(body, /useState<number \| null>\(null\)/);
  assert.doesNotMatch(body, /useAction|fetch\(|supabase/);
});

test("QuizRoute disables re-picking once answered, and the right/wrong tints are the measured ok-*/risk-* token pairs, not unmeasured colours", () => {
  assert.match(quizRoute, /disabled=\{answered\}/);
  assert.match(quizRoute, /border-ok-600 bg-ok-bg text-ok-700/);
  assert.match(quizRoute, /border-risk-border bg-risk-bg text-risk-700/);
  assert.match(quizRoute, /bg-warn-bg text-warn-700/);
});

test("QuizRoute's last question says \"Done\" and navigates back to the lesson, not round-robin like the mockup's own demo state", () => {
  assert.match(quizRoute, /isLast \? "Done" : "Next question"/);
  assert.match(quizRoute, /router\.push\(backHref as never\)/);
});

test("import-roadmap.mjs hand-validates faq and quiz content separately from node_checks", () => {
  assert.match(importer, /needs question and answer`\);\s*\n\s*\}\s*\n\s*\/\/ The no-score quiz/);
  assert.match(importer, /correctIndex must index into options`\);/);
  assert.match(importer, /insert into public\.nodes \(module_id, position, title, slug, summary, learning_objectives, why_today, common_mistake, principle, challenge, challenge_minutes, steps, faq, quiz,/);
});

test("Git & GitHub's day 2 carries real faq/quiz content about ITS OWN topic (staging), not the mockup's generic day-1 content (git init, first commit)", () => {
  const titleStart = gitGithub.indexOf('title: "The three places a change can be"');
  const node = gitGithub.slice(titleStart, gitGithub.indexOf('title: "Your first repository, commit by commit"'));
  assert.match(node, /faq: \[/);
  assert.match(node, /quiz: \[/);
  assert.match(node, /git add -p/);
  assert.doesNotMatch(node, /Do I need a GitHub account/); // the mockup's own FAQ opener, not reused verbatim
});
