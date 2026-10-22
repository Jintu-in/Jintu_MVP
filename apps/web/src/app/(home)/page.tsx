import type { Metadata } from "next";
import Homepage, {
  type HomepageCategoryGroup,
  type HomepageFieldTile,
  type HomepageRoadmapRow,
} from "@/components/marketing/homepage";
import { CATEGORIES } from "@/lib/catalogue-filters";
import { listPublishedRoadmaps } from "@/lib/roadmaps";
import { buildCatalogue } from "@/lib/planned-roadmaps";
import { ROLES, populatedDomains, rolesInDomain } from "@/content/roles";
import { getViewer, initialsFor } from "@/lib/session";

/**
 * The homepage: the job-first redesign's entry point.
 *
 * Every count handed to the component is read here, never guessed in it —
 * the design's own mockup shows one illustrative roadmap list ("Ten
 * roadmaps... one is open today"); this reads the real catalogue instead, so
 * the page stays true automatically as roadmaps actually go live rather than
 * needing a copy edit each time one does.
 */
export const metadata: Metadata = {
  title: { absolute: "Jintu — learn the skills for the job you want" },
  description:
    "A free, step-by-step way to learn job skills. Pick a goal, follow its roadmap, and do one " +
    "short lesson a day.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Jintu — learn the skills for the job you want",
    description: "Pick a goal, follow its roadmap, and do one short lesson a day.",
    url: "/",
    siteName: "Jintu",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Jintu — learn the skills for the job you want. Free roadmaps, one short lesson a day.",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const published = await listPublishedRoadmaps().catch(() => []);
  const viewer = await getViewer().catch(() => null);
  const catalogue = buildCatalogue(published);

  const categoryGroups: HomepageCategoryGroup[] = CATEGORIES.map((c) => {
    const roadmaps: HomepageRoadmapRow[] = catalogue
      .filter((r) => r.category === c.key)
      .sort((a, b) => Number(b.open) - Number(a.open) || a.title.localeCompare(b.title))
      .map((r) => ({ slug: r.slug, title: r.title, open: r.open }));
    return { key: c.key, label: c.label, roadmaps };
  }).filter((g) => g.roadmaps.length > 0);

  // One representative role per field, in the design's own field order, for
  // the hero's chip row — never the first N roles in file order, which
  // would cluster them inside whichever domain's file happens to sort first.
  const domains = populatedDomains();
  const heroChips = domains
    .map((d) => rolesInDomain(d.key)[0]?.title)
    .filter((t): t is string => Boolean(t))
    .slice(0, 7);
  const heroMoreCount = Math.max(0, ROLES.length - heroChips.length);

  const fieldTiles: HomepageFieldTile[] = domains.map((d) => {
    const roles = rolesInDomain(d.key);
    return {
      domain: d.key,
      label: d.label,
      blurb: d.blurb,
      roleTitles: roles.slice(0, 2).map((r) => r.title),
      moreCount: Math.max(0, roles.length - 2),
    };
  });

  return (
    <Homepage
      heroChips={heroChips}
      heroMoreCount={heroMoreCount}
      fieldTiles={fieldTiles}
      categoryGroups={categoryGroups}
      openRoadmapCount={published.length}
      totalRoadmapCount={catalogue.length}
      signedIn={Boolean(viewer?.hasProfile)}
      initials={viewer ? initialsFor(viewer) : null}
      displayName={viewer?.fullName ?? viewer?.email ?? null}
    />
  );
}
