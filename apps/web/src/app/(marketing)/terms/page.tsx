import type { Metadata } from "next";
import Link from "next/link";

/**
 * Terms, in the same voice as the rest of the site.
 *
 * Written to say only things the product actually does — every sentence here
 * is a claim, and LEGAL.md §3 is blunt that a claim we cannot back is a
 * misleading advertisement under the Consumer Protection Act.
 *
 * NOT lawyer-reviewed. LEGAL.md §7 lists the open questions a lawyer needs to
 * settle; this page is the honest v1 that makes payments possible, not the
 * final word. When counsel edits it, keep the plain language — terms nobody
 * can read protect nobody.
 */
export const metadata: Metadata = {
  title: "Terms",
  description:
    "What Jintu promises, what it charges for, and what it will never claim. Plain language on purpose.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <h1 className="t-sect text-ink-900">
        Terms
      </h1>
      <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
        Plain language on purpose. If anything here is unclear, ask — the
        answer counts as part of these terms for you. Nothing on Jintu costs
        money today; the parts below about paid products apply only if and
        when one exists, and this page changes before that happens.
      </p>

      <Section title="What Jintu is">
        <p>
          Jintu publishes free, public roadmaps — deep curricula built from
          curated free content on the open internet — that anyone can work
          through at their own pace, with progress, streaks and points to
          keep the momentum honest. Reading any roadmap is free, needs no
          account, and always will.
        </p>
      </Section>

      <Section title="Who can use it">
        <p>
          You must be 18 or older to create an account. This is not a
          formality: our systems refuse to hold a profile without an
          affirmative confirmation of age, because Indian data protection law
          prohibits profiling children and tracking progress is profiling.
        </p>
      </Section>

      <Section title="What you pay for">
        <p>
          Nothing. There is no paid product, no subscription and no
          auto-renewal, and nothing in any roadmap is held back for a future
          paying tier. The{" "}
          <Link href="/refunds" className="underline hover:text-brand-800">
            refund policy
          </Link>{" "}
          exists for the day that changes; today there is nothing to refund.
        </p>
      </Section>

      <Section title="What we promise, and what we do not">
        <p>
          We promise the roadmaps stay free and public, that every link was
          chosen and checked by a person, and that your progress is yours and
          private by default. Points measure momentum; they are not a
          credential and we will never present them as one.
        </p>
        <p>
          We do not promise you a job, an interview, or a salary. We will
          never publish a placement statistic we cannot evidence, and if
          anyone claiming to represent Jintu promises you employment, they are
          wrong and these terms are the record of that.
        </p>
      </Section>

      <Section title="Your notes">
        <p>
          The review cards you write are yours, in your own words, and
          private to you. Nobody else sees them and we do not use them for
          anything except showing them back to you when they are due.
        </p>
      </Section>

      <Section title="Third-party material">
        <p>
          Roadmaps link to documentation, articles and videos that belong to
          their publishers. We store links and titles, never copies,
          transcripts or summaries. If a link is dead, tell us and a person
          fixes it.
        </p>
      </Section>

      <Section title="Your data">
        <p>
          The{" "}
          <Link href="/privacy" className="underline hover:text-brand-800">
            privacy notice
          </Link>{" "}
          is the complete statement of what we hold and why. Consent is per
          purpose, nothing is pre-ticked, and you can withdraw any optional
          purpose from your account page as easily as you granted it.
        </p>
      </Section>

      <Section title="Ending things">
        <p>
          You can stop using Jintu at any time, and you can ask us to delete
          your account and data by writing to{" "}
          <a className="underline hover:text-brand-800" href="mailto:privacy@jintu.in">
            privacy@jintu.in
          </a>
          . We can close an account that abuses the platform — scraping,
          spam, attempts to break other people&apos;s privacy — and we will
          say why whenever it happens.
        </p>
      </Section>

      <Section title="The boring but necessary part">
        <p>
          These terms are governed by the laws of India. Disputes we cannot
          settle by talking belong to the courts and consumer forums that have
          jurisdiction under Indian law — and the Consumer Protection Act
          gives you rights no clause here can take away.
        </p>
      </Section>

      <p className="mt-10 border-t border-ink-100 pt-6 text-[13px] text-ink-500">
        Questions about these terms:{" "}
        <Link href="/contact" className="underline hover:text-brand-800">
          contact
        </Link>
        .
      </p>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-medium text-ink-900">{title}</h2>
      <div className="mt-3 max-w-[62ch] space-y-3 text-[15px] leading-[1.7] text-pretty text-ink-600">
        {children}
      </div>
    </section>
  );
}
