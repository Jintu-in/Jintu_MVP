import type { Metadata } from "next";
import Homepage from "@/components/marketing/homepage";
import { countPublishedResources, listPublishedRoadmaps, type RoadmapSummary } from "@/lib/roadmaps";
import { getViewer } from "@/lib/session";

/**
 * The homepage: hero question, one flagship roadmap, three plain sections.
 *
 * The "Start today" card is read from the database and every number on it is
 * real — module, node and hour counts grow as the curriculum is imported,
 * and a page that invented "52 nodes" while the catalogue held twelve would
 * be the exact kind of claim this site exists to never make. If the read
 * fails or nothing is published, the card disappears rather than lying.
 *
 * The hero input is a plain GET form into /learn, where the filtering
 * happens server-side. No JS, works on the cheapest phone, and the search
 * screen proper (phase-3 screen 4) can replace the target without touching
 * this form.
 */
export const metadata: Metadata = {
  // absolute: the layout's "%s · Jintu" template would otherwise double the
  // brand — "Jintu — learn anything, properly · Jintu" shipped once already.
  title: { absolute: "Jintu — learn anything, properly" },
  description:
    "Deep, free roadmaps built from the best free material on the internet. " +
    "Reads, videos and docs in the order that teaches, with your progress tracked.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Jintu — learn anything, properly",
    description: "Deep, free roadmaps built from the best free material on the internet.",
    url: "/",
    siteName: "Jintu",
    locale: "en_IN",
    type: "website",
    // Explicit, because a page-level openGraph block replaces the layout's
    // wholesale — shipping this object without images is what made the
    // homepage preview imageless in WhatsApp. The URL is the file-based
    // card at app/opengraph-image.tsx; metadataBase absolutizes it.
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Jintu — one place to learn anything, properly. Free roadmaps, curated links, your progress tracked.",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const roadmaps: RoadmapSummary[] = await listPublishedRoadmaps().catch(() => []);
  const viewer = await getViewer().catch(() => null);

  // Every figure in the numbers band is derived, never typed in. The design
  // said "500+ curated links"; there are 228, and a marketing page that
  // rounds up is the one that gets quoted back at you.
  const days = roadmaps.reduce((a, r) => a + r.nodeCount, 0);
  const links = await countPublishedResources().catch(() => 0);

  return (
    <Homepage
      signedIn={Boolean(viewer?.hasProfile)}
      counts={{ roadmaps: roadmaps.length, days, links }}
      roadmaps={roadmaps.map((r) => ({
        slug: r.slug,
        title: r.title,
        metaLine: [r.difficulty, r.estimatedWeeks ? `~${r.estimatedWeeks} weeks` : null]
          .filter(Boolean)
          .join(" · "),
        summary: r.summary,
        sizeLine: [
          `${r.moduleCount} modules`,
          `${r.nodeCount} days`,
          r.estimatedHours ? `~${r.estimatedHours} hours` : null,
        ]
          .filter(Boolean)
          .join(" · "),
      }))}
    />
  );
}
