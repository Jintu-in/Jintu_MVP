/**
 * The catalogue's filter model, as pure functions over plain data.
 *
 * Deliberately free of React and of `server-only`: the server renders the
 * first paint from these, the client re-renders from the same URL through
 * exactly the same code, and apps/web/sandbox tests them without a browser.
 * Two implementations of "which roadmaps match" would disagree the first
 * time one of them changed.
 *
 * The URL is the state. Category and search are both search params, so a
 * filtered catalogue is shareable, bookmarkable, indexable and
 * back-buttonable, and nothing lives in a useState that a reload would
 * throw away.
 *
 * TRIMMED DELIBERATELY. This module used to carry Level, Length, Format,
 * a free-certification toggle, a no-prerequisites toggle, and three sort
 * orders — a real, working faceted-search system, built against an earlier
 * design ("Catalogue with sidebar"). The current design
 * (V2Roadmaps.dc.html / DeskRoadmaps.dc.html) shows only a category chip
 * row and a search field. Asked which to build (2026-10-19): match the
 * current design, not the richer system the old one drew — right-sized for
 * a catalogue of fewer than a dozen roadmaps, where those facets mostly
 * sorted a result set small enough to just read. If the catalogue grows
 * enough that browsing it needs more than a subject and a search box
 * again, that is a real decision to make again, not a default to restore.
 */

/**
 * Six, matching the CHECK in migration 0022 exactly — same keys, same order.
 * A key here that the constraint rejects makes a facet nothing can ever fill;
 * a key in the constraint that is missing here silently hides a roadmap's
 * whole category from the catalogue.
 *
 * Foundations sits last on purpose. It holds the prerequisites — Git, Linux,
 * Excel — and somebody browsing for a subject should meet the subjects first.
 */
export const CATEGORIES = [
  { key: "data", label: "Data & analytics" },
  { key: "software", label: "Software & engineering" },
  { key: "business", label: "Business & growth" },
  { key: "health", label: "Health & life sciences" },
  { key: "judgement", label: "Thinking & judgement" },
  { key: "foundations", label: "Foundations" },
] as const;

export type Category = (typeof CATEGORIES)[number]["key"];

/** Also the search-param name, deliberately. */
export type Group = "c";

/** Everything the filters read. The card's display strings live alongside. */
export interface CatalogueRow {
  slug: string;
  href: string;
  title: string;
  summary: string;
  /** subject_tags — search reaches these; the chip row never does. */
  tags: string[];
  category: Category;
  level: "beginner" | "intermediate" | "advanced";
  weeks: number | null;
  /** Real publish status — never inferred from href or progress. */
  open: boolean;
  /** Display-only, carried through untouched. */
  metaLine: string;
  footLine: string;
  progress?: { pct: number; line: string };
  finished?: { line: string };
}

export interface Filters {
  c: Category | null;
  q: string;
}

export const EMPTY_FILTERS: Filters = { c: null, q: "" };

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
 * carried: `?c=banana` is a broken link, and the honest response is the
 * unfiltered catalogue, not an empty page.
 */
export function parseFilters(src: ParamSource): Filters {
  return {
    c: oneOf(read(src, "c"), CATEGORIES),
    q: read(src, "q").trim().slice(0, 120),
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
  const s = p.toString();
  return s ? `?${s}` : "";
}

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

export function rowMatches(row: CatalogueRow, f: Filters): boolean {
  if (!textMatches(row, f.q)) return false;
  if (f.c && row.category !== f.c) return false;
  return true;
}

export function applyFilters(rows: CatalogueRow[], f: Filters): CatalogueRow[] {
  return rows.filter((r) => rowMatches(r, f));
}

/** The filters with the category toggled — the href every chip points at. */
export function toggled(f: Filters, group: Group, key: string): Filters {
  switch (group) {
    case "c":
      return { ...f, c: f.c === key ? null : (key as Category) };
  }
}

/** "4 roadmaps", "1 roadmap in Data & analytics", "2 matching sql". */
export function resultLine(count: number, f: Filters): string {
  const noun = `${count} ${count === 1 ? "roadmap" : "roadmaps"}`;
  if (f.q) return `${noun} matching ${f.q}`;
  if (f.c) return `${noun} in ${CATEGORIES.find((x) => x.key === f.c)!.label}`;
  return noun;
}
