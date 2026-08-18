/**
 * The learning surfaces — roadmap and lesson — own their whole viewport:
 * the design pages are h-dvh flex columns with their own 52px headers,
 * back buttons and internal scroll. Wrapping them in the marketing
 * header/footer would double the chrome and break the internal scroll
 * maths, so this group's layout is deliberately bare.
 */
export default function LearningLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
