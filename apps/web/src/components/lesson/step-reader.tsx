"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import type { Panel } from "@jintu/contracts";
import { submitHelpRequest } from "@/actions/help";
import { BackIcon, CopyIcon, DocFileIcon, EyeIcon, ExternalIcon, PlayCircleIcon, VideoTileIcon } from "@/components/ui/icons";
import { VideoFacade } from "@/components/video-facade";
import type { LessonStep, Rich, TerminalLine } from "@/lib/steps";
import { cn } from "@/lib/utils";

/** The seven authored kinds (V2Step/V2Turn + the five Uni* kinds) are the
 *  ones whose mockups draw a "Stuck? Tell us what you see" box — the six
 *  generic kinds (concept/topics/resource/challenge/check/gotcha) keep
 *  their existing look, unchanged. */
const HELP_ELIGIBLE: ReadonlySet<LessonStep["kind"]> = new Set([
  "command",
  "turnRich",
  "choose",
  "find",
  "formula",
  "number",
  "write",
]);

/**
 * One step at a time (V2Step/V2Turn), replacing the old six-section
 * scrolling page. Renders the six generic step kinds Part A's
 * buildLessonSteps() produces (concept/topics/resource/challenge/check/
 * gotcha) plus Part B's seven authored kinds (nodes.steps, migration
 * 0030), not derived from the six generic fields: command and turnRich
 * (V2Step/V2Turn, Git-&-GitHub-specific), and the five Uni* kinds that
 * generalise the pattern — choose (UniChoose), find (UniFind), formula
 * (UniFormula), number (UniNumber), write (UniWrite). All seven are
 * worked examples shown up front, not a deferred reveal like `check`:
 * self-report only, nothing stored or scored (CLAUDE.md: no grading).
 *
 * Phase 5 Part C adds the first of each mockup's pair of secondary
 * buttons — "Stuck? Tell us what you see" (HelpBox, below), free text
 * only, saved to help_requests (migration 0031) for someone to read
 * later. Still absent, on purpose: each Uni* kind's "my result differs"
 * escape and the mockups' richer list matching a wrong output to its own
 * canned fix — that list needs its own authored content (known-wrong
 * outputs + fixes) that doesn't exist on any step yet, and a dead
 * button/empty list is worse than a missing one. One shared HelpBox
 * render site serves both the mobile and desktop layouts below, since
 * they share the same content column.
 *
 * "Your turn" replaces the step counter in the header for a challenge OR
 * turnRich step, matching V2Turn's own header exactly. The five Uni*
 * kinds keep the ordinary step counter, each with its own small kind
 * pill next to the eyebrow (matching their mockups' "Choose"/"Find"/…
 * badge) instead.
 *
 * Desktop (≥1024px, CHANGES.md item 6 — DeskUniChoose/Find/Formula/Write
 * + UniDeskStep): a three-column shell layers on top of the SAME mobile
 * markup below rather than duplicating it — a left step-nav (every step
 * in this lesson, done/current/upcoming) and a right "your work" panel
 * (the five Uni* kinds' own illustration of the scenario — a dot-grid,
 * a running table, a mini spreadsheet, a forecast log) replace the
 * mobile header/progress-bar, which hide at lg. The content column
 * itself keeps its mobile type sizes rather than re-deriving a full
 * desktop scale for all thirteen step kinds: the new capability here is
 * the nav and the panels, and mobile-sized text reads perfectly well at
 * a 680px column width, so that's the scope line for this pass.
 */

const KIND_PILL: Partial<Record<LessonStep["kind"], string>> = {
  choose: "Choose",
  find: "Find",
  formula: "Formula",
  number: "Number",
  write: "Write",
};

const ARROW_RIGHT = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

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

export interface StepReaderProps {
  roadmapTitle: string;
  moduleLabel: string;
  /** For the help box's submission only — which lesson this step belongs
   *  to. Not used for anything else here. */
  nodeId: string;
  /** Every step in this lesson, not just the current one — Part A/B's
   *  mobile view only ever needed the one at stepIndex; the desktop nav
   *  (below) needs the whole list to render done/current/upcoming. */
  steps: LessonStep[];
  stepIndex: number;
  total: number;
  /** Furthest index reached so far — lights more of the bar than "current"
   *  alone when the reader is reviewing an earlier step. */
  furthest: number;
  step: LessonStep;
  /** This lesson's total estimated minutes — the desktop nav's own footer
   *  ("This lesson · about N min"), mobile has no equivalent. */
  estMinutes: number;
  onBack: () => void;
  onPrev?: () => void;
  onContinue: () => void;
  /** Desktop nav only — jump to an already-reached step. Mobile has no
   *  equivalent control; stepping is still strictly sequential there. */
  onJump: (index: number) => void;
  continuing?: boolean;
  /** Set only on the last step, when finishing failed — named, inline,
   *  same discipline as the old page's footer.failure (never a toast). */
  error?: string;
}

