"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { completePasswordReset } from "@/actions/auth";
import { PasswordField } from "@/components/ui/password-field";
import { cn } from "@/lib/utils";

const CHECK = (
  <svg aria-hidden width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ARROW_RIGHT = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

/**
 * Sets the new password inside the recovery session. On success every other
 * session is already revoked server-side; this device keeps the fresh one.
 *
 * Restyled against V2SetPass.dc.html's "set a password" card — same
 * component this redesign's join-form.tsx now shares for its own password
 * field (password-field.tsx) and live length hint, since this is the same
 * UI with a different label and a different action behind the submit.
 */
export function ResetPasswordForm() {
  const id = useId();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [long, setLong] = useState(false);
  const reset = useAction(completePasswordReset, {
    onSuccess: () => router.replace("/learn"),
  });

  useEffect(() => {
    const el = document.getElementById(`${id}-pw`) as HTMLInputElement | null;
    if (!el) return;
    const onInput = () => setLong(el.value.length >= 10);
    el.addEventListener("input", onInput);
    return () => el.removeEventListener("input", onInput);
  }, [id]);

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
      <h1 className="t-page text-ink-900">Set a new password</h1>
      <p className="mt-2 text-[16px] leading-[1.5] text-pretty text-ink-600">
        This signs out every other device — if somebody else was in your account, they are out
        now.
      </p>

      <div className="mt-6">
        <label htmlFor={`${id}-pw`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
          New password
        </label>
        <PasswordField id={`${id}-pw`} show={show} onToggle={() => setShow((s) => !s)} autoComplete="new-password" autoFocus />
      </div>
      <p className={cn("mt-1.5 flex items-center gap-2 text-[14px]", long ? "text-ok-700" : "text-ink-500")}>
        {long ? <span aria-hidden>{CHECK}</span> : null}
        <span>At least ten characters. Anything you like — no symbol rules.</span>
      </p>
      {passwordError ? <p className="mt-1.5 text-[14px] text-risk-600">{passwordError}</p> : null}
      {reset.result?.serverError ? (
        <p role="alert" className="mt-3 text-[14px] text-risk-600">
          {reset.result.serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={reset.status === "executing"}
        className="mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-500 text-[16px] font-semibold text-on-brand hover:bg-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-100 disabled:text-ink-600"
      >
        <span>{reset.status === "executing" ? "Saving…" : "Save and sign in"}</span>
        {reset.status === "executing" ? null : ARROW_RIGHT}
      </button>
    </form>
  );
}
