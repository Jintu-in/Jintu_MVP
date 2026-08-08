const WEEKS = [
  { week: "01–02", title: "SQL, for real problems", artifact: "Query set, auto-graded" },
  { week: "03", title: "Cleaning messy data", artifact: "Cleaned dataset + notes" },
  { week: "04", title: "Analysis that answers something", artifact: "Findings memo" },
  { week: "05", title: "Dashboards people can read", artifact: "Published dashboard" },
  { week: "06", title: "Explaining your work out loud", artifact: "Recorded walkthrough" },
];

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        Placement sprints · Data roles
      </p>

      <h1 className="mt-4 text-4xl leading-tight font-semibold text-balance text-ink-900 sm:text-5xl">
        Six weeks. Six artifacts. One profile that shows what you can actually do.
      </h1>

      <p className="mt-6 text-lg text-pretty text-ink-600">
        A cohort-based sprint for first-job data roles. You build one real thing
        a week, get it graded against a published rubric, review two peers, and
        finish with a shareable proof-of-readiness profile.
      </p>

      <p className="mt-4 text-lg text-pretty text-ink-600">
        The curriculum is free and public. You pay for the cohort — the
        deadlines, the grading, the peer review, and the profile.
      </p>

      <section className="mt-12" aria-labelledby="weeks-heading">
        <h2 id="weeks-heading" className="text-sm font-semibold tracking-wide text-ink-500 uppercase">
          What you build
        </h2>
        <ul className="mt-4 divide-y divide-ink-100 border-y border-ink-100">
          {WEEKS.map(({ week, title, artifact }) => (
            <li key={week} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
              <span className="w-14 shrink-0 font-mono text-sm text-ink-500">{week}</span>
              <span className="font-medium text-ink-900">{title}</span>
              <span className="ml-auto text-sm text-ink-500">{artifact}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-card bg-ink-50 p-6" aria-labelledby="honest-heading">
        <h2 id="honest-heading" className="font-semibold text-ink-900">
          What this is not
        </h2>
        <p className="mt-2 text-pretty text-ink-600">
          We do not promise you a job, and we will never publish a placement
          statistic we cannot evidence. What we can promise is that at the end
          you will have six pieces of work, graded against a rubric you can
          read up front, that you can show to anyone.
        </p>
      </section>

    </main>
  );
}
