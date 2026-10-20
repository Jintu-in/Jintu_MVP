"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { setNeed } from "@/actions/auth";
import { BackIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const ARROW_RIGHT = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

type NeedKey = "start" | "finish" | "time" | "show";

/** Verbatim from V2Need.dc.html's own data — the four fixed options, and
 *  what each decides Home opens on (needInput, packages/contracts). */
const ITEMS: { k: NeedKey; mark: string; title: string; gives: string; opens: string }[] = [
  { k: "start", mark: "1", title: "Tell me where to start", gives: "One path, in order", opens: "Your path, with the first lesson ready" },
  { k: "finish", mark: "2", title: "Help me finish what I start", gives: "A streak and one reminder a day", opens: "Your streak and this week" },
  { k: "time", mark: "3", title: "Fit it into 15 minutes", gives: "Short lessons, one step at a time", opens: "Today, one 15-minute lesson" },
  { k: "show", mark: "4", title: "Something to show for it", gives: "A profile and cards you can share", opens: "Your profile and share card" },
];

export function NeedForm() {
  const router = useRouter();
  const [need, setNeedKey] = useState<NeedKey>("start");
  const { execute, status } = useAction(setNeed, {
    onSuccess: () => router.push("/today"),
  });
  const opens = ITEMS.find((i) => i.k === need)!.opens;

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <div className="flex h-16 flex-none items-center justify-between px-3 pr-5">
        <Link
          href="/onboarding/goal"
          aria-label="Back"
          className="flex size-11 items-center justify-center rounded-full bg-white text-ink-900"
        >
          <BackIcon />
        </Link>
        <span className="font-mono text-[12.5px] leading-[18px] text-ink-500">2 of 2</span>
      </div>

      <div className="flex flex-1 flex-col gap-4.5 overflow-y-auto px-5">
        <div className="flex flex-col gap-2">
          <h1 className="t-page text-ink-900">What do you need most right now?</h1>
          <p className="text-[15.5px] leading-[23px] text-ink-600">
            One answer. It decides what your home screen shows first.
          </p>
        </div>

        <div role="radiogroup" aria-label="What you need most" className="flex flex-col gap-2.5">
          {ITEMS.map((item) => {
            const on = item.k === need;
            return (
              <button
                key={item.k}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setNeedKey(item.k)}
                className={cn(
                  "flex min-h-19 items-center gap-3.5 rounded-22 border-2 bg-white px-4 py-2.5 text-left transition-colors",
                  on ? "border-night-900" : "border-white",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-11 flex-none items-center justify-center rounded-full font-mono text-[16px] font-semibold transition-colors",
                    on ? "bg-night-900 text-on-night" : "bg-ink-50 text-ink-600",
                  )}
                >
                  {on ? "✓" : item.mark}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[16px] leading-[22px] font-semibold text-ink-900">{item.title}</span>
                  <span className="text-[13.5px] leading-[19px] text-ink-600">{item.gives}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-none flex-col gap-1 rounded-20 bg-brand-50 p-4 text-night-900">
          <span className="text-[13px] leading-[18px] font-semibold text-link">
            Your home screen will open on
          </span>
          <span className="font-heading text-[18px] leading-[24px] font-semibold tracking-[-0.01em]">{opens}</span>
        </div>
      </div>

      <div className="flex-none border-t border-ink-100 bg-white px-5 pt-3 pb-5">
        <button
          type="button"
          disabled={status === "executing"}
          onClick={() => execute({ need })}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-500 text-[16.5px] font-semibold text-on-brand"
        >
          <span>{status === "executing" ? "Saving…" : "Finish"}</span>
          {status === "executing" ? null : ARROW_RIGHT}
        </button>
      </div>
    </div>
  );
}
