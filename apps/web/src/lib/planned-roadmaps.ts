import type { Category } from "@/lib/catalogue-filters";
import type { DraftRoadmap } from "@/lib/draft-roadmaps";
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
  /** Present once there is a real row — undefined for a roadmap that
   *  hasn't been imported at all yet, 'draft' for one that has gone back
   *  offline, the two public values for an open one. */
  status?: "draft" | "self_checked" | "practitioner_reviewed";
  reviewedByName?: string | null;
  reviewedByTitle?: string | null;
  reviewedOn?: string | null;
}

/**
 * Merges the real published catalogue, the draft roadmaps (StatusKit's
 * "Being rebuilt" card — a real row, just not public), and the planned
 * list, in that precedence order by slug — a roadmap that has gone live
 * carries its real summary/level/weeks; one sent back to draft keeps its
 * title but loses them (nothing to summarise about a hidden lesson tree);
 * a never-imported one is `open: false` with no `status` at all.
 */
export function buildCatalogue(published: RoadmapSummary[], drafts: DraftRoadmap[] = []): CatalogueEntry[] {
  const bySlug = new Map<string, CatalogueEntry>();
  for (const p of PLANNED_ROADMAPS) {
    bySlug.set(p.slug, { slug: p.slug, title: p.title, category: p.category, open: false });
  }
  for (const d of drafts) {
    const existing = bySlug.get(d.slug);
    bySlug.set(d.slug, {
      slug: d.slug,
      title: d.title,
      category: existing?.category ?? "data",
      open: false,
      status: "draft",
    });
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
      status: r.status,
      reviewedByName: r.reviewedByName,
      reviewedByTitle: r.reviewedByTitle,
      reviewedOn: r.reviewedOn,
    });
  }
  return [...bySlug.values()];
}
