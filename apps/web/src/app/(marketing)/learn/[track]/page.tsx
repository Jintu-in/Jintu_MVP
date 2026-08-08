import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { getPublishedTrack, type Module, type Resource } from "@/lib/curriculum";

/**
 * The free, public curriculum — ARCHITECTURE.md §6, Phase 1. This is the top
 * of the funnel: indexable, linkable, and readable without an account. The
 * cohort is what costs money; the syllabus does not.
 *
 * Rendered on demand and revalidated rather than prerendered at build, so a
 * build needs no database. There is deliberately no generateStaticParams for
 * the same reason — CI builds this app with no Supabase project configured.
 */
export const revalidate = 3600;

/**
 * Empty on purpose. Returning [] opts the segment into the incremental-static
 * path — pages are built on first request and then cached for `revalidate`
 * seconds — without enumerating slugs at build time, which would require a
 * database CI does not have. Without this, Next treats the dynamic segment as
 * fully dynamic and `revalidate` above is silently ignored, so every crawler
 * hit becomes a Postgres query.
 */
export async function generateStaticParams() {
  return [];
}

const KIND_LABEL: Record<Resource["kind"], string> = {
  video: "Video",
  article: "Article",
  docs: "Docs",
  dataset: "Dataset",
  tool: "Tool",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track: slug } = await params;
  const track = await getPublishedTrack(slug);
  if (!track) return { title: "Not found" };

  return {
    title: track.title,
    description: track.summary,
    alternates: { canonical: `/learn/${track.slug}` },
    openGraph: {
      title: `${track.title} — free curriculum`,
      description: track.summary,
      type: "article",
    },
  };
}

export default async function TrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track: slug } = await params;
  const track = await getPublishedTrack(slug);
  if (!track) notFound();

  const totalResources = track.modules.reduce((n, m) => n + m.resources.length, 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        Free curriculum · v{track.version}
      </p>
      <h1 className="mt-3 text-4xl leading-tight font-semibold text-balance text-ink-900">
        {track.title}
      </h1>
      <p className="mt-4 text-lg text-pretty text-ink-600">{track.summary}</p>

      <p className="mt-6 rounded-card bg-ink-50 p-4 text-pretty text-ink-600">
        Everything below is free and always will be. {track.modules.length} weeks,{" "}
        {totalResources} resources, and the rubrics your work is graded against —
        all readable before you decide whether to join a cohort. What you pay for
        is the deadlines, the grading, the peer review, and the profile.
      </p>

      <ol className="mt-12 space-y-12">
        {track.modules.map((module) => (
          <ModuleSection key={module.id} module={module} />
        ))}
      </ol>
    </main>
  );
}

function ModuleSection({ module }: { module: Module }) {
  const headingId = `week-${module.week_no}`;

  return (
    <li aria-labelledby={headingId}>
      <p className="font-mono text-sm text-ink-500">
        Week {String(module.week_no).padStart(2, "0")}
      </p>
      <h2 id={headingId} className="mt-1 text-2xl font-semibold text-ink-900">
        {module.title}
      </h2>
      <p className="mt-2 text-pretty text-ink-600">{module.objective}</p>

      {module.resources.length > 0 ? (
        <ul className="mt-5 space-y-4">
          {module.resources.map((resource) => (
            <li key={resource.id}>
              <ResourceItem resource={resource} />
            </li>
          ))}
        </ul>
      ) : null}

      {module.assignments.length > 0 ? (
        <div className="mt-5 rounded-card border border-brand-200 bg-brand-50 p-4">
          <h3 className="text-sm font-semibold tracking-wide text-brand-800 uppercase">
            What you submit
          </h3>
          <ul className="mt-2 space-y-1 text-pretty text-ink-700">
            {module.assignments.map((a) => (
              <li key={a.id}>{a.spec?.prompt ?? a.kind}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function ResourceItem({ resource }: { resource: Resource }) {
  // The official IFrame player, never a link dressed up as our own player.
  if (resource.provider === "youtube" && resource.youtube_video_id) {
    return (
      <figure>
        <YouTubeEmbed videoId={resource.youtube_video_id} title={resource.title} />
        <figcaption className="mt-2 text-sm text-ink-500">
          {resource.title}
          {resource.duration_sec ? ` · ${Math.round(resource.duration_sec / 60)} min` : null}
        </figcaption>
      </figure>
    );
  }

  return (
    <a
      href={resource.external_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-baseline gap-3 rounded-card border border-ink-200 px-4 py-3 hover:border-brand-600"
    >
      <span className="shrink-0 text-xs font-medium tracking-wide text-ink-500 uppercase">
        {KIND_LABEL[resource.kind]}
      </span>
      <span className="font-medium text-ink-900 group-hover:text-brand-800">
        {resource.title}
      </span>
      {resource.health === "degraded" ? (
        <span className="ml-auto shrink-0 text-xs text-warn-600">link may be flaky</span>
      ) : null}
    </a>
  );
}
