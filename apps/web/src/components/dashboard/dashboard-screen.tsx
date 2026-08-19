import Link from "next/link";
import type { Route } from "next";
import TintedDashboard from "@/components/dashboard/dashboard-tinted";
import type { DashboardData } from "@/lib/dashboard";

/**
 * The dashboard, in three shapes.
 *
 * Not one template with different numbers — the shape itself changes, and
 * that is the whole screen:
 *
 *   NEW       One action. No streak strip, no stat cards, no roadmap list.
 *             A dashboard full of zeros on day two makes the product feel
 *             dead, so the zeros are not rendered at all.
 *   HABITUAL  Streak row + strip · Resume as the dominant element · review
 *             and saved with honest time costs · the roadmap list.
 *   LAPSED    No streak strip: fourteen mostly-empty squares shown to
 *             someone who just lapsed is a rebuke. Reassurance first, then
 *             ONE section, then an escape hatch, then permission to ignore
 *             everything else.
 *
 * Presentational only — every number arrives as a prop, computed from real
 * rows in lib/dashboard.ts. Exactly one filled button per state: whatever
 * is not the next action competes with the next action.
 *
 * Copy is verbatim from the design set (Dashboard states); colours are the
 * preset's measured tokens, never the design file's raw hexes.
 */

const Shell = ({ children }: { children: React.ReactNode }) => (
  <main className="mx-auto min-h-dvh w-full max-w-[520px] bg-white px-5 pt-6 pb-12">{children}</main>
);

const Greeting = ({ text }: { text: string }) => (
  <h1 className="text-[22px] leading-[1.3] font-medium text-ink-900">{text}</h1>
);

/** The one filled button. Each state gets exactly one. */
const PrimaryAction = ({ href, children }: { href: Route; children: React.ReactNode }) => (
  <Link
    href={href}
    className="mt-4 flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-700 px-4 text-[16px] font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
  >
    {children}
  </Link>
);

const SecondaryAction = ({ href, children }: { href: Route; children: React.ReactNode }) => (
  <Link
    href={href}
    className="mt-2.5 flex min-h-12 w-full items-center justify-center rounded-lg border border-ink-100 bg-white px-4 text-[15px] font-medium text-brand-700 hover:border-brand-700"
  >
    {children}
  </Link>
);

