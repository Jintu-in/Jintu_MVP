"use client";

import { useState } from "react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import type { OptionalPurpose } from "@jintu/contracts";
import { toggleConsent } from "@/actions/auth";
import { updatePublicProfile, updateReminders } from "@/actions/account";
import { BackIcon } from "@/components/ui/icons";
import { Switch } from "@/components/ui/switch";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const COPY: Record<OptionalPurpose, { label: string; description: string }> = {
  reminders: {
    label: "Daily reminders",
    description:
      "One message a day at the time you choose, plus an optional warning before a streak breaks. Nothing else.",
  },
  analytics: {
    label: "Product analytics",
    description:
      "Anonymous usage data, so we can see which days people abandon and fix them. Never sold, never used to build a profile of you.",
  },
  public_profile: {
    label: "Public profile",
    description: "Publishes a page at <host>/u/your-name showing days learned and your grid. Your email is never on it.",
  },
};

export type ConsentPurposeState = { purpose: OptionalPurpose; granted: boolean; at: string | null };

/**
 * /settings/consents — restyled against V2Consents.dc.html: "Core service"
 * as an outlined, switch-less card (ending it means deleting the account,
 * which is not a toggle on this screen — profiles_must_be_adult makes a
 * false core_service unrepresentable, so there is nothing to withdraw into),
 * then one white card per optional purpose with a switch and an
 * "Agreed <date>" / "Not agreed" line.
 *
 * Every switch here calls the SAME action /settings' own toggle calls
 * (updateReminders / updatePublicProfile / toggleConsent) — see
 * settings-page.tsx's header comment on "one source of truth". Flipping one
 * writes the consent_events log AND, for reminders/public profile, the
 * operational setting together; there is no separate write path to drift.
 */
export function ConsentsPage({
  coreAt,
  reminders,
  analytics,
  publicProfile,
  handle,
  reminderPrefs,
  siteHost,
}: {
  coreAt: string | null;
  reminders: ConsentPurposeState;
  analytics: ConsentPurposeState;
  publicProfile: ConsentPurposeState;
  handle: string;
  reminderPrefs: { dailyAt: string; streakWarning: boolean };
  siteHost: string;
}) {
  return (
    <>
      <Link
        href="/settings"
        className="-ml-2 inline-flex h-12 items-center gap-1.5 px-2 text-[14px] text-brand-700"
      >
        <BackIcon />
        Settings
      </Link>

      <h1 className="mt-2 t-page text-ink-900">What you agreed to</h1>

      <div className="mt-5 rounded-[20px] border-2 border-ink-200 bg-white p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[15.5px] leading-[20px] font-semibold text-ink-900">
            Core service
          </span>
          <span className="font-mono text-[11px] leading-none tracking-[.06em] text-ink-500 uppercase">
            required
          </span>
        </div>
        <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-600">Needed to hold an account.</p>
        {coreAt ? (
          <p className="mt-1.5 font-mono text-[12.5px] leading-[1.5] text-ink-500">
            Agreed {formatDate(coreAt)}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <ReminderConsentRow state={reminders} reminderPrefs={reminderPrefs} />
        <AnalyticsConsentRow state={analytics} />
        <PublicProfileConsentRow state={publicProfile} handle={handle} siteHost={siteHost} />
      </div>

      <p className="mt-6 border-t border-ink-100 pt-4 text-[13px] leading-[1.7] text-pretty text-ink-500">
        Withdrawing consent stops that use immediately. It does not delete anything you have
        already done.
      </p>
    </>
  );
}

function Row({
  label,
  description,
  granted,
  at,
  children,
}: {
  label: string;
  description: string;
  granted: boolean;
  at: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] leading-[1.4] font-medium text-ink-900">{label}</div>
          <div className="mt-1 font-mono text-[12.5px] leading-[1.5] text-ink-500">
            {granted && at ? `Agreed ${formatDate(at)}` : "Not agreed"}
          </div>
          <p className="mt-2 text-[13.5px] leading-[1.7] text-pretty text-ink-600">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function ReminderConsentRow({
  state,
  reminderPrefs,
}: {
  state: ConsentPurposeState;
  reminderPrefs: { dailyAt: string; streakWarning: boolean };
}) {
  const [granted, setGranted] = useState(state.granted);
  const { execute, status } = useAction(updateReminders, {
    onError: () => setGranted(state.granted),
  });

  return (
    <Row label={COPY.reminders.label} description={COPY.reminders.description} granted={granted} at={state.at}>
      <Switch
        label={COPY.reminders.label}
        checked={granted}
        disabled={status === "executing"}
        onChange={(v) => {
          setGranted(v);
          execute({ dailyEnabled: v, dailyAt: reminderPrefs.dailyAt, streakWarning: reminderPrefs.streakWarning });
        }}
      />
    </Row>
  );
}

function AnalyticsConsentRow({ state }: { state: ConsentPurposeState }) {
  const [granted, setGranted] = useState(state.granted);
  const { execute, status } = useAction(toggleConsent, {
    onError: () => setGranted(state.granted),
  });

  return (
    <Row label={COPY.analytics.label} description={COPY.analytics.description} granted={granted} at={state.at}>
      <Switch
        label={COPY.analytics.label}
        checked={granted}
        disabled={status === "executing"}
        onChange={(v) => {
          setGranted(v);
          execute({ purpose: "analytics", granted: v });
        }}
      />
    </Row>
  );
}

function PublicProfileConsentRow({
  state,
  handle,
  siteHost,
}: {
  state: ConsentPurposeState;
  handle: string;
  siteHost: string;
}) {
  const [granted, setGranted] = useState(state.granted);
  const { execute, status } = useAction(updatePublicProfile, {
    onSuccess: ({ data }) => {
      if (data) setGranted(data.isPublic);
    },
    onError: () => setGranted(state.granted),
  });

  return (
    <Row
      label={COPY.public_profile.label}
      description={COPY.public_profile.description.replace("<host>", siteHost)}
      granted={granted}
      at={state.at}
    >
      <Switch
        label={COPY.public_profile.label}
        checked={granted}
        disabled={status === "executing"}
        onChange={(v) => {
          setGranted(v);
          execute({ handle, isPublic: v });
        }}
      />
    </Row>
  );
}
