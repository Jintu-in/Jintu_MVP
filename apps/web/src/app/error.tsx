"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * The root segment boundary — everything the marketing group's own error.tsx
 * does not cover: /dashboard, /account, /onboarding, /join and /p/[slug].
 *
 * Those are the pages that talk to Supabase on every request, so they are
 * exactly the ones a database blip turns into React error #441 and a blank
 * screen. A student who has just submitted work and sees white has no way to
 * know whether the submission survived. Saying so is the whole job here.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry's Next integration reports this automatically; the log is here so
    // the digest is greppable in platform logs even with no DSN configured.
    console.error("[app] render failed", error.digest ?? "", error.message);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5 py-16">
      <h1 className="text-2xl font-medium tracking-tight text-balance text-ink-900">
        This page could not load
      </h1>
      <p className="mt-3 text-pretty text-ink-600">
        Something on our end failed while building this page. It is not
        something you did.
      </p>
      <p className="mt-3 text-pretty text-ink-600">
        Anything you had already submitted is saved — submissions are written
        before this page is drawn, so a failure here cannot lose one.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <button
          type="button"
          onClick={reset}
          className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-lg px-5 font-medium text-brand-700 hover:text-brand-800"
        >
          Go to the home page
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-8 text-sm text-ink-500">
          If you report this, quote{" "}
          <code className="font-mono text-ink-700">{error.digest}</code> — it
          identifies this exact failure in our logs.
        </p>
      ) : null}
    </main>
  );
}
