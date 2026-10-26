# Jintu — build plan (design + functionality + tests)

Read `HANDOFF.md` first (design rules, tokens, route map, live-site safety). This file covers **what each screen does, how data flows, and how we test it**.

The designs show behavior too: button labels, empty states, error copy, step counters, "press Play" interactions. Treat every visible state as a requirement. If a state you need isn't drawn, ask.

---

## Status on 26 Oct 2026 — read this first

Checked against the live site (jintu-mvp.vercel.app), signed out, as page text only. Not checked: anything behind sign-in, the phone layout, visual match to the screenshots, and `/settings`, `/u/<name>`, `/onboarding`, `/saved` (not reachable from the check). **First job: check those yourself and update this table in `CURRENT-STATE.md`.**

### Where each phase stands

| # | Phase | Status | Evidence on the live site |
|---|---|---|---|
| 0 | Foundations | Mostly done | New top nav and phone tab bar (Today, Roadmaps, Roles, Profile). **Two footers still in use**, see P1 |
| 1 | Public pages | Mostly done | Home follows the new design section by section. Pricing, Contact, Privacy are on the new layout. Report page has a wrong email (P0) |
| 2 | Roadmaps & roles | Half done | `/learn` has the new list and `?c=` filters. `/learn/[slug]` and role pages are still the **old layout and old footer** |
| 3 | Auth & account | In progress | `/join`: Google + email, 6-digit code for new users, password for returning users, 18+ notice. Decision 1 is settled: **email, not phone OTP**. `/today` and `/profile` correctly ask signed-out visitors to sign in. Consent, settings and delete still need checking |
| 4 | First run | Unknown | Not reachable signed out |
| 5 | Lesson engine | **Not started** | Lessons are still the old "day" format: 40–55 min, reading first, commands without expected output, no "mine matches / mine is different", no Your turn. Day 1 renders as 10 steps, Day 2 as one long page: two formats live at once |
| 6 | Progress | Unknown | "Sign in to mark this day done" exists, so completion is wired at least partly |
| 7–8 | Dark, motion, pair | Not started | — |

### Fix now (P0, small, do these first in one PR)

1. **Report page email is wrong:** `/report` sends people to `contact@tindata.com`. It must be `hello@jintu.in`, as on `/contact`. Search the whole codebase for `tindata` and fix every instance.
2. **Every roadmap says "Open now".** The relaunch decision (10 Oct) was to unpublish all nine and republish one block at a time. Add a `status` field on roadmaps (`draft`, `self_checked`, `practitioner_reviewed`). Draft roadmaps show as "Being rebuilt" cards (no Start) on `/learn`, home and role pages, their URLs redirect (302) to the holding page `/learn/rebuilding?from=<slug>` with its notify-me form, and they come out of the sitemap. **Designed now:** `StatusKit`, `V2Holding`, `DeskHolding`. Full behaviour and tests in `CHANGES.md` update 3 §A. Ship with every roadmap `self_checked`, then **ask Saurav before setting any to `draft` in production**: it takes content offline.
3. **Numbers that contradict each other on the home page:** "9 roadmaps in the pipeline · 9 open today", "9 of 9 roadmaps are open… the rest are being written", and "9 job guides across 10 fields" next to "60 jobs". Compute every count from the database. With roadmaps in draft, the honest line is "Git & GitHub opens first. Tell me when others open."
4. **Claims the product can't back yet:** Pricing says "every link opened and checked by a person" and "notes and highlights, exportable any time". Keep a claim only if it's true today; otherwise remove it. The roadmap audit asked for the "checked by a person" lines to go.

### Fix next (P1)

5. **One footer and header everywhere.** `/learn/[slug]`, role pages, `/report` and `/join` still use the old footer (Product / Company / Legal, "Made in India"). Use the new one (Learn / Jintu / The small print) on every page, and the same header (Pricing is missing from some). Put the new logo in it from `logo/` (update 3 §D).
6. **Lesson content must be in the page HTML.** Day 1 showed "Loading this day." to a crawler, so its content is client-rendered. Render lesson and roadmap pages on the server (SSG/ISR from the content files) so Google and link previews see them.
7. **Role pages:** "Where to start" block with its 3 states from `StatusKit` (open, roadmap coming, no roadmap yet). Role pages themselves stay live.
8. The logo link reads "jjintu" to screen readers (mark + word). Swap in the new SVG logo with the SVG `aria-hidden="true"` and the link labelled "jintu home"; generate favicons from `logo/jintu-icon.svg`.

