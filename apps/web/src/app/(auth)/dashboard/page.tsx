import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SavedQueueItem } from "@/components/saved-queue-item";
import { getDashboard } from "@/lib/dashboard";

/**
 * The dashboard — phase-3 screen 5, arriving with the machinery it reads.
 *
 * Four questions, in the order a two-minute session asks them: is the
 * streak alive, is anything due for review, where was I, what did I save.
 * Every number here is a per-user read; nothing on this page is public.
 */
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboard();
  if (!data) redirect("/join?next=/dashboard");

  const { streak, dueCount, pointsThisWeek, continueTargets, savedQueue } = data;

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      {/* ── the streak, first ─────────────────────────────────────────────── */}
      {/* Never "0 day streak": a lapsed user reads "Start again today", a
          brand-new one reads how day 1 begins. The number that survives a
          break — total days — sits beside whichever headline shows. */}
      <section aria-labelledby="streak">
        <h1 id="streak" className="text-2xl font-medium tracking-tight text-ink-900">
          {streak && streak.currentDays > 0
            ? `${streak.currentDays}-day streak${streak.doneToday ? "" : " — keep it alive today"}`
            : streak && streak.totalDays > 0
              ? "Start again today"
              : "Day 1 starts when you finish something"}
        </h1>
        <p className="mt-1 font-mono text-[13px] text-ink-500">
          {streak && streak.totalDays > 0
            ? `${streak.totalDays} total ${streak.totalDays === 1 ? "day" : "days"} — never resets · longest ${streak.longestDays} · ${pointsThisWeek} pts this week`
            : "Finish any day of any roadmap and the counter begins."}
        </p>
      </section>

      {/* ── review due ────────────────────────────────────────────────────── */}
      <section className="mt-8 rounded-card border border-ink-100 bg-white p-5" aria-labelledby="due">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 id="due" className="text-[15px] font-medium text-ink-900">
              {dueCount > 0
                ? `${dueCount} ${dueCount === 1 ? "card" : "cards"} due for review`
                : "No review due"}
            </h2>
            <p className="mt-1 text-sm text-pretty text-ink-600">
              {dueCount > 0
                ? "A few minutes now keeps last month's modules from evaporating."
                : "Cards come back when they are about to fade."}
            </p>
          </div>
          {dueCount > 0 ? (
            <Link
              href="/review"
              className="flex h-12 shrink-0 items-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Review
            </Link>
          ) : null}
        </div>
      </section>

      {/* ── continue ──────────────────────────────────────────────────────── */}
      <section className="mt-8" aria-labelledby="continue">
        <h2 id="continue" className="text-lg font-medium text-ink-900">
          Continue
        </h2>
        {continueTargets.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {continueTargets.map((t) => (
              <li key={t.roadmapSlug}>
                <Link
                  href={
                    t.lastNodeId
                      ? `/learn/${t.roadmapSlug}/${t.lastNodeId}`
                      : `/learn/${t.roadmapSlug}`
                  }
                  className="flex min-h-12 items-center justify-between gap-4 rounded-card border border-ink-100 bg-white px-5 py-4 hover:border-ink-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-700"
                >
                  <span className="text-[15px] font-medium text-ink-900">{t.roadmapTitle}</span>
                  <span className="shrink-0 text-sm text-brand-700">
                    {t.lastNodeId ? "Pick up where you stopped →" : "Open the roadmap →"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
            You are not following anything yet.{" "}
            <Link href="/learn" className="text-brand-700 underline hover:text-brand-800">
              Pick a roadmap
            </Link>{" "}
            — ticking any node enrols you quietly.
          </p>
        )}
      </section>

      {/* ── saved queue ───────────────────────────────────────────────────── */}
      <section className="mt-8" aria-labelledby="saved">
        <h2 id="saved" className="text-lg font-medium text-ink-900">
          Saved for later
        </h2>
        {savedQueue.length > 0 ? (
          <ul className="mt-2 divide-y divide-ink-100 border-y border-ink-100">
            {savedQueue.map((s) => (
              <SavedQueueItem
                key={s.resourceId}
                resourceId={s.resourceId}
                title={s.title}
                url={s.url}
                sourceName={s.sourceName}
                readerHref={s.roadmapSlug ? `/learn/${s.roadmapSlug}/${s.nodeId}` : null}
              />
            ))}
          </ul>
        ) : (
          <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
            Nothing waiting. Saves made while reading a node land here and
            stay until you are done with them — a queue, not a graveyard.
          </p>
        )}
      </section>
    </main>
  );
}
