"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * The last boundary. `error.tsx` renders *inside* the root layout, so it
 * cannot catch a failure in the root layout itself — an exception there
 * escapes every other boundary and the visitor gets a genuinely blank
 * document. This replaces the whole document instead, which is why it renders
 * its own <html> and <body> and imports the stylesheet itself.
 *
 * No <Link> here: the router lives above this boundary and may be the thing
 * that broke. A plain anchor always works.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] root layout failed", error.digest ?? "", error.message);
  }, [error]);

  return (
    <html lang="en-IN">
      <body className="min-h-dvh antialiased">
        <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-5 py-16">
          <h1 className="text-2xl font-semibold tracking-tight text-balance text-ink-900">
            Jintu is having a bad moment
          </h1>
          <p className="mt-3 text-pretty text-ink-600">
            The site failed to start up in your browser. Reloading usually
            clears it. If it does not, the outage is on our end and we can see
            it.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              onClick={reset}
              className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Reload
            </button>
            <a
              href="/"
              className="flex h-12 items-center justify-center rounded-lg px-5 font-medium text-brand-700 hover:text-brand-800"
            >
              Go to the home page
            </a>
          </div>

          {error.digest ? (
            <p className="mt-8 text-sm text-ink-500">
              If you report this, quote{" "}
              <code className="font-mono text-ink-700">{error.digest}</code>.
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
