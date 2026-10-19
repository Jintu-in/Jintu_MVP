import type { Category } from "@/lib/catalogue-filters";
import type { RoadmapSummary } from "@/lib/roadmaps";

/**
 * The roadmaps committed to in `docs/roadmaps/` but not necessarily
 * imported yet — real, written content files, not invented titles. Shared
 * between the homepage and `/learn`, which both need to show "coming soon"
 * entries without either one inventing its own list that could drift from
 * the other's.
 *
 * Diffed against `listPublishedRoadmaps()` by callers, so a roadmap
 * disappears from "coming soon" the moment it actually goes live —
 * automatically, not by someone remembering to edit this file too.
 *
 * Deliberately NOT ten: the design's own mockup (V2Roadmaps.dc.html) shows
 * a tenth, "DSA starter," with no corresponding file anywhere in
 * `docs/roadmaps/` — nothing to verify it against, so it stays off this
 * list rather than asserting content exists that doesn't.
 */
export const PLANNED_ROADMAPS: { slug: string; title: string; category: Category }[] = [
  { slug: "git-and-github", title: "Git & GitHub", category: "foundations" },
  { slug: "linux-command-line", title: "Linux & the command line", category: "foundations" },
  { slug: "excel-at-work", title: "Excel that actually gets used at work", category: "foundations" },
  { slug: "amazon-ads", title: "Amazon Ads & retail media", category: "business" },
  { slug: "startup-finance", title: "Startup finance & fundraising", category: "business" },
  { slug: "medical-coding", title: "Medical coding — ICD-10 and CPT", category: "health" },
  { slug: "java-spring-boot", title: "Java & Spring Boot backend developer", category: "software" },
  { slug: "data-analyst", title: "Data analyst", category: "data" },
  { slug: "thinking-under-uncertainty", title: "Thinking clearly under uncertainty", category: "judgement" },
];

export interface CatalogueEntry {
  slug: string;
  title: string;
  category: Category;
  open: boolean;
  /** Only present when open — nothing to summarise about an unwritten roadmap. */
  summary?: string;
  level?: RoadmapSummary["difficulty"];
  weeks?: number | null;
}

/**
 * Merges the real published catalogue with the planned list, published
 * taking precedence by slug — a roadmap that has gone live is "open" and
 * carries its real summary/level/weeks, never listed twice.
 */
export function buildCatalogue(published: RoadmapSummary[]): CatalogueEntry[] {
  const bySlug = new Map<string, CatalogueEntry>();
  for (const p of PLANNED_ROADMAPS) {
    bySlug.set(p.slug, { slug: p.slug, title: p.title, category: p.category, open: false });
  }
  for (const r of published) {
    bySlug.set(r.slug, {
      slug: r.slug,
      title: r.title,
      category: r.category,
      open: true,
      summary: r.summary,
      level: r.difficulty,
      weeks: r.estimatedWeeks,
    });
  }
  return [...bySlug.values()];
}
