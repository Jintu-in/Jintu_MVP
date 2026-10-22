"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizQuestion } from "@jintu/contracts";
import { BackIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * V2Quiz/DeskQuiz — "no score is kept" (BUILD-PLAN.md §3.4): one question
 * at a time, pick an answer, see why either way, Next. Nothing here is
 * ever written anywhere — i/pick are plain component state, gone the
 * moment this unmounts. Deliberately NOT StepReader's three-column shell:
 * the mockup itself has no left nav on this screen, phone or desktop —
 * a focused, chromeless detour from the lesson, not a lesson step.
 */
export interface QuizRouteProps {
  slug: string;
  nodeSlug: string;
  nodeTitle: string;
  questions: QuizQuestion[];
}

export default function QuizRoute({ slug, nodeSlug, nodeTitle, questions }: QuizRouteProps) {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const total = questions.length;
  const q = questions[i]!;
  const answered = pick !== null;
  const correct = pick === q.correctIndex;
  const isLast = i === total - 1;
  const backHref = `/learn/${slug}/${nodeSlug}`;

  const next = () => {
    if (!answered) return;
    if (isLast) {
      router.push(backHref as never);
      return;
    }
    setI(i + 1);
    setPick(null);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <div className="flex h-16 flex-none items-center gap-3 px-3 pr-5">
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.push(backHref as never)}
          className="flex size-11 flex-none items-center justify-center rounded-full bg-white text-ink-900"
        >
          <BackIcon />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] leading-[20px] font-semibold text-ink-900">Quick check</div>
          <div className="truncate text-[12.5px] leading-[18px] text-ink-500">{nodeTitle} · no score is kept</div>
        </div>
        <span className="flex h-8 flex-none items-center rounded-2xl bg-white px-3 font-mono text-[12.5px] font-medium text-ink-900">
          {i + 1} / {total}
        </span>
      </div>

      <div
        role="img"
        aria-label={`Question ${i + 1} of ${total}`}
        className="flex flex-none gap-1.5 px-5 lg:justify-center"
      >
        <div className="flex w-full max-w-[720px] gap-1.5 lg:gap-2">
          {questions.map((_, k) => (
            <div
              key={k}
              className={cn(
                "h-[6px] flex-1 rounded-[3px]",
                k < i ? "bg-night-900" : k === i ? "bg-brand-500" : "bg-ink-300",
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center overflow-y-auto px-5 pt-7 pb-4">
        <div className="flex w-full max-w-[720px] flex-col gap-5">
          <h1 className="font-heading text-[24px] leading-[30px] font-semibold tracking-[-0.015em] text-ink-900 text-pretty lg:text-[32px] lg:leading-[38px]">
            {q.question}
          </h1>

          <div role="radiogroup" aria-label="Answers" className="flex flex-col gap-2.5">
            {q.options.map((opt, k) => {
              const isRight = answered && k === q.correctIndex;
              const isWrongPick = answered && k === pick && !correct;
              return (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={k === pick}
                  disabled={answered}
                  onClick={() => setPick(k)}
                  className={cn(
                    "flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border-2 px-4 py-2.5 text-left text-[15px] font-medium",
                    isRight
                      ? "border-ok-600 bg-ok-bg text-ok-700"
                      : isWrongPick
                        ? "border-risk-border bg-risk-bg text-risk-700"
                        : "border-white bg-white text-ink-900",
                  )}
                >
                  <span>{opt}</span>
                  {isRight ? <span className="flex-none text-[13px] font-semibold">Right</span> : null}
                  {isWrongPick ? <span className="flex-none text-[13px] font-semibold">Not this one</span> : null}
                </button>
              );
            })}
          </div>

          {answered ? (
            <div
              role="status"
              className={cn(
                "flex flex-col gap-1 rounded-2xl p-4",
                correct ? "bg-ok-bg text-ok-700" : "bg-warn-bg text-warn-700",
              )}
            >
              <div className="text-[15.5px] leading-[1.4] font-semibold">
                {correct ? "That is it." : "Close. Here is the idea."}
              </div>
              <div className="text-[14.5px] leading-[1.5]">{q.explanation}</div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex-none border-t border-ink-100 bg-white px-5 pt-3 pb-5">
        <div className="mx-auto flex w-full max-w-[720px] justify-end">
          <button
            type="button"
            disabled={!answered}
            onClick={next}
            className="h-14 w-full rounded-2xl bg-brand-500 text-[16.5px] font-semibold text-on-brand disabled:bg-ink-100 disabled:text-ink-600 lg:w-[220px]"
          >
            {!answered ? "Pick an answer" : isLast ? "Done" : "Next question"}
          </button>
        </div>
      </div>
    </div>
  );
}
