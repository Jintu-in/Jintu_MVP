"use client";

import { useAction } from "next-safe-action/hooks";
import { useId, useState } from "react";
import { saveCommunityOutline } from "@/actions/authoring";
import { cn } from "@/lib/utils";

const FIELD =
  "block w-full rounded-lg border border-ink-200 bg-white px-3 text-base text-ink-900 placeholder:text-ink-500 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700";

type Week = { title: string; objective: string };

/**
 * The outline, edited as the list it is. Saving sends the whole list and the
 * database replaces the whole list — week numbers come from position there,
 * which is why rows here have no number inputs, only an order.
 *
 * State is plain local state on purpose. An outline is a dozen short rows;
 * autosave, drafts and dirty-tracking would be machinery in front of a form
 * that takes a minute to fill in.
 */
export function OutlineEditor({ slug, initial }: { slug: string; initial: Week[] }) {
  const id = useId();
  const [weeks, setWeeks] = useState<Week[]>(
    initial.length > 0 ? initial : [{ title: "", objective: "" }],
  );
  const [saved, setSaved] = useState(false);

  const { execute, result, status } = useAction(saveCommunityOutline, {
    onSuccess: () => setSaved(true),
  });
  const pending = status === "executing";

  const edit = (i: number, patch: Partial<Week>) => {
    setSaved(false);
    setWeeks((w) => w.map((week, j) => (j === i ? { ...week, ...patch } : week)));
  };

  return (
    <div className="mt-6">
      <ol className="space-y-4">
        {weeks.map((week, i) => (
          <li key={i} className="rounded-card border border-ink-100 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-sm text-ink-500">
                Week {String(i + 1).padStart(2, "0")}
              </p>
              {weeks.length > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setSaved(false);
                    setWeeks((w) => w.filter((_, j) => j !== i));
                  }}
                  className="flex h-12 items-center px-2 text-sm text-ink-500 hover:text-risk-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                >
                  Remove
                </button>
              ) : null}
            </div>

            <label htmlFor={`${id}-t${i}`} className="mt-2 block text-sm font-medium text-ink-700">
              Title
            </label>
            <input
              id={`${id}-t${i}`}
              value={week.title}
              onChange={(e) => edit(i, { title: e.target.value })}
              placeholder="Open chords"
              className={cn(FIELD, "mt-1.5 h-12")}
            />

            <label htmlFor={`${id}-o${i}`} className="mt-3 block text-sm font-medium text-ink-700">
              What can they do after it?
            </label>
            <input
              id={`${id}-o${i}`}
              value={week.objective}
              onChange={(e) => edit(i, { objective: e.target.value })}
              placeholder="Change between G, C and D in time with a metronome at 60."
              className={cn(FIELD, "mt-1.5 h-12")}
            />
          </li>
        ))}
      </ol>

      {weeks.length < 12 ? (
        <button
          type="button"
          onClick={() => {
            setSaved(false);
            setWeeks((w) => [...w, { title: "", objective: "" }]);
          }}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-lg border border-dashed border-ink-200 px-5 font-medium text-ink-600 hover:border-brand-600 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Add a week
        </button>
      ) : (
        <p className="mt-4 text-sm text-ink-500">
          Twelve weeks is the ceiling. A track longer than that is two tracks.
        </p>
      )}

      {result?.serverError ? (
        <p role="alert" className="mt-4 text-sm text-pretty text-risk-600">
          {result.serverError}
        </p>
      ) : null}
      {result?.validationErrors ? (
        <p role="alert" className="mt-4 text-sm text-pretty text-risk-600">
          Every week needs a title of at least four characters and an objective
          of at least ten. Fill the short ones in, or remove them.
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => execute({ slug, weeks })}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500 sm:w-auto"
        >
          {pending ? "Saving…" : "Save outline"}
        </button>
        {saved ? (
          <p role="status" className="text-sm text-ink-600">
            Saved. This replaces the whole outline — what you see is what is
            stored.
          </p>
        ) : null}
      </div>
    </div>
  );
}
