import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommunityTrack } from "@/components/curriculum/community-track";
import { VerifiedTrack } from "@/components/curriculum/verified-track";
import { getSiteUrl } from "@/lib/env";
import { getTrack } from "@/lib/tracks";
import { verificationMix, type Track } from "@/lib/tracks-shared";

/**
 * /learn/[track]
 *
 * Fully public. No account, no gate. This is the SEO surface and the trust
 * argument: every curriculum and every rubric is readable before anyone pays
 * or signs up.
 *
 * TWO TEMPLATES, chosen by tier:
 *   verified  -> a map. The track has a known six-artifact shape, so show the
 *                shape first and let the reader drill in without losing it.
 *   community -> a document. User-authored, unknown shape. Forcing an author
 *                writing about EV battery diagnostics into a six-tile grid
 *                would be worse than a plain page.
 *
 * RENDERING — a deliberate deviation from the audited design's
 * revalidate/generateStaticParams: the marketing layout reads the signed-in
 * viewer (cookies), and a dynamic layout inside a statically-generated
 * segment is not a downgrade — it is a DYNAMIC_SERVER_USAGE error this route
 * has already shipped once. Force-dynamic matches the layout's reality. Bug
 * (b)'s substance still stands and is fixed: the server component does NOT
 * read searchParams; the client reads ?unit on mount, so this page becomes
 * static for free the day the layout does.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ track: string }> },
): Promise<Metadata> {
  const { track: slug } = await params;
  const track = await getTrack(slug);
  if (!track) return { title: "Not found" };

  const mix = verificationMix(track);
  const desc = track.tier === "verified"
    ? `${track.units.length} artifacts, ${mix.total} points, ${Math.round(mix.machineShare * 100)}% checked by machine. Free to read in full.`
    : (track.oneLine ?? "A community track on Jintu. Free to read in full.");

  return {
    title: track.title,
    description: desc,
    // Draft-tier pages are noindex: a hundred thin auto-generated pages is
    // what Google's scaled-content-abuse policy targets, and a manual action
    // would take the verified tracks down with them.
    robots: track.tier === "draft" ? { index: false, follow: true } : undefined,
    openGraph: {
      title: track.title,
      description: desc,
      type: "article",
      url: `/learn/${track.slug}`,
    },
    twitter: { card: "summary_large_image", title: track.title, description: desc },
    alternates: { canonical: `/learn/${track.slug}` },
  };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track: slug } = await params;
  const track = await getTrack(slug);
  if (!track) notFound();

  return (
    <>
      <CourseSchema track={track} />
      {track.tier === "verified"
        ? <VerifiedTrack track={track} />
        : <CommunityTrack track={track} />}
    </>
  );
}

/**
 * Course schema. This track teaches structured data in one of its units, so
 * ours has to validate — students will inspect it, and one of them will find a
 * mistake, which is a good outcome and a good story.
 *
 * The URL comes from getSiteUrl(), never hard-coded: this repo already
 * shipped a canonical pointing at an unregistered domain once.
 */
function CourseSchema({ track }: { track: Track }) {
  const base = getSiteUrl().origin;
  const json = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: track.title,
    description: track.oneLine ?? undefined,
    url: `${base}/learn/${track.slug}`,
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "Jintu", url: base },
    numberOfCredits: track.units.length,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
    },
    syllabusSections: track.units.map((u) => ({
      "@type": "Syllabus",
      name: u.title,
      description: u.objective,
      position: u.unitNo,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
