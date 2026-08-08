/**
 * The only permitted way to render a YouTube video in this product.
 *
 * ARCHITECTURE.md §7 and docs/LEGAL.md §1: playback goes through YouTube's
 * official IFrame player, on the nocookie host, and nothing else. We do not
 * proxy it, we do not extract audio, we do not strip ads, and we never gate
 * it behind a quiz — gate the *next module* instead, because the ordering is
 * ours and the video is not.
 *
 * If you need a thumbnail, use i.ytimg.com through next/image (already
 * allow-listed in next.config.ts). Do not download it.
 */
export function YouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-card bg-ink-100">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        // The minimum set the official player needs. No autoplay: it burns
        // mobile data on a device the student is paying for.
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
