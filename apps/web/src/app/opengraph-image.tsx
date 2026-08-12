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
  "Jintu — learn anything, prove you actually did. Free, self-paced, every submission checked.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
        {/* Satori needs explicit display:flex on anything with children. */}
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

        <div style={{ display: "flex", fontSize: 66, color: "#231f20", lineHeight: 1.15 }}>
          Six weeks. Six artifacts.
        </div>
        <div style={{ display: "flex", fontSize: 66, color: "#231f20", lineHeight: 1.15 }}>
          One profile that proves it.
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#706d6e", marginTop: 36 }}>
          Free · self-paced · every submission checked
        </div>
      </div>
    ),
    { ...size },
  );
}
