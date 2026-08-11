import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceItem } from "@/components/resource-item";
import { Rubric } from "@/components/rubric";
import { EnrolButton } from "@/components/enrol-button";
import { getOpenCohort, getPublishedTrack, type Assignment, type Module } from "@/lib/curriculum";

/**
 * One course, in full. ARCHITECTURE.md §6 — the free public top of the
 * funnel: indexable, linkable, readable with no account.
 *
 * Rendered per request.
 *
 * It used to be incremental — `revalidate = 3600` plus an empty
 * generateStaticParams, which opts into the cached path without enumerating
 * slugs against a database CI does not have. That is gone, and the reason is
 * worth recording rather than rediscovering:
 *
 * The marketing layout now reads the signed-in viewer so the header can show
 * an avatar, and reading cookies is dynamic. A dynamic layout inside a segment
 * that has opted into static generation is not a downgrade to SSR — it is an
 * error. This route returned 500 with digest DYNAMIC_SERVER_USAGE until the
 * two were reconciled, and the build output still printed a cheerful `●`
 * against it, because generateStaticParams was present and the marker reports
 * the strategy rather than whether it can work.
 *
 * The cost is the one the old comment warned about: every crawler hit is now
 * three Postgres queries instead of one every hour. At one published course
 * that is noise. It stops being noise as the catalogue grows, and the fix then
 * is Partial Prerendering — a static shell with the avatar streaming into a
 * hole — which needs `cacheComponents` and a migration of its own.
 */
export const dynamic = "force-dynamic";

