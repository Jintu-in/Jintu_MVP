import Link from "next/link";
import type { Route } from "next";
import type { FinishedGroup, WeekCell } from "@/lib/profile-record";
import { cn } from "@/lib/utils";

/**
 * /profile's record half (V2Profile/DeskProfile), restyled against the
 * design: the weeks grid and the "finished in X" lists. Server components
 * — nothing here is interactive (the share flow lives in profile-header.tsx,
 * which stays a client component on its own).
 *
 * The grid needs no JS reshaping between breakpoints: lib/profile-record.ts
 * hands back one flat, chronological, Monday-aligned array, and CSS grid's
 * own auto-flow does the rest — `grid-flow-row` (mobile, 7 columns) reads it
 * as one week per row, `grid-flow-col` (desktop, 7 rows) reads the exact
 * same array as one week per column. Same cells, same order, two shapes.
 */

const DONE_CHECK = (
  <svg aria-hidden width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/** `count` of the most recent cells, for the mobile 5-week slice — the
 *  desktop view always shows the full array. */
function WeekCells({ cells }: { cells: WeekCell[] }) {
  return (
    <>
      {cells.map((c) => (
        <span
          key={c.date}
          className={cn(
            "h-[22px] rounded-[7px] lg:h-[22px] lg:rounded-md",
            c.done
              ? "bg-amber-500"
              : c.isToday
                ? "border-2 border-dashed border-amber-600"
                : c.isFuture
                  ? "border border-dashed border-ink-200"
                  : "bg-ink-50",
          )}
        />
      ))}
    </>
  );
}

const WEEKDAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

export function WeeksGrid({ weeks }: { weeks: WeekCell[] }) {
  const last35 = weeks.slice(-35);
  const daysLearnedMobile = last35.filter((c) => c.done).length;
  const label = (cells: WeekCell[]) => {
    const done = cells.filter((c) => c.done);
    if (done.length === 0) return "No days learned yet in this window";
    return `${done.length} days learned: ${done.map((c) => c.date).join(", ")}`;
  };

  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-white p-4 lg:flex-1 lg:gap-4 lg:rounded-[24px] lg:p-7">
      <div className="flex items-baseline justify-between gap-3 lg:hidden">
        <h2 className="m-0 text-[15px] leading-5 font-semibold text-ink-900">Last 5 weeks</h2>
        <div className="text-[12.5px] leading-[18px] text-ink-600">{daysLearnedMobile} days learned</div>
      </div>
      <div className="hidden items-baseline justify-between gap-4 lg:flex">
        <h2 className="t-card m-0 font-semibold text-ink-900">Last 16 weeks</h2>
        <div className="text-[14px] leading-5 text-ink-600">Each square is a day with a lesson</div>
      </div>

      <div
        role="img"
        aria-label={label(last35)}
        className="grid grid-flow-row gap-2 lg:hidden"
        style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
      >
        <WeekCells cells={last35} />
      </div>

      <div className="hidden gap-3 lg:flex">
        <div aria-hidden className="grid grid-rows-7 gap-1.5 font-mono text-[11px] leading-[22px] text-ink-500">
          {WEEKDAY_LETTERS.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
        <div
          role="img"
          aria-label={label(weeks)}
          className="grid flex-1 grid-flow-col gap-1.5"
          style={{ gridTemplateRows: "repeat(7, 22px)", gridAutoColumns: "minmax(0, 1fr)" }}
        >
          <WeekCells cells={weeks} />
        </div>
      </div>

      <div
        aria-hidden
        className="grid grid-flow-row gap-2 font-mono text-[11px] leading-[14px] text-ink-500 lg:hidden"
        style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
      >
        {WEEKDAY_LETTERS.map((l, i) => (
          <span key={i} className="text-center">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

export function FinishedLists({ finished }: { finished: FinishedGroup[] }) {
  return (
    <>
      {finished.map((group) => (
        <div
          key={group.roadmapSlug}
          className="flex flex-col rounded-[20px] bg-white px-4 pt-4 pb-1.5 lg:rounded-[24px] lg:px-6 lg:pt-6 lg:pb-3"
        >
          <h2 className="m-0 mb-1.5 text-[15px] leading-5 font-semibold text-ink-900 lg:t-sub lg:mb-0">
            Finished in {group.roadmapTitle}
          </h2>
          {group.nodes.map((n, i) => (
            <div
              key={i}
              className={cn(
                "flex min-h-11 items-center gap-3 lg:min-h-[46px]",
                i < group.nodes.length - 1 && "border-b border-ink-50",
              )}
            >
              <span
                role="img"
                aria-label="Done"
                className="flex size-[22px] flex-none items-center justify-center rounded-full bg-night-900"
              >
                {DONE_CHECK}
              </span>
              <span className="min-w-0 flex-1 text-[14.5px] leading-5 lg:text-[15px]">{n.title}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export function RecordEmptyState() {
  return (
    <section className="mt-4 flex flex-none flex-col gap-4 rounded-[20px] bg-white p-5 lg:mt-0 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:rounded-[24px] lg:p-7">
      <p className="m-0 text-[16px] leading-6 text-pretty text-ink-600 lg:text-[18px] lg:leading-[27px]">
        Your record starts after you finish your first day.
      </p>
      <Link
        href={"/learn" as Route}
        className="flex h-13 flex-none items-center justify-center gap-2.5 rounded-2xl bg-night-900 text-[15.5px] font-semibold text-on-night no-underline hover:bg-night-950"
      >
        <span>Open a roadmap</span>
        <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </Link>
    </section>
  );
}
