import type { Metadata } from "next";
import CataloguePage, { type CatalogueCard } from "@/components/catalogue/catalogue-page";
import { listPublishedRoadmaps } from "@/lib/roadmaps";
import { getViewer } from "@/lib/session";

/**
 * The catalogue (/learn), rendered through the design-set CataloguePage.
 * The component filters client-side — four roadmaps do not need a server
 * round-trip per facet — and ?q= still prefills the search box so old
 * shared links keep working. Facets, counts and card lines are all
 * computed here from published rows.
 *
 * Rendered on demand: CI builds with no Supabase configured.
 */
export const dynamic = "force-dynamic";

const DESCRIPTION =
  "Deep, free roadmaps for any subject — curated reads, videos and docs in the order that teaches. Browse by subject, difficulty and time.";

export const metadata: Metadata = {
  title: "Roadmaps",
  description: DESCRIPTION,
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

const sentence = (s: string) => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

export default async function RoadmapsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, all, viewer] = await Promise.all([
    searchParams,
    listPublishedRoadmaps(),
    getViewer(),
  ]);

  const cards: CatalogueCard[] = all.map((r) => ({
    slug: r.slug,
    href: `/learn/${r.slug}`,
    title: r.title,
    metaLine: `${r.difficulty}${r.estimatedWeeks ? ` · ~${r.estimatedWeeks} weeks` : ""}`,
    summary: r.summary,
    subject: sentence(r.subjectTags[0] ?? "General"),
    level: sentence(r.difficulty),
    weeks: r.estimatedWeeks,
    footLine: [
      `${r.moduleCount} modules`,
      `${r.nodeCount} nodes`,
      ...(r.estimatedHours ? [`~${r.estimatedHours} hours`] : []),
    ].join(" · "),
    // In-progress and finished card states exist in the component; the
    // route sends them once a per-roadmap progress summary helper exists.
  }));

  return (
    <CataloguePage
      cards={cards}
      signedIn={Boolean(viewer?.hasProfile)}
      signInHref="/join?next=/learn"
      dashboardHref="/dashboard"
      initialQuery={q ?? ""}
    />
  );
}
