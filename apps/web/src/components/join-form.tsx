"use client";

import type { Route } from "next";
import { useAction } from "next-safe-action/hooks";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp } from "@/actions/auth";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

/**
 * Phone-first sign-in. One component holding both steps rather than two
 * routes: the phone number has to survive into the verify step, and putting
 * it in the URL would write it into browser history and every referrer header
 * on the page.
 */
export function JoinForm({ next }: { next: Route }) {
  const id = useId();
  const router = useRouter();
  const [phone, setPhone] = useState<string | null>(null);

  const request = useAction(requestOtp, {
    onSuccess: ({ data }) => setPhone(data?.phone ?? null),
  });
  const verify = useAction(verifyOtp, {
    onSuccess: () => router.replace(next),
  });

  if (phone) {
    return (
      <form
        noValidate
        action={(fd) => verify.execute({ phone, token: String(fd.get("token") ?? "") })}
        className="rounded-card border border-ink-200 p-6"
      >
        <h1 className="text-xl font-semibold text-ink-900">Enter the code</h1>
        <p className="mt-1 text-sm text-ink-500">
          Sent to {phone}.{" "}
          <button
            type="button"
            onClick={() => {
              setPhone(null);
              request.reset();
            }}
            className="underline hover:text-brand-800"
          >
            Wrong number?
          </button>
        </p>

        <label htmlFor={`${id}-token`} className="mt-5 block text-sm font-medium text-ink-700">
          Six-digit code
        </label>
        <input
          id={`${id}-token`}
          name="token"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          className="mt-1 block w-full rounded-card border border-ink-300 px-3 py-2 font-mono text-lg tracking-[0.4em] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700"
        />
        {firstError(verify.result?.validationErrors as FieldErrors, "token") ? (
          <p className="mt-1 text-sm text-risk-600">
            {firstError(verify.result?.validationErrors as FieldErrors, "token")}
          </p>
        ) : null}
        {verify.result?.serverError ? (
          <p role="alert" className="mt-3 text-sm text-risk-600">
            {verify.result.serverError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={verify.status === "executing"}
          className={cn(
            "mt-5 w-full rounded-card px-4 py-3 font-medium text-white",
            "bg-brand-700 hover:bg-brand-800 disabled:bg-ink-500",
          )}
        >
          {verify.status === "executing" ? "Checking…" : "Continue"}
        </button>
      </form>
    );
  }

  return (
    <form
      noValidate
      action={(fd) => request.execute({ phone: String(fd.get("phone") ?? "") })}
      className="rounded-card border border-ink-200 p-6"
    >
      <h1 className="text-xl font-semibold text-ink-900">Sign in</h1>
      <p className="mt-1 text-sm text-ink-500">
        We send a code by SMS. No password to forget.
      </p>

      <label htmlFor={`${id}-phone`} className="mt-5 block text-sm font-medium text-ink-700">
        Mobile number
      </label>
      <input
        id={`${id}-phone`}
        name="phone"
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        placeholder="98765 43210"
        autoFocus
        className="mt-1 block w-full rounded-card border border-ink-300 px-3 py-2 text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700"
      />
      {firstError(request.result?.validationErrors as FieldErrors, "phone") ? (
        <p className="mt-1 text-sm text-risk-600">
          {firstError(request.result?.validationErrors as FieldErrors, "phone")}
        </p>
      ) : null}
      {request.result?.serverError ? (
        <p role="alert" className="mt-3 text-pretty text-sm text-risk-600">
          {request.result.serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={request.status === "executing"}
        className={cn(
          "mt-5 w-full rounded-card px-4 py-3 font-medium text-white",
          "bg-brand-700 hover:bg-brand-800 disabled:bg-ink-500",
        )}
      >
        {request.status === "executing" ? "Sending…" : "Send code"}
      </button>

      <p className="mt-3 text-xs text-ink-500">
        Jintu is open to people aged 18 and over. We ask you to confirm that on
        the next step.
      </p>
    </form>
  );
}
