"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useId, useRef, useState } from "react";
import { requestOtp, verifyOtp } from "@/actions/auth";
import { PasswordSignIn } from "@/components/password-sign-in";
import { getPublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

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

  // AUTH.md v2: Google first and visually dominant — but only when the
  // Supabase project actually has the provider configured. The public
  // settings endpoint says so, which means the button appears the moment
  // the owner finishes the console setup, with no deploy in between, and a
  // half-configured project never shows a button that would dead-end.
  const [googleReady, setGoogleReady] = useState(false);
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    try {
      const env = getPublicEnv();
      fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
        headers: { apikey: env.supabaseKey },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((settings: { external?: { google?: boolean } } | null) => {
          if (!cancelled && settings?.external?.google) setGoogleReady(true);
        })
        .catch(() => {});
    } catch {
      // Supabase not configured at all — the dialog's other paths will say so.
    }
    return () => {
      cancelled = true;
    };
  }, [open]);

  const [googleBusy, setGoogleBusy] = useState(false);
  const continueWithGoogle = async () => {
    // Full-page redirect: the pending intent (the thing that opened this
    // dialog) does not survive it, unlike the OTP path which signs in in
    // place. The person lands back on the same page signed in and presses
    // the button again — one extra tap, traded for one-tap auth.
    setGoogleBusy(true);
    const supabase = createClient();
    const next = `${window.location.pathname}${window.location.search}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setGoogleBusy(false);
  };

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
        <h2 id={`${id}-title`} className="text-lg font-medium text-ink-900">
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

        {stage === "email" && googleReady ? (
          <>
            <button
              type="button"
              disabled={busy || googleBusy}
              onClick={continueWithGoogle}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-ink-200 px-5 font-medium text-ink-800 hover:border-brand-600 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:text-ink-500"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-5">
                <path
                  fill="#4285F4"
                  d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.28a7.21 7.21 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44A11.98 11.98 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
                />
              </svg>
              {googleBusy ? "Opening Google…" : "Continue with Google"}
            </button>
            <div aria-hidden className="mt-4 flex items-center gap-3 text-xs text-ink-500">
              <span className="h-px flex-1 bg-ink-100" />
              or
              <span className="h-px flex-1 bg-ink-100" />
            </div>
          </>
        ) : null}

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
              className="mt-3 h-12 text-sm text-ink-500 underline hover:text-ink-900"
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
