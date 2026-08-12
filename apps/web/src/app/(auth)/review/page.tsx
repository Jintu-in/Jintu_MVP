import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getReviewQueue, type ReviewTask } from "@/lib/review";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

/**
 * Two reviews a week, allocated by the ring in
 * `public.allocate_peer_reviews`. Reading someone else's answer to the
 * question you just answered is most of what peer review is for; the marks
 * are the smaller half.
 */
export const metadata: Metadata = {
  title: "Reviews to write",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const dueLabel = (dueAt: string) => {
  const days = Math.ceil((new Date(dueAt).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, late: true };
  if (days === 0) return { text: "Due today", late: true };
  if (days === 1) return { text: "Due tomorrow", late: false };
  return { text: `Due in ${days} days`, late: false };
};

export default async function ReviewQueuePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join?next=/review");

  const queue = await getReviewQueue();
  const pending = queue.filter((t) => t.status === "pending");
  const done = queue.filter((t) => t.status === "submitted");

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        Peer review
      </p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-balance text-ink-900">
        {pending.length > 0 ? "Reviews to write" : "Nothing to review"}
      </h1>

      {queue.length === 0 ? (
        <div className="mt-5 rounded-card border border-ink-100 bg-white p-6">
          <p className="text-pretty text-ink-600">
            Reviews are allocated once other people on your track have
            submitted the same assignment. Submit yours and you will be given
            two to read.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:w-auto"
          >
            Back to your sprint
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-3 text-pretty text-ink-600">
            You do not know whose work this is, and they never learn who read
            it. Reviewing counts towards your own readiness score; the marks
            you are given by others do not.
          </p>

          {pending.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {pending.map((task) => (
                <li key={task.peerReviewId}>
                  <QueueRow task={task} />
                </li>
              ))}
            </ul>
          ) : null}

          {done.length > 0 ? (
            <>
              <h2 className="mt-8 text-sm font-medium tracking-wide text-ink-500 uppercase">
                Already sent
              </h2>
              <ul className="mt-3 space-y-2">
                {done.map((task) => (
                  <li
                    key={task.peerReviewId}
                    className="rounded-card border border-ink-100 bg-ink-50 px-4 py-3 text-sm text-ink-600"
                  >
                    Week {String(task.weekNo).padStart(2, "0")} · {task.prompt}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </>
      )}
    </main>
  );
}

function QueueRow({ task }: { task: ReviewTask }) {
  const due = dueLabel(task.dueAt);

  return (
    <Link
      href={`/review/${task.peerReviewId}`}
      className="group block rounded-card border border-ink-100 bg-white p-4 hover:border-brand-600"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-sm text-ink-500">
          Week {String(task.weekNo).padStart(2, "0")}
        </p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
            due.late ? "bg-risk-600/10 text-risk-600" : "bg-warn-600/10 text-warn-700",
          )}
        >
          {due.text}
        </span>
      </div>
      <p className="mt-1 font-medium text-pretty text-ink-900 group-hover:text-brand-800">
        {task.prompt}
      </p>
      <p className="mt-2 text-sm text-ink-500">
        {task.rubric
          ? `${task.rubric.name} · ${task.rubric.max_score} points`
          : "No rubric on this assignment"}
      </p>
    </Link>
  );
}
