"use client";

import { BackIcon, TickIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The public profile (/u/handle), converted from docs/design (Public
 * profile frame + the Profile body it imports). One responsive component:
 * the 360 and 1024 frames share the body — the desktop additions are the
 * jintu.in header with its bordered share button and the 720px bordered
 * reading column, both behind lg:.
 *
 * The design's DCLogic only fabricates placeholder squares for the canvas
 * (hint-placeholder-count="371"); in production the grid is data, so it
 * arrives as props and the component holds no state. It is a client
 * component only because back and share are real interactions
 * (navigator.share has no server-rendered equivalent).
 *
 * Hard rule carried over: the contribution grid is ONE element with
 * role="img" and a summary label; its 371 squares are aria-hidden — a map,
 * not 371 tab stops.
 */

export type GridLevel = 0 | 1 | 2 | 3;

export interface ProfileRoadmapInProgress {
  title: string;
  daysDone: number;
  daysTotal: number;
}

export interface ProfileRoadmapFinished {
  title: string;
  days: number;
  /** Already-formatted date, e.g. "3 April 2026". */
  finishedOn: string;
}

export interface ProfilePageProps {
  name: string;
  /** The public handle as shown, e.g. "/u/priya". */
  handle: string;
  /** Avatar initials, e.g. "PR". Decorative — the name is beside it. */
  initials: string;
  daysLearned: number;
  currentStreak: number;
  longestStreak: number;
  points: number;
  /** Twelve month labels, oldest first, e.g. ["Sep", …, "Aug"]. */
  monthLabels: string[];
  /**
   * 371 intensity levels (53 weeks × 7 days), column-major and oldest
   * first: 0 = nothing, 1–3 = more days learned that day.
   */
  gridLevels: GridLevel[];
  inProgress: ProfileRoadmapInProgress[];
  finished: ProfileRoadmapFinished[];
  onBack?: () => void;
  onShare?: () => void;
}

/** Share arrow from the design frame, geometry verbatim, currentColor. */
const ShareIcon = ({ size = 17 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path
      d="M9 12V3M9 3 6 6M9 3l3 3M3.5 11v3.5h11V11"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Intensity classes for grid squares and the legend swatches alike. The
 * design's legend steps are 30% / 60% / full on the done green (a fill,
 * so check-machine).
 */
const LEVEL_CLASS: Record<GridLevel, string> = {
  0: "border border-ink-100 bg-ink-50",
  1: "bg-check-machine opacity-30",
  2: "bg-check-machine opacity-60",
  3: "bg-check-machine",
};

export default function ProfilePage({
  name,
  handle,
  initials,
  daysLearned,
  currentStreak,
  longestStreak,
  points,
  monthLabels,
  gridLevels,
  inProgress,
  finished,
  onBack,
  onShare,
}: ProfilePageProps) {
  return (
    <div className="flex h-dvh flex-col bg-white lg:bg-ink-50">
      {/* ── mobile header: back · handle · share ─────────────────────────── */}
      <div className="flex h-[52px] flex-none items-center border-b border-ink-100 bg-white px-1 lg:hidden">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex size-12 items-center justify-center text-ink-900"
        >
          <BackIcon />
        </button>
        <div className="min-w-0 flex-1 font-mono text-[13px] leading-[1.3] text-ink-900">{handle}</div>
        <button
          type="button"
          aria-label="Share profile"
          onClick={onShare}
          className="flex size-12 items-center justify-center text-brand-700"
        >
          <ShareIcon />
        </button>
      </div>

      {/* ── desktop header: jintu.in · handle · share ────────────────────── */}
      <div className="hidden h-14 flex-none items-center gap-4 border-b border-ink-100 bg-white px-[22px] lg:flex">
        <span className="text-[16px] leading-none font-medium text-brand-700">jintu.in</span>
        <div className="font-mono text-[13px] leading-[1.5] text-ink-600">{handle}</div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onShare}
          className="min-h-10 rounded-lg border border-ink-100 bg-white px-3.5 text-[13.5px] text-brand-700 hover:border-brand-700"
        >
          Share profile
        </button>
      </div>

      {/* ── the scrolling body ───────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="mx-auto max-w-[720px] lg:pb-10">
          <div className="min-h-full bg-white lg:border-x lg:border-ink-100">
            {/* identity */}
            <div className="flex items-center gap-3.5 px-5 pt-[22px]">
              <div
                aria-hidden
                className="flex size-14 flex-none items-center justify-center rounded-card bg-brand-50 font-mono text-[20px] font-medium text-brand-700"
              >
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-[20px] leading-[1.3] font-medium text-ink-900">{name}</div>
                <div className="mt-1 font-mono text-[14px] leading-[1.4] text-ink-600">{handle}</div>
              </div>
            </div>

            {/* the four counted numbers */}
            <div className="grid grid-cols-2 gap-2 px-5 pt-5">
              {(
                [
                  [daysLearned, "days learned"],
                  [currentStreak, "current streak"],
                  [longestStreak, "longest streak"],
                  [points.toLocaleString("en-US"), "points"],
                ] as const
              ).map(([value, label]) => (
                <div key={label} className="rounded-card border border-ink-100 p-3.5">
                  <div className="font-mono text-[22px] leading-[1.1] font-medium text-ink-900">{value}</div>
                  <div className="mt-1.5 text-[12.5px] leading-[1.4] text-ink-500">{label}</div>
                </div>
              ))}
            </div>

            {/* contribution grid — a map, not 371 tab stops */}
            <div className="px-5 pt-6">
              <div className="mb-2.5 flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
                  Last 12 months
                </span>
                <span className="font-mono text-[12px] leading-none text-ink-500">{daysLearned} days</span>
              </div>
              <div className="rounded-card border border-ink-100 px-3 py-3.5">
                <div className="mb-[7px] grid grid-cols-12">
                  {monthLabels.map((m) => (
                    <span key={m} className="font-mono text-[10px] leading-none text-ink-500">
                      {m}
                    </span>
                  ))}
                </div>
                <div
                  role="img"
                  aria-label={`Contribution grid: ${daysLearned} days learned in the last 12 months, longest run ${longestStreak} days`}
                  className="grid auto-cols-fr grid-flow-col grid-rows-7 gap-0.5"
                >
                  {gridLevels.map((level, i) => (
                    <div key={i} aria-hidden className={cn("aspect-square rounded-[2px]", LEVEL_CLASS[level])} />
                  ))}
                </div>
                <div className="mt-2.5 flex items-center justify-end gap-1.5">
                  <span className="font-mono text-[10.5px] leading-none text-ink-500">less</span>
                  {([0, 1, 2, 3] as const).map((level) => (
                    <span key={level} className={cn("size-2.5 rounded-[2px]", LEVEL_CLASS[level])} />
                  ))}
                  <span className="font-mono text-[10.5px] leading-none text-ink-500">more</span>
                </div>
              </div>
            </div>

            {/* in progress */}
            {inProgress.length > 0 ? (
              <div className="px-5 pt-6">
                <div className="mb-2.5 font-mono text-[11.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
                  In progress
                </div>
                <div className="divide-y divide-ink-100 overflow-hidden rounded-card border border-ink-100">
                  {inProgress.map((r) => (
                    <div key={r.title} className="p-3.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[15px] leading-[1.4] text-ink-900">{r.title}</span>
                        <span className="font-mono text-[12px] leading-none text-ink-600">
                          {r.daysDone} of {r.daysTotal} days
                        </span>
                      </div>
                      <div className="mt-2.5 h-[3px] rounded-[2px] bg-ink-100">
                        {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
                        <div
                          className="h-[3px] rounded-[2px] bg-check-machine"
                          style={{ width: `${Math.round((r.daysDone / r.daysTotal) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* finished */}
            {finished.length > 0 ? (
              <div className="px-5 pt-6">
                <div className="mb-2.5 font-mono text-[11.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
                  Finished
                </div>
                <div className="divide-y divide-ink-100 overflow-hidden rounded-card border border-ink-100">
                  {finished.map((r) => (
                    <div key={r.title} className="flex items-center gap-3 p-3.5">
                      <span className="flex size-5 flex-none items-center justify-center rounded-full bg-check-machine">
                        <TickIcon className="text-white" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] leading-[1.4] text-ink-900">{r.title}</span>
                        <span className="mt-1 block font-mono text-[12px] leading-none text-ink-500">
                          {r.days} days · finished {r.finishedOn}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* footer: what the numbers are, and are not */}
            <div className="px-5 pt-6 pb-8">
              <div className="max-w-[66ch] border-t border-ink-100 pt-4 text-[13px] leading-[1.7] text-pretty text-ink-600">
                Days learned are counted, not self-reported. Jintu does not certify skills.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
