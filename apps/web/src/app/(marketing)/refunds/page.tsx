import type { Metadata } from "next";
import Link from "next/link";
import { LegalHeader, LegalSection, LegalToc } from "@/components/marketing/legal";

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
 *
 * Shares its layout with Privacy and Terms — V2Legal.dc.html's own note.
 */
export const metadata: Metadata = {
  title: "Refunds and cancellation",
  description:
    "Full refund if you ask before the end of week one, for any reason. How to ask, and when the money comes back.",
  alternates: { canonical: "/refunds" },
};

const SECTIONS = [
  { id: "the-policy", label: "The policy" },
  { id: "how", label: "How to ask" },
  { id: "when", label: "When the money comes back" },
];

export default function RefundsPage() {
  return (
    <main className="mx-auto flex max-w-[1060px] flex-col gap-8 px-5 py-12 sm:py-16 lg:flex-row lg:items-start lg:gap-18 lg:px-12">
      <LegalToc entries={SECTIONS} />

      <article className="flex min-w-0 max-w-[700px] flex-1 flex-col gap-7">
        <LegalHeader title="Refunds and cancellation" />

        <LegalSection id="the-policy" title="The policy">
          <p>
            Nothing on Jintu costs money today, so there is nothing to refund.
            This policy exists for when a paid product does: full refund if you
            ask within the first week of buying anything here, for
            any reason and without explaining yourself. After that the work the
            purchase paid for has been done, so we do not refund — but tell us
            what went wrong anyway, because early on we can usually fix it.
          </p>
          <p>
            The roadmaps, the progress tracking, the streaks and the points are
            free, so none of them ever needs refunding. This window will cover
            whatever a paid product turns out to include, and this page will
            name it before anything is sold.
          </p>
        </LegalSection>

        <LegalSection id="how" title="How to ask">
          <p>
            Email{" "}
            <a className="underline hover:text-brand-800" href="mailto:privacy@jintu.in">
              privacy@jintu.in
            </a>{" "}
            from the address on your account, with the word refund anywhere in
            it. No form, no call, no retention offer.
          </p>
        </LegalSection>

        <LegalSection id="when" title="When the money comes back">
          <p>
            We initiate the refund within two working days of your email, to the
            payment method you paid with. How long it then takes to reach you is
            set by your bank and the payment network, not by us — UPI refunds
            usually land within a few days; cards can take longer. If nothing has
            arrived within ten working days of our confirmation, write again and
            we will chase it with the gateway.
          </p>
        </LegalSection>

        <p className="border-t border-ink-100 pt-6 text-[14px] text-ink-500">
          This page and the{" "}
          <Link href="/pricing" className="underline hover:text-brand-800">
            pricing page
          </Link>{" "}
          state the same policy. If you ever find them disagreeing, the more
          generous reading is the one we honour.
        </p>
      </article>
    </main>
  );
}