### Then, in this order

9. **Phase 5, the lesson engine, built on Git & GitHub lessons 1–2** from the "Git lessons" tab of the Role spec doc: the nine-part lesson, the "Run a command" step, Your turn, Questions, Done. Content as files in the repo (see `CHANGES.md` update 2 §6, the curriculum plan, and update 3 §C for glossary terms). Old day pages keep working, read-only, until each roadmap is rebuilt.
10. Finish Phase 3: consents screen, email and password screen, settings, delete (`CHANGES.md` update 2 §2–3).
11. Phase 6: Today (4 states), streaks, profile day-one state.
12. The other step types, as each roadmap in the curriculum plan reaches them.
13. Add the **Decide** step type (choose, explain why, see what really happened, founder log) for judgment roadmaps such as startup finance and entrepreneurship. **Designed now:** `V2Decide`, `V2DecideReveal`, `DeskDecide`. Schema, storage and tests in `CHANGES.md` update 3 §B. A Decide step without a real, linked source must fail validation.
14. Glossary pop-ups (`GlossaryKit`, update 3 §C) with the first roadmap that has glossary files. Git & GitHub is the first.

---

## 0. Working rules

- Branch `redesign` (or one branch per phase off it). Never push to `main`. Every push gets a Vercel preview.
- **Read before you write.** Before each phase, read the existing code for that area (routes, Supabase queries, tables, RLS policies, auth) and write down what exists and what's missing.
- **Plan → OK → build → test → demo.** At the start of each phase, post a short plan (files, tables, edge cases, tests) and wait for an OK. At the end, give the preview link and a checklist to click through by hand.
- **Database changes only as migrations** in `supabase/migrations/`, reversible, with RLS on every new table. Never edit production data by hand. Show the SQL before applying it to the hosted project.
- **Server-side is the source of truth** for points, streaks, completion and anything that can be cheated. The client only asks; the server decides.
- No new paid services, and keep dependencies few. Ask before adding a library bigger than a utility.
- Secrets live in env vars only. Update `.env.example` whenever you add one.

## 1. Decisions to confirm with Saurav before building (ask, don't assume)

