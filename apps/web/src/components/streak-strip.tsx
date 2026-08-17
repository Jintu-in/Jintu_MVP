import Link from "next/link";
import type { StreakSnapshot } from "@/lib/progress";
import { cn } from "@/lib/utils";

/**
 * The 14-day strip — the reason someone opened the app, so it rides sticky
 * at the top of the day page on mobile.
 *
 * One element, role="img", one tab stop: a screen-reader user gets the
 * whole story from the label ("11-day streak, 2 days missed in the last
 * 14") instead of tabbing through fourteen squares. The squares themselves
 * are decorative fills — done filled, missed outlined, today ringed if not
 * yet done.
 *
 * A zero never reads as "0 day streak": lapsed says "Start again today",
 * brand-new says "Day 1 starts when you finish something."
 */
export function StreakStrip({ streak }: { streak: StreakSnapshot }) {
  const missed = streak.last14.filter((d) => !d.done && !d.isToday).length;
  const label =
    streak.currentDays > 0
      ? `${streak.currentDays}-day streak, ${missed} ${missed === 1 ? "day" : "days"} missed in the last 14, ${streak.totalDays} total days`
      : `No current streak, ${streak.totalDays} total days`;

  const headline =
    streak.currentDays > 0
      ? `${streak.currentDays}-day streak`
      : streak.totalDays > 0
        ? "Start again today"
        : "Day 1 starts when you finish something";

  return (
    <div className="sticky top-16 z-40 -mx-5 border-b border-ink-100 bg-white px-5 py-3">
      <Link
        href="/dashboard"
        role="img"
        aria-label={label}
        className="flex items-center justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-medium text-ink-900">
            {streak.currentDays > 0 ? "🔥 " : ""}
            {headline}
          </span>
          {streak.totalDays > 0 ? (
            <span className="block font-mono text-[12px] text-ink-500">
              {streak.totalDays} total {streak.totalDays === 1 ? "day" : "days"} — never resets
            </span>
          ) : null}
        </span>

        <span aria-hidden className="grid shrink-0 grid-cols-14 gap-1">
          {streak.last14.map((d) => (
            <span
              key={d.date}
              className={cn(
                "size-3.5 rounded-[3px] sm:size-4",
                d.done
                  ? "bg-brand-700"
                  : d.isToday
                    ? "border-2 border-brand-700 bg-white"
                    : "border border-ink-200 bg-white",
              )}
            />
          ))}
        </span>
      </Link>
    </div>
  );
}
