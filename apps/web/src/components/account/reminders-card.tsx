"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { updateReminders } from "@/actions/account";
import { cn } from "@/lib/utils";

/**
 * Reminders. Off by default, and consent for the reminders purpose is a
 * separate record — this card sets when, not whether we are allowed.
 */
function Toggle({
  id,
  checked,
  label,
  onChange,
  disabled,
}: {
  id: string;
  checked: boolean;
  label: string;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 flex-none rounded-full border transition-colors",
        checked ? "border-brand-700 bg-brand-700" : "border-ink-200 bg-ink-100",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white transition-[left]",
          checked ? "left-[26px]" : "left-0.5",
        )}
      />
    </button>
  );
}

export function RemindersCard({
  dailyEnabled: d0,
  dailyAt: t0,
  streakWarning: s0,
}: {
  dailyEnabled: boolean;
  dailyAt: string;
  streakWarning: boolean;
}) {
  const [dailyEnabled, setDaily] = useState(d0);
  const [dailyAt, setAt] = useState(t0);
  const [streakWarning, setWarn] = useState(s0);
  const { execute, result, status } = useAction(updateReminders);

  const save = (next: Partial<{ dailyEnabled: boolean; dailyAt: string; streakWarning: boolean }>) => {
    const payload = { dailyEnabled, dailyAt, streakWarning, ...next };
    execute(payload);
  };

  return (
    <section className="border-t border-ink-100 py-6">
      <h2 className="text-[15px] leading-[1.4] font-medium text-ink-900">Reminders</h2>

      <div className="mt-3 flex items-center justify-between gap-4">
        <label htmlFor="daily" className="text-[14px] leading-[1.6] text-ink-900">
          One reminder a day
        </label>
        <div className="flex items-center gap-3">
          <input
            type="time"
            aria-label="Reminder time"
            value={dailyAt}
            disabled={status === "executing"}
            onChange={(e) => {
              setAt(e.target.value);
              save({ dailyAt: e.target.value });
            }}
            className="h-12 rounded-lg border border-ink-100 bg-white px-2.5 font-mono text-[14px] text-ink-900"
          />
          <Toggle
            id="daily"
            checked={dailyEnabled}
            label="One reminder a day"
            disabled={status === "executing"}
            onChange={(v) => {
              setDaily(v);
              save({ dailyEnabled: v });
            }}
          />
        </div>
      </div>
      <p className="mt-2 max-w-[62ch] text-[13px] leading-[1.7] text-pretty text-ink-500">
        We picked this from when you usually finish. Change it any time.
      </p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <label htmlFor="warn" className="max-w-[46ch] text-[14px] leading-[1.6] text-ink-900">
          Email me if my streak is about to break
        </label>
        <Toggle
          id="warn"
          checked={streakWarning}
          label="Email me if my streak is about to break"
          disabled={status === "executing"}
          onChange={(v) => {
            setWarn(v);
            save({ streakWarning: v });
          }}
        />
      </div>

      {result?.serverError ? (
        <p role="alert" className="mt-3 text-[14px] text-ink-900">
          {result.serverError}
        </p>
      ) : null}
    </section>
  );
}
