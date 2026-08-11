import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmissionForm } from "@/components/submission-form";
import { countPendingReviews } from "@/lib/review";
import { getMySprint, type SprintAssignment, type SprintWeek } from "@/lib/sprint";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your sprint",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) redirect("/onboarding");

  const [sprint, pendingReviews] = await Promise.all([getMySprint(), countPendingReviews()]);

  // Not enrolled is a normal state, not an error: in the concierge phase ops
  // creates enrolments by hand after payment clears.
  if (!sprint) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="text-2xl font-medium tracking-tight text-ink-900">
          You are not in a cohort yet
        </h1>
        <div className="mt-5 rounded-card border border-ink-100 bg-white p-6">
          <p className="text-pretty text-ink-600">
            Your account is set up. The next cohort has twenty places, and we
            message you before it opens.
          </p>
          <p className="mt-4 text-pretty text-ink-600">
            In the meantime the whole curriculum is free and open. Nothing about
            it is held back for paying students.
          </p>
          <Link
            href="/learn"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:w-auto"
          >
            Start on week one
          </Link>
        </div>
      </main>
    );
  }

  const total = sprint.weeks.reduce((n, w) => n + w.assignments.length, 0);
  const done = sprint.weeks.reduce(
    (n, w) => n + w.assignments.filter((a) => a.submission).length,
    0,
  );
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        Your sprint
      </p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-balance text-ink-900">
        {sprint.trackTitle}
      </h1>

      <div className="mt-5 rounded-card border border-ink-100 bg-white p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-medium text-ink-900">
            <span className="font-mono tabular-nums">{done}</span> of{" "}
            <span className="font-mono tabular-nums">{total}</span> submitted
          </p>
          {sprint.readiness !== null ? (
            <p className="text-sm text-ink-500">
              Readiness{" "}
              <span className="font-mono tabular-nums text-ink-900">
                {sprint.readiness}
              </span>
              /100
            </p>
          ) : null}
        </div>
        {/* aria-hidden: the count above is the accessible value. A second
            announcement of the same number is noise, not information. */}
        <div aria-hidden className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Reviewing is the one part of the week with a deadline that is not the
          student's own work, and it is 20% of their readiness. It gets a row
          of its own rather than a line inside a week, because it is allocated
          across weeks and belongs to none of them. */}
      {pendingReviews > 0 ? (
        <Link
          href="/review"
          className="group mt-4 flex items-center justify-between gap-4 rounded-card border border-warn-600/20 bg-warn-600/10 p-4 hover:border-warn-600/40"
        >
          <p className="text-pretty text-ink-800">
            <span className="font-medium">
              {pendingReviews} review{pendingReviews === 1 ? "" : "s"} to write
            </span>{" "}
            — someone in your cohort is waiting to hear what you thought.
          </p>
          <span aria-hidden className="shrink-0 text-brand-700 group-hover:text-brand-800">
            →
          </span>
        </Link>
      ) : null}

      <ol className="mt-8 space-y-4">
        {sprint.weeks.map((week) => (
          <Week key={week.moduleId} week={week} />
        ))}
      </ol>
    </main>
  );
}

function Week({ week }: { week: SprintWeek }) {
  const headingId = `week-${week.weekNo}`;
  const submitted = week.assignments.filter((a) => a.submission).length;

  return (
    <li
      aria-labelledby={headingId}
      className="rounded-card border border-ink-100 bg-white p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-sm text-ink-500">
            Week {String(week.weekNo).padStart(2, "0")}
          </p>
          <h2 id={headingId} className="mt-0.5 text-lg font-medium text-pretty text-ink-900">
            <Link href={`/week/${week.weekNo}`} className="hover:text-brand-800">
              {week.title}
            </Link>
          </h2>
        </div>
        {week.assignments.length > 0 ? (
          <p className="shrink-0 font-mono text-sm tabular-nums text-ink-500">
            {submitted}/{week.assignments.length}
          </p>
        ) : null}
      </div>

      <p className="mt-2 text-pretty text-ink-600">{week.objective}</p>

      {week.assignments.length === 0 ? (
        <p className="mt-3 text-sm text-ink-500">Nothing to submit this week.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {week.assignments.map((a) => (
            <li key={a.id} className="rounded-card border border-ink-100 bg-ink-50 p-4">
              <Assignment assignment={a} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/** Submitted, graded, or still open — as a chip, so state reads before prose. */
function Status({ tone, children }: { tone: "done" | "waiting"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5",
        "text-xs font-medium",
        tone === "done" ? "bg-ok-600/10 text-ok-800" : "bg-warn-600/10 text-warn-800",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          tone === "done" ? "bg-ok-600" : "bg-warn-600",
        )}
      />
      {children}
    </span>
  );
}

function Assignment({ assignment }: { assignment: SprintAssignment }) {
  const { submission } = assignment;

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-pretty text-ink-800">
          {assignment.spec.prompt ?? assignment.kind}
        </p>
        {submission ? (
          submission.total !== null ? (
            <Status tone="done">Graded</Status>
          ) : (
            <Status tone="waiting">In grading</Status>
          )
        ) : null}
      </div>

      {submission ? (
        <div className="mt-3 border-t border-ink-100 pt-3">
          <p className="text-sm text-ink-600">
            Submitted{" "}
            <time dateTime={submission.submitted_at}>
              {new Date(submission.submitted_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </time>
            {submission.total !== null ? (
              <>
                {" · "}
                <span className="font-medium text-ink-900">
                  scored <span className="font-mono tabular-nums">{submission.total}</span>
                </span>
              </>
            ) : (
              " · waiting to be graded"
            )}
          </p>
          <Link
            href={`/feedback/${submission.id}`}
            className="mt-2 inline-flex text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            {submission.total !== null ? "See how it was marked" : "See its status"} →
          </Link>
        </div>
      ) : assignment.kind === "sql" || assignment.kind === "artifact_link" ? (
        <SubmissionForm
          assignmentId={assignment.id}
          kind={assignment.kind}
          codes={assignment.spec.codes}
        />
      ) : (
        <p className="mt-3 text-sm text-ink-500">
          This one is submitted by {assignment.kind === "file" ? "file upload" : "recording"},
          which is not open yet.
        </p>
      )}
    </>
  );
}
