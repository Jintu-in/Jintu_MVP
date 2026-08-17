import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Free. The roadmaps, the progress tracking, the streaks, the review queue — all of it. Nothing on Jintu costs money today.";

export const metadata: Metadata = {
  title: "Pricing",
  description,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — free. All of it.",
    description,
    url: "/pricing",
    type: "website",
  },
};

/**
 * Everything is free, and this page's job is to say so plainly and then
 * survive the obvious suspicion that "free" invites. Every claim still has
 * to pass docs/LEGAL.md §3 — no outcomes promised, no figures we cannot
 * evidence.
 */

const FREE = [
  "Every roadmap, in full, readable without an account",
  "Progress tracking down to the single node, across any number of roadmaps",
  "A streak for showing up, and a total-days count that never resets even when the streak does",
  "Points for genuine progress — momentum, not a credential",
  "Spaced review of what you learned, in your own words",
  "Save-for-later that stays attached to the roadmap instead of rotting in a list",
];

const NOT_PROMISED = [
  "A job, an interview, or an introduction to any employer",
  "The content itself — every read and video is free on its author's own site; we curate and sequence, we do not host",
  "Anything that expires: the roadmaps stay free and public",
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        Pricing
      </p>
      <h1 className="mt-3 text-3xl leading-tight font-medium text-balance text-ink-900 sm:text-4xl">
        Free. All of it.
      </h1>
      <p className="mt-4 text-lg text-pretty text-ink-600">
        <Link href="/learn" className="text-brand-700 underline hover:text-brand-800">
          The roadmaps
        </Link>
        , the progress, the streaks, the review queue. No subscription, no
        trial that expires, no card asked for. There is nothing on this site
        you can pay for today.
      </p>

      <section className="mt-10 rounded-card border border-ink-100 bg-white p-6">
        <h2 className="text-sm font-medium tracking-wide text-ink-500 uppercase">
          What free includes
        </h2>
        <ul className="mt-3 space-y-2">
          {FREE.map((item) => (
            <li key={item} className="flex gap-2.5 text-pretty text-ink-700">
              <span aria-hidden className="mt-0.5 text-brand-700">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="not-included">
        <h2 id="not-included" className="text-lg font-medium text-ink-900">
          What free does not mean
        </h2>
        <ul className="mt-3 space-y-2">
          {NOT_PROMISED.map((item) => (
            <li key={item} className="flex gap-2.5 text-pretty text-ink-600">
              <span aria-hidden className="mt-0.5 text-ink-500">
                –
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mt-10 rounded-card border border-ink-100 bg-white p-6"
        aria-labelledby="how"
      >
        <h2 id="how" className="font-medium text-ink-900">
          How this stays free
        </h2>
        <p className="mt-2 text-pretty text-ink-600">
          Curating links costs close to nothing to serve, which is what makes
          a free-first product survivable. If a paid layer ever arrives it
          will sit beside the roadmaps, not in front of them — and this page
          changes first.
        </p>
      </section>
    </main>
  );
}
