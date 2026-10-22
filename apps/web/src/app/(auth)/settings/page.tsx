import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsPage } from "@/components/settings/settings-page";
import { getAccount } from "@/lib/account";
import { getSiteUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function Settings() {
  const account = await getAccount();
  if (!account) redirect("/join?next=/settings");

  const analytics = account.consents.find((c) => c.purpose === "analytics");

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[720px] bg-ink-50 px-5 pt-6 pb-12">
      <h1 className="sr-only">Settings</h1>
      <SettingsPage
        displayName={account.displayName}
        fullName={account.fullName}
        handle={account.publicProfile.handle}
        suggestedHandle={account.suggestedHandle}
        isPublic={account.publicProfile.isPublic}
        email={account.email}
        timezone={account.timezone}
        reminders={account.reminders}
        analyticsGranted={analytics?.granted ?? false}
        siteHost={getSiteUrl().host}
      />
    </main>
  );
}
