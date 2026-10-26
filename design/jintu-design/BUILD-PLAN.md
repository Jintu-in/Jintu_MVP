# Jintu — build plan (design + functionality + tests)

Read `HANDOFF.md` first (design rules, tokens, route map, live-site safety). This file covers **what each screen does, how data flows, and how we test it**.

The designs show behavior too: button labels, empty states, error copy, step counters, "press Play" interactions. Treat every visible state as a requirement. If a state you need isn't drawn, ask.

---

## 0. Working rules

- Branch `redesign` (or one branch per phase off it). Build on `redesign`, never push WIP straight to `main`; merge to `main` only on explicit go-ahead (done once already, through Phase 6, 26 Oct 2026). Every push gets a Vercel preview.
- **Read before you write.** Before each phase, read the existing code for that area (routes, Supabase queries, tables, RLS policies, auth) and write down what exists and what's missing.
- **Plan → OK → build → test → demo.** At the start of each phase, post a short plan (files, tables, edge cases, tests) and wait for an OK. At the end, give the preview link and a checklist to click through by hand.
- **Database changes only as migrations** in `supabase/migrations/`, reversible, with RLS on every new table. Never edit production data by hand. Show the SQL before applying it to the hosted project.
- **Server-side is the source of truth** for points, streaks, completion and anything that can be cheated. The client only asks; the server decides.
- No new paid services, and keep dependencies few. Ask before adding a library bigger than a utility.
- Secrets live in env vars only. Update `.env.example` whenever you add one.

## 1. Decisions to confirm with Saurav before building (ask, don't assume)

1. ~~**Sign-in method.**~~ **Settled.** Email code + password + Google OAuth, as designed (`V2Login` → `V2Code` → `V2SetPass` → `V2Join`) — not phone OTP. Built and live.
2. ~~**Lesson content model.**~~ **Settled.** Steps are typed JSON (`nodes.steps`, validated with zod — see §3.4), authored as content files and imported via `scripts/import-roadmap.mjs`, not hand-typed in the database. All nine current roadmaps use it, not just Git & GitHub.
3. ~~**Which roadmaps are published.**~~ **Settled** as a schema question — `roadmaps.status` (`draft`/`published`) has existed since the first migration. **Still open as a content decision**: per the 10 Oct relaunch call (unpublish all nine, republish one at a time), all nine are currently `published`. Whether to actually flip most back to `draft` now is Saurav's call, not a build task — show the exact `UPDATE` before running it against the hosted project, same as any data change.
4. ~~**Domain.**~~ **Settled.** `jintu.in` is the configured `NEXT_PUBLIC_SITE_URL`, read everywhere via `getSiteUrl()` — not `jintu-mvp.vercel.app`.
5. **Reminders and emails.** Still open. Which provider (Resend's free tier? Supabase SMTP?) and whether to build it now or later. `reminder_prefs` (the settings row) exists; nothing sends an email yet.
6. **Pair learning.** Now, or a later phase? (Suggested: later — unchanged.)

## 2. Phases

Each phase ends with passing tests, a green preview and a demo checklist.

| # | Phase | Status | Screens | Notes |
|---|---|---|---|---|
| 0 | Foundations | **Done** | — | Tokens, fonts, layout shells (top nav, phone tab bar, desktop sidebar, footer), theme (light/dark/system), test setup (§4), CI. |
| 1 | Public pages | **Done** | Home, Pricing, Contact, Legal, 404, Error | Pure restyle, SEO metadata kept. |
| 2 | Roadmaps & roles (read-only) | **Done** | `/learn`, `/learn/[slug]`, `/roles`, `/roles/[slug]`, `/roles/compare` | Group filter keeps `?c=`. Readable without an account. |
| 3 | Auth & account | **Done** | Login, Code, Password, SetPass, Reset, Join (consent), Settings, Delete | Per decision 1 (settled, §1). |
| 4 | First run | **Done** | Goal, Need, Avatar | Saves goal and need; sets which screen Home opens on. |
| 5 | Lesson engine | **Done** | Step, Turn, Questions, Help, Offline, Done, Quiz, DSA language switch, all `Uni*` step types, desktop lesson | Biggest phase; see §3.4. Share card built here too (lesson-done, not the streak card — see Phase 6). |
| 6 | Progress & motivation | **Done except two flagged pieces** | Today (3 states + 2-roadmap state), streaks, points, Profile record, Saved, Review cards | Server-side rules, §3.5. **Not built, deliberately deferred:** the public `/u/<handle>` page (needs a new `SECURITY DEFINER` RPC — today's RLS keeps one user's progress invisible to another, so exposing it publicly needs a narrow, deliberate bypass gated on the public-profile toggle, not a policy change); the streak share card on `/today` (needs that same public-profile flow wired into a share button). |
| 7 | Dark theme + motion | Not started | `Dark*`, `Mo*` | Motion respects `prefers-reduced-motion`. The theme mechanism itself (`ThemeProvider`, `data-theme`, the full dark token palette) was built in Phase 0 and already works — nothing surfaces a toggle yet, and no page has `dark:` classes applied. `HANDOFF.md`: "theme toggle, all pages" — this is the single largest-surface-area phase (every page built so far), not just the seven `Dark*` reference screens; plan to split it into parts (infrastructure + toggle, then page groups) rather than one pass. |
| 8 | Pair learning | Not started | `V2Pair*`, `DeskPair*` | Only if confirmed. |

Merged to `main` and live through Phase 6 as of 26 Oct 2026.

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
- **Backlog, not yet built:** a **Decide** step type — choose, explain why, then see what really happened — for judgment-heavy roadmaps (startup finance, entrepreneurship) where "choose + find + formula + number + write" don't quite fit. Design the schema shape when it's actually needed for a real roadmap; don't build it speculatively ahead of content that would use it.

### 3.5 Progress, streaks, points
- **Streak rules (write them as pure functions, unit-tested heavily):** a day counts when at least one lesson is completed in that day **in the user's timezone**; consecutive days extend the streak; a missed day resets it (`V2Restart`/`DeskRestart` state); store current and best.
- Edge cases to test: midnight crossings, timezone changes, DST zones, two lessons in one day, completing at 23:59 then 00:01, a user in IST vs UTC.
- Points: fixed per lesson (+25 shown), granted once, in the same transaction as completion.
- Today: three states (brand new / streak going / streak restarted) picked from data; the week strip is computed server-side.
- Profile: public only if the toggle is on; otherwise 404 for others. Shows streak, points, lessons and a 5-week grid. The owner's own `/profile` record is built; the public `/u/<handle>` page itself is the deferred piece (§2, Phase 6).
- Streak share card: generate an OG image (`next/og`) for `/u/<name>`; Share uses `navigator.share` with copy-link fallback. Deferred alongside `/u/<handle>` (§2, Phase 6) — distinct from the lesson-done share card (Phase 5), which is built.
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
6. Settings: turn on the public profile → `/u/<name>` visible signed out; turn it off → 404. Blocked until `/u/<handle>` itself is built (§2, Phase 6) — the toggle and its consent logging already work (`/profile`'s share flow), just not the page it points at.
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
