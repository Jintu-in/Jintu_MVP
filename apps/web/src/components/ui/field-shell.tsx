import { cn } from "@/lib/utils";

/**
 * The box a single-line field lives in: border, height, padding, and a focus
 * ring that paints outside the box so nothing reflows.
 *
 * Extracted because the catalogue sidebar stacks two of these — search, and
 * "not here yet?" — and when they were built separately they did not match.
 * One was a bordered flex row and the other a bare input above a button, so
 * the second one read as a second search bar rather than as a footnote.
 *
 * The border stays 1px in every state. A field that swaps 1px for 2px on
 * focus reflows by a pixel each time, and the field appears to twitch as you
 * tab through it.
 */
export function FieldShell({
  focused,
  scale = "regular",
  className,
  children,
}: {
  focused?: boolean;
  scale?: "regular" | "compact";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-ink-100 bg-white",
        scale === "compact" ? "h-9 pr-1 pl-2.5" : "h-12 pr-1.5 pl-3.5",
        focused && "border-ink-900 ring-1 ring-ink-900",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The input inside a FieldShell. Transparent — the shell owns the chrome.
 *
 * The prop is `scale`, not `size`: `size` is already an input attribute (a
 * character count), and intersecting it with a string union quietly collapses
 * the prop to `never`.
 */
export function FieldInput({
  scale = "regular",
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { scale?: "regular" | "compact" }) {
  return (
    <input
      {...props}
      className={cn(
        "min-w-0 flex-1 bg-transparent text-ink-900 placeholder:text-ink-500 focus:outline-none",
        scale === "compact" ? "text-[12.5px]" : "text-[14px]",
        className,
      )}
    />
  );
}
