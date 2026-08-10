"use client";

import { useAction } from "next-safe-action/hooks";
import { useId } from "react";
import { signInWithPassword } from "@/actions/auth";

/**
 * Email and password, as an alternative to waiting for a code.
 *
 * One component used by both places that sign people in — the /join page and
 * the dialog on the homepage. Those two already duplicate the OTP flow between
 * them, which is a debt worth naming rather than doubling: adding password
 * entry twice would mean two implementations of the thing that holds a
 * password.
 *
 * Deliberately not the default. A first-time visitor has no password, and a
 * form that leads with one asks a stranger to remember something they never
 * set. The code stays the front door; this is for people coming back.
 */
export function PasswordSignIn({
  onSignedIn,
  onUseCode,
}: {
  onSignedIn: () => void;
  onUseCode: () => void;
}) {
  const id = useId();

  const { execute, result, status } = useAction(signInWithPassword, {
    onSuccess: ({ data }) => {
      if (data?.signedIn) onSignedIn();
    },
  });

  const busy = status === "executing";
  const fields = result?.validationErrors as
    | Record<string, { _errors?: string[] } | undefined>
    | undefined;

  return (
    <form
      noValidate
      className="mt-5"
      action={(formData) =>
        execute({
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        })
      }
    >
      <label htmlFor={`${id}-email`} className="block text-sm font-medium text-ink-800">
        Email
      </label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        autoComplete="email"
        required
        className="mt-1.5 h-12 w-full rounded-lg border border-ink-200 px-3 text-[15px] text-ink-900 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      />
      {fields?.email?._errors?.[0] ? (
        <p role="alert" className="mt-1.5 text-sm text-risk-800">
          {fields.email._errors[0]}
        </p>
      ) : null}

      <label htmlFor={`${id}-pw`} className="mt-4 block text-sm font-medium text-ink-800">
        Password
      </label>
      <input
        id={`${id}-pw`}
        name="password"
        type="password"
        // "current-password", not "new-password": this tells a password manager
        // to offer what it has rather than to generate something.
        autoComplete="current-password"
        required
        className="mt-1.5 h-12 w-full rounded-lg border border-ink-200 px-3 text-[15px] text-ink-900 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      />

      {result?.serverError ? (
        <p role="alert" className="mt-2 text-sm text-risk-800">
          {result.serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 px-5 text-[15px] font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>

      {/*
        Also the forgotten-password link, which is why there is no separate
        one. Asking for a code proves the same thing a reset email would, and
        it is a flow that already exists rather than one more to maintain.
      */}
      <button
        type="button"
        onClick={onUseCode}
        disabled={busy}
        className="mt-3 h-11 text-sm text-ink-500 underline hover:text-ink-900"
      >
        Email me a code instead — also how to get in without your password
      </button>
    </form>
  );
}
