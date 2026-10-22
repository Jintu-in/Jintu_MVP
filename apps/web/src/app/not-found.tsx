import { GhostNumeral } from "@/components/marketing/ghost-numeral";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const ARROW_RIGHT = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

/**
 * The root 404. Reached by `notFound()` — which /learn/[track] and /p/[slug]
 * both call — and by any URL that matches no route.
 *
 * It lives at the root rather than inside a route group because a mistyped or
 * expired link is not confined to one section, and the two callers above sit
 * in different groups.
 *
 * Restyled against V2NotFound.dc.html / DeskNotFound.dc.html: a huge, faded
 * "404" numeral behind the copy — see ghost-numeral.tsx for why that is a
 * background image rather than pale DOM text. The design's nav carries no
 * account menu on this screen; SiteNav's default already omits one when
 * `signedIn` is left unset, so that still holds here without extra work.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <SiteNav />
      <main className="relative mx-auto flex w-full max-w-[1060px] flex-1 flex-col justify-center overflow-hidden px-5 py-16 sm:px-12">
        <GhostNumeral glyph="404" />
        <div className="relative font-mono text-[14px] leading-none text-link">404</div>
        <h1 className="t-page relative mt-2 max-w-[18ch] text-ink-900">That page is not here</h1>
        <p className="relative mt-3 max-w-[560px] text-[16.5px] leading-[1.6] text-pretty text-ink-600 lg:text-[19px]">
          The link may be mistyped, or it may point at a profile whose owner has
          since made it private. Either way, nothing on your side went wrong.
        </p>

        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3.5">
          <Link
            href="/learn"
            className="flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-brand-500 px-7 text-[16.5px] font-semibold text-on-brand hover:bg-brand-400"
          >
            <span>Open the roadmaps</span>
            {ARROW_RIGHT}
          </Link>
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
