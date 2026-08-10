import { ImageResponse } from "next/og";
import { getTrackCard } from "@/lib/curriculum";

/**
 * Per-course social preview.
 *
 * A shared link that previews "Data Analyst — first job" is forwardable in a
 * way that a generic brand card is not: the person receiving it in a placement
 * group can tell in one glance whether it is for them.
 *
 * Overrides the root app/opengraph-image.tsx for this segment only.
 */

export const alt = "A free six-week Jintu course";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ track: string }> }) {
  const { track } = await params;

  // A preview must not 404 or throw. If the DB is unreachable or the slug is
  // unknown, the generic card is a fine answer — a broken link preview costs
  // more than a slightly vague one.
  const card = await getTrackCard(track).catch(() => null);

  const title = card?.title ?? "Free curriculum";
  const summary =
    card?.summary ?? "Six weeks of real work, with the rubric published before you start.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#43b4c8",
              marginRight: 14,
            }}
          />
          <div style={{ fontSize: 26, color: "#17758a", letterSpacing: 1 }}>
            jintu.in · free curriculum
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 34 ? 60 : 72,
              color: "#231f20",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#706d6e",
              lineHeight: 1.4,
              marginTop: 28,
            }}
          >
            {/* Satori does not do line-clamp; trim rather than overflow. */}
            {summary.length > 150 ? `${summary.slice(0, 147)}…` : summary}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#706d6e" }}>
          Six weeks · every rubric public before you pay
        </div>
      </div>
    ),
    { ...size },
  );
}
