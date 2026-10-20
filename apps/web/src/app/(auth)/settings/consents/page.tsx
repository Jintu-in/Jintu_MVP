import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ConsentsPage, type ConsentPurposeState } from "@/components/settings/consents-page";
import { getAccount } from "@/lib/account";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "What you agreed to",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function SettingsConsents() {
  const account = await getAccount();
  if (!account) redirect("/join?next=/settings/consents");

  const find = (purpose: string): ConsentPurposeState => {
    const row = account.consents.find((c) => c.purpose === purpose);
    return { purpose: purpose as ConsentPurposeState["purpose"], granted: row?.granted ?? false, at: row?.at ?? null };
  };
  const core = account.consents.find((c) => c.purpose === "core_service");

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[720px] bg-ink-50 px-5 pt-4 pb-12">
      <ConsentsPage
        coreAt={core?.at ?? null}
        reminders={find("reminders")}
        analytics={find("analytics")}
        publicProfile={find("public_profile")}
        handle={account.publicProfile.handle ?? account.suggestedHandle}
        reminderPrefs={{ dailyAt: account.reminders.dailyAt, streakWarning: account.reminders.streakWarning }}
        siteHost={getSiteUrl().host}
      />
    </main>
  );
}
