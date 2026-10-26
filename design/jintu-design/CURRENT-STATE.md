# Current state — checked 26 Oct 2026

This fills in what `BUILD-PLAN.md`'s "Status on 26 Oct 2026" table couldn't check (it was read against the live site, signed out, as page text only). This pass is a **code-level audit** of the `redesign` branch (merged to `main` the same day, before this design pack's update 3 arrived) — not a live, signed-in browser session, since I don't have a real account's credentials. Where that matters, it's called out below.

**Headline: most of the status table is stale.** It reads as a pre-merge snapshot. Phases 5 and 6 are both built, tested, and live on `main` as of this afternoon — not "not started" / "unknown" as the table says. Details below, area by area, in the order `BUILD-PLAN.md` asked for.

## Signed-in pages, generally

Built and covered by source-text sandbox tests (`apps/web/sandbox/*.test.mjs`) across every phase: the full auth flow (email code + password + Google OAuth), onboarding, the lesson engine (every step type, offline mode, the DSA language switch, the lesson-done share card), `/today` (all states), `/profile` (record + empty state), `/profile/saved`, `/review`.

**Real gap, not a stale-doc issue:** there is no automated e2e coverage of the signed-in journeys themselves (sign up → code → password → first lesson → Today shows a streak, etc. — `BUILD-PLAN.md` §4's journeys 2-8). The Playwright suite (`e2e/smoke`) only covers signed-out public pages. This has been true since early in the engagement and was never closed — it needs a Supabase auth fixture (a seeded test user, a way to sign in in CI) that doesn't exist yet. Everything signed-in has been verified by hand plus source-level tests, not by an automated browser session.

**Also not done:** the visual regression layer `BUILD-PLAN.md` §4 specifies (Playwright `toHaveScreenshot` against `screenshots/<Name>.png`) was never actually set up — no `toHaveScreenshot` call exists anywhere in the test suite. Every phase's "matches the design" check has been manual (reading the `.dc.html` source for exact values, not pixel-diffing a screenshot).

## `/settings`

Built: `/settings`, `/settings/account`, `/settings/consents`, `/settings/delete` all exist, restyled against `V2Settings`/`DeskSettings` etc. (update 2 of `CHANGES.md`, which is itself already-built work, not new).

**Not built:** the Theme section `V2Settings` draws. The *mechanism* exists (`ThemeProvider`, `useTheme`, `data-theme`, the full dark palette in `preset.css` — Phase 0 scaffolding) but nothing surfaces a toggle, and no page has `dark:` classes. This is Phase 7, not started.

## `/u/<handle>` (public profile)

**Not built**, by explicit, discussed decision — deferred because it needs a new `SECURITY DEFINER` RPC: today's RLS deliberately keeps one user's progress invisible to another (tested in `baseline:verify`), so showing a stranger's streak/points publicly needs a narrow, deliberate bypass gated on the public-profile toggle, not a policy change. That's a real migration, to be shown before applying, same as any schema change — not a restyle.

The owner's own `/profile` (with the real record — stats, weeks grid, finished list) is built. `/u/<handle>` itself is the one still missing.

## `/onboarding`

Built: `/onboarding`, `/onboarding/goal`, `/onboarding/need` all exist, restyled against `V2Goal`/`V2Need`/`DeskGoal`/`DeskNeed`.

## `/saved`

**Built, but at a different URL than `HANDOFF.md`'s route map says.** `HANDOFF.md` lists `Saved → /saved (new)` as a top-level route. What's actually built is `/profile/saved`, nested under Profile — chosen because both `V2Saved` and `DeskSaved` draw their own back-control returning to Profile and their own bottom-nav/sidebar highlighting "Profile", not a separate "Saved" destination, so a standalone top-level tab didn't match what the screens themselves show.

**Needs a decision, not a guess:** keep it at `/profile/saved` (matching the screens' own nav behaviour), or add it at `/saved` as the route map says (with `/profile/saved` 301-redirecting there, so the existing URL keeps working per `HANDOFF.md`'s own "keep every existing URL working" rule)? Flagging this rather than picking silently, since the two sources disagree and neither is obviously the stale one.

## Phone layout (390px)

Every phase since Phase 5 has been built mobile-first, one component tree per screen with `lg:` breakpoint prefixes (not separate mobile/desktop trees) — not a desktop-only build retrofitted for phone. No systematic device-level visual diff has been run (see the visual-regression gap above), so this is "built to the same spec values, never pixel-compared" rather than "confirmed identical to the screenshot."

## Corrections to `BUILD-PLAN.md`'s status table

These were checked directly against the current code and/or the hosted database, not assumed:

| Table's claim | Actual state |
|---|---|
| Phase 5 (lesson engine): **Not started** | **Done.** Every step type (`Uni*`, DSA language switch, questions/FAQ, quiz), offline mode, the lesson-done share card. Merged to `main`. |
| Phase 6: **Unknown** | **Done**, except the two pieces above (`/u/<handle>`, and the streak share card on `/today` which depends on it). `/today` (all states + 2-roadmap state), `/profile` record, `/profile/saved`, `/review` all built. |
| "Every roadmap says 'Open now'", needs a `status` field | `roadmaps.status` (`draft`/`published`) has existed since the very first migration. All nine are currently `published` on the hosted project (checked via the REST API directly). Update 3's three-value status (`draft`/`self_checked`/`practitioner_reviewed`) is new work — see P0. |
| "Two footers still in use" | Not found — `SiteFooter` is wired through every route group's `layout.tsx` (auth/learning/marketing + error/not-found), and the old footer's "Made in India" text doesn't exist anywhere in the current code. |
| Domain: designs use `jintu.in`, live site is `jintu-mvp.vercel.app` | `NEXT_PUBLIC_SITE_URL=https://jintu.in` is already the configured domain, read everywhere via `getSiteUrl()`. |
| Report page email (`contact@tindata.com`) | **Was real**, now fixed (`hello@jintu.in`) — pushed separately before this pass. |

**Not yet checked, still open:** the home-page number contradictions, the pricing overclaims ("every link opened and checked by a person"), role-page draft labelling (superseded by update 3's `StatusKit` work anyway), and the logo `aria-hidden`/"jjintu" accessibility issue (superseded by update 3 §D's logo swap). These roll into the P0/P1 work directly rather than needing a separate check first.
