import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SubmissionForm } from "@/components/submission-form";
import { getMySprint, type SprintAssignment, type SprintWeek } from "@/lib/sprint";
import { createClient } from "@/lib/supabase/server";

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

  const sprint = await getMySprint();

  // Not enrolled is a normal state, not an error: in the concierge phase ops
  // creates enrolments by hand after payment clears.
  if (!sprint) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-ink-900">You are not in a cohort yet</h1>
        <p className="mt-3 text-pretty text-ink-600">
          Your account is set up. The next cohort has twenty places, and we
          message you before it opens.
        </p>
        <p className="mt-6 text-pretty text-ink-600">
          In the meantime the whole curriculum is free and open —{" "}
          <Link href="/learn" className="text-brand-700 underline hover:text-brand-800">
            start on week one
          </Link>
          . Nothing about it is held back for paying students.
        </p>
      </main>
    );
  }

  const total = sprint.weeks.reduce((n, w) => n + w.assignments.length, 0);
  const done = sprint.weeks.reduce(
    (n, w) => n + w.assignments.filter((a) => a.submission).length,
    0,
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">Your sprint</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink-900">{sprint.trackTitle}</h1>
      <p className="mt-2 text-ink-600">
        {done} of {total} submitted
        {sprint.readiness !== null ? ` · readiness ${sprint.readiness}/100` : null}
      </p>

      <ol className="mt-10 space-y-10">
        {sprint.weeks.map((week) => (
          <Week key={week.moduleId} week={week} />
        ))}
      </ol>
    </main>
  );
}

function Week({ week }: { week: SprintWeek }) {
  const headingId = `week-${week.weekNo}`;
  return (
    <li aria-labelledby={headingId}>
      <p className="font-mono text-sm text-ink-500">
        Week {String(week.weekNo).padStart(2, "0")}
      </p>
      <h2 id={headingId} className="mt-1 text-xl font-semibold text-ink-900">
        {week.title}
      </h2>
      <p className="mt-1 text-pretty text-ink-600">{week.objective}</p>

      {week.assignments.length === 0 ? (
        <p className="mt-3 text-sm text-ink-500">Nothing to submit this week.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {week.assignments.map((a) => (
            <li key={a.id} className="rounded-card border border-ink-200 p-4">
              <Assignment assignment={a} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function Assignment({ assignment }: { assignment: SprintAssignment }) {
  const { submission } = assignment;

  return (
    <>
      <p className="text-pretty text-ink-800">{assignment.spec.prompt ?? assignment.kind}</p>

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
                <span className="font-medium text-ink-900">scored {submission.total}</span>
              </>
            ) : (
              " · waiting to be graded"
            )}
          </p>
          {submission.feedback ? (
            <p className="mt-2 text-pretty text-sm text-ink-700">{submission.feedback}</p>
          ) : null}
        </div>
      ) : assignment.kind === "sql" || assignment.kind === "artifact_link" ? (
        <SubmissionForm assignmentId={assignment.id} kind={assignment.kind} />
      ) : (
        <p className="mt-3 text-sm text-ink-500">
          This one is submitted by {assignment.kind === "file" ? "file upload" : "recording"},
          which is not open yet.
        </p>
      )}
    </>
  );
}
