"use client";

import type { ReactNode } from "react";
import { BackIcon, BookmarkIcon, TickIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The lesson page's auxiliary states, converted from docs/design
 * "Lesson states.dc.html". Companion library to lesson-page.tsx — one
 * named export per state, no default export. Per the audit brief none of
 * these is a modal: every state is a strip or a card inside the reading
 * column, so the page is never blocked.
 *
 * The design carries no DCLogic; all behaviour arrives as handler props.
 * "use client" because these attach onClick handlers. The single inline
 * style in the file is the progress width — a computed percentage.
 *
 * Colour mapping follows lesson-page.tsx: #8A8A85 never survives as raw
 * text (it becomes ink-500, the preset's measured muted); the skeleton
 * fill #F2F2EF, absent from the palette, renders as ink-100.
 */

/* ── icons the design introduces, geometry verbatim ─────────────────── */

type IconProps = { size?: number; className?: string };

/** The bookmark once saved — same geometry as BookmarkIcon, filled. */
function BookmarkFilledIcon({ size = 17, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5.5 3.5h9v13l-4.5-3.4-4.5 3.4v-13Z" fill="currentColor" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({ size = 13, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
      <path d="m3 3 8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function HighlightPenIcon({ size = 13, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M2.5 9.2 8.4 3.3a1.6 1.6 0 0 1 2.3 2.3L4.8 11.5H2.5V9.2Z" stroke="currentColor" />
    </svg>
  );
}

function NoteLinesIcon({ size = 13, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M2.5 3.5h9M2.5 7h9M2.5 10.5h5.5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

/** A document with a warn-toned slash: the resource whose link died. */
function BrokenLinkDocIcon({ size = 15, className }: IconProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 2.5h5l3 3v8a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5Z" stroke="currentColor" />
      <path d="M9 2.5v3h3" stroke="currentColor" strokeLinecap="round" />
      <path className="text-warn-600" d="m5.6 12.6 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ── 01 · scroll progress ───────────────────────────────────────────── */

export interface ProgressHeaderProps {
  /** Lesson title, e.g. "Frames". */
  title: string;
  /** Mono context line, e.g. "Module 10 · day 45". */
  moduleLabel: string;
  /** The count that updates with the bar, e.g. "2 of 16". */
  countLabel: string;
  /** 0–100. */
  progress: number;
  /** Bookmark fills once saved (the 55% and 95% frames in the design). */
  bookmarked?: boolean;
  onBack?: () => void;
  onBookmark?: () => void;
}

/**
 * The sticky lesson header with its 3px progress bar — the same bar at
 * 10%, 55% and 95% in the design; only `progress`, `countLabel` and
 * `bookmarked` change.
 */
export function ProgressHeader({
  title,
  moduleLabel,
  countLabel,
  progress,
  bookmarked = false,
  onBack,
  onBookmark,
}: ProgressHeaderProps) {
  return (
    <div className="border-b border-ink-100 bg-white">
      <div className="flex h-[52px] items-center px-1">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex size-12 flex-none items-center justify-center text-ink-900"
        >
          <BackIcon />
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pl-0.5">
          <div className="truncate text-[13px] leading-[1.3] text-ink-900">{title}</div>
          <div className="truncate font-mono text-[11px] leading-[1.3] text-ink-500">{moduleLabel}</div>
        </div>
        <div className="px-1 font-mono text-[13px] leading-none text-ink-600">{countLabel}</div>
        <button
          type="button"
          aria-label="Bookmark"
          aria-pressed={bookmarked}
          onClick={onBookmark}
          className="flex size-12 flex-none items-center justify-center text-brand-700"
        >
          {bookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
        </button>
      </div>
      <div className="h-[3px] bg-ink-100">
        {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
        <div
          className="h-[3px] bg-brand-700"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

/* ── 02 · resume, selection, note ───────────────────────────────────── */

export interface ResumeStripProps {
  /** Where the reader stopped, mono, e.g. "12 of 16". */
  stoppedAt: string;
  /** Anchor of the block to jump to, e.g. "#block-12". */
  jumpHref: string;
  onJump?: () => void;
  onDismiss?: () => void;
}

/** Inline, dismissible strip at the top of the reading column — not a modal. */
export function ResumeStrip({ stoppedAt, jumpHref, onJump, onDismiss }: ResumeStripProps) {
  return (
    <div className="flex items-center gap-3 rounded-card bg-brand-50 p-3.5">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] leading-[1.45] text-ink-900">
          You stopped at block <span className="font-mono">{stoppedAt}</span>
        </div>
        {/* Negative margins cancel the padding, so the 48px tap area grows
            without moving the text the design placed 6px below the line. */}
        <a
          href={jumpHref}
          onClick={onJump}
          className="-mx-3.5 -mt-2 -mb-3.5 inline-flex min-h-12 items-center px-3.5 text-[14.5px] leading-[1.4] font-medium text-brand-700 no-underline"
        >
          Jump there →
        </a>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        className="-my-2 -mr-2 flex size-12 flex-none items-center justify-center text-ink-600"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

export interface SelectionStripProps {
  onHighlight: () => void;
  onAddNote: () => void;
  /** The parent positions the strip over the selection (absolute top/left). */
  className?: string;
}

/**
 * The dark popover above a selected sentence: Highlight · Add note, with a
 * caret pointing down at the selection. Positioning belongs to the caller —
 * it knows the selection rect; this renders the strip itself.
 */
export function SelectionStrip({ onHighlight, onAddNote, className }: SelectionStripProps) {
  return (
    <div className={cn("relative inline-flex items-center rounded-lg bg-ink-900", className)}>
      <button
        type="button"
        onClick={onHighlight}
        className="flex min-h-12 items-center gap-[7px] px-3.5 text-[13.5px] text-white"
      >
        <HighlightPenIcon />
        Highlight
      </button>
      <span className="h-[18px] w-px bg-ink-600" />
      <button
        type="button"
        onClick={onAddNote}
        className="flex min-h-12 items-center gap-[7px] px-3.5 text-[13.5px] text-white"
      >
        <NoteLinesIcon />
        Add note
      </button>
      <span
        aria-hidden
        className="absolute top-full left-[26px] h-0 w-0 border-x-[5px] border-t-[5px] border-x-transparent border-t-ink-900"
      />
    </div>
  );
}

export interface SavedNoteCardProps {
  /** The highlighted sentence the note hangs off. */
  excerpt: string;
  /** Mono provenance line, e.g. "day 45 · frames · saved 2 days ago". */
  metaLine: string;
  /** The reader's own words. */
  note: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

/** A saved highlight with its note: excerpt, provenance, edit and delete. */
export function SavedNoteCard({ excerpt, metaLine, note, onEdit, onDelete }: SavedNoteCardProps) {
  return (
    <div>
      <div className="border-l-2 border-brand-700 pl-3.5">
        <p className="m-0 text-[15px] leading-[1.7] text-pretty text-ink-900">{excerpt}</p>
        <div className="mt-2 font-mono text-[12px] leading-none text-ink-500">{metaLine}</div>
      </div>
      <div className="mt-3.5 rounded-card bg-ink-50 p-3.5">
        <div className="mb-2 font-mono text-[11px] leading-none tracking-[.08em] text-ink-500 uppercase">
          Your note
        </div>
        <p className="m-0 text-[15px] leading-[1.7] text-pretty text-ink-600">{note}</p>
      </div>
      <div className="mt-3.5 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="min-h-12 flex-1 rounded-lg border border-ink-100 bg-white text-[15px] font-medium text-brand-700 hover:border-brand-700"
        >
          Edit note
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="min-h-12 flex-1 rounded-lg border border-ink-100 bg-white text-[15px] font-medium text-risk-600 hover:border-risk-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ── 03 · loading, offline, broken link ─────────────────────────────── */

/** One pulsing block shape. The design's #F2F2EF is not in the palette;
 *  ink-100 is the nearest token that stays visible on white. */
const Skel = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn("animate-[jskel_1.4s_ease-in-out_infinite] rounded bg-ink-100", className)}
  />
);

export interface LoadingStateProps {
  /** Mono line naming what loads and its weight, e.g. "loading day 45 · ~180 KB". */
  loadingLine: string;
}

/** Block shapes, no spinner — the page's silhouette while the lesson loads. */
export function LoadingState({ loadingLine }: LoadingStateProps) {
  return (
    <div role="status" className="bg-white">
      {/* Keyframes ported verbatim from the design's jskel animation. */}
      <style>{"@keyframes jskel{0%,100%{opacity:1}50%{opacity:.55}}"}</style>
      <div className="flex h-[52px] items-center border-b border-ink-100 px-4">
        <Skel className="h-3 w-[120px]" />
      </div>
      <div className="h-[3px] bg-ink-100" />
      <div className="flex flex-col gap-[22px] p-5">
        <div className="flex flex-col gap-2.5">
          <Skel className="h-2.5 w-[120px]" />
          <Skel className="h-[22px] w-[220px] rounded-md [animation-delay:0.1s]" />
        </div>
        <div className="flex flex-col gap-[9px]">
          <Skel className="h-[13px] w-full [animation-delay:0.15s]" />
          <Skel className="h-[13px] w-full [animation-delay:0.2s]" />
          <Skel className="h-[13px] w-[64%] [animation-delay:0.25s]" />
        </div>
        <div className="h-[120px] rounded-card border border-ink-100 bg-ink-50" />
        <div className="flex flex-col gap-[9px]">
          <Skel className="h-[13px] w-full [animation-delay:0.3s]" />
          <Skel className="h-[13px] w-[88%] [animation-delay:0.35s]" />
        </div>
        <div className="font-mono text-[12px] leading-[1.6] text-ink-500">{loadingLine}</div>
      </div>
    </div>
  );
}

export interface OfflineSavedItem {
  /** e.g. "Day 45 · Frames" — pass the day number in a mono span. */
  title: ReactNode;
  /** Mono line, e.g. "16 blocks · saved · ~180 KB". */
  metaLine: string;
  href: string;
}

export interface OfflineNoticeProps {
  /** What is actually available on this phone — the named next actions. */
  items: OfflineSavedItem[];
}

/** The offline page: a plain notice and the list of saves that still open. */
export function OfflineNotice({ items }: OfflineNoticeProps) {
  return (
    <div className="bg-white">
      <div className="flex h-[52px] items-center border-b border-ink-100 px-4 text-[13px] leading-[1.3] text-ink-900">
        Jintu
      </div>
      <div className="p-5">
        <div className="rounded-card bg-ink-50 p-4">
          <div className="text-[16px] leading-[1.5] text-ink-900">You are offline.</div>
          <div className="mt-[5px] text-[15px] leading-[1.7] text-ink-600">
            Reads you saved are still here.
          </div>
        </div>
        <div className="mt-4 mb-2.5 font-mono text-[11.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
          Saved on this phone
        </div>
        <div className="overflow-hidden rounded-card border border-ink-100">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="block border-b border-ink-100 p-3.5 no-underline last:border-b-0 hover:bg-ink-50"
            >
              <span className="block text-[15px] leading-[1.4] text-ink-900">{item.title}</span>
              <span className="mt-1 block font-mono text-[12px] leading-none text-ink-500">
                {item.metaLine}
              </span>
            </a>
          ))}
        </div>
        <div className="mt-3.5 font-mono text-[12.5px] leading-[1.6] text-ink-500">
          progress from today syncs when you reconnect
        </div>
      </div>
    </div>
  );
}

export interface DeadLinkNoticeProps {
  /** The resource's title, rendered struck through. */
  title: string;
  /** Mono source line, e.g. "use-the-index-luke.com · 15 min". */
  metaLine: string;
  /** Mono evidence line, e.g. "last reached 9 August · checked daily". */
  lastCheckedLine: string;
  reportHref: string;
  onReport?: () => void;
  /** Reassurance, e.g. "today's lesson does not depend on it". */
  dependencyNote: string;
}

/** A curated link that stopped resolving — honest, evidenced, reportable. */
export function DeadLinkNotice({
  title,
  metaLine,
  lastCheckedLine,
  reportHref,
  onReport,
  dependencyNote,
}: DeadLinkNoticeProps) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex size-8 flex-none items-center justify-center rounded-lg border border-ink-100 bg-ink-50 text-ink-500">
          <BrokenLinkDocIcon />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] leading-[1.45] text-ink-500 line-through">{title}</div>
          <div className="mt-[5px] font-mono text-[12px] leading-normal text-ink-500">{metaLine}</div>
        </div>
      </div>
      <div className="mt-3 border-l-2 border-warn-600 px-3.5 py-0.5">
        <div className="mb-2 font-mono text-[11px] leading-none font-medium tracking-[.08em] text-warn-600 uppercase">
          Link broken
        </div>
        <p className="m-0 text-[15px] leading-[1.7] text-pretty text-ink-900">
          This source stopped responding. A replacement is being chosen by hand.
        </p>
        <div className="mt-2 font-mono text-[12px] leading-[1.6] text-ink-500">{lastCheckedLine}</div>
      </div>
      <div className="mt-3.5 flex items-center gap-2">
        {/* Negative margins keep the 48px tap area from inflating the row. */}
        <a
          href={reportHref}
          onClick={onReport}
          className="-mx-3.5 -my-[17px] inline-flex min-h-12 items-center px-3.5 text-[14px] leading-none text-brand-700 no-underline"
        >
          Report
        </a>
        {/* The design paints this separator in the hairline colour (#E8E8E5
            as text — 1.09:1, invisible); the system's separators are ink-500
            everywhere else, so this one is too. Recorded as a flag. */}
        <span aria-hidden className="text-ink-500">
          ·
        </span>
        <span className="text-[14px] leading-[1.5] text-ink-600">{dependencyNote}</span>
      </div>
    </div>
  );
}

/* ── 04 · end of day ────────────────────────────────────────────────── */

export interface EndOfDayCardProps {
  /** The day just finished, e.g. "45". */
  dayNumber: string;
  /** Yesterday's streak, struck through, e.g. "11". */
  streakFrom: string;
  /** Today's streak, e.g. "12 days". */
  streakTo: string;
  /** e.g. "+35 · 1,275". */
  pointsLine: string;
  /** e.g. "3 cards added". */
  reviewLine: string;
  next: {
    /** e.g. "46". */
    dayNumber: string;
    /** e.g. "LAG and LEAD". */
    title: string;
    /** Mono line, e.g. "55 min · 15 blocks · 35 pts". */
    metaLine: string;
  };
  /** The honest alternative, e.g. "or stop here — 46 of 91 days done". */
  stopLine: string;
  onOpenNext?: () => void;
}

/**
 * Replaces the mark-done button in place after it is pressed — no modal,
 * no confetti. Evidence rows first, then the one next action.
 */
export function EndOfDayCard({
  dayNumber,
  streakFrom,
  streakTo,
  pointsLine,
  reviewLine,
  next,
  stopLine,
  onOpenNext,
}: EndOfDayCardProps) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="flex size-6 items-center justify-center rounded-full bg-check-machine text-white">
          <TickIcon size={13} />
        </span>
        <span className="text-[17px] leading-[1.4] text-ink-900">
          Day <span className="font-mono">{dayNumber}</span> done
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-card border border-ink-100">
        <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-3.5 py-3">
          <span className="text-[14px] leading-[1.4] text-ink-600">Streak</span>
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-[13px] leading-none text-ink-500 line-through">
              {streakFrom}
            </span>
            <span className="font-mono text-[15px] leading-none font-medium text-ink-900">
              {streakTo}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-ink-100 px-3.5 py-3">
          <span className="text-[14px] leading-[1.4] text-ink-600">Points</span>
          <span className="font-mono text-[15px] leading-none font-medium text-ink-900">
            {pointsLine}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 px-3.5 py-3">
          <span className="text-[14px] leading-[1.4] text-ink-600">Review</span>
          <span className="font-mono text-[15px] leading-none font-medium text-ink-900">
            {reviewLine}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-card border border-brand-700 p-4">
        <div className="font-mono text-[11.5px] leading-none tracking-[.06em] text-brand-700 uppercase">
          Next
        </div>
        <div className="mt-2.5 text-[17px] leading-[1.35] font-medium text-ink-900">
          Day <span className="font-mono">{next.dayNumber}</span> · {next.title}
        </div>
        <div className="mt-2 font-mono text-[12.5px] leading-[1.5] text-ink-600">{next.metaLine}</div>
        <button
          type="button"
          onClick={onOpenNext}
          className="mt-3.5 min-h-12 w-full rounded-lg border border-brand-700 bg-brand-700 text-[16px] font-medium text-white hover:bg-brand-800"
        >
          Open day {next.dayNumber} →
        </button>
      </div>
      <div className="mt-3 text-center font-mono text-[12.5px] leading-[1.6] text-ink-500">
        {stopLine}
      </div>
    </div>
  );
}
