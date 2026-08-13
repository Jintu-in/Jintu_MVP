"use client";

import { useAction } from "next-safe-action/hooks";
import { consumeSave } from "@/actions/saves";

/** One saved resource on the dashboard: open it, or clear it as done-with. */
export function SavedQueueItem({
  resourceId,
  title,
  url,
  sourceName,
  readerHref,
}: {
  resourceId: string;
  title: string;
  url: string;
  sourceName: string;
  readerHref: string | null;
}) {
  const { execute, isExecuting } = useAction(consumeSave);

  return (
    <li className="flex items-center gap-4 py-3">
      <span className="min-w-0 flex-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-[15px] font-medium text-brand-700 underline hover:text-brand-800"
        >
          {title}
        </a>
        <span className="mt-0.5 block text-sm text-ink-500">
          {sourceName}
          {readerHref ? (
            <>
              {" · "}
              <a href={readerHref} className="underline hover:text-ink-900">
                its node
              </a>
            </>
          ) : null}
        </span>
      </span>
      <button
        type="button"
        disabled={isExecuting}
        onClick={() => execute({ resourceId })}
        className="flex h-12 shrink-0 items-center rounded-lg border border-ink-200 px-3 text-sm text-ink-600 hover:border-brand-700 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:opacity-60"
      >
        {isExecuting ? "…" : "Done with it"}
      </button>
    </li>
  );
}
