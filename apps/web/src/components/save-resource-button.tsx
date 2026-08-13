"use client";

import { useAction } from "next-safe-action/hooks";
import { setResourceSaved } from "@/actions/saves";
import { cn } from "@/lib/utils";

/** The save-for-later toggle beside a resource. 48px target, text not icon —
 * "Saved" is legible in daylight on a cheap screen; a bookmark glyph is not. */
export function SaveResourceButton({
  resourceId,
  roadmapSlug,
  nodeId,
  saved,
}: {
  resourceId: string;
  roadmapSlug: string;
  nodeId: string;
  saved: boolean;
}) {
  const { execute, isExecuting, result } = useAction(setResourceSaved);

  return (
    <span className="flex flex-col items-end">
      <button
        type="button"
        aria-pressed={saved}
        disabled={isExecuting}
        onClick={() => execute({ resourceId, roadmapSlug, nodeId, saved: !saved })}
        className={cn(
          "flex h-12 shrink-0 items-center rounded-lg border px-3 text-sm",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
          saved
            ? "border-brand-700 font-medium text-brand-700"
            : "border-ink-200 text-ink-600 hover:border-brand-700 hover:text-brand-700",
          isExecuting && "opacity-60",
        )}
      >
        {saved ? "Saved" : "Save"}
      </button>
      {result.serverError ? (
        <span role="alert" className="mt-1 max-w-40 text-right text-xs text-ink-600">
          {result.serverError}
        </span>
      ) : null}
    </span>
  );
}
