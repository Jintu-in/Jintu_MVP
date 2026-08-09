"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Catches server-render failures in the marketing group.
 *
 * Without this, a throw during the RSC render reaches the browser as React
 * error #441 — "the specific message is omitted in production builds" — and
 * the visitor gets a blank page. That is the correct default for not leaking
 * internals, and a terrible outcome for the top of the funnel: /learn is what
 * someone opens after clicking a search result.
 *
 * The pages that need no database (/, /pricing, /privacy) are unaffected by
 * whatever went wrong, so the useful thing to do is say so and point at them.
 */
export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry's Next integration reports this automatically; the log is here so
    // the digest is greppable in platform logs even with no DSN configured.
    console.error("[marketing] render failed", error.digest ?? "", error.message);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-2xl font-semibold text-ink-900">
        This page could not load.
      </h1>
      <p className="mt-3 text-pretty text-ink-600">
        Something on our end failed while building this page. It is not
        something you did, and nothing you submitted was lost.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-card bg-brand-700 px-4 py-2.5 font-medium text-white hover:bg-brand-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-card border border-ink-300 px-4 py-2.5 font-medium text-ink-700 hover:border-brand-600"
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
