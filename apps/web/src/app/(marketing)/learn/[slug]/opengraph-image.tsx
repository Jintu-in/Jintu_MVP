import { ImageResponse } from "next/og";
import { getRoadmap } from "@/lib/roadmaps";

/**
 * The per-roadmap social card: title, the one-line summary, and the honest
 * size of the thing (modules · nodes · hours). Same real tokens as every
 * other card; brand-500 stays a decorative dot because 2.44:1 never
 * carries text.
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
          justifyContent: "center",
          padding: "80px",
          background: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#43b4c8",
              marginRight: 14,
            }}
          />
          <div style={{ fontSize: 28, color: "#17758a", letterSpacing: 1 }}>jintu.in</div>
        </div>

        <div style={{ display: "flex", fontSize: 64, color: "#231f20", lineHeight: 1.15 }}>
          {title}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#706d6e",
            marginTop: 28,
            lineHeight: 1.4,
            maxWidth: 1000,
          }}
        >
          {summary.length > 140 ? `${summary.slice(0, 137)}...` : summary}
        </div>

        {facts ? (
          <div style={{ display: "flex", fontSize: 30, color: "#17758a", marginTop: 24 }}>
            {facts}
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
