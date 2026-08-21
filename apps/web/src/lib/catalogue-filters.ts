/**
 * The catalogue's filter model, as pure functions over plain data.
 *
 * Deliberately free of React and of `server-only`: the server renders the
 * first paint from these, the client re-renders from the same URL through
 * exactly the same code, and apps/web/sandbox tests them without a browser.
 * Two implementations of "which roadmaps match" would disagree the first
 * time one of them changed.
 *
 * The URL is the state. Every facet is a search param, so a filtered
 * catalogue is shareable, bookmarkable, indexable and back-buttonable, and
 * nothing lives in a useState that a reload would throw away.
 *
 * Two rules the whole thing is built around:
 *
 *   1. A facet's count is computed against every OTHER active filter, so the
 *      number says what choosing it would leave you with.
 *   2. A facet that would return nothing is not rendered — not greyed, not
 *      disabled, not shown as "0". Neither is a facet that would return
 *      everything, because selecting it is a no-op and a filter that does
 *      nothing is worse than a missing one.
 */

export const CATEGORIES = [
  { key: "data", label: "Data & analytics" },
  { key: "software", label: "Software & engineering" },
  { key: "marketing", label: "Marketing & commerce" },
  { key: "judgement", label: "Thinking & judgement" },
] as const;

export const LEVELS = [
  { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Intermediate" },
  { key: "advanced", label: "Advanced" },
] as const;

/**
 * Length buckets. The boundary is 12 weeks because that is where the four
 * published roadmaps actually split (10, 13, 13, 14) — a bucket that holds
 * everything or nothing is not a filter.
 */
export const LENGTHS = [
  { key: "short", label: "Under 12 weeks", test: (w: number | null) => w !== null && w < 12 },
  { key: "long", label: "12 weeks or more", test: (w: number | null) => w !== null && w >= 12 },
] as const;

export const FORMATS = [
  { key: "reading", label: "Mostly reading" },
  { key: "mixed", label: "Reading and video" },
  { key: "video", label: "Mostly video" },
] as const;

export const SORTS = [
  { key: "new", label: "Newest" },
  { key: "short", label: "Shortest" },
  { key: "long", label: "Longest" },
] as const;

export type Category = (typeof CATEGORIES)[number]["key"];
export type Level = (typeof LEVELS)[number]["key"];
export type LengthKey = (typeof LENGTHS)[number]["key"];
export type Format = (typeof FORMATS)[number]["key"];
export type Sort = (typeof SORTS)[number]["key"];

/** The group a facet belongs to. Also the search-param name, deliberately. */
export type Group = "c" | "level" | "len" | "fmt" | "cert" | "noprereq";

/** Everything the filters read. The card's display strings live alongside. */
export interface CatalogueRow {
  slug: string;
  href: string;
  title: string;
  summary: string;
  /** subject_tags — search reaches these; the facets never do. */
  tags: string[];
  category: Category;
  level: Level;
  weeks: number | null;
  mediaMix: Format;
  hasFreeCert: boolean;
  hasPrereqs: boolean;
  /** ISO timestamp, for "Newest". */
  createdAt: string;
  /** Display-only, carried through untouched. */
  metaLine: string;
  footLine: string;
  progress?: { pct: number; line: string };
  finished?: { line: string };
}

export interface Filters {
  c: Category | null;
  level: Level | null;
  len: LengthKey | null;
  fmt: Format | null;
  cert: boolean;
  noprereq: boolean;
  q: string;
  sort: Sort;
}

export const EMPTY_FILTERS: Filters = {
  c: null,
  level: null,
  len: null,
  fmt: null,
  cert: false,
  noprereq: false,
  q: "",
  sort: "new",
};

/** Anything Next hands a page as searchParams, or a real URLSearchParams. */
export type ParamSource =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

const read = (src: ParamSource, key: string): string => {
  if (typeof (src as URLSearchParams).get === "function") {
    return (src as URLSearchParams).get(key) ?? "";
  }
  const v = (src as Record<string, string | string[] | undefined>)[key];
  return (Array.isArray(v) ? v[0] : v) ?? "";
};

const oneOf = <T extends string>(value: string, allowed: readonly { key: T }[]): T | null =>
  allowed.some((a) => a.key === value) ? (value as T) : null;

/**
 * Read the filters out of a URL. Unknown values are dropped rather than
 * carried: `?level=banana` is a broken link, and the honest response is the
 * unfiltered catalogue, not an empty page.
 *
 * Single-select within a group is enforced here — `?c=data&c=software` keeps
 * the first. With four roadmaps, multi-select inside one group returns the
 * same set as no filter at all, so it is a control that does nothing.
 */
export function parseFilters(src: ParamSource): Filters {
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

/**
 * Back to a query string, in a fixed order and with defaults omitted, so the
 * same filter state always produces the same URL. Two spellings of one page
 * is a duplicate for a crawler and a cache miss for everyone else.
 */
export function toQueryString(f: Filters): string {
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

export const hasAnyFacet = (f: Filters): boolean =>
  Boolean(f.c || f.level || f.len || f.fmt || f.cert || f.noprereq);

/** Search covers title, summary and subject_tags — the tags are the point. */
export function textMatches(row: CatalogueRow, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    row.title.toLowerCase().includes(needle) ||
    row.summary.toLowerCase().includes(needle) ||
    row.tags.some((t) => t.toLowerCase().includes(needle))
  );
}

/**
 * Does this row survive the filters — optionally ignoring one group?
 *
 * `skip` is what makes the counts live: to count the Level facets, ask how
 * many rows match everything except Level.
 */
export function rowMatches(row: CatalogueRow, f: Filters, skip?: Group): boolean {
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

const bySort: Record<Sort, (a: CatalogueRow, b: CatalogueRow) => number> = {
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
  short: (a, b) => (a.weeks ?? Infinity) - (b.weeks ?? Infinity),
  long: (a, b) => (b.weeks ?? -Infinity) - (a.weeks ?? -Infinity),
};

export function applyFilters(rows: CatalogueRow[], f: Filters): CatalogueRow[] {
  return rows.filter((r) => rowMatches(r, f)).sort(bySort[f.sort]);
}

export interface Facet {
  group: Group;
  key: string;
  label: string;
  count: number;
  selected: boolean;
}

export interface FacetGroup {
  group: Group;
  label: string;
  /** Radio inside a group, checkbox across groups — see the module note. */
  kind: "single" | "boolean";
  facets: Facet[];
}

/**
 * Build the rendered facet list.
 *
 * A group is dropped when it cannot change the answer: no options left after
 * removing the zeros, or one option whose count is the whole result set. The
 * second case is the quiet one — "No prerequisites (4 of 4)" looks like a
 * filter and behaves like decoration.
 *
 * A selected facet always survives, whatever its count, or choosing it would
 * remove the control you just used and you could not undo it.
 */
export function buildFacets(rows: CatalogueRow[], f: Filters): FacetGroup[] {
  const countIgnoring = (group: Group, test: (r: CatalogueRow) => boolean) =>
    rows.filter((r) => rowMatches(r, f, group) && test(r)).length;
  const totalIgnoring = (group: Group) => rows.filter((r) => rowMatches(r, f, group)).length;

  const groups: FacetGroup[] = [
    {
      group: "c",
      label: "Subject",
      kind: "single",
      facets: CATEGORIES.map((c) => ({
        group: "c" as const,
        key: c.key,
        label: c.label,
        count: countIgnoring("c", (r) => r.category === c.key),
        selected: f.c === c.key,
      })),
    },
    {
      group: "len",
      label: "Length",
      kind: "single",
      facets: LENGTHS.map((b) => ({
        group: "len" as const,
        key: b.key,
        label: b.label,
        count: countIgnoring("len", (r) => b.test(r.weeks)),
        selected: f.len === b.key,
      })),
    },
    {
      group: "level",
      label: "Level",
      kind: "single",
      facets: LEVELS.map((l) => ({
        group: "level" as const,
        key: l.key,
        label: l.label,
        count: countIgnoring("level", (r) => r.level === l.key),
        selected: f.level === l.key,
      })),
    },
    {
      group: "fmt",
      label: "Format",
      kind: "single",
      facets: FORMATS.map((m) => ({
        group: "fmt" as const,
        key: m.key,
        label: m.label,
        count: countIgnoring("fmt", (r) => r.mediaMix === m.key),
        selected: f.fmt === m.key,
      })),
    },
    {
      group: "cert",
      label: "",
      kind: "boolean",
      facets: [
        {
          group: "cert" as const,
          key: "1",
          label: "Free certification",
          count: countIgnoring("cert", (r) => r.hasFreeCert),
          selected: f.cert,
        },
      ],
    },
    {
      group: "noprereq",
      label: "",
      kind: "boolean",
      facets: [
        {
          group: "noprereq" as const,
          key: "1",
          label: "No prerequisites",
          count: countIgnoring("noprereq", (r) => !r.hasPrereqs),
          selected: f.noprereq,
        },
      ],
    },
  ];

  return groups
    .map((g) => ({ ...g, facets: g.facets.filter((x) => x.count > 0 || x.selected) }))
    .filter((g) => {
      if (g.facets.length === 0) return false;
      const whole = totalIgnoring(g.group);
      const decorative =
        g.facets.length === 1 && g.facets[0]!.count === whole && !g.facets[0]!.selected;
      return !decorative;
    });
}

/** The filters with one facet toggled — the href every control points at. */
export function toggled(f: Filters, group: Group, key: string): Filters {
  switch (group) {
    case "c":
      return { ...f, c: f.c === key ? null : (key as Category) };
    case "level":
      return { ...f, level: f.level === key ? null : (key as Level) };
    case "len":
      return { ...f, len: f.len === key ? null : (key as LengthKey) };
    case "fmt":
      return { ...f, fmt: f.fmt === key ? null : (key as Format) };
    case "cert":
      return { ...f, cert: !f.cert };
    case "noprereq":
      return { ...f, noprereq: !f.noprereq };
  }
}

/**
 * Every active facet as a removable pill, in the order the sidebar shows.
 *
 * `key` is the currently chosen value, not a placeholder: toggled() clears a
 * single-select group only when handed the value already in it. Passing "1"
 * for every pill would SET c=1 instead of clearing c, which parseFilters then
 * throws away — the pill would appear to work while writing a junk URL.
 */
export function activePills(f: Filters): { group: Group; key: string; label: string }[] {
  const out: { group: Group; key: string; label: string }[] = [];
  if (f.c) out.push({ group: "c", key: f.c, label: CATEGORIES.find((x) => x.key === f.c)!.label });
  if (f.len) out.push({ group: "len", key: f.len, label: LENGTHS.find((x) => x.key === f.len)!.label });
  if (f.level) out.push({ group: "level", key: f.level, label: LEVELS.find((x) => x.key === f.level)!.label });
  if (f.fmt) out.push({ group: "fmt", key: f.fmt, label: FORMATS.find((x) => x.key === f.fmt)!.label });
  if (f.cert) out.push({ group: "cert", key: "1", label: "Free certification" });
  if (f.noprereq) out.push({ group: "noprereq", key: "1", label: "No prerequisites" });
  return out;
}

/** "4 roadmaps", "1 roadmap in Data & analytics, beginner", "2 matching sql". */
export function resultLine(count: number, f: Filters): string {
  const noun = `${count} ${count === 1 ? "roadmap" : "roadmaps"}`;
  if (f.q) return `${noun} matching ${f.q}`;
  const pills = activePills(f).map((p) => p.label.toLowerCase());
  return pills.length ? `${noun} in ${pills.join(", ")}` : noun;
}
