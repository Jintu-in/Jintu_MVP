"use client";

/**
 * The route-level boundary for the reader.
 *
 * Names what happened and offers the one action that usually works. No
 * stack trace, no "oops", no illustration — and the roadmap link, because
 * a day that will not load should not trap someone on it.
 */
export default function NodeError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col justify-center bg-white px-5 py-12">
      <h1 className="text-[22px] leading-[1.3] font-medium text-ink-900">
        This day did not load.
      </h1>
      <p className="mt-2.5 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
        Something on our side failed. Your progress is untouched.
      </p>
      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={reset}
          className="flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 text-[16px] font-medium text-white hover:bg-brand-800"
        >
          Try again
        </button>
        <a
          href="/learn"
          className="flex h-12 w-full items-center justify-center rounded-lg border border-ink-100 bg-white text-[15px] font-medium text-brand-700 hover:border-brand-700"
        >
          Open the roadmaps
        </a>
      </div>
    </main>
  );
}
