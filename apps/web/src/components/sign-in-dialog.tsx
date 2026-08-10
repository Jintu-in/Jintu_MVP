"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useId, useRef, useState } from "react";
import { requestOtp, verifyOtp } from "@/actions/auth";
import { PasswordSignIn } from "@/components/password-sign-in";

/**
 * Sign in without leaving the page.
 *
 * This exists because of what sign-in here actually is: a six-digit code by
 * email, not a magic link. A magic link would take the person away mid-thought
 * and bring them back to a blank box, so the draft would have to survive a
 * round trip through storage and be resumed on return — a lot of machinery,
 * and every piece of it a place to lose what somebody typed. A code can be
 * pasted into a dialog while the request sits untouched in the state behind it.
 *
 * <dialog> rather than a div with a high z-index. The browser gives the modal
 * behaviour for free and gives it correctly: focus is trapped, the rest of the
 * page is inert to assistive technology, Escape closes, and the backdrop is a
 * real pseudo-element rather than a sibling that has to be kept in sync.
 */

// "password" is an alternative entry point, not a step: email -> code is the
// original path and is untouched. Someone who has set a password can switch to
// it and skip the email entirely, which is the point — the code is the thing
// that costs a send.
type Stage = "email" | "code" | "password";

export function SignInDialog({
  open,
  onClose,
  onSignedIn,
  reason,
}: {
  open: boolean;
  onClose: () => void;
  onSignedIn: () => void;
  reason: string;
}) {
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");

  const send = useAction(requestOtp, {
    onSuccess: ({ data }) => {
      if (data?.sent) setStage("code");
    },
  });

  const verify = useAction(verifyOtp, {
    onSuccess: ({ data }) => {
      if (data?.verified) onSignedIn();
    },
  });

  // showModal() rather than the `open` attribute: only the former makes it
  // modal. Setting open={true} renders a dialog that looks the same and traps
  // nothing.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // Reset when it reopens, so a previous half-finished attempt is not still on
  // screen — including a stale "code sent" state for an address the person has
  // since changed their mind about.
  useEffect(() => {
    if (open) {
      setStage("email");
      send.reset();
      verify.reset();
    }
    // Intentionally keyed on `open` alone: this is a reset, and adding the
    // action objects would re-run it on every status change.
  }, [open]);

  const busy = send.status === "executing" || verify.status === "executing";

  return (
    <dialog
      ref={ref}
      // Escape fires `cancel`, and the parent owns `open`, so without this the
      // dialog closes while the state that opened it still says it is open —
      // and it can never be reopened.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Clicking the backdrop targets the dialog itself; clicking anything
        // inside targets a child.
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby={`${id}-title`}
      className="w-[min(28rem,calc(100vw-2rem))] rounded-card border border-ink-100 bg-white p-0 text-ink-900 backdrop:bg-ink-900/40"
    >
      <div className="p-6">
        <h2 id={`${id}-title`} className="text-lg font-semibold text-ink-900">
          {stage === "code"
            ? "Check your email"
            : stage === "password"
              ? "Sign in with your password"
              : "Sign in to send this"}
        </h2>
        <p className="mt-1.5 text-pretty text-ink-600">
          {stage === "code"
            ? `We sent a six-digit code to ${email}. It is good for a few minutes.`
            : reason}
        </p>

        {stage === "password" ? (
          <PasswordSignIn onSignedIn={onSignedIn} onUseCode={() => setStage("email")} />
        ) : stage === "email" ? (
          <form
            noValidate
            className="mt-5"
            action={(formData) => {
              const value = String(formData.get("email") ?? "");
              setEmail(value.trim().toLowerCase());
              send.execute({ email: value });
            }}
          >
            <label htmlFor={`${id}-email`} className="block text-sm font-medium text-ink-800">
              Email
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              required
              className="mt-1.5 h-12 w-full rounded-lg border border-ink-200 px-3 text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            />
            <Errors result={send.result} field="email" />

            <Actions busy={busy} onClose={onClose} label={busy ? "Sending…" : "Send me a code"} />

            {/*
              Offered second, not first. A first-time visitor has no password,
              and leading with one asks a stranger to remember something they
              never set. This is for the people coming back — and every one of
              them who takes it is an email we do not send against a quota of
              roughly two an hour.
            */}
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                send.reset();
                setStage("password");
              }}
              className="mt-3 h-11 text-sm text-ink-500 underline hover:text-ink-900"
            >
              I have a password
            </button>
          </form>
        ) : (
          <form
            noValidate
            className="mt-5"
            action={(formData) => verify.execute({ email, token: String(formData.get("token") ?? "") })}
          >
            <label htmlFor={`${id}-code`} className="block text-sm font-medium text-ink-800">
              Six-digit code
            </label>
            <input
              id={`${id}-code`}
              name="token"
              // Not type="number": a spinner on a code is nonsense, and Android
              // keyboards have historically eaten leading characters on it.
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              required
              className="mt-1.5 h-12 w-40 rounded-lg border border-ink-200 px-3 font-mono text-lg tracking-[0.3em] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            />
            <Errors result={verify.result} field="token" />

            <Actions busy={busy} onClose={onClose} label={busy ? "Checking…" : "Sign in"} />

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                verify.reset();
                setStage("email");
              }}
              className="mt-3 text-sm text-ink-500 underline hover:text-ink-900"
            >
              Use a different address
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}

/**
 * Loose on purpose. next-safe-action derives a different result type per
 * action, and this component renders two of them; the only fields it reads
 * are these, so it asks for these rather than for the exact union.
 */
type ActionResult = {
  serverError?: string | undefined;
  validationErrors?: unknown;
};

function Errors({ result, field }: { result: ActionResult | undefined; field: string }) {
  const fields = result?.validationErrors as
    | Record<string, { _errors?: string[] } | undefined>
    | undefined;
  const message = fields?.[field]?._errors?.[0] ?? result?.serverError;
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 text-sm text-risk-800">
      {message}
    </p>
  );
}

function Actions({
  busy,
  onClose,
  label,
}: {
  busy: boolean;
  onClose: () => void;
  label: string;
}) {
  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row-reverse">
      <button
        type="submit"
        disabled={busy}
        className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
      >
        {label}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex h-12 items-center justify-center rounded-lg border border-ink-200 px-5 font-medium text-ink-800 hover:border-brand-600 hover:text-brand-800"
      >
        Cancel
      </button>
    </div>
  );
}
