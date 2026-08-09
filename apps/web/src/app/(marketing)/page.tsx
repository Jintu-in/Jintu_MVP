import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import { cn } from "@/lib/utils";

const WEEKS = [
  { week: "01–02", title: "SQL, for real problems", artifact: "Query set, auto-graded" },
  { week: "03", title: "Cleaning messy data", artifact: "Cleaned dataset + notes" },
  { week: "04", title: "Analysis that answers something", artifact: "Findings memo" },
  { week: "05", title: "Dashboards people can read", artifact: "Published dashboard" },
  { week: "06", title: "Explaining your work out loud", artifact: "Recorded walkthrough" },
];

const STATS = [
  { label: "Duration", value: "6 weeks" },
  { label: "Output", value: "6 artifacts" },
  { label: "Price", value: "₹999 once" },
];

const STEPS = [
  "Join a cohort. Everyone starts on the same Monday.",
  "Ship one artifact a week. Graded against the published rubric, and reviewed by two peers.",
  "Finish with a profile you can send to anyone.",
];

export default function LandingPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <h1 className="text-[28px] leading-9 font-semibold tracking-tight text-balance text-ink-900 sm:text-5xl sm:leading-tight">
          Six weeks. Six artifacts. One profile that shows what you can actually
          do.
        </h1>

        <p className="mt-5 text-lg text-pretty text-ink-600">
          A cohort-based sprint for first-job data roles. You build one real thing
          a week, get it graded against a published rubric, review two peers, and
          finish with a shareable proof-of-readiness profile.
        </p>

        <p className="mt-4 text-lg text-pretty text-ink-600">
          The curriculum is free and public. You pay for the cohort — the
          deadlines, the grading, the peer review, and the profile.
        </p>

        {/* Stacked and full-bleed on a phone, content-width side by side once
            there is room — a 768px-wide primary button reads as a banner. */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/learn"
            className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            See the free curriculum
          </Link>
          <a
            href="#how-it-works"
            className="flex h-12 items-center justify-center rounded-lg font-medium text-brand-700 hover:text-brand-800"
          >
            How it works
          </a>
        </div>
      </section>

      {/* Full-bleed band, so it separates the pitch from the detail below it.
          brand-950 on the brand fill, never white: #43b4c8 carries white at
          2.44:1 — see the note at the top of the palette. */}
      <section className="border-y border-ink-100 bg-brand-500" aria-label="At a glance">
        <dl className="mx-auto flex max-w-3xl items-center px-5 py-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={cn("flex-1", i > 0 && "border-l border-brand-950/20 pl-4")}
            >
              <dt className="text-xs font-medium tracking-wide text-brand-950 uppercase">
                {stat.label}
              </dt>
              <dd className="mt-0.5 font-semibold text-brand-950">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* scroll-mt clears the sticky app bar when the hero link jumps here. */}
      <section
        id="how-it-works"
        className="mx-auto max-w-3xl scroll-mt-20 px-5 py-12"
        aria-labelledby="how-heading"
      >
        <h2 id="how-heading" className="text-2xl font-semibold tracking-tight text-ink-900">
          How it works
        </h2>

        <ol className="mt-5 space-y-3">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="rounded-card border border-ink-100 border-l-4 border-l-brand-500 bg-white p-4"
            >
              <p className="text-sm font-medium text-ink-500">Step {i + 1}</p>
              <p className="mt-1 text-pretty text-ink-900">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-12" aria-labelledby="weeks-heading">
        <h2 id="weeks-heading" className="text-2xl font-semibold tracking-tight text-ink-900">
          What you build
        </h2>

        <ul className="mt-5 divide-y divide-ink-100 rounded-card border border-ink-100 bg-white px-4">
          {WEEKS.map(({ week, title, artifact }) => (
            <li key={week} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
              <span className="w-14 shrink-0 font-mono text-sm text-ink-500">{week}</span>
              <span className="font-medium text-ink-900">{title}</span>
              <span className="ml-auto text-sm text-ink-500">{artifact}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-12" aria-labelledby="honest-heading">
        <div className="rounded-card border border-ink-100 bg-white p-6">
          <h2 id="honest-heading" className="font-semibold text-ink-900">
            What this is not
          </h2>
          <p className="mt-2 text-pretty text-ink-600">
            We do not promise you a job, and we will never publish a placement
            statistic we cannot evidence. What we can promise is that at the end
            you will have six pieces of work, graded against a rubric you can
            read up front, that you can show to anyone.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-12">
        <div className="flex flex-col items-center gap-5 rounded-card border border-ink-100 bg-white p-6 text-center">
          <p className="text-pretty text-ink-900">
            The curriculum is free. Read all of it before you pay anything.
          </p>
          <Link
            href="/learn"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-ink-200 px-5 font-medium text-brand-700 hover:border-brand-600 hover:text-brand-800"
          >
            Open the curriculum
          </Link>
        </div>
      </section>

      {/* scroll-mt so the heading is not hidden under the header when the
          pricing page links here. */}
      <section id="waitlist" className="mx-auto max-w-3xl scroll-mt-20 px-5 pb-16">
        <WaitlistForm />
      </section>
    </main>
  );
}
