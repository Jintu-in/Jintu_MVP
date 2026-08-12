import Link from "next/link";
import { TrackRouter, type RouterTrack } from "@/components/track-router";
import { listCourseProposals, listPublishedTracks } from "@/lib/curriculum";
import { getViewer } from "@/lib/session";

/**
 * The homepage is a router, not a brochure.
 *
 * It used to be a single-product landing page: a stat strip, "how it works",
 * "what you build", four calls to action above the fold. All of that described
 * one course. Now the site holds more than one thing and the page's job is to
 * ask what you want and answer honestly — including "we have not built that".
 *
 * The differentiator sits in the first two lines, because "learn anything" on
 * its own is a commodity claim that a free chat window already satisfies. What
 * a chat window does not do is check whether you finished.
 *
 * Every number below is read from the database. There is deliberately no
 * hard-coded cohort date and no seat count: no cohort row exists, and a date
 * invented by a component is a commitment somebody could plan around. The
 * section further down promising never to publish a figure we cannot evidence
 * is not a section that gets to make an exception for itself.
 */
export const dynamic = "force-dynamic";

export default async function LandingPage() {
  // Independent reads, so they overlap. A proposals failure must not take the
  // page down — it is a count, and the page works without it.
  const [tracks, proposals, viewer] = await Promise.all([
    listPublishedTracks(),
    listCourseProposals().catch(() => []),
    getViewer(),
  ]);

  // Sorted by how finished a track is, not alphabetically. The router shows
  // the first three as examples, and the examples should be the ones worth
  // clicking — "Android Engineer" leading because A comes first is an
  // accident of the ORDER BY, not a recommendation.
  const routerTracks: RouterTrack[] = [...tracks]
    .sort((a, b) => b.artifacts - a.artifacts || b.weeks - a.weeks)
    .map((t) => ({
      slug: t.slug,
      title: t.title,
      summary: t.summary,
      weeks: t.weeks,
      artifacts: t.artifacts,
    }));

  // The flagship, for the "Running now" card: the course with the most
  // finished work behind it rather than a slug written into the page.
  const flagship = routerTracks[0];

  const counts = {
    verified: tracks.length,
    // Nobody has authored one yet. Printed rather than hidden: a zero is what
    // makes the tier real instead of decorative.
    community: 0,
    draft: proposals.length,
  };

  return (
    <main className="mx-auto max-w-3xl px-5">
      {/* ── hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-18 sm:pt-24">
        <h1 className="text-[30px] leading-tight font-medium text-balance text-ink-900 sm:text-[40px]">
          Learn anything. Then prove you actually did.
        </h1>

        <p className="mt-5 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          An AI can write you a plan in five seconds. Nobody checks whether you
          did any of it. Type what you want to learn and we will tell you
          honestly whether we can help you finish.
        </p>

        <TrackRouter tracks={routerTracks} signedIn={Boolean(viewer)} />
      </section>

      {/* ── three kinds of track ─────────────────────────────────────────── */}
      <section className="border-t border-ink-100 py-18 sm:py-24" aria-labelledby="kinds">
        <h2 id="kinds" className="text-lg font-medium text-ink-900">
          Three kinds of track
        </h2>

        <dl className="mt-6 divide-y divide-ink-100 border-y border-ink-100">
          {/* V3 names: tiers differ only in verification strength, and the
              names now say so. No prices anywhere — everything is free, and
              the tier tells you how strongly your work gets checked. */}
          <Kind
            name="Verified"
            count={counts.verified}
            detail="Machine-checked wherever a machine can check. The strong badge."
          />
          <Kind
            name="Community"
            count={counts.community}
            detail="Built by learners, checked by structure and peers. Any subject."
          />
          <Kind
            name="Draft"
            count={counts.draft}
            detail="Asked for, not written yet. Vote to move one up the queue."
          />
        </dl>
      </section>

      {/* ── start today ──────────────────────────────────────────────────── */}
      {flagship ? (
        <section className="py-18 sm:py-24" aria-labelledby="start">
          <h2 id="start" className="text-lg font-medium text-ink-900">
            Start today
          </h2>

          <div className="mt-6 border border-ink-100 p-6">
            <p className="text-[15px] font-medium text-ink-900">{flagship.title}</p>
            <p className="mt-1 text-[13px] text-ink-500">
              {flagship.weeks} weeks · {flagship.artifacts}{" "}
              {flagship.artifacts === 1 ? "artifact" : "artifacts"} · free
            </p>

            <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
              Everything is free and self-paced: the curriculum, the grading,
              the points, the profile. Your queries are run, your findings are
              counted, and no point is ever awarded for watching something.
            </p>

            <Link
              href={`/learn/${flagship.slug}`}
              className="mt-5 inline-block text-[15px] font-medium text-brand-700 underline hover:text-brand-800"
            >
              Read it, then start →
            </Link>
          </div>
        </section>
      ) : null}

      {/* ── what this is not ─────────────────────────────────────────────── */}
      <section className="border-t border-ink-100 py-18 sm:py-24" aria-labelledby="not">
        <h2 id="not" className="text-lg font-medium text-ink-900">
          What this is not
        </h2>

        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          We do not promise you a job, and we will never publish a placement
          statistic we cannot evidence.
        </p>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          And no point here can be earned by watching, scrolling or marking
          things done. Points come from work that something checked — which is
          exactly what makes them worth showing to anyone.
        </p>
      </section>
    </main>
  );
}

/**
 * One tier. A row with a hairline, not a card.
 *
 * Card grids on a page this plain read as a template. The count is
 * right-aligned and shown even when it is zero — a zero is the honest state
 * and it is what makes the vote mechanic look real rather than ornamental.
 */
function Kind({ name, count, detail }: { name: string; count: number; detail: string }) {
  return (
    <div className="flex items-baseline gap-4 py-4">
      <dt className="w-24 shrink-0 text-[15px] font-medium text-ink-900">{name}</dt>
      <dd className="max-w-[62ch] flex-1 text-[15px] leading-[1.7] text-ink-600">{detail}</dd>
      <span className="shrink-0 font-mono text-[13px] text-ink-500" aria-label={`${count} available`}>
        {count}
      </span>
    </div>
  );
}
