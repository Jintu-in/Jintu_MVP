"use client";

import { useRef, useState } from "react";
import {
  BackIcon,
  BookmarkIcon,
  CcPersonIcon,
  CopyIcon,
  DocFileIcon,
  ExternalIcon,
  EyeIcon,
  PlayCircleIcon,
  TickIcon,
  VideoTileIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The lesson page, converted from docs/design (Day 45 lesson + Lesson body
 * day 45). One responsive component: the 360 and 1024 frames in the design
 * are the same tree — the desktop additions are the left "On this page"
 * rail and the 720px bordered reading column, both behind lg:.
 *
 * Colour: the design's hexes map to the preset tokens; the one value the
 * brief bans (#8A8A85 as text, 3.47:1) renders as text-ink-500 (#706d6e,
 * 5.12:1 — the preset's measured muted). The done treatment drops body
 * text to that muted tone with the design's two stated exemptions: the
 * quote's attribution line and the resource's editorial note keep full
 * contrast, because both are evidence.
 *
 * Client component: the scroll-progress bar, the copy button and the two
 * reveals need state. Data arrives as props — the page fetches.
 */

/** Inline rich text: prose runs and code spans, nothing more. */
export type Rich = { kind: "text" | "code" | "mono"; text: string }[];

export type LessonBlock = { id: string; railTitle: string; done: boolean } & (
  | { kind: "brief"; text: Rich }
  | { kind: "concept"; heading?: string; paragraphs: Rich[] }
  | {
      kind: "code";
      heading?: string;
      code: string;
      note?: Rich;
      copyable?: boolean;
      solution?: Rich[];
    }
  | { kind: "figure"; svg: React.ReactNode; caption: string }
  | {
      kind: "compare";
      heading?: string;
      columns: [string, string];
      rows: { label: string; cells: [Rich, Rich] }[];
    }
  | { kind: "gotcha"; text: Rich }
  | { kind: "note"; text: Rich }
  | { kind: "warning"; text: Rich }
  | { kind: "check"; number: string; question: Rich; answer: Rich[] }
  | {
      kind: "resource";
      resType: "doc" | "video";
      title: string;
      href?: string;
      meta: string;
      status?: string;
      why: string;
      loadLabel?: string;
    }
  | { kind: "quote"; text: Rich; attribution: { name: string; license: string } }
  | { kind: "summary"; lead: string; bullets: string[] }
  | { kind: "challenge"; label: string; text: Rich }
);

export interface LessonPageProps {
  roadmapTitle: string;
  moduleLabel: string;
  title: string;
  dayLabel: string;
  metaLine: string;
  doneOfTotal: string;
  blocks: LessonBlock[];
  footer: {
    markDoneLabel: React.ReactNode;
    saveLabel: string;
    earnsLine: string;
  };
  prev?: { label: React.ReactNode; href: string };
  next?: { label: React.ReactNode; href: string };
  railFooter: string[];
  onBack?: () => void;
  onBookmark?: () => void;
  onMarkDone?: () => void;
  onSaveForLater?: () => void;
  onLoadVideo?: (blockId: string) => void;
}

const RichText = ({ segments, codeClass }: { segments: Rich; codeClass?: string }) => (
  <>
    {segments.map((s, i) =>
      s.kind === "code" ? (
        <code key={i} className={cn("font-mono text-[15px]", codeClass)}>
          {s.text}
        </code>
      ) : s.kind === "mono" ? (
        <span key={i} className="font-mono">{s.text}</span>
      ) : (
        <span key={i}>{s.text}</span>
      ),
    )}
  </>
);

/** The 20px tick inside its 48px tap column, bleeding into the right padding. */
const TickColumn = ({ done }: { done: boolean }) => (
  <div className="-mr-2 flex h-12 w-12 shrink-0 items-start justify-center pt-1">
    {done ? (
      <span className="flex size-5 items-center justify-center rounded-full bg-check-machine text-white">
        <TickIcon />
      </span>
    ) : (
      <span className="size-5 rounded-full border border-ink-100 bg-white" />
    )}
  </div>
);

export default function LessonPage({
  roadmapTitle,
  moduleLabel,
  title,
  dayLabel,
  metaLine,
  doneOfTotal,
  blocks,
  footer,
  prev,
  next,
  railFooter,
  onBack,
  onBookmark,
  onMarkDone,
  onSaveForLater,
  onLoadVideo,
}: LessonPageProps) {
  // Scroll progress — the maths ported from the design's DCLogic verbatim.
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0);
  };

  return (
    <div className="flex h-dvh flex-col bg-white lg:bg-ink-50">
      {/* ── sticky header + progress ─────────────────────────────────────── */}
      <div className="relative z-5 flex-none border-b border-ink-100 bg-white">
        <div className="flex h-[52px] items-center px-1 lg:h-14 lg:gap-2.5 lg:px-5">
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="flex size-12 items-center justify-center text-ink-900 lg:size-9"
          >
            <BackIcon />
          </button>
          {/* Mobile: stacked title; desktop: breadcrumb line. */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 pl-0.5 lg:hidden">
            <div className="truncate text-[13px] leading-[1.3] text-ink-900">{title}</div>
            <div className="font-mono text-[11px] leading-[1.3] text-ink-500">{moduleLabel}</div>
          </div>
          <div className="hidden min-w-0 flex-1 text-[13px] leading-normal text-ink-600 lg:block">
            {roadmapTitle} <span className="text-ink-500">/</span> {moduleLabel}
          </div>
          <div className="px-1 font-mono text-[13px] text-ink-600">{doneOfTotal}</div>
          <button
            type="button"
            aria-label="Bookmark"
            onClick={onBookmark}
            className="flex size-12 items-center justify-center text-brand-700 lg:size-9"
          >
            <BookmarkIcon />
          </button>
        </div>
        <div className="h-[3px] bg-ink-100">
          {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
          <div
            className="h-[3px] bg-brand-700 transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* ── desktop rail: a map, one entry per block ────────────────────── */}
        <nav
          aria-label="On this page"
          className="hidden w-[236px] flex-none overflow-y-auto border-r border-ink-100 bg-ink-50 pt-[22px] pb-10 lg:block"
        >
          <div className="px-5 pb-3 font-mono text-[11px] tracking-[.08em] text-ink-500 uppercase">
            On this page
          </div>
          <div className="flex flex-col">
            {blocks.map((b) => (
              <a
                key={b.id}
                href={`#${b.id}`}
                className="flex min-h-[34px] items-center gap-2.5 px-5 py-1.5 no-underline"
              >
                {b.done ? (
                  <span className="flex size-3.5 flex-none items-center justify-center rounded-full bg-check-machine text-white">
                    <TickIcon size={9} />
                  </span>
                ) : (
                  <span className="size-3.5 flex-none rounded-full border border-ink-100 bg-white" />
                )}
                <span
                  className={cn("text-[13px] leading-[1.4]", b.done ? "text-ink-500" : "text-ink-900")}
                >
                  {b.railTitle}
                </span>
              </a>
            ))}
          </div>
          <div className="mt-4 border-t border-ink-100 px-5 pt-3.5 font-mono text-[12px] leading-[1.7] text-ink-500">
            {railFooter.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </nav>

        {/* ── the scrolling body ──────────────────────────────────────────── */}
        <div ref={scrollRef} onScroll={onScroll} className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[720px] pb-0 lg:pb-10">
            <div className="min-h-full bg-white lg:border-x lg:border-ink-100">
              {/* body header */}
              <div className="px-5 pt-5">
                <div className="text-[13px] leading-normal text-ink-600">
                  {roadmapTitle} <span className="text-ink-500">/</span> {moduleLabel}
                </div>
                <h1 className="mt-2 text-[26px] leading-[1.3] font-medium text-ink-900">{title}</h1>
                <div className="mt-2 font-mono text-[13px] leading-normal text-ink-500">
                  {dayLabel} · {metaLine}
                </div>
              </div>

              {blocks.map((b) => (
                <Block key={b.id} block={b} onLoadVideo={onLoadVideo} />
              ))}

              {/* footer actions */}
              <div className="mt-2 border-t border-ink-100 px-5 pt-2 pb-7">
                <button
                  type="button"
                  onClick={onMarkDone}
                  className="mt-[22px] flex min-h-12 w-full items-center justify-center rounded-lg border border-brand-700 bg-brand-700 text-[16px] font-medium text-white hover:bg-brand-800"
                >
                  {footer.markDoneLabel}
                </button>
                <button
                  type="button"
                  onClick={onSaveForLater}
                  className="mt-2.5 flex min-h-12 w-full items-center justify-center rounded-lg border border-ink-100 bg-white text-[16px] font-medium text-brand-700 hover:border-brand-700"
                >
                  {footer.saveLabel}
                </button>
                <div className="mt-3 text-center font-mono text-[12.5px] leading-[1.6] text-ink-500">
                  {footer.earnsLine}
                </div>
              </div>

              {/* prev / next, named */}
              <div className="flex flex-col border-t border-ink-100">
                {prev ? (
                  <a
                    href={prev.href}
                    className="flex min-h-12 items-center border-b border-ink-100 px-5 py-3.5 text-[14px] leading-normal text-brand-700 no-underline hover:bg-ink-50"
                  >
                    {prev.label}
                  </a>
                ) : null}
                {next ? (
                  <a
                    href={next.href}
                    className="flex min-h-12 items-center justify-end px-5 py-3.5 text-[14px] leading-normal text-brand-700 no-underline hover:bg-ink-50"
                  >
                    {next.label}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** One content block: the shared shell (tick column, spacing) + per-kind body. */
function Block({
  block: b,
  onLoadVideo,
}: {
  block: LessonBlock;
  onLoadVideo?: (blockId: string) => void;
}) {
  // Done drops body text to the muted tone. Headings drop one step too.
  const body = b.done ? "text-ink-500" : "text-ink-900";
  const heading = b.done ? "text-ink-600" : "text-ink-900";
  const codeTone = b.done ? "text-ink-500" : "text-brand-700";

  return (
    <div
      id={b.id}
      className={cn(
        "flex scroll-mt-[60px] items-start gap-2 py-0 pr-2 pl-5",
        b.kind === "brief" ? "py-5" : "pb-[22px]",
      )}
    >
      <div className="min-w-0 max-w-[66ch] flex-1">
        <BlockBody b={b} body={body} heading={heading} codeTone={codeTone} onLoadVideo={onLoadVideo} />
      </div>
      <TickColumn done={b.done} />
    </div>
  );
}

function BlockBody({
  b,
  body,
  heading,
  codeTone,
  onLoadVideo,
}: {
  b: LessonBlock;
  body: string;
  heading: string;
  codeTone: string;
  onLoadVideo?: (blockId: string) => void;
}) {
  const [solOpen, setSolOpen] = useState(false);
  const [qOpen, setQOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  switch (b.kind) {
    case "brief":
      return (
        <p className={cn("m-0 text-[17px] leading-[1.65] text-pretty", body)}>
          <RichText segments={b.text} />
        </p>
      );

    case "concept":
      return (
        <div>
          {b.heading ? (
            <h2 className={cn("mb-2.5 text-[16px] leading-normal font-medium", heading)}>
              {b.heading}
            </h2>
          ) : null}
          {b.paragraphs.map((p, i) => (
            <p
              key={i}
              className={cn(
                "text-[16px] leading-[1.75] text-pretty",
                body,
                i < b.paragraphs.length - 1 ? "mb-3.5" : "mb-0",
              )}
            >
              <RichText segments={p} codeClass={body} />
            </p>
          ))}
        </div>
      );

    case "code": {
      const copy = () => {
        if (navigator.clipboard) navigator.clipboard.writeText(b.code).catch(() => {});
        setCopied(true);
        if (copyTimer.current) clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 1800);
      };
      return (
        <div>
          {b.heading ? (
            <h2 className={cn("mb-3 text-[16px] leading-normal font-medium", heading)}>
              {b.heading}
            </h2>
          ) : null}
          <div className="relative rounded-card border border-ink-100 bg-ink-50 p-3.5">
            {b.copyable ? (
              <button
                type="button"
                aria-label="Copy code"
                onClick={copy}
                className="absolute top-2 right-2 flex size-12 items-center justify-center rounded-lg border border-ink-100 bg-white text-brand-700 hover:border-brand-700"
              >
                <CopyIcon />
              </button>
            ) : (
              <span className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-lg border border-ink-100 bg-white text-ink-500">
                <CopyIcon />
              </span>
            )}
            <pre className={cn("m-0 pr-[52px] font-mono text-[13px] leading-[1.7] whitespace-pre-wrap", body)}>
              {b.code}
            </pre>
          </div>
          {b.copyable ? (
            <div className="mt-3 h-3 font-mono text-[12px] leading-none text-check-machine-ink">
              {copied ? "copied" : ""}
            </div>
          ) : null}
          {b.note ? (
            <div className="mt-3 border-t border-ink-100 pt-3.5">
              <p className={cn("m-0 text-[16px] leading-[1.75] text-pretty", body)}>
                <RichText segments={b.note} codeClass={body} />
              </p>
            </div>
          ) : null}
          {b.solution ? (
            <>
              <button
                type="button"
                onClick={() => setSolOpen((s) => !s)}
                className="mt-2.5 min-h-12 w-full rounded-lg border border-ink-100 bg-white text-[15px] font-medium text-brand-700 hover:border-brand-700"
              >
                {solOpen ? "Hide solution" : "Show solution"}
              </button>
              {solOpen ? (
                <div className="mt-3.5 border-t border-ink-100 pt-3.5">
                  {b.solution.map((p, i) => (
                    <p
                      key={i}
                      className={cn(
                        "text-[16px] leading-[1.75] text-pretty text-ink-900",
                        i < b.solution!.length - 1 ? "mb-3" : "mb-0",
                      )}
                    >
                      <RichText segments={p} codeClass="text-brand-700" />
                    </p>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      );
    }

    case "figure":
      return (
        <div>
          <div className="rounded-card border border-ink-100 bg-ink-50 px-3.5 py-4">{b.svg}</div>
          <p className={cn("mt-2.5 mb-0 text-[13px] leading-[1.6]", body)}>{b.caption}</p>
        </div>
      );

    case "compare":
      // One matrix, two renderings (Lesson blocks §05): stacked cards under
      // lg — each aspect label as a section header, one row per option —
      // and a true <table> from lg up. Same data, no duplication.
      return (
        <div>
          {b.heading ? (
            <h2 className={cn("mb-3 text-[16px] leading-normal font-medium", heading)}>
              {b.heading}
            </h2>
          ) : null}
          {/* stacked, < lg */}
          <div className="overflow-hidden rounded-card border border-ink-100 lg:hidden">
            {b.rows.map((r, ri) => (
              <div key={r.label} className="flex flex-col">
                <div
                  className={cn(
                    "bg-ink-50 px-3 py-2 font-mono text-[11px] leading-[1.4] tracking-[.06em] uppercase",
                    body,
                    ri > 0 && "border-t border-ink-100",
                  )}
                >
                  {r.label}
                </div>
                {r.cells.map((cell, ci) => (
                  <div key={b.columns[ci]} className="border-t border-ink-100 p-3">
                    <div className={cn("mb-[3px] text-[13px] font-medium", body)}>
                      {b.columns[ci]}
                    </div>
                    <div className={cn("text-[16px] leading-[1.75]", body)}>
                      <RichText segments={cell} codeClass={body} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* true table, lg+ */}
          <div className="hidden overflow-hidden rounded-card border border-ink-100 lg:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-ink-50">
                  <th className={cn("px-3.5 py-2.5 text-left font-mono text-[11px] leading-[1.4] font-normal tracking-[.06em] uppercase", b.done ? "text-ink-500" : "text-ink-600")} />
                  {b.columns.map((c) => (
                    <th
                      key={c}
                      className={cn(
                        "px-3.5 py-2.5 text-left font-mono text-[11px] leading-[1.4] font-normal tracking-[.06em] uppercase",
                        b.done ? "text-ink-500" : "text-ink-600",
                      )}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r) => (
                  <tr key={r.label}>
                    <td className={cn("border-t border-ink-100 px-3.5 py-3 text-[14px] leading-[1.6] font-medium", body)}>
                      {r.label}
                    </td>
                    {r.cells.map((cell, ci) => (
                      <td
                        key={b.columns[ci]}
                        className={cn(
                          "border-t border-ink-100 px-3.5 py-3 text-[15px] leading-[1.6]",
                          b.done ? "text-ink-500" : "text-ink-600",
                        )}
                      >
                        <RichText segments={cell} codeClass={body} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "note":
      // The third callout variant (Lesson blocks §06): quiet ink-50 card,
      // no accent border — informational, not cautionary.
      return (
        <div className="rounded-card bg-ink-50 px-4 py-3.5">
          <div
            className={cn(
              "mb-2 font-mono text-[11px] leading-none font-medium tracking-[.08em] uppercase",
              b.done ? "text-ink-500" : "text-ink-600",
            )}
          >
            Note
          </div>
          <p className={cn("m-0 text-[16px] leading-[1.75] text-pretty", body)}>
            <RichText segments={b.text} codeClass={codeTone} />
          </p>
        </div>
      );

    case "gotcha":
      return (
        <div className="rounded-r-card border-l-2 border-brand-700 bg-brand-50 px-4 py-3.5">
          <div className={cn("mb-2 font-mono text-[11px] leading-none font-medium tracking-[.08em] uppercase", body)}>
            Gotcha
          </div>
          <p className={cn("m-0 text-[16px] leading-[1.75] text-pretty", body)}>
            <RichText segments={b.text} codeClass={body} />
          </p>
        </div>
      );

    case "warning":
      return (
        <div className="border-l-2 border-warn-600 px-4 py-0.5">
          <div className="mb-2 font-mono text-[11px] leading-none font-medium tracking-[.08em] text-warn-600 uppercase">
            Warning
          </div>
          <p className={cn("m-0 text-[16px] leading-[1.75] text-pretty", body)}>
            <RichText segments={b.text} codeClass={codeTone} />
          </p>
        </div>
      );

    case "check": {
      // A done check shows its answer inline; a pending one reveals on tap.
      const open = b.done || qOpen;
      return (
        <div
          role={b.done ? undefined : "button"}
          tabIndex={b.done ? undefined : 0}
          onClick={b.done ? undefined : () => setQOpen((s) => !s)}
          onKeyDown={
            b.done
              ? undefined
              : (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setQOpen((s) => !s);
                  }
                }
          }
          className={cn(
            "rounded-card border border-ink-100 p-3.5",
            !b.done && "cursor-pointer hover:border-brand-700",
          )}
        >
          <div className="flex items-start gap-3">
            <span className={cn("flex-none font-mono text-[13px] leading-normal", body)}>
              {b.number}
            </span>
            <p className={cn("m-0 flex-1 text-[16px] leading-[1.75] text-pretty", body)}>
              <RichText segments={b.question} codeClass={codeTone} />
            </p>
            <span
              className={cn(
                "-mt-0.5 -mr-0.5 flex size-6 flex-none items-center justify-center",
                b.done ? "text-ink-500" : "text-brand-700",
              )}
            >
              <EyeIcon />
            </span>
          </div>
          {open ? (
            <div className="mt-3.5 border-t border-ink-100 pt-3.5 pl-[25px]">
              {b.answer.map((p, i) => (
                <p
                  key={i}
                  className={cn(
                    "text-[16px] leading-[1.75] text-pretty",
                    b.done ? "text-ink-500" : "text-ink-600",
                    i < b.answer.length - 1 ? "mb-3" : "mb-0",
                  )}
                >
                  <RichText segments={p} codeClass={body} />
                </p>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    case "resource":
      return (
        <div>
          <div className="flex items-start gap-3">
            <div className="flex size-8 flex-none items-center justify-center rounded-lg border border-ink-100 bg-ink-50 text-ink-500">
              {b.resType === "doc" ? <DocFileIcon /> : <VideoTileIcon />}
            </div>
            <div className="min-w-0 flex-1">
              {b.href ? (
                <a
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "block text-[15px] leading-[1.45] font-medium no-underline",
                    b.done ? "text-ink-600" : "text-ink-900",
                  )}
                >
                  {b.title}{" "}
                  <span className="inline-block translate-y-px">
                    <ExternalIcon className={b.done ? "text-ink-500" : "text-brand-700"} />
                  </span>
                </a>
              ) : (
                <div className={cn("text-[15px] leading-[1.45] font-medium", b.done ? "text-ink-500" : "text-ink-900")}>
                  {b.title}
                </div>
              )}
              <div className="mt-[5px] font-mono text-[12px] leading-normal text-ink-500">
                {b.meta}
              </div>
              {b.status ? (
                <div className="mt-[3px] font-mono text-[12px] leading-normal text-check-machine-ink">
                  {b.status}
                </div>
              ) : null}
            </div>
          </div>
          {/* The editorial note keeps full contrast even when done: evidence. */}
          <div className="mt-3 rounded-lg bg-brand-50 px-3.5 py-3">
            <div className="mb-[7px] font-mono text-[11px] leading-none font-medium tracking-[.08em] text-brand-700 uppercase">
              Why this one
            </div>
            <p className="m-0 text-[13.5px] leading-[1.7] text-pretty text-brand-700 italic">
              {b.why}
            </p>
          </div>
          {b.loadLabel ? (
            <button
              type="button"
              onClick={() => onLoadVideo?.(b.id)}
              className={cn(
                "mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-ink-100 bg-white text-[15px] font-medium",
                b.done ? "text-ink-500" : "text-brand-700 hover:border-brand-700",
              )}
            >
              <PlayCircleIcon />
              {b.loadLabel}
            </button>
          ) : null}
        </div>
      );

    case "quote":
      return (
        <div>
          <blockquote className="m-0 border-l-2 border-ink-100 py-0.5 pl-4">
            <p className={cn("m-0 text-[16px] leading-[1.75] text-pretty", body)}>
              <RichText segments={b.text} codeClass={body} />
            </p>
          </blockquote>
          {/* The attribution line keeps full contrast even when done: evidence. */}
          <div className="mt-3 ml-[18px] flex items-start gap-2.5 rounded-lg border border-ink-100 px-3 py-[11px]">
            <CcPersonIcon className="flex-none text-ink-600" />
            <div className="min-w-0">
              <div className="text-[12px] leading-[1.45] text-ink-900">{b.attribution.name}</div>
              <div className="mt-1">
                <span className="inline-block rounded bg-brand-50 px-[7px] py-[3px] font-mono text-[12px] leading-[1.35] text-brand-700">
                  {b.attribution.license}
                </span>
              </div>
            </div>
          </div>
        </div>
      );

    case "summary":
      return (
        <div className="rounded-card bg-brand-50 p-4">
          <div className="mb-2.5 text-[16px] leading-[1.6] text-brand-900">{b.lead}</div>
          <div className="flex flex-col gap-[9px]">
            {b.bullets.map((line) => (
              <div key={line} className="flex gap-[9px]">
                <span className="text-[16px] leading-[1.6] text-brand-900">·</span>
                <span className="text-[16px] leading-[1.75] text-brand-900">{line}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "challenge":
      return (
        <div className="rounded-card border border-brand-700 bg-white p-4">
          <div className="mb-2.5 font-mono text-[11px] leading-none font-medium tracking-[.08em] text-brand-700 uppercase">
            {b.label}
          </div>
          <p className="m-0 text-[16px] leading-[1.75] text-pretty text-ink-900">
            <RichText segments={b.text} codeClass="text-brand-700" />
          </p>
        </div>
      );
  }
}
