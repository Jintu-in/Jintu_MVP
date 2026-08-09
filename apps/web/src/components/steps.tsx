import { cn } from "@/lib/utils";

/**
 * The three-segment progress bar across sign-up: number → code → profile.
 *
 * The bars are aria-hidden and the position is stated in text below them. A
 * row of coloured divs tells a screen reader nothing, and "Step 2 of 3" is
 * also the thing a sighted user is trying to work out from the bars.
 */
const TOTAL = 3;

export function Steps({ current, label }: { current: number; label: string }) {
  return (
    <div>
      <div aria-hidden className="flex h-1 gap-2">
        {Array.from({ length: TOTAL }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-full flex-1 rounded-full",
              i < current ? "bg-brand-700" : "bg-ink-200",
            )}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-ink-500">
        Step {current} of {TOTAL} · {label}
      </p>
    </div>
  );
}
