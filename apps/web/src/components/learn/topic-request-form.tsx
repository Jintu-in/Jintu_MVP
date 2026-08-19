"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { requestTopic } from "@/actions/requests";

/**
 * One line of input on the roadmap 404, so a miss becomes a demand signal
 * rather than a dead end. Confirms in place — no redirect, no toast.
 */
export function TopicRequestForm({ fromSlug }: { fromSlug?: string }) {
  const [wanted, setWanted] = useState("");
  const { execute, result, status } = useAction(requestTopic);

  if (result?.data?.recorded) {
    return (
      <p role="status" className="mt-4 text-[15px] leading-[1.7] text-pretty text-ink-900">
        Noted — thank you. We write the most asked-for subjects first.
      </p>
    );
  }

  return (
    <form className="mt-4" action={() => execute({ wanted, fromSlug })}>
      <label htmlFor="wanted" className="block text-[14px] leading-[1.6] text-ink-600">
        Tell us what you were looking for
      </label>
      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
        <input
          id="wanted"
          value={wanted}
          onChange={(e) => setWanted(e.target.value)}
          placeholder="Kubernetes, product management, tax…"
          className="h-12 min-w-0 flex-1 rounded-lg border border-ink-100 bg-white px-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        />
        <button
          type="submit"
          disabled={status === "executing" || wanted.trim().length < 2}
          className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 text-[16px] font-medium text-white hover:bg-brand-800 disabled:bg-ink-300"
        >
          Send
        </button>
      </div>
      {result?.serverError ? (
        <p role="alert" className="mt-2 text-[14px] text-ink-900">
          {result.serverError}
        </p>
      ) : null}
      {result?.validationErrors?.wanted?._errors?.[0] ? (
        <p role="alert" className="mt-2 text-[14px] text-ink-900">
          {result.validationErrors.wanted._errors[0]}
        </p>
      ) : null}
    </form>
  );
}
