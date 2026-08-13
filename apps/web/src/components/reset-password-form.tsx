"use client";

import { useAction } from "next-safe-action/hooks";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { completePasswordReset } from "@/actions/auth";
import { cn } from "@/lib/utils";

const FIELD =
  "h-12 w-full rounded-lg border border-ink-200 bg-white px-3 text-ink-900 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700";

/**
 * Sets the new password inside the recovery session. On success every other
 * session is already revoked server-side; this device keeps the fresh one.
 */
export function ResetPasswordForm() {
  const id = useId();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const reset = useAction(completePasswordReset, {
    onSuccess: () => router.replace("/learn"),
  });

  const passwordError = (
    reset.result?.validationErrors as
      | Record<string, { _errors?: string[] } | undefined>
      | undefined
  )?.password?._errors?.[0];

  return (
    <form
      noValidate
      action={(fd) => reset.execute({ password: String(fd.get("password") ?? "") })}
    >
      <h1 className="text-2xl font-medium tracking-tight text-ink-900">Set a new password</h1>
      <p className="mt-2 text-pretty text-ink-600">
        This signs out every other device — if somebody else was in your
        account, they are out now.
      </p>

      <label htmlFor={`${id}-pw`} className="mt-6 block text-sm font-medium text-ink-700">
        New password
      </label>
      <div className="relative mt-1.5">
        <input
          id={`${id}-pw`}
          name="password"
          type={show ? "text" : "password"}
          autoComplete="new-password"
          autoFocus
          className={cn(FIELD, "pr-14")}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-sm text-ink-600 hover:text-ink-900"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <p className="mt-1.5 text-sm text-pretty text-ink-500">
        At least ten characters. Anything you like — no symbol rules.
      </p>
      {passwordError ? <p className="mt-1.5 text-sm text-risk-600">{passwordError}</p> : null}
      {reset.result?.serverError ? (
        <p role="alert" className="mt-3 text-sm text-risk-600">
          {reset.result.serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={reset.status === "executing"}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
      >
        {reset.status === "executing" ? "Saving…" : "Save and sign in"}
      </button>
    </form>
  );
}
