import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright, new for the redesign (Phase 0, BUILD-PLAN.md §4). Two
 * projects — 390px and 1440px — because every screen in the design handoff
 * is drawn at exactly those two widths and "it works at 390 and 1440" is
 * this whole project's actual definition of done, not an incidental check.
 *
 * `webServer` starts `next dev` itself and waits for it, so `pnpm e2e` is a
 * single command — no separate "start the app in another terminal" step a
 * person (or CI) has to remember.
 *
 * Split into two suites via two `testDir`s rather than one, because they
 * have different dependencies:
 *   - e2e/smoke  — no database needed. Anonymous pages only. Safe to run
 *     anywhere, always, including right after `pnpm install` with nothing
 *     else running.
 *   - e2e/auth   — needs local Supabase running (`pnpm db:start`) and the
 *     fixture it seeds (see e2e/auth/global-setup.ts). Signed-in journeys.
 * `pnpm e2e` runs smoke only; `pnpm e2e:auth` runs the auth suite
 * explicitly, the same split CI uses (see ci.yml's separate `e2e` and
 * `e2e-auth` jobs) so a missing database fails loudly in its own job
 * rather than silently skipping half the smoke run.
 */
const PROJECTS = [
  { name: "mobile-390", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
  { name: "desktop-1440", use: { viewport: { width: 1440, height: 900 } } },
];

export default defineConfig({
  testDir: "./e2e/smoke",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    // Mid-range Android in daylight is the stated target device (CLAUDE.md) —
    // reduced motion is how a real user on one of those phones usually has
    // the OS configured, and it is also what makes a screenshot-free smoke
    // run deterministic rather than racing an in-flight CSS transition.
    reducedMotion: "reduce",
  },
  projects: PROJECTS,
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
