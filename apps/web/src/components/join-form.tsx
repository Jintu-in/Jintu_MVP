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
import { Steps } from "@/components/steps";
import { PasswordField } from "@/components/ui/password-field";
import { FieldInput, FieldShell } from "@/components/ui/field-shell";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

const BUTTON =
  "mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-500 text-[16px] font-semibold text-on-brand hover:bg-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-100 disabled:text-ink-600";

const BACK_ARROW = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

const ARROW_RIGHT = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const CHECK = (
  <svg aria-hidden width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/** A step's back button — present on every screen but the first, per
 *  V2Code/V2Password/V2SetPass/V2Reset (V2Login's own dark full-bleed
 *  header is deliberately not reproduced here — see this file's header
 *  comment on why the shared SiteNav stays instead of a second header). */
function BackRow({ onBack, trailing }: { onBack: () => void; trailing?: React.ReactNode }) {
  return (
    <div className="flex h-11 items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="flex size-11 items-center justify-center rounded-full bg-white text-ink-900"
      >
        {BACK_ARROW}
      </button>
      {trailing}
    </div>
  );
}

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
 *
 * Restyled against V2Login/V2Code/V2Password/V2SetPass/V2Reset.dc.html.
 * Three deliberate deviations from the mockup, all preserving real,
 * already-reasoned behaviour over a pixel match:
 *
 *   - The code field stays one real input (not six boxes) — paste and
 *     platform OTP-autofill both target a single field, and splitting it
 *     would break the thing the comment on the field itself already
 *     explains. Auto-submits on the sixth digit exactly as before; the
 *     "Continue" button is still there for anyone who pastes oddly.
 *   - "At least ten characters" stays ten, not the mockup's eight —
 *     setPasswordInput in packages/contracts/src/auth.ts enforces ten.
 *   - The "forgot password" step keeps describing the real mechanism (a
 *     single-use emailed link, requestPasswordReset) rather than the
 *     mockup's code-based copy — the real reset path is link-based; see
 *     reset-password-form.tsx and auth/reset/page.tsx.
 *   - No separate dark auth header: (auth)/layout.tsx already made that
 *     call, on the record, before this redesign ("these used to wear a
 *     thinner, separate header... the product looked like two products").
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
        <BackRow
          onBack={() => {
            setStep("entry");
            send.reset();
            verify.reset();
          }}
        />
        <div className="mt-3">
          <Steps current={1} label="Check your email" />
        </div>

        <h1 className="t-page mt-6 text-ink-900">Check your email</h1>
        <p className="mt-2 text-[16px] leading-[1.5] text-pretty text-ink-600">
          We sent a 6-digit code to <span className="font-semibold text-ink-900">{email}</span>.
        </p>

        <label htmlFor={`${id}-token`} className="sr-only">
          Six-digit code
        </label>
        <input
          id={`${id}-token`}
          name="token"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          // One field, not six boxes — see this file's header comment. The
          // wide tracking is what gives it the spaced-digit look the design
          // gets from six real boxes, without the paste/autofill cost.
          onChange={(e) => {
            if (e.currentTarget.value.length === 6) e.currentTarget.form?.requestSubmit();
          }}
          className="mt-6 flex h-16 w-full items-center justify-center rounded-2xl border border-ink-200 bg-white text-center font-mono text-[28px] text-ink-900 tracking-[0.5em] focus-visible:border-link focus-visible:outline-none"
        />
        {firstError(verify.result?.validationErrors as FieldErrors, "token") ? (
          <p className="mt-1.5 text-[14px] text-risk-600">
            {firstError(verify.result?.validationErrors as FieldErrors, "token")}
          </p>
        ) : null}
        {verify.result?.serverError ? (
          <p role="alert" className="mt-3 text-[14px] text-risk-600">
            {verify.result.serverError}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-1">
          <p className="text-[14.5px] leading-[1.5] text-ink-600">
            Nothing yet? You can ask for a new code in{" "}
            {resendIn > 0 ? (
              <span className="font-mono text-[13.5px] font-medium text-ink-900">
                0:{String(resendIn).padStart(2, "0")}
              </span>
            ) : (
              <button
                type="button"
                disabled={send.status === "executing"}
                onClick={() => send.execute({ email })}
                className="font-semibold text-link hover:text-link-hover disabled:text-ink-500"
              >
                resend it
              </button>
            )}
          </p>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-[20px] bg-white p-4 text-[14.5px] leading-[1.45] text-ink-600">
          <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-none text-link">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <span>
            The code proves the address is yours before any account exists. Check spam if it has
            not arrived in a minute.
          </span>
        </div>

        <button type="submit" disabled={verify.status === "executing"} className={BUTTON}>
          <span>{verify.status === "executing" ? "Checking…" : "Continue"}</span>
          {verify.status === "executing" ? null : ARROW_RIGHT}
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
        <BackRow onBack={() => setStep("code")} />
        <div className="mt-3">
          <Steps current={2} label="Set a password" />
        </div>

        <span className="mt-6 flex h-7 w-fit items-center gap-1.5 rounded-xl bg-ok-bg px-3 text-[12.5px] font-semibold text-ok-700">
          <span aria-hidden>{CHECK}</span>
          Email confirmed
        </span>
        <h1 className="t-page mt-3 text-ink-900">Set a password</h1>
        <p className="mt-2 text-[16px] leading-[1.5] text-pretty text-ink-600">
          For next time you sign in as {email}.
        </p>

        <div className="mt-6">
          <label htmlFor={`${id}-newpw`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
            New password
          </label>
          <PasswordField id={`${id}-newpw`} show={showPw} onToggle={() => setShowPw((s) => !s)} autoComplete="new-password" />
        </div>
        <PasswordHint inputId={`${id}-newpw`} />
        {firstError(create.result?.validationErrors as FieldErrors, "password") ? (
          <p className="mt-1.5 text-[14px] text-risk-600">
            {firstError(create.result?.validationErrors as FieldErrors, "password")}
          </p>
        ) : null}
        {create.result?.serverError ? (
          <p role="alert" className="mt-3 text-[14px] text-risk-600">
            {create.result.serverError}
          </p>
        ) : null}

        <StaySignedIn id={`${id}-stay`} />

        <button type="submit" disabled={create.status === "executing"} className={BUTTON}>
          <span>{create.status === "executing" ? "Saving…" : "Save and continue"}</span>
          {create.status === "executing" ? null : ARROW_RIGHT}
        </button>

        <p className="mt-3 text-[14px] text-pretty text-ink-500">
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
        <BackRow
          onBack={() => {
            setStep("entry");
            signIn.reset();
          }}
        />

        <h1 className="t-page mt-6 text-ink-900">Welcome back</h1>

        <div className="mt-6 flex h-14 items-center gap-3 rounded-2xl bg-white px-3">
          <span aria-hidden className="flex size-9 flex-none items-center justify-center rounded-full bg-brand-50 text-[13px] font-semibold text-link">
            {email.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 truncate text-[15.5px] font-medium text-ink-900">{email}</span>
          <button
            type="button"
            onClick={() => {
              setStep("entry");
              signIn.reset();
            }}
            className="flex h-11 items-center px-2.5 text-[14px] font-semibold text-link"
          >
            Change
          </button>
        </div>

        <div className="mt-5">
          <label htmlFor={`${id}-pw`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
            Password
          </label>
          <PasswordField id={`${id}-pw`} show={showPw} onToggle={() => setShowPw((s) => !s)} autoComplete="current-password" autoFocus />
        </div>
        {signIn.result?.serverError ? (
          <p role="alert" className="mt-3 text-[14px] text-risk-600">
            {signIn.result.serverError}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => setStep("forgot")}
          className="mt-2 flex h-11 w-fit items-center text-[14.5px] font-semibold text-link hover:text-link-hover"
        >
          Forgot password?
        </button>

        <StaySignedIn id={`${id}-stay2`} />

        <button type="submit" disabled={signIn.status === "executing"} className={BUTTON}>
          <span>{signIn.status === "executing" ? "Signing in…" : "Sign in"}</span>
          {signIn.status === "executing" ? null : ARROW_RIGHT}
        </button>
      </form>
    );
  }

  // ── forgot ─────────────────────────────────────────────────────────────────
  if (step === "forgot") {
    return (
      <div>
        <BackRow
          onBack={() => {
            setStep("password");
            forgot.reset();
          }}
        />
        <h1 className="t-page mt-6 text-ink-900">Reset your password</h1>
        {forgot.result?.data?.sent ? (
          <p className="mt-2 text-[16px] leading-[1.5] text-pretty text-ink-600" role="status">
            If {email} has an account, a reset link is on its way. It works once and expires in an
            hour.
          </p>
        ) : (
          <>
            <p className="mt-2 text-[16px] leading-[1.5] text-pretty text-ink-600">
              We email a single-use link to <span className="font-semibold text-ink-900">{email}</span>{" "}
              that lets you set a new password.
            </p>
            {forgot.result?.serverError ? (
              <p role="alert" className="mt-3 text-[14px] text-risk-600">
                {forgot.result.serverError}
              </p>
            ) : null}
            <div className="mt-5 flex items-start gap-3 rounded-[20px] bg-brand-50 p-4 text-[14.5px] leading-[1.45] text-night-900">
              <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" className="mt-0.5 flex-none">
                <path
                  d="M12 2c1 3.6 5 5.6 5 10.2a5 5 0 0 1-10 0c0-1.7.6-3 1.6-4 .3 1.5 1 2.4 2 2.7C10.4 8.4 10.8 5 12 2z"
                  fill="#F29D00"
                />
              </svg>
              <span>Your streak, points and finished lessons stay exactly as they are.</span>
            </div>
            <button
              type="button"
              disabled={forgot.status === "executing"}
              onClick={() => forgot.execute({ email })}
              className={BUTTON}
            >
              <span>{forgot.status === "executing" ? "Sending…" : "Email me the link"}</span>
              {forgot.status === "executing" ? null : ARROW_RIGHT}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            setStep("password");
            forgot.reset();
          }}
          className="mt-4 flex h-11 w-full items-center justify-center text-[14.5px] font-semibold text-link hover:text-link-hover"
        >
          I remember it. Back to sign in
        </button>
      </div>
    );
  }

  // ── entry ──────────────────────────────────────────────────────────────────
  return (
    <div>
      <h1 className="t-page text-ink-900">Start learning</h1>
      <p className="mt-2 text-[16px] leading-[1.5] text-ink-600">
        New or coming back, it starts with your email.
      </p>

      {/* Primary on purpose: expect most signups to take this and never see
          a code or a password at all. */}
      <button
        type="button"
        onClick={googleSignIn}
        className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-ink-200 bg-white text-[16px] font-semibold text-ink-900"
      >
        <span aria-hidden className="flex size-[26px] items-center justify-center rounded-full bg-ink-50 text-[14px] font-bold">
          G
        </span>
        <span>Continue with Google</span>
      </button>

      <div className="mt-6 flex items-center gap-3 text-[13px] text-ink-500" aria-hidden>
        <span className="h-px flex-1 bg-ink-100" />
        or use your email
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
        <label htmlFor={`${id}-email`} className="mt-6 mb-1.5 block text-[13.5px] font-semibold text-ink-700">
          Email
        </label>
        <FieldShell className="h-14">
          <FieldInput
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
            className="text-[16px]"
          />
        </FieldShell>
        {firstError(check.result?.validationErrors as FieldErrors, "email") ? (
          <p className="mt-1.5 text-[14px] text-pretty text-risk-600">
            {firstError(check.result?.validationErrors as FieldErrors, "email")}
          </p>
        ) : null}
        {check.result?.serverError || send.result?.serverError ? (
          <p role="alert" className="mt-3 text-[14px] text-pretty text-risk-600">
            {check.result?.serverError ?? send.result?.serverError}
          </p>
        ) : null}

        <button type="submit" disabled={busy} className={BUTTON}>
          <span>{busy ? "One moment…" : "Continue"}</span>
          {busy ? null : ARROW_RIGHT}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-3 rounded-[20px] bg-white p-4">
        <div className="flex gap-3 text-[14.5px] leading-[1.45] text-ink-900">
          <span aria-hidden className="flex size-6 flex-none items-center justify-center rounded-full bg-brand-50 font-mono text-[12px] font-semibold text-link">
            1
          </span>
          <span>
            <span className="font-semibold">New here?</span> We email you a 6-digit code, then you
            choose a password.
          </span>
        </div>
        <div className="flex gap-3 text-[14.5px] leading-[1.45] text-ink-900">
          <span aria-hidden className="flex size-6 flex-none items-center justify-center rounded-full bg-brand-50 font-mono text-[12px] font-semibold text-link">
            2
          </span>
          <span>
            <span className="font-semibold">Been here before?</span> We ask for your password.
          </span>
        </div>
      </div>

      <p className="mt-6 text-center text-[13px] leading-[1.45] text-ink-500">
        Use an address you will still have after you graduate. You can read every lesson without
        an account.
      </p>
    </div>
  );
}

/** The live "at least ten characters" indicator from V2SetPass, wired to
 *  the real rule (ten, not the mockup's eight) rather than re-typed. Reads
 *  the input's value on every keystroke via a plain DOM listener — this
 *  component has no form-state library to subscribe to, and the input it
 *  watches is rendered by PasswordField right next to it. */
function PasswordHint({ inputId }: { inputId: string }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    if (!el) return;
    const onInput = () => setOk(el.value.length >= 10);
    el.addEventListener("input", onInput);
    return () => el.removeEventListener("input", onInput);
  }, [inputId]);

  return (
    <p className={cn("mt-1.5 flex items-center gap-2 text-[14px]", ok ? "text-ok-700" : "text-ink-500")}>
      {ok ? <span aria-hidden>{CHECK}</span> : null}
      <span>At least ten characters. Anything you like — no symbol rules.</span>
    </p>
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
