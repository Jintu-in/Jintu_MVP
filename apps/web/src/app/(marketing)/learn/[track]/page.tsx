import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResourceItem } from "@/components/resource-item";
import { Rubric } from "@/components/rubric";
import { StartTrackButton } from "@/components/start-track-button";
import { getPublishedTrack, type Assignment, type Module } from "@/lib/curriculum";

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

  const resources = track.modules.reduce((n, m) => n + m.resources.length, 0);
  const artifacts = track.modules.reduce((n, m) => n + m.assignments.length, 0);
  // Summed from the published rubrics, so the number cannot overstate what
  // the trail actually pays. An assignment without a rubric contributes zero
  // — and its missing rubric is called out where it happens.
  const points = track.modules.reduce(
    (n, m) => n + m.assignments.reduce((s, a) => s + Number(a.rubrics?.max_score ?? 0), 0),
    0,
  );

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
        <Link href="/learn" className="hover:text-brand-800">
          Free curriculum
        </Link>
        <span aria-hidden className="px-1.5">
          /
        </span>
        <span className="text-ink-600">{track.title}</span>
      </nav>

      {/* The trail layout: a sticky rail of facts beside the path itself.
          Same information architecture as before — the rail is the old chip
          row and banners given a place to stand, not new claims. */}
      <div className="mt-5 items-start gap-8 lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-6">
          <section className="rounded-card border border-ink-100 bg-white p-4">
            <h2 className="text-xs font-medium tracking-[0.09em] text-ink-500 uppercase">
              This trail
            </h2>
            <dl className="mt-3 space-y-2">
              {[
                ["Weeks", String(track.modules.length)],
                ["Resources", String(resources)],
                ["Artifacts", String(artifacts)],
                ["Points on the trail", String(points)],
                ["Version", String(track.version)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-baseline justify-between gap-3 text-sm">
                  <dt className="text-ink-600">{label}</dt>
                  <dd className="font-mono tabular-nums text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 border-t border-ink-100 pt-3 text-sm text-pretty text-ink-500">
              {track.tier === "community" ? (
                <>
                  <span className="font-medium text-ink-900">Community-reviewed.</span>{" "}
                  Written by a member, checked by structure and by peers —
                  never by a model.
                </>
              ) : (
                <>
                  <span className="font-medium text-ink-900">Verified.</span>{" "}
                  Machine-checked wherever a machine can check, with peers on
                  the rest. The strong badge.
                </>
              )}
            </p>
          </section>

          <section className="rounded-card border border-brand-600 bg-white p-4">
            <p className="font-mono text-[10px] tracking-[0.11em] text-brand-700 uppercase">
              Free · self-paced
            </p>
            <p className="mt-1.5 text-sm text-pretty text-ink-700">
              Every submission on this trail gets checked. Reading needs no
              account; earning does.
            </p>
            <div className="mt-3">
              <StartTrackButton slug={track.slug} />
            </div>
          </section>

          <section className="rounded-card border border-ink-100 bg-white p-4">
            <h2 className="text-xs font-medium tracking-[0.09em] text-ink-500 uppercase">
              How points are earned
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-baseline gap-2">
                <VerifyTag tone="ok">checked</VerifyTag>
                <span className="text-ink-600">a machine runs it</span>
              </li>
              <li className="flex items-baseline gap-2">
                <VerifyTag tone="warn">written</VerifyTag>
                <span className="text-ink-600">you write it, it is read</span>
              </li>
              <li className="flex items-baseline gap-2">
                <VerifyTag tone="brand">peer</VerifyTag>
                <span className="text-ink-600">two peers mark it</span>
              </li>
            </ul>
            <p className="mt-3 border-t border-ink-100 pt-3 text-sm text-pretty text-ink-500">
              No point is ever awarded for watching, scrolling or marking
              things done.
            </p>
          </section>
        </aside>

        <div className="mt-8 min-w-0 lg:mt-0">
          <h1 className="text-3xl leading-tight font-medium text-balance text-ink-900 sm:text-4xl">
            {track.title}
          </h1>
          <p className="mt-3 max-w-[62ch] text-lg text-pretty text-ink-600">{track.summary}</p>

          {track.modules.length === 0 ? (
            <EmptyCourse />
          ) : (
            <>
              {/* Native <details>: keeps this a server component, works before
                  JavaScript has parsed, and find-in-page opens a closed week
                  to reach a match. The first is open so the page never lands
                  as a wall of shut rows. The rail and nodes are decoration
                  over the same list semantics. */}
              <ol className="relative mt-8 space-y-3 pl-12 before:absolute before:top-4 before:bottom-4 before:left-4 before:w-px before:bg-ink-200">
                {track.modules.map((module, i) => (
                  <Week key={module.id} module={module} open={i === 0} />
                ))}
              </ol>
            </>
          )}
        </div>
      </div>

      {/* The small-screen door. On large screens the rail carries the start
          button; below that it rides the bottom while the syllabus is on
          screen, then scrolls away instead of covering the footer. */}
      <div className="sticky bottom-0 mt-8 -mx-5 border-t border-ink-100 bg-white px-5 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm">
            <p className="text-ink-500">Free · self-paced</p>
            <p className="font-medium text-ink-900">Every submission checked</p>
          </div>
          <StartTrackButton slug={track.slug} />
        </div>
      </div>
    </main>
  );
}

/** The verification legend's little labels — mono, quiet, token-coloured. */
function VerifyTag({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "brand";
  children: React.ReactNode;
}) {
  const tones = {
    ok: "bg-ok-600/10 text-ok-800",
    warn: "bg-warn-600/10 text-warn-800",
    brand: "bg-brand-50 text-brand-800",
  } as const;
  return (
    <span
      className={`inline-flex shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] tracking-[0.03em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Week({ module, open }: { module: Module; open: boolean }) {
  const headingId = `week-${module.week_no}`;

  return (
    <li className="relative">
      {/* The node on the rail. Decoration over list semantics — aria-hidden,
          because "Week 02" is already read out from the heading. The first
          open week gets the brand ring the same way a current step would. */}
      <span
        aria-hidden
        className={`absolute top-4 -left-12 flex size-8 items-center justify-center rounded-full border bg-white font-mono text-xs tabular-nums ${
          open ? "border-brand-600 text-brand-700 ring-2 ring-brand-50" : "border-ink-200 text-ink-500"
        }`}
      >
        {String(module.week_no).padStart(2, "0")}
      </span>

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

          <span className="hidden shrink-0 font-mono text-sm text-ink-500 sm:inline">
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
                <>
                  <h3 className="mt-5 text-xs font-medium tracking-wide text-ink-500 uppercase">
                    What you submit
                  </h3>
                  {/* One card per artifact, mission-style: what kind of thing
                      it is, what it asks, and what the rubric pays — the
                      points shown are the rubric's own max, not a promise
                      invented by the page. */}
                  <ul className="mt-2 space-y-3">
                    {module.assignments.map((assignment) => (
                      <li
                        key={assignment.id}
                        className="rounded-card border border-brand-200 bg-brand-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] tracking-[0.1em] text-brand-800 uppercase">
                              {SUBMIT_LABEL[assignment.kind]}
                            </p>
                            <p className="mt-1 font-medium text-pretty text-ink-900">
                              {assignment.spec?.prompt ?? "Details to follow."}
                            </p>
                          </div>
                          {assignment.rubrics ? (
                            <p className="shrink-0 font-mono text-sm tabular-nums text-brand-700">
                              {Number(assignment.rubrics.max_score)} pts
                            </p>
                          ) : null}
                        </div>
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
                </>
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
