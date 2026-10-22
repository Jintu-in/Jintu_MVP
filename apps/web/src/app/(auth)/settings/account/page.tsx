import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountPage } from "@/components/settings/account-page";
import { getAccount } from "@/lib/account";

export const metadata: Metadata = {
  title: "Email and password",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function SettingsAccount() {
  const account = await getAccount();
  if (!account) redirect("/join?next=/settings/account");

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-ink-50 px-5 pt-4 pb-12">
      <AccountPage email={account.email} passwordSetAt={account.passwordSetAt} />
    </main>
  );
}
