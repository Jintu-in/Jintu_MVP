# Jintu redesign — implementation handoff

This folder is the source of truth for the Jintu UI. Build it **pixel-exact**.

## What's in here

| Path | What it is |
|---|---|
| `screens/*.dc.html` | The real design source, one file per screen. Plain HTML with inline styles — every color, size, radius, font and gap is in there. **Read these for values. Never guess from the PNG.** |
| `screenshots/*.png` | Each screen rendered at 1×, full height. Use them to check your build visually. |
| `screens/canvas.json` | Index: each screen's title, frame size and which group (`page`) it belongs to. |
| `logo/*.svg` | The final logo as SVG files (icon, small icon, wordmark teal and white). Use these files, don't redraw. |
| `screens/support.js` | The design runtime, only so you can open a `.dc.html` in a browser to preview it. Not for the app. |

### How to read a `.dc.html` file
- The markup inside `<x-dc>` is the screen. Styles are inline `style="…"`.
- `<helmet>` holds the Google Fonts link and base `a` colors.
- `{{name}}` holes are filled by `renderVals()` in the `<script type="text/x-dc">` at the bottom — that script shows the sample data and any state/interaction (e.g. "press Play" screens).
- `<sc-for list="{{items}}" as="item">` = map over a list. `<sc-if>` = conditional.
- `href="SomeScreen.dc.html"` = where that link goes in the flow (use the route map below).
- The root `<div>` has a fixed width (390 = phone, 1440 = desktop). In the app, make it responsive — don't hard-code those widths.

## Rules
1. **Exact values.** Copy colors, font sizes, line heights, weights, letter-spacing, radii, padding, gaps and shadows from the source. If a value is `15.5px`, it's `15.5px`.
2. **Copy is final.** Use the text as written, including punctuation. Sample names/numbers (Asha, 75 points, 3-day streak) become real data.
3. **Tokens first.** Before building screens, extract the repeated values into theme tokens (Tailwind config or CSS variables) and use them everywhere. Starting list below — confirm against the files.
4. **One responsive page per route.** Each phone screen (`V2*`) and desktop screen (`Desk*`) are the same route at two breakpoints. Phone layout below `768px`, desktop layout from `1024px`, sensible in between.
5. **Illustrations are inline SVG** in `ArtKit.dc.html` and `AvatarKit.dc.html` (no image files). Lift them into React components exactly as drawn.
6. **Accessibility as drawn:** real `<button>`, `<a>`, `<label>`; keep every `aria-*` from the source.
7. **Don't redesign.** If something can't be done exactly, or a screen is missing for a state you need, stop and ask.

## Design tokens (starting point — verify)

Fonts (Google Fonts): **Bricolage Grotesque** (headings, 500/600/700, opsz 12–96) · **Figtree** (body, 400/500/600) · **JetBrains Mono** (labels, meta, 400/500). Use `next/font/google`.

Light theme
| Role | Hex |
|---|---|
| Primary / CTA | `#43B4C8` (text on it `#06262C`). Exception: the account screens (consents, email and password, day-one profile) use `#0A3B46` buttons with white text. Copy what each screen shows. |
| Deep teal (streak card, dark surfaces) | `#0A3B46` |
| Ink | `#0C2A30` |
| Muted text | `#45626A`, `#5E777D` |
| Link | `#0B5567` (hover `#0A3B46`) |
| App background | `#EEF3F3` |
| Surface | `#FFFFFF` |
| Border | `#DCE6E7`, `#C5D5D8` |
| Tint | `#DDF3F7`, `#A8DDE7` |
| Streak / reward amber | `#FFB627`, `#F29D00`, soft `#FFF1D1` |
| Illustration accents | `#EE7B35`, `#F29AB8`, `#33261F` |

Dark theme (`Dark*` screens)
| Role | Hex |
|---|---|
| Background | `#071A1E` |
| Surface | `#0F2A30` |
| Raised / nav | `#0D3A44` |
| Border | `#1E4047`, `#2B5560` |
| Text | `#EAF4F5`, muted `#A9C7CD`, `#86A9B0` |
| Link | `#7FD6E6` (hover `#B5EAF3`) |

