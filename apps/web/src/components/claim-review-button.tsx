"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { claimReview } from "@/actions/peer-reviews";

/**
 * V3's door into async peer review: pick up the oldest waiting submission.
 * An empty queue is a normal answer, not a failure — it renders as the
 * sentence the database sent, and the button stays for next time.
 */
export function ClaimReviewButton() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  const { execute, status } = useAction(claimReview, {
    onSuccess: ({ data }) => {
      if (data?.reviewId) router.push(`/review/${data.reviewId}`);
    },
    onError: ({ error }) => {
      setMessage(error.serverError ?? "That did not work. Try again.");
    },
  });

  const pending = status === "executing";

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setMessage(null);
          execute();
        }}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500 sm:w-auto"
      >
        {pending ? "Finding one…" : "Pick up a review"}
      </button>
      {message ? (
        <p role="status" className="mt-2 text-sm text-pretty text-ink-600">
          {message}
        </p>
      ) : null}
    </div>
  );
}
