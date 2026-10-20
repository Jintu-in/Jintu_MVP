"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { setPassword } from "@/actions/auth";
import { PasswordField } from "@/components/ui/password-field";
import { BackIcon, LockIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const CHECK = (
  <svg aria-hidden width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/**
 * /settings/account — restyled against V2Account.dc.html (no password yet)
 * and V2AccountSet.dc.html (one set). Same two-state split, same
 * setPassword action the sign-up flow uses (actions/auth.ts) — the only
 * difference is the label and the button's own words, matching each
 * mockup's own copy.
 *
 * One real deviation from the mockup, consistent with join-form.tsx's own
 * documented ones: "at least 8 characters" stays ten, because
 * setPasswordInput (packages/contracts/src/auth.ts) enforces ten, and a
 * form that claims eight while the server refuses it at ten is a worse
 * experience than a form that tells the truth.
 */
export function AccountPage({
  email,
  passwordSetAt,
}: {
  email: string;
  passwordSetAt: string | null;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const [long, setLong] = useState(false);
  const hasPassword = Boolean(passwordSetAt);
  const { execute, result, status } = useAction(setPassword);

  useEffect(() => {
    const el = document.getElementById(`${id}-pw`) as HTMLInputElement | null;
    if (!el) return;
    const onInput = () => setLong(el.value.length >= 10);
    el.addEventListener("input", onInput);
    return () => el.removeEventListener("input", onInput);
  }, [id]);

  const error = (
    result?.validationErrors as Record<string, { _errors?: string[] } | undefined> | undefined
  )?.password?._errors?.[0];

  return (
    <>
      <Link
        href="/settings"
        className="-ml-2 inline-flex h-12 items-center gap-1.5 px-2 text-[14px] text-brand-700"
      >
        <BackIcon />
        Settings
      </Link>

      <h1 className="mt-2 t-page text-ink-900">Email and password</h1>

      <div className="mt-5 flex h-14 items-center gap-3 rounded-2xl bg-white px-4">
        <LockIcon className="flex-none text-ink-500" />
        <div className="min-w-0 flex-1">
          <div className="text-[12px] leading-[16px] text-ink-500">Signed in as</div>
          <div className="truncate text-[15px] leading-[20px] font-medium text-ink-900">{email}</div>
        </div>
      </div>

      <form
        noValidate
        className="mt-5"
        action={(fd) => execute({ password: String(fd.get("password") ?? "") })}
      >
        <label htmlFor={`${id}-pw`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
          {hasPassword ? "Change password" : "Set a password"}
        </label>
        {hasPassword && passwordSetAt ? (
          <p className="mb-2 font-mono text-[12.5px] text-ink-500">set {formatDate(passwordSetAt)}</p>
        ) : (
          <p className="mb-2 text-[13px] text-ink-500">not set — a code by email always signs you in</p>
        )}
        <PasswordField
          id={`${id}-pw`}
          show={show}
          onToggle={() => setShow((s) => !s)}
          autoComplete="new-password"
        />
        <p className={cn("mt-1.5 flex items-center gap-2 text-[14px]", long ? "text-ok-700" : "text-ink-500")}>
          {long ? <span aria-hidden>{CHECK}</span> : null}
          <span>At least ten characters. Anything you like — no symbol rules.</span>
        </p>
        {error ? <p className="mt-1.5 text-[14px] text-risk-600">{error}</p> : null}
        {result?.serverError ? (
          <p role="alert" className="mt-1.5 text-[14px] text-risk-600">
            {result.serverError}
          </p>
        ) : null}
        {result?.data?.set ? (
          <p role="status" className="mt-1.5 text-[14px] text-ok-700">
            Saved. Every other device is now signed out.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "executing"}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-night-900 text-[16px] font-semibold text-on-night hover:bg-night-950 disabled:bg-ink-100 disabled:text-ink-600"
        >
          {status === "executing" ? "Saving…" : hasPassword ? "Save new password" : "Save password"}
        </button>

        {hasPassword ? (
          <p className="mt-3 text-[13px] leading-[1.6] text-ink-500">
            Forget it and you ask for a code, so there is nothing to reset.
          </p>
        ) : (
          <p className="mt-3 text-[13px] leading-[1.6] text-ink-500">
            Optional — the email code always works. This just saves waiting for one.
          </p>
        )}
      </form>
    </>
  );
}
