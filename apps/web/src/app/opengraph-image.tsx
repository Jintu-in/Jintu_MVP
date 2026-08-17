import { ImageResponse } from "next/og";

/**
 * The default social preview for every route that does not generate its own.
 *
 * This is not decoration. The distribution channel is a student pasting a link
 * into a WhatsApp placement group, and WhatsApp renders og:image at a size
 * where the text has to carry on its own — so the image says the offer rather
 * than showing a logo.
 *
 * Colours are the real tokens from packages/config/tailwind/preset.css, not
 * approximations: brand-700 #17758a (5.32:1), ink-900 #231f20 (16.30:1),
 * ink-500 #706d6e (5.12:1). brand-500 is deliberately absent from anything
 * carrying text — it is 2.44:1 and fill-only.
 */

export const alt =
  "Jintu — one place to learn anything, properly. Free roadmaps, curated links, your progress tracked.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      // OG cards.dc.html, card 1: wordmark 72px top-left, content anchored
      // to the same left edge, one quiet line at the bottom. Flat fills and
      // text only — Satori needs display:flex on anything with children.
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
        <div style={{ display: "flex", fontSize: 26, fontWeight: 500, color: "#17758a" }}>
          jintu.in
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 500,
              lineHeight: 1.18,
              letterSpacing: "-0.02em",
              color: "#231f20",
              maxWidth: 900,
            }}
          >
            Learn anything, properly.
          </div>
          <div style={{ display: "flex", fontSize: 28, lineHeight: 1.5, color: "#585556", maxWidth: 1010 }}>
            Deep, free roadmaps. Every link opened by a person.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#706d6e" }}>
          Free · No account needed to read
        </div>
      </div>
    ),
    { ...size },
  );
}
