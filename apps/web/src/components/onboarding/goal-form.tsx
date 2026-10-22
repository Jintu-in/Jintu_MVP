"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { setGoal } from "@/actions/auth";
import { cn } from "@/lib/utils";

const PENCIL = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" />
    <path d="M14 7l3 3" />
  </svg>
);

type Seg = "study" | "work" | "build";

/**
 * Goal groups and their role lists, verbatim from V2Goal.dc.html's own
 * sample data — real deliberate category content, not a placeholder name
 * (HANDOFF.md rule 2). `goal` is stored as free text (profiles.goal,
 * migration 0028); nothing reads it yet, same position reminder_prefs was
 * in before its sender existed.
 */
const GROUPS: Record<Seg, { name: string; flex: number; roles: string[] }> = {
  study: {
    name: "Studying",
    flex: 1,
    roles: [
      "Associate software engineer",
      "Data analyst",
      "Business analyst",
      "Financial analyst",
      "Associate product manager",
      "UX designer",
    ],
  },
  work: {
    name: "Working",
    flex: 1,
    roles: [
      "Backend engineer",
      "Product manager",
      "Data engineer",
      "Engineering manager",
      "Growth marketer",
      "FP&A analyst",
    ],
  },
  build: {
    name: "Building something",
    flex: 1.6,
    roles: [
      "Founder",
      "Performance marketer",
      "Startup finance lead / CFO",
      "Brand manager",
      "Revenue operations",
      "Content marketer",
    ],
  },
};

export function GoalForm() {
  const id = useId();
  const router = useRouter();
  const [seg, setSeg] = useState<Seg>("study");
  const [picked, setPicked] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState("");
  const { execute, status, result } = useAction(setGoal, {
    onSuccess: () => router.push("/onboarding/need"),
  });

  const ready = typing ? typed.trim().length >= 2 : Boolean(picked);

  const submit = () => {
    if (!ready) return;
    execute({ goal: typing ? typed.trim() : picked!, custom: typing });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <div className="flex h-16 flex-none items-center justify-between px-5">
        <span className="font-mono text-[12.5px] leading-[18px] text-ink-500">1 of 2</span>
        <a
          href="/today"
          className="flex h-11 items-center px-3 text-[14.5px] font-semibold text-ink-900"
        >
          Skip
        </a>
      </div>

      <div className="flex flex-1 flex-col gap-4.5 overflow-y-auto px-5">
        <div className="flex flex-col gap-2">
          <h1 className="t-page text-ink-900">What do you want to become?</h1>
          <p className="text-[15.5px] leading-[23px] text-ink-600">
            Pick the closest one. You can change it any time.
          </p>
        </div>

        <div role="radiogroup" aria-label="Where you are now" className="flex gap-0.5 rounded-26 bg-white p-1">
          {(Object.keys(GROUPS) as Seg[]).map((k) => {
            const on = k === seg;
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  setSeg(k);
                  setPicked(null);
                  setTyping(false);
                }}
                style={{ flex: GROUPS[k].flex }}
                className={cn(
                  "flex h-11 items-center justify-center rounded-22 text-[13.5px] transition-colors",
                  on ? "bg-night-900 font-semibold text-on-night" : "bg-transparent font-medium text-ink-600",
                )}
              >
                {GROUPS[k].name}
              </button>
            );
          })}
        </div>

        <div role="radiogroup" aria-label="Goal" className="grid grid-cols-2 gap-2.5">
          {GROUPS[seg].roles.map((role) => {
            const on = !typing && role === picked;
            return (
              <button
                key={role}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  setPicked(role);
                  setTyping(false);
                }}
                className={cn(
                  "min-h-16 rounded-22 border-[1.5px] px-3.5 py-2 text-center text-[14.5px] leading-[19px] transition-colors",
                  on
                    ? "border-night-900 bg-night-900 font-semibold text-on-night"
                    : "border-ink-200 bg-white font-medium text-ink-900",
                )}
              >
                {role}
              </button>
            );
          })}
        </div>

        {typing ? (
          <div className="flex flex-col gap-2 rounded-22 bg-white p-4">
            <label htmlFor={`${id}-own`} className="text-[13.5px] font-semibold text-ink-900">
              Your goal, in your words
            </label>
            <input
              id={`${id}-own`}
              type="text"
              autoFocus
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Journalist, IAS officer, history teacher"
              className="h-[52px] rounded-14 border-2 border-link bg-white px-4 text-[16px] text-ink-900 focus:outline-none"
            />
            <p className="text-[13px] leading-[19px] text-ink-600">
              No path for it yet? We note the request and tell you when one opens.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setTyping(true);
              setPicked(null);
            }}
            className="flex min-h-15 items-center justify-center gap-2.5 rounded-22 border-[1.5px] border-dashed border-ink-400 text-[15px] font-semibold text-ink-900"
          >
            {PENCIL}
            <span>Type in my own</span>
          </button>
        )}

        {result?.serverError ? (
          <p role="alert" className="text-[14px] text-risk-600">
            {result.serverError}
          </p>
        ) : null}
      </div>

      <div className="flex-none border-t border-ink-100 bg-white px-5 pt-3 pb-5">
        <button
          type="button"
          disabled={status === "executing"}
          onClick={submit}
          className={cn(
            "flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl text-[16.5px] font-semibold transition-colors",
            ready ? "bg-brand-500 text-on-brand" : "bg-ink-300 text-ink-600",
          )}
        >
          {status === "executing" ? "Saving…" : ready ? "Continue" : "Pick one to continue"}
        </button>
      </div>
    </div>
  );
}
