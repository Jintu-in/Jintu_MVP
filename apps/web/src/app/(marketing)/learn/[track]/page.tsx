import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceIcon } from "@/components/resource-icon";
import { Rubric } from "@/components/rubric";
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

const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? "" : "s"}`;

/**
 * Host of an external link, for the screen-reader-only "opens on …" suffix.
 * Returns null rather than throwing: a malformed URL in one row must not take
 * down the whole syllabus page.
 */
function hostOf(url: string): string | null {
  try {
    return `on ${new URL(url).hostname.replace(/^www\./, "")}`;
  } catch {
    return null;
  }
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
    <main className="mx-auto max-w-3xl px-5 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
        <Link href="/learn" className="hover:text-brand-800">
          Free curriculum
        </Link>
        <span aria-hidden> / </span>
        <span className="text-ink-600">{track.title}</span>
      </nav>

      <h1 className="mt-2 text-3xl leading-tight font-semibold text-balance text-ink-900 sm:text-4xl">
        {track.title}
      </h1>

      <ul className="mt-4 flex flex-wrap gap-2">
        {[
          count(track.modules.length, "week"),
          count(totalResources, "resource"),
          `Version ${track.version}`,
        ].map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-ink-100 bg-white px-3 py-1 text-sm text-ink-600"
          >
            {chip}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-lg text-pretty text-ink-600">{track.summary}</p>

      <p className="mt-6 rounded-card border border-ink-100 bg-white p-4 text-pretty text-ink-600">
        Everything below is free and always will be. {track.modules.length} weeks,{" "}
        {totalResources} resources, and the rubrics your work is graded against —
        all readable before you decide whether to join a cohort. What you pay for
        is the deadlines, the grading, the peer review, and the profile.
      </p>

      {/* Weeks collapse so the whole syllabus is scannable on a phone, and the
          first is open so the page never lands as a wall of closed rows. Native
          <details>: this stays a server component, works with JS still parsing,
          and browser find-in-page opens a closed week to reach a match. */}
      <ol className="mt-8 space-y-3">
        {track.modules.map((module, i) => (
          <ModuleSection key={module.id} module={module} defaultOpen={i === 0} />
        ))}
      </ol>

      {/* sticky, not fixed: it rides the bottom of the viewport while the
          syllabus is on screen, then scrolls away instead of sitting on top of
          the footer's legal line. */}
      <div className="sticky bottom-0 mt-8 -mx-5 border-t border-ink-100 bg-white px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm">
            <p className="text-ink-500">Cohort</p>
            <p className="font-medium text-ink-900">₹999 one time</p>
          </div>
          <Link
            href="/#waitlist"
            className="flex h-12 shrink-0 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            Join the waitlist
          </Link>
        </div>
      </div>
    </main>
  );
}

function ModuleSection({
  module,
  defaultOpen,
}: {
  module: Module;
  defaultOpen: boolean;
}) {
  const headingId = `week-${module.week_no}`;

  return (
    <li>
      <details
        open={defaultOpen}
        className="group rounded-card border border-ink-100 bg-white"
      >
        {/* Only phrasing and heading content may sit inside a <summary>, so the
            week label is a span inside the h2 rather than a <p> beside it. */}
        <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
          <h2 id={headingId} className="min-w-0 flex-1">
            <span className="block font-mono text-sm font-normal text-ink-500">
              Week {String(module.week_no).padStart(2, "0")}
            </span>
            <span className="mt-0.5 block font-semibold text-pretty text-ink-900">
              {module.title}
            </span>
          </h2>

          <span className="hidden text-sm text-ink-500 sm:inline">
            {count(module.resources.length, "resource")}
            {module.assignments.length > 0
              ? ` · ${count(module.assignments.length, "artifact")}`
              : null}
          </span>

          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 shrink-0 text-ink-500 transition-transform group-open:rotate-180"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>

        <div className="border-t border-ink-100 p-4">
          <p className="text-pretty text-ink-600">{module.objective}</p>

          {module.resources.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {module.resources.map((resource) => (
                <li key={resource.id}>
                  <ResourceItem resource={resource} />
                </li>
              ))}
            </ul>
          ) : null}

          {module.assignments.length > 0 ? (
            <div className="mt-4 rounded-card border border-brand-200 bg-brand-50 p-4">
              <h3 className="text-sm font-semibold tracking-wide text-brand-800 uppercase">
                What you submit
              </h3>
              <ul className="mt-2 space-y-4 text-pretty text-ink-700">
                {module.assignments.map((a) => (
                  <li key={a.id}>
                    <p>{a.spec?.prompt ?? a.kind}</p>
                    {a.rubrics ? <Rubric rubric={a.rubrics} /> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </details>
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

  const minutes = resource.duration_sec
    ? `${Math.round(resource.duration_sec / 60)} min`
    : null;

  return (
    <a
      href={resource.external_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-card border border-ink-200 px-4 py-3 hover:border-brand-600"
    >
      <ResourceIcon kind={resource.kind} className="size-5 shrink-0 text-brand-700" />

      <span className="min-w-0 flex-1">
        <span className="block font-medium text-pretty text-ink-900 group-hover:text-brand-800">
          {resource.title}
        </span>
        <span className="block text-sm text-ink-500">
          {KIND_LABEL[resource.kind]}
          {minutes ? ` · ${minutes}` : null}
          {resource.health === "degraded" ? (
            <span className="text-warn-600"> · link may be flaky</span>
          ) : null}
        </span>
      </span>

      {/* Opens in a new tab — say so in the accessible name, not only visually. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 shrink-0 text-ink-500 group-hover:text-brand-700"
      >
        <path d="M8 16 16 8M9 8h7v7" />
      </svg>
      <span className="sr-only">(opens {hostOf(resource.external_url) ?? "in a new tab"})</span>
    </a>
  );
}
