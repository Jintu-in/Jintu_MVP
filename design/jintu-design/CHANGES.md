# Design changes

Two updates are listed here, newest first. Read this file with `HANDOFF.md` (route map) and `BUILD-PLAN.md` (status, phases, tests). It lists **only what changed**: the behaviour each new screen needs and the tests that prove it.

---

# Update 3 (26 Oct 2026): relaunch status, Decide step, glossary, logo

7 new screens and the final logo. No existing screen changed.

| New | Size | What it is | Build in |
|---|---|---|---|
| `V2Holding` / `DeskHolding` | 390 / 1440 | Holding page for a roadmap that is being rebuilt | P0 item 2 |
| `StatusKit` | 1440 | Board: the 3 status labels and where each one shows | P0 item 2, P1 item 7 |
| `V2Decide` / `V2DecideReveal` / `DeskDecide` | 390 / 390 / 1440 | The new **Decide** step type: before and after locking in | Item 13 |
| `GlossaryKit` | 1440 | Board: tap a term, see its meaning (phone sheet, desktop popover) | With Phase 5 |
| `logo/*.svg` + `LogoSparkMark`, `LogoSparkColours`, `LogoSparkUse` | — | The final "streak spark" logo, as SVG files and usage boards | P1 item 8 |

## A. Roadmap status and the holding page: `StatusKit`, `V2Holding`, `DeskHolding`

**Status values**, one per roadmap, set by the publish gate:

| Code | Label | Shown | Promise |
|---|---|---|---|
| `draft` | Being rebuilt (grey) | Card only; lessons never public | Nothing yet |
| `self_checked` | Self-checked (amber dot) | Publicly | Every lesson scored 10/12+, finished by 3 test learners, not yet reviewed by a practitioner |
| `practitioner_reviewed` | Practitioner-reviewed (green) | Publicly, with reviewer name, job title and date | Everything above, plus a named practitioner signed it off |

