"use client";

import type { Route } from "next";
import { useAction } from "next-safe-action/hooks";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp } from "@/actions/auth";
import { PasswordSignIn } from "@/components/password-sign-in";
import { Steps } from "@/components/steps";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

const FIELD =
  "h-12 w-full rounded-lg border border-ink-200 bg-white px-3 text-ink-900 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700";

const BUTTON =
  "mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500";

/**
 * Sign-in by emailed code. One component holding both steps rather than two
 * routes: the address has to survive into the verify step, and putting it in
 * the URL would write it into browser history and every referrer header on
 * the page.
 *
 * Why email and not SMS is in @jintu/contracts auth.ts. The shape of this
 * form does not change if that decision reverses — it is one field and a
 * six-digit code either way.
 */
export function JoinForm({ next }: { next: Route }) {
  const id = useId();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  // "password" is a sibling of the code flow, not a step inside it. The
  // email -> code path below is untouched.
  const [mode, setMode] = useState<"code" | "password">("code");

  const request = useAction(requestOtp, {
    onSuccess: ({ data }) => setEmail(data?.email ?? null),
  });
  const verify = useAction(verifyOtp, {
    onSuccess: () => router.replace(next),
  });

  if (mode === "password") {
    return (
      <div>
        <Steps current={1} label="Your email" />
        <h1 className="mt-8 text-2xl font-medium tracking-tight text-ink-900">
          Sign in with your password
        </h1>
        <PasswordSignIn
          onSignedIn={() => router.replace(next)}
          onUseCode={() => setMode("code")}
        />
      </div>
    );
  }

  if (email) {
    return (
      <form
        noValidate
        action={(fd) => verify.execute({ email, token: String(fd.get("token") ?? "") })}
      >
        <Steps current={2} label="Verify code" />

        <h1 className="mt-8 text-2xl font-medium tracking-tight text-ink-900">
          Enter the code
        </h1>
        <p className="mt-2 text-ink-600">
          Sent to {email}.{" "}
          <button
            type="button"
            onClick={() => {
              setEmail(null);
              request.reset();
            }}
            className="text-brand-700 underline hover:text-brand-800"
          >
            Wrong address?
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
          // One field, not six boxes: six inputs break paste — which is how
          // a code gets out of an email and into a form — and every one of
          // them needs its own label to be usable without sight. The tracking
          // is what makes it read as six digits.
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
      action={(fd) => request.execute({ email: String(fd.get("email") ?? "") })}
    >
      <Steps current={1} label="Your email" />

      <h1 className="mt-8 text-2xl font-medium tracking-tight text-ink-900">
        Enter your email address
      </h1>
      <p className="mt-2 text-pretty text-ink-600">
        We send a six-digit code. Nothing to remember — and if you have set a
        password, you can use that instead.
      </p>

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
        autoFocus
        aria-invalid={
          firstError(request.result?.validationErrors as FieldErrors, "email") ? true : undefined
        }
        className={cn(FIELD, "mt-1.5")}
      />
      {firstError(request.result?.validationErrors as FieldErrors, "email") ? (
        <p className="mt-1.5 text-sm text-pretty text-risk-600">
          {firstError(request.result?.validationErrors as FieldErrors, "email")}
        </p>
      ) : null}
      <p className="mt-1.5 text-sm text-pretty text-ink-500">
        Use an address you will still have after you graduate — a college
        address you lose access to is an account you cannot get back into.
      </p>
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

      {/*
        Offered after the code, not instead of it. A first-time visitor has no
        password, so leading with one asks a stranger to remember something
        they never set — but everybody coming back who takes this route is an
        email we do not send, against a built-in quota of roughly two an hour.
      */}
      <button
        type="button"
        onClick={() => setMode("password")}
        className="mt-6 h-12 text-sm text-brand-700 underline hover:text-brand-800"
      >
        I have a password — sign in with that instead
      </button>
    </form>
  );
}
