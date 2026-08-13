"use client";

import { useAction } from "next-safe-action/hooks";
import { setNodeDone } from "@/actions/progress";
import { cn } from "@/lib/utils";

/**
 * The tick beside a node — the whole write surface of the roadmap page.
 *
 * A 48px square button, not a checkbox input: it is tapped on a phone in a
 * lift, and a native checkbox at that size styles inconsistently across the
 * Androids this is built for. aria-pressed carries the state; the label
 * carries the node so a screen reader hears more than "button".
 */
export function NodeTick({
  nodeId,
  roadmapId,
  roadmapSlug,
  nodeTitle,
  done,
}: {
  nodeId: string;
  roadmapId: string;
  roadmapSlug: string;
  nodeTitle: string;
  done: boolean;
}) {
  const { execute, isExecuting, result } = useAction(setNodeDone);

  return (
    <span className="flex flex-col items-end">
      <button
        type="button"
        aria-pressed={done}
        aria-label={done ? `Mark "${nodeTitle}" not done` : `Mark "${nodeTitle}" done`}
        disabled={isExecuting}
        onClick={() => execute({ nodeId, roadmapId, roadmapSlug, done: !done })}
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-lg border text-lg",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
          done
            ? "border-brand-700 bg-brand-700 text-white"
            : "border-ink-200 bg-white text-ink-500 hover:border-brand-700 hover:text-brand-700",
          isExecuting && "opacity-60",
        )}
      >
        {done ? "✓" : ""}
      </button>
      {result.serverError ? (
        <span role="alert" className="mt-1 max-w-40 text-right text-xs text-ink-600">
          {result.serverError}
        </span>
      ) : null}
    </span>
  );
}
