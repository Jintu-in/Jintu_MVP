"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { gradeCard } from "@/actions/reviews";
import { cn } from "@/lib/utils";

/**
 * One card, one honest loop: think, reveal, grade. The answer stays hidden
 * until asked for because recall is the exercise — a visible answer turns
 * review into re-reading, which feels like work and teaches nothing.
 */
export function ReviewGrade({ cardId, back }: { cardId: string; back: string }) {
  const [revealed, setRevealed] = useState(false);
  const { execute, isExecuting, result } = useAction(gradeCard);

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        Show the answer
      </button>
    );
  }

  const RATINGS = [
    { key: "again", label: "Again", hint: "blank" },
    { key: "hard", label: "Hard", hint: "barely" },
    { key: "good", label: "Good", hint: "got it" },
    { key: "easy", label: "Easy", hint: "instant" },
  ] as const;

  return (
    <div className="mt-5">
      <p className="rounded-card border border-ink-100 bg-ink-50 p-4 text-[15px] leading-[1.7] whitespace-pre-wrap text-ink-800">
        {back}
      </p>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {RATINGS.map((r) => (
          <button
            key={r.key}
            type="button"
            disabled={isExecuting}
            onClick={() => execute({ cardId, rating: r.key })}
            className={cn(
              "flex h-12 flex-col items-center justify-center rounded-lg border border-ink-200 text-sm font-medium text-ink-700",
              "hover:border-brand-700 hover:text-brand-700",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
              isExecuting && "opacity-60",
            )}
          >
            {r.label}
            <span className="text-[11px] font-normal text-ink-500">{r.hint}</span>
          </button>
        ))}
      </div>
      {result.serverError ? (
        <p role="alert" className="mt-3 text-sm text-ink-600">
          {result.serverError}
        </p>
      ) : null}
    </div>
  );
}
