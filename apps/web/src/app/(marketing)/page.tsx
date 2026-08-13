import Link from "next/link";
import { listPublishedRoadmaps, type RoadmapSummary } from "@/lib/roadmaps";

/**
 * The homepage: hero question, one flagship roadmap, three plain sections.
 *
 * The "Start today" card is read from the database and every number on it is
 * real — module, node and hour counts grow as the curriculum is imported,
 * and a page that invented "52 nodes" while the catalogue held twelve would
 * be the exact kind of claim this site exists to never make. If the read
 * fails or nothing is published, the card disappears rather than lying.
 *
 * The hero input is a plain GET form into /learn, where the filtering
 * happens server-side. No JS, works on the cheapest phone, and the search
 * screen proper (phase-3 screen 4) can replace the target without touching
 * this form.
 */
export const dynamic = "force-dynamic";

export default async function LandingPage() {
  // A homepage that 500s because the database blinked is worse than one
  // missing its flagship card; the rest of the page is static words.
  const roadmaps: RoadmapSummary[] = await listPublishedRoadmaps().catch(() => []);
  const flagship = [...roadmaps].sort((a, b) => b.nodeCount - a.nodeCount)[0] ?? null;

  return (
    <main className="mx-auto max-w-3xl px-5">
      {/* ── hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-18 sm:pt-24">
        <h1 className="text-[30px] leading-tight font-medium text-balance text-ink-900 sm:text-[40px]">
          Learn anything. Actually finish it.
        </h1>

        <p className="mt-5 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          Deep roadmaps built from the best free material on the internet —
          reads, videos, docs, case studies — sequenced so you always know
          what to open next. Free, forever.
        </p>

        <form action="/learn" method="get" className="mt-8 flex max-w-xl gap-2" role="search">
          <label htmlFor="home-q" className="sr-only">
            What do you want to learn?
          </label>
          <input
            id="home-q"
            type="search"
            name="q"
            placeholder="what do you want to learn?"
            className="h-12 min-w-0 flex-1 rounded-lg border border-ink-200 bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-500 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-brand-700"
          />
          <button
            type="submit"
            aria-label="Search roadmaps"
            className="h-12 shrink-0 rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            →
          </button>
        </form>
      </section>

      {/* ── start today ──────────────────────────────────────────────────── */}
      {flagship ? (
        <section className="border-t border-ink-100 py-18 sm:py-24" aria-labelledby="start">
          <h2 id="start" className="text-lg font-medium text-ink-900">
            Start today
          </h2>

          <div className="mt-6 rounded-card border border-ink-100 bg-white p-6">
            <p className="text-[17px] font-medium text-ink-900">
              {flagship.title}
              {flagship.estimatedWeeks ? ` — ${flagship.estimatedWeeks} weeks` : ""}
            </p>
            <p className="mt-1 font-mono text-[13px] text-ink-500">
              {flagship.moduleCount} modules · {flagship.nodeCount} nodes
              {flagship.estimatedHours ? ` · ~${flagship.estimatedHours} hours` : ""} · free
            </p>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
              {flagship.summary}
            </p>
            <Link
              href={`/learn/${flagship.slug}`}
              className="mt-5 inline-flex h-12 items-center rounded-lg bg-brand-700 px-6 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Open the roadmap →
            </Link>
          </div>
        </section>
      ) : null}

      {/* ── built for two minutes at a time ──────────────────────────────── */}
      <section className="border-t border-ink-100 py-18 sm:py-24" aria-labelledby="sessions">
        <h2 id="sessions" className="text-lg font-medium text-ink-900">
          Built for two minutes at a time
        </h2>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          Every node states how long it takes and how much data a video costs,
          so a metro ride is a real session. Pick up exactly where you
          stopped.
        </p>
      </section>

      {/* ── what keeps you going ─────────────────────────────────────────── */}
      <section className="border-t border-ink-100 py-18 sm:py-24" aria-labelledby="momentum">
        <h2 id="momentum" className="text-lg font-medium text-ink-900">
          What keeps you going
        </h2>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          A streak that survives a bad week, points for what you get through,
          and spaced review so last month&apos;s module does not evaporate.
        </p>
      </section>

      {/* ── what this is not ─────────────────────────────────────────────── */}
      <section className="border-t border-ink-100 py-18 sm:py-24" aria-labelledby="not">
        <h2 id="not" className="text-lg font-medium text-ink-900">
          What this is not
        </h2>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          We do not promise you a job. We do not host anyone else&apos;s
          content — every resource links out to the people who made it.
          Points are for momentum, not a credential.
        </p>
      </section>
    </main>
  );
}
