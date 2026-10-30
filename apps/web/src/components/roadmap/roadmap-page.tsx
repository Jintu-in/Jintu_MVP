"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusLabel, type RoadmapStatusValue } from "@/components/roadmap/status-label";
import { TickIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The roadmap ("block") page — rebuilt against V2Block.dc.html /
 * DeskBlock.dc.html. Same props as before this rebuild (RoadmapPageProps
 * is unchanged): `[slug]/page.tsx` and roadmap-route.tsx needed no
 * changes at all, only this component's internal JSX.
 *
 * Two real differences from the previous version, both visual rather than
 * data-model changes:
 *
 *   - A circular progress ring (done/total) replaces the linear bar, and
 *     the "Continue" card now leads with it, matching the design exactly.
 *   - The module list is a flat, connected vertical timeline with a
 *     section-divider label per module, not a collapsible accordion. The
 *     design's own divider labels are invented theme names ("Save and
 *     read your work") that do not exist anywhere in the real content
 *     (docs/roadmaps/git-and-github.mjs's actual module titles are
 *     different sentences) — rather than inventing matching labels, each
 *     divider renders the module's own real label and title. Same visual
 *     pattern, real content.
 *
 * Client component: the bandwidth filter needs state. Data arrives as
 * props — the page fetches.
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
  /** The design opens module 01 (the module holding the current day). Kept
   *  on the type for the data layer's sake; unused now that every module
   *  renders expanded (the design's own flat timeline has no collapse). */
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
  status: RoadmapStatusValue;
  reviewedByName?: string | null;
  reviewedByTitle?: string | null;
  reviewedOn?: string | null;
  statChips: RoadmapStatChip[];
  progress: {
    /** e.g. "7 of 91" — mono; also the desktop header count. */
    daysCount: string;
    /** e.g. "8% · 245 pts" — rendered mono. */
    statLine: string;
    /** 0–100, the ring's fill (design: 7.7). */
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
  onContinue?: () => void;
  onFilterChange?: (id: string) => void;
}

const ARROW_RIGHT = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const BACK_ARROW = (
  <svg aria-hidden width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

/**
 * The circular progress ring — radius 26, matching the design's own
 * circumference (2π·26 ≈ 163.36) exactly, so its dasharray literal is
 * reusable rather than recomputed per instance.
 *
 * aria-hidden, not labelled: the lesson count sits right beside it in real
 * text ("Next up · N" plus the stat line below), and a screen reader
 * announcing the same fact twice — once from this ring's own label, once
 * from the text next to it — is the redundant-announcement version of the
 * decorative-bar rule this codebase already uses elsewhere (ProgressRule,
 * patterns.tsx): a number has one place to live, not two.
 */
function ProgressRing({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const filled = Math.max(0, Math.min(100, pct)) * (c / 100);
  return (
    <svg aria-hidden width={64} height={64} viewBox="0 0 64 64" className="flex-none">
      {/* style, not a text-* className: these are decorative stroke
          colours on an aria-hidden ring, and the contrast guard reads
          className strings as text-legibility claims — it cannot tell a
          ring track from a sentence. Same reasoning as homepage.tsx's
          CHECK_TEAL. */}
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--color-ink-100)" strokeWidth="7" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="var(--color-brand-500)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${c}`}
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="37" textAnchor="middle" fontWeight="700" fontSize="15" className="fill-ink-900">
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

export default function RoadmapPage({
  breadcrumb,
  title,
  description,
  status,
  reviewedByName,
  reviewedByTitle,
  reviewedOn,
  statChips,
  progress,
  filter,
  modules,
  footnote,
  onContinue,
  onFilterChange,
}: RoadmapPageProps) {
  const [filterId, setFilterId] = useState(() => filter.options[0]?.id ?? "");
  const filterNote = filter.options.find((o) => o.id === filterId)?.note ?? "";

  return (
    <div className="flex min-w-0 flex-1 flex-col lg:flex-row lg:gap-10 lg:overflow-hidden lg:p-9">
      {/* ── left column: header + progress card ─────────────────────────── */}
      <div className="flex flex-col gap-5 px-5 pt-5 pb-2 lg:w-[400px] lg:flex-none lg:gap-6 lg:px-0 lg:pt-0 lg:pb-0">
        <div className="flex flex-col gap-2.5">
          <Link href="/learn" className="flex min-h-11 w-fit items-center gap-1.5 text-[14.5px] font-semibold text-ink-900">
            {BACK_ARROW}
            <span>{breadcrumb.list}</span>
          </Link>
          <div className="font-mono text-[13px] leading-[1.4] font-semibold text-link">{breadcrumb.category}</div>
          <h1 className="t-page text-ink-900">{title}</h1>
          <StatusLabel
            status={status}
            explain
            reviewedByName={reviewedByName}
            reviewedByTitle={reviewedByTitle}
            reviewedOn={reviewedOn}
          />
          <p className="text-[16px] leading-[1.55] text-pretty text-ink-600 lg:text-[17px]">{description}</p>
          <div className="flex flex-wrap gap-2">
            {statChips.map((c) => (
              <span
                key={c.label}
                className={cn(
                  "flex h-8 items-center rounded-full border border-ink-100 bg-white px-3 font-mono text-[12px] leading-none",
                  c.accent ? "text-link" : "text-ink-700",
                )}
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[24px] bg-white p-5 shadow-[0_1px_2px_rgba(12,42,48,0.06),0_10px_28px_rgba(12,42,48,0.08)]">
          <div className="flex items-center gap-4">
            <ProgressRing pct={progress.pct} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="font-mono text-[12.5px] leading-[1.4] text-ink-500">
                Next up · <span className="font-mono">{progress.continueDayNumber}</span>
              </div>
              <div className="text-[17px] leading-[1.3] font-semibold text-ink-900">{progress.continueTitle}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="flex min-h-13 w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-500 text-[16px] font-semibold text-on-brand hover:bg-brand-400"
          >
            <span>Continue</span>
            {ARROW_RIGHT}
          </button>
          <div className="font-mono text-[12px] leading-[1.5] text-ink-500">
            {progress.daysCount} lessons · <span className="font-mono">{progress.statLine}</span>
          </div>
          <div className="font-mono text-[12px] leading-[1.5] text-ink-500">{progress.lastOpenedLine}</div>
        </div>

        {/* bandwidth chips — a data filter with a real consequence in MB */}
        <div className="hidden lg:block">
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
                    "min-h-11 rounded-2xl border px-3.5 text-[13.5px]",
                    on ? "border-night-900 bg-night-900 text-white" : "border-ink-200 bg-white text-ink-900",
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          <div className="mt-2.5 font-mono text-[12px] leading-[1.6] text-ink-500">{filterNote}</div>
        </div>
      </div>

      {/* ── right column: the connected lesson timeline ──────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col gap-5 px-5 pt-2 pb-8 lg:overflow-y-auto lg:px-0 lg:pt-0">
        <div className="lg:hidden">
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
                    "min-h-11 rounded-2xl border px-3.5 text-[13.5px]",
                    on ? "border-night-900 bg-night-900 text-white" : "border-ink-200 bg-white text-ink-900",
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          <div className="mt-2.5 font-mono text-[12px] leading-[1.6] text-ink-500">{filterNote}</div>
        </div>

        <div className="flex flex-col">
          {modules.map((m, i) => (
            <ModuleSection key={m.id} module={m} first={i === 0} />
          ))}
        </div>

        <div className="max-w-[66ch] border-t border-ink-100 pt-4 text-[13px] leading-[1.7] text-pretty text-ink-600">
          {footnote}
        </div>
      </div>
    </div>
  );
}

/** One module's section divider, plus its days as connected timeline rows. */
function ModuleSection({ module: m, first }: { module: RoadmapModule; first: boolean }) {
  const days = m.days ?? [];
  return (
    <div className="flex flex-col">
      <div className={cn("flex min-h-9 items-center gap-3.5", !first && "mt-2")}>
        <span className="w-7 flex-none" />
        <span className="font-mono text-[11.5px] leading-4 font-semibold tracking-[.06em] text-ink-500 uppercase">
          {m.label} · {m.title}
        </span>
      </div>
      {days.map((d, i) => (
        <DayRow key={d.id} day={d} isLast={i === days.length - 1} />
      ))}
      {m.deliverable ? (
        <div className="flex gap-3.5 py-2">
          <span className="w-7 flex-none" />
          <div className="min-w-0 flex-1 rounded-card bg-brand-50 p-3.5">
            <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-brand-700 uppercase">
              Module deliverable
            </div>
            <p className="m-0 mt-2 text-[14px] leading-[1.6] text-pretty text-brand-900">{m.deliverable.text}</p>
            <div className="mt-2 font-mono text-[11.5px] leading-none text-brand-900">{m.deliverable.meta}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** One connected timeline row: tick disc (done), teal-ringed disc (next), empty disc (todo). */
function DayRow({ day: d, isLast }: { day: RoadmapDay; isLast: boolean }) {
  const done = d.state === "done";
  const next = d.state === "next";
  return (
    <a href={d.href} className="group relative flex items-stretch gap-3.5 no-underline">
      <span className="relative flex w-7 flex-none flex-col items-center">
        <span className={cn("w-0.5 flex-1", done || next ? "bg-night-900" : "bg-ink-200")} />
        {done ? (
          <span className="z-10 flex size-6 flex-none items-center justify-center rounded-full bg-night-900 text-white">
            <TickIcon size={11} />
          </span>
        ) : next ? (
          <span aria-hidden className="z-10 size-6 flex-none rounded-full bg-brand-500 shadow-[0_0_0_5px_rgba(67,180,200,0.28)]" />
        ) : (
          <span className="z-10 flex size-6 flex-none items-center justify-center rounded-full border-2 border-ink-200 bg-white font-mono text-[10.5px] text-ink-600">
            {d.dayNumber}
          </span>
        )}
        <span className={cn("w-0.5 flex-1", isLast ? "bg-transparent" : done ? "bg-night-900" : "bg-ink-200")} />
      </span>
      <span
        className={cn(
          "my-0.5 min-w-0 flex-1 rounded-2xl px-3.5 py-3",
          next && "bg-white shadow-[0_1px_2px_rgba(12,42,48,0.06),0_8px_20px_rgba(12,42,48,0.08)]",
          !next && "group-hover:bg-ink-50",
        )}
      >
        <span className="flex flex-wrap items-baseline justify-between gap-2">
          <span className={cn("text-[15px] leading-[1.4] font-medium", done ? "text-ink-500" : "text-ink-900")}>
            {d.title}
          </span>
          {next ? (
            <span className="flex h-6 flex-none items-center rounded-xl bg-brand-50 px-2.5 font-mono text-[11px] font-semibold text-link uppercase">
              Next
            </span>
          ) : null}
        </span>
        {d.summary ? (
          <span className={cn("mt-1 block text-[14px] leading-[1.5]", done ? "text-ink-500" : "text-ink-600")}>
            {d.summary}
          </span>
        ) : null}
        {d.meta ? (
          <span className={cn("mt-1.5 block font-mono text-[11.5px] leading-none", done ? "text-ink-500" : "text-ink-600")}>
            {d.meta}
          </span>
        ) : null}
      </span>
    </a>
  );
}