export function StepReader({
  roadmapTitle,
  moduleLabel,
  nodeId,
  steps,
  stepIndex,
  total,
  furthest,
  step,
  estMinutes,
  onBack,
  onPrev,
  onContinue,
  onJump,
  continuing,
  error,
}: StepReaderProps) {
  const panel = "panel" in step ? step.panel : undefined;

  return (
    // min-h-dvh pins the mobile sticky footer near the bottom of a short
    // step, same as before — but only below lg. At lg+, this already sits
    // inside the site's own header/footer as an ordinary document (see
    // apps/web/src/app/(learning)/layout.tsx: "the reader ... used to own
    // the whole viewport ... they are ordinary documents now, and the
    // page scrolls"), so forcing a SECOND full-viewport minimum there
    // would stack two 100dvh boxes and strand the footer below the fold
    // on a short step. lg:min-h-0 lets the three columns size to
    // whichever is tallest instead.
    <div className="flex min-h-dvh flex-col bg-ink-50 lg:min-h-0 lg:flex-row">
      <LessonNav
        roadmapTitle={roadmapTitle}
        moduleLabel={moduleLabel}
        steps={steps}
        stepIndex={stepIndex}
        furthest={furthest}
        estMinutes={estMinutes}
        onBack={onBack}
        onJump={onJump}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:items-center">
        <div className="flex h-16 flex-none items-center gap-3 px-3 pr-5 lg:hidden">
          <button
            type="button"
            aria-label={`Back to ${roadmapTitle}`}
            onClick={onBack}
            className="flex size-11 flex-none items-center justify-center rounded-full bg-white text-ink-900"
          >
            <BackIcon />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] leading-[20px] font-semibold text-ink-900">
              {roadmapTitle}
            </div>
            <div className="truncate text-[12.5px] leading-[18px] text-ink-500">{moduleLabel}</div>
          </div>
          {step.kind === "challenge" || step.kind === "turnRich" ? (
            <span className="flex h-8 flex-none items-center rounded-2xl bg-night-900 px-3 text-[12.5px] font-semibold text-on-night">
              Your turn
            </span>
          ) : (
            <span className="flex h-8 flex-none items-center rounded-2xl bg-white px-3 font-mono text-[12.5px] font-medium text-ink-900">
              {stepIndex + 1} / {total}
            </span>
          )}
        </div>

        <div
          role="img"
          aria-label={`Step ${stepIndex + 1} of ${total}${stepIndex + 1 === total ? ", last step" : ""}`}
          className="flex flex-none gap-1 px-5 lg:hidden"
        >
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-[6px] flex-1 rounded-[3px]",
                i < furthest ? "bg-night-900" : i === furthest ? "bg-brand-500" : "bg-ink-300",
              )}
            />
          ))}
        </div>

        <div className="flex w-full min-w-0 max-w-[680px] flex-1 flex-col gap-4 overflow-y-auto px-5 pt-6 pb-4 lg:px-0 lg:pt-12">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="text-[13px] leading-[18px] font-semibold text-link">
                {step.kind === "turnRich" ? step.timeLabel : `Step ${stepIndex + 1} of ${total}`}
              </div>
              {KIND_PILL[step.kind] ? (
                <span className="flex h-[22px] flex-none items-center rounded-[11px] bg-ink-100 px-[9px] text-[11.5px] font-semibold text-ink-600">
                  {KIND_PILL[step.kind]}
                </span>
              ) : null}
            </div>
            <h1 className="font-heading text-[28px] leading-[32px] font-semibold tracking-[-0.015em] text-ink-900 text-pretty">
              {step.railTitle}
            </h1>
          </div>

          <StepBody step={step} />

          {HELP_ELIGIBLE.has(step.kind) ? (
            <HelpBox key={step.id} nodeId={nodeId} stepContext={step.railTitle} />
          ) : null}

          <div className="flex gap-2.5 lg:mt-1">
            {onPrev ? (
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous step"
                className="hidden h-14 flex-none items-center justify-center rounded-2xl border border-ink-200 px-5 text-ink-900 lg:flex"
              >
                <BackIcon />
              </button>
            ) : null}
            <button
              type="button"
              disabled={continuing}
              onClick={onContinue}
              className="hidden h-14 flex-1 items-center justify-center gap-2.5 rounded-2xl bg-brand-500 text-[16.5px] font-semibold text-on-brand disabled:bg-ink-100 disabled:text-ink-600 lg:flex"
            >
              <span>{continuing ? "Saving…" : ctaLabelFor(step, stepIndex, total)}</span>
              {continuing ? null : ARROW_RIGHT}
            </button>
          </div>
        </div>

        <div className="flex-none border-t border-ink-100 bg-white px-5 pt-3 pb-5 lg:hidden">
          {error ? (
            <p role="alert" className="mb-2.5 text-[14px] leading-[1.5] text-risk-600">
              {error}
            </p>
          ) : null}
          <div className="flex gap-2.5">
            {onPrev ? (
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous step"
                className="flex h-14 flex-none items-center justify-center rounded-2xl border border-ink-200 px-5 text-ink-900"
              >
                <BackIcon />
              </button>
            ) : null}
            <button
              type="button"
              disabled={continuing}
              onClick={onContinue}
              className="flex h-14 flex-1 items-center justify-center gap-2.5 rounded-2xl bg-brand-500 text-[16.5px] font-semibold text-on-brand disabled:bg-ink-100 disabled:text-ink-600"
            >
              <span>{continuing ? "Saving…" : ctaLabelFor(step, stepIndex, total)}</span>
              {continuing ? null : ARROW_RIGHT}
            </button>
          </div>
        </div>
      </div>

      {panel ? <WorkPanel panel={panel} /> : null}
    </div>
  );
}

function ctaLabelFor(step: LessonStep, stepIndex: number, total: number): string {
  if (step.kind === "command") return "I see this";
  if (
    step.kind === "turnRich" ||
    step.kind === "choose" ||
    step.kind === "find" ||
    step.kind === "formula" ||
    step.kind === "number" ||
    step.kind === "write"
  ) {
    return step.ctaLabel;
  }
  return stepIndex + 1 === total ? "Finish" : "Continue";
}

