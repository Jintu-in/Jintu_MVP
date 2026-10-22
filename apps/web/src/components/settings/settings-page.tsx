"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import {
  updateDisplayName,
  updatePublicProfile,
  updateReminders,
  updateTimezone,
} from "@/actions/account";
import { signOut, toggleConsent } from "@/actions/auth";
import { ChevronRightIcon } from "@/components/ui/icons";
import { FieldInput, FieldShell } from "@/components/ui/field-shell";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const COMMON_TIMEZONES = [
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

/**
 * /settings — restyled against V2Settings.dc.html: four rounded-[20px] white
 * card sections (You / Reminders / Privacy / Your data) of hairline-divided
 * rows, a sign-out button, no bottom tab bar (this is a pushed screen, not a
 * primary destination — matches the mockup's own back-button-only header).
 *
 * Not built: the Theme section V2Settings also draws. Zero real feature
 * behind it today (no dark mode anywhere in the app) — see
 * design/jintu-design/CURRENT-STATE.md Phase 0/7. Restyling a switch with
 * nothing wired to it would be worse than leaving it out.
 *
 * One state lives here that four rows read and write, per CHANGES.md item 2
 * ("one source of truth"): reminders' dailyEnabled and public profile's
 * isPublic are each both an operational switch AND a consent, logged
 * together by the single actions (updateReminders/updatePublicProfile) both
 * this page and /settings/consents call — there is no second code path to
 * drift out of sync.
 */
export function SettingsPage({
  displayName,
  fullName,
  handle,
  suggestedHandle,
  isPublic,
  email,
  timezone,
  reminders,
  analyticsGranted,
  siteHost,
}: {
  displayName: string | null;
  fullName: string | null;
  handle: string | null;
  suggestedHandle: string;
  isPublic: boolean;
  email: string;
  timezone: string;
  reminders: { dailyEnabled: boolean; dailyAt: string; streakWarning: boolean };
  analyticsGranted: boolean;
  siteHost: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <YouSection
        name={displayName ?? fullName ?? ""}
        handle={handle ?? suggestedHandle}
        isPublic={isPublic}
        email={email}
        siteHost={siteHost}
      />
      <RemindersSection reminders={reminders} />
      <PrivacySection
        handle={handle ?? suggestedHandle}
        isPublic={isPublic}
        analyticsGranted={analyticsGranted}
        timezone={timezone}
      />
      <DataSection />
      <form action={signOut}>
        <button
          type="submit"
          className="flex h-[52px] w-full items-center justify-center rounded-2xl border border-ink-200 text-[15.5px] font-semibold text-ink-900"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}

function Section({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-[13.5px] font-semibold text-ink-600">{legend}</h2>
      <div className="flex flex-col divide-y divide-ink-100 overflow-hidden rounded-[20px] bg-white">
        {children}
      </div>
    </section>
  );
}

/** A row that goes to a real sub-screen: caption, value, chevron. */
function NavRow({ href, caption, value }: { href: string; caption: string; value: string }) {
  return (
    <Link
      href={href as never}
      className="flex min-h-[60px] items-center gap-3 px-4 py-2 text-ink-900"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] leading-[17px] text-ink-500">{caption}</span>
        <span className="block truncate text-[15.5px] leading-[21px] font-medium">{value}</span>
      </span>
      <ChevronRightIcon className="flex-none text-ink-500" />
    </Link>
  );
}

/** A row that's a plain label + chevron — no second value to show, just an
 *  action ("What you agreed to", "Delete my account"). */
function PlainNavRow({
  href,
  label,
  tone,
}: {
  href: string;
  label: string;
  tone?: "risk";
}) {
  return (
    <Link
      href={href as never}
      className={cn(
        "flex min-h-14 items-center gap-3 px-4 py-2 text-[15.5px] font-medium",
        tone === "risk" ? "text-risk-700" : "text-ink-900",
      )}
    >
      <span className="flex-1">{label}</span>
      {tone === "risk" ? null : <ChevronRightIcon className="flex-none text-ink-500" />}
    </Link>
  );
}

function YouSection({
  name,
  handle,
  isPublic,
  email,
  siteHost,
}: {
  name: string;
  handle: string;
  isPublic: boolean;
  email: string;
  siteHost: string;
}) {
  return (
    <Section legend="You">
      <DisplayNameRow initial={name} />
      <ProfileLinkRow initialHandle={handle} isPublic={isPublic} siteHost={siteHost} />
      <NavRow href="/settings/account" caption="Email and password" value={email} />
    </Section>
  );
}

/** Tap to expand in place — the mockup's row is a same-page anchor
 *  (`href="#name"`), not a separate screen, so this mirrors that rather
 *  than inventing a new route. */
function DisplayNameRow({ initial }: { initial: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);
  const { execute, result, status } = useAction(updateDisplayName, {
    onSuccess: () => setEditing(false),
  });

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex min-h-[60px] w-full items-center gap-3 px-4 py-2 text-left text-ink-900"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[12.5px] leading-[17px] text-ink-500">Display name</span>
          <span className="block truncate text-[15.5px] leading-[21px] font-medium">
            {initial || "Add your name"}
          </span>
        </span>
        <ChevronRightIcon className="flex-none text-ink-500" />
      </button>
    );
  }

  return (
    <form
      className="flex flex-col gap-2.5 px-4 py-3"
      action={() => execute({ displayName: value })}
    >
      <label htmlFor="settings-display-name" className="text-[12.5px] text-ink-500">
        Display name
      </label>
      <FieldShell className="h-12">
        <FieldInput
          id="settings-display-name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={initial}
          className="text-[15px]"
        />
      </FieldShell>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === "executing"}
          className="flex h-11 flex-1 items-center justify-center rounded-xl bg-night-900 text-[14.5px] font-semibold text-on-night"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(initial);
            setEditing(false);
          }}
          className="flex h-11 flex-1 items-center justify-center rounded-xl border border-ink-200 text-[14.5px] font-semibold text-ink-900"
        >
          Cancel
        </button>
      </div>
      {result?.serverError ? <p className="text-[13px] text-risk-600">{result.serverError}</p> : null}
    </form>
  );
}

