/**
 * The homepage owns its whole viewport.
 *
 * It carries the design's own glass nav and its own big-wordmark footer, so
 * wrapping it in the marketing chrome renders both twice — which is exactly
 * what happened when this page lived in that group.
 *
 * A second, quieter win: the marketing layout is force-dynamic because it
 * reads the viewer to draw the avatar and streak chip. Out here, the
 * homepage fetches only what it renders, and the busiest public page in the
 * product stops paying for a header it does not show.
 */
export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
