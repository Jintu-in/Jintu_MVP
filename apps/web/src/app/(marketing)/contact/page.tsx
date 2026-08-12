import type { Metadata } from "next";
import Link from "next/link";

/**
 * Contact — the third page a payment gateway requires.
 *
 * Deliberately incomplete in one visible way: there is no registered address
 * on it, because none has been decided, and inventing one would be a false
 * statement on the page whose whole job is to be verifiable. The gateway's
 * verification team will not activate live payments until the address is
 * here — that is an input only the business owner can supply, and the PR
 * that added this page says so in bold.
 *
 * The grievance section is a DPDP requirement, not decoration: a data
 * principal must have a named way to complain that is not a support queue.
 */
export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach Jintu — questions, refunds, data requests and grievances.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12 sm:py-16">
      <h1 className="text-[26px] leading-tight font-medium text-ink-900 sm:text-[32px]">
        Contact
      </h1>
      <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
        Email works best. A person reads everything sent to either address —
        there is no bot triaging this, which also means replies take hours,
        not seconds.
      </p>

      <div className="mt-8 divide-y divide-ink-100 border-y border-ink-100">
        <Row
          label="Anything about the product"
          detail="Tracks, points, your profile, a dead link, a wrong rubric."
        >
          <a className="underline hover:text-brand-800" href="mailto:hello@jintu.in">
            hello@jintu.in
          </a>
        </Row>
        <Row
          label="Your data, and grievances"
          detail="Copies, corrections, deletion, consent withdrawal, or a complaint about how your data was handled. This is the grievance contact under India's data protection law."
        >
          <a className="underline hover:text-brand-800" href="mailto:privacy@jintu.in">
            privacy@jintu.in
          </a>
        </Row>
      </div>

      <p className="mt-6 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
        For refunds, the whole process is one email — the{" "}
        <Link href="/refunds" className="underline hover:text-brand-800">
          refund policy
        </Link>{" "}
        says exactly what to send and what happens next.
      </p>

      <p className="mt-10 border-t border-ink-100 pt-6 text-[13px] text-ink-500">
        Jintu · Made in India
      </p>
    </main>
  );
}

function Row({
  label,
  detail,
  children,
}: {
  label: string;
  detail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5">
      <p className="text-[15px] font-medium text-ink-900">{label}</p>
      <p className="mt-1 max-w-[62ch] text-[13px] leading-relaxed text-pretty text-ink-500">
        {detail}
      </p>
      <p className="mt-2 text-[15px]">{children}</p>
    </div>
  );
}
