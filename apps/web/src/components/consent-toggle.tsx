"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import type { OptionalPurpose } from "@jintu/contracts";
import { toggleConsent } from "@/actions/auth";
import { cn } from "@/lib/utils";

/**
 * Withdrawing is one click, in the same place granting was — DPDP requires it
 * to be as easy as giving, and a support email is not as easy.
 *
 * Withdrawal sets withdrawn_at; the row survives as the record that consent
 * existed for the period it covered.
 */
export function ConsentToggle({
  purpose,
  label,
  detail,
  granted,
}: {
  purpose: OptionalPurpose;
  label: string;
  detail: string;
  granted: boolean;
}) {
  const [on, setOn] = useState(granted);
  const { execute, status, result } = useAction(toggleConsent, {
    // Roll the switch back if the server refused, rather than leaving the UI
    // claiming a state the database does not have.
    onError: () => setOn((v) => !v),
  });

  const pending = status === "executing";

  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="font-medium text-ink-900">{label}</p>
        <p className="mt-0.5 text-sm text-pretty text-ink-500">{detail}</p>
        {result?.serverError ? (
          <p role="alert" className="mt-1 text-sm text-risk-600">
            {result.serverError}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={`${label} — ${on ? "granted" : "not granted"}`}
        disabled={pending}
        onClick={() => {
          const next = !on;
          setOn(next);
          execute({ purpose, granted: next });
        }}
        className={cn(
          "relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
          on ? "bg-brand-700" : "bg-ink-300",
          pending && "opacity-60",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
            on ? "translate-x-5.5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
