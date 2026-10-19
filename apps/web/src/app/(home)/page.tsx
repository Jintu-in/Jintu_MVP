import type { Metadata } from "next";
import Homepage, {
  type HomepageCategoryGroup,
  type HomepageFieldTile,
  type HomepageRoadmapRow,
} from "@/components/marketing/homepage";
import { CATEGORIES, type Category } from "@/lib/catalogue-filters";
import { listPublishedRoadmaps } from "@/lib/roadmaps";
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

/**
 * The roadmaps committed to in `docs/roadmaps/` but not necessarily imported
 * yet — real, written content files, not invented titles. Diffed against
 * what `listPublishedRoadmaps()` actually returns so a roadmap disappears
 * from this "coming soon" list the moment it goes live, automatically.
 */
const PLANNED_ROADMAPS: { slug: string; title: string; category: Category }[] = [
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

export default async function LandingPage() {
  const published = await listPublishedRoadmaps().catch(() => []);
  const viewer = await getViewer().catch(() => null);
  const openSlugs = new Set(published.map((r) => r.slug));

  // One row per catalogue entry (published or planned), deduped by slug —
  // a roadmap that has gone live is "open", never listed twice.
  const bySlug = new Map<string, { slug: string; title: string; category: Category; open: boolean }>();
  for (const p of PLANNED_ROADMAPS) {
    bySlug.set(p.slug, { ...p, open: openSlugs.has(p.slug) });
  }
  for (const r of published) {
    bySlug.set(r.slug, { slug: r.slug, title: r.title, category: r.category, open: true });
  }
  const catalogue = [...bySlug.values()];

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
