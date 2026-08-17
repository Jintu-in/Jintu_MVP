import { TickIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The streak card, converted from docs/design (Streak states). The design
 * file shows four cards — done today, not yet today, broken, brand new —
 * but they are ONE component: which reading renders is decided entirely by
 * the data (daysLearned, doneToday, broken), never by a variant enum.
 *
 * Hard rules carried over from the audit brief:
 * - A broken streak reads "Streak restarted", never a zero, and the copy
 *   names the break → protects the total → offers the next step, in that
 *   order. The component owns that copy so a caller cannot break the rule.
 * - A brand-new streak renders no number at all, never "0 day streak".
 * - The 14-day strip is ONE element with role="img" and a summary label;
 *   the squares are aria-hidden decoration, not fourteen tab stops.
 *
 * Server component: the only action is opening a day, which is navigation,
 * so the call-to-action is an anchor styled as the design's button.
 */

export interface StreakDay {
  /**
   * How the day renders in the strip: done (green tick), missed (numbered,
   * and risk-bordered while the streak is broken), today (open outline),
   * or empty (brand-new, nothing counted).
   */
  state: "done" | "missed" | "today" | "empty";
  /** Day-of-month label shown on a missed square (the design shows 4, 5, 15, 16). */
  day?: number;
}

export interface StreakCardProps {
  /** Length of the current run — the heading number while the streak is live. */
  streakDays: number;
  /**
   * Lifetime days learned, the number that never resets. It is stated on
   * every state including the broken one. 0 means brand-new, and then no
   * number renders anywhere on the card.
   */
  daysLearned: number;
  /** True once today's day is finished. */
  doneToday: boolean;
  /** Present when the last run just ended. Forces the "Streak restarted" reading. */
  broken?: { missedDays: number };
  /** The last 14 days, oldest first. */
  days: StreakDay[];
  /** The roadmap day the card points at — the one finished today, or the next to open. */
  dayNumber: number;
  /** Where the call-to-action navigates. */
  dayHref: string;
  /** Mono meta line under the button (e.g. "day 12 · dates and times · 60 min"). */
  metaLine?: string;
}

/**
 * The flame — the one purely decorative icon in the system (audit brief);
 * the mono number carries the meaning. Geometry verbatim from the design;
 * colour comes from the token class at the use site.
 */
const FlameIcon = ({ lit }: { lit: boolean }) => (
  <svg aria-hidden width={20} height={20} viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2.5c.6 2.4-.3 3.6-1.6 4.9C6.7 9 5 10.4 5 12.6a5 5 0 0 0 10 0c0-1.9-.9-3.2-1.8-4.3-.5 1-1.2 1.5-1.9 1.7.5-2.3.1-5-1.3-7.5Z"
      {...(lit ? { fill: "currentColor" } : { stroke: "currentColor", strokeWidth: 1.2 })}
    />
  </svg>
);

/** One strip square. Decoration only — the strip's role="img" label speaks for all 14. */
const Square = ({ day, risk }: { day: StreakDay; risk: boolean }) => {
  switch (day.state) {
    case "done":
      return (
        <div aria-hidden className="flex aspect-square items-center justify-center rounded-md bg-check-machine">
          <TickIcon size={12} className="text-white" />
        </div>
      );
    case "today":
      return <div aria-hidden className="aspect-square rounded-md border-[1.5px] border-brand-700 bg-brand-50" />;
    case "missed":
      return (
        <div
          aria-hidden
          className={cn(
            "flex aspect-square items-center justify-center rounded-md border bg-ink-50 font-mono text-[11px] text-ink-500",
            risk ? "border-risk-600" : "border-ink-100",
          )}
        >
          {day.day}
        </div>
      );
    case "empty":
      return <div aria-hidden className="aspect-square rounded-md border border-ink-100 bg-ink-50" />;
  }
};

export default function StreakCard({
  streakDays,
  daysLearned,
  doneToday,
  broken,
  days,
  dayNumber,
  dayHref,
  metaLine,
}: StreakCardProps) {
  // The four readings, derived from data. Precedence: nothing counted yet
  // beats everything; a break beats today's tick; then done vs not yet.
  const brandNew = daysLearned === 0;
  const restarted = !brandNew && broken !== undefined;
  const live = !brandNew && !restarted;
  const missedInStrip = days.filter((d) => d.state === "missed").length;

  const stripLabel = brandNew
    ? "No days learned yet"
    : restarted
      ? `Streak restarted, ${missedInStrip} days missed in the last 14, ${daysLearned} days learned in total`
      : `${streakDays} day streak, ${missedInStrip} days missed in the last 14`;

  return (
    <div className="rounded-card border border-ink-100 bg-white p-5">
      {/* ── header: flame + heading, then the total that never moves ─────── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-[9px]">
          <span className={live ? (doneToday ? "text-check-machine" : "text-brand-700") : "text-ink-500"}>
            <FlameIcon lit={live} />
          </span>
          {brandNew ? (
            // Brand new: a word, not a number — never "0 day streak".
            <span className="text-[15px] leading-[1.4] text-ink-600">Streak</span>
          ) : (
            <span className="font-mono text-[19px] leading-[1.25] font-medium text-ink-900">
              {restarted ? "Streak restarted" : `${streakDays} day streak`}
            </span>
          )}
        </div>
        <div className={cn("text-right text-[13px] leading-[1.5]", brandNew ? "text-ink-500" : "text-ink-600")}>
          {brandNew ? "nothing counted yet" : `${daysLearned} days learned · never resets`}
        </div>
      </div>

      {/* ── the 14-day strip: one image, not fourteen tab stops ──────────── */}
      <div role="img" aria-label={stripLabel} className="mt-4 grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <Square key={i} day={d} risk={restarted} />
        ))}
      </div>

      {/* ── message: names the break → protects the total → next step ────── */}
      {live && doneToday ? (
        <div className="mt-3.5 text-[13px] leading-[1.6] text-ink-600">
          Day {dayNumber} done. Next one is there when you are.
        </div>
      ) : live ? (
        <div className="mt-3.5 text-[15px] leading-[1.6] text-ink-900">Finish a day to keep it going.</div>
      ) : (
        <p className="m-0 mt-3.5 text-[15px] leading-[1.7] text-pretty text-ink-900">
          {restarted && broken
            ? `You missed ${broken.missedDays} days. Your ${daysLearned} days are safe.`
            : "Day 1 starts when you finish something."}
        </p>
      )}

      {live && doneToday ? null : (
        <a
          href={dayHref}
          className="mt-3.5 flex min-h-12 w-full items-center justify-center rounded-lg border border-brand-700 bg-brand-700 text-[16px] font-medium text-white no-underline hover:bg-brand-800"
        >
          {restarted ? "Start again today" : `Open day ${dayNumber}`}
        </a>
      )}

      {metaLine ? <div className="mt-2.5 font-mono text-[12.5px] leading-[1.6] text-ink-500">{metaLine}</div> : null}
    </div>
  );
}
