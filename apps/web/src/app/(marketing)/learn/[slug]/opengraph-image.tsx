import { ImageResponse } from "next/og";
import { getRoadmap } from "@/lib/roadmaps";

/**
 * The per-roadmap social card: title, the one-line summary, and the honest
 * size of the thing (modules · nodes · hours). Same real tokens as every
 * other card; brand-500 appears only as the full-width bottom bar — a
 * decorative fill, because 2.44:1 never carries text.
 */
export const alt = "A Jintu roadmap: what it covers and how big it honestly is.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug).catch(() => null);

  const title = roadmap?.title ?? "A Jintu roadmap";
  const summary = roadmap?.summary ?? "Free, curated, self-paced.";
  const nodes = roadmap?.modules.reduce((a, m) => a + m.nodes.length, 0) ?? 0;
  const facts = roadmap
    ? `${roadmap.modules.length} modules · ${nodes} nodes${roadmap.estimatedHours ? ` · ~${roadmap.estimatedHours} hours` : ""} · free`
    : "";

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
        {/* OG cards.dc.html, card 2: kicker, big title, mono facts, and a
            single full-width brand bar at the bottom — the one place
            brand-500 is allowed, a decorative fill. */}
        <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: "#17758a" }}>
          jintu.in
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 24,
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
            Roadmap
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#231f20",
            }}
          >
            {title}
          </div>
          {facts ? (
            <div style={{ display: "flex", fontSize: 26, lineHeight: 1.4, color: "#585556" }}>
              {facts}
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 26, lineHeight: 1.4, color: "#585556", maxWidth: 1000 }}>
              {summary.length > 140 ? `${summary.slice(0, 137)}...` : summary}
            </div>
          )}
        </div>
        <div style={{ display: "flex", height: 8, background: "#43b4c8" }} />
      </div>
    ),
    { ...size },
  );
}
