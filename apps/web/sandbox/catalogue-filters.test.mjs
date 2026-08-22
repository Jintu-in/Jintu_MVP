/**
 * The catalogue's filter model.
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
 * Worth pinning because three of these are quietly easy to get wrong and all
 * three are invisible until a user hits them: a facet count computed against
 * its own group (so every number reads as the unfiltered total), a facet that
 * renders with a count of zero (so the filter leads to an empty page), and a
 * facet that matches everything (so the filter is decoration that costs a tap
 * and a page load to discover).
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
const LEVELS = [
  { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Intermediate" },
  { key: "advanced", label: "Advanced" },
];
const LENGTHS = [
  { key: "short", label: "Under 12 weeks", test: (w) => w !== null && w < 12 },
  { key: "long", label: "12 weeks or more", test: (w) => w !== null && w >= 12 },
];
const FORMATS = [
  { key: "reading", label: "Mostly reading" },
  { key: "mixed", label: "Reading and video" },
  { key: "video", label: "Mostly video" },
];
const SORTS = [{ key: "new" }, { key: "short" }, { key: "long" }];

const EMPTY = { c: null, level: null, len: null, fmt: null, cert: false, noprereq: false, q: "", sort: "new" };

const read = (src, key) => {
  if (typeof src.get === "function") return src.get(key) ?? "";
  const v = src[key];
  return (Array.isArray(v) ? v[0] : v) ?? "";
};
const oneOf = (value, allowed) => (allowed.some((a) => a.key === value) ? value : null);

function parseFilters(src) {
  return {
    c: oneOf(read(src, "c"), CATEGORIES),
    level: oneOf(read(src, "level"), LEVELS),
    len: oneOf(read(src, "len"), LENGTHS),
    fmt: oneOf(read(src, "fmt"), FORMATS),
    cert: read(src, "cert") === "1",
    noprereq: read(src, "noprereq") === "1",
    q: read(src, "q").trim().slice(0, 120),
    sort: oneOf(read(src, "sort"), SORTS) ?? "new",
  };
}

function toQueryString(f) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.c) p.set("c", f.c);
  if (f.level) p.set("level", f.level);
  if (f.len) p.set("len", f.len);
  if (f.fmt) p.set("fmt", f.fmt);
  if (f.cert) p.set("cert", "1");
  if (f.noprereq) p.set("noprereq", "1");
  if (f.sort !== "new") p.set("sort", f.sort);
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

function rowMatches(row, f, skip) {
  if (!textMatches(row, f.q)) return false;
  if (skip !== "c" && f.c && row.category !== f.c) return false;
  if (skip !== "level" && f.level && row.level !== f.level) return false;
  if (skip !== "len" && f.len) {
    const bucket = LENGTHS.find((b) => b.key === f.len);
    if (!bucket || !bucket.test(row.weeks)) return false;
  }
  if (skip !== "fmt" && f.fmt && row.mediaMix !== f.fmt) return false;
  if (skip !== "cert" && f.cert && !row.hasFreeCert) return false;
  if (skip !== "noprereq" && f.noprereq && row.hasPrereqs) return false;
  return true;
}

const bySort = {
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
  short: (a, b) => (a.weeks ?? Infinity) - (b.weeks ?? Infinity),
  long: (a, b) => (b.weeks ?? -Infinity) - (a.weeks ?? -Infinity),
};
const applyFilters = (rows, f) => rows.filter((r) => rowMatches(r, f)).sort(bySort[f.sort]);

function buildFacets(rows, f) {
  const countIgnoring = (group, test) => rows.filter((r) => rowMatches(r, f, group) && test(r)).length;
  const totalIgnoring = (group) => rows.filter((r) => rowMatches(r, f, group)).length;
  const groups = [
    { group: "c", label: "Subject", kind: "single",
      facets: CATEGORIES.map((c) => ({ group: "c", key: c.key, label: c.label,
        count: countIgnoring("c", (r) => r.category === c.key), selected: f.c === c.key })) },
    { group: "len", label: "Length", kind: "single",
      facets: LENGTHS.map((b) => ({ group: "len", key: b.key, label: b.label,
        count: countIgnoring("len", (r) => b.test(r.weeks)), selected: f.len === b.key })) },
    { group: "level", label: "Level", kind: "single",
      facets: LEVELS.map((l) => ({ group: "level", key: l.key, label: l.label,
        count: countIgnoring("level", (r) => r.level === l.key), selected: f.level === l.key })) },
    { group: "fmt", label: "Format", kind: "single",
      facets: FORMATS.map((m) => ({ group: "fmt", key: m.key, label: m.label,
        count: countIgnoring("fmt", (r) => r.mediaMix === m.key), selected: f.fmt === m.key })) },
    { group: "cert", label: "", kind: "boolean",
      facets: [{ group: "cert", key: "1", label: "Free certification",
        count: countIgnoring("cert", (r) => r.hasFreeCert), selected: f.cert }] },
    { group: "noprereq", label: "", kind: "boolean",
      facets: [{ group: "noprereq", key: "1", label: "No prerequisites",
        count: countIgnoring("noprereq", (r) => !r.hasPrereqs), selected: f.noprereq }] },
  ];
  return groups
    .map((g) => ({ ...g, facets: g.facets.filter((x) => x.count > 0 || x.selected) }))
    .filter((g) => {
      if (g.facets.length === 0) return false;
      const whole = totalIgnoring(g.group);
      return !(g.facets.length === 1 && g.facets[0].count === whole && !g.facets[0].selected);
    });
}

function toggled(f, group, key) {
  switch (group) {
    case "c": return { ...f, c: f.c === key ? null : key };
    case "level": return { ...f, level: f.level === key ? null : key };
    case "len": return { ...f, len: f.len === key ? null : key };
    case "fmt": return { ...f, fmt: f.fmt === key ? null : key };
    case "cert": return { ...f, cert: !f.cert };
    case "noprereq": return { ...f, noprereq: !f.noprereq };
  }
}

// ── the four published roadmaps, as production has them ──────────────────────

const row = (o) => ({ mediaMix: "reading", hasFreeCert: false, hasPrereqs: false, ...o });
const ROWS = [
  row({ slug: "data-analyst", title: "Data analyst",
    summary: "Ninety-one days from zero to a portfolio.",
    tags: ["data", "sql", "python", "statistics", "analytics", "spreadsheets"],
    category: "data", level: "beginner", weeks: 13, createdAt: "2026-08-13T18:19:55Z" }),
  row({ slug: "java-spring-boot", title: "Java & Spring Boot backend developer",
    summary: "Modern Java 17+, Spring Boot 3, JPA, security and testing.",
    tags: ["java", "spring-boot", "backend", "sql", "programming"],
    category: "software", level: "beginner", weeks: 14, createdAt: "2026-08-13T18:20:13Z" }),
  row({ slug: "thinking-under-uncertainty", title: "Thinking clearly under uncertainty",
    summary: "Mental models, bias detection, Bayesian updating.",
    tags: ["thinking", "decision-making", "statistics", "forecasting", "rationality"],
    category: "judgement", level: "intermediate", weeks: 10, createdAt: "2026-08-13T18:20:42Z" }),
  row({ slug: "amazon-ads", title: "Amazon Ads & retail media",
    summary: "Retail readiness to clean-room SQL and incrementality.",
    tags: ["marketing", "amazon-ads", "ecommerce", "retail-media", "advertising"],
    category: "business", level: "intermediate", weeks: 13, hasFreeCert: true,
    createdAt: "2026-08-13T18:21:12Z" }),
];

const slugs = (rs) => rs.map((r) => r.slug);

// ── the URL is the state ─────────────────────────────────────────────────────

test("the acceptance URL returns exactly one roadmap", () => {
  const f = parseFilters(new URLSearchParams("c=software&level=beginner"));
  assert.deepEqual(slugs(applyFilters(ROWS, f)), ["java-spring-boot"]);
});

test("a filter round-trips through the URL unchanged", () => {
  const f = parseFilters(new URLSearchParams("c=business&len=long&cert=1&sort=short"));
  assert.equal(toQueryString(f), "?c=business&len=long&cert=1&sort=short");
  assert.deepEqual(parseFilters(new URLSearchParams(toQueryString(f).slice(1))), f);
});

test("defaults are omitted so one filter state is one URL", () => {
  assert.equal(toQueryString(EMPTY), "");
  assert.equal(toQueryString({ ...EMPTY, sort: "new" }), "", "the default sort never appears");
  assert.equal(toQueryString({ ...EMPTY, c: "data" }), "?c=data");
});

test("a broken link degrades to the unfiltered catalogue, not an empty page", () => {
  const f = parseFilters(new URLSearchParams("c=astrology&level=banana&sort=nonsense"));
  assert.equal(f.c, null);
  assert.equal(f.level, null);
  assert.equal(f.sort, "new");
  assert.equal(applyFilters(ROWS, f).length, 4);
});

test("a group is single-select: a repeated param keeps one value", () => {
  const f = parseFilters(new URLSearchParams("c=data&c=software"));
  assert.equal(f.c, "data");
  // And toggling within the group replaces rather than accumulates.
  assert.equal(toggled(f, "c", "business").c, "business");
  assert.equal(toggled(f, "c", "data").c, null, "choosing the chosen one clears it");
});

test("groups combine: subject and level narrow together", () => {
  const f = { ...EMPTY, c: "data", level: "intermediate" };
  assert.equal(applyFilters(ROWS, f).length, 0, "data has no intermediate roadmap");
  assert.deepEqual(slugs(applyFilters(ROWS, { ...EMPTY, c: "data", level: "beginner" })), ["data-analyst"]);
});

// ── the facets ───────────────────────────────────────────────────────────────

test("no facet is ever rendered with a count of zero", () => {
  for (const f of [
    EMPTY,
    { ...EMPTY, c: "software" },
    { ...EMPTY, level: "intermediate" },
    { ...EMPTY, len: "short" },
    { ...EMPTY, cert: true },
    { ...EMPTY, q: "sql" },
    { ...EMPTY, c: "business", level: "intermediate", len: "long" },
  ]) {
    for (const g of buildFacets(ROWS, f)) {
      for (const x of g.facets) {
        assert.ok(x.count > 0 || x.selected, `${g.group}/${x.key} rendered with ${x.count} behind it`);
      }
    }
  }
});

test("facet counts change when another filter is applied", () => {
  const levels = (f) =>
    Object.fromEntries(
      (buildFacets(ROWS, f).find((g) => g.group === "level")?.facets ?? []).map((x) => [x.key, x.count]),
    );
  assert.deepEqual(levels(EMPTY), { beginner: 2, intermediate: 2 });
  // Choose data and the Level facets are recounted against it: intermediate
  // does not go to zero, it stops existing.
  assert.deepEqual(levels({ ...EMPTY, len: "long" }), { beginner: 2, intermediate: 1 });
  // Choose software and Level disappears altogether — one roadmap is left
  // and "Beginner (1)" is a control that cannot change the answer.
  assert.deepEqual(levels({ ...EMPTY, c: "software" }), {});
});

test("a facet is counted against the other groups, not against itself", () => {
  // With beginner chosen, the Subject counts must still show what each
  // subject would give you — not 1/1/0/0 collapsed by Subject's own filter.
  const f = { ...EMPTY, level: "beginner" };
  const subjects = buildFacets(ROWS, f).find((g) => g.group === "c");
  assert.deepEqual(
    subjects.facets.map((x) => [x.key, x.count]),
    [["data", 1], ["software", 1]],
    "only the two subjects with a beginner roadmap survive, each counted honestly",
  );
});

test("the chosen facet survives even when its own count is one", () => {
  const f = { ...EMPTY, c: "business" };
  const subjects = buildFacets(ROWS, f).find((g) => g.group === "c");
  assert.ok(subjects.facets.some((x) => x.key === "business" && x.selected),
    "removing the control you just used would make the filter impossible to undo");
});

test("a facet that matches everything is not rendered — it is decoration", () => {
  // Nobody has marked a roadmap as having prerequisites, so "No prerequisites"
  // would sit there matching all four.
  assert.equal(buildFacets(ROWS, EMPTY).find((g) => g.group === "noprereq"), undefined);
  // Same for Format while every roadmap computes to 'reading'.
  assert.equal(buildFacets(ROWS, EMPTY).find((g) => g.group === "fmt"), undefined);
  // Give one roadmap a different mix and Format starts earning its place.
  const mixed = ROWS.map((r) => (r.slug === "data-analyst" ? { ...r, mediaMix: "mixed" } : r));
  const fmt = buildFacets(mixed, EMPTY).find((g) => g.group === "fmt");
  assert.deepEqual(fmt.facets.map((x) => [x.key, x.count]), [["reading", 3], ["mixed", 1]]);
});

test("free certification is a real facet — one of four, so it narrows", () => {
  const cert = buildFacets(ROWS, EMPTY).find((g) => g.group === "cert");
  assert.equal(cert.facets[0].count, 1);
  assert.deepEqual(slugs(applyFilters(ROWS, { ...EMPTY, cert: true })), ["amazon-ads"]);
});

test("a pill removes its own facet and leaves the rest alone", () => {
  // Regression: the pills were built with a literal "1" as the key, which for
  // a single-select group SETS c=1 rather than clearing c. parseFilters then
  // dropped the junk value, so the pill looked like it worked while writing
  // an href nobody would want to share.
  const f = { ...EMPTY, c: "data", level: "beginner" };
  assert.equal(toQueryString(toggled(f, "c", f.c)), "?level=beginner");
  assert.equal(toQueryString(toggled(f, "level", f.level)), "?c=data");
  assert.equal(toQueryString(toggled(f, "c", "1")), "?c=1&level=beginner",
    "the old bug, pinned: a literal key writes c=1, which parseFilters then drops");
  assert.equal(parseFilters(new URLSearchParams("c=1&level=beginner")).c, null,
    "so the page looked right and the URL was junk — hence the key on every pill");
});

// ── search ───────────────────────────────────────────────────────────────────

test("searching sql matches Data analyst through its tags", () => {
  const hit = applyFilters(ROWS, { ...EMPTY, q: "sql" });
  assert.ok(slugs(hit).includes("data-analyst"));
  const da = ROWS.find((r) => r.slug === "data-analyst");
  assert.ok(!da.title.toLowerCase().includes("sql"), "not via the title");
  assert.ok(!da.summary.toLowerCase().includes("sql"), "not via the summary");
  assert.ok(da.tags.includes("sql"), "via subject_tags, which is the point");
});

test("search composes with the facets rather than replacing them", () => {
  assert.deepEqual(slugs(applyFilters(ROWS, { ...EMPTY, q: "sql", c: "software" })), ["java-spring-boot"]);
});

test("a search with no match returns nothing rather than everything", () => {
  assert.equal(applyFilters(ROWS, { ...EMPTY, q: "kubernetes" }).length, 0);
});

// ── sort ─────────────────────────────────────────────────────────────────────

test("sort orders by what it says", () => {
  assert.equal(applyFilters(ROWS, { ...EMPTY, sort: "short" })[0].weeks, 10);
  assert.equal(applyFilters(ROWS, { ...EMPTY, sort: "long" })[0].weeks, 14);
  assert.equal(applyFilters(ROWS, { ...EMPTY, sort: "new" })[0].slug, "amazon-ads");
});

// ── the copy above has not drifted from the module below ─────────────────────

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const lib = readFileSync(join(SRC, "lib", "catalogue-filters.ts"), "utf8");
const page = readFileSync(join(SRC, "components", "catalogue", "catalogue-page.tsx"), "utf8");
const sheet = readFileSync(join(SRC, "components", "catalogue", "catalogue-sheet.tsx"), "utf8");
const search = readFileSync(join(SRC, "components", "catalogue", "catalogue-search.tsx"), "utf8");

test("the real module still exports everything this file copied", () => {
  for (const name of [
    "parseFilters", "toQueryString", "rowMatches", "applyFilters",
    "buildFacets", "toggled", "activePills", "resultLine", "textMatches",
  ]) {
    assert.match(lib, new RegExp(`export function ${name}\\b|export const ${name}\\b`), `${name} should be exported`);
  }
});

test("the buckets and the thresholds still match the copy", () => {
  assert.match(lib, /key: "short", label: "Under 12 weeks", test: \(w: number \| null\) => w !== null && w < 12/);
  assert.match(lib, /key: "long", label: "12 weeks or more", test: \(w: number \| null\) => w !== null && w >= 12/);
  // The six of migration 0022. This list and the CHECK must agree: a key
  // here the constraint rejects makes a facet nothing can fill, and one in
  // the constraint but missing here hides a whole category from /learn.
  for (const c of ["data", "software", "business", "health", "judgement", "foundations"]) {
    assert.match(lib, new RegExp(`key: "${c}"`), `${c} should still be a category`);
  }
});

test("the page holds no filter state of its own", () => {
  assert.ok(!page.includes('"use client"'), "the catalogue renders on the server");
  assert.ok(!/useState|useSearchParams/.test(page), "no filter state outside the URL");
  assert.match(page, /toQueryString/, "every control is a link built from the filters");
});

test("the sheet's draft state is the one deliberate exception, and it commits once", () => {
  assert.match(sheet, /useState<Filters>\(filters\)/, "the sheet edits a draft");
  assert.match(sheet, /router\.push/, "and commits it with a single navigation");
  assert.match(sheet, /Show \{shown\}/, "the apply button states the live count");
  assert.ok(!/group === "c"[^)]*\)\s*$/m.test(sheet) === false || sheet.includes('g.group !== "c"'),
    "the sheet must not offer Subject — the chip row owns it");
});

test("the search field debounces at 200ms and replaces rather than pushes", () => {
  assert.match(search, /}, 200\);/, "200ms, per the brief");
  assert.match(search, /router\.replace/, "typing must not fill the back button with letters");
});

test('"Filters" is one control, not a heading repeated down the page', () => {
  const inPage = (page.match(/>\s*Filters\b/g) ?? []).length;
  assert.equal(inPage, 0, "the rail's Filters heading is gone — the group labels say what they are");
  // The trigger and the sheet's own title are the same control in two states
  // and are never on screen together.
  assert.equal((sheet.match(/>\s*Filters\b|\bFilters\n/g) ?? []).length <= 2, true);
});

test("Subject is offered once at any width", () => {
  assert.match(page, /subjectGroup \? \(/, "the chip row is the below-lg copy");
  assert.match(page, /lg:hidden/, "and it hides where the rail takes over");
  assert.match(sheet, /g\.group !== "c"/, "the sheet leaves Subject alone");
});
