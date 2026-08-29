import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The roles layer, checked as source.
 *
 * scripts/assert-roles.mjs already transpiles the content and checks the two
 * rules that matter — every page routes somewhere real, and no salary
 * figures. These tests cover the things a guard over CONTENT cannot see: that
 * the routes exist at all, that the components render every section the
 * content model defines, and that the layer stays reachable from the nav.
 *
 * A role page that is written but unroutable is invisible, and a section
 * added to the type but never rendered is content nobody will ever read —
 * both fail silently, and both are cheap to pin here.
 */
const here = dirname(fileURLToPath(import.meta.url));
const web = join(here, "..");
const read = (p) => readFileSync(join(web, p), "utf8");

const CONTENT_DIR = join(web, "src", "content", "roles");
const rolePage = read("src/components/roles/role-page.tsx");
const comparePage = read("src/components/roles/comparison-page.tsx");

test("every role and comparison route exists", () => {
  const routes = [
    "src/app/(marketing)/roles/page.tsx",
    "src/app/(marketing)/roles/[slug]/page.tsx",
    "src/app/(marketing)/roles/compare/[slug]/page.tsx",
  ];
  for (const r of routes) {
    assert.doesNotThrow(() => read(r), `missing route: ${r}`);
  }
});

test("the dynamic routes are statically generated and refuse unknown slugs", () => {
  for (const r of [
    "src/app/(marketing)/roles/[slug]/page.tsx",
    "src/app/(marketing)/roles/compare/[slug]/page.tsx",
  ]) {
    const src = read(r);
    assert.match(src, /generateStaticParams/, `${r} does not enumerate its pages`);
    // Without this an unknown slug renders a blank page instead of a 404,
    // and a typo in a link becomes an indexable empty URL.
    assert.match(src, /dynamicParams\s*=\s*false/, `${r} allows unknown slugs`);
    assert.match(src, /notFound\(\)/, `${r} has no not-found path`);
  }
});

test("the role template renders every section the model defines", () => {
  // If a field is added to the type and never rendered, the content is
  // written and unreadable. These are the ones that carry the page.
  for (const field of [
    "whatTheyDo",
    "typicalWeek",
    "whatItIsNot",
    "worksWith",
    "skills.must",
    "skills.helps",
    "skills.overrated",
    "howPeopleGetIn",
    "levels",
    "whatIsHard",
    "startHere",
  ]) {
    assert.ok(
      rolePage.includes(`role.${field}`),
      `the role template never renders role.${field}`,
    );
  }
});

test("a role with no roadmap still routes somewhere", () => {
  // The honest branch has to exist in the template, not just in the type.
  assert.match(rolePage, /notYet|readInstead/, "no branch for a role without a roadmap");
  assert.ok(
    rolePage.includes("readInstead"),
    "the template does not render what to read instead",
  );
});

test("the comparison table scrolls inside itself, never the page", () => {
  // Five columns do not fit a phone, and this site is mobile-first: the
  // wrapper scrolls so the body never gains a horizontal scrollbar.
  assert.match(comparePage, /overflow-x-auto/, "the comparison table cannot scroll");
  assert.match(comparePage, /min-w-\[/, "the table has no minimum width to scroll against");
});

test("the short answer comes before the table", () => {
  const answer = comparePage.indexOf("shortAnswer");
  const table = comparePage.indexOf("<table");
  assert.ok(answer > -1 && table > -1, "expected both a short answer and a table");
  assert.ok(
    answer < table,
    "the table renders before the short answer — the reader arrived with one question",
  );
});

test("roles are reachable from the site nav", () => {
  assert.match(read("src/components/site/site-nav.tsx"), /href=\{"\/roles"/, "no nav link to /roles");
});

test("no role file writes a salary figure", () => {
  // Duplicated from the guard on purpose: this is the rule most likely to be
  // broken by somebody editing prose without running the guards.
  const MONEY = /(₹\s?\d|Rs\.?\s?\d|\$\s?\d|\b\d+(\.\d+)?\s?(lakh|crore|LPA|CTC)\b)/i;
  for (const f of readdirSync(CONTENT_DIR).filter((x) => x.endsWith(".ts"))) {
    const prose = readFileSync(join(CONTENT_DIR, f), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    assert.ok(!MONEY.test(prose), `${f} contains a salary figure`);
  }
});