Radii in use: 3, 10, 12, 14, 16, 20, 22, 24, 28 px. Touch targets ≥ 44px.

## This is a LIVE site — ship it safely

jintu-mvp.vercel.app is in production. The redesign replaces the UI of an app people already use.

- **Never work on `main`.** Branch `redesign`, push often, and review every change on the Vercel preview URL. Merge to `main` only when the user says so.
- **Keep every existing URL working**: `/`, `/learn`, `/learn?c=<group>`, `/learn/<slug>`, `/roles`, `/roles/<slug>`, `/join`, `/profile`, `/pricing`, `/contact`, `/privacy`, `/terms`, `/refunds`. They're indexed by Google and shared in links. If a route really must change, add a 301 redirect in `next.config`.
- **Restyle, don't rewire.** Keep Supabase queries, auth, streak and progress logic, and the data model. Swap the presentation layer. No schema changes or migrations without asking.
- **Don't drop live features the designs don't show** (search box, highlights/notes export, "Download everything", category filters, SEO metadata). List them and ask where they go in the new design.
- **Numbers come from data.** Counts in the designs ("10 roadmaps", "60 job guides", "12 lessons") are samples. Read them from the database, not the mockup.
- **New screens that need backend work** (Today, onboarding, settings, saved, pair learning): build the UI behind a flag or on a not-linked route, and list the backend work needed. Don't half-wire it in production.
- Run `build`, lint and type-check before every push. Check the preview at 390px and 1440px.

## Screen → route map (matched to the live site's routes — confirm against the code)

**Build these (current design):**