**Behaves:**
- Add `roadmaps.status` (enum above, default `draft`) plus `reviewed_by_name`, `reviewed_by_title` and `reviewed_on` (nullable, required when the status is `practitioner_reviewed`). Make it one shared `<StatusLabel status=…>` component used on the roadmap list, the block page and role pages, exactly as on `StatusKit`.
- **Roadmap list (`/learn`), home, role pages:** a `draft` card shows "Being rebuilt" and **Tell me when it opens** (→ holding page) instead of Start. Counts on the page ("N open") come from the database and count only non-draft roadmaps.
- **Block page:** label under the title. "What does this mean?" opens the popover text from `StatusKit` (a `<button>` with `aria-expanded`; closes on Esc and outside click).
- **Role pages, "Where to start"** has 3 states from `StatusKit`: roadmap open → Start; roadmap is `draft` → "Roadmap coming" + Tell me when; no roadmap mapped → "No roadmap yet" + Ask for this roadmap. The rest of the role guide never changes.
- **Draft URLs:** `/learn/[slug]` and every lesson/day URL under it return a **302** to `/learn/rebuilding?from=<slug>`. The holding page names that roadmap in the headline ("SQL for data analysts is being rebuilt.") and **pre-ticks it** in the list. Without `?from`, the headline is generic and nothing is pre-ticked. If `from` is unknown or not draft, ignore it.
- Draft roadmaps and their lessons are removed from `sitemap.xml`. The holding page is `noindex`.
- **Progress is kept.** Enrolment, progress, points and streak history for a roadmap that goes to draft are untouched, and the holding page says so. Test it.
- **The switch is a setting.** Ship the field with every roadmap set to `self_checked` (today's behaviour) and **ask Saurav** before setting any roadmap to `draft` in production.

**Holding page, "Tell me when these open" form:**
- Checkbox list = all `draft` roadmaps plus any not yet open, from the database (the 7 names in the design are sample data).
- Email is required. If signed in, prefill it.
- The WhatsApp line is an **unticked** opt-in, and the number field appears only when it is ticked. Never pre-tick it.
- Store `notify_requests(id, email, phone null, roadmap_id, channel 'email'|'whatsapp', consent_text, created_at, sent_at null, unsubscribed_at null)`, one row per roadmap per channel. Unique on (email, roadmap_id, channel), so a second submit doesn't duplicate.
- Rate-limit by IP, use a honeypot field, and check the email format on the server.
- The promise on the page is one message per roadmap when it opens, nothing else. So: no marketing use, and every message carries an unsubscribe link that sets `unsubscribed_at`. Sending happens when a roadmap moves from `draft` to an open status (a job or admin action). **Ask Saurav** which email provider, and whether WhatsApp sending is in scope now. If not, store the opt-in and hide nothing.
- "Opening first" card: the next roadmap due to open (the lowest `open_order` among drafts, or a manual pick). The "Why we took them down" copy is final.
- "Meanwhile, read what the job involves" links to `/roles`; "60 role guides" is a computed count.

## B. The Decide step: `V2Decide`, `V2DecideReveal`, `DeskDecide`

For judgment roadmaps (Startup finance, entrepreneurship, Amazon seller). There is no right answer and no score.

**Looks / flow:**
1. **Before** (`V2Decide`): scenario card, 2–4 options (A/B/C), a "Why this one?" text box (one or two lines), and **Lock in and see what happened**, which stays disabled until an option is picked **and** the reason has at least 15 characters. "No score" line under it.
2. **After** (`V2DecideReveal`, `DeskDecide`): your choice and reason quoted back; **What a real founder did** (dark card) with a source link; **The trade-offs** with a + and − for every option, yours highlighted; **Did your reason cover…** with 2–4 checkboxes the learner ticks themselves; Change my answer; Next step.
3. Desktop right panel: **Your founder log**: every Decide answer in this roadmap, newest last, the current one highlighted.

**Schema** (zod, added to the step union):
```ts
{ type: 'decide', id, prompt, scenario,
  options: [{ id, label, pro, con }],          // 2–4
  reasonPrompt?: string,                        // default "Why this one?"
  realCase: { who, chose, outcome, sourceTitle, sourceUrl },  // all required
  coverChecklist: string[] }                    // 2–4
```
- `realCase` is **required**. The text in square brackets in the design is a placeholder. A real case must come from a named person or business with a linked source. Lesson validation (and the publish gate) **fails** a Decide step without a `sourceUrl`. Never generate one.
- Storage: `decisions(user_id, roadmap_id, lesson_id, step_id, option_id, reason text, covered text[], created_at, updated_at)`, unique on (user, step). Change my answer updates the row; the log shows the latest. RLS: own rows only.
- Completing the step counts like any other step for progress and streak; there are no points for which option was picked.
- Signed-out learners can do the step. Keep the answer in local state and save it on sign-in, the same as other steps.

## C. Glossary pop-ups: `GlossaryKit`

- One file per roadmap, e.g. `content/<roadmap>/glossary.yaml`: `term`, `aliases[]`, `meaning` (25 words at most), `taughtIn` (lesson id). Validate in CI: meaning length, `taughtIn` exists, and no term used in a lesson **before** the lesson that teaches it (that fails the Order lens).
- In lesson text, mark terms explicitly (e.g. `[[staging area]]` in the content), and don't auto-match. Only the **first** use in a lesson gets the dotted underline.
- The term is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded`. **Phone:** a bottom sheet. **Desktop:** a popover beside the word. Both close on Esc, an outside tap, or the term again, and focus returns to the term. It shows: term, roadmap tag, meaning, "Taught in lesson N · <title>" (a link), and "Still unclear? Ask about this step" (opens the existing step help).
- No live AI definitions.

## D. Logo: `logo/`, `LogoSparkMark`, `LogoSparkColours`, `LogoSparkUse`

- Replace the current "j" tile and "jintu" text logo with the SVGs in `logo/`:
  - `jintu-icon.svg`: app icon / favicon source
  - `jintu-icon-small.svg`: for 32px and under
  - `jintu-wordmark-teal.svg`: on light backgrounds
  - `jintu-wordmark-white.svg`: on teal or dark
- Generate the favicon set (16, 32, 180 apple-touch, 192/512 manifest) from `jintu-icon.svg`, with a social share image to match.
- Header: the wordmark inside the home link, `aria-label="jintu home"`, with the SVG `aria-hidden="true"` (this also fixes P1 item 8, "jjintu").
- Colours: teal `#0A3B46`, amber flame `#FFB627`, cream core `#FFF1D1`. Don't recolour or redraw. `LogoSparkUse` shows the sizes and the streak badge.

## Tests for update 3
- **Status:** a `draft` roadmap 302s from `/learn/<slug>` and from a lesson URL to `/learn/rebuilding?from=<slug>`, which pre-ticks it. It is absent from `sitemap.xml`. It shows "Being rebuilt" on `/learn` and on its role page. "N open" counts exclude it. Setting it back to `self_checked` restores everything, and the learner's progress is unchanged.
- **Labels:** each status renders the right label on list, block and role page. `practitioner_reviewed` without reviewer fields fails validation.
- **Notify form:** WhatsApp is unticked by default and the phone field appears only when it is ticked. A duplicate submit creates no new row. A bad email is rejected on the server. Unsubscribe sets `unsubscribed_at`. The rate limit trips.
- **Decide:** Lock in is disabled until both an option and a 15+ character reason are given. After locking in, the reveal shows the real case with a working source link. Change my answer updates the same row. The founder log lists decisions in order. Content validation fails a Decide step with no `realCase.sourceUrl`.
- **Glossary:** only the first use is underlined. Esc closes the popup and focus returns to the term. Keyboard-only use works. CI fails on a term used before its `taughtIn` lesson, and on a meaning over 25 words.
- **Logo:** the header link's accessible name is "jintu home" (not "jjintu"). The favicons load.
- Visual check of the 7 new screens at 390px and 1440px against `screenshots/`.

---

# Update 2: account screens, desktop step panels, multi-roadmap Today

17 new screens and 2 changed ones.


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
