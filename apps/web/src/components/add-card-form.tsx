"use client";

import { useAction } from "next-safe-action/hooks";
import { useId, useRef } from "react";
import { createCard } from "@/actions/reviews";

/**
 * "Add a review card", folded shut by default at the end of a node.
 *
 * The card must be the reader's own recall prompt in their own words —
 * never a pasted excerpt of the resource. That is a legal line (we do not
 * store third-party content, under any column name) and a learning one
 * (typing your own question is half the encoding).
 */
export function AddCardForm({ nodeId, roadmapSlug }: { nodeId: string; roadmapSlug: string }) {
  const id = useId();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const { execute, isExecuting, result, reset } = useAction(createCard, {
    onSuccess: () => {
      detailsRef.current?.querySelector("form")?.reset();
    },
  });

  const FIELD =
    "mt-1.5 w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-[15px] text-ink-900 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700";

  return (
    <details ref={detailsRef} className="rounded-card border border-ink-100 bg-white">
      <summary className="flex min-h-12 cursor-pointer list-none items-center px-5 text-[15px] font-medium text-ink-900 [&::-webkit-details-marker]:hidden">
        Add a review card
      </summary>
      <form
        noValidate
        className="border-t border-ink-100 px-5 pb-5"
        action={(fd) =>
          execute({
            nodeId,
            roadmapSlug,
            front: String(fd.get("front") ?? ""),
            back: String(fd.get("back") ?? ""),
          })
        }
      >
        <label htmlFor={`${id}-front`} className="mt-4 block text-sm font-medium text-ink-700">
          The question, in your own words
        </label>
        <textarea id={`${id}-front`} name="front" rows={2} className={FIELD} />

        <label htmlFor={`${id}-back`} className="mt-4 block text-sm font-medium text-ink-700">
          The answer you want to still know next month
        </label>
        <textarea id={`${id}-back`} name="back" rows={3} className={FIELD} />

        <p className="mt-2 text-sm text-pretty text-ink-500">
          Your words, one idea per card. Not a pasted excerpt — writing the
          question is half the remembering.
        </p>

        {result.serverError || result.validationErrors ? (
          <p role="alert" className="mt-2 text-sm text-risk-600">
            {result.serverError ?? "Both sides need words."}
          </p>
        ) : null}
        {result.data?.created ? (
          <p role="status" className="mt-2 text-sm text-ink-700">
            Card saved — it enters the queue today.{" "}
            <button type="button" onClick={reset} className="underline">
              Add another
            </button>
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isExecuting}
          className="mt-4 flex h-12 items-center rounded-lg bg-brand-700 px-6 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
        >
          {isExecuting ? "Saving…" : "Save card"}
        </button>
      </form>
    </details>
  );
}
