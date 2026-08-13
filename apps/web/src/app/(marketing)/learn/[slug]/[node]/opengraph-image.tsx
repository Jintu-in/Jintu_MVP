import { ImageResponse } from "next/og";
import { getRoadmap } from "@/lib/roadmaps";

/**
 * The per-node social card — what makes each of the 91 days independently
 * forwardable. "Look at Day 47, cohort retention" pasted into a WhatsApp
 * group renders the day's name, its module, and its honest price in
 * minutes and points, not the site-wide card 91 times over.
 *
 * Same real tokens as the root card: brand-500 #43b4c8 is the decorative
 * dot only; text is ink-900 #231f20 / ink-500 #706d6e / brand-700 #17758a —
 * brand-500 never carries text at 2.44:1.
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

  const title = hit?.n.title ?? "A day on a Jintu roadmap";
  const moduleTitle = hit ? `${hit.m.title} · ${roadmap?.title}` : "Free, curated, self-paced";
  const price = hit ? `${hit.n.estMinutes} min · ${hit.n.points} pts` : "";

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

        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? 48 : 58,
            color: "#231f20",
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#706d6e", marginTop: 28 }}>
          {moduleTitle}
        </div>

        {price ? (
          <div style={{ display: "flex", fontSize: 30, color: "#17758a", marginTop: 14 }}>
            {price}
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
