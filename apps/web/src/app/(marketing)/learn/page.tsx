import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedTracks, type TrackSummary } from "@/lib/curriculum";

/**
 * Every published course.
 *
 * Rendered on demand rather than at build: a static route with `revalidate`
 * is prerendered during `next build`, and CI builds this app with no Supabase
 * project configured. /learn/[track] escapes that with an empty
 * generateStaticParams; an index route has no params to hide behind.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free curriculum",
  description:
    "Every Jintu course, free and public: the weeks, the resources, and the rubric each submission is graded against. No account needed.",
  alternates: { canonical: "/learn" },
};

const plural = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`;

export default async function CoursesPage() {
  const tracks = await listPublishedTracks();

  const totals = tracks.reduce(
    (acc, t) => ({
      weeks: acc.weeks + t.weeks,
      resources: acc.resources + t.resources,
      artifacts: acc.artifacts + t.artifacts,
    }),
    { weeks: 0, resources: 0, artifacts: 0 },
  );

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        Free curriculum
      </p>
      <h1 className="mt-3 text-3xl leading-tight font-semibold text-balance text-ink-900 sm:text-4xl">
        Every course, in full, before you pay anything.
      </h1>
      <p className="mt-4 text-lg text-pretty text-ink-600">
        The weeks, the resources and the rubric your work is graded against —
        all of it readable now, without an account. What the cohort adds is
        deadlines, grading, peer review and a profile.
      </p>

      {tracks.length > 0 ? (
        <>
          {/* Counted from what is actually published, so the strip cannot
              claim more curriculum than exists. */}
          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-card border border-ink-100 bg-ink-100">
            <Stat label="Courses" value={String(tracks.length)} />
            <Stat label="Weeks" value={String(totals.weeks)} />
            <Stat label="Artifacts" value={String(totals.artifacts)} />
          </dl>

          <ul className="mt-8 space-y-3">
            {tracks.map((track) => (
              <li key={track.slug}>
                <CourseCard track={track} />
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-pretty text-ink-500">
            Working through a course on your own is free and always will be.
            Nothing here is held back for paying students.
          </p>
        </>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-4 py-3 text-center">
      <dt className="text-xs font-medium tracking-wide text-ink-500 uppercase">{label}</dt>
      <dd className="mt-0.5 text-xl font-semibold text-ink-900">{value}</dd>
    </div>
  );
}

function CourseCard({ track }: { track: TrackSummary }) {
  return (
    <Link
      href={`/learn/${track.slug}`}
      className="group block rounded-card border border-ink-100 bg-white p-5 transition-colors hover:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-pretty text-ink-900 group-hover:text-brand-800">
            {track.title}
          </h2>
          <p className="mt-1.5 text-pretty text-ink-600">{track.summary}</p>

          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm text-ink-500">
            <span>{plural(track.weeks, "week")}</span>
            {track.resources > 0 ? (
              <>
                <span aria-hidden>·</span>
                <span>{plural(track.resources, "resource")}</span>
              </>
            ) : null}
            {track.artifacts > 0 ? (
              <>
                <span aria-hidden>·</span>
                <span>{plural(track.artifacts, "artifact")}</span>
              </>
            ) : null}
          </p>
        </div>

        {/* Decorative: the whole card is the link, and the heading already
            names the destination. */}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          // ink-500, not ink-400: this is the only affordance saying the card
          // is a link, and ink-400 is 3.39:1 even on white.
          className="mt-1 size-5 shrink-0 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
      </div>
    </Link>
  );
}

/**
 * Shown when the database is reachable and has no published courses.
 *
 * A distinct state from "something broke": that one throws and is caught by
 * the error boundary. This one is the honest answer to a real question —
 * there is nothing published — and it should not look like a failure, because
 * a visitor who sees a crash assumes the whole product is broken.
 */
function EmptyState() {
  return (
    <div className="mt-10 rounded-card border border-ink-200 bg-white p-8 text-center">
      <p className="text-lg font-semibold text-ink-900">No courses are published yet.</p>
      <p className="mx-auto mt-2 max-w-md text-pretty text-ink-600">
        The first one is being written. When it goes up it will be here in
        full — every week and every rubric — before anyone is asked to pay for
        a cohort.
      </p>
      <Link
        href="/#waitlist"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        Tell me when it opens
      </Link>
    </div>
  );
}
