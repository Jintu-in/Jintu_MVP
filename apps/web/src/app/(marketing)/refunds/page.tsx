import type { Metadata } from "next";
import Link from "next/link";

/**
 * The refund policy, as a page of its own.
 *
 * The policy itself has lived on /pricing since that page shipped. It gets a
 * dedicated URL because payment gateways require one before activating live
 * payments — docs/LEGAL.md line 265 has carried "refund and cancellation
 * policy — required for online payments" since the beginning.
 *
 * The wording here must never drift from /pricing. Two refund policies that
 * disagree is worse than none: whichever the customer read first is the one
 * a consumer forum will hold us to, and rightly so.
 */
export const metadata: Metadata = {
  title: "Refunds and cancellation",
  description:
    "Full refund if you ask before the end of week one, for any reason. How to ask, and when the money comes back.",
  alternates: { canonical: "/refunds" },
};

export default function RefundsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <h1 className="text-[26px] leading-tight font-medium text-ink-900 sm:text-[32px]">
        Refunds and cancellation
      </h1>

      <section className="mt-8" aria-labelledby="the-policy">
        <h2 id="the-policy" className="text-lg font-medium text-ink-900">
          The policy
        </h2>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
          Full refund if you ask before the end of week one of your cohort, for
          any reason and without explaining yourself. After that we have
          already graded your work and assigned your peer reviews, so we do not
          refund — but tell us what went wrong anyway, because in week one we
          can usually fix it.
        </p>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
          The curriculum itself is free and public, so there is nothing to
          refund for reading it. The ₹999 buys the cohort — deadlines, grading,
          peer review, and the profile — and that is what the week-one window
          covers.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="how">
        <h2 id="how" className="text-lg font-medium text-ink-900">
          How to ask
        </h2>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
          Email{" "}
          <a className="underline hover:text-brand-800" href="mailto:privacy@jintu.in">
            privacy@jintu.in
          </a>{" "}
          from the address on your account, with the word refund anywhere in
          it. No form, no call, no retention offer. A cancellation before your
          cohort starts is the same email and the same full refund.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="when">
        <h2 id="when" className="text-lg font-medium text-ink-900">
          When the money comes back
        </h2>
        <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
          We initiate the refund within two working days of your email, to the
          payment method you paid with. How long it then takes to reach you is
          set by your bank and the payment network, not by us — UPI refunds
          usually land within a few days; cards can take longer. If nothing has
          arrived within ten working days of our confirmation, write again and
          we will chase it with the gateway.
        </p>
      </section>

      <p className="mt-10 border-t border-ink-100 pt-6 text-[13px] text-ink-500">
        This page and the{" "}
        <Link href="/pricing" className="underline hover:text-brand-800">
          pricing page
        </Link>{" "}
        state the same policy. If you ever find them disagreeing, the more
        generous reading is the one we honour.
      </p>
    </main>
  );
}
