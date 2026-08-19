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
 * The "what free does not mean" list is the load-bearing half. A free
 * product that only lists what it gives reads as a pitch; one that names
 * what it withholds reads as a description, and this audience has been
 * pitched at by every coaching institute in the country.
 */

/** ✓ — a claim we honour today. */
function Yes({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="mt-px w-4 shrink-0 text-brand-700">
        ✓
      </span>
      <span className="text-[15px] leading-[1.7] text-pretty text-ink-800">{children}</span>
    </li>
  );
}

/** – something free explicitly does not include. Not styled as a warning:
 *  it is a fact about scope, not a problem. */
function No({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="mt-px w-4 shrink-0 text-ink-500">
        –
      </span>
      <span className="text-[15px] leading-[1.7] text-pretty text-ink-600">{children}</span>
    </li>
  );
}

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <h1 className="text-3xl leading-tight font-medium text-balance text-ink-900 sm:text-4xl">
        Free. All of it.
      </h1>
      <p className="mt-4 max-w-[62ch] text-lg leading-[1.7] text-pretty text-ink-600">
        Every roadmap, every day, every curated link. No subscription, no trial
        that expires, no card asked for. There is nothing on this site you can
        pay for today.
      </p>

      <section className="mt-10" aria-labelledby="includes">
        <h2 id="includes" className="text-lg font-medium text-ink-900">
          What free includes
        </h2>
        <ul className="mt-4 space-y-3">
          <Yes>Every roadmap, in full, readable without an account</Yes>
          <Yes>Progress, streaks and points across every roadmap you start</Yes>
          <Yes>Notes and highlights, private to you, exportable any time</Yes>
          <Yes>Every link opened and checked by a person before it shipped</Yes>
          <Yes>No adverts, and no selling of anything about you</Yes>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="not">
        <h2 id="not" className="text-lg font-medium text-ink-900">
          What free does not mean
        </h2>
        <ul className="mt-4 space-y-3">
          <No>A job, an interview, or an introduction to any employer</No>
          <No>One-to-one mentoring — that arrives only if enough people ask</No>
          <No>Anything that expires: the roadmaps stay free and public</No>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="how">
        <h2 id="how" className="text-lg font-medium text-ink-900">
          How this stays free
        </h2>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
          Nothing here is priced today, and we are not going to pretend we have
          settled how it will be paid for. What we will commit to is the order
          of events: the roadmaps, your progress and your profile stay free, and
          if that ever changes this page changes first.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="institutions">
        <h2 id="institutions" className="text-lg font-medium text-ink-900">
          Institutions
        </h2>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
          A dashboard for teachers and placement officers with a whole group on
          Jintu is planned.{" "}
          <Link href="/contact" className="text-brand-700 underline hover:text-brand-800">
            Write to us
          </Link>{" "}
          when you have people here.
        </p>
      </section>

      <p className="mt-12 border-t border-ink-100 pt-6 text-[15px] leading-[1.7] text-pretty text-ink-600">
        Ready to start?{" "}
        <Link href="/learn" className="text-brand-700 underline hover:text-brand-800">
          Open a roadmap
        </Link>{" "}
        — you do not need an account to read one.
      </p>
    </main>
  );
}
