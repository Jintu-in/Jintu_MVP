# Design update 2 — what's new since the first pack

Read this with `HANDOFF.md` (route map, now updated) and `BUILD-PLAN.md` (phases, testing). This file lists **only what changed**, with the behavior each new screen needs and the tests that prove it.

17 new screens and 2 changed ones. Nothing was removed. Any other files that differ from the first pack differ only in how the HTML is saved (`<rect/>` vs `<rect></rect>`, `disabled` vs `disabled=""`), not in how they look. Ignore those.

---

## 1. Settings: two new links (changed: `V2Settings`, `DeskSettings`)
- "You" → **Email and password** now opens the new Email and password screen (`/settings/account`).
- "Privacy" → a new row, **What you agreed to**, sits above Timezone and opens `/settings/consents`.
- Nothing else in Settings changed.

## 2. What you agreed to — `V2Consents`, `DeskConsents` → `/settings/consents` (Phase 3)
**Looks:** a back button to Settings. "Core service" is an outlined card with a REQUIRED tag and **no switch at all**. Daily reminders, Product analytics and Public profile are each their own white card, with a switch and a line underneath reading "Agreed 7 Oct 2026" or "Not agreed". A closing line sits at the bottom.

**Behaves:**
- **One source of truth.** The Public profile and Product analytics switches here and in Settings, and the Reminders switch here and "One reminder a day" in Settings, read and write the **same** data. Flip one and the other shows it.
- Store consent as an **append-only log** (DPDP: you must be able to show what was agreed and when), e.g. `consent_events(user_id, purpose, granted bool, at timestamptz, source)`. Current state = latest event per purpose. Purposes: `core`, `reminders`, `analytics`, `public_profile`. RLS: users read and insert only their own rows. Nobody updates or deletes rows, except the account-delete cascade.
- "Agreed [date]" = the date of the latest *grant*. If the latest event is a withdrawal, show "Not agreed".
- `core` is written once at sign-up (the 18+ / Join step). It has no switch. Ending it means deleting the account, which is not on this screen.
- **Withdrawing takes effect immediately:**
  - reminders → no more reminder sends are scheduled
  - analytics → the client stops sending events **and** the server drops any that arrive
  - public profile → `/u/<name>` returns 404 for anyone else right away
- Withdrawing deletes nothing the person has done (closing line). Test that progress, points and streak are untouched.
- The switch flips straight away; if the save fails, it flips back and shows an error.

## 3. Email and password — `V2Account` / `V2AccountSet`, `DeskAccount` / `DeskAccountSet` → `/settings/account` (Phase 3)
**Looks:** a back button to Settings. "Signed in as" shows the email, read-only, with a lock icon. Two states:
- **(a) No password yet:** the label reads "Set a password", a status reads "not set", the line says a code by email always signs you in, and the button says "Save password".
- **(b) Password set:** the label reads "Change password", the status reads "set [date]", the line says forgetting it just means asking for a new code, and the button says "Save new password".

**Behaves:**
- Track whether a password exists, e.g. `profiles.password_set_at`. Don't guess it from auth internals. Set it whenever a password is saved (here, or in the sign-up "set a password" step).
- Save via Supabase `auth.updateUser({ password })`. If the project has "secure password change" turned on, handle the reauthentication (nonce) step. **Check the Supabase settings and tell me which applies.**
- At least 8 characters, a show/hide toggle, a clear error message, and a success message. After saving, state (a) becomes state (b).
- No current-password field and no "forgot password" link here, on purpose: the email code always works.
- Ask me whether saving should sign out other devices.

## 4. Profile, day one — `V2ProfileNew`, `DeskProfileNew` → `/profile` empty state (Phase 6)
**Looks:** the same header (monogram, name, handle) and share button as the normal profile. No streak, points or lesson numbers and no activity grid. Instead, one quiet card: "Your record starts after you finish your first day." and an **Open a roadmap** button (→ `/learn`). The desktop version is *your own* signed-in view (sidebar layout), not the public `DeskProfile`.

**Behaves:**
- Shown when the user has **zero completed lesson-days**. After the first completed day, the normal profile appears.
- The share button shares the profile link. If the public profile is off, ask me what share should do (hide it, or prompt to turn it on).
- Visitors to a public profile with zero days see a neutral empty state, never an error. Ask me for its copy if it isn't drawn.

