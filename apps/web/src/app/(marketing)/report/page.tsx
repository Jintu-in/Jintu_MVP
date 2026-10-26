import type { Metadata } from "next";
import { BrokenLinkIcon } from "@/components/marketing/contact-card";

export const metadata: Metadata = {
  title: "Report a problem",
  description: "A dead link, a video that moved, a resource that misleads — tell us and we fix it by hand.",
  alternates: { canonical: "/report" },
};

/**
 * /report — the curriculum page's "something broken?" target, and the
 * destination for V2Contact.dc.html's third card (see contact-card.tsx).
 *
 * Minimum honest version: an email with a promise attached, not a form that
 * pretends a ticketing system exists. Link health is also checked
 * automatically (resources carry ok/degraded/dead and dead links stop
 * rendering) — this page is for what the checker cannot see: a wrong number
 * a video that changed owners, an explanation that misleads.
 *
 * TODO when volume justifies it: a form writing to a reports table with the
 * resource id attached, surfaced in the ops queue.
 */
export default function ReportPage() {
  return (
    <main className="mx-auto max-w-[640px] px-5 py-12 sm:py-16">
      <span aria-hidden className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-link">
        {BrokenLinkIcon}
      </span>
      <h1 className="t-sect mt-4 text-ink-900">Something broken or out of date?</h1>
      <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.6] text-pretty text-ink-600">
        Dead links are flagged automatically and replaced by hand — never by a
        model, because silently swapping a resource under a learner mid-unit
        is worse than a dead link. Everything else needs a human to hear about
        it: a dead link, a video that moved, a claim that aged badly.
      </p>
      <div className="mt-6 flex flex-col gap-4 rounded-[24px] bg-white p-6 shadow-[0_1px_2px_rgba(12,42,48,0.06),0_10px_28px_rgba(12,42,48,0.08)]">
        <p className="text-[15.5px] leading-[1.6] text-pretty text-ink-800">
          Send the page link and one line on what is wrong. It is read by the
          person who can fix it, and curriculum fixes ship as a new version so
          nobody&apos;s work changes underneath them.
        </p>
        <a
          href="mailto:hello@jintu.in?subject=Broken%20on%20Jintu"
          className="flex h-13 items-center justify-center gap-2.5 rounded-2xl bg-night-900 font-mono text-[15px] text-white no-underline"
        >
          <span aria-hidden>{BrokenLinkIcon}</span>
          <span>hello@jintu.in</span>
        </a>
      </div>
    </main>
  );
}
