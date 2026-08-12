import Link from "next/link";
import { type Track, verificationMix } from "@/lib/tracks-shared";
import { VerificationStrip, StripLegend } from "./verification-strip";
import { ResourceRow } from "./resource-row";

/**
 * The document template, for community and draft tracks.
 *
 * A map is right for verified tracks because they have a known six-artifact
 * shape and the shape IS the product. Community tracks are user-authored and
 * of unknown shape — someone writing about EV battery telematics should not be
 * forced into a six-tile grid, and a draft has nothing to map at all.
 *
 * So: a plain, readable document. Notion's aesthetic, not its infinite scroll —
 * a persistent contents rail keeps orientation without imposing structure the
 * content does not have.
 */

export function CommunityTrack({ track }: { track: Track }) {
  const isDraft = track.tier === "draft";
  const mix = verificationMix(track);

  return (
    <main className="mx-auto max-w-3xl px-5 pt-10 pb-24 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 font-mono text-xs text-ink-500">
        <Link href="/learn" className="hover:text-brand-700">Tracks</Link>
        <span className="mx-1.5" aria-hidden>/</span>
        <span className="text-ink-600">{track.title}</span>
      </nav>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-wide ${
            isDraft
              ? "bg-ink-100 text-ink-600"
              : "bg-check-peer/12 text-check-peer-ink"
          }`}>
            {isDraft ? "Draft outline" : "Community-reviewed"}
          </span>
        </div>

        <h1 className="text-[27px] leading-tight font-medium tracking-[-0.02em] text-ink-900 sm:text-[32px]">
          {track.title}
        </h1>
        {track.oneLine && (
          <p className="mt-2.5 max-w-[54ch] text-[15px] leading-relaxed text-ink-600">
            {track.oneLine}
          </p>
        )}
      </header>

      {isDraft ? (
        // A draft is deliberately thinner than a verified track. If it ever
        // feels satisfying, it has become the free thing a chatbot already
        // gives away, and the reason to start a real track disappears.
        <div className="mb-8 rounded-card border border-ink-200 bg-white p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-ink-700">
            Nobody has built this yet. What follows is a starting sequence with
            links to free sources — no artifacts, no checking, no points.
          </p>
          <Link
            href={`/learn/vote/${track.slug}`}
            className="mt-3.5 inline-flex h-12 items-center rounded-lg bg-brand-700 px-4 text-sm font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            Vote to have this built properly
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-2.5">
            <VerificationStrip mix={mix} />
          </div>
          <div className="mb-8">
            <StripLegend mix={mix} />
            <p className="mt-2.5 max-w-[56ch] text-[13px] leading-relaxed text-ink-500">
              This track was written by a learner and is checked by peers and by
              form, not against an answer key. It earns a community badge rather
              than a verified one.
            </p>
          </div>
        </>
      )}

      {/* Contents rail. Orientation without imposing a shape the content lacks. */}
      {track.units.length > 2 && (
        <nav aria-label="Contents" className="mb-10 border-y border-ink-100 py-4">
          <p className="mb-2.5 font-mono text-[11px] tracking-wider text-ink-500 uppercase">
            Contents
          </p>
          <ol className="space-y-1.5">
            {track.units.map((u) => (
              <li key={u.id} className="flex gap-3 text-sm">
                <span className="w-5 shrink-0 font-mono text-xs tabular-nums text-ink-500">
                  {String(u.unitNo).padStart(2, "0")}
                </span>
                <a href={`#unit-${u.unitNo}`} className="text-ink-700 hover:text-brand-700">
                  {u.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="space-y-12">
        {track.units.map((u) => (
          <section key={u.id} id={`unit-${u.unitNo}`} className="scroll-mt-6">
            <p className="mb-1.5 font-mono text-[11px] text-brand-700">
              {String(u.unitNo).padStart(2, "0")}
            </p>
            <h2 className="text-lg font-medium tracking-[-0.01em] text-ink-900">{u.title}</h2>
            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-600">
              {u.objective}
            </p>

            {u.resources.length > 0 && (
              <ul className="mt-4">
                {u.resources.map((r, i) => <ResourceRow key={i} resource={r} />)}
              </ul>
            )}

            {u.artifactPrompt && !isDraft && (
              <div className="mt-4 rounded-card border border-ink-100 bg-white p-4">
                <p className="mb-1.5 font-mono text-[11px] tracking-wider text-ink-500 uppercase">
                  What you hand in · {u.points} points
                </p>
                <p className="text-sm leading-relaxed text-ink-800">{u.artifactPrompt}</p>
                {u.criteria.length > 0 && (
                  <ul className="mt-3">
                    {u.criteria.map((c) => (
                      <li
                        key={c.name}
                        className="flex items-baseline gap-2.5 border-t border-ink-100 py-1.5 text-[13px]"
                      >
                        <span className="flex-1 text-ink-700">{c.name}</span>
                        <span className="font-mono text-xs tabular-nums text-ink-500">
                          {c.weight}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        ))}
      </div>

      {isDraft && (
        <p className="mt-12 border-t border-ink-100 pt-6 text-[13px] leading-relaxed text-ink-500">
          Drafts are generated once and cached, so this page cost almost nothing
          to produce and nothing to serve. It is not indexed by search engines.
        </p>
      )}
    </main>
  );
}