const plural = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`;

/** What the student hands in, stated in the student's terms. */
const SUBMIT_LABEL: Record<Assignment["kind"], string> = {
  sql: "A query",
  artifact_link: "A link to your work",
  file: "A file",
  recording: "A recording",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track: slug } = await params;
  const track = await getPublishedTrack(slug);
  if (!track) return { title: "Course not found" };

  return {
    title: track.title,
    description: track.summary,
    alternates: { canonical: `/learn/${track.slug}` },
    openGraph: {
      title: `${track.title} — free curriculum`,
      description: track.summary,
      type: "article",
    },
    // Set explicitly rather than inherited. Metadata merges shallowly per
    // key: leaving `twitter` off does not blend this page's openGraph with
    // the root's twitter block, it takes the root's whole block — so the
    // course link would preview with the homepage's title.
    twitter: {
      card: "summary_large_image",
      title: `${track.title} — free curriculum`,
      description: track.summary,
    },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track: slug } = await params;
  const track = await getPublishedTrack(slug);
  if (!track) notFound();

  // In parallel with nothing: it depends on the slug being real, and the
  // notFound above has to win. Null when no cohort is open or the migration
  // is not applied, and the bar falls back to the waitlist either way.
  const cohort = await getOpenCohort(track.slug);

  const resources = track.modules.reduce((n, m) => n + m.resources.length, 0);
  const artifacts = track.modules.reduce((n, m) => n + m.assignments.length, 0);

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
        <Link href="/learn" className="hover:text-brand-800">
          Free curriculum
        </Link>
        <span aria-hidden className="px-1.5">
          /
        </span>
        <span className="text-ink-600">{track.title}</span>
      </nav>

      <h1 className="mt-3 text-3xl leading-tight font-medium text-balance text-ink-900 sm:text-4xl">
        {track.title}
      </h1>

      {/* Counted from what is published, so the chips cannot overstate the
          course. A week with no resources contributes nothing to the total. */}
      <ul className="mt-4 flex flex-wrap gap-2">
        {[
          plural(track.modules.length, "week"),
          plural(resources, "resource"),
          plural(artifacts, "artifact"),
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

      {/* The tier is a promise about how work gets checked, so it is said
          where the curriculum starts, in words rather than a bare label. A
          sprint carries no banner — machine-checked is this site's default
          claim, and restating defaults is noise. */}
      {track.tier === "community" ? (
        <p className="mt-4 rounded-card border border-ink-100 bg-white px-4 py-3 text-sm text-pretty text-ink-600">
          <span className="font-medium text-ink-900">Community track.</span>{" "}
          Written by a member, checked by structure and by peers — never by a
          model. Free, like everything else here.
        </p>
      ) : null}

      {track.modules.length === 0 ? (
        <EmptyCourse />
      ) : (
        <>
          <p className="mt-6 rounded-card border border-ink-100 bg-white p-4 text-pretty text-ink-600">
            All of this is free. Work through it alone at your own pace, or join
            a cohort for the deadlines, the grading, two peer reviews a week,
            and a profile you can send to anyone.
          </p>

          {/* Native <details>: keeps this a server component, works before
              JavaScript has parsed, and find-in-page opens a closed week to
              reach a match. The first is open so the page never lands as a
              wall of shut rows. */}
          <ol className="mt-8 space-y-3">
            {track.modules.map((module, i) => (
              <Week key={module.id} module={module} open={i === 0} />
            ))}
          </ol>
        </>
      )}

      {/* sticky, not fixed: rides the bottom while the syllabus is on screen,
          then scrolls away instead of covering the footer's legal line. */}
      <div className="sticky bottom-0 mt-8 -mx-5 border-t border-ink-100 bg-white px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm">
            {cohort ? (
              <>
                {/* Real numbers or none: the date and the seat count come from
                    the cohort row, and this block does not render without one. */}
                <p className="text-ink-500">
                  Starts{" "}
                  {new Date(cohort.startsOn).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                  {" · "}
                  {cohort.seatsLeft} of {cohort.capacity} seats left
                </p>
                <p className="font-medium text-ink-900">₹999 one time</p>
              </>
            ) : (
              <>
                <p className="text-ink-500">Cohort</p>
                <p className="font-medium text-ink-900">₹999 one time</p>
              </>
            )}
          </div>
          {cohort && cohort.seatsLeft > 0 ? (
            <EnrolButton cohortId={cohort.cohortId} slug={track.slug} />
          ) : (
            <Link
              href="/#waitlist"
              className="flex h-12 shrink-0 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Join the waitlist
            </Link>
          )}
        </div>
        {cohort && cohort.seatsLeft > 0 ? (
          <p className="mt-1.5 text-xs text-ink-500">
            Enrolling reserves your seat. We message you how to pay — ₹999 by
            UPI — before the cohort starts, and week one is a full-refund
            window either way.
          </p>
        ) : null}
      </div>
    </main>
  );
}

function Week({ module, open }: { module: Module; open: boolean }) {
  const headingId = `week-${module.week_no}`;

  return (
    <li>
      <details open={open} className="group rounded-card border border-ink-100 bg-white">
        {/* Only phrasing or heading content belongs in a <summary>, so the week
            label is a span inside the h2 rather than a <p> beside it. */}
        <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
          <h2 id={headingId} className="min-w-0 flex-1">
            <span className="block font-mono text-sm font-normal text-ink-500">
              Week {String(module.week_no).padStart(2, "0")}
            </span>
            <span className="mt-0.5 block font-medium text-pretty text-ink-900">
              {module.title}
            </span>
          </h2>

          <span className="hidden shrink-0 text-sm text-ink-500 sm:inline">
            {plural(module.resources.length, "resource")}
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
          <p className="text-pretty text-ink-700">{module.objective}</p>

          {/*
            A week with neither resources nor an assignment is not two facts,
            it is one. Rendering both branches produced "No links this week —
            the work is the assignment below" immediately followed by "Nothing
            to submit this week", which contradicted itself in two lines and
            pointed at an assignment that did not exist.
          */}
          {module.resources.length === 0 && module.assignments.length === 0 ? (
            <p className="mt-5 text-sm text-pretty text-ink-500">
              This week is still being written. The objective above is settled;
              the resources and the artifact are not published yet.
            </p>
          ) : (
            <>
              <h3 className="mt-5 text-xs font-medium tracking-wide text-ink-500 uppercase">
                Resources
              </h3>
              {module.resources.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {module.resources.map((resource) => (
                    <li key={resource.id}>
                      <ResourceItem resource={resource} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-pretty text-ink-500">
                  No links this week — the work is the assignment below.
                </p>
              )}

              {module.assignments.length > 0 ? (
                <div className="mt-5 rounded-card border border-brand-200 bg-brand-50 p-4">
                  <h3 className="text-xs font-medium tracking-wide text-brand-800 uppercase">
                    What you submit
                  </h3>
                  <ul className="mt-2 space-y-4">
                    {module.assignments.map((assignment) => (
                      <li key={assignment.id}>
                        <p className="text-sm font-medium text-ink-500">
                          {SUBMIT_LABEL[assignment.kind]}
                        </p>
                        <p className="mt-0.5 text-pretty text-ink-800">
                          {assignment.spec?.prompt ?? "Details to follow."}
                        </p>
                        {assignment.rubrics ? (
                          <Rubric rubric={assignment.rubrics} kind={assignment.kind} />
                        ) : (
                          // Said out loud rather than hidden: the landing page
                          // promises a rubric you can read before you start, so
                          // a missing one is a content bug someone should notice.
                          <p className="mt-2 text-sm text-ink-500">
                            The rubric for this one is not published yet.
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-5 text-sm text-ink-500">Nothing to submit this week.</p>
              )}
            </>
          )}
        </div>
      </details>
    </li>
  );
}

/**
 * A published course with no weeks. Rare but reachable — a path can be
 * published before its modules land — and better said plainly than rendered
 * as a title followed by nothing.
 */
function EmptyCourse() {
  return (
    <div className="mt-8 rounded-card border border-ink-200 bg-white p-8 text-center">
      <p className="text-lg font-medium text-ink-900">
        This course has no weeks published yet.
      </p>
      <p className="mx-auto mt-2 max-w-md text-pretty text-ink-600">
        It is still being written. Everything will appear here as soon as it is
        ready, and it will be free to read.
      </p>
      <Link
        href="/learn"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-lg border border-ink-200 px-5 font-medium text-brand-700 hover:border-brand-600 hover:text-brand-800"
      >
        See the other courses
      </Link>
    </div>
  );
}
