import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DashboardScreen from "@/components/dashboard/dashboard-screen";
import { getDashboard } from "@/lib/dashboard";

/**
 * The dashboard — one question, answered in whichever shape fits: what do I
 * tap now.
 *
 * This file fetches and nothing else. Which of the three layouts renders is
 * decided in getDashboard() from real rows (total_days and days_since), and
 * DashboardScreen is presentational. Nothing here is public, so it is a
 * per-request read behind a session.
 */
export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboard();
  // No profile row means onboarding was never finished, and under Law 3 that
  // means the 18+ confirmation was never given — not a user of anything yet.
  if (!data) redirect("/join?next=/dashboard");

  return <DashboardScreen data={data} />;
}
