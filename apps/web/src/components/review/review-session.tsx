"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useAction } from "next-safe-action/hooks";
import { gradeCard } from "@/actions/reviews";
import type { DueCard } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

/**
 * The review loop (V2Review/DeskReview): think, reveal, grade, repeat —
 * one pre-fetched batch, advanced entirely on the client (same model as
 * the lesson reader's Quiz route) rather than a server round-trip and
 * page re-render per card, which the mockup's own instant local-state
 * transitions assume.
 *
 * Two deliberate departures from the mockup's own sample data, because
 * review_cards (0004_engagement.sql) is the user's own free-text words,
 * not structured content:
 *   - the mockup's own demo cards carry a short note under the answer,
 *     explaining it — that field doesn't exist on a card, and a card
 *     is exactly front/back, nothing else, so there is nothing to show.
 *   - the revealed answer renders as plain text, not the mockup's dark
 *     terminal block with a "$" prompt — that styling fit the mockup's
 *     own Git-flavoured demo cards, but a real card can be about
 *     anything, and most are not shell commands.
 */

const CLOCK_ICON = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v4.5l3 1.8" />
  </svg>
);

const CHECK_ICON = (
  <svg aria-hidden width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="var(--color-warn-700)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const RATINGS = [
  { key: "again", label: "Again", hint: "blank", strong: false },
  { key: "hard", label: "Hard", hint: "barely", strong: false },
  { key: "good", label: "Good", hint: "got it", strong: false },
  { key: "easy", label: "Easy", hint: "instant", strong: true },
] as const;

export function ReviewSession({ cards }: { cards: DueCard[] }) {
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [hadError, setHadError] = useState(false);
  const { execute } = useAction(gradeCard, { onError: () => setHadError(true) });

  const finished = i >= cards.length;
  const cur = finished ? null : cards[i];

  const onRate = (rating: (typeof RATINGS)[number]["key"]) => {
    if (!cur) return;
    setHadError(false);
    execute({ cardId: cur.id, rating });
    setI((n) => n + 1);
    setRevealed(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-5 lg:gap-7">
      <div
        role="img"
        aria-label={`${i} of ${cards.length} cards done`}
        className="flex flex-none gap-1.5"
      >
        {cards.map((_, k) => (
          <div
            key={k}
            className={cn(
              "h-[6px] flex-1 rounded-[3px] transition-colors",
              k < i ? "bg-night-900" : k === i ? "bg-brand-500" : "bg-ink-200",
            )}
          />
        ))}
      </div>

      {cur ? (
        <div className="flex min-h-[280px] flex-1 flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_1px_2px_rgba(12,42,48,0.06),0_14px_32px_rgba(12,42,48,0.1)] lg:min-h-[330px] lg:gap-[18px] lg:p-9">
          {cur.from ? (
            <div className="text-[12.5px] leading-[18px] font-semibold text-link lg:text-[14px] lg:leading-5">
              {cur.from}
            </div>
          ) : null}
          <h1 className="t-sect m-0 font-semibold text-pretty text-ink-900">{cur.front}</h1>

          {!revealed ? (
            <div className="mt-auto flex items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-ink-400 p-4 text-[14.5px] leading-[21px] text-ink-600 lg:p-[18px] lg:text-[16px] lg:leading-[23px]">
              {CLOCK_ICON}
              <span>Answer in your head first. Recalling it is the exercise.</span>
            </div>
          ) : (
            <div className="mt-auto flex flex-col gap-3">
              <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4 text-[15px] leading-[1.7] whitespace-pre-wrap text-ink-900 lg:p-5 lg:text-[16px]">
                {cur.back}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-[280px] flex-1 flex-col items-start justify-center gap-3.5 rounded-[28px] bg-night-900 p-7 text-white lg:min-h-[330px] lg:gap-4 lg:p-10">
          <span aria-hidden className="flex size-14 items-center justify-center rounded-full bg-amber-500 lg:size-16">
            {CHECK_ICON}
          </span>
          <div className="t-sect font-bold">Nothing due</div>
          <div className="max-w-[440px] text-[15.5px] leading-[23px] text-on-night-muted lg:text-[17px] lg:leading-[26px]">
            The ones you found hard come back sooner. The easy ones wait longer.
          </div>
        </div>
      )}

      {hadError ? (
        <p role="alert" className="text-[13.5px] leading-5 text-ink-900">
          One of your ratings did not save — your place in the queue is kept either way.
        </p>
      ) : null}

      <div className="flex flex-none justify-center">
        {cur && !revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-brand-500 text-[16.5px] font-semibold text-on-brand lg:w-80"
          >
            Show the answer
          </button>
        ) : cur && revealed ? (
          <div role="group" aria-label="How well did you remember it?" className="grid w-full grid-cols-4 gap-2 lg:gap-3">
            {RATINGS.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => onRate(r.key)}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-0.5 rounded-2xl border-[1.5px] lg:h-16",
                  r.strong ? "border-brand-500 bg-brand-500 text-on-brand" : "border-ink-200 bg-white text-ink-900",
                )}
              >
                <span className="text-[14.5px] font-semibold lg:text-[16px]">{r.label}</span>
                <span className="text-[11.5px] opacity-80 lg:text-[12.5px]">{r.hint}</span>
              </button>
            ))}
          </div>
        ) : !cur ? (
          <Link
            href={"/today" as Route}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-brand-500 text-[16.5px] font-semibold text-on-brand no-underline lg:w-80"
          >
            Go to today&apos;s lesson
          </Link>
        ) : null}
      </div>
    </div>
  );
}
