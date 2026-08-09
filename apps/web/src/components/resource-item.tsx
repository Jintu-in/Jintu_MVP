import { ResourceIcon } from "@/components/resource-icon";
import { YouTubeEmbed } from "@/components/youtube-embed";
import type { Resource } from "@/lib/curriculum";

/**
 * One row of a week's reading list.
 *
 * Shared by the public syllabus at /learn/[track] and the enrolled student's
 * week view. They must render identically: the whole promise on the landing
 * page is that paying changes the deadlines and the grading, not the
 * curriculum. Two copies of this markup would drift, and the drift would make
 * that sentence false.
 */

const KIND_LABEL: Record<Resource["kind"], string> = {
  video: "Video",
  article: "Article",
  docs: "Docs",
  dataset: "Dataset",
  tool: "Tool",
};

/**
 * Host of an external link, for the screen-reader-only "opens on …" suffix.
 * Returns null rather than throwing: a malformed URL in one row must not take
 * down the whole syllabus page.
 */
function hostOf(url: string): string | null {
  try {
    return `on ${new URL(url).hostname.replace(/^www\./, "")}`;
  } catch {
    return null;
  }
}

export function ResourceItem({ resource }: { resource: Resource }) {
  // The official IFrame player, never a link dressed up as our own player.
  if (resource.provider === "youtube" && resource.youtube_video_id) {
    return (
      <figure>
        <YouTubeEmbed videoId={resource.youtube_video_id} title={resource.title} />
        <figcaption className="mt-2 text-sm text-ink-500">
          {resource.title}
          {resource.duration_sec ? ` · ${Math.round(resource.duration_sec / 60)} min` : null}
        </figcaption>
      </figure>
    );
  }

  const minutes = resource.duration_sec
    ? `${Math.round(resource.duration_sec / 60)} min`
    : null;

  return (
    <a
      href={resource.external_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-card border border-ink-200 px-4 py-3 hover:border-brand-600"
    >
      <ResourceIcon kind={resource.kind} className="size-5 shrink-0 text-brand-700" />

      <span className="min-w-0 flex-1">
        <span className="block font-medium text-pretty text-ink-900 group-hover:text-brand-800">
          {resource.title}
        </span>
        <span className="block text-sm text-ink-500">
          {KIND_LABEL[resource.kind]}
          {minutes ? ` · ${minutes}` : null}
          {resource.health === "degraded" ? (
            <span className="text-warn-600"> · link may be flaky</span>
          ) : null}
        </span>
      </span>

      {/* Opens in a new tab — say so in the accessible name, not only visually. */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 shrink-0 text-ink-500 group-hover:text-brand-700"
      >
        <path d="M8 16 16 8M9 8h7v7" />
      </svg>
      <span className="sr-only">(opens {hostOf(resource.external_url) ?? "in a new tab"})</span>
    </a>
  );
}
