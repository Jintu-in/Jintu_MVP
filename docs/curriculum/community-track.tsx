import { type Track, checkKind, verificationMix } from '@/lib/tracks';
import { VerificationStrip, StripLegend } from './verification-strip';
import { ResourceRow } from './resource-row';

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
  const isDraft = track.tier === 'draft';
  const mix = verificationMix(track);

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 font-mono text-xs text-neutral-400">
        <a href="/learn" className="hover:text-brand-700">Tracks</a>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-500">{track.title}</span>
      </nav>

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] tracking-wide ${
            isDraft
              ? 'bg-neutral-100 text-neutral-500'
              : 'bg-check-peer/12 text-check-peer-ink'
          }`}>
            {isDraft ? 'Draft outline' : 'Community-reviewed'}
          </span>
          {track.authorHandle && !isDraft && (
            <a href={`/p/${track.authorHandle}`} className="font-mono text-[11px] text-neutral-500 hover:text-brand-700">
              by @{track.authorHandle}
            </a>
          )}
        </div>

        <h1 className="text-[27px] font-medium leading-tight tracking-[-0.02em] text-neutral-950 sm:text-[32px]">
          {track.title}
        </h1>
        {track.oneLine && (
          <p className="mt-2.5 max-w-[54ch] text-[15px] leading-relaxed text-neutral-600">
            {track.oneLine}
          </p>
        )}
      </header>

      {isDraft ? (
        // A draft is deliberately thinner than a verified track. If it ever
        // feels satisfying, it has become the free thing a chatbot already
        // gives away, and the reason to start a real track disappears.
        <div className="mb-8 rounded-xl border border-neutral-200 p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-neutral-700">
            Nobody has built this yet. What follows is a starting sequence with
            links to free sources — no artifacts, no checking, no points.
          </p>
          <a
            href={`/vote/${track.slug}`}
            className="mt-3.5 inline-block rounded-lg bg-brand-700 px-4 py-2.5 text-sm text-white hover:-translate-y-px"
          >
            Vote to have this built properly
          </a>
        </div>
      ) : (
        <>
          <div className="mb-2.5">
            <VerificationStrip mix={mix} />
          </div>
          <div className="mb-8">
            <StripLegend mix={mix} />
            <p className="mt-2.5 max-w-[56ch] text-[13px] leading-relaxed text-neutral-500">
              This track was written by a learner and is checked by peers and by
              form, not against an answer key. It earns a community badge rather
              than a verified one.
            </p>
          </div>
        </>
      )}

      {/* Contents rail. Orientation without imposing a shape the content lacks. */}
      {track.units.length > 2 && (
        <nav aria-label="Contents" className="mb-10 border-y border-neutral-200 py-4">
          <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
            Contents
          </p>
          <ol className="space-y-1.5">
            {track.units.map((u) => (
              <li key={u.id} className="flex gap-3 text-sm">
                <span className="w-5 shrink-0 font-mono text-xs tabular-nums text-neutral-400">
                  {String(u.unitNo).padStart(2, '0')}
                </span>
                <a href={`#unit-${u.unitNo}`} className="text-neutral-700 hover:text-brand-700">
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
              {String(u.unitNo).padStart(2, '0')}
            </p>
            <h2 className="text-lg font-medium tracking-[-0.01em] text-neutral-950">{u.title}</h2>
            <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-neutral-600">
              {u.objective}
            </p>

            {u.resources.length > 0 && (
              <ul className="mt-4">
                {u.resources.map((r, i) => <ResourceRow key={i} resource={r} />)}
              </ul>
            )}

            {u.artifactPrompt && !isDraft && (
              <div className="mt-4 rounded-xl bg-neutral-50 p-4">
                <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                  What you hand in · {u.points} points
                </p>
                <p className="text-sm leading-relaxed text-neutral-800">{u.artifactPrompt}</p>
                {u.criteria.length > 0 && (
                  <ul className="mt-3">
                    {u.criteria.map((c) => (
                      <li
                        key={c.name}
                        className="flex items-baseline gap-2.5 border-t border-neutral-200 py-1.5 text-[13px]"
                      >
                        <span className="flex-1 text-neutral-700">{c.name}</span>
                        <span className="font-mono text-xs tabular-nums text-neutral-400">
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
        <p className="mt-12 border-t border-neutral-200 pt-6 text-[13px] leading-relaxed text-neutral-500">
          Drafts are generated once and cached, so this page cost almost nothing
          to produce and nothing to serve. It is not indexed by search engines.
        </p>
      )}
    </main>
  );
}
