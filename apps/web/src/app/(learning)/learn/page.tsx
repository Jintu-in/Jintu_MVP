import type { Metadata } from "next";
import CataloguePage from "@/components/catalogue/catalogue-page";
import { parseFilters, type CatalogueRow } from "@/lib/catalogue-filters";
import { listPublishedRoadmaps } from "@/lib/roadmaps";

/**
 * The catalogue (/learn).
 *
 * Filters are read from the URL here and handed down already parsed, so the
 * first paint of /learn?c=software&level=beginner is the filtered page rather
 * than the whole catalogue rearranging itself after hydration. Four roadmaps
 * do not need a server round-trip per facet, so the whole set is sent and the
 * component narrows it — but from the same parsed object, through the same
 * pure functions, so the two cannot disagree.
 *
 * Rendered on demand: CI builds with no Supabase configured.
 */
export const dynamic = "force-dynamic";

const DESCRIPTION =
  "Deep, free roadmaps for any subject — curated reads, videos and docs in the order that teaches. Browse by subject, length, level and format.";

export const metadata: Metadata = {
  title: "Roadmaps",
  description: DESCRIPTION,
  // Canonical is the bare /learn on every filtered view. A facet combination
  // is the same four roadmaps in a different order, and indexing each one is
  // how a catalogue of one page becomes a hundred near-duplicates.
  alternates: { canonical: "/learn" },
  // Page-specific OG, not the layout's: og:title must say what THIS page
  // is and og:url must be the canonical /learn — otherwise every share of
  // the catalogue resolves to the homepage. images stays explicit because
  // a page-level openGraph replaces the layout's wholesale and would
  // silently drop the root card (the #93 regression).
  openGraph: {
    type: "website",
    title: "Roadmaps · Jintu",
    description: DESCRIPTION,
    url: "/learn",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Jintu — one place to learn anything, properly.",
      },
    ],
  },
  twitter: { card: "summary_large_image", title: "Roadmaps · Jintu", description: DESCRIPTION },
};

export default async function RoadmapsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, all] = await Promise.all([searchParams, listPublishedRoadmaps()]);
  const filters = parseFilters(params);

  const rows: CatalogueRow[] = all.map((r) => ({
    slug: r.slug,
    href: `/learn/${r.slug}`,
    title: r.title,
    summary: r.summary,
    tags: r.subjectTags,
    category: r.category,
    level: r.difficulty,
    weeks: r.estimatedWeeks,
    mediaMix: r.mediaMix,
    hasFreeCert: r.hasFreeCert,
    hasPrereqs: r.hasPrereqs,
    createdAt: r.createdAt,
    // The design's card meta: how long it runs, and how many days that is.
    metaLine: [r.estimatedWeeks ? `◷ ~${r.estimatedWeeks} weeks` : null, `▦ ${r.nodeCount} days`]
      .filter(Boolean)
      .join(" · "),
    footLine: r.estimatedHours ? `~${r.estimatedHours} hrs` : `${r.moduleCount} modules`,
    // In-progress and finished card states exist in the component; the
    // route sends them once a per-roadmap progress summary helper exists.
  }));

  return <CataloguePage rows={rows} filters={filters} />;
}
