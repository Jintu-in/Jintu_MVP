import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ResourceItem } from "@/components/resource-item";
import { Rubric } from "@/components/rubric";
import { SubmissionForm } from "@/components/submission-form";
import { getSprintWeek, type WeekAssignment } from "@/lib/sprint";
import { createClient } from "@/lib/supabase/server";

/**
 * One week of the sprint: what to read, and what to submit.
 *
 * The dashboard lists six weeks and is deliberately shallow. This is the page
 * a student sits on for seven days, so the reading list and the assignment
 * are on it together — the two things that were on separate pages while the
 * only enrolled view was a list of prompts with no way to reach the material.
 */
export const metadata: Metadata = {
  title: "This week",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function WeekPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/join?next=/week/${week}`);

  // "/week/3.5" and "/week/three" are not weeks. Parsing before querying keeps
  // a typo out of the database and off the error boundary.
  const weekNo = /^[1-9]\d*$/.test(week) ? Number(week) : null;
  if (weekNo === null) notFound();

  const detail = await getSprintWeek(weekNo);
  if (!detail) notFound();

  const previous = detail.weeksInPath.filter((n) => n < weekNo).at(-1);
  const next = detail.weeksInPath.find((n) => n > weekNo);

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
        <Link href="/dashboard" className="hover:text-brand-800">
          Your sprint
        </Link>
        <span aria-hidden> / </span>
        <span className="text-ink-600">Week {String(weekNo).padStart(2, "0")}</span>
      </nav>

      <p className="mt-2 font-mono text-sm text-ink-500">
        Week {String(weekNo).padStart(2, "0")}
      </p>
      <h1 className="mt-0.5 text-3xl font-medium tracking-tight text-balance text-ink-900">
        {detail.title}
      </h1>
      <p className="mt-3 text-lg text-pretty text-ink-600">{detail.objective}</p>

      {detail.resources.length > 0 ? (
        <section aria-labelledby="reading" className="mt-8">
          <h2 id="reading" className="text-sm font-medium tracking-wide text-ink-500 uppercase">
            What to read and watch
          </h2>
          <ul className="mt-3 space-y-3">
            {detail.resources.map((resource) => (
              <li key={resource.id}>
                <ResourceItem resource={resource} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="submit" className="mt-8">
        <h2 id="submit" className="text-sm font-medium tracking-wide text-ink-500 uppercase">
          What you submit
        </h2>

        {detail.assignments.length === 0 ? (
          <p className="mt-3 rounded-card border border-ink-100 bg-white p-4 text-pretty text-ink-500">
            Nothing to submit this week. Read, and come back for week{" "}
            {next ?? weekNo + 1}.
          </p>
        ) : (
          <ul className="mt-3 space-y-4">
            {detail.assignments.map((assignment) => (
              <li
                key={assignment.id}
                className="rounded-card border border-ink-100 bg-white p-4 sm:p-5"
              >
                <Assignment assignment={assignment} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav
        aria-label="Weeks"
        className="mt-10 flex items-center justify-between gap-4 border-t border-ink-100 pt-5 text-sm"
      >
        {previous ? (
          <Link href={`/week/${previous}`} className="text-brand-700 hover:text-brand-800">
            ← Week {String(previous).padStart(2, "0")}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/week/${next}`} className="text-brand-700 hover:text-brand-800">
            Week {String(next).padStart(2, "0")} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}

function Assignment({ assignment }: { assignment: WeekAssignment }) {
  const { submission } = assignment;

  return (
    <>
      <p className="text-pretty text-ink-800">
        {assignment.spec.prompt ?? assignment.kind}
      </p>

      {assignment.rubric ? <Rubric rubric={assignment.rubric} kind={assignment.kind} /> : null}

      {submission ? (
        <div className="mt-4 border-t border-ink-100 pt-4">
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
                  <span className="font-mono tabular-nums">{submission.total}</span>
                  {submission.maxScore !== null ? (
                    <span className="font-mono tabular-nums">/{submission.maxScore}</span>
                  ) : null}
                </span>
              </>
            ) : submission.status === "needs_review" ? (
              // A grader that fell over is a state, not a missing score. The
              // student is told the difference, because "waiting" that never
              // ends reads as being forgotten.
              " · we could not grade this automatically; a human will look"
            ) : (
              " · waiting to be graded"
            )}
          </p>
          <Link
            href={`/feedback/${submission.id}`}
            className="mt-3 inline-flex text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            See how it was marked →
          </Link>
        </div>
      ) : assignment.kind === "sql" || assignment.kind === "artifact_link" ? (
        <SubmissionForm assignmentId={assignment.id} kind={assignment.kind} />
      ) : (
        <p className="mt-3 text-sm text-ink-500">
          This one is submitted by{" "}
          {assignment.kind === "file" ? "file upload" : "recording"}, which is
          not open yet.
        </p>
      )}
    </>
  );
}
