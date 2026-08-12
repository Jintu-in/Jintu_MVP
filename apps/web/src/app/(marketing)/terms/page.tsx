import type { Metadata } from "next";
import Link from "next/link";

/**
 * Terms, in the same voice as the rest of the site.
 *
 * Required before a payment gateway will activate live payments, and listed
 * in docs/LEGAL.md's checklist from the start. Written to say only things the
 * product actually does — every sentence here is a claim, and LEGAL.md §3 is
 * blunt that a claim we cannot back is a misleading advertisement under the
 * Consumer Protection Act.
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
      <h1 className="text-[26px] leading-tight font-medium text-ink-900 sm:text-[32px]">
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
          Jintu publishes free, public curricula — tracks — that anyone can
          work through at their own pace, with submissions graded against
          published rubrics, peer review, and a profile of finished work.
          Reading any track is free, needs no account, and always will.
        </p>
      </Section>

      <Section title="Who can use it">
        <p>
          You must be 18 or older to create an account. This is not a
          formality: our systems refuse to hold a profile without an
          affirmative confirmation of age, because Indian data protection law
          prohibits profiling children and grading work is profiling.
        </p>
      </Section>

      <Section title="What you pay for">
        <p>
          A cohort place costs ₹999, paid once. There is no subscription,
          no auto-renewal, and nothing in the curriculum is held back for
          paying students. Refunds are governed by the{" "}
          <Link href="/refunds" className="underline hover:text-brand-800">
            refund policy
          </Link>
          : full refund before the end of week one, for any reason.
        </p>
      </Section>

      <Section title="What we promise, and what we do not">
        <p>
          We promise your work is graded against the rubric you could read
          before paying, that two peers review it, and that you finish with
          work you can show to anyone.
        </p>
        <p>
          We do not promise you a job, an interview, or a salary. We will
          never publish a placement statistic we cannot evidence, and if
          anyone claiming to represent Jintu promises you employment, they are
          wrong and these terms are the record of that.
        </p>
      </Section>

      <Section title="Your work">
        <p>
          What you build in a cohort is yours. You grant us permission to show
          it to your assigned peer reviewers and graders, and — only if you
          switch it on — to display it on your public profile. That toggle is
          off by default and withdrawing it takes effect immediately.
        </p>
      </Section>

      <Section title="Third-party material">
        <p>
          Tracks link to documentation, articles and videos that belong to
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
          . We can remove someone from a cohort for plagiarising work or
          abusing peer review — with a refund if it happens in week one, and
          an explanation whenever it happens.
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
