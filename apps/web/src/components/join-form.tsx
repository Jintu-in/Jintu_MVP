"use client";

import type { Route } from "next";
import { useAction } from "next-safe-action/hooks";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp } from "@/actions/auth";
import { Steps } from "@/components/steps";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

const FIELD =
  "h-12 w-full rounded-lg border border-ink-200 bg-white px-3 text-ink-900 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700";

const BUTTON =
  "mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500";

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
      >
        <Steps current={2} label="Verify code" />

        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-ink-900">
          Enter the code
        </h1>
        <p className="mt-2 text-ink-600">
          Sent to {phone}.{" "}
          <button
            type="button"
            onClick={() => {
              setPhone(null);
              request.reset();
            }}
            className="text-brand-700 underline hover:text-brand-800"
          >
            Wrong number?
          </button>
        </p>

        <label htmlFor={`${id}-token`} className="mt-6 block text-sm font-medium text-ink-700">
          Six-digit code
        </label>
        <input
          id={`${id}-token`}
          name="token"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          // One field, not six boxes: six inputs break SMS autofill on Android
          // and paste, and every one of them needs its own label to be usable
          // without sight. The tracking is what makes it read as six digits.
          className={cn(FIELD, "mt-1.5 text-center font-mono text-xl tracking-[0.5em]")}
        />
        {firstError(verify.result?.validationErrors as FieldErrors, "token") ? (
          <p className="mt-1.5 text-sm text-risk-600">
            {firstError(verify.result?.validationErrors as FieldErrors, "token")}
          </p>
        ) : null}
        {verify.result?.serverError ? (
          <p role="alert" className="mt-3 text-sm text-risk-600">
            {verify.result.serverError}
          </p>
        ) : null}

        <button type="submit" disabled={verify.status === "executing"} className={BUTTON}>
          {verify.status === "executing" ? "Checking…" : "Continue"}
        </button>
      </form>
    );
  }

  return (
    <form
      noValidate
      action={(fd) => request.execute({ phone: String(fd.get("phone") ?? "") })}
    >
      <Steps current={1} label="Your number" />

      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-ink-900">
        Enter your phone number
      </h1>
      <p className="mt-2 text-ink-600">
        We send a six-digit code by SMS. No password to forget.
      </p>

      <label htmlFor={`${id}-phone`} className="mt-6 block text-sm font-medium text-ink-700">
        Mobile number
      </label>
      {/* The +91 is display only — the field submits the ten digits and the
          contract normalises them. It still accepts a pasted +91… number. */}
      <div className="mt-1.5 flex h-12 w-full items-center rounded-lg border border-ink-200 bg-white focus-within:border-brand-700 focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-brand-700">
        <span
          id={`${id}-cc`}
          className="flex h-full items-center border-r border-ink-100 px-3 text-ink-600"
        >
          +91
        </span>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="98765 43210"
          // The prefix is only painted next to the field, so name it here too —
          // otherwise the country code is information only sighted users get.
          aria-describedby={`${id}-cc`}
          autoFocus
          className="h-full min-w-0 flex-1 rounded-r-lg bg-transparent px-3 text-ink-900 focus-visible:outline-none"
        />
      </div>
      {firstError(request.result?.validationErrors as FieldErrors, "phone") ? (
        <p className="mt-1.5 text-sm text-risk-600">
          {firstError(request.result?.validationErrors as FieldErrors, "phone")}
        </p>
      ) : null}
      {request.result?.serverError ? (
        <p role="alert" className="mt-3 text-pretty text-sm text-risk-600">
          {request.result.serverError}
        </p>
      ) : null}

      <button type="submit" disabled={request.status === "executing"} className={BUTTON}>
        {request.status === "executing" ? "Sending…" : "Send code"}
      </button>

      <p className="mt-3 text-sm text-ink-500">
        Jintu is open to people aged 18 and over. We ask you to confirm that on
        the next step.
      </p>
    </form>
  );
}
