import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTrack, getPublishedSlugs, verificationMix, totalMinutes } from '@/lib/tracks';
import { VerifiedTrack } from './_components/verified-track';
import { CommunityTrack } from './_components/community-track';

/**
 * /learn/[slug]
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
 */

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getPublishedSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const track = await getTrack(slug);
  if (!track) return { title: 'Not found · Jintu' };

  const mix = verificationMix(track);
  const desc = track.tier === 'verified'
    ? `${track.units.length} artifacts, ${mix.total} points, ${Math.round(mix.machineShare * 100)}% checked by machine. Free to read in full.`
    : (track.oneLine ?? `A community track on Jintu. Free to read in full.`);

  return {
    title: `${track.title} · Jintu`,
    description: desc,
    // Draft-tier pages are noindex: a hundred thin auto-generated pages is
    // what Google's scaled-content-abuse policy targets, and a manual action
    // would take the verified tracks down with them.
    robots: track.tier === 'draft' ? { index: false, follow: true } : undefined,
    openGraph: {
      title: track.title,
      description: desc,
      type: 'article',
      url: `https://jintu.in/learn/${track.slug}`,
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `https://jintu.in/learn/${track.slug}` },
  };
}

export default async function TrackPage({
  params, searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ unit?: string }>;
}) {
  const [{ slug }, { unit }] = await Promise.all([params, searchParams]);
  const track = await getTrack(slug);
  if (!track) notFound();

  // ?unit=3 is deep-linkable so one unit can be shared into a WhatsApp group
  // rather than the whole track. Given WhatsApp is the distribution channel,
  // this is worth more than it looks.
  const initialUnit = Math.max(
    0,
    Math.min(track.units.length - 1, (Number(unit) || 1) - 1),
  );

  return (
    <>
      <CourseSchema track={track} />
      {track.tier === 'verified'
        ? <VerifiedTrack track={track} initialUnit={initialUnit} />
        : <CommunityTrack track={track} />}
    </>
  );
}

/**
 * Course schema. This track teaches structured data in one of its units, so
 * ours has to validate — students will inspect it, and one of them will find a
 * mistake, which is a good outcome and a good story.
 */
function CourseSchema({ track }: { track: Awaited<ReturnType<typeof getTrack>> }) {
  if (!track) return null;
  const mins = totalMinutes(track);
  const json = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: track.title,
    description: track.oneLine ?? undefined,
    url: `https://jintu.in/learn/${track.slug}`,
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    dateModified: track.reviewedAt ?? undefined,
    provider: { '@type': 'Organization', name: 'Jintu', url: 'https://jintu.in' },
    numberOfCredits: track.units.length,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: mins ? `PT${Math.round(mins / 60)}H` : undefined,
    },
    syllabusSections: track.units.map((u) => ({
      '@type': 'Syllabus',
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
