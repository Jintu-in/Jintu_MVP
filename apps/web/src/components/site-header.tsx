"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import { BackIcon, TickIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * One header, five contexts — converted from the Claude Design project
 * "Site header.dc.html".
 *
 * 56px, sticky, never hidden. The progress bar sits ON the header's own
 * bottom edge, in place of the hairline, so the height is identical on
 * every route: a header that grows by 3px when you open a roadmap makes
 * the whole page jump.
 *
 * The context is a discriminated union rather than a pile of optional
 * props, because the five shapes genuinely differ and a component that
 * accepts every combination will eventually render an impossible one.
 *
 * Tokens, not the design's hexes: #17758A → brand-700, #0B0B0B → ink-900,
 * #75746F → ink-500 (the preset's measured muted, 5.12:1 — darker than
 * the design's value), #E8E8E5 → ink-100, #EFFAFC → brand-50,
 * #17505C → brand-900, #1D9E75 → check-machine.
 *
 * The design carries no DCLogic, so the popover's open/close behaviour is
 * defined here rather than ported.
 */

export type HeaderContext =
  /** Home, pricing, anything static. No progress, no centre slot. */
  | { kind: "static" }
  /** The catalogue: a search field on desktop, a search button on mobile. */
  | { kind: "catalogue"; searchHref: Route }
  /** A roadmap: its title and day count, with overall progress. */
  | { kind: "roadmap"; title: string; daysLabel: string; percent: number }
  /** A day: the roadmap links back, the day count is what survives at 360px. */
  | {
      kind: "node";
      roadmapTitle: string;
      roadmapHref: Route;
      dayLabel: string;
      percent: number;
    };

export interface StreakSummary {
  currentDays: number;
  totalDays: number;
  /** Oldest→newest, exactly 14. */
  last14: { date: string; done: boolean }[];
  missedInLast14: number;
  continueLabel: string;
  continueHref: Route;
}

export interface SiteHeaderProps {
  context: HeaderContext;
  /** Null when signed out — the header shows "Sign in" instead. */
  viewer?: { initials: string; streak?: StreakSummary } | null;
  signInHref?: Route;
}

/** The flame. Decorative — the number beside it carries the fact. */
const FlameIcon = ({ size = 13 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2.5c.6 2.4-.3 3.6-1.6 4.9C6.7 9 5 10.4 5 12.6a5 5 0 0 0 10 0c0-1.9-.9-3.2-1.8-4.3-.5 1-1.2 1.5-1.9 1.7.5-2.3.1-5-1.3-7.5Z"
      fill="currentColor"
    />
  </svg>
);

const SearchIcon = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" />
    <path d="m12 12 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * One square in the fourteen-day strip.
 *
 * Split into two components rather than one with a ternary so the white
 * tick's class never shares a region with the pale empty fills — the
 * contrast guard reads class names, not reachability, and it is right to:
 * a combination that is only unreachable by luck is one refactor from
 * being reachable.
 */
function DoneSquare() {
  return (
    <span
      aria-hidden
      className="flex aspect-square items-center justify-center rounded-[5px] bg-check-machine text-white"
    >
      <TickIcon size={10} />
    </span>
  );
}

function EmptySquare({ today }: { today: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "aspect-square rounded-[5px]",
        today ? "border-[1.5px] border-brand-700 bg-brand-50" : "border border-ink-100 bg-ink-50",
      )}
    />
  );
}

/**
 * The streak panel under the chip.
 *
 * Not a modal: it is anchored, it closes on Escape or an outside click, and
 * the page behind it stays readable. The fourteen squares are ONE element
 * with role="img" — nobody tabs through fourteen divs.
 */