## 5. Avatar picker on desktop — `DeskAvatar` (the phone `V2Avatar` already existed) (Phase 4 or 6)
**Looks:** a large preview on the left with "Where others see it" (pair learning and profile). On the right, the 16 animals in two rows of 8, 8 colours, Cancel and Save. "Surprise me" sits top right. Press Play in the file to see the interaction.

**Behaves:**
- Store `avatar_animal` (one of the 16) and `avatar_color` (one of the 8) on the profile. Defaults: fox, teal.
- Surprise me = a random animal and colour, not saved until Save.
- Build the 16 animals as SVG components from `AvatarKit.dc.html` / `V2Avatar.dc.html`, exactly as drawn.
- Where the monogram ("AV") still appears (sidebar, profile header), **ask me** whether the avatar replaces it.

## 6. Every step type on desktop — `DeskUniChoose`, `DeskUniFind`, `DeskUniFormula`, `DeskUniWrite` (+ `UniDeskStep` for numbers) (Phase 5)
**Looks:** the desktop lesson frame: steps on the left, the step in the middle, and a **"your work" panel** on the right. The panel changes by roadmap:

| Step type | Panel |
|---|---|
| Choose (Thinking) | "Out of 100 people": a 10×10 dot grid with a legend |
| Find (Medical coding) | "Your claim after this step": a table with the new code highlighted |
| Formula (Excel) | "Your workbook after this step": a spreadsheet with the result cell highlighted |
| Number (Startup finance) | "Your cap table after this step" (already existed) |
| Write (Thinking) | "Your forecast log": the new forecast plus when it will be checked |

**Behaves:**
- Add an optional, typed `panel` to the step schema (zod), one variant per panel type above. A step without one shows only the "Stuck? Ask about this step" box.
- On phone the panel doesn't show (as drawn). Layout: phone below 768px, desktop from 1024px.
- **The forecast log needs storage and a reminder:** e.g. `forecasts(user_id, text, confidence, due_on, outcome)`, plus a reminder on the due date. **Ask me** whether to build this now or show the panel read-only for now.
- Step names in the left nav (except the current one), the Excel lesson title and panel sample rows are **placeholders**. Take them from lesson data, never hard-code them.

## 7. Today with two or more roadmaps — `UniToday`, `DeskUniToday` → `/today` 4th state (Phase 6)
**Looks:** the last-opened roadmap is the big card (Continue). The other roadmaps get a smaller card ("Open lesson N"). The streak card says "One lesson in any roadmap keeps it." There is also an "Add a roadmap" tile.

**Behaves:**
- A user can be enrolled in several roadmaps (`enrollments(user_id, roadmap_id, last_opened_at)`). The big card is the most recently opened one.
- **A lesson in any roadmap counts for the streak.** Add this to the streak unit tests.
- Add a roadmap → `/learn`. Decide a sensible limit or none, and **tell me** which.

## 8. Pair learning, waiting state on desktop — `DeskPairWait` (Phase 8, later)
Your answer is locked. Ravi's card shows "Working" behind a dashed outline, so answers stay hidden until both are done. Chat stays open. The main button is greyed out as "Waiting for Ravi", with "Go on without waiting" below it. Build it with the rest of pair learning, not now.

## 9. Dark theme on desktop — `DarkDeskHome`, `DarkDeskLogin` (Phase 7)
Desktop dark versions of the home page's first screen and of Sign in. They use the dark tokens in `HANDOFF.md`. No new behavior.

---

## Tests to add
- **Consents:** flipping a switch on either screen updates both; each change writes one log event; withdrawing public profile → `/u/<name>` 404s for a signed-out visitor; withdrawing analytics → the server rejects events; withdrawing never changes progress or streak; RLS stops user A reading user B's consent events.
- **Account:** state (a) → set password → state (b) with a date; rejects fewer than 8 characters; signing in with the new password works; signing in with an email code still works after a password is set.
- **Profile:** a new user sees the day-one card; after finishing one lesson day, the normal profile shows.
- **Avatar:** Save persists animal and colour; Surprise me doesn't save until Save; keyboard users can pick every animal and colour.
- **Steps:** each panel variant renders from lesson data; a step with no panel renders without one; visual check of each `DeskUni*` against its screenshot at 1440px.
- **Today:** with two enrollments, the most recently opened is the big card; a lesson in the second roadmap keeps the streak (mocked clock).
- Visual check for every new screen at 390px and 1440px against `screenshots/`.
