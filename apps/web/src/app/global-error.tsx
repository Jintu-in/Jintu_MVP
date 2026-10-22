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
 *
 * Restyled in the same voice as error.tsx/not-found.tsx (ink-900 heading,
 * brand-500 primary action, mono digest callout) but without SiteNav or
 * SiteFooter — both pull in next/link, and this boundary exists for the
 * case where the router itself is what broke.
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
      <body className="min-h-dvh bg-ink-50 antialiased">
        <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center px-5 py-16">
          <div className="font-mono text-[14px] leading-none text-link">Something failed</div>
          <h1 className="t-page mt-2 text-ink-900">Jintu is having a bad moment</h1>
          <p className="mt-3 text-[16.5px] leading-[1.6] text-pretty text-ink-600">
            The site failed to start up in your browser. Reloading usually
            clears it. If it does not, the outage is on our end and we can see
            it.
          </p>

          {error.digest ? (
            <div className="mt-4 rounded-2xl bg-white px-4.5 py-3.5 text-[14.5px] leading-[1.55] text-ink-600">
              If you report this, quote{" "}
              <code className="font-mono text-[13.5px] text-ink-900">{error.digest}</code>.
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5">
            <button
              type="button"
              onClick={reset}
              className="flex h-14 items-center justify-center rounded-2xl bg-brand-500 px-7 text-[16.5px] font-semibold text-on-brand hover:bg-brand-400"
            >
              Reload
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                the rule prevents a full page load on internal navigation, and
                a full page load is the entire point here: this boundary is
                reached when the app shell itself failed, so a client-side
                transition would re-mount the thing that just crashed. */}
            <a
              href="/"
              className="flex h-14 items-center justify-center rounded-2xl border border-ink-200 bg-white px-7 text-[16.5px] font-semibold text-ink-900"
            >
              Go to the home page
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