| Group | Phone | Desktop | Route |
|---|---|---|---|
| Home page | `V2Landing` (+ `V2Home` first screen) | `DeskHome` | `/` (existing) |
| Sign in / sign up | `V2Login`, `V2Code`, `V2Password`, `V2SetPass`, `V2Join` | `DeskLogin`, `DeskCode`, `DeskPassword`, `DeskSetPass`, `DeskJoin` | `/join` (existing) — steps as states or sub-routes under it |
| Reset password | `V2Reset` | `DeskReset` | `/join/reset` (new) |
| First run | `V2Goal`, `V2Need` | `DeskGoal`, `DeskNeed` | `/onboarding` (new) |
| Avatar picker | `V2Avatar` | `DeskAvatar` | from Profile, e.g. `/profile/avatar` (new) |
| Today | `V2Today`, `V2New`, `V2Restart`, `UniToday` | `DeskToday`, `DeskNew`, `DeskRestart`, `DeskUniToday` | `/today` (new; 4 states, the last is two or more roadmaps at once) |
| Roadmaps | `V2Roadmaps` | `DeskRoadmaps` | `/learn` (existing; the group filter = `?c=`) |
| Roadmap / block | `V2Block` | `DeskBlock` | `/learn/[slug]` (existing) |
| Roadmap being rebuilt (holding page) | `V2Holding` | `DeskHolding` | `/learn/rebuilding?from=<slug>` (new). Every `draft` roadmap URL 302s here. `CHANGES.md` update 3 §A |
| Status labels (list, block, role pages) | `StatusKit` (board) | `StatusKit` | shared `<StatusLabel>` component plus role-page "Where to start" states. Update 3 §A |
| Lesson | `V2Step`, `V2Turn`, `V2Questions`, `V2Help`, `V2Offline`, `V2Done` | `V2Laptop`, `DeskTurn`, `DeskQuestions`, `DeskHelp`, `DeskOffline`, `DeskDone` | `/learn/[slug]/[lesson]` (check how lessons/days are routed now) |
| Quiz / review | `V2Quiz`, `V2Review` | `DeskQuiz`, `DeskReview` | in lesson / `/review` |
| Decide step (judgment roadmaps) | `V2Decide` (before), `V2DecideReveal` (after) | `DeskDecide` (after, with founder log) | lesson step component `type: 'decide'`. Update 3 §B |
| Glossary pop-up | `GlossaryKit` (board: phone sheet) | `GlossaryKit` (desktop popover) | lesson text component. Update 3 §C |
| DSA language switch | `V2Dsa` | `DeskDsa` | component in lessons |
| Step types (any roadmap) | `UniChoose`, `UniFind`, `UniFormula`, `UniNumber`, `UniWrite` | `DeskUniChoose`, `DeskUniFind`, `DeskUniFormula`, `UniDeskStep` (number), `DeskUniWrite`; overview `UniSteps`, `UniCourse` | lesson step components; desktop adds the right-hand "your work" panel per roadmap |
| Roles | `V2Roles`, `V2Role`, `V2Compare` | `DeskRoles`, `DeskRole`, `DeskCompare` | `/roles`, `/roles/[slug]` (existing), `/roles/compare` (new) |
| Profile | `V2Profile`, `V2ProfileNew` (day one, empty) | `DeskProfile` (public view), `DeskProfileNew` (your own view, day one) | `/profile` (existing; the design's public link `/u/<name>` is new — ask) |
| Settings | `V2Settings`, `V2Delete` | `DeskSettings`, `DeskDelete` | `/settings`, `/settings/delete` (new) |
| What you agreed to | `V2Consents` | `DeskConsents` | `/settings/consents` (new) |
| Email and password | `V2Account` (no password yet), `V2AccountSet` (password set) | `DeskAccount`, `DeskAccountSet` | `/settings/account` (new) |
| Saved | `V2Saved` | `DeskSaved` | `/saved` (new) |
| Pricing | `V2Pricing` | `DeskPricing` | `/pricing` (existing) |
| Contact | `V2Contact` | `DeskContact` | `/contact` (existing) |
| Legal | `V2Legal` | `DeskLegal` | `/privacy`, `/terms`, `/refunds` (existing — one layout, keep their current text) |
| 404 / error | `V2NotFound`, `V2Error` | `DeskNotFound`, `DeskError` | `not-found.tsx`, `error.tsx` |
| Pair learning | `V2PairStart`, `V2PairHome`, `V2PairStep`, `V2PairTalk` | `DeskPair`, `DeskPairWait` (waiting), `DeskPairStep` (results differ) | later phase |
| Dark theme | `DarkHome`, `DarkLogin`, `DarkToday`, `DarkStep` | `DarkDeskHome`, `DarkDeskLogin`, `DarkDesk`, `DarkLaptop` | theme toggle, all pages |

**Logo:** `LogoSparkMark` (construction), `LogoSparkColours` (colour versions), `LogoSparkUse` (sizes, favicon, streak badge). Use the files in `logo/`. Update 3 §D.

**Reference only:**
- `Mo*` — motion specs. `MoKit` lists the eight movements with timings; the others show them in place (`MoLanding` = home-page parallax). Implement with CSS / Framer Motion and honor `prefers-reduced-motion`.
- `ArtKit`, `AvatarKit` — the illustration and avatar library.

**Ignore:**
- `Main`, `LessonStep`, `LessonTurn`, `LessonEnd`, `LessonDesktop`, `Block`, `Catalogue` — first draft, old rules (Inter font), superseded.
- `ScribDeskA/B`, `ScribPhoneA/B` — hand-drawn style exploration, not chosen. Skip unless told.
- `canvas.json` also lists the logo explorations that weren't chosen (`LogoAll`, `LogoTwoDots`, `LogoRoute`, `LogoSpark`, `LogoSteps`, `LogoPin`, `LogoTile`). They aren't in this folder on purpose.

## Suggested build order
Existing pages first (pure restyle, low risk), then new ones.
1. Tokens + fonts + shared layout (top nav, phone tab bar, desktop sidebar from `DeskToday`), and footer.
2. Shared components (buttons, chips, cards, progress bar, streak week, inputs) — taken from the screens.
3. Home page `/` (`DeskHome` + `V2Landing`) → check against the screenshots.
4. `/learn` → `/learn/[slug]` → lesson → `/roles` → `/join` → `/profile` → pricing / contact / legal → 404 / error.
5. New screens (Today, onboarding, settings, saved, compare, pair) behind a flag, after their backend exists.

After each screen: run the app, screenshot it at 390px and 1440px, compare with `screenshots/<Name>.png`, and fix differences before moving on.
