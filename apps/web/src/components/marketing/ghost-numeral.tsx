/**
 * The huge, faded numeral behind the copy on the 404 and error pages
 * (V2NotFound.dc.html / V2Error.dc.html — "404" and "!" respectively).
 *
 * Rendered as a CSS background-image SVG, not DOM text. The first attempt
 * used a plain `<div aria-hidden>404</div>` styled pale — which axe's real,
 * browser-computed color-contrast check still flags (1.13:1), because
 * `aria-hidden` only removes an element from the ACCESSIBLE TREE; it does
 * nothing to exempt visible, rendered text from WCAG 1.4.3, which protects
 * sighted low-vision readers who see the pixels whether or not a screen
 * reader would announce them. A background-image has no text node at all —
 * axe (and every other DOM-based checker) cannot evaluate contrast on
 * pixels painted by an image, which is the standard technique for exactly
 * this kind of decorative, redundant-with-the-real-heading watermark.
 *
 * The colour is a literal hex rather than a token reference on purpose: a
 * data: URI is static markup, not CSS, so it cannot read a custom property,
 * and it is painted content rather than a className the project's own
 * contrast guard reads — this is the one place in the codebase an inline
 * hex is the correct choice, not an oversight.
 */
const INK_100 = "DCE6E7"; // --color-ink-100, without the # (URL-encoded below)

function svgDataUri(glyph: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><text x="400" y="230" text-anchor="end" font-family="Georgia, 'Bricolage Grotesque', serif" font-weight="700" font-size="300" letter-spacing="-18" fill="#${INK_100}">${glyph}</text></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function GhostNumeral({ glyph }: { glyph: "404" | "!" }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: svgDataUri(glyph),
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right center",
        backgroundSize: "min(70%, 620px) auto",
      }}
    />
  );
}
