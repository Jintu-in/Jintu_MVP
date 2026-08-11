import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ShareButton } from "@/components/share-button";
import { createClient } from "@/lib/supabase/server";

/**
 * One shared request.
 *
 * Someone asks for a course and sends the link to a classmate: "this is what I
 * asked for". The link needs a session to open, which is the design rather
 * than a restriction — the row is free text a person typed, and a link
 * forwarded out of a group chat should not publish it to the web.
 *
 * In the (auth) group, so an unauthenticated visitor is sent to sign in and
 * returned here afterwards rather than being told no.
 *
 * Deliberately says nothing about who asked. The reader learns what was
 * requested and where it got to, which is the whole of what sharing it is for.
 */
export const metadata: Metadata = {
  title: "A requested course",
  // Every one of these is somebody's free text behind a sign-in wall. None of
  // it belongs in an index.
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Status = { label: string; detail: string; tone: string };

const UNKNOWN: Status = {
  label: "Received",
  detail: "Waiting for someone to read it.",
  tone: "text-ink-600",
};

const STATUS: Record<string, Status> = {
  new: { label: "Received", detail: "Waiting for someone to read it.", tone: "text-ink-600" },
  triaged: { label: "Read", detail: "Looked at, and in the queue.", tone: "text-ink-600" },
  writing: { label: "Being written", detail: "Someone is working on it now.", tone: "text-brand-800" },
  published: { label: "Published", detail: "It is live — it is in the curriculum.", tone: "text-ok-800" },
  declined: {
    label: "Not being built",
    detail: "We could not do this one well enough to publish it.",
    tone: "text-ink-600",
  },
};

export default async function SharedRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // `next` so the link survives the round trip. Someone opening this from
  // WhatsApp signs in and lands on the request, not on a dashboard wondering
  // what they clicked.
  if (!user) redirect(`/join?next=/requests/${id}`);

  const { data, error } = await supabase.rpc("shared_course_request", { p_id: id });

  if (error) throw new Error(`could not load the request: ${error.code ?? ""} ${error.message}`);

  const request = (data as { prompt: string; status: string; created_at: string; is_mine: boolean }[] | null)?.[0];
  if (!request) notFound();

  const s = STATUS[request.status] ?? UNKNOWN;

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        {request.is_mine ? "Your request" : "A course someone asked for"}
      </p>

      <h1 className="mt-3 text-2xl leading-snug font-medium text-balance text-ink-900">
        {request.prompt}
      </h1>

      <div className="mt-6 rounded-card border border-ink-100 bg-white p-5">
        <p className={`font-medium ${s.tone}`}>{s.label}</p>
        <p className="mt-1 text-pretty text-ink-600">{s.detail}</p>
        <p className="mt-3 font-mono text-xs text-ink-500">
          Asked {new Date(request.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {request.is_mine ? (
          <div className="mt-4">
            <ShareButton id={id} subtle />
          </div>
        ) : null}
      </div>

      <div className="mt-8 rounded-card border border-ink-100 bg-ink-50 p-5">
        <p className="text-pretty text-ink-700">
          {request.is_mine
            ? "Nothing to do while you wait. There are finished courses to work through in the meantime, all free."
            : "Courses here are written by a person, not generated. While this one is waiting, the finished ones are free to work through."}
        </p>
        <Link
          href="/learn"
          className="mt-4 inline-flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Browse the curriculum
        </Link>
      </div>
    </main>
  );
}