/** The handle alone — "Profile link". Whether the page is public lives in
 *  the Privacy section below; this row is purely the address, matching
 *  V2Settings' own split (two separate rows, two separate concerns). */
function ProfileLinkRow({
  initialHandle,
  isPublic,
  siteHost,
}: {
  initialHandle: string;
  isPublic: boolean;
  siteHost: string;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialHandle);
  const { execute, result, status } = useAction(updatePublicProfile, {
    onSuccess: () => setEditing(false),
  });
  const error = result?.validationErrors?.handle?._errors?.[0] ?? result?.serverError;

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex min-h-[60px] w-full items-center gap-3 px-4 py-2 text-left text-ink-900"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[12.5px] leading-[17px] text-ink-500">Profile link</span>
          <span className="block truncate font-mono text-[14px] leading-[21px] font-medium">
            {siteHost}/u/{initialHandle}
          </span>
        </span>
        <ChevronRightIcon className="flex-none text-ink-500" />
      </button>
    );
  }

  return (
    <form
      className="flex flex-col gap-2.5 px-4 py-3"
      action={() => execute({ handle: value, isPublic })}
    >
      <label htmlFor="settings-handle" className="text-[12.5px] text-ink-500">
        Profile link
      </label>
      <FieldShell className="h-12">
        <span className="font-mono text-[13px] text-ink-500">{siteHost}/u/</span>
        <FieldInput
          id="settings-handle"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-mono text-[14px]"
        />
      </FieldShell>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={status === "executing"}
          className="flex h-11 flex-1 items-center justify-center rounded-xl bg-night-900 text-[14.5px] font-semibold text-on-night"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setValue(initialHandle);
            setEditing(false);
          }}
          className="flex h-11 flex-1 items-center justify-center rounded-xl border border-ink-200 text-[14.5px] font-semibold text-ink-900"
        >
          Cancel
        </button>
      </div>
      {error ? <p className="text-[13px] text-risk-600">{error}</p> : null}
    </form>
  );
}

function RemindersSection({
  reminders,
}: {
  reminders: { dailyEnabled: boolean; dailyAt: string; streakWarning: boolean };
}) {
  const [dailyEnabled, setDailyEnabled] = useState(reminders.dailyEnabled);
  const [dailyAt, setDailyAt] = useState(reminders.dailyAt);
  const [streakWarning, setStreakWarning] = useState(reminders.streakWarning);
  const { execute, status } = useAction(updateReminders);

  const save = (next: Partial<{ dailyEnabled: boolean; dailyAt: string; streakWarning: boolean }>) =>
    execute({ dailyEnabled, dailyAt, streakWarning, ...next });

  return (
    <Section legend="Reminders">
      <div className="flex min-h-16 items-center gap-3 px-4 py-2">
        <span className="min-w-0 flex-1">
          <span className="block text-[15.5px] leading-[21px] font-medium text-ink-900">
            One reminder a day
          </span>
          {dailyEnabled ? (
            <input
              type="time"
              aria-label="Reminder time"
              value={dailyAt}
              disabled={status === "executing"}
              onChange={(e) => {
                setDailyAt(e.target.value);
                save({ dailyAt: e.target.value });
              }}
              className="mt-0.5 bg-transparent font-mono text-[12.5px] text-ink-500"
            />
          ) : null}
        </span>
        <Switch
          label="One reminder a day"
          checked={dailyEnabled}
          disabled={status === "executing"}
          onChange={(v) => {
            setDailyEnabled(v);
            save({ dailyEnabled: v });
          }}
        />
      </div>
      <div className="flex min-h-16 items-center gap-3 px-4 py-2">
        <span className="flex-1 text-[15.5px] leading-[21px] font-medium text-ink-900">
          Email me if my streak is about to break
        </span>
        <Switch
          label="Email me if my streak is about to break"
          checked={streakWarning}
          disabled={status === "executing"}
          onChange={(v) => {
            setStreakWarning(v);
            save({ streakWarning: v });
          }}
        />
      </div>
    </Section>
  );
}

