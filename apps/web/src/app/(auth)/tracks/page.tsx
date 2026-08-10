import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShareButton } from "@/components/share-button";
import { StatusPill } from "@/components/status-pill";
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

const STATUS: Record<
  MyRequest["status"],
  { label: string; detail: string; tone: "neutral" | "active" | "done" }
> = {
  new: { label: "Requested", detail: "Waiting for someone to read it.", tone: "neutral" },
  triaged: { label: "Read", detail: "Looked at, and in the queue.", tone: "neutral" },
  writing: { label: "Being written", detail: "Someone is working on it now.", tone: "active" },
  published: { label: "Published", detail: "It is live — open it from Tracks.", tone: "done" },
  declined: {
    label: "Not being built",
    detail: "We could not do this one well enough to publish it.",
    tone: "neutral",
  },
};

const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

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
    <main className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
      <h1 className="text-[26px] leading-tight font-medium text-ink-900 sm:text-[32px]">
        Your tracks
      </h1>

      {/* ── enrolled ───────────────────────────────────────────────────── */}
      <Section title="Running" count={tracks.length} className="mt-10 sm:mt-12">
        {tracks.length ? (
          <ul className="space-y-3">
            {tracks.map((t) => (
              <li
                key={t.enrollmentId}
                className="rounded-card border border-ink-100 bg-white p-5 transition-colors hover:border-ink-200"
              >
                {/* min-w-0 on the growing child, or a long title refuses to
                    wrap and pushes the pill off a 360px screen. */}
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <p className="min-w-0 flex-1 text-[15px] font-medium break-words text-ink-900">
                    {t.title}
                  </p>
                  <StatusPill tone={t.status === "completed" ? "done" : "active"}>
                    {t.status}
                  </StatusPill>
                </div>

                {t.startsOn ? (
                  <p className="mt-1.5 font-mono text-[13px] text-ink-500">
                    {day(t.startsOn)}
                    {t.endsOn ? ` – ${day(t.endsOn)}` : ""}
                  </p>
                ) : null}

                {/* Stacked and full-width below sm so both are 48px targets on
                    a phone; inline once there is room for two. */}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <Link
                    href="/dashboard"
                    className="flex h-11 items-center justify-center rounded-lg bg-brand-700 px-4 text-[15px] font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
                  >
                    This week&rsquo;s work
                  </Link>
                  {t.slug ? (
                    <Link
                      href={`/learn/${t.slug}`}
                      className="flex h-11 items-center justify-center rounded-lg border border-ink-200 px-4 text-[15px] font-medium text-ink-800 hover:border-brand-600 hover:text-brand-800"
                    >
                      Full curriculum
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty
            body="You are not in a cohort yet. Every curriculum is free to work through on your own in the meantime — nothing is held back for paying students."
            href="/learn"
            cta="Browse tracks"
          />
        )}
      </Section>

      {/* ── requested ──────────────────────────────────────────────────── */}
      <Section title="Requested" count={requests.length} className="mt-12 sm:mt-16">
        {requests.length ? (
          <ul className="space-y-3">
            {requests.map((r) => {
              const s = STATUS[r.status] ?? STATUS.new;
              return (
                <li
                  key={r.id}
                  className="rounded-card border border-ink-100 bg-white p-5 transition-colors hover:border-ink-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <StatusPill tone={s.tone}>{s.label}</StatusPill>
                    <p className="font-mono text-[13px] text-ink-500">{day(r.createdAt)}</p>
                  </div>

                  {/* break-words, not truncate: somebody's own words should not
                      be cut off on their own page, and a pasted URL with no
                      spaces will otherwise widen the whole layout. */}
                  <p className="mt-3 text-[15px] leading-[1.7] break-words text-pretty text-ink-800">
                    {r.prompt}
                  </p>
                  <p className="mt-1.5 text-[13px] text-ink-500">{s.detail}</p>

                  <div className="mt-4">
                    <ShareButton id={r.id} subtle />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty
            body="You have not asked for anything yet. If the track you want does not exist, say so on the home page and a person will write it."
            href="/"
            cta="Ask for a course"
          />
        )}
      </Section>
    </main>
  );
}

/**
 * A section with its count in the heading.
 *
 * The count is there for the same reason the homepage tier rows carry one: a
 * zero beside "Running" is a fact, and a heading with nothing under it and no
 * number reads like something failed to load.
 */
function Section({
  title,
  count,
  className,
  children,
}: {
  title: string;
  count: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className} aria-labelledby={title.toLowerCase()}>
      <div className="mb-4 flex items-baseline gap-3 border-b border-ink-100 pb-3">
        <h2 id={title.toLowerCase()} className="text-lg font-medium text-ink-900">
          {title}
        </h2>
        <span className="font-mono text-[13px] text-ink-500">{count}</span>
      </div>
      {children}
    </section>
  );
}

function Empty({ body, href, cta }: { body: string; href: "/learn" | "/"; cta: string }) {
  return (
    <div className="rounded-card border border-dashed border-ink-200 bg-ink-50 p-5 sm:p-6">
      <p className="max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-700">{body}</p>
      <Link
        href={href}
        className="mt-4 inline-flex h-11 items-center rounded-lg border border-ink-200 bg-white px-4 text-[15px] font-medium text-brand-700 hover:border-brand-600 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        {cta}
      </Link>
    </div>
  );
}