export default function DashboardScreen({ data }: { data: DashboardData }) {
  const name = data.firstName;

  // ── NEW ────────────────────────────────────────────────────────────────────
  // One action, and nothing that could show a zero.
  if (data.state === "new") {
    const nextStreak = data.streak.totalDays + 1;
    return (
      <Shell>
        <Greeting text={name ? `${data.greeting}, ${name}` : data.greeting} />
        {data.resume ? (
          <section className="mt-5 rounded-card border border-brand-700 bg-white p-4">
            <h2 className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-brand-700 uppercase">
              Start here
            </h2>
            <p className="mt-3 text-[18px] leading-[1.35] font-medium text-ink-900">
              Day {data.resume.dayNumber} · {data.resume.nodeTitle}
            </p>
            <p className="mt-1.5 font-mono text-[12.5px] leading-[1.5] text-ink-500">
              {data.resume.roadmapTitle} · {data.resume.blocks} sections · ~
              {data.resume.blockPosition !== null ? data.resume.minutesLeft : data.resume.estMinutes}{" "}
              min
            </p>
            <PrimaryAction href={data.resume.href as Route}>
              {data.resume.blockPosition !== null
                ? "Resume"
                : `Start day ${data.resume.dayNumber}`}
            </PrimaryAction>
          </section>
        ) : (
          <section className="mt-5 rounded-card border border-brand-700 bg-white p-4">
            <h2 className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-brand-700 uppercase">
              Start here
            </h2>
            <p className="mt-3 text-[18px] leading-[1.35] font-medium text-ink-900">
              Pick a roadmap
            </p>
            <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-600">
              Four roadmaps, all free, all readable without an account.
            </p>
            <PrimaryAction href={"/learn" as Route}>Browse roadmaps</PrimaryAction>
          </section>
        )}

        {/* What appears tomorrow — said plainly, instead of shown as zeros. */}
        <p className="mt-5 rounded-card bg-brand-50 p-4 text-[15px] leading-[1.65] text-pretty text-brand-900">
          {data.streak.doneToday
            ? `Today is done. Come back tomorrow and this becomes a ${nextStreak}-day streak.`
            : `Finish today and you have a ${nextStreak}-day streak. It shows up here tomorrow.`}
        </p>
        <p className="mt-4 text-[13px] leading-[1.7] text-ink-500">
          Nothing else here yet. Notes, saved links and review will fill in as you go.
        </p>
      </Shell>
    );
  }

  // ── LAPSED ─────────────────────────────────────────────────────────────────
  // No strip. Reassurance, then the smallest possible way back.
  if (data.state === "lapsed") {
    const missed = data.streak.daysSince ?? 0;
    return (
      <Shell>
        <Greeting text={name ? `Welcome back, ${name}` : "Welcome back"} />
        <p className="mt-3 text-[18px] leading-[1.4] font-medium text-ink-900">
          Your {data.streak.totalDays} days are still here.
        </p>
        <p className="mt-2 text-[15px] leading-[1.65] text-pretty text-ink-600">
          You missed {missed} {missed === 1 ? "day" : "days"}, so the streak restarted. Nothing else
          changed — every note, every finished day, still yours.
        </p>

        {data.resume ? (
          <section className="mt-5 rounded-card border border-brand-700 bg-white p-4">
            <h2 className="font-mono text-[11px] leading-none font-medium tracking-[.08em] text-brand-700 uppercase">
              The smallest way back
            </h2>
            <p className="mt-3 text-[18px] leading-[1.35] font-medium text-ink-900">
              {data.resume.nodeTitle}
            </p>
            <p className="mt-1.5 font-mono text-[12.5px] leading-[1.5] text-ink-500">
              Day {data.resume.dayNumber} ·{" "}
              {data.resume.blockPosition !== null
                ? "just the section you stopped on"
                : "just the first section"}{" "}
              · <span className="text-ink-900">~{sectionMinutes(data.resume)} min</span>
            </p>
            <PrimaryAction href={data.resume.href as Route}>Read one section</PrimaryAction>
          </section>
        ) : null}

        {data.previousDay ? (
          <div className="mt-5">
            <p className="text-[15px] leading-[1.65] text-pretty text-ink-600">
              Or start further back — day {data.previousDay.dayNumber} was{" "}
              {data.previousDay.title.toLowerCase()}, if {data.resume?.nodeTitle.toLowerCase() ?? "this"}{" "}
              feels cold.
            </p>
            <SecondaryAction href={data.previousDay.href as Route}>
              Reread day {data.previousDay.dayNumber}
            </SecondaryAction>
          </div>
        ) : null}

        {/* Explicit permission to ignore the rest. */}
        <p className="mt-6 border-t border-ink-100 pt-4 text-[13px] leading-[1.7] text-ink-500">
          Review and saved links are waiting, but they can keep.
        </p>
      </Shell>
    );
  }

  // ── HABITUAL ───────────────────────────────────────────────────────────────
  // The returning learner's home is the tinted design (Dashboard tinted).
  // Its own content assumes somebody with a streak, a roadmap in progress
  // and a points total, which is exactly this state — so the new and
  // lapsed layouts above are untouched. A wall of stats on day two still
  // makes the product feel dead, and a full grid shown to somebody who
  // just lapsed is still a rebuke.
  return <TintedDashboard data={data} />;
}

/**
 * One section's worth of minutes — the lapsed state offers a section, not a
 * day, so it needs the per-block figure rather than the whole remainder.
 */
function sectionMinutes(resume: NonNullable<DashboardData["resume"]>): number {
  return Math.max(1, Math.round(resume.estMinutes / Math.max(1, resume.blocks)));
}
