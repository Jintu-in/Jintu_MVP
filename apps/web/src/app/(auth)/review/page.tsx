import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReviewGrade } from "@/components/review-grade";
import { getDueCards } from "@/lib/dashboard";

/**
 * The review queue: one card at a time, oldest due first. Grading
 * revalidates the page, so the next card simply takes this one's place —
 * the loop is press, think, press, until the queue says done.
 */
export const metadata: Metadata = {
  title: "Review",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const cards = await getDueCards(20);
  if (cards === null) redirect("/join?next=/review");

  const card = cards[0] ?? null;

  return (
    <main className="mx-auto max-w-md px-5 py-10">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">Review</p>

      {card ? (
        <>
          <p className="mt-3 font-mono text-[13px] text-ink-500">
            {cards.length} due{card.nodeTitle ? ` · from “${card.nodeTitle}”` : ""}
          </p>
          <h1 className="mt-4 text-xl leading-snug font-medium text-balance whitespace-pre-wrap text-ink-900">
            {card.front}
          </h1>
          <ReviewGrade cardId={card.id} back={card.back} />
          <p className="mt-6 text-sm text-pretty text-ink-500">
            Each cleared card is a point. Honest grading is the whole game —
            the schedule only works if “Good” means you actually recalled it.
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-3 text-2xl font-medium tracking-tight text-ink-900">
            Nothing due.
          </h1>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
            Cards come back when they are about to fade. Make new ones as you
            finish nodes — your own words, one idea per card — and they will
            queue here on their own schedule.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand-700 px-6 font-medium text-white hover:bg-brand-800"
          >
            Back to the dashboard
          </Link>
        </>
      )}
    </main>
  );
}
