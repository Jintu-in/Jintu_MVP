"use client";

import { GhostNumeral } from "@/components/marketing/ghost-numeral";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import Link from "next/link";
import { useEffect } from "react";

/**
 * The root segment boundary — everything the marketing group's own error.tsx
 * does not cover: /account, /onboarding and /join.
 *
 * Those are the pages that talk to Supabase on every request, so they are
 * exactly the ones a database blip turns into React error #441 and a blank
 * screen. Someone who just ticked a node and sees white has no way to know
 * whether the tick survived. Saying so is the whole job here.
 *
 * Restyled against V2Error.dc.html / DeskError.dc.html — same ghost-numeral
 * treatment as not-found.tsx, with "!" in place of "404".
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
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <SiteNav />
      <main className="relative mx-auto flex w-full max-w-[1060px] flex-1 flex-col justify-center overflow-hidden px-5 py-16 sm:px-12">
        <GhostNumeral glyph="!" />
        <div className="relative font-mono text-[14px] leading-none text-link">Something failed</div>
        <h1 className="t-page relative mt-2 max-w-[18ch] text-ink-900">This page could not load</h1>
        <p className="relative mt-3 max-w-[560px] text-[16.5px] leading-[1.6] text-pretty text-ink-600 lg:text-[19px]">
          Something on our end failed while building this page. It is not
          something you did.
        </p>
        <p className="relative mt-1 max-w-[560px] text-[16.5px] leading-[1.6] text-pretty text-ink-600 lg:text-[19px]">
          Your progress is saved. It is written before this page is drawn, so
          a failure here cannot lose it.
        </p>

        {error.digest ? (
          <div className="relative mt-4 max-w-[560px] rounded-2xl bg-white px-4.5 py-3.5 text-[14.5px] leading-[1.55] text-ink-600">
            If you report this, quote{" "}
            <code className="font-mono text-[13.5px] text-ink-900">{error.digest}</code>. It
            identifies this exact failure in our logs.
          </div>
        ) : null}

        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5">
          <button
            type="button"
            onClick={reset}
            className="flex h-14 items-center justify-center rounded-2xl bg-brand-500 px-7 text-[16.5px] font-semibold text-on-brand hover:bg-brand-400"
          >
            Try again
          </button>
          <Link
            href="/"
            className="flex h-14 items-center justify-center rounded-2xl border border-ink-200 bg-white px-7 text-[16.5px] font-semibold text-ink-900"
          >
            Go to the home page
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
