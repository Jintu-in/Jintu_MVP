"use client";

import { useEffect } from "react";

/**
 * The track page failed to render. The likely cause worth naming in the
 * console is schema drift (deployed code asking for tables the database does
 * not have yet — it has happened); the reader just needs a way to retry and
 * a way out. No digest spelunking required of them.
 */
export default function TrackError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[track page]", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 text-center">
      <h1 className="text-2xl font-medium text-ink-900">
        This track did not load
      </h1>
      <p className="mx-auto mt-3 max-w-md text-pretty text-ink-600">
        Something went wrong on our side — the curriculum itself is fine.
        Try again, and if it keeps happening, tell us.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="flex h-12 items-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Try again
        </button>
        <a
          href="/report"
          className="flex h-12 items-center rounded-lg border border-ink-200 px-5 font-medium text-ink-800 hover:border-brand-600"
        >
          Report it
        </a>
      </div>
    </main>
  );
}
