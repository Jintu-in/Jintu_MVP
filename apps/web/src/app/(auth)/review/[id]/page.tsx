import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PeerReviewForm } from "@/components/peer-review-form";
import { criteriaOf, getReviewTask, type ReviewTask } from "@/lib/review";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Review someone's work",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/join?next=/review/${id}`);

  // Not found rather than forbidden, and not by choice of wording: the queue
  // view returns nothing for an id that is not the caller's, so this page
  // genuinely cannot tell an id that does not exist from one belonging to
  // someone else. Which is the right amount for it to know.
  const task = await getReviewTask(id);
  if (!task) notFound();

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
        <Link href="/review" className="hover:text-brand-800">
          Peer review
        </Link>
        <span aria-hidden> / </span>
        <span className="text-ink-600">Week {String(task.weekNo).padStart(2, "0")}</span>
      </nav>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance text-ink-900">
        {task.prompt}
      </h1>
      <p className="mt-2 text-sm text-pretty text-ink-500">
        Submitted by someone else in your cohort. You are not told who, and
        they are not told who reviewed them.
      </p>

      <section aria-labelledby="the-work" className="mt-6">
        <h2 id="the-work" className="text-sm font-medium tracking-wide text-ink-500 uppercase">
          Their work
        </h2>
        <Work task={task} />
      </section>

      {task.status === "submitted" ? (
        <p className="mt-6 rounded-card border border-ink-100 bg-ink-50 px-4 py-3 text-pretty text-ink-600">
          You have already sent this review. Reviews cannot be changed once
          sent — the author has read it.
        </p>
      ) : (
        <PeerReviewForm peerReviewId={task.peerReviewId} criteria={criteriaOf(task.rubric)} />
      )}
    </main>
  );
}

function Work({ task }: { task: ReviewTask }) {
  if (task.kind === "sql" && task.payload.sql) {
    return (
      <pre className="mt-3 overflow-x-auto rounded-card border border-ink-200 bg-white p-4 font-mono text-sm text-ink-800">
        <code>{task.payload.sql}</code>
      </pre>
    );
  }

  if (task.payload.url) {
    return (
      <div className="mt-3 rounded-card border border-ink-200 bg-white p-4">
        {/*
          noreferrer as well as noopener: this is a stranger's link opened by
          a student, and the referrer would otherwise tell whoever is on the
          other end which review page it came from.
         */}
        <a
          href={task.payload.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium break-all text-brand-700 hover:text-brand-800"
        >
          {task.payload.url}
        </a>
        {task.payload.note ? (
          <p className="mt-3 border-t border-ink-100 pt-3 text-pretty text-ink-600">
            {task.payload.note}
          </p>
        ) : null}
      </div>
    );
  }

  // Unreachable by design: `allocate_peer_reviews` refuses to allocate file
  // and recording submissions, because a reviewer cannot be handed the object
  // without being handed the author's uid in its path. If this renders,
  // something allocated a review by hand.
  return (
    <p className="mt-3 rounded-card border border-ink-200 bg-white p-4 text-pretty text-ink-500">
      There is nothing here to read. Message us — this review should not have
      been allocated, and we will take it off your queue.
    </p>
  );
}
