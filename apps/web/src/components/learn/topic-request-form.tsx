"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { requestTopic } from "@/actions/requests";
import { cn } from "@/lib/utils";

/**
 * One line of input, so a miss becomes a demand signal rather than a dead end.
 * Confirms in place — no redirect, no toast.
 *
 * Three surfaces share it and each says where it came from: the roadmap 404,
 * the catalogue sidebar's quiet "not here yet?", and the catalogue's
 * no-results state, where it is the main thing on the page and arrives
 * prefilled with whatever was searched for.
 */
export function TopicRequestForm({
  source,
  fromSlug,
  defaultValue = "",
  label,
  size = "regular",
}: {
  source: "sidebar" | "no_results" | "not_found";
  fromSlug?: string;
  /** Prefill — the query that found nothing. */
  defaultValue?: string;
  label?: string;
  /** "compact" is the sidebar; it has 240px and no room for a 48px row. */
  size?: "regular" | "compact";
}) {
  const [wanted, setWanted] = useState(defaultValue);
  const { execute, result, status } = useAction(requestTopic);

  // The no-results box is prefilled from the URL's ?q=, which changes under
  // it as the search is edited. Untouched, it should follow.
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!touched) setWanted(defaultValue);
  }, [defaultValue, touched]);

  const compact = size === "compact";

  if (result?.data?.recorded) {
    return (
      <p
        role="status"
        className={cn(
          "text-pretty text-ink-900",
          compact ? "text-[12.5px] leading-[1.5]" : "mt-4 text-[15px] leading-[1.7]",
        )}
      >
        Noted — thank you. We write the most asked-for subjects first.
      </p>
    );
  }

  return (
    <form className={compact ? "" : "mt-4"} action={() => execute({ wanted, source, fromSlug })}>
      {label ? (
        <label
          htmlFor={`wanted-${source}`}
          className={cn("block text-ink-600", compact ? "text-[12.5px] leading-[1.5]" : "text-[14px] leading-[1.6]")}
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn("flex", label && "mt-2", compact ? "flex-col gap-2" : "flex-col gap-2.5 sm:flex-row")}
      >
        <input
          id={`wanted-${source}`}
          value={wanted}
          onChange={(e) => {
            setTouched(true);
            setWanted(e.target.value);
          }}
          // The sidebar is 240px wide with 20px of padding either side. Three
          // examples do not fit in 200px — they truncate mid-word, which reads
          // as a broken field rather than a hint.
          placeholder={compact ? "A subject we're missing" : "Kubernetes, product management, tax…"}
          aria-label={label ?? "What were you looking for?"}
          className={cn(
            "min-w-0 flex-1 rounded-lg border border-ink-100 bg-white text-ink-900 placeholder:text-ink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
            compact ? "h-9 px-2.5 text-[12.5px]" : "h-12 px-3 text-[15px]",
          )}
        />
        <button
          type="submit"
          disabled={status === "executing" || wanted.trim().length < 2}
          // Outlined in the sidebar, filled everywhere else. A solid brand
          // button is the loudest thing on the page, and this is a footnote
          // under the filters, not the reason anyone came.
          //
          // Disabled fades rather than swapping to a pale grey fill: white on
          // ink-300 is 1.89:1, an unreadable label on the button people are
          // trying to press.
          className={cn(
            "flex items-center justify-center rounded-lg font-medium disabled:opacity-60",
            compact
              ? "h-9 self-start border border-brand-700 bg-white px-3 text-[12.5px] text-brand-700 hover:border-brand-800 hover:text-brand-800"
              : "h-12 bg-brand-700 px-5 text-[16px] text-white hover:bg-brand-800",
          )}
        >
          {compact ? "Tell us →" : "Send"}
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
