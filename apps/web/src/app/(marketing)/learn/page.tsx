import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedTracks } from "@/lib/curriculum";

/**
 * Rendered on demand, not at build.
 *
 * A static route with `revalidate` gets prerendered during `next build`, which
 * means the build queries Supabase — and CI builds this app with no project
 * configured, so the whole pipeline fails on a page nobody asked it to fetch.
 * /learn/[track] escapes that because its generateStaticParams returns [];
 * an index route has no params to hide behind.
 *
 * The cost is one small query per request. If this page ever carries real
 * traffic, cache the query rather than reintroducing build-time prerendering.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free curriculum",
  description:
    "Every Jintu track, free and public: the weeks, the resources, and the rubrics your work is graded against. No account needed.",
  alternates: { canonical: "/learn" },
};

export default async function LearnIndexPage() {
  const tracks = await listPublishedTracks();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        Free curriculum
      </p>
      <h1 className="mt-3 text-4xl leading-tight font-semibold text-balance text-ink-900">
        The whole syllabus, before you pay anything.
      </h1>
      <p className="mt-4 text-lg text-pretty text-ink-600">
        Every week, every resource, and the rubric each submission is graded
        against. Work through it alone for free. The cohort is what adds
        deadlines, grading, peer review, and a profile.
      </p>

      {tracks.length === 0 ? (
        <p className="mt-12 rounded-card border border-ink-200 p-6 text-ink-600">
          No tracks are published yet.
        </p>
      ) : (
        <ul className="mt-12 space-y-4">
          {tracks.map((track) => (
            <li key={track.slug}>
              <Link
                href={`/learn/${track.slug}`}
                className="group block rounded-card border border-ink-200 p-6 hover:border-brand-600"
              >
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h2 className="text-xl font-semibold text-ink-900 group-hover:text-brand-800">
                    {track.title}
                  </h2>
                  {track.weeks > 0 ? (
                    <span className="font-mono text-sm text-ink-500">
                      {track.weeks} weeks
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-pretty text-ink-600">{track.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-sm text-ink-500">
        Only one track for now. More arrive once the first has outcome data
        behind it, not before.
      </p>
    </main>
  );
}
