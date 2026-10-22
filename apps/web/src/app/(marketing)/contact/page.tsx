import type { Metadata } from "next";
import Link from "next/link";
import { BrokenLinkIcon, ContactCard, MailIcon, PersonIcon } from "@/components/marketing/contact-card";

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
 *
 * Restyled against V2Contact.dc.html / DeskContact.dc.html's three-card
 * layout. The design's third card ("Something broken or out of date?") is a
 * mailto there; here it routes to /report instead, which already carries
 * that exact content and a real link-health pipeline behind it — see
 * contact-card.tsx for why.
 */
export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach Jintu — questions, refunds, data requests and grievances.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[1060px] px-5 py-12 sm:py-16 lg:px-12">
      <h1 className="t-page text-ink-900">Contact</h1>
      <p className="mt-3 max-w-[640px] text-[16px] leading-[1.6] text-pretty text-ink-600 lg:text-[19px]">
        Two addresses. Pick the one that fits.
      </p>

      <div className="mt-8 flex flex-col gap-4 lg:mt-10 lg:flex-row">
        <ContactCard
          icon={MailIcon}
          title="Anything about the product"
          detail="Roadmaps, points, your account, a dead link, a resource that misleads."
          action={{ label: "hello@jintu.in", href: "mailto:hello@jintu.in" }}
        />
        <ContactCard
          icon={PersonIcon}
          title="Your data, and grievances"
          detail="Copies, corrections, deletion, consent withdrawal, or a complaint about how your data was handled. This is the grievance contact under India's data protection law."
          action={{ label: "privacy@jintu.in", href: "mailto:privacy@jintu.in" }}
        />
        <ContactCard
          icon={BrokenLinkIcon}
          title="Something broken or out of date?"
          detail="A dead link, a video that moved, a claim that aged badly. Send the page link and one line on what is wrong."
          action={{ label: "Report a problem", href: "/report" }}
        />
      </div>

      <p className="mt-8 max-w-[62ch] text-[15px] leading-[1.6] text-pretty text-ink-600">
        For refunds, the whole process is one email — the{" "}
        <Link className="underline hover:text-brand-800" href="/refunds">
          refund policy
        </Link>{" "}
        says exactly what to send and what happens next.
      </p>
    </main>
  );
}
