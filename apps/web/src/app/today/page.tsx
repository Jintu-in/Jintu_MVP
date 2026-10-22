import { redirect } from "next/navigation";

/**
 * `/today` doesn't exist as a real page yet — the signed-in dashboard is
 * Phase 4/6 work (design/jintu-design/CURRENT-STATE.md), and the shell's
 * nav (nav-items.ts) has pointed at it since Phase 0 in anticipation of
 * that. Wiring the shell into real pages now (Phase 2) means that tab is
 * clickable for the first time, and a nav item that 404s is worse than one
 * that lands somewhere real — so this redirects to the catalogue rather
 * than rendering nothing or faking a dashboard that doesn't exist.
 *
 * Replace this whole file when Phase 4/6 builds the real Today.
 */
export default function TodayRedirect() {
  redirect("/learn");
}
