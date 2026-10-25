import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TodayScreen } from "@/components/today/today-screen";
import { getAccount } from "@/lib/account";
import { getDashboard } from "@/lib/dashboard";

/**
 * `/today` — the real dashboard (Phase 6 Part A), replacing both this
 * file's old redirect-to-/learn stub and the pre-redesign /dashboard page.
 * getDashboard() (lib/dashboard.ts) already did all the real work; this
 * is the first thing to actually render it with the current design
 * system. /dashboard itself now redirects here (same pattern as /account
 * retiring to /profile).
 */
export const metadata: Metadata = {
  title: "Today",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const [data, account] = await Promise.all([getDashboard(), getAccount()]);
  if (!data || !account) redirect("/join?next=/today");

  return (
    <TodayScreen
      data={data}
      user={{
        displayName: account.displayName ?? account.fullName ?? "Your account",
        initials: account.initials,
        points: data.points,
        avatarAnimal: account.avatarAnimal,
        avatarColor: account.avatarColor,
      }}
    />
  );
}
