/**
 * The header's layout and responsive rules, checked against the source.
 *
 *   node apps/web/sandbox/site-nav.test.mjs
 *
 * Three of these are the kind of thing that only shows up on a real phone,
 * which is exactly where this product is used: a nav link rendered twice at
 * one width, a menu that stays open across a navigation and covers the page
 * you just asked for, and a signed-out desktop showing a menu button with
 * nothing in it.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const nav = readFileSync(join(SRC, "components", "site", "site-nav.tsx"), "utf8");
const menu = readFileSync(join(SRC, "components", "site", "site-nav-menu.tsx"), "utf8");

test("the wordmark is hard left and everything else is hard right", () => {
  const mark = nav.indexOf('href="/" aria-label="Jintu — home"');
  const spacer = nav.indexOf('<div className="flex-1" />');
  const links = nav.indexOf("Roadmaps");
  const account = nav.indexOf("<SiteNavMenu");
  assert.ok(mark > -1 && spacer > mark, "the spacer follows the wordmark");
  assert.ok(links > spacer, "the links sit after the spacer, not beside the wordmark");
  assert.ok(account > links, "and the account control is last");
});

test("there is no Free item — it reads as a claim, not a destination", () => {
  assert.ok(!menu.includes('label: "Free"'), "not in the menu");
  assert.ok(!/>\s*Free\s*</.test(nav), "not on the bar");
  // The word still appears where it is a statement rather than a link: the
  // hero pill, the pricing section, and the footer.
  assert.ok(!nav.includes('href="/pricing"'), "and pricing is not linked from the bar");
  assert.ok(!menu.includes('"/pricing"'), "nor from the menu");
});

test("the bar's links appear from sm up and nowhere below it", () => {
  assert.match(nav, /className="hidden items-center gap-7 sm:flex"/);
});

test("the same links live in the menu, and only below sm", () => {
  // Both copies exist on purpose — one on the bar, one in the sheet — so the
  // thing that must hold is that exactly one of them renders at any width.
  assert.match(menu, /const NAV_LINKS[\s\S]*?Roadmaps[\s\S]*?How it works/);
  assert.match(menu, /<div className="sm:hidden">\s*\{NAV_LINKS\.map/);
});

test("a signed-out visitor on a wide screen gets a link, not an empty menu", () => {
  assert.match(menu, /!signedIn && "sm:hidden"/, "the menu button hides from sm up when signed out");
  assert.match(menu, /"hidden text-\[14px\] leading-none font-medium sm:block"/, "and Sign in appears instead");
});

test("signed in, the trigger is an avatar with a fallback that is not a blank circle", () => {
  assert.match(menu, /initials \?\? \(/, "initials, falling back to a person glyph");
  assert.match(menu, /bg-brand-50 font-mono text-\[13px\] font-medium text-brand-700/);
});

test("the menu closes on navigation, Escape and an outside click", () => {
  assert.match(menu, /useEffect\(\(\) => setOpen\(false\), \[pathname\]\)/, "route change");
  assert.match(menu, /e\.key === "Escape" && setOpen\(false\)/, "Escape");
  assert.match(menu, /!wrap\.current\?\.contains\(e\.target as Node\)/, "outside click");
});

test("signing out is a server action, so it survives a dead JS bundle", () => {
  assert.match(menu, /<form action=\{signOut\}>/);
  assert.match(menu, /type="submit"/);
});

test("the trigger is a real 40px target and says what it does", () => {
  assert.match(menu, /size-10/, "40px — the header is 72px, so a 48px circle does not fit with padding");
  assert.match(menu, /aria-expanded=\{open\}/);
  assert.match(menu, /aria-controls=\{panelId\}/);
  assert.match(menu, /aria-label=\{signedIn \? `Account menu/);
});

test("the overlay variant still inverts on the homepage hero", () => {
  assert.match(menu, /\[\.jscrolled_&\]:text-ink-900/, "the trigger follows the scrolled bar");
  assert.match(nav, /\[\.jscrolled_&\]:fill-brand-700/, "and so does the mark");
});
