'use client';

import { useState } from 'react';
import type { Resource } from '@/lib/tracks';

/**
 * A resource row, and the lazy YouTube facade.
 *
 * THREE CONSTRAINTS FROM THE ARCHITECTURE, ENFORCED HERE:
 *
 * 1. The iframe is never rendered until clicked. Each YouTube embed pulls
 *    roughly 1 MB of player JavaScript before a single frame plays; four
 *    embeds is 4 MB spent before a learner starts. On a metered Indian mobile
 *    connection that is the difference between starting and leaving.
 *
 * 2. youtube-nocookie.com, official IFrame only. The video is never separated
 *    from its player, and playback is never gated behind a quiz — YouTube's
 *    developer policies prohibit requiring any action other than clicking
 *    play. Gate the next unit instead.
 *
 * 3. No transcript is stored, summarised, or narrated. Link out and embed.
 *    That is the line between indexing and substitution.
 */

const ICON: Record<Resource['kind'], string> = {
  video: 'M8 5v14l11-7z',
  dataset: 'M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 7v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7',
  docs: 'M14 3v5h5M6 2h9l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z',
  article: 'M4 5h16M4 10h16M4 15h10',
  book: 'M4 4h7a2 2 0 012 2v14a2 2 0 00-2-2H4zM20 4h-7a2 2 0 00-2 2v14a2 2 0 012-2h7z',
  practice: 'M14 7l3 3M4 20l4-1 10-10-3-3L5 16l-1 4z',
  tool: 'M3 5h18v12H3zM8 21h8M12 17v4',
  export: 'M12 3v12M7 10l5 5 5-5M4 20h16',
};

/** Roughly 7 MB per minute at 480p. Estimated, and labelled as such. */
const dataMb = (sec: number | null) => (sec ? Math.round((sec / 60) * 7) : null);

const mmss = (sec: number) => {
  const m = Math.round(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)} hr ${m % 60} min` : `${m} min`;
};

export function ResourceRow({ resource: r }: { resource: Resource }) {
  const [loaded, setLoaded] = useState(false);
  const mb = r.kind === 'video' ? dataMb(r.durationSec) : null;
  const dead = r.health === 'dead';

  return (
    <li className="border-b border-neutral-200 py-3 last:border-b-0">
      <div className="flex items-start gap-2.5">
        <svg
          viewBox="0 0 24 24"
          className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
          fill="none" stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden
        >
          <path d={ICON[r.kind]} />
        </svg>

        <div className="min-w-0 flex-1">
          <p className={`text-[14px] leading-snug ${dead ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>
            {r.title}
          </p>
          <p className="mt-1 font-mono text-[11px] text-neutral-400">
            {[
              r.sourceLabel,
              r.durationSec ? mmss(r.durationSec) : null,
              // Showing the data cost before someone taps is the single most
              // useful thing you can do for a learner on mobile data, and
              // almost nobody does it.
              mb ? `~${mb} MB` : null,
            ].filter(Boolean).join(' · ')}
          </p>

          {r.needsVerification && (
            <p className="mt-1.5 text-[12px] text-neutral-500">
              Link pending verification — we will not publish one we have not opened.
            </p>
          )}
          {dead && (
            <p className="mt-1.5 text-[12px] text-check-model-ink">
              This source stopped responding. A replacement is being chosen by hand.
            </p>
          )}

          {r.youtubeVideoId && !dead && (
            loaded ? (
              <div className="mt-2.5 aspect-video overflow-hidden rounded-lg bg-neutral-900">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${r.youtubeVideoId}?rel=0&modestbranding=1`}
                  title={r.title}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            ) : (
              <button
                onClick={() => setLoaded(true)}
                className="mt-2.5 inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-[13px] text-neutral-800 hover:border-brand-600 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
                Load player{mb ? ` · ~${mb} MB` : ''}
              </button>
            )
          )}
        </div>

        {r.externalUrl && !dead && (
          <a
            href={r.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${r.title} on ${r.sourceLabel ?? 'the source site'}`}
            className="mt-0.5 shrink-0 text-neutral-300 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M14 4h6v6M20 4l-9 9M17 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h5" />
            </svg>
          </a>
        )}
      </div>
    </li>
  );
}
