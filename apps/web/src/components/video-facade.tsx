"use client";

import Image from "next/image";
import { useState } from "react";
import { YouTubeEmbed } from "@/components/youtube-embed";

/**
 * Click-to-load front for the YouTube embed.
 *
 * An auto-rendered iframe costs about a megabyte before a frame plays, so
 * nothing mounts until the tap — and the tap is informed: the facade states
 * the duration and the data cost on its face, because the person deciding
 * is on metered mobile data and deserves the price before the purchase.
 *
 * The thumbnail comes from i.ytimg.com through next/image (allow-listed);
 * playback stays the official nocookie IFrame player via YouTubeEmbed —
 * this component gates WHEN it mounts, never HOW it plays.
 */
export function VideoFacade({
  videoId,
  title,
  durationSec,
  estSizeMb,
}: {
  videoId: string;
  title: string;
  durationSec: number | null;
  estSizeMb: number | null;
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) return <YouTubeEmbed videoId={videoId} title={title} />;

  const mins = durationSec ? Math.round(durationSec / 60) : null;
  const cost = [
    mins ? (mins >= 90 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`) : null,
    estSizeMb ? (estSizeMb >= 1000 ? `~${(estSizeMb / 1000).toFixed(1)} GB` : `~${Math.round(estSizeMb)} MB`) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={`Play "${title}"${cost ? ` — ${cost} of data` : ""}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-card bg-ink-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 672px"
        className="object-cover"
      />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-900/40">
        <span className="flex h-12 w-16 items-center justify-center rounded-lg bg-white text-lg text-ink-900 group-hover:bg-brand-700 group-hover:text-white">
          ▶
        </span>
        {cost ? (
          <span className="rounded-lg bg-ink-900/70 px-2.5 py-1 font-mono text-[13px] text-white">
            {cost}
          </span>
        ) : null}
      </span>
    </button>
  );
}
