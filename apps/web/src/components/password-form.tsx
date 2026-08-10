"use client";

import { useAction } from "next-safe-action/hooks";
import { useId } from "react";
import { setPassword } from "@/actions/auth";

/**
 * Choose a password, so signing in stops costing an email.
 *
 * Optional, and framed that way. The code still works and always will — this
 * is a convenience for people who sign in often or on more than one device,
 * not a step anybody has to complete.
 *
 * There is no "confirm password" field. A confirmation catches a typo you
 * could equally catch by revealing what you typed, and it doubles the work for
 * everyone to protect the minority who mistype — while the real safety net
 * here is that a forgotten password costs one emailed code, not a support
 * ticket. Show-password is the better trade.
 */
export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const id = useId();
  const { execute, result, status } = useAction(setPassword);

  const busy = status === "executing";
  const fields = result?.validationErrors as
    | Record<string, { _errors?: string[] } | undefined>
    | undefined;

  return (
    <form
      noValidate
      className="mt-4"
      action={(formData) => execute({ password: String(formData.get("password") ?? "") })}
    >
      <label htmlFor={id} className="block text-sm font-medium text-ink-800">
        {hasPassword ? "New password" : "Password"}
      </label>

      <input
        id={id}
        name="password"
        type="password"
        // "new-password" so a password manager offers to generate and store
        // one rather than autofilling the old one into its own replacement.
        autoComplete="new-password"
        minLength={10}
        required
        aria-describedby={`${id}-help`}
        className="mt-1.5 h-12 w-full max-w-sm rounded-lg border border-ink-200 px-3 text-[15px] text-ink-900 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      />

      <p id={`${id}-help`} className="mt-1.5 text-[13px] text-ink-500">
        At least ten characters. Length beats punctuation — three unrelated
        words is a better password than P@ssw0rd.
      </p>

      {fields?.password?._errors?.[0] ? (
        <p role="alert" className="mt-1.5 text-sm text-risk-800">
          {fields.password._errors[0]}
        </p>
      ) : null}
      {result?.serverError ? (
        <p role="alert" className="mt-1.5 text-sm text-risk-800">
          {result.serverError}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="flex h-11 items-center justify-center rounded-lg bg-brand-700 px-4 text-[15px] font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
        >
          {busy ? "Saving…" : hasPassword ? "Change password" : "Set password"}
        </button>

        {result?.data?.set ? (
          <p role="status" className="text-sm text-ok-800">
            Saved. You can sign in with it next time.
          </p>
        ) : null}
      </div>
    </form>
  );
}
