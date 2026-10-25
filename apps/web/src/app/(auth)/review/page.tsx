import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { ReviewSession } from "@/components/review/review-session";
import { BackIcon } from "@/components/ui/icons";
import { getDueCards } from "@/lib/dashboard";

/**
 * /review (V2Review/DeskReview) — a focused, chromeless task like the
 * lesson reader's Quiz route: neither mockup draws the usual persistent
 * nav here, just a header and the card itself. Two minutes before
 * today's lesson, not a destination someone lives in.
 */
export const metadata: Metadata = {
  title: "Review",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const cards = await getDueCards(20);
  if (cards === null) redirect("/join?next=/review");

  const due = Math.max(0, cards.length);

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <div className="flex h-16 flex-none items-center gap-3 px-5 lg:h-20 lg:gap-4 lg:px-10">
        <Link
          href={"/today" as Route}
          aria-label="Back to today"
          className="flex size-11 flex-none items-center justify-center rounded-full bg-white text-ink-900 lg:size-12"
        >
          <BackIcon />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] leading-5 font-semibold text-ink-900 lg:text-[17px] lg:leading-6">Review</div>
          <div className="text-[12.5px] leading-[18px] text-ink-600 lg:text-[14px] lg:leading-5">
            Two minutes, before today&apos;s lesson
          </div>
        </div>
        <div className="flex h-8 flex-none items-center rounded-2xl bg-white px-3 font-mono text-[12.5px] font-medium text-ink-900 lg:h-9 lg:px-3.5 lg:text-[13.5px]">
          {due} due
        </div>
      </div>

      <div className="flex flex-1 justify-center px-5 pt-7 pb-6 lg:px-10 lg:pt-11">
        <div className="flex w-full max-w-[680px] flex-1 flex-col">
          <ReviewSession cards={cards} />
        </div>
      </div>
    </div>
  );
}
