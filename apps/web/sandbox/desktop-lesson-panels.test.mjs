/**
 * Phase 5 Part B, CHANGES.md item 6 — the desktop (>=1024px) three-column
 * lesson shell: a left step nav, the same mobile content column recentred,
 * and a right "your work" aside with one of four bespoke panel kinds.
 * Source-text assertions, same convention as the rest of this directory.
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
const contractsSteps = readFileSync(join(ROOT, "packages", "contracts", "src", "steps.ts"), "utf8");
const importer = readFileSync(join(ROOT, "scripts", "import-roadmap.mjs"), "utf8");
const thinkingM1to3 = readFileSync(
  join(ROOT, "docs", "roadmaps", "thinking-under-uncertainty", "modules-01-03.mjs"),
  "utf8",
);
const thinkingM4to5 = readFileSync(
  join(ROOT, "docs", "roadmaps", "thinking-under-uncertainty", "modules-04-05.mjs"),
  "utf8",
);
const medicalCoding = readFileSync(join(ROOT, "docs", "roadmaps", "medical-coding", "modules-01-04.mjs"), "utf8");
const startupFinance = readFileSync(join(ROOT, "docs", "roadmaps", "startup-finance", "modules-01-04.mjs"), "utf8");
const excelAtWork = readFileSync(join(ROOT, "docs", "roadmaps", "excel-at-work.mjs"), "utf8");

test("the mobile header, progress bar and sticky footer all hide at lg — the desktop nav/aside replace them, not duplicate them", () => {
  const mobileHeader = reader.slice(reader.indexOf("<div className=\"flex h-16"), reader.indexOf("role=\"img\""));
  assert.match(mobileHeader, /lg:hidden/);
  const progressBar = reader.slice(reader.indexOf('role="img"'), reader.indexOf("max-w-[680px]"));
  assert.match(progressBar, /lg:hidden/);
  const stickyFooter = reader.slice(reader.indexOf('className="flex-none border-t'), reader.indexOf("{panel ? <WorkPanel"));
  assert.match(stickyFooter, /lg:hidden/);
});

test("the desktop CTA row is a second, lg-only copy of the footer buttons, not the mobile one reflowed", () => {
  const desktopCta = reader.slice(reader.indexOf('className="flex gap-2.5 lg:mt-1"'), reader.indexOf('className="flex-none border-t'));
  assert.match(desktopCta, /lg:flex/);
  assert.match(desktopCta, /hidden h-14/);
});

test("the content column is recentred and widened at lg (max-w-[680px]), matching the DeskUni* main column", () => {
  assert.match(reader, /max-w-\[680px\]/);
});

test("min-h-dvh resets to 0 at lg — the page's own (learning)/layout.tsx already supplies the full-viewport wrapper, so stacking a second one would strand the site footer below the fold on a short step", () => {
  assert.match(reader, /flex min-h-dvh flex-col bg-ink-50 lg:min-h-0 lg:flex-row/);
});

test("LessonNav renders every step, not just the current one, with done/current/upcoming markers", () => {
  const fn = reader.slice(reader.indexOf("function LessonNav"), reader.indexOf("function StepBody"));
  assert.match(fn, /steps\.map\(\(s, i\)/);
  assert.match(fn, /i < furthest/);
  assert.match(fn, /aria-current=\{isCurrent \? "step" : undefined\}/);
});

test("jumping in the nav is gated to already-reached steps — the reader stays strictly sequential, the nav is a map not a skip-ahead control", () => {
  const navFn = reader.slice(reader.indexOf("function LessonNav"), reader.indexOf("function StepBody"));
  assert.match(navFn, /disabled=\{!reached\}/);
  assert.match(navFn, /const reached = i <= furthest/);

  const routeJump = route.slice(route.indexOf("const onJump ="), route.indexOf("if (showDone)"));
  assert.match(routeJump, /if \(i > furthest/);
});

test('the three bottom nav links ("Your turn"/"Questions"/"Go deeper") only appear for a category this lesson actually has, and only once reached', () => {
  assert.match(reader, /label: "Your turn"/);
  assert.match(reader, /label: "Questions"/);
  assert.match(reader, /label: "Go deeper"/);
  const groupsRender = reader.slice(reader.indexOf("{STEP_GROUPS.map"), reader.indexOf("mt-auto flex flex-col gap-2 rounded-2xl bg-white/8"));
  assert.match(groupsRender, /if \(at === -1 \|\| at > furthest\) return null/);
});

test("the desktop nav reuses the site's own night-900 sidebar tokens (rounded-14, text-white vs text-on-night), not invented classes", () => {
  const navFn = reader.slice(reader.indexOf("function LessonNav"), reader.indexOf("function StepBody"));
  assert.match(navFn, /bg-night-900/);
  assert.match(navFn, /rounded-14/);
});

test("the nav's top control is a back button, not a second \"jintu\" wordmark — the site's own SiteNav already renders one above it", () => {
  const navFn = reader.slice(reader.indexOf("function LessonNav"), reader.indexOf("function StepBody"));
  assert.doesNotMatch(navFn, />jintu</);
  assert.match(navFn, /aria-label=\{`Back to \$\{roadmapTitle\}`\}/);
});

test('no "Stuck? Ask about this step" input anywhere — the omission holds on desktop too, not just mobile', () => {
  assert.doesNotMatch(reader, /Stuck\? Ask about this step/);
  assert.doesNotMatch(reader, /Type what you got/);
});

test("WorkPanel only renders when the current step actually authored a panel — no empty aside shell", () => {
  assert.match(reader, /\{panel \? <WorkPanel panel=\{panel\} \/> : null\}/);
});

test("WorkPanel dispatches on all four panel kinds", () => {
  const fn = reader.slice(reader.indexOf("function WorkPanel"), reader.indexOf("function PanelHeading"));
  for (const kind of ["dotGrid", "tableRows", "spreadsheet"]) {
    assert.match(fn, new RegExp(`panel\\.kind === "${kind}"`));
  }
  // forecastLog is the final fallthrough (last in the discriminated union),
  // not an explicit check — still asserted present via its own component.
  assert.match(fn, /<ForecastLogPanel panel=\{panel\} \/>/);
});

test("DotGridPanel derives dot colours from legend ORDER, not an authored colour field — no colour key exists on the schema", () => {
  const panelSchema = contractsSteps.slice(
    contractsSteps.indexOf("export const dotGridPanelSchema"),
    contractsSteps.indexOf("export const tableRowsPanelSchema"),
  );
  assert.doesNotMatch(panelSchema, /colou?r/i);
  const fn = reader.slice(reader.indexOf("function DotGridPanel"), reader.indexOf("function TableRowsPanel"));
  assert.match(fn, /Math\.min\(i, DOT_COLORS\.length - 1\)/);
});

test("tableRows is shared by the cap-table and claim-line-list scenarios — one panel kind, not two bespoke ones", () => {
  assert.match(contractsSteps, /export const tableRowsPanelSchema/);
  assert.doesNotMatch(contractsSteps, /capTablePanelSchema|claimListPanelSchema/);
});

test("the forecast log panel is read-only — its schema carries no id/createdAt/due_on style persistence fields", () => {
  const schema = contractsSteps.slice(
    contractsSteps.indexOf("export const forecastLogPanelSchema"),
    contractsSteps.indexOf("export const panelSchema"),
  );
  assert.doesNotMatch(schema, /due_on|outcome|forecasts table/);
  assert.match(contractsSteps, /Read-only, per the "build now vs\. read-only" decision/);
});

test("the panel field is optional on every Uni* kind and absent from command/turn (no Desk mockup for either yet)", () => {
  for (const schemaName of ["chooseStepSchema", "findStepSchema", "formulaStepSchema", "numberStepSchema", "writeStepSchema"]) {
    const schema = contractsSteps.slice(
      contractsSteps.indexOf(`export const ${schemaName}`),
      contractsSteps.indexOf(`export const ${schemaName}`) + 1500,
    );
    assert.match(schema, /panel: panelSchema\.optional\(\)/);
  }
  const commandSchema = contractsSteps.slice(
    contractsSteps.indexOf("export const commandStepSchema"),
    contractsSteps.indexOf("export const turnStepSchema"),
  );
  assert.doesNotMatch(commandSchema, /panel:/);
});

test("import-roadmap.mjs hand-validates all four panel kinds", () => {
  for (const kind of ["dotGrid", "tableRows", "spreadsheet", "forecastLog"]) {
    assert.match(importer, new RegExp(`s\\.panel\\.kind === "${kind}"`));
  }
  assert.match(importer, /one of dotGrid\/tableRows\/spreadsheet\/forecastLog/);
});

test("lesson-route.tsx threads estMinutes through to StepReader, and the day page supplies it from the real node", () => {
  assert.match(route, /estMinutes: number/);
  assert.match(route, /estMinutes=\{estMinutes\}/);
  assert.match(dayPage, /estMinutes=\{node\.estMinutes\}/);
});

test("each of the four pilot roadmaps carries real panel content tied to its own step, not the mockup's placeholder scenario", () => {
  const bayesNode = thinkingM1to3.slice(
    thinkingM1to3.indexOf('title: "Bayes\' theorem, mechanically"'),
    thinkingM1to3.indexOf('title: "Incremental updating"'),
  );
  assert.match(bayesNode, /kind: "dotGrid"/);
  assert.match(bayesNode, /total: 100/);

  const forecastTitleStart = thinkingM4to5.indexOf('title: "Forecasting practice, in public"');
  const forecastNode = thinkingM4to5.slice(forecastTitleStart, thinkingM4to5.indexOf("resources: [", forecastTitleStart) + 500);
  assert.match(forecastNode, /kind: "forecastLog"/);

  const medicalNode = medicalCoding.slice(
    medicalCoding.indexOf('title: "The alphabetic index and the tabular list"'),
    medicalCoding.indexOf('title: "Excludes1 and Excludes2"'),
  );
  assert.match(medicalNode, /kind: "tableRows"/);
  assert.match(medicalNode, /"E11\.9"/);

  const startupNode = startupFinance.slice(
    startupFinance.indexOf('title: "Pre-money, post-money and the arithmetic"'),
    startupFinance.indexOf('title: "Building a cap table from scratch in Excel"'),
  );
  assert.match(startupNode, /kind: "tableRows"/);
  assert.match(startupNode, /totalRow: \["Total", "25\.00", "100%"\]/);

  const excelNode = excelAtWork.slice(
    excelAtWork.indexOf('title: "What a spreadsheet is actually for"'),
    excelAtWork.indexOf('title: "Relative, absolute and mixed references"'),
  );
  assert.match(excelNode, /kind: "spreadsheet"/);
  assert.match(excelNode, /highlightBadge: "C2"/);
});