function StreakPopover({ streak, onClose }: { streak: StreakSummary; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Your streak"
      className="absolute top-[52px] right-2 z-50 w-[280px] rounded-card border border-ink-100 bg-white p-[18px]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[17px] leading-[1.25] font-medium text-ink-900">
          {streak.currentDays} day streak
        </span>
        <span className="text-[12px] leading-[1.4] text-ink-500">
          {streak.totalDays} days learned
        </span>
      </div>

      <div
        role="img"
        aria-label={`${streak.currentDays} day streak, ${streak.missedInLast14} ${
          streak.missedInLast14 === 1 ? "day" : "days"
        } missed in the last 14`}
        className="mt-3 grid grid-cols-7 gap-1"
      >
        {streak.last14.map((d, i) =>
          d.done ? (
            <DoneSquare key={d.date} />
          ) : (
            <EmptySquare key={d.date} today={i === streak.last14.length - 1} />
          ),
        )}
      </div>

      <Link
        href={streak.continueHref}
        onClick={onClose}
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-lg bg-brand-700 px-3 text-center text-[14.5px] font-medium text-white hover:bg-brand-800"
      >
        {streak.continueLabel}
      </Link>
      <div className="mt-2.5 text-center">
        <Link
          href={"/dashboard" as Route}
          onClick={onClose}
          className="text-[13.5px] text-brand-700 hover:text-brand-800"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function SiteHeader({
  context,
  viewer = null,
  signInHref = "/join" as Route,
}: SiteHeaderProps) {
  const [streakOpen, setStreakOpen] = useState(false);
  const streak = viewer?.streak;
  const percent = context.kind === "roadmap" || context.kind === "node" ? context.percent : null;

  return (
    <header className="sticky top-0 z-40 h-14 flex-none bg-white">
      <div className="relative flex h-14 items-center px-1 sm:px-6">
        {/* ── left: wordmark, or a back chevron on a day page ─────────────── */}
        {context.kind === "node" ? (
          <>
            {/* The control that was missing. On a day page the wordmark earns
                its place less than a way back to the roadmap. */}
            <Link
              href={context.roadmapHref}
              aria-label="Back to roadmap"
              className="flex size-12 flex-none items-center justify-center text-ink-900 sm:hidden"
            >
              <BackIcon />
            </Link>
            <Link
              href="/"
              className="hidden flex-none text-[16px] leading-none font-medium text-brand-700 sm:block"
            >
              jintu
            </Link>
          </>
        ) : (
          <Link
            href="/"
            className="flex-none pl-4 text-[15px] leading-none font-medium text-brand-700 sm:pl-0 sm:text-[16px]"
          >
            jintu
          </Link>
        )}

        {/* ── centre: whatever this route needs to say ────────────────────── */}
        {context.kind === "catalogue" ? (
          <>
            <div className="relative mx-6 hidden max-w-[360px] flex-1 sm:block">
              <span className="pointer-events-none absolute top-[11px] left-3 text-ink-500">
                <SearchIcon size={14} />
              </span>
              <Link
                href={context.searchHref}
                className="flex h-9 w-full items-center rounded-lg border border-ink-100 bg-ink-50 pr-3 pl-[34px] text-[13.5px] text-ink-500 hover:border-ink-200"
              >
                Search roadmaps
              </Link>
            </div>
            <div className="flex-1" />
          </>
        ) : context.kind === "roadmap" ? (
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-2 leading-[1.3]">
            <span className="max-w-full truncate text-[14px] leading-[1.3] text-ink-900">
              {context.title}
            </span>
            <span className="font-mono text-[12px] leading-[1.3] text-ink-500">
              {context.daysLabel}
            </span>
          </div>
        ) : context.kind === "node" ? (
          <div className="flex min-w-0 flex-1 items-baseline gap-1.5 overflow-hidden whitespace-nowrap sm:justify-center">
            {/* The roadmap title is dropped first at 360px — the day count is
                what matters most on the page you are reading. */}
            <Link
              href={context.roadmapHref}
              className="hidden truncate text-[14px] leading-[1.3] text-brand-700 sm:block"
            >
              {context.roadmapTitle}
            </Link>
            <span aria-hidden className="hidden text-ink-500 sm:inline">
              ·
            </span>
            <span className="truncate font-mono text-[12px] leading-[1.3] text-ink-500">
              {context.dayLabel}
            </span>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* ── right: streak, account, or the way in ───────────────────────── */}
        {viewer ? (
          <>
            {streak ? (
              <button
                type="button"
                aria-expanded={streakOpen}
                aria-haspopup="dialog"
                aria-label={`${streak.currentDays} day streak — open streak details`}
                onClick={() => setStreakOpen((s) => !s)}
                className={cn(
                  "ml-1.5 flex h-8 flex-none items-center gap-1.5 rounded-full border border-ink-100 px-2.5 sm:mr-3.5 sm:gap-2 sm:px-3",
                  streakOpen && "bg-brand-50",
                )}
              >
                <span className="text-brand-700">
                  <FlameIcon size={12} />
                </span>
                <span className="font-mono text-[12px] leading-none font-medium text-ink-900 sm:text-[13px]">
                  {streak.currentDays}
                </span>
              </button>
            ) : null}
            <Link
              href={"/profile" as Route}
              aria-label="Account"
              className="flex size-12 flex-none items-center justify-center sm:mr-0 sm:size-auto"
            >
              <span
                aria-hidden
                className="flex size-7 items-center justify-center rounded-full bg-brand-50 font-mono text-[11px] font-medium text-brand-900"
              >
                {viewer.initials}
              </span>
            </Link>
          </>
        ) : (
          <>
            {context.kind === "catalogue" ? (
              <Link
                href={context.searchHref}
                aria-label="Search"
                className="flex size-12 flex-none items-center justify-center text-ink-900 sm:hidden"
              >
                <SearchIcon />
              </Link>
            ) : null}
            <Link
              href={signInHref}
              className="flex-none pr-4 text-[14px] leading-none font-medium text-brand-700 hover:text-brand-800 sm:pr-0"
            >
              Sign in
            </Link>
          </>
        )}

        {streakOpen && streak ? (
          <StreakPopover streak={streak} onClose={() => setStreakOpen(false)} />
        ) : null}

        {/* ── the bottom edge: progress where there is progress, else the
               hairline. Same 3px either way, so the header never resizes. */}
        {percent === null ? (
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-ink-100" />
        ) : (
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-ink-100">
            {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
            <div
              className="h-[3px] bg-ink-900"
              style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
            />
          </div>
        )}
      </div>
    </header>
  );
}