1. **Sign-in method.** *Settled (live by 26 Oct): Google + email code + password, as designed. Phone OTP is not used for sign-in.* The designs show Google + email code + password (`V2Login` → `V2Code` → `V2SetPass` → `V2Join`). The earlier plan was phone OTP (WhatsApp first, SMS fallback, through a Supabase Send SMS Hook). Options: build the email flow as designed, phone OTP instead, or both. `V2Join` already collects a mobile number.
2. **Lesson content model.** How lessons and steps are stored today vs. what the new step types need (§3.4). Migrate existing roadmaps, or start fresh with Git & GitHub only?
3. **Which roadmaps are published.** Per the revamp, only published roadmaps should show; Git & GitHub goes first. Is there a `published` flag?
4. **Domain.** The designs use `jintu.in/u/<name>`; the live site is `jintu-mvp.vercel.app`. Use a config value for the base URL.
5. **Reminders and emails.** Which provider (Resend's free tier? Supabase SMTP?) and whether to build it now or later.
6. **Pair learning.** Now, or a later phase? (Suggested: later.)

## 2. Phases

Each phase ends with passing tests, a green preview and a demo checklist.

| # | Phase | Screens | Notes |
|---|---|---|---|
| 0 | Foundations | — | Tokens, fonts, layout shells (top nav, phone tab bar, desktop sidebar, footer), theme (light/dark/system), test setup (§4), CI. |
| 1 | Public pages | Home, Pricing, Contact, Legal, 404, Error | Pure restyle, SEO metadata kept. |
| 2 | Roadmaps & roles (read-only) | `/learn`, `/learn/[slug]`, `/roles`, `/roles/[slug]`, `/roles/compare` | Group filter keeps `?c=`. Readable without an account. |
| 3 | Auth & account | Login, Code, Password, SetPass, Reset, Join (consent), Settings, Delete | Per decision 1. |
| 4 | First run | Goal, Need, Avatar | Saves goal and need; sets which screen Home opens on. |
| 5 | Lesson engine | Step, Turn, Questions, Help, Offline, Done, Quiz, DSA language switch, all `Uni*` step types, desktop lesson | Biggest phase; see §3.4. |
| 6 | Progress & motivation | Today (3 states), streaks, points, Profile, share card, Saved, Review cards | Server-side rules, §3.5. |
| 7 | Dark theme + motion | `Dark*`, `Mo*` | Motion respects `prefers-reduced-motion`. |
| 8 | Pair learning | `V2Pair*`, `DeskPair*` | Only if confirmed. |

## 3. Functional spec by area

### 3.1 Public pages
- Home: "Find my roadmap" → first run (or `/learn` if signed in with a goal). Role chips link to role pages. Counts (roadmaps, job guides) come from the database.
- Contact: two addresses as drawn (`hello@`, `privacy@`). The "report a problem" form, if it's built, stores to a `reports` table with rate limiting.
- Legal: one layout for `/privacy`, `/terms`, `/refunds`. Keep their current text.

### 3.2 Roadmaps & roles
- `/learn`: lists **published** roadmaps only, with group filter tabs (`?c=`, shareable). Cards show level, lesson count and time from data.
- `/learn/[slug]` (block page): lessons grouped into sections, done/next/locked states, "Continue" goes to the next unfinished lesson. A signed-out reader sees the same page without progress. Status badge ("Self-checked / not yet reviewed") comes from a field on the roadmap.
- Roles: list, detail and comparison. Role pages stay live during the revamp.

### 3.3 Auth & account (as designed; adjust per decision 1)
- **One entry for new and returning users:** enter email → existing account? ask for password : send a 6-digit code.
- Code screen: 6 inputs (paste fills all, auto-advance, backspace moves back), resend locked for 30s with a visible countdown, "Use a different email", error for a wrong or expired code. Rate-limit code sends per email and per IP.
- Set password: at least 8 characters, show/hide toggle.
- Join (step 3): name optional; mobile optional unless decision 1 says otherwise; an **18+ checkbox is required**; reminder / analytics / public profile are **off by default** (DPDP: consent must be unticked and recorded). Store each consent with a timestamp.
- Google sign-in through Supabase OAuth.
- Reset password through a Supabase email link.
- Settings: display name, profile link, theme, reminder time, streak email, public profile toggle, analytics toggle, timezone (defaults to the browser's; used for the streak day), Download everything (JSON export of all user data), sign out.
- Delete: user types their email to confirm; deletes the account and **all** their rows (cascade) right away; signs out. Test that nothing is left behind.
- Middleware protects signed-in-only routes and sends users back where they came from after login.

### 3.4 Lesson engine (the core)
- A lesson is an ordered list of **steps**. Step types from the designs: explain/read, run a command (Copy button + "You should see" with highlighted lines + "Mine looks different" + "I see this"), your turn (task + "You are done when" + Stuck), choose (`UniChoose`), find in a source (`UniFind`), formula (`UniFormula`), number (`UniNumber`), write (`UniWrite`), quiz (no score kept), questions/FAQ + common mistake + go deeper link.
- Store steps as typed JSON validated with **zod**, one schema per type, so a bad lesson fails at build or seed time, not in front of a learner.
- One `<Step>` renderer switches on type. Each type is its own component with its own tests.
- "Mine looks different" (`V2Help`): pick the closest output → shows the fix; "Something else? Paste it" → saved to `help_requests` for review.
- Progress: step position saved as you go (resume where you left off). Marking a lesson done is a server action that is **idempotent** (completing twice doesn't double points).
- Offline (`V2Offline`): the lesson in progress is readable offline (service worker or cached data); progress queues locally and syncs when back online; "Ask" is disabled with the drawn copy.
- DSA language switch: one choice remembered per user, applies to every code block.
- Done screen: +points, streak, lessons count, share card, next lesson.
- Content: seed **Git & GitHub** first from a content file in the repo (markdown/JSON), not hand-typed in the database.

### 3.5 Progress, streaks, points
- **Streak rules (write them as pure functions, unit-tested heavily):** a day counts when at least one lesson is completed in that day **in the user's timezone**; consecutive days extend the streak; a missed day resets it (`V2Restart`/`DeskRestart` state); store current and best.
- Edge cases to test: midnight crossings, timezone changes, DST zones, two lessons in one day, completing at 23:59 then 00:01, a user in IST vs UTC.
- Points: fixed per lesson (+25 shown), granted once, in the same transaction as completion.
- Today: three states (brand new / streak going / streak restarted) picked from data; the week strip is computed server-side.
- Profile: public only if the toggle is on; otherwise 404 for others. Shows streak, points, lessons and a 5-week grid.
- Share card: generate an OG image (`next/og`) for `/u/<name>`; Share uses `navigator.share` with copy-link fallback.
- Saved: save a resource from a lesson; open / mark as read (leaves the list) / remove; shows the source lesson.
- Review cards: spaced repetition (a simple SM-2 or Leitner variant); hard comes back sooner, easy waits longer; "Nothing due" state.

## 4. Testing

Set this up in Phase 0 so every later phase adds tests as it goes.

| Layer | Tool | What |
|---|---|---|
| Unit | **Vitest** | Streak/points/review scheduling logic, zod content schemas, formatters, date/timezone helpers. Aim for full branch coverage on the streak and points rules. |
| Component | Vitest + **React Testing Library** | Each step type, code input (paste, backspace), forms (validation, errors), consent defaults unticked. |
| Database | **Supabase local** (`supabase start`) + SQL/Vitest tests | Migrations apply cleanly from zero; **RLS: user A can't read or write user B's rows**; delete cascade leaves nothing behind. |
| End-to-end | **Playwright** against local Supabase | The critical journeys below, at 390px and 1440px. |
| Visual | Playwright `toHaveScreenshot` | Each built page compared with `design/jintu-design/screenshots/<Name>.png` (stable sample data, fonts loaded, animations off). Report the diff; small font-rendering differences are acceptable, layout ones aren't. |
| Accessibility | **@axe-core/playwright** | No serious or critical violations on any page. |
| Build | CI (GitHub Actions) | Lint, type-check, unit, build, e2e on every push. Preview deploy only if it's green. |

**Critical e2e journeys (must pass before merging to main):**
1. Visitor: home → find a roadmap → read lesson 1 without an account.
2. New user: sign up → code → password → consent → first run → lesson 1 → done → Today shows a 1-day streak and +25 points.
3. Returning user: sign in → Continue resumes the right step.
4. Streak: complete on day 1 and day 2 → 2; skip day 3 → restarted state (use a mocked clock).
5. Saved: save a link in a lesson → appears in Saved → mark as read → gone.
6. Settings: turn on the public profile → `/u/<name>` visible signed out; turn it off → 404.
7. Export downloads JSON with the user's data; delete account → can't sign in, and the data is gone.
8. Offline: open a lesson, go offline, finish a step, come back online → progress is saved.

Use a **seed script** (`pnpm db:seed`) with a test user and Git & GitHub content, so anyone (Sanskar too) can run everything locally.

## 5. Definition of done (per screen / feature)
- [ ] Matches the design at 390px and 1440px (visual test passing or diff explained)
- [ ] Every drawn state works: loading, empty, error, success, signed out
- [ ] Data is real (no hard-coded sample numbers), with server-side checks
- [ ] RLS covers any new table, with a test
- [ ] Unit/component tests + e2e journey updated
- [ ] axe clean, keyboard usable, focus visible
- [ ] Lint, type-check and build pass; preview link shared with a manual test checklist
