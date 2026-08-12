import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free. The curriculum, the grading, the points and the profile — all of it. Nothing on Jintu costs money today.",
  alternates: { canonical: "/pricing" },
};

/**
 * V3: everything is free, and this page's job is to say so plainly and then
 * survive the obvious suspicion that "free" invites. Every claim still has
 * to pass docs/LEGAL.md §3 — no outcomes promised, no figures we cannot
 * evidence. The future paid thing (a human-audited verified credential) is
 * described as a plan, not sold, because it does not exist yet.
 */

const FREE = [
  "Every curriculum, in full, readable without an account",
  "SQL graded by running it against the expected output — not by a model",
  "Planted-defect audits marked against a key that is not on the internet",
  "Peer review, with authors anonymised",
  "Points that can only be earned by work something checked",
  "A proof-of-readiness profile you can share with anyone",
];

const NOT_PROMISED = [
  "A job, an interview, or an introduction to any employer",
  "One-to-one mentoring — that arrives only if enough people ask for it",
  "Anything that expires: the curriculum stays free and public",
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
          The curriculum
        </Link>
        , the grading, the points, the profile. No subscription, no trial that
        expires, no card asked for. There is nothing on this site you can pay
        for today.
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
          The plan is to charge, later, for exactly one thing: a verified
          credential — your work audited by a human, with a certificate and a
          permanent verified link. Learning, points and your profile stay free
          when that arrives. If the plan changes, this page changes first.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="colleges">
        <h2 id="colleges" className="text-lg font-medium text-ink-900">
          Colleges
        </h2>
        <p className="mt-2 text-pretty text-ink-600">
          A readiness dashboard for placement officers is planned for
          institutions with a whole batch on Jintu. Write to us and we will
          talk when you have students here.
        </p>
      </section>
    </main>
  );
}
