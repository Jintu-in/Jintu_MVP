"use client";

import { useAction } from "next-safe-action/hooks";
import { setNodeDone } from "@/actions/progress";
import { cn } from "@/lib/utils";

/**
 * The reader's full-width mark-done. Same action as the roadmap page's tick
 * — one write path — different clothes: at the end of a node the button IS
 * the screen's purpose, so it gets the primary treatment.
 */
export function MarkDoneButton({
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
    <div>
      <button
        type="button"
        aria-pressed={done}
        disabled={isExecuting}
        onClick={() => execute({ nodeId, roadmapId, roadmapSlug, done: !done })}
        className={cn(
          "flex h-12 w-full items-center justify-center rounded-lg font-medium",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
          done
            ? "border border-brand-700 bg-white text-brand-700"
            : "bg-brand-700 text-white hover:bg-brand-800",
          isExecuting && "opacity-60",
        )}
      >
        {isExecuting ? "Saving…" : done ? `✓ Done — "${nodeTitle}"` : "Mark this node done"}
      </button>
      {result.serverError ? (
        <p role="alert" className="mt-2 text-sm text-ink-600">
          {result.serverError}
        </p>
      ) : null}
    </div>
  );
}
