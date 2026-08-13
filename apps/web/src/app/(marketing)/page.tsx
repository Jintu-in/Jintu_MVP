/**
 * The homepage, mid-pivot.
 *
 * Jintu is now a free roadmap platform: deep curricula for any subject built
 * from curated free content, followed at your own pace with progress, streaks
 * and points for momentum. The catalogue screens arrive with the next phase;
 * until they do, this page states the product honestly and points at the one
 * surface that already exists. Static on purpose — the old page's database
 * reads (tiers, vote counts) died with the verification product.
 */
export default function LandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-5">
      {/* ── hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-16 pb-18 sm:pt-24">
        <h1 className="text-[30px] leading-tight font-medium text-balance text-ink-900 sm:text-[40px]">
          One place to learn anything, properly.
        </h1>

        <p className="mt-5 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          Deep, sequenced roadmaps for the subject you care about — the best
          free articles, videos and docs on the internet, in the order that
          actually teaches, with your progress tracked so a two-minute session
          on the metro still moves you forward.
        </p>

        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          Free. No cohorts, no deadlines, no upsell. The first roadmaps are
          being curated now — every link checked by hand before it ships.
        </p>
      </section>

      {/* ── how it works ─────────────────────────────────────────────────── */}
      <section className="border-t border-ink-100 py-18 sm:py-24" aria-labelledby="how">
        <h2 id="how" className="text-lg font-medium text-ink-900">
          How it works
        </h2>

        <dl className="mt-6 divide-y divide-ink-100 border-y border-ink-100">
          <Row
            name="Follow"
            detail="Pick a roadmap. It is modules of small nodes — one concept, a couple of reads, maybe a video, an honest time estimate."
          />
          <Row
            name="Finish"
            detail="Work through a node in a sitting. Tick it, save what you want for later, and the roadmap always knows what you tap next."
          />
          <Row
            name="Keep going"
            detail="Streaks with freezes, points for real progress, and spaced review of what you learned — momentum, not a credential."
          />
        </dl>
      </section>

      {/* ── what this is not ─────────────────────────────────────────────── */}
      <section className="py-18 sm:py-24" aria-labelledby="not">
        <h2 id="not" className="text-lg font-medium text-ink-900">
          What this is not
        </h2>

        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          We do not promise you a job, and we will never publish a success
          statistic we cannot evidence.
        </p>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
          We also do not host anyone else&apos;s content. Every read and every
          video lives where its author put it; we curate, sequence and link,
          and your progress is the only thing stored here.
        </p>
      </section>
    </main>
  );
}

/** One step. A row with a hairline, not a card — cards on a page this plain read as a template. */
function Row({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="flex items-baseline gap-4 py-4">
      <dt className="w-24 shrink-0 text-[15px] font-medium text-ink-900">{name}</dt>
      <dd className="max-w-[62ch] flex-1 text-[15px] leading-[1.7] text-ink-600">{detail}</dd>
    </div>
  );
}
