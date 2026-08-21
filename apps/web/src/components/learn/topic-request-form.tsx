"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { requestTopic } from "@/actions/requests";
import { FieldInput, FieldShell } from "@/components/ui/field-shell";
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
  const [focused, setFocused] = useState(false);
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
      {/* Compact is ONE row, in the same shell as the search field directly
          above it in the sidebar. Split across two rows with its own button
          underneath, it read as a second search bar competing with the first
          rather than as a footnote under the filters.

          The 28px submit is under the 48px touch minimum, which is why only
          the lg-and-up sidebar uses this variant. Every touch surface gets
          the regular one, with a 48px button of its own. */}
      {compact ? (
        <FieldShell focused={focused} scale="compact" className={cn(label && "mt-2")}>
          <FieldInput
            id={`wanted-${source}`}
            scale="compact"
            value={wanted}
            onChange={(e) => {
              setTouched(true);
              setWanted(e.target.value);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            // 240px of sidebar less 20px of padding either side leaves 200px.
            // Three example subjects truncate mid-word in that, which reads as
            // a broken field rather than a hint.
            placeholder="A subject we're missing"
            aria-label={label ?? "What were you looking for?"}
          />
          <button
            type="submit"
            aria-label="Send this request"
            disabled={status === "executing" || wanted.trim().length < 2}
            // Fades when disabled rather than swapping to a pale grey fill:
            // white on ink-300 is 1.89:1, an unreadable glyph on the button
            // somebody is trying to press.
            className="flex size-7 flex-none items-center justify-center rounded-md bg-brand-700 text-white hover:bg-brand-800 disabled:opacity-40"
          >
            <svg aria-hidden width={13} height={13} viewBox="0 0 14 14" fill="none">
              <path d="M2 7h9M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </FieldShell>
      ) : (
        <div className={cn("flex flex-col gap-2.5 sm:flex-row", label && "mt-2")}>
          <input
            id={`wanted-${source}`}
            value={wanted}
            onChange={(e) => {
              setTouched(true);
              setWanted(e.target.value);
            }}
            placeholder="Kubernetes, product management, tax…"
            aria-label={label ?? "What were you looking for?"}
            className="h-12 min-w-0 flex-1 rounded-lg border border-ink-100 bg-white px-3 text-[15px] text-ink-900 placeholder:text-ink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          />
          <button
            type="submit"
            disabled={status === "executing" || wanted.trim().length < 2}
            className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 text-[16px] font-medium text-white hover:bg-brand-800 disabled:opacity-60"
          >
            Send
          </button>
        </div>
      )}
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
