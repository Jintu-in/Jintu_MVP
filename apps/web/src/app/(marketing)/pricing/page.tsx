import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "The curriculum is free. You pay for the cohort: deadlines, grading, peer review, and a proof-of-readiness profile.",
  alternates: { canonical: "/pricing" },
};

/**
 * Every claim on this page has to survive docs/LEGAL.md §3. No outcome is
 * promised, no placement figure appears, and the refund terms are stated
 * rather than implied — a refund policy is required for online course sales
 * in India and its absence is itself a problem.
 */

const INCLUDED = [
  "Six weekly assignments with fixed deadlines",
  "SQL graded by running it against the expected output — not by a model",
  "Written work scored against the published rubric, with feedback",
  "Two peer reviews to give and two to receive each week, authors anonymised",
  "A proof-of-readiness profile you can share with anyone",
];

const NOT_INCLUDED = [
  "A job, an interview, or an introduction to any employer",
  "One-to-one mentoring — that arrives only if enough people ask for it",
  "Anything that expires: the curriculum stays free and public forever",
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        Pricing
      </p>
      <h1 className="mt-3 text-3xl leading-tight font-medium text-balance text-ink-900 sm:text-4xl">
        The syllabus is free. The cohort is not.
      </h1>
      <p className="mt-4 text-lg text-pretty text-ink-600">
        You can work through{" "}
        <Link href="/learn" className="text-brand-700 underline hover:text-brand-800">
          the whole curriculum
        </Link>{" "}
        on your own, today, for nothing. Most people do not finish things alone.
        The cohort is what makes you finish.
      </p>

      <section className="mt-10 rounded-card border-2 border-brand-600 bg-white p-6">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className="text-4xl font-medium text-ink-900">₹999</span>
          <span className="text-ink-500">one time, per cohort</span>
        </div>
        <p className="mt-2 text-ink-600">
          Six weeks. Paid by UPI. No subscription, no auto-renewal, no card
          stored.
        </p>

        <h2 className="mt-6 text-sm font-medium tracking-wide text-ink-500 uppercase">
          What you get
        </h2>
        <ul className="mt-3 space-y-2">
          {INCLUDED.map((item) => (
            <li key={item} className="flex gap-2.5 text-pretty text-ink-700">
              <span aria-hidden className="mt-0.5 text-brand-700">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Link
            href="/#waitlist"
            className="inline-flex h-12 items-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800"
          >
            Join the waitlist
          </Link>
          <p className="mt-2 text-sm text-ink-500">
            Twenty places in the first cohort. We contact you before it opens.
          </p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="not-included">
        <h2 id="not-included" className="text-lg font-medium text-ink-900">
          What ₹999 does not buy
        </h2>
        <ul className="mt-3 space-y-2">
          {NOT_INCLUDED.map((item) => (
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
        aria-labelledby="refunds"
      >
        <h2 id="refunds" className="font-medium text-ink-900">
          Refunds
        </h2>
        <p className="mt-2 text-pretty text-ink-600">
          Full refund if you ask before the end of week one, for any reason and
          without explaining yourself. After that we have already graded your
          work and assigned your peer reviews, so we do not refund — but tell us
          what went wrong anyway, because in week one we can usually fix it.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="colleges">
        <h2 id="colleges" className="text-lg font-medium text-ink-900">
          Colleges
        </h2>
        <p className="mt-2 text-pretty text-ink-600">
          Batch pricing and a placement-officer dashboard exist for institutions
          running this with a whole cohort. That is invoiced, not paid by card.
          Write to us and we will send terms.
        </p>
      </section>
    </main>
  );
}
