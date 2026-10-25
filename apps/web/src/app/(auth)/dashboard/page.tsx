import { redirect } from "next/navigation";

/**
 * Retired — this was the real dashboard before the redesign had a `/today`
 * of its own (Phase 6 Part A). Its data layer (lib/dashboard.ts) moved to
 * `/today` unchanged; this file is now just the old URL's forwarding
 * address, same pattern as `/account` retiring to `/profile`.
 */
export default function DashboardRedirect() {
  redirect("/today");
}
