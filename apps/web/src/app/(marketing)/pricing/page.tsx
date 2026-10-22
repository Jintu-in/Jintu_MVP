import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Free. Every roadmap, every day, every curated link. No subscription, no trial that expires, no card asked for.";

export const metadata: Metadata = {
  title: "Pricing",
  description,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — free. All of it.",
    description,
    url: "/pricing",
    type: "website",
    // Same lesson as the homepage: a page-level openGraph without images
    // suppresses the root card. Explicit or imageless — no third option.
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Jintu — one place to learn anything, properly. Free roadmaps, curated links, your progress tracked.",
      },
    ],
  },
};

/**
 * Everything is free, and this page's job is to say so plainly and then
 * survive the obvious suspicion that "free" invites. Every claim still has
 * to pass docs/LEGAL.md §3 — no outcomes promised, no figures we cannot
 * evidence.
 *
 * Restyled against V2Pricing.dc.html / DeskPricing.dc.html: a dark hero band
 * with the "Free. All of it." headline, then a stack of white cards —
 * includes, then excludes, then a teal "how this stays free" callout, then
 * institutions — closing on the same CTA the design uses. The content is
 * unchanged from the previous version of this page; only the chrome around
 * it moved from plain prose into the redesign's card language.
 *
 * The design's nav bar sits INSIDE the dark band, transparent-on-dark like
 * the homepage's hero. This page keeps the shared MarketingLayout's plain
 * white nav above it instead — a deliberate, smaller deviation: giving
 * Pricing its own overlay nav would mean every page in this group needs to
 * opt in or out of that variant, for one hero band, on one page. One quiet
 * chrome across Pricing/Contact/Legal/404/Error reads as more consistent
 * than it costs here.
 *
 * The "what free does not mean" list is the load-bearing half. A free
 * product that only lists what it gives reads as a pitch; one that names
 * what it withholds reads as a description, and this audience has been
 * pitched at by every coaching institute in the country.
 */

const CHECK = (
  <svg aria-hidden width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#06262c" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const ARROW_RIGHT = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

/** ✓ — a claim we honour today. */
function Yes({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3.5 text-[15.5px] leading-[1.65]">
      <span aria-hidden className="flex size-[26px] flex-none items-center justify-center rounded-full bg-brand-500">
        {CHECK}
      </span>
      <span className="min-w-0 text-ink-900">{children}</span>
    </li>
  );
}

/** – something free explicitly does not include. Not styled as a warning:
 *  it is a fact about scope, not a problem. */
function No({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3.5 text-[15.5px] leading-[1.65]">
      <span aria-hidden className="flex size-[26px] flex-none items-center justify-center rounded-full bg-ink-100">
        <span className="h-[2.5px] w-2.5 rounded-full bg-ink-600" />
      </span>
      <span className="min-w-0 text-ink-900">{children}</span>
    </li>
  );
}

export default function PricingPage() {
  return (
    <>
      <header className="bg-night-900 px-5 pt-10 pb-20 text-white sm:px-12 lg:pt-14 lg:pb-24">
        <div className="mx-auto flex max-w-[1060px] flex-col items-start gap-3.5 lg:px-0">
          <span className="flex h-7 items-center rounded-full bg-white/15 px-3 font-mono text-[12px] leading-none text-on-night-muted">
            Pricing
          </span>
          <h1 className="t-page text-white">Free. All of it.</h1>
          <p className="max-w-[62ch] text-[16.5px] leading-[1.6] text-pretty text-on-night-muted lg:text-[20px]">
            Every roadmap, every lesson, every curated link. No subscription, no trial that
            expires, no card asked for. There is nothing on this site you can pay for today.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-11 flex max-w-[1060px] flex-col gap-4 px-5 pb-16 sm:px-12 lg:-mt-14 lg:gap-5 lg:pb-20">
        <section
          aria-labelledby="includes"
          className="flex flex-col gap-4 rounded-[24px] bg-white p-[22px] shadow-[0_1px_2px_rgba(12,42,48,0.06),0_10px_28px_rgba(12,42,48,0.08)] lg:p-8"
        >
          <h2 id="includes" className="t-card text-ink-900">
            What free includes
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            <Yes>Every roadmap, in full, readable without an account</Yes>
            <Yes>Progress, streaks and points across every roadmap you start</Yes>
            <Yes>Notes and highlights, private to you, exportable any time</Yes>
            <Yes>Every link opened and checked by a person before it shipped</Yes>
            <Yes>No adverts, and no selling of anything about you</Yes>
          </ul>
        </section>

        <section aria-labelledby="not" className="flex flex-col gap-4 rounded-[24px] bg-white p-[22px] lg:p-8">
          <h2 id="not" className="t-card text-ink-900">
            What free does not mean
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            <No>A job, an interview, or an introduction to any employer</No>
            <No>One-to-one mentoring — that arrives only if enough people ask</No>
            <No>Anything that expires: the roadmaps stay free and public</No>
          </ul>
        </section>

        <section aria-labelledby="how" className="flex flex-col gap-2 rounded-[24px] bg-brand-50 p-[22px] text-night-900 lg:p-8">
          <h2 id="how" className="t-card text-night-900">
            How this stays free
          </h2>
          <p className="text-[15.5px] leading-[1.6] text-pretty">
            Nothing here is priced today, and we are not going to pretend we have settled how it
            will be paid for. What we will commit to is the order of events: the roadmaps, your
            progress and your profile stay free, and if that ever changes this page changes
            first.
          </p>
        </section>

        <section aria-labelledby="institutions" className="flex flex-col items-start gap-1.5 rounded-[24px] bg-white p-[22px] lg:p-8">
          <h2 id="institutions" className="t-card text-ink-900">
            Institutions
          </h2>
          <p className="text-[15.5px] leading-[1.6] text-pretty text-ink-600">
            A dashboard for teachers and placement officers with a whole group on Jintu is
            planned.
          </p>
          <Link href="/contact" className="mt-1 flex min-h-11 items-center text-[15.5px] font-semibold text-ink-900">
            Write to us when you have people here
          </Link>
        </section>

        <div className="mt-2 flex flex-col items-center gap-2.5">
          <Link
            href="/learn"
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-500 text-[16.5px] font-semibold text-on-brand hover:bg-brand-400 sm:w-auto sm:px-9"
          >
            <span>Open a roadmap</span>
            {ARROW_RIGHT}
          </Link>
          <div className="text-[14px] text-ink-600">You do not need an account to read one.</div>
        </div>
      </main>
    </>
  );
}
