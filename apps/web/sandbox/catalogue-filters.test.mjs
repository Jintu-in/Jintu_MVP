/**
 * The catalogue's filter model — category and search only.
 *
 *   node apps/web/sandbox/catalogue-filters.test.mjs
 *
 * The logic below is DUPLICATED from src/lib/catalogue-filters.ts, for the
 * same reason initials.test.mjs and retry.test.mjs duplicate theirs: the
 * source is TypeScript inside the Next app and this runner is plain node.
 * Same rule applies — the copy must stay identical to the source, or this
 * file is testing fiction. The guard against drift is the last suite here,
 * which reads the real module and asserts the shapes it still exports.
 *
 * This module used to carry Level, Length, Format, a free-certification
 * toggle, a no-prerequisites toggle and three sort orders — see the real
 * module's own header comment for why that was cut down to category and
 * search. This test file is cut down to match; it is not testing less by
 * accident.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ── the copy under test ──────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "data", label: "Data & analytics" },
  { key: "software", label: "Software & engineering" },
  { key: "business", label: "Business & growth" },
  { key: "health", label: "Health & life sciences" },
  { key: "judgement", label: "Thinking & judgement" },
  { key: "foundations", label: "Foundations" },
];

const EMPTY = { c: null, q: "" };

const read = (src, key) => {
  if (typeof src.get === "function") return src.get(key) ?? "";
  const v = src[key];
  return (Array.isArray(v) ? v[0] : v) ?? "";
};
const oneOf = (value, allowed) => (allowed.some((a) => a.key === value) ? value : null);

function parseFilters(src) {
  return { c: oneOf(read(src, "c"), CATEGORIES), q: read(src, "q").trim().slice(0, 120) };
}

function toQueryString(f) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.c) p.set("c", f.c);
  const s = p.toString();
  return s ? `?${s}` : "";
}

function textMatches(row, q) {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    row.title.toLowerCase().includes(needle) ||
    row.summary.toLowerCase().includes(needle) ||
    row.tags.some((t) => t.toLowerCase().includes(needle))
  );
}

function rowMatches(row, f) {
  if (!textMatches(row, f.q)) return false;
  if (f.c && row.category !== f.c) return false;
  return true;
}

function applyFilters(rows, f) {
  return rows.filter((r) => rowMatches(r, f));
}

function toggled(f, group, key) {
  if (group === "c") return { ...f, c: f.c === key ? null : key };
  throw new Error(`unknown group: ${group}`);
}

function resultLine(count, f) {
  const noun = `${count} ${count === 1 ? "roadmap" : "roadmaps"}`;
  if (f.q) return `${noun} matching ${f.q}`;
  if (f.c) return `${noun} in ${CATEGORIES.find((x) => x.key === f.c).label}`;
  return noun;
}

// ── fixtures ─────────────────────────────────────────────────────────────────

const ROW = (over) => ({
  slug: "git-and-github",
  href: "/learn/git-and-github",
  title: "Git & GitHub",
  summary: "From your first commit to handing a clean repository to a teammate.",
  tags: ["git", "version-control"],
  category: "foundations",
  level: "beginner",
  weeks: 2,
  metaLine: "",
  footLine: "",
  ...over,
});

const ROWS = [
  ROW(),
  ROW({
    slug: "data-analyst",
    title: "Data analyst",
    category: "data",
    tags: ["sql", "python"],
    summary: "Spreadsheets, SQL, Python, statistics and dashboards, ending in a portfolio.",
  }),
  ROW({
    slug: "thinking",
    title: "Thinking clearly under uncertainty",
    category: "judgement",
    tags: [],
    summary: "Mental models, bias detection and calibrated forecasting.",
  }),
];

// ── tests ────────────────────────────────────────────────────────────────────

test("parseFilters drops unknown values rather than carrying a broken link", () => {
  assert.deepEqual(parseFilters(new URLSearchParams("c=banana")), EMPTY);
  assert.deepEqual(parseFilters({}), EMPTY);
});

test("parseFilters reads a real category and a trimmed, length-capped query", () => {
  assert.deepEqual(parseFilters({ c: "data", q: "  sql  " }), { c: "data", q: "sql" });
  const long = "x".repeat(200);
  assert.equal(parseFilters({ q: long }).q.length, 120);
});

test("toQueryString and parseFilters round-trip", () => {
  for (const f of [EMPTY, { c: "data", q: "" }, { c: null, q: "sql" }, { c: "software", q: "java" }]) {
    assert.deepEqual(parseFilters(new URLSearchParams(toQueryString(f).slice(1))), f);
  }
});

test("toQueryString produces one canonical URL per filter state", () => {
  assert.equal(toQueryString(EMPTY), "");
  assert.equal(toQueryString({ c: "data", q: "" }), "?c=data");
  assert.equal(toQueryString({ c: null, q: "sql" }), "?q=sql");
});

test("category narrows to exactly that category", () => {
  const shown = applyFilters(ROWS, { c: "data", q: "" });
  assert.deepEqual(shown.map((r) => r.slug), ["data-analyst"]);
});

test("search reaches title, summary and tags — never the chip row", () => {
  assert.equal(applyFilters(ROWS, { c: null, q: "sql" }).length, 1);
  assert.equal(applyFilters(ROWS, { c: null, q: "repository" }).length, 1);
  assert.equal(applyFilters(ROWS, { c: null, q: "nonsense" }).length, 0);
});

test("category and search combine — both must match", () => {
  assert.equal(applyFilters(ROWS, { c: "foundations", q: "sql" }).length, 0);
  assert.equal(applyFilters(ROWS, { c: "foundations", q: "commit" }).length, 1);
});

test("toggled clears a selected category rather than only ever setting it", () => {
  assert.deepEqual(toggled(EMPTY, "c", "data"), { c: "data", q: "" });
  assert.deepEqual(toggled({ c: "data", q: "" }, "c", "data"), { c: null, q: "" });
});

test("resultLine names the search term or the category, never both stacked", () => {
  assert.equal(resultLine(3, EMPTY), "3 roadmaps");
  assert.equal(resultLine(1, EMPTY), "1 roadmap");
  assert.equal(resultLine(2, { c: "data", q: "" }), "2 roadmaps in Data & analytics");
  assert.equal(resultLine(1, { c: "data", q: "sql" }), "1 roadmap matching sql");
});

// ── drift guard: the real module still exports exactly this shape ───────────

test("the real module matches this copy — category+search only, no stale facet exports", () => {
  const src = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "catalogue-filters.ts"),
    "utf8",
  );
  for (const name of ["CATEGORIES", "parseFilters", "toQueryString", "rowMatches", "applyFilters", "toggled", "resultLine"]) {
    assert.ok(
      new RegExp(`\\b${name}\\b`).test(src),
      `catalogue-filters.ts should still export ${name}`,
    );
  }
  // The facet system this file used to test is gone, not dormant — a
  // reintroduction should be a deliberate new decision, not a silent revert.
  for (const name of ["LEVELS", "LENGTHS", "FORMATS", "SORTS", "buildFacets", "FacetGroup", "activePills", "hasAnyFacet"]) {
    assert.ok(!src.includes(name), `catalogue-filters.ts should not export ${name} — see its header comment`);
  }
});
