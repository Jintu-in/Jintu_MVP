import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * The anonymous, database-independent smoke suite — journey 1 of
 * BUILD-PLAN.md §4's critical list ("Visitor: home → find a roadmap → read
 * lesson 1 without an account"), as far as it can go without a published
 * roadmap seeded. These pages are all static or safely render with an empty
 * catalogue, so this suite needs nothing running except the app itself —
 * no `supabase start`, no fixture, no auth state. See e2e/auth/ for the
 * journeys that do.
 *
 * `BUILD-PLAN.md §5`'s definition of done requires axe clean, keyboard
 * usable, focus visible on every page — that check lives here, once, as a
 * helper, rather than copy-pasted per test.
 */
const assertNoSeriousA11yViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
};

/** Collects console errors during a page load, for the "no console errors"
 *  half of the done-definition — a page that merely renders can still be
 *  throwing in the background on every paint. */
const collectConsoleErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
};

/**
 * Every page gets ONE real heading assertion: non-empty, not just
 * whitespace. Deliberately not matching specific words — the marketing
 * copy on these pages is not this suite's concern, and a test asserting
 * `/roadmap/i` on /learn's actual heading ("Pick a subject. Follow it to
 * the end.") breaks on every copy edit for a fact the test never needed.
 * What it DOES need — a real, non-empty heading exists, loads without
 * erroring, and is accessible — is checked regardless of wording.
 */
// /join's entry step only — a plain page load triggers no Supabase action
// (checkEmail/requestOtp need a submitted email), so it's safe here. The
// other steps (code/password/create/forgot) need a real test account and
// belong in the auth-fixture suite (e2e/auth, not yet built — see
// playwright.auth.config.ts's own deferred status), not this one.
const PUBLIC_PAGES = ["/", "/learn", "/roles", "/pricing", "/contact", "/privacy", "/terms", "/refunds", "/join"];

for (const path of PUBLIC_PAGES) {
  test(`${path} loads, has a heading, no console errors, axe clean`, async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();
    const heading = await page.locator("h1, h2").first().textContent();
    expect(heading?.trim().length ?? 0).toBeGreaterThan(0);
    expect(errors, errors.join("\n")).toEqual([]);
    await assertNoSeriousA11yViolations(page);
  });
}

test("a nonexistent route renders the 404 page, not a server error", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist-e2e-probe");
  expect(response?.status()).toBe(404);
  await assertNoSeriousA11yViolations(page);
});

test("the hero's primary action on / is a real link — works with JavaScript off", async ({ browser }) => {
  // The redesign's homepage (components/marketing/homepage.tsx) dropped the
  // earlier GET-search-form hero in favour of "Find my roadmap", a plain
  // <a href="/learn">. A real anchor needs no JS by construction, but the
  // point of this test is to prove that stays true rather than assume it —
  // a future hero that wraps the link in an onClick-only handler would pass
  // every other check and still fail someone with JavaScript off.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Find my roadmap" }).first();
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/learn");
  await cta.click();
  await expect(page).toHaveURL(/\/learn$/);
  await context.close();
});

test("keyboard: Tab from the top of / reaches a real, visibly-focused link before anything else", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toBeVisible();
  // A link or button, not a div with a click handler — the redesign's
  // accessibility bar (BUILD-PLAN.md §5) is "real <button>, <a>, <label>",
  // and the first Tab stop is the cheapest place to catch a div-button.
  const tag = await focused.evaluate((el) => el.tagName.toLowerCase());
  expect(["a", "button", "input"]).toContain(tag);
});
