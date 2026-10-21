"use client";

import { useState } from "react";
import { BackIcon, DocFileIcon, EyeIcon, ExternalIcon, PlayCircleIcon, VideoTileIcon } from "@/components/ui/icons";
import { VideoFacade } from "@/components/video-facade";
import type { LessonStep, Rich } from "@/lib/steps";
import { cn } from "@/lib/utils";

/**
 * One step at a time (V2Step/V2Turn), replacing the old six-section
 * scrolling page. Renders the six generic step kinds buildLessonSteps()
 * produces (lib/steps.ts) — concept/topics/resource/challenge/check/
 * gotcha. The Git-&-GitHub-specific "run a command" card V2Step itself
 * draws, the five Uni* types, and the "Stuck? Ask about this step" box
 * (CHANGES.md item 6) are Part B: none of them exist yet, on purpose — a
 * dead Stuck button that goes nowhere is worse than no button at all.
 *
 * "Your turn" replaces the step counter in the header for a challenge
 * step, matching V2Turn's own header exactly.
 */

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
  stepIndex: number;
  total: number;
  /** Furthest index reached so far — lights more of the bar than "current"
   *  alone when the reader is reviewing an earlier step. */
  furthest: number;
  step: LessonStep;
  onBack: () => void;
  onPrev?: () => void;
  onContinue: () => void;
  continuing?: boolean;
  /** Set only on the last step, when finishing failed — named, inline,
   *  same discipline as the old page's footer.failure (never a toast). */
  error?: string;
}

export function StepReader({
  roadmapTitle,
  moduleLabel,
  stepIndex,
  total,
  furthest,
  step,
  onBack,
  onPrev,
  onContinue,
  continuing,
  error,
}: StepReaderProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <div className="flex h-16 flex-none items-center gap-3 px-3 pr-5">
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
        {step.kind === "challenge" ? (
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
        className="flex flex-none gap-1 px-5"
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

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pt-6 pb-4">
        <div className="flex flex-col gap-1.5">
          <div className="text-[13px] leading-[18px] font-semibold text-link">
            Step {stepIndex + 1}
          </div>
          <h1 className="font-heading text-[28px] leading-[32px] font-semibold tracking-[-0.015em] text-ink-900">
            {step.railTitle}
          </h1>
        </div>

        <StepBody step={step} />
      </div>

      <div className="flex-none border-t border-ink-100 bg-white px-5 pt-3 pb-5">
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
            <span>{continuing ? "Saving…" : stepIndex + 1 === total ? "Finish" : "Continue"}</span>
            {continuing ? null : ARROW_RIGHT}
          </button>
        </div>
      </div>
    </div>
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
