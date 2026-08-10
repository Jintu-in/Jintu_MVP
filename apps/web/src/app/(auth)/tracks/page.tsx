import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShareButton } from "@/components/share-button";
import { listMyRequests, listMyTracks, type MyRequest } from "@/lib/my-tracks";
import { createClient } from "@/lib/supabase/server";

/**
 * My tracks — everything of yours in one place.
 *
 * Two sections, and the order is the point. What you are enrolled in comes
 * first because it is the thing with deadlines. What you have asked for comes
 * second because it is the thing you are waiting on, and a waiting list at the
 * top of a page reads as the main event when it should not.
 *
 * Where this sits in the four pages about you:
 *
 *   /tracks     what you are in, and what you have asked for
 *   /dashboard  what is due this week in the track you are running
 *   /profile    what we store about you
 *   /account    what you agreed to, and how to get it all back
 */
export const metadata: Metadata = {
  title: "Your tracks",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const STATUS: Record<MyRequest["status"], { label: string; detail: string; tone: string }> = {
  new: { label: "Requested", detail: "Waiting for someone to read it.", tone: "text-ink-600" },
  triaged: { label: "Read", detail: "Looked at, and in the queue.", tone: "text-ink-600" },
  writing: { label: "Being written", detail: "Someone is working on it now.", tone: "text-brand-800" },
  published: { label: "Published", detail: "It is live — open it from Tracks.", tone: "text-ok-800" },
  declined: {
    label: "Not being built",
    detail: "We could not do this one well enough to publish it.",
    tone: "text-ink-600",
  },
};

export default async function MyTracksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Everything below is scoped by RLS and would simply come back empty for a
  // signed-out visitor, which reads as "you have nothing" rather than "you are
  // not signed in". Those are different sentences and only one of them is true.
  if (!user) redirect("/join?next=/tracks");

  const [tracks, requests] = await Promise.all([
    listMyTracks(),
    // A requests failure must not take the enrolments down with it. The
    // enrolment is the thing with a deadline attached.
    listMyRequests().catch(() => []),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="text-2xl font-medium text-ink-900">Your tracks</h1>

      {/* ── enrolled ───────────────────────────────────────────────────── */}
      <section className="mt-8" aria-labelledby="enrolled">
        <h2 id="enrolled" className="text-lg font-medium text-ink-900">
          Running
        </h2>

        {tracks.length ? (
          <ul className="mt-4 space-y-3">
            {tracks.map((t) => (
              <li key={t.enrollmentId} className="border border-ink-100 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[15px] font-medium text-ink-900">{t.title}</p>
                  <p className="font-mono text-[13px] text-ink-500">{t.status}</p>
                </div>
                {t.startsOn ? (
                  <p className="mt-1 text-[13px] text-ink-500">
                    {new Date(t.startsOn).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                    {t.endsOn
                      ? ` – ${new Date(t.endsOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                      : ""}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
                  <Link href="/dashboard" className="text-brand-700 underline hover:text-brand-800">
                    This week&rsquo;s work
                  </Link>
                  {t.slug ? (
                    <Link
                      href={`/learn/${t.slug}`}
                      className="text-brand-700 underline hover:text-brand-800"
                    >
                      Full curriculum
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 border border-ink-100 bg-ink-50 p-5">
            <p className="text-[15px] leading-[1.7] text-pretty text-ink-700">
              You are not in a cohort yet. Every curriculum is free to work
              through on your own in the meantime — nothing is held back for
              paying students.
            </p>
            <Link
              href="/learn"
              className="mt-3 inline-block text-[15px] text-brand-700 underline hover:text-brand-800"
            >
              Browse tracks
            </Link>
          </div>
        )}
      </section>

      {/* ── requested ──────────────────────────────────────────────────── */}
      <section className="mt-12" aria-labelledby="requested">
        <h2 id="requested" className="text-lg font-medium text-ink-900">
          Requested
        </h2>

        {requests.length ? (
          <ul className="mt-4 space-y-3">
            {requests.map((r) => {
              const s = STATUS[r.status] ?? STATUS.new;
              return (
                <li key={r.id} className="border border-ink-100 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className={`text-[13px] font-medium ${s.tone}`}>{s.label}</p>
                    <p className="font-mono text-[13px] text-ink-500">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <p className="mt-1.5 text-[15px] leading-[1.7] text-pretty text-ink-800">
                    {r.prompt}
                  </p>
                  <p className="mt-1 text-[13px] text-ink-500">{s.detail}</p>
                  <div className="mt-3">
                    <ShareButton id={r.id} subtle />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-4 border border-ink-100 bg-ink-50 p-5">
            <p className="text-[15px] leading-[1.7] text-pretty text-ink-700">
              You have not asked for anything yet. If the track you want does
              not exist, say so on the home page and a person will write it.
            </p>
            <Link
              href="/"
              className="mt-3 inline-block text-[15px] text-brand-700 underline hover:text-brand-800"
            >
              Ask for a course
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
