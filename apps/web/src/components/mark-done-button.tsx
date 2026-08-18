"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { setNodeDone, type StreakResult } from "@/actions/progress";
import { cn } from "@/lib/utils";

/**
 * Mark done / undo — optimistic, honest about breaks.
 *
 * The button flips instantly (under 200ms perceived is the spec), then
 * reconciles with the RPC result. When the completion broke a streak, the
 * break is NAMED and the total is protected in the same sentence — the
 * whole point of keeping two numbers. Tapping again reverses cleanly
 * through uncomplete_day.
 */
export function MarkDoneButton({
  nodeId,
  roadmapId,
  roadmapSlug,
  nodeTitle,
  points,
  done: doneInitial,
}: {
  nodeId: string;
  roadmapId: string;
  roadmapSlug: string;
  nodeTitle: string;
  points: number;
  done: boolean;
}) {
  const [done, setDone] = useState(doneInitial);
  const [streak, setStreak] = useState<StreakResult | null>(null);
  const { execute, isExecuting, result } = useAction(setNodeDone, {
    onSuccess: ({ data }) => {
      if (data) {
        setDone(data.done);
        setStreak(data.streak);
      }
    },
    onError: () => setDone(doneInitial), // reconcile the optimism away
  });

  const tap = () => {
    setDone(!done); // optimistic
    setStreak(null);
    execute({ nodeId, roadmapId, roadmapSlug, done: !done });
  };

  return (
    <div>
      <button
        type="button"
        aria-pressed={done}
        disabled={isExecuting}
        onClick={tap}
        className={cn(
          "flex h-12 w-full items-center justify-center rounded-lg font-medium",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
          done
            ? "border border-brand-700 bg-white text-brand-700"
            : "bg-brand-700 text-white hover:bg-brand-800",
        )}
      >
        {done ? `✓ Done — "${nodeTitle}"` : "Mark this day done"}
      </button>

      {!done && !streak ? (
        <p className="mt-2 text-center font-mono text-[13px] text-ink-500">
          earns {points} pts · counts toward today&apos;s streak
        </p>
      ) : null}

      {streak && done ? (
        <p role="status" className="mt-2 text-center text-sm text-pretty text-ink-700">
          {streak.wasBroken ? (
            <>
              You missed {streak.daysMissed} {streak.daysMissed === 1 ? "day" : "days"}.
              Streak restarted at 1 — your {streak.totalDays} total days are safe.
            </>
          ) : streak.isNewDay ? (
            <>
              Day {streak.currentDays} of your streak · {streak.totalDays} total.
            </>
          ) : (
            <>Already counted today — points still earned.</>
          )}
        </p>
      ) : null}

      {result.serverError ? (
        <p role="alert" className="mt-2 text-sm text-ink-600">
          {result.serverError}
        </p>
      ) : null}
    </div>
  );
}
