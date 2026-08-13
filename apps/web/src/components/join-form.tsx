"use client";

import type { Route } from "next";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import {
  checkEmail,
  requestOtp,
  requestPasswordReset,
  setPassword,
  signInWithPassword,
  verifyOtp,
} from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

const FIELD =
  "h-12 w-full rounded-lg border border-ink-200 bg-white px-3 text-ink-900 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700";

const BUTTON =
  "mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500";

/**
 * The v3 flow (AUTH.md): one email field, and the system decides the door.
 *
 *   entry ──(unknown email)──► code ──► create password ──► onboarding
 *         └─(known email)────► password ──► in
 *
 * Google sits above all of it — one tap, no code, no password. One component
 * holding every step rather than routes: the address has to survive between
 * steps, and putting it in the URL writes it into history and referrers.
 *
 * Verify FIRST, then set a password: no account ever exists half-made, and
 * nobody types a password before knowing the address works.
 */
export function JoinForm({ next }: { next: Route }) {
  const id = useId();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"entry" | "code" | "create" | "password" | "forgot">("entry");
  const [showPw, setShowPw] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const send = useAction(requestOtp, {
    onSuccess: () => {
      setStep("code");
      setResendIn(30);
    },
  });
  const check = useAction(checkEmail, {
    onSuccess: ({ data, input }) => {
      if (data?.registered) setStep("password");
      else send.execute({ email: (input as { email: string }).email });
    },
  });
  const verify = useAction(verifyOtp, { onSuccess: () => setStep("create") });
  const create = useAction(setPassword, {
    // New account: the 18+ confirmation and the consent choices happen where
    // the profile row is created — the next screen — because a checkbox is
    // only real on the form whose submit the constraint can refuse.
    onSuccess: () => router.replace(`/onboarding?next=${encodeURIComponent(next)}` as Route),
  });
  const signIn = useAction(signInWithPassword, { onSuccess: () => router.replace(next) });
  const forgot = useAction(requestPasswordReset);

  const googleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  };

  const busy = check.status === "executing" || send.status === "executing";

  // ── step 2a: the code ──────────────────────────────────────────────────────
  if (step === "code") {
    return (
      <form
        noValidate
        action={(fd) => verify.execute({ email, token: String(fd.get("token") ?? "") })}
      >
        <h1 className="text-2xl font-medium tracking-tight text-ink-900">Check your email</h1>
        <p className="mt-2 text-pretty text-ink-600">
          We sent a six-digit code to {email}.{" "}
          <button
            type="button"
            onClick={() => {
              setStep("entry");
              send.reset();
              verify.reset();
            }}
            className="text-brand-700 underline hover:text-brand-800"
          >
            Change email
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
          // One field, not six boxes: six inputs break paste — which is how a
          // code gets out of an email — and OTP autofill on both platforms
          // targets a single input. The tracking makes it read as six digits.
          onChange={(e) => {
            if (e.currentTarget.value.length === 6) e.currentTarget.form?.requestSubmit();
          }}
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

        <button
          type="button"
          disabled={resendIn > 0 || send.status === "executing"}
          onClick={() => send.execute({ email })}
          className="mt-3 h-12 text-sm text-brand-700 underline hover:text-brand-800 disabled:text-ink-500 disabled:no-underline"
        >
          {resendIn > 0
            ? `Resend in 0:${String(resendIn).padStart(2, "0")}`
            : "Resend the code"}
        </button>
      </form>
    );
  }

  // ── step 2b: set a password ────────────────────────────────────────────────
  if (step === "create") {
    return (
      <form
        noValidate
        action={(fd) =>
          create.execute({
            password: String(fd.get("password") ?? ""),
            remember: fd.get("remember") === "on",
          })
        }
      >
        <h1 className="text-2xl font-medium tracking-tight text-ink-900">Set a password</h1>
        <p className="mt-2 text-pretty text-ink-600">
          Email verified. Pick something you will remember.
        </p>

        <PasswordField id={`${id}-newpw`} show={showPw} onToggle={() => setShowPw((s) => !s)} autoComplete="new-password" />
        <p className="mt-1.5 text-sm text-pretty text-ink-500">
          At least ten characters. Anything you like — no symbol rules.
        </p>
        {firstError(create.result?.validationErrors as FieldErrors, "password") ? (
          <p className="mt-1.5 text-sm text-risk-600">
            {firstError(create.result?.validationErrors as FieldErrors, "password")}
          </p>
        ) : null}
        {create.result?.serverError ? (
          <p role="alert" className="mt-3 text-sm text-risk-600">
            {create.result.serverError}
          </p>
        ) : null}

        <StaySignedIn id={`${id}-stay`} />

        <button type="submit" disabled={create.status === "executing"} className={BUTTON}>
          {create.status === "executing" ? "Saving…" : "Continue"}
        </button>

        <p className="mt-3 text-sm text-pretty text-ink-500">
          Next: confirm you are 18 or older and choose what we may send you.
        </p>
      </form>
    );
  }

  // ── step 3: returning — password ───────────────────────────────────────────
  if (step === "password") {
    return (
      <form
        noValidate
        action={(fd) =>
          signIn.execute({
            email,
            password: String(fd.get("password") ?? ""),
            remember: fd.get("remember") === "on",
          })
        }
      >
        <h1 className="text-2xl font-medium tracking-tight text-ink-900">Welcome back</h1>
        <p className="mt-2 text-ink-600">
          {email}{" "}
          <button
            type="button"
            onClick={() => {
              setStep("entry");
              signIn.reset();
            }}
            className="text-brand-700 underline hover:text-brand-800"
          >
            Change
          </button>
        </p>

        <PasswordField id={`${id}-pw`} show={showPw} onToggle={() => setShowPw((s) => !s)} autoComplete="current-password" />
        {signIn.result?.serverError ? (
          <p role="alert" className="mt-3 text-sm text-risk-600">
            {signIn.result.serverError}
          </p>
        ) : null}

        <StaySignedIn id={`${id}-stay2`} />

        <button type="submit" disabled={signIn.status === "executing"} className={BUTTON}>
          {signIn.status === "executing" ? "Signing in…" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={() => setStep("forgot")}
          className="mt-3 h-12 text-sm text-brand-700 underline hover:text-brand-800"
        >
          Forgot password?
        </button>
      </form>
    );
  }

  // ── forgot ─────────────────────────────────────────────────────────────────
  if (step === "forgot") {
    return (
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-ink-900">Reset your password</h1>
        {forgot.result?.data?.sent ? (
          <p className="mt-2 text-pretty text-ink-600" role="status">
            If {email} has an account, a reset link is on its way. It works
            once and expires in an hour.
          </p>
        ) : (
          <>
            <p className="mt-2 text-pretty text-ink-600">
              We email a single-use link to {email} that lets you set a new
              password.
            </p>
            {forgot.result?.serverError ? (
              <p role="alert" className="mt-3 text-sm text-risk-600">
                {forgot.result.serverError}
              </p>
            ) : null}
            <button
              type="button"
              disabled={forgot.status === "executing"}
              onClick={() => forgot.execute({ email })}
              className={BUTTON}
            >
              {forgot.status === "executing" ? "Sending…" : "Email me the link"}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            setStep("password");
            forgot.reset();
          }}
          className="mt-3 h-12 text-sm text-brand-700 underline hover:text-brand-800"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  // ── entry ──────────────────────────────────────────────────────────────────
  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight text-ink-900">Start learning</h1>

      {/* Primary on purpose: expect most signups to take this and never see
          a code or a password at all. */}
      <button type="button" onClick={googleSignIn} className={cn(BUTTON, "mt-8")}>
        Continue with Google
      </button>

      <div className="mt-6 flex items-center gap-3 text-sm text-ink-500" aria-hidden>
        <span className="h-px flex-1 bg-ink-100" />
        or
        <span className="h-px flex-1 bg-ink-100" />
      </div>

      <form
        noValidate
        action={(fd) => {
          const value = String(fd.get("email") ?? "");
          setEmail(value.trim().toLowerCase());
          check.execute({ email: value });
        }}
      >
        <label htmlFor={`${id}-email`} className="mt-6 block text-sm font-medium text-ink-700">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="you@example.com"
          defaultValue={email}
          aria-invalid={
            firstError(check.result?.validationErrors as FieldErrors, "email") ? true : undefined
          }
          className={cn(FIELD, "mt-1.5")}
        />
        {firstError(check.result?.validationErrors as FieldErrors, "email") ? (
          <p className="mt-1.5 text-sm text-pretty text-risk-600">
            {firstError(check.result?.validationErrors as FieldErrors, "email")}
          </p>
        ) : null}
        <p className="mt-1.5 text-sm text-pretty text-ink-500">
          Use an address you will still have after you graduate — a college
          address you lose access to is an account you cannot get back into.
        </p>
        {check.result?.serverError || send.result?.serverError ? (
          <p role="alert" className="mt-3 text-sm text-pretty text-risk-600">
            {check.result?.serverError ?? send.result?.serverError}
          </p>
        ) : null}

        <button type="submit" disabled={busy} className={BUTTON}>
          {busy ? "One moment…" : "Continue"}
        </button>

        <p className="mt-3 text-sm text-pretty text-ink-500">
          New here, we email a six-digit code first. Jintu is open to people
          aged 18 and over.
        </p>
      </form>
    </div>
  );
}

function PasswordField({
  id,
  show,
  onToggle,
  autoComplete,
}: {
  id: string;
  show: boolean;
  onToggle: () => void;
  autoComplete: "new-password" | "current-password";
}) {
  return (
    <>
      <label htmlFor={id} className="mt-6 block text-sm font-medium text-ink-700">
        Password
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          name="password"
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          autoFocus
          className={cn(FIELD, "pr-14")}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-sm text-ink-600 hover:text-ink-900"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </>
  );
}

function StaySignedIn({ id }: { id: string }) {
  return (
    <label htmlFor={id} className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 text-[15px] text-ink-700">
      <input
        id={id}
        name="remember"
        type="checkbox"
        defaultChecked
        className="size-5 shrink-0 accent-brand-700"
      />
      Stay signed in on this device
    </label>
  );
}
