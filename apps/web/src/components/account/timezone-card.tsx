"use client";

import { useMemo, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { updateTimezone } from "@/actions/account";

/**
 * The timezone, as a card rather than a settings row.
 *
 * This is the one setting that silently breaks the core mechanic: get it
 * wrong and a day finished at 9pm is counted as tomorrow, the streak the
 * person earned is not the streak they see, and nothing on screen explains
 * why. So it gets a heading, a full-width 48px control, and two lines that
 * say what it does and what it will not do — the space implies the stakes.
 *
 * Copy verbatim from docs/design/Private profile body + states.
 */
const COMMON = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "UTC",
];

export function TimezoneCard({ current }: { current: string }) {
  const { execute, result, status } = useAction(updateTimezone);
  const [value, setValue] = useState(current);

  // What the browser thinks, so the current zone can be marked "detected"
  // rather than making somebody work out whether it is right.
  const detected = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
    } catch {
      return null;
    }
  }, []);

  const options = useMemo(() => {
    const set = new Set(COMMON);
    if (detected) set.add(detected);
    set.add(current);
    return [...set].sort();
  }, [detected, current]);

  const saved = result?.data?.timezone;

  return (
    <section className="border-t border-ink-100 py-6">
      <h2 className="text-[15px] leading-[1.4] font-medium text-ink-900">Timezone</h2>

      <select
        aria-label="Timezone"
        value={value}
        disabled={status === "executing"}
        onChange={(e) => {
          setValue(e.target.value);
          execute({ timezone: e.target.value });
        }}
        className="mt-3 h-12 w-full rounded-lg border border-ink-100 bg-white px-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        {options.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
            {tz === detected ? " — detected" : ""}
          </option>
        ))}
      </select>

      <p className="mt-3 max-w-[62ch] text-[14px] leading-[1.7] text-pretty text-ink-600">
        Your streak day ends at midnight here. If this is wrong, a day you
        finished in the evening can be counted as the next day.
      </p>
      <p className="mt-2 max-w-[62ch] text-[13px] leading-[1.7] text-pretty text-ink-500">
        Changing this affects future days only. Days you have already finished
        keep their original date.
      </p>

      {saved ? (
        <p role="status" className="mt-3 text-[14px] leading-[1.7] text-pretty text-ink-900">
          Now using {saved}. Your streak day ends at midnight there from tomorrow.
          Days you have already finished keep their original dates.
        </p>
      ) : null}
      {result?.serverError ? (
        <p role="alert" className="mt-3 text-[14px] text-ink-900">
          {result.serverError}
        </p>
      ) : null}
    </section>
  );
}
