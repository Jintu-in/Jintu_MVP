"use client";

import { useState } from "react";
import { BackIcon, BookmarkIcon, TickIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The roadmap page, converted from docs/design (Roadmap page + Roadmap
 * body). One responsive component: the 360 and 1024 frames in the design
 * are the same tree — the desktop additions are the breadcrumb header
 * with the mono day count and the 720px bordered column, both behind lg:.
 *
 * Ported DCLogic, verbatim in behaviour: the bandwidth filter (one
 * selected chip restyles and swaps the mono consequence line below) and
 * the module expand/collapse (the design toggles module 01; here every
 * module card carries the same toggle, with the caret's 180° rotation).
 *
 * Colour: hexes map to the preset tokens; #8A8A85 as text renders as
 * text-ink-500 per the conversion rule. Progress fills are #1D9E75 →
 * check-machine, a fill-only token — the bars and tick discs are fills.
 *
 * Client component: the filter and the collapse toggles need state.
 * Data arrives as props — the page fetches.
 */

export interface RoadmapDay {
  id: string;
  href: string;
  /**
   * The design shows done and next; todo (an unstarted day inside an
   * opened module) extrapolates the system's pending treatment — empty
   * ink-100 circle, full-contrast text, no tinted row.
   */
  state: "done" | "next" | "todo";
  /** Numerals only — rendered mono inside "Day n · title". */
  dayNumber: string;
  title: string;
  summary: string;
  /** e.g. "14 blocks · 3 resources · 45 min" — rendered mono. */
  meta: string;
}

export interface RoadmapDeliverable {
  text: string;
  /** e.g. "~3 hrs · 60 pts" — rendered mono. */
  meta: string;
}

export interface RoadmapModule {
  id: string;
  /** e.g. "Module 01 · weeks 1-2" — rendered mono, uppercase. */
  label: string;
  title: string;
  /** e.g. "Spreadsheets · SQL · PostgreSQL" */
  tools: string;
  /** e.g. "7 of 8 days · ~16 hrs" — rendered mono. */
  meta: string;
  /** 0–100; 0 or undefined renders the empty track, as the design does. */
  progressPct?: number;
  /** The design opens module 01 (the module holding the current day). */
  defaultOpen?: boolean;
  days?: RoadmapDay[];
  deliverable?: RoadmapDeliverable;
}

export interface RoadmapStatChip {
  label: string;
  /** The design renders the "free" chip in the interactive teal. */
  accent?: boolean;
}

export interface RoadmapFilterOption {
  id: string;
  label: string;
  /** The mono consequence line shown while this option is selected. */
  note: string;
}

export interface RoadmapPageProps {
  /** e.g. { list: "Roadmaps", category: "Data" } */
  breadcrumb: { list: string; category: string };
  title: string;
  description: string;
  statChips: RoadmapStatChip[];
  progress: {
    /** e.g. "7 of 91" — mono; also the desktop header count. */
    daysCount: string;
    /** e.g. "8% · 245 pts" — rendered mono. */
    statLine: string;
    /** 0–100, the bar width (design: 7.7). */
    pct: number;
    /** Numerals only — the mono day number in the continue label. */
    continueDayNumber: string;
    /** e.g. "Dates and times" */
    continueTitle: string;
    /** e.g. "last opened 2 days ago · ~35 min left in module 01" */
    lastOpenedLine: string;
  };
  filter: {
    /** e.g. "On metered data?" */
    question: string;
    /** First option is the default selection (the design starts on "all"). */
    options: RoadmapFilterOption[];
  };
  modules: RoadmapModule[];
  /** The attribution/points footnote under the module list. */
  footnote: string;
  onBack?: () => void;
  onBookmark?: () => void;
  onContinue?: () => void;
  onFilterChange?: (id: string) => void;
}

/** Collapse caret from the design set — geometry verbatim, stroke currentColor. */
const CaretIcon = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path
      d="M4.5 6.8 9 11.2l4.5-4.4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function RoadmapPage({
  breadcrumb,
  title,
  description,
  statChips,
  progress,
  filter,
  modules,
  footnote,
  onBack,
  onBookmark,
  onContinue,
  onFilterChange,
}: RoadmapPageProps) {
  // Ported from the design's DCLogic: { filter: 'all', m1: true } — the
  // default selection is the first option; open state is per module.
  const [filterId, setFilterId] = useState(() => filter.options[0]?.id ?? "");
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(modules.map((m) => [m.id, Boolean(m.defaultOpen)])),
  );
  const toggleModule = (id: string) =>
    setOpenModules((s) => ({ ...s, [id]: !s[id] }));

  const filterNote = filter.options.find((o) => o.id === filterId)?.note ?? "";

  return (
    <div className="flex h-dvh flex-col bg-white lg:bg-ink-50">
      {/* ── sticky header ────────────────────────────────────────────────── */}
      <div className="flex-none border-b border-ink-100 bg-white">
        <div className="flex h-[52px] items-center px-1 lg:h-14 lg:gap-3 lg:px-5">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="flex size-12 items-center justify-center text-ink-900 lg:size-9"
          >
            <BackIcon />
          </button>
          {/* Mobile: the roadmap title; desktop: breadcrumb + mono count. */}
          <div className="min-w-0 flex-1 truncate pl-0.5 text-[13px] leading-[1.3] text-ink-900 lg:hidden">
            {title}
          </div>
          <div className="hidden min-w-0 flex-1 text-[13px] leading-normal text-ink-600 lg:block">
            {breadcrumb.list} <span className="text-ink-500">/</span> {breadcrumb.category}
          </div>
          <div className="hidden px-1 font-mono text-[13px] leading-none text-ink-600 lg:block">
            {progress.daysCount}
          </div>
          {/* No handler, no button: a dead bookmark is worse than a missing
              one. The design's affordance returns when roadmap saving ships. */}
          {onBookmark ? (
            <button
              type="button"
              aria-label="Bookmark"
              onClick={onBookmark}
              className="flex size-12 items-center justify-center text-brand-700 lg:size-9"
            >
              <BookmarkIcon />
            </button>
          ) : null}
        </div>
      </div>

      {/* ── the scrolling body ───────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[720px] lg:pb-10">
          <div className="min-h-full bg-white lg:border-x lg:border-ink-100">
            {/* header: breadcrumb, title, description, stat chips */}
            <div className="px-5 pt-5">
              <div className="text-[13px] leading-normal text-ink-600">
                {breadcrumb.list} <span className="text-ink-500">/</span> {breadcrumb.category}
              </div>
              <h1 className="mt-2 text-[27px] leading-[1.25] font-medium text-ink-900">{title}</h1>
              <p className="mt-2.5 mb-0 max-w-[66ch] text-[16px] leading-[1.65] text-pretty text-ink-600">
                {description}
              </p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {statChips.map((c) => (
                  <span
                    key={c.label}
                    className={cn(
                      "rounded-lg border border-ink-100 px-2.5 py-2 font-mono text-[12.5px] leading-none",
                      c.accent ? "text-brand-700" : "text-ink-600",
                    )}
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            </div>

            {/* progress card — the Continue button is the screen's one primary action */}
            <div className="px-5 pt-5">
              <div className="rounded-card border border-ink-100 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-[15px] leading-[1.4] text-ink-900">
                    <span className="font-mono">{progress.daysCount}</span> days
                  </div>
                  <div className="font-mono text-[12.5px] leading-none text-ink-500">
                    {progress.statLine}
                  </div>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-[2px] bg-ink-100">
                  {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
                  <div className="h-1 bg-check-machine" style={{ width: `${progress.pct}%` }} />
                </div>
                <button
                  type="button"
                  onClick={onContinue}
                  className="mt-4 flex min-h-12 w-full items-center justify-center rounded-lg border border-brand-700 bg-brand-700 px-3.5 text-[16px] font-medium text-white hover:bg-brand-800"
                >
                  Continue — Day <span className="font-mono">{progress.continueDayNumber}</span> ·{" "}
                  {progress.continueTitle}
                </button>
                <div className="mt-2.5 font-mono text-[12.5px] leading-[1.6] text-ink-500">
                  {progress.lastOpenedLine}
                </div>
              </div>
            </div>

            {/* bandwidth chips — a data filter with a real consequence in MB */}
            <div className="px-5 pt-[22px]">
              <div className="mb-2.5 text-[13px] leading-[1.4] text-ink-600">{filter.question}</div>
              <div className="flex flex-wrap gap-2">
                {filter.options.map((o) => {
                  const on = o.id === filterId;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setFilterId(o.id);
                        onFilterChange?.(o.id);
                      }}
                      className={cn(
                        "min-h-12 rounded-lg border px-3.5 text-[13.5px]",
                        on
                          ? "border-brand-700 bg-brand-700 text-white"
                          : "border-ink-100 bg-white text-brand-700",
                      )}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2.5 font-mono text-[12.5px] leading-[1.6] text-ink-500">
                {filterNote}
              </div>
            </div>

            {/* module list — linear and collapsible, never a graph */}
            <div className="flex flex-col gap-2.5 px-5 pt-6">
              {modules.map((m) => (
                <ModuleCard
                  key={m.id}
                  module={m}
                  open={Boolean(openModules[m.id])}
                  onToggle={() => toggleModule(m.id)}
                />
              ))}
            </div>

            {/* footnote */}
            <div className="px-5 pt-6 pb-8">
              <div className="max-w-[66ch] border-t border-ink-100 pt-4 text-[13px] leading-[1.7] text-pretty text-ink-600">
                {footnote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** One module: the always-visible header row, plus days + deliverable when open. */
function ModuleCard({
  module: m,
  open,
  onToggle,
}: {
  module: RoadmapModule;
  open: boolean;
  onToggle: () => void;
}) {
  const hasBody = Boolean(m.days?.length || m.deliverable);
  return (
    <div className="overflow-hidden rounded-card border border-ink-100">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left hover:bg-ink-50"
      >
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[11.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
            {m.label}
          </div>
          <div className="mt-2 text-[15.5px] leading-[1.4] font-medium text-ink-900">{m.title}</div>
          <div className="mt-1.5 text-[12px] leading-[1.5] text-ink-500">{m.tools}</div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-[2px] bg-ink-100">
            {m.progressPct ? (
              /* Inline on purpose: a computed percentage is genuinely dynamic. */
              <div className="h-[3px] bg-check-machine" style={{ width: `${m.progressPct}%` }} />
            ) : null}
          </div>
          <div className="mt-2 font-mono text-[12px] leading-none text-ink-600">{m.meta}</div>
        </div>
        <span
          className={cn(
            "-mt-0.5 flex size-6 flex-none items-center justify-center text-ink-600 transition-transform duration-150 ease-in-out",
            open && "rotate-180",
          )}
        >
          <CaretIcon />
        </span>
      </button>

      {open && hasBody ? (
        <div className="border-t border-ink-100">
          {(m.days ?? []).map((d) => (
            <DayRow key={d.id} day={d} />
          ))}
          {m.deliverable ? (
            <div className="p-4">
              <div className="rounded-card bg-brand-50 p-4">
                <div className="mb-2.5 font-mono text-[11px] leading-none font-medium tracking-[.08em] text-brand-700 uppercase">
                  Module deliverable
                </div>
                <p className="m-0 text-[15px] leading-[1.7] text-pretty text-brand-900">
                  {m.deliverable.text}
                </p>
                <div className="mt-3 font-mono text-[12px] leading-none text-brand-900">
                  {m.deliverable.meta}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/** One day link: tick disc (done), teal-ringed disc (next), empty disc (todo). */
function DayRow({ day: d }: { day: RoadmapDay }) {
  const done = d.state === "done";
  const next = d.state === "next";
  return (
    <a
      href={d.href}
      className={cn(
        "flex items-start gap-3 border-b border-ink-100 px-4 py-3.5 no-underline",
        next ? "bg-brand-50 hover:bg-brand-100" : "hover:bg-ink-50",
      )}
    >
      {done ? (
        <span className="mt-0.5 flex size-5 flex-none items-center justify-center rounded-full bg-check-machine text-white">
          <TickIcon />
        </span>
      ) : (
        <span
          className={cn(
            "mt-0.5 size-5 flex-none rounded-full border bg-white",
            next ? "border-brand-700" : "border-ink-100",
          )}
        />
      )}
      <span className="min-w-0 flex-1">
        {next ? (
          <span className="flex flex-wrap items-baseline gap-2">
            <span className="text-[15px] leading-[1.45] font-medium text-ink-900">
              Day <span className="font-mono">{d.dayNumber}</span> · {d.title}
            </span>
            <span className="font-mono text-[11px] leading-none tracking-[.06em] text-brand-700 uppercase">
              next
            </span>
          </span>
        ) : (
          <span
            className={cn(
              "block text-[15px] leading-[1.45]",
              done ? "text-ink-500" : "text-ink-900",
            )}
          >
            Day <span className="font-mono">{d.dayNumber}</span> · {d.title}
          </span>
        )}
        <span
          className={cn(
            "mt-1 block text-[15px] leading-[1.6]",
            done ? "text-ink-500" : "text-ink-600",
          )}
        >
          {d.summary}
        </span>
        <span
          className={cn(
            "mt-[7px] block font-mono text-[12px] leading-none",
            done ? "text-ink-500" : "text-ink-600",
          )}
        >
          {d.meta}
        </span>
      </span>
    </a>
  );
}
