import { cn } from "@/lib/utils";

/**
 * A small bordered label for a request's state.
 *
 * Bordered on white rather than a filled chip, for two reasons. The page is
 * built from hairlines and has no other filled surfaces, so a solid pill would
 * be the loudest thing on it — and a tinted background is a second colour to
 * check against the text sitting on it, where a border is not. Every tone here
 * is a token measured on white: ink-600 at 7.37:1, brand-800 at 7.34:1,
 * ok-800 at 7.58:1.
 *
 * Not colour alone. The label is the information; the colour only says how
 * far along it is, which is exactly the redundancy someone who cannot
 * distinguish the two greens needs.
 */
export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "active" | "done";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-ink-200 bg-white px-2.5 py-0.5 text-[12px] font-medium tracking-wide",
        tone === "done" && "border-ok-800/25 text-ok-800",
        tone === "active" && "border-brand-700/30 text-brand-800",
        tone === "neutral" && "text-ink-600",
      )}
    >
      {children}
    </span>
  );
}
