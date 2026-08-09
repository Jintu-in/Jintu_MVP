import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getFeedback, type GradeCard } from "@/lib/sprint";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

/**
 * How one submission was marked, criterion by criterion.
 *
 * The rubric is public and the student read it before they started — the
 * landing page promises exactly that. So this page is the same list they
 * already saw, with what they scored against each line and what the grader
 * said about it. A bare total would be a number with no way to act on it.
 */
export const metadata: Metadata = {
  title: "How it was marked",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/join?next=/feedback/${id}`);

  // RLS returns nothing for a submission that is not the caller's, so someone
  // else's id is indistinguishable from one that does not exist. That is the
  // right amount for this page to know.
  const feedback = await getFeedback(id);
  if (!feedback) notFound();

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
        <Link href={`/week/${feedback.weekNo}`} className="hover:text-brand-800">
          Week {String(feedback.weekNo).padStart(2, "0")}
        </Link>
        <span aria-hidden> / </span>
        <span className="text-ink-600">How it was marked</span>
      </nav>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance text-ink-900">
        {feedback.prompt}
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Submitted{" "}
        <time dateTime={feedback.submittedAt}>
          {new Date(feedback.submittedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
          })}
        </time>
        {feedback.rubric ? (
          <>
            {" · graded against "}
            <code className="font-mono">{feedback.rubric.name}</code>
          </>
        ) : null}
      </p>

      {feedback.machine ? (
        <Card
          title="Automatic grading"
          subtitle="Your query was run against the expected result. No model was involved, and it cost nothing."
          card={feedback.machine}
          maxScore={feedback.rubric?.max_score ?? null}
        />
      ) : (
        <p
          className={cn(
            "mt-6 rounded-card border px-4 py-3 text-pretty",
            feedback.status === "needs_review"
              ? "border-warn-600/20 bg-warn-600/10 text-ink-800"
              : "border-ink-100 bg-white text-ink-600",
          )}
        >
          {feedback.status === "needs_review"
            ? "We could not grade this automatically. Someone is looking at it by hand — your score is not lost, it is late."
            : "This has not been graded yet. Automatic grading usually lands within a minute of submitting."}
        </p>
      )}

      <section aria-labelledby="peers" className="mt-8">
        <h2 id="peers" className="text-sm font-medium tracking-wide text-ink-500 uppercase">
          What your peers said
        </h2>

        {feedback.peers.length === 0 ? (
          <p className="mt-3 rounded-card border border-ink-100 bg-white p-4 text-pretty text-ink-500">
            Two people in your cohort have been asked to read this. Their
            reviews appear here when they send them.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-pretty text-ink-500">
              You are not told who wrote these, and they were not told whose
              work they were reading. Peer marks do not count towards your
              readiness score — writing reviews does.
            </p>
            {feedback.peers.map((peer, i) => (
              <Card
                key={peer.createdAt}
                title={`Reviewer ${i + 1}`}
                card={peer}
                maxScore={feedback.rubric?.max_score ?? null}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}

function Card({
  title,
  subtitle,
  card,
  maxScore,
}: {
  title: string;
  subtitle?: string;
  card: GradeCard;
  maxScore: number | null;
}) {
  return (
    <section className="mt-6 rounded-card border border-ink-100 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-medium text-ink-900">{title}</h3>
        <p className="font-mono tabular-nums text-ink-900">
          {card.total}
          {maxScore !== null ? <span className="text-ink-500">/{maxScore}</span> : null}
        </p>
      </div>
      {subtitle ? <p className="mt-1 text-sm text-pretty text-ink-500">{subtitle}</p> : null}

      {card.criteria.length > 0 ? (
        <ul className="mt-4 divide-y divide-ink-100 border-t border-ink-100">
          {card.criteria.map((criterion) => (
            <li key={criterion.key} className="flex items-baseline gap-4 py-2.5">
              <span className="min-w-0 flex-1 text-pretty text-ink-700">
                {criterion.label}
              </span>
              <span
                className={cn(
                  "shrink-0 font-mono tabular-nums",
                  criterion.awarded === null
                    ? "text-ink-500"
                    : criterion.awarded === criterion.weight
                      ? "text-ok-600"
                      : criterion.awarded === 0
                        ? "text-risk-600"
                        : "text-warn-600",
                )}
              >
                {criterion.awarded === null ? "—" : criterion.awarded}
                <span className="text-ink-500">/{criterion.weight}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {card.feedback ? (
        // whitespace-pre-line: the deterministic grader writes one line per
        // criterion, and collapsing them into a paragraph loses which sentence
        // belongs to which line above.
        <p className="mt-4 border-t border-ink-100 pt-4 whitespace-pre-line text-pretty text-ink-700">
          {card.feedback}
        </p>
      ) : null}
    </section>
  );
}
