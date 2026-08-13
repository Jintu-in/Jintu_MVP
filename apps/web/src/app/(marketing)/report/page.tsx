import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report a problem",
  description: "A dead link, a video that moved, a resource that misleads — tell us and we fix it by hand.",
  alternates: { canonical: "/report" },
};

/**
 * /report — the curriculum page's "something broken?" target.
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
    <main className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="text-3xl leading-tight font-medium text-balance text-ink-900">
        Something broken or out of date?
      </h1>
      <p className="mt-4 max-w-[62ch] text-pretty text-ink-600">
        Dead links are flagged automatically and replaced by hand — never by a
        model, because silently swapping a resource under a learner mid-unit
        is worse than a dead link. Everything else needs a human to hear about
        it: a dead link, a video that moved, a claim
        that aged badly.
      </p>
      <div className="mt-6 rounded-card border border-ink-100 bg-white p-5">
        <p className="text-pretty text-ink-700">
          Email{" "}
          <a
            className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800"
            href="mailto:contact@tindata.com?subject=Broken%20on%20Jintu"
          >
            contact@tindata.com
          </a>{" "}
          with the page link and one line on what is wrong. It is read by the
          person who can fix it, and curriculum fixes ship as a new version so
          nobody's work changes underneath them.
        </p>
      </div>
    </main>
  );
}