function PrivacySection({
  handle,
  isPublic: isPublic0,
  analyticsGranted: analyticsGranted0,
  timezone,
}: {
  handle: string;
  isPublic: boolean;
  analyticsGranted: boolean;
  timezone: string;
}) {
  const [isPublic, setIsPublic] = useState(isPublic0);
  const publicProfile = useAction(updatePublicProfile, {
    onSuccess: ({ data }) => {
      if (data) setIsPublic(data.isPublic);
    },
    onError: () => setIsPublic(isPublic0),
  });

  const [analyticsGranted, setAnalyticsGranted] = useState(analyticsGranted0);
  const analytics = useAction(toggleConsent, {
    onError: () => setAnalyticsGranted(analyticsGranted0),
  });

  const [timezoneOpen, setTimezoneOpen] = useState(false);

  return (
    <Section legend="Privacy">
      <div className="flex min-h-16 items-center gap-3 px-4 py-2">
        <span className="flex-1 text-[15.5px] leading-[21px] font-medium text-ink-900">
          Public profile
          <span className="block text-[12.5px] leading-[18px] font-normal text-ink-500">
            {isPublic ? "Anyone with the link sees your streak" : "Off until you turn it on"}
          </span>
        </span>
        <Switch
          label="Public profile"
          checked={isPublic}
          disabled={publicProfile.status === "executing"}
          onChange={(v) => {
            setIsPublic(v);
            publicProfile.execute({ handle, isPublic: v });
          }}
        />
      </div>
      <div className="flex min-h-16 items-center gap-3 px-4 py-2">
        <span className="flex-1 text-[15.5px] leading-[21px] font-medium text-ink-900">
          Product analytics
          <span className="block text-[12.5px] leading-[18px] font-normal text-ink-500">
            {analyticsGranted ? "Helps us see where lessons lose people" : "Off until you turn it on"}
          </span>
        </span>
        <Switch
          label="Product analytics"
          checked={analyticsGranted}
          disabled={analytics.status === "executing"}
          onChange={(v) => {
            setAnalyticsGranted(v);
            analytics.execute({ purpose: "analytics", granted: v });
          }}
        />
      </div>
      <PlainNavRow href="/settings/consents" label="What you agreed to" />
      <TimezoneRow timezone={timezone} open={timezoneOpen} onOpen={() => setTimezoneOpen(true)} />
    </Section>
  );
}

function TimezoneRow({
  timezone,
  open,
  onOpen,
}: {
  timezone: string;
  open: boolean;
  onOpen: () => void;
}) {
  const [value, setValue] = useState(timezone);
  const { execute, result, status } = useAction(updateTimezone);

  const detected = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
    } catch {
      return null;
    }
  }, []);
  const options = useMemo(() => {
    const set = new Set(COMMON_TIMEZONES);
    if (detected) set.add(detected);
    set.add(timezone);
    return [...set].sort();
  }, [detected, timezone]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="flex min-h-[60px] w-full items-center gap-3 px-4 py-2 text-left text-ink-900"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[12.5px] leading-[17px] text-ink-500">
            Timezone, used for your streak day
          </span>
          <span className="block truncate text-[15.5px] leading-[21px] font-medium">{value}</span>
        </span>
        <ChevronRightIcon className="flex-none text-ink-500" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <label htmlFor="settings-timezone" className="text-[12.5px] text-ink-500">
        Timezone, used for your streak day
      </label>
      <select
        id="settings-timezone"
        value={value}
        disabled={status === "executing"}
        onChange={(e) => {
          setValue(e.target.value);
          execute({ timezone: e.target.value });
        }}
        className="h-12 rounded-xl border border-ink-100 bg-white px-3 text-[15px] text-ink-900"
      >
        {options.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
            {tz === detected ? " — detected" : ""}
          </option>
        ))}
      </select>
      <p className="text-[13px] leading-[1.6] text-ink-500">
        Your streak day ends at midnight here. Days you have already finished keep their original
        dates.
      </p>
      {result?.data?.timezone ? (
        <p role="status" className="text-[13px] text-ok-700">
          Now using {result.data.timezone}.
        </p>
      ) : null}
    </div>
  );
}

function DataSection() {
  return (
    <Section legend="Your data">
      <a
        href="/profile/export"
        className="flex min-h-14 items-center gap-3 px-4 py-2 text-[15.5px] font-medium text-ink-900"
      >
        Download everything
      </a>
      <PlainNavRow href="/settings/delete" label="Delete my account" tone="risk" />
    </Section>
  );
}