const STEP_GROUPS: { label: string; match: (kind: LessonStep["kind"]) => boolean }[] = [
  {
    label: "Your turn",
    match: (k) => k === "challenge" || k === "turnRich" || k === "choose" || k === "find" || k === "formula" || k === "number" || k === "write",
  },
  { label: "Questions", match: (k) => k === "check" },
  { label: "Go deeper", match: (k) => k === "gotcha" },
];

/**
 * The lesson-specific left nav (not the site's AppShell sidebar — this
 * lesson has its own, matching DeskUniChoose/Find/Formula/Write +
 * UniDeskStep exactly). Every step in the lesson, a done/current/upcoming
 * marker each, and three jump links at the bottom for the first step of
 * each rough category, when this lesson has one. Jumping only ever goes
 * to an already-reached step (index <= furthest) — the reader is still
 * strictly sequential; the nav is a map of where you've been, not a way
 * to skip ahead.
 */
function LessonNav({
  roadmapTitle,
  moduleLabel,
  steps,
  stepIndex,
  furthest,
  estMinutes,
  onBack,
  onJump,
}: {
  roadmapTitle: string;
  moduleLabel: string;
  steps: LessonStep[];
  stepIndex: number;
  furthest: number;
  estMinutes: number;
  onBack: () => void;
  onJump: (index: number) => void;
}) {
  return (
    <nav
      aria-label="Steps in this lesson"
      className="hidden w-72 flex-none flex-col gap-1 bg-night-900 p-4 text-white lg:flex"
    >
      {/* No second "jintu" wordmark here — the site's own SiteNav already
          renders one above this (apps/web/src/app/(learning)/layout.tsx:
          every learning page, this one included, keeps the global header;
          the old fully chromeless reader was retired). This is a back
          control, not a second logo. */}
      <button
        type="button"
        aria-label={`Back to ${roadmapTitle}`}
        onClick={onBack}
        className="mb-1 flex h-10 w-10 flex-none items-center justify-center rounded-14 bg-white/8 text-white"
      >
        <BackIcon />
      </button>
      <div className="flex flex-col gap-0.5 px-2 pt-2 pb-3">
        <div className="truncate text-[13px] leading-[18px] font-medium text-on-night-muted-2">{roadmapTitle}</div>
        <div className="truncate text-[15px] leading-6 font-semibold text-white">{moduleLabel}</div>
      </div>

      <ol className="flex flex-col gap-0.5">
        {steps.map((s, i) => {
          const reached = i <= furthest;
          const isCurrent = i === stepIndex;
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={!reached}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => onJump(i)}
                className={cn(
                  "flex min-h-10 w-full items-center gap-3 rounded-14 px-2 text-left text-[14.5px]",
                  isCurrent ? "bg-white/12 font-semibold text-white" : "text-on-night",
                  !reached && "cursor-default",
                )}
              >
                {i < furthest ? (
                  <span
                    role="img"
                    aria-label="Done"
                    className="flex size-5 flex-none items-center justify-center rounded-full bg-brand-500"
                  >
                    <svg aria-hidden width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#06262C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                ) : (
                  <span
                    className={cn(
                      "flex size-5 flex-none items-center justify-center rounded-full font-mono text-[11px]",
                      isCurrent ? "bg-white text-night-900" : "border border-white/45",
                    )}
                  >
                    {i + 1}
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate">{s.railTitle}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div aria-hidden className="my-2.5 h-px bg-white/14" />
      {STEP_GROUPS.map((g) => {
        const at = steps.findIndex((s) => g.match(s.kind));
        if (at === -1 || at > furthest) return null;
        return (
          <button
            key={g.label}
            type="button"
            onClick={() => onJump(at)}
            className="flex h-10 items-center rounded-14 px-2 pl-10 text-left text-[14.5px] text-on-night"
          >
            {g.label}
          </button>
        );
      })}

      <div className="mt-auto flex flex-col gap-2 rounded-2xl bg-white/8 p-3.5">
        <div className="flex items-center justify-between text-[13px] leading-[18px] text-on-night-muted-2">
          <span>This lesson</span>
          <span className="font-mono text-[12px] leading-[18px]">about {estMinutes} min</span>
        </div>
        <div className="flex gap-1" role="img" aria-label={`${furthest} of ${steps.length} steps done`}>
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "h-[6px] flex-1 rounded-[3px]",
                i < furthest ? "bg-brand-500" : i === furthest ? "bg-white" : "bg-white/20",
              )}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

function StepBody({ step }: { step: LessonStep }) {
  switch (step.kind) {
    case "concept":
      return (
        <div className="flex flex-col gap-3.5">
          {step.paragraphs.map((p, i) => (
            <p key={i} className="m-0 text-pretty text-[16px] leading-[1.75] text-ink-900">
              <RichText segments={p} />
            </p>
          ))}
        </div>
      );

    case "topics":
      return (
        <div className="flex flex-col gap-3.5">
          {step.items.map((t, i) => (
            <div key={t.title} className="flex gap-3">
              <span className="w-6 shrink-0 font-mono text-[12px] leading-[1.7] text-ink-500">
                {`${String(i + 1).padStart(2, "0")} `}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-pretty text-[16px] leading-[1.7] text-ink-900">
                  {t.title}
                </span>
                {t.detail ? (
                  <span className="mt-1 block text-pretty text-[15px] leading-[1.7] text-ink-600">
                    {t.detail}
                  </span>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      );

    case "resource":
      return (
        <div className="rounded-3xl bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-9 flex-none items-center justify-center rounded-xl bg-ink-50 text-ink-600">
              {step.resType === "video" ? <VideoTileIcon /> : <DocFileIcon />}
            </div>
            <div className="min-w-0 flex-1">
              {step.dead ? (
                <div className="text-[15px] leading-[1.45] font-medium text-ink-500 line-through">
                  {step.title}
                </div>
              ) : (
                <a
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[15px] leading-[1.45] font-medium text-ink-900 no-underline"
                >
                  {step.title}{" "}
                  <span className="inline-block translate-y-px">
                    <ExternalIcon className="text-link" />
                  </span>
                </a>
              )}
              <div className="mt-[5px] font-mono text-[12px] leading-normal text-ink-500">{step.meta}</div>
            </div>
          </div>

          {step.dead ? (
            <div className="mt-3 border-l-2 border-warn-600 px-3.5 py-0.5">
              <div className="mb-1.5 font-mono text-[11px] leading-none font-medium tracking-[.08em] text-warn-700 uppercase">
                Link broken
              </div>
              <p className="m-0 text-pretty text-[13.5px] leading-[1.7] text-ink-600">
                This source stopped responding. A replacement is being chosen by hand.
              </p>
              <a href="/report" className="mt-1 inline-flex min-h-12 items-center text-[13.5px] font-medium text-link">
                Report
              </a>
            </div>
          ) : null}

          {step.why ? (
            <div className="mt-3 rounded-2xl bg-brand-50 px-3.5 py-3">
              <div className="mb-[7px] font-mono text-[11px] leading-none font-medium tracking-[.08em] text-brand-700 uppercase">
                Why this one
              </div>
              <p className="m-0 text-pretty text-[13.5px] leading-[1.7] text-brand-700 italic">{step.why}</p>
            </div>
          ) : null}

          {step.video ? (
            <div className="mt-3">
              <VideoFacade
                videoId={step.video.videoId}
                title={step.title}
                durationSec={step.video.durationSec}
                estSizeMb={step.video.estSizeMb}
              />
            </div>
          ) : !step.dead ? (
            <a
              href={step.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-ink-100 bg-white text-[15px] font-medium text-link"
            >
              <PlayCircleIcon />
              Open
            </a>
          ) : null}
        </div>
      );

    case "challenge":
      return (
        <div className="rounded-3xl border-2 border-night-900 bg-white p-4">
          <div className="mb-2.5 font-mono text-[11px] leading-none font-medium tracking-[.08em] text-link uppercase">
            {step.label}
          </div>
          <p className="m-0 text-pretty text-[16px] leading-[1.75] text-ink-900">
            <RichText segments={step.text} codeClass="text-link" />
          </p>
        </div>
      );

    case "command":
      return (
        <div className="flex flex-col gap-3.5">
          <TerminalCard
            promptLabel={step.promptLabel}
            lines={[step.command]}
            outputLabel={step.outputLabel}
            output={step.output}
          />
          {step.note ? (
            <div className="rounded-2xl bg-white p-3.5 text-pretty text-[15px] leading-[1.6] text-ink-900">
              {step.note}
            </div>
          ) : null}
        </div>
      );

    case "turnRich":
      return (
        <div className="flex flex-col gap-3.5">
          {step.body ? (
            <p className="m-0 text-pretty text-[15px] leading-[1.6] text-ink-600">{step.body}</p>
          ) : null}
          {step.startCommands?.length ? (
            <TerminalCard promptLabel="Start with this" lines={step.startCommands} />
          ) : null}
          {step.thenText ? (
            <p className="m-0 text-pretty text-[15px] leading-[1.6] text-ink-900">{step.thenText}</p>
          ) : null}
          <div className="flex flex-col gap-2 rounded-3xl bg-white p-4">
            <div className="text-[13px] leading-[18px] font-semibold text-link">You are done when</div>
            <div className="text-[15px] leading-[1.6] text-ink-900">{step.doneWhenText}</div>
            {step.doneWhenExample?.length ? (
              <div className="flex flex-col gap-0.5 rounded-xl bg-night-950 p-3.5 font-mono text-[12.5px] leading-[20px] text-on-night-muted" style={{ overflowWrap: "anywhere" }}>
                {step.doneWhenExample.map((line, i) => (
                  <div key={i}>{typeof line === "string" ? line : line.text}</div>
                ))}
              </div>
            ) : null}
            {step.doneWhenNote ? (
              <div className="text-[13px] leading-[18px] text-ink-500">{step.doneWhenNote}</div>
            ) : null}
          </div>
        </div>
      );

    case "choose":
      return (
        <div className="flex flex-col gap-3.5">
          <div className="rounded-3xl bg-white p-4">
            <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
              {step.factsLabel}
            </div>
            <div className="mt-2 flex flex-col">
              {step.facts.map((f, i) => (
                <div key={i} className="flex min-h-7 items-baseline justify-between gap-3 text-[15px] leading-[22px]">
                  <span className="text-ink-600">{f.label}</span>
                  <span className="font-mono text-[15px] font-medium text-ink-900">{f.value}</span>
                </div>
              ))}
            </div>
            <div aria-hidden className="my-3.5 h-px bg-ink-100" />
            <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
              {step.promptLabel}
            </div>
            <div role="radiogroup" aria-label={step.railTitle} className="mt-2.5 flex flex-col gap-2">
              {step.options.map((opt, i) => {
                const isCorrect = i === step.correctIndex;
                return (
                  <div
                    key={i}
                    role="radio"
                    aria-checked={isCorrect}
                    className={cn(
                      "flex min-h-[52px] items-center justify-between gap-2.5 rounded-2xl border-2 px-3.5 py-2 text-[15px] leading-[21px] font-medium",
                      isCorrect ? "border-ok-600 bg-ok-bg text-ok-700" : "border-ink-50 bg-ink-50 text-ink-900",
                    )}
                  >
                    <span>{opt}</span>
                    {isCorrect ? <span className="flex-none text-[13px] font-semibold">Right</span> : null}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-3.5 text-pretty text-[15px] leading-[1.6] text-ink-900">
            {step.explanation}
          </div>
          {step.note ? (
            <div className="rounded-2xl bg-white p-3.5 text-pretty text-[15px] leading-[1.6] text-ink-600">
              {step.note}
            </div>
          ) : null}
        </div>
      );

    case "find":
      return (
        <div className="flex flex-col gap-3.5">
          <div className="rounded-3xl bg-white p-4">
            <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
              Open the source
            </div>
            <a
              href={step.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex min-h-[60px] items-center gap-3 rounded-2xl bg-ink-50 px-3.5 py-2 no-underline"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] leading-[17px] text-ink-500">{step.sourceLabel}</span>
                <span className="block text-[15.5px] leading-[21px] font-semibold text-link">{step.sourceTitle}</span>
              </span>
              <ExternalIcon className="flex-none text-link" />
            </a>
            {step.lookUnder?.length ? (
              <>
                <div aria-hidden className="my-3.5 h-px bg-ink-100" />
                <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
                  Look under
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[14.5px] leading-[21px] text-ink-900">
                  {step.lookUnder.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      {i > 0 ? <span aria-hidden className="text-ink-500">{"→"}</span> : null}
                      <span className="rounded-[10px] bg-ink-50 px-2.5 py-1">{crumb}</span>
                    </span>
                  ))}
                </div>
              </>
            ) : null}
            <div aria-hidden className="my-3.5 h-px bg-ink-100" />
            <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
              {step.answerLabel}
            </div>
            <div className="mt-2.5 flex items-center gap-3 rounded-xl bg-brand-50 px-3 py-2.5">
              <span className="flex-none font-mono text-[17px] leading-6 font-semibold text-brand-700">
                {step.answerCode}
              </span>
              <span className="min-w-0 flex-1 text-[14px] leading-5 text-brand-700">{step.answerText}</span>
            </div>
          </div>
          {step.note ? (
            <div className="rounded-2xl bg-white p-3.5 text-pretty text-[15px] leading-[1.6] text-ink-900">
              {step.note}
            </div>
          ) : null}
        </div>
      );

    case "formula":
      return (
        <div className="flex flex-col gap-3.5">
          {step.inputs?.length ? (
            <div className="rounded-3xl bg-white p-4">
              <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
                {step.inputsLabel}
              </div>
              <div className="mt-2 flex flex-col">
                {step.inputs.map((f, i) => (
                  <div key={i} className="flex min-h-7 items-baseline justify-between gap-3 text-[15px] leading-[22px]">
                    <span className="text-ink-600">{f.label}</span>
                    <span className="font-mono text-[15px] font-medium text-ink-900">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <TerminalCard
            promptLabel={step.cellLabel}
            promptGlyph="fx"
            lines={[step.formula]}
            outputLabel={step.resultLabel}
            output={[
              step.resultHighlight
                ? { text: step.resultValue, highlight: step.resultHighlight }
                : step.resultValue,
            ]}
          />
          {step.note ? (
            <div className="rounded-2xl bg-white p-3.5 text-pretty text-[15px] leading-[1.6] text-ink-900">
              {step.note}
            </div>
          ) : null}
        </div>
      );

    case "number":
      return (
        <div className="flex flex-col gap-3.5">
          <div className="rounded-3xl bg-white p-4">
            <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
              {step.factsLabel}
            </div>
            <div className="mt-2 flex flex-col">
              {step.facts.map((f, i) => (
                <div key={i} className="flex min-h-7 items-baseline justify-between gap-3 text-[15px] leading-[22px]">
                  <span className="text-ink-600">{f.label}</span>
                  <span className="font-mono text-[15px] font-medium text-ink-900">{f.value}</span>
                </div>
              ))}
            </div>
            <div aria-hidden className="my-3.5 h-px bg-ink-100" />
            <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
              {step.answersLabel}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2.5">
              {step.answers.map((a, i) => (
                <div
                  key={i}
                  className="flex min-w-[120px] flex-1 flex-col gap-1 rounded-2xl border-2 border-night-900 bg-white px-3 py-2"
                >
                  <span className="text-[13px] leading-[18px] font-semibold text-ink-900">{a.label}</span>
                  <span className="font-mono text-[17px] leading-6 font-medium text-ink-900">{a.value}</span>
                </div>
              ))}
            </div>
            <div aria-hidden className="my-3.5 h-px bg-ink-100" />
            <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
              {step.workingLabel}
            </div>
            <div className="mt-2.5 flex flex-col gap-1.5 font-mono text-[14px] leading-[22px]">
              {step.working.map((line, i) =>
                typeof line === "string" ? (
                  <div key={i} className="text-ink-900">
                    {line}
                  </div>
                ) : (
                  <div key={i} className="flex items-center justify-between gap-2 rounded-lg bg-brand-50 px-2.5 py-1">
                    <span className="text-brand-700">{line.text}</span>
                    {line.highlight ? (
                      <span className="flex-none rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-semibold text-on-brand">
                        {line.highlight}
                      </span>
                    ) : null}
                  </div>
                ),
              )}
            </div>
          </div>
          {step.note ? (
            <div className="rounded-2xl bg-white p-3.5 text-pretty text-[15px] leading-[1.6] text-ink-900">
              {step.note}
            </div>
          ) : null}
        </div>
      );

    case "write":
      return (
        <div className="flex flex-col gap-3.5">
          <div className="rounded-3xl bg-white p-4">
            <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
              Fill the blanks, in your own words
            </div>
            <div className="mt-2 font-mono text-[14.5px] leading-[22px] text-ink-600">{step.template}</div>
            <div className="mt-2.5 rounded-2xl border-2 border-night-900 bg-white p-3.5 text-pretty text-[16px] leading-[1.5] text-ink-900">
              {step.example}
            </div>
            <div aria-hidden className="my-3.5 h-px bg-ink-100" />
            <div className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-500 uppercase">
              A forecast you can check has these parts
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {step.parts.map((p, i) => (
                <div key={i} className="flex min-h-[30px] items-center gap-2.5 text-[14.5px] leading-[21px]">
                  <span aria-hidden className="flex size-[22px] flex-none items-center justify-center rounded-full bg-ok-600">
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#0B4A32" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1 text-ink-900">{p.label}</span>
                  <span className="flex-none font-mono text-[13px] leading-5 font-medium text-link">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
          {step.note ? (
            <div className="rounded-2xl bg-white p-3.5 text-pretty text-[15px] leading-[1.6] text-ink-900">
              {step.note}
            </div>
          ) : null}
        </div>
      );

    case "check":
      return <CheckStep step={step} />;

    case "gotcha":
      return (
        <div className="rounded-r-3xl border-l-2 border-brand-700 bg-brand-50 px-4 py-3.5">
          {step.heading ? (
            <div className="mb-2 font-mono text-[11px] leading-none font-medium tracking-[.08em] text-ink-900 uppercase">
              {step.heading}
            </div>
          ) : null}
          <p className="m-0 text-pretty text-[16px] leading-[1.75] text-ink-900">
            <RichText segments={step.text} />
          </p>
        </div>
      );
  }
}

/**
 * "Stuck? Tell us what you see" (V2Help/DeskHelp) — a free-text report,
 * saved to help_requests for someone to read later. Not the mockup's
 * richer list that matches a wrong output to its own canned fix: that
 * needs its own authored content (known-wrong outputs + fixes) that does
 * not exist on any step yet, and shipping it empty would be a dead UI.
 * The free-text fallback alone is a complete, honest feature on its own;
 * the canned list is additive later, not a breaking change to this box.
 *
 * `key={step.id}` at the call site remounts this fresh on every step, so
 * open/sent/draft-text never leak from one step's box into the next.
 */
function HelpBox({ nodeId, stepContext }: { nodeId: string; stepContext: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const { execute, status } = useAction(submitHelpRequest, {
    onSuccess: () => setSent(true),
  });
  const isExecuting = status === "executing";

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start text-[14.5px] font-semibold text-link"
      >
        Stuck? Tell us what you see
      </button>
    );
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-1 rounded-2xl bg-brand-50 p-4">
        <div className="text-[15px] leading-[1.5] font-semibold text-brand-700">Thanks — we'll look into it.</div>
        <div className="text-[13.5px] leading-[1.5] text-brand-700">
          This doesn't answer right away; someone reads these by hand.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-brand-50 p-4">
      <label htmlFor="help-message" className="text-[15px] leading-[1.4] font-semibold text-brand-700">
        What does your screen show?
      </label>
      <textarea
        id="help-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="Paste what you see, or describe it"
        className="min-h-[76px] rounded-xl border border-ink-100 bg-white p-3 text-[15px] leading-[1.5] text-ink-900"
      />
      <div className="flex justify-end gap-2.5">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex h-11 items-center rounded-xl px-3.5 text-[14px] font-medium text-brand-700"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isExecuting || !message.trim()}
          onClick={() => execute({ nodeId, stepContext, message: message.trim() })}
          className="flex h-11 items-center rounded-xl bg-night-900 px-4 text-[14px] font-semibold text-on-night disabled:bg-ink-100 disabled:text-ink-600"
        >
          {isExecuting ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}

/**
 * The desktop-only "your work" aside (CHANGES.md item 6) — one of the
 * four panel kinds a Uni* step can author, each illustrating that
 * roadmap's own scenario rather than being derived generically from the
 * step's fields. Absent on phone entirely (layout: phone below 1024px,
 * desktop from 1024px) — StepReader only renders this when the current
 * step actually authored a `panel`.
 */
function WorkPanel({ panel }: { panel: Panel }) {
  return (
    <aside
      aria-label="Your work"
      className="hidden w-[380px] flex-none flex-col gap-5 overflow-y-auto border-l border-ink-100 bg-white p-6 lg:flex"
    >
      {panel.kind === "dotGrid" ? (
        <DotGridPanel panel={panel} />
      ) : panel.kind === "tableRows" ? (
        <TableRowsPanel panel={panel} />
      ) : panel.kind === "spreadsheet" ? (
        <SpreadsheetPanel panel={panel} />
      ) : (
        <ForecastLogPanel panel={panel} />
      )}
    </aside>
  );
}

function PanelHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="m-0 font-heading text-[19px] leading-6 font-semibold tracking-[-0.01em] text-ink-900">{title}</h2>
      {subtitle ? <div className="text-[13.5px] leading-5 text-ink-600">{subtitle}</div> : null}
    </div>
  );
}

function PanelNote({ note }: { note?: string }) {
  if (!note) return null;
  return <div className="rounded-2xl bg-ink-50 p-4 text-[14px] leading-[21px] text-ink-600">{note}</div>;
}

/**
 * DeskUniChoose's population view (100 dots, a handful coloured). Dot
 * positions are not hand-authored — the mockup's literal pixel layout
 * would be fragile to type out — the first `dotCount` dots of each
 * legend entry, in order, get that entry's colour; any dots left over
 * after the legend is exhausted fall to the muted colour. Colour comes
 * from legend ORDER (first = the thing being illustrated, second = the
 * "almost" category, further entries muted), not an authored field.
 */
const DOT_COLORS = ["bg-night-900", "bg-warn-600", "bg-ink-200"];

function DotGridPanel({ panel }: { panel: Extract<Panel, { kind: "dotGrid" }> }) {
  const dots: number[] = [];
  panel.legend.forEach((entry, i) => {
    const color = Math.min(i, DOT_COLORS.length - 1);
    for (let n = 0; n < entry.dotCount && dots.length < panel.total; n++) dots.push(color);
  });
  while (dots.length < panel.total) dots.push(DOT_COLORS.length - 1);

  return (
    <>
      <PanelHeading title={panel.title} subtitle={panel.subtitle} />
      <div className="flex flex-col gap-4 rounded-2xl bg-ink-50 p-4">
        <div
          role="img"
          aria-label={panel.legend.map((l) => `${l.value} ${l.label}`).join(". ")}
          className="grid justify-between gap-y-2.5"
          style={{ gridTemplateColumns: "repeat(10, 18px)" }}
        >
          {dots.map((colorIdx, i) => (
            <span key={i} aria-hidden className={cn("size-[18px] rounded-full", DOT_COLORS[colorIdx])} />
          ))}
        </div>
        <div className="flex flex-col">
          {panel.legend.map((l, i) => (
            <div key={i} className="flex min-h-[30px] items-center gap-2.5 text-[14px] leading-5">
              <span aria-hidden className={cn("size-3 flex-none rounded-full", DOT_COLORS[Math.min(i, DOT_COLORS.length - 1)])} />
              <span className="min-w-0 flex-1 text-ink-900">{l.label}</span>
              <span className="flex-none font-mono text-[13px] font-medium text-ink-900">{l.value}</span>
            </div>
          ))}
        </div>
      </div>
      {panel.footnote ? <div className="text-[14px] leading-[21px] text-ink-600">{panel.footnote}</div> : null}
    </>
  );
}

/**
 * DeskUniFind's "your claim" / UniDeskStep's "your cap table" — the same
 * shape (a small running table, one highlighted new row) shared by both
 * rather than two bespoke panel kinds, since the mockups are visually
 * identical once you drop the subject-matter column headers.
 */
function TableRowsPanel({ panel }: { panel: Extract<Panel, { kind: "tableRows" }> }) {
  return (
    <>
      <PanelHeading title={panel.title} subtitle={panel.subtitle} />
      <div className="flex flex-col gap-0.5 rounded-2xl bg-ink-50 p-3">
        <div className="flex gap-2.5 px-3 pb-1.5 font-mono text-[12px] font-semibold tracking-[.06em] text-ink-500 uppercase">
          {panel.columns.map((c, i) => (
            <span key={i} className={i === 0 ? "flex-1" : "w-14 flex-none text-right"}>
              {c}
            </span>
          ))}
        </div>
        {panel.rows.map((r, i) => (
          <div
            key={i}
            className={cn(
              "flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-[14.5px] leading-5",
              r.highlight && "bg-brand-50",
            )}
          >
            {r.cells.map((c, j) =>
              j === 0 ? (
                <span key={j} className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="truncate text-ink-900">{c}</span>
                  {r.badge ? (
                    <span className="flex-none rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-semibold text-on-brand">
                      {r.badge}
                    </span>
                  ) : null}
                </span>
              ) : (
                <span key={j} className="w-14 flex-none text-right font-mono text-[13.5px] text-ink-900">
                  {c}
                </span>
              ),
            )}
          </div>
        ))}
        {panel.totalRow ? (
          <>
            <div aria-hidden className="mx-3 my-1 h-px bg-ink-200" />
            <div className="flex min-h-10 items-center gap-2.5 px-3 text-[14.5px] leading-5">
              {panel.totalRow.map((c, j) => (
                <span key={j} className={j === 0 ? "flex-1 text-ink-900" : "w-14 flex-none text-right font-mono text-[13.5px] text-ink-900"}>
                  {c}
                </span>
              ))}
            </div>
          </>
        ) : null}
      </div>
      <PanelNote note={panel.note} />
    </>
  );
}

/** DeskUniFormula's "your workbook after this step" — a small, real grid
 *  of column/row headers, unlike the main card's TerminalCard re-use,
 *  because the whole point here is seeing the formula's cell in place
 *  among its neighbours. */
function SpreadsheetPanel({ panel }: { panel: Extract<Panel, { kind: "spreadsheet" }> }) {
  return (
    <>
      <PanelHeading title={panel.title} subtitle={panel.subtitle} />
      <div className="flex flex-col overflow-hidden rounded-xl border-t border-l border-ink-100">
        <div className="flex">
          <span className="h-9 w-9 flex-none border-r border-b border-ink-100 bg-ink-50" />
          {panel.columnLabels.map((c, i) => (
            <span
              key={i}
              className="flex h-9 flex-1 items-center justify-center border-r border-b border-ink-100 bg-ink-50 font-mono text-[13px] text-ink-500"
            >
              {c}
            </span>
          ))}
        </div>
        {panel.rows.map((r, ri) => (
          <div key={ri} className="flex">
            <span className="flex h-9 w-9 flex-none items-center justify-center border-r border-b border-ink-100 bg-ink-50 font-mono text-[13px] text-ink-500">
              {r.rowLabel}
            </span>
            {r.cells.map((c, ci) => {
              const isHighlighted = r.highlightCellIndex === ci;
              return (
                <span
                  key={ci}
                  className={cn(
                    "flex h-9 flex-1 items-center justify-end gap-1.5 border-r border-b border-ink-100 px-2.5 font-mono text-[13px]",
                    isHighlighted ? "border-2 border-brand-500 bg-brand-50 text-ink-900" : "bg-white text-ink-900",
                  )}
                >
                  {c}
                  {isHighlighted && r.highlightBadge ? (
                    <span className="flex-none rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-semibold text-on-brand">
                      {r.highlightBadge}
                    </span>
                  ) : null}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <PanelNote note={panel.note} />
    </>
  );
}

/** DeskUniWrite's forecast log — read-only for this pass (no forecasts
 *  table yet): shows the one forecast just written, not a list across
 *  visits, and nothing here saves or reminds. */
function ForecastLogPanel({ panel }: { panel: Extract<Panel, { kind: "forecastLog" }> }) {
  return (
    <>
      <PanelHeading title={panel.title} subtitle={panel.subtitle} />
      <div className="flex flex-col gap-2 rounded-2xl border-2 border-brand-500 bg-brand-50 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[22px] leading-7 font-medium text-ink-900">{panel.confidence}</span>
          <span className="flex-none rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-semibold text-on-brand">new</span>
        </div>
        <div className="text-[15px] leading-[22px] text-ink-900">{panel.text}</div>
        <div className="font-mono text-[12.5px] leading-[18px] text-ink-600">{panel.dueLabel}</div>
      </div>
      <PanelNote note={panel.note} />
    </>
  );
}

/**
 * The dark terminal card both authored kinds share — V2Step's "Type this"
 * / V2Turn's "Start with this", one or more command lines, Copy, and
 * (command steps only) the "You should see" output with the one line
 * that gets V2Step's "look for this" pill.
 *
 * night-950, not the dark-theme tokens (dark-bg/dark-text/…): those are
 * reserved for Phase 7's theme toggle, and this card is decorative inside
 * an ordinary light-mode screen, not a theme state. on-night is measured
 * against night-900, one step lighter than night-950 — safe to reuse here
 * since a darker surface only raises the same text's contrast, never
 * lowers it.
 */
function TerminalCard({
  promptLabel,
  promptGlyph = "$",
  lines,
  outputLabel,
  output,
}: {
  promptLabel: string;
  /** The per-line glyph — "$" for a shell command, "fx" for a spreadsheet
   *  formula (UniFormula's own italic prefix). Always aria-hidden: it is
   *  decorative, the line's own text is what a screen reader announces. */
  promptGlyph?: string;
  lines: TerminalLine[];
  outputLabel?: string;
  output?: TerminalLine[];
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const joined = lines.map((l) => (typeof l === "string" ? l : l.text)).join("\n");
    if (navigator.clipboard) navigator.clipboard.writeText(joined).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-3xl bg-night-950 p-4">
      <div className="flex h-11 items-center justify-between gap-3">
        <span className="font-mono text-[11px] font-medium tracking-[.08em] text-on-night-muted-2 uppercase">
          {promptLabel}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex h-11 flex-none items-center gap-2 rounded-xl bg-white/10 px-3.5 text-[13.5px] font-semibold text-on-night"
        >
          <CopyIcon />
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="mt-1.5 flex flex-col gap-0.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className="flex gap-2.5 font-mono text-[14px] leading-[22px] text-on-night"
            style={{ overflowWrap: "anywhere" }}
          >
            <span aria-hidden className={promptGlyph === "fx" ? "italic" : undefined}>{promptGlyph}</span>
            <span>{typeof line === "string" ? line : line.text}</span>
          </div>
        ))}
      </div>
      {output?.length ? (
        <>
          <div aria-hidden className="my-3.5 h-px bg-white/12" />
          {outputLabel ? (
            <div className="font-mono text-[11px] font-medium tracking-[.08em] text-on-night-muted-2 uppercase">
              {outputLabel}
            </div>
          ) : null}
          <div
            className="mt-2 flex flex-col font-mono text-[12px] leading-[19px] text-on-night-muted"
            style={{ overflowWrap: "anywhere" }}
          >
            {output.map((line, i) =>
              typeof line === "string" ? (
                <div key={i}>{line}</div>
              ) : (
                <div
                  key={i}
                  className="my-[1px] flex items-center justify-between gap-2 rounded-lg bg-brand-500/25 px-2 py-0.5 text-on-night"
                >
                  <span>{line.text}</span>
                  {line.highlight ? (
                    <span className="flex-none rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-semibold text-on-brand">
                      {line.highlight}
                    </span>
                  ) : null}
                </div>
              ),
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

function CheckStep({ step }: { step: Extract<LessonStep, { kind: "check" }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setOpen((s) => !s)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((s) => !s);
        }
      }}
      className="cursor-pointer rounded-3xl border border-ink-100 bg-white p-4 hover:border-link"
    >
      <div className="flex items-start gap-3">
        <span className="flex-none font-mono text-[13px] leading-normal text-ink-500">{step.number}</span>
        <p className="m-0 flex-1 text-pretty text-[16px] leading-[1.75] text-ink-900">
          <RichText segments={step.question} />
        </p>
        <span className="-mt-0.5 -mr-0.5 flex size-6 flex-none items-center justify-center text-link">
          <EyeIcon />
        </span>
      </div>
      {open ? (
        <div className="mt-3.5 border-t border-ink-100 pt-3.5 pl-[25px]">
          {step.answer.map((p, i) => (
            <p key={i} className={cn("text-pretty text-[16px] leading-[1.75] text-ink-600", i > 0 && "mt-3")}>
              <RichText segments={p} />
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
