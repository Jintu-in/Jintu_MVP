/**
 * The colour and glyph each category wears, everywhere it appears.
 *
 * Pinned to the subject rather than to a grid position, so Marketing is the
 * same colour on the homepage, in the catalogue, and wherever a card lands in
 * a filtered list. A colour that moves when you filter is decoration; one that
 * holds is information.
 *
 * All four are large flat fills, which is the one thing the pale end of the
 * brand ramp is allowed to be. The glyph flips to ink on the two pale accents.
 */
export type CategoryKey = "data" | "software" | "marketing" | "judgement";

export const CATEGORY_ACCENT: Record<
  CategoryKey,
  { bg: string; dark: boolean; glyph: string }
> = {
  data: { bg: "bg-brand-700", dark: true, glyph: "M4 20V12M10 20V6M16 20V14M22 20V9" },
  software: { bg: "bg-brand-600", dark: true, glyph: "M8 6 3 12l5 6M16 6l5 6-5 6" },
  marketing: { bg: "bg-brand-400", dark: false, glyph: "M3 10v4h3l6 4V6L6 10Z" },
  judgement: { bg: "bg-brand-300", dark: false, glyph: "M15 9l-2 6-6 2 2-6Z" },
};
