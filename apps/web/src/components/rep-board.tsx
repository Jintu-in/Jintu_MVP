"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { logRep } from "@/actions/reps";
import type { RepBoard as Board } from "@/lib/reps";

/**
 * The week's daily reps: small work, logged daily, worth consistency points.
 *
 * The copy is deliberate about what these points are and are not. A streak is
 * honest — it says you showed up — and it never touches the readiness score,
 * because rule 5 says consistency never becomes proof. The board says
 * "points" and "streak", never "score", so nobody reads a 41-day streak as
 * evidence they can do the job.
 *
 * No confetti, no flames, no mascot. The streak number and two plain
 * sentences. These are adults with a real career problem, and the reward for
 * logging a rep is the work having been done.
 */
export function RepBoard({ board }: { board: Board }) {
  const router = useRouter();
  const [flash, setFlash] = useState<string | null>(null);

  const { execute, status } = useAction(logRep, {
    onSuccess: ({ data }) => {
      if (!data) return;
      if (data.already_logged) setFlash("Already logged.");
      else if (data.points_awarded > 0) setFlash(`+${data.points_awarded} · streak day ${data.streak_days}`);
      else setFlash("Logged. Today's 30 points are already earned — the work still counts.");
      router.refresh();
    },
    onError: ({ error }) => setFlash(error.serverError ?? "That did not log. Try again."),
  });

  const pending = status === "executing";
  const remaining = board.reps.filter((r) => !r.done);

  return (
    <section className="mt-8" aria-labelledby="reps-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="reps-heading" className="text-lg font-medium text-ink-900">
          This week&rsquo;s reps
        </h2>
        <p className="font-mono text-[13px] text-ink-500">
          {board.streakDays > 0 ? `streak · day ${board.streakDays}` : "no streak yet"}
          {" · "}
          {board.pointsToday}/30 today
        </p>
      </div>

      <ul className="mt-4 divide-y divide-ink-100 rounded-card border border-ink-100 bg-white">
        {board.reps.map((rep) => (
          <li key={rep.id} className="flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[13px] text-ink-500">Day {rep.dayNo}</p>
              <p className="mt-0.5 text-[15px] leading-[1.7] break-words text-pretty text-ink-800">
                {rep.prompt}
              </p>
            </div>
            {rep.done ? (
              <span className="shrink-0 font-mono text-[13px] text-ok-800">done</span>
            ) : (
              <button
                type="button"
                disabled={pending}
                onClick={() => execute({ dailyRepId: rep.id })}
                className="flex h-12 shrink-0 items-center justify-center rounded-lg border border-brand-700 bg-white px-4 text-[15px] font-medium text-brand-800 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:border-ink-200 disabled:text-ink-500"
              >
                Log it
              </button>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-2 text-[13px] text-ink-500" aria-live="polite">
        {flash ??
          (remaining.length === 0
            ? "All logged for this week."
            : `Streak points never touch your readiness score — that comes only from graded work. ${board.freezesRemaining} freeze${board.freezesRemaining === 1 ? "" : "s"} left: one missed day will not break the streak.`)}
      </p>
    </section>
  );
}
