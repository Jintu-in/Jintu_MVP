import { ImageResponse } from "next/og";
import { getRoadmap } from "@/lib/roadmaps";

/**
 * The per-node social card — what makes each of the 91 days independently
 * forwardable. "Look at Day 47, cohort retention" pasted into a WhatsApp
 * group renders the day's name, its module, and its honest price in
 * minutes and points, not the site-wide card 91 times over.
 *
 * Same real tokens as the root card: text is ink-900 #231f20 / ink-500
 * #706d6e / ink-600 #585556 / brand-700 #17758a — brand-500 never carries
 * text at 2.44:1.
 */
export const alt = "A day from a Jintu roadmap: what it covers and how long it takes.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; node: string }>;
}) {
  const { slug, node: nodeParam } = await params;
  const roadmap = await getRoadmap(slug).catch(() => null);
  const hit = roadmap?.modules
    .flatMap((m) => m.nodes.map((n) => ({ n, m })))
    .find(({ n }) => n.slug === nodeParam || n.id === nodeParam);

  const allNodes = roadmap?.modules.flatMap((m) => m.nodes) ?? [];
  const dayIndex = hit ? allNodes.findIndex((n) => n.id === hit.n.id) + 1 : 0;

  const title = hit?.n.title ?? "A day on a Jintu roadmap";
  const kicker = hit
    ? `Day ${dayIndex} of ${allNodes.length} · ${hit.m.title}`
    : "Free, curated, self-paced";
  const summary = hit?.n.summary ?? "";
  const price = hit ? `${hit.n.estMinutes} min · ${hit.n.points} pts` : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          background: "#FFFFFF",
        }}
      >
        {/* OG cards.dc.html, card 3: "Day 45 of 91 · window functions" kicker,
            58px title, the day's own summary, and the honest price line at the
            bottom. The design's "16 sections" is omitted until block counts
            exist in data — never invent a number. */}
        <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: "#17758a" }}>
          jintu.in
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#706d6e",
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 48 : 58,
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#231f20",
            }}
          >
            {title}
          </div>
          {summary ? (
            <div
              style={{
                display: "flex",
                fontSize: 20,
                lineHeight: 1.6,
                color: "#585556",
                maxWidth: 820,
              }}
            >
              {summary.length > 160 ? `${summary.slice(0, 157)}...` : summary}
            </div>
          ) : null}
        </div>
        {price ? (
          <div style={{ display: "flex", fontSize: 22, color: "#706d6e" }}>{price}</div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
