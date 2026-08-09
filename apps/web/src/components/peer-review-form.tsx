"use client";

import { useAction } from "next-safe-action/hooks";
import { useId, useState } from "react";
import type { RubricCriterion } from "@/lib/curriculum";
import { submitPeerReview } from "@/actions/peer-reviews";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

/**
 * Scoring one criterion at a time, against the rubric's own words.
 *
 * Radio buttons rather than a number field or a slider. A criterion worth 3
 * has four possible answers, all of them visible, and the reviewer picks one
 * — which is faster on a phone than a stepper and removes the whole class of
 * "what does 2.5 mean here". It also makes the weight legible: you can see
 * that readability is worth one point and correctness three.
 */
export function PeerReviewForm({
  peerReviewId,
  criteria,
}: {
  peerReviewId: string;
  criteria: RubricCriterion[];
}) {
  const id = useId();
  const { execute, result, status } = useAction(submitPeerReview);
  const [scores, setScores] = useState<Record<string, number>>({});
  const errors = result?.validationErrors as FieldErrors | undefined;
  const pending = status === "executing";
  const unscored = criteria.filter((c) => !(c.key in scores));

  if (result?.data?.sent) {
    return (
      <p
        role="status"
        className="mt-6 rounded-card border border-ok-600/20 bg-ok-600/10 px-4 py-3 text-pretty text-ink-800"
      >
        Sent. They see your marks and your comment, and not your name.
      </p>
    );
  }

  return (
    <form
      noValidate
      className="mt-6"
      action={(fd) =>
        execute({
          peerReviewId,
          scores,
          feedback: String(fd.get("feedback") ?? ""),
        })
      }
    >
      <fieldset>
        <legend className="text-sm font-medium tracking-wide text-ink-500 uppercase">
          The rubric
        </legend>

        <ul className="mt-3 space-y-3">
          {criteria.map((criterion) => (
            <li
              key={criterion.key}
              className="rounded-card border border-ink-100 bg-white p-4"
            >
              <fieldset>
                <legend className="font-medium text-pretty text-ink-900">
                  {criterion.label}
                </legend>
                <p className="mt-0.5 text-sm text-ink-500">
                  Worth <span className="font-mono tabular-nums">{criterion.weight}</span>
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.from({ length: criterion.weight + 1 }, (_, n) => n).map((n) => {
                    const inputId = `${id}-${criterion.key}-${n}`;
                    const chosen = scores[criterion.key] === n;
                    return (
                      <span key={n}>
                        <input
                          type="radio"
                          id={inputId}
                          name={criterion.key}
                          value={n}
                          checked={chosen}
                          onChange={() =>
                            setScores((s) => ({ ...s, [criterion.key]: n }))
                          }
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={inputId}
                          className={cn(
                            "flex size-11 cursor-pointer items-center justify-center rounded-lg border font-mono tabular-nums",
                            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-700",
                            chosen
                              ? "border-brand-700 bg-brand-700 text-white"
                              : "border-ink-200 text-ink-700 hover:border-brand-600",
                          )}
                        >
                          {n}
                        </label>
                      </span>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          ))}
        </ul>
      </fieldset>

      <label htmlFor={`${id}-feedback`} className="mt-6 block text-sm font-medium text-ink-700">
        What would you tell them?
      </label>
      <textarea
        id={`${id}-feedback`}
        name="feedback"
        rows={5}
        aria-invalid={firstError(errors, "feedback") ? true : undefined}
        className={cn(
          "mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-ink-900",
          "focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700",
          firstError(errors, "feedback") ? "border-risk-600" : "border-ink-200",
        )}
      />
      {firstError(errors, "feedback") ? (
        <p className="mt-1.5 text-sm text-pretty text-risk-600">
          {firstError(errors, "feedback")}
        </p>
      ) : null}
      <p className="mt-1.5 text-sm text-pretty text-ink-500">
        One specific thing they should change, and one that already works. They
        never learn who wrote this.
      </p>

      {result?.serverError ? (
        <p role="alert" className="mt-3 text-pretty text-sm text-risk-600">
          {result.serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || unscored.length > 0}
        className={cn(
          "mt-5 flex h-12 w-full items-center justify-center rounded-lg px-5 font-medium text-white",
          "bg-brand-700 hover:bg-brand-800 disabled:bg-ink-500",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
          "sm:w-auto",
        )}
      >
        {pending ? "Sending…" : "Send review"}
      </button>
      {unscored.length > 0 ? (
        // aria-live: the button becomes enabled as criteria are scored, and a
        // disabled control that silently changes state is invisible to anyone
        // not watching it.
        <p aria-live="polite" className="mt-2 text-sm text-pretty text-ink-500">
          Still to score: {unscored.map((c) => c.label).join(", ")}.
        </p>
      ) : null}
    </form>
  );
}
