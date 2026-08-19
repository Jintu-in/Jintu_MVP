"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toggleConsent } from "@/actions/auth";
import type { OptionalPurpose } from "@jintu/contracts";
import { cn } from "@/lib/utils";

/**
 * One optional purpose, with the date it was agreed.
 *
 * Withdrawing writes withdrawn_at and never deletes the row: we have to be
 * able to show what was agreed and when, for the period it covered. That is
 * the point of keeping consent as an append-only ledger rather than a
 * boolean column.
 */
export function ConsentRow({
  purpose,
  label,
  description,
  granted,
  agreedOn,
}: {
  purpose: OptionalPurpose;
  label: string;
  description: string;
  granted: boolean;
  agreedOn: string | null;
}) {
  const [on, setOn] = useState(granted);
  const { execute, result, status } = useAction(toggleConsent, {
    onError: () => setOn(granted),
  });

  return (
    <div className="border-t border-ink-100 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] leading-[1.4] font-medium text-ink-900">{label}</div>
          <div className="mt-1 font-mono text-[12.5px] leading-[1.5] text-ink-500">
            {on && agreedOn ? `Agreed ${agreedOn}` : "Not agreed"}
          </div>
          <p className="mt-2 max-w-[58ch] text-[13.5px] leading-[1.7] text-pretty text-ink-600">
            {description}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={label}
          disabled={status === "executing"}
          onClick={() => {
            const next = !on;
            setOn(next);
            execute({ purpose, granted: next });
          }}
          className={cn(
            "relative mt-0.5 h-7 w-12 flex-none rounded-full border transition-colors",
            on ? "border-brand-700 bg-brand-700" : "border-ink-200 bg-ink-100",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute top-0.5 size-5 rounded-full bg-white transition-[left]",
              on ? "left-[26px]" : "left-0.5",
            )}
          />
        </button>
      </div>
      {result?.serverError ? (
        <p role="alert" className="mt-2 text-[13.5px] text-ink-900">
          {result.serverError}
        </p>
      ) : null}
    </div>
  );
}
