import type { Resource } from "@/lib/curriculum";

/**
 * The glyph beside a curriculum resource — video, article, docs, dataset, tool.
 *
 * Inline SVG rather than an icon font: the design calls for Material Symbols,
 * and pulling that in costs a render-blocking stylesheet plus a variable font
 * for five glyphs. On the mid-range Android this is built for, that is the
 * whole icon budget spent on decoration.
 *
 * Decorative in every use here — the kind is also written out in text beside
 * it — so each path set is rendered inside an aria-hidden svg.
 */
const PATHS: Record<Resource["kind"], React.ReactNode> = {
  video: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.5 8.8 16 12l-5.5 3.2Z" />
    </>
  ),
  article: (
    <>
      <path d="M6 3h8l4 4v14H6Z" />
      <path d="M14 3v4h4M9 12h6M9 16h4" />
    </>
  ),
  docs: (
    <>
      <path d="M6 4a2 2 0 0 1 2-2h10v16H8a2 2 0 0 0-2 2Z" />
      <path d="M6 18a2 2 0 0 0 2 2h10" />
    </>
  ),
  dataset: (
    <>
      <path d="M4 6c0-1.4 3.6-2.5 8-2.5s8 1.1 8 2.5-3.6 2.5-8 2.5S4 7.4 4 6Z" />
      <path d="M4 6v12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V6M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5" />
    </>
  ),
  tool: (
    <>
      <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="10" cy="16" r="2" />
    </>
  ),
};

export function ResourceIcon({
  kind,
  className,
}: {
  kind: Resource["kind"];
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[kind]}
    </svg>
  );
}
