# Jintu redesign — current state of the codebase

Written 2026-10-18, on branch `redesign` (HEAD `38f2ca9`, one commit ahead of
`main`, which is itself PR #120's merge — the startup-finance roadmap work
from earlier this engagement). Everything below is what deploying `main`
today actually does, confirmed by reading the code, not by what any doc
*says* it does — two of the internal docs (`docs/design/LEGAL.md`,
`docs/ARCHITECTURE.md`) turned out to be partly stale; see §0.4.

This document exists so each phase in `BUILD-PLAN.md` starts from what is
real, not from what the designs assume. Citations are `file:line`.

---

## 0. Cross-cutting findings — read this part first

### 0.1 The single most important finding: no grading engine exists, and the one that used to isn't coming back by accident

`node_checks` (the table behind every "Check yourself" block) stores
`question`/`answer` text pairs with a `kind` (`comprehension`/`interview`),
a `difficulty`, and an `asked_in_interviews` flag
(`supabase/migrations/0019_question_bank.sql:32-45`) — **no correct-answer
field, no score column, no grading function, anywhere.** The web app
doesn't even select `kind`/`difficulty`/`asked_in_interviews`
(`apps/web/src/lib/roadmaps.ts:253`); every check renders identically — a
question that reveals its answer on tap
(`apps/web/src/components/lesson/lesson-page.tsx:814-826`, `CheckRow` at
1102-1136). There is no comparison against anything the user typed.

A real grading engine *did* exist — `packages/grading` (zod checkers, a
`grade()` function, an AI-rubric checker, two point ledgers, answer keys,
planted defects) — and was **deliberately and completely deleted** in
commit `0c2cbe6`, "The pivot: delete the verification product, baseline
the roadmap platform" (2026-08-13). `git cat-file -e HEAD:packages/grading`
confirms the path isn't in HEAD's tree; what's on disk under
`packages/grading/` today is untracked `node_modules`/`.turbo` build
cache, zero git-tracked files (`git ls-files packages/grading` → 0 lines).
Safe to `rm -rf` locally; not evidence anything was secretly rebuilt.

**Why this matters for Phase 5:** `BUILD-PLAN.md §3.4` describes
`UniChoose`/`UniFind`/`UniFormula`/`UniNumber`/`UniWrite` step types and a
quiz. Grepped across the entire repo (excluding `node_modules`), those five
tokens appear **only** in `design/jintu-design/BUILD-PLAN.md`,
`HANDOFF.md`, and the static mockup HTML — zero hits in `apps/web/src`,
`packages/`, or `supabase/migrations`. They are pure design-doc vocabulary
today. And tellingly, `BUILD-PLAN.md:68` itself describes the quiz as
"no score kept" — the plan's own author doesn't seem to intend scoring
either. **This narrows what looked like a hard conflict with CLAUDE.md's
"no grading, no verification... do not reintroduce it" down to one precise
question**, asked in §1 below: do these new step types ever locally
evaluate whether an answer was right (even without a score, even without
persisting it), or do they strictly present-then-reveal exactly like
today's checks, just as a richer interactive widget instead of a
tap-to-reveal card? If the latter — which the quiz spec's own wording
suggests — there is no conflict at all; it's a UI upgrade to an already
compliant pattern.

### 0.2 A node is one long scrollable page today, not a step sequence

`apps/web/src/lib/blocks.ts:4-8` states the model outright: a day is **six
tickable sections, in one fixed order** — Why today · Today · Read & do ·
Today's challenge · Check yourself · The mistake — all rendered in a single
pass inside one scrolling `<div>`
(`apps/web/src/components/lesson/lesson-page.tsx:368-466`,
`blocks.map(...)` at 391). This is a tested invariant —
`apps/web/sandbox/node-reader.test.mjs:39-47` locks the six-section order
in place. There's no per-step route, no step index in the URL, no "next
step within a day" — only prev/next between whole days
(`lesson-page.tsx:446-463`). Ticking a section is local-only
`localStorage` reading-progress, explicitly distinguished in the code's own
comments from server-tracked position (`lesson-page.tsx:134-141`).

**This is real, independent of the grading question.** Building the
designs' `V2Step`/`V2Turn`/`V2Questions`/`V2Help`-style one-thing-at-a-time
stepper is a genuine rebuild of the node reader's structure — the single
biggest piece of engineering in this whole redesign, whatever gets decided
about step-type grading.

### 0.3 Two live tech-debt items in the progress pipeline, independent of the redesign

- **`setNodeDone`** (`apps/web/src/actions/progress.ts:36,45-46`) calls the
  RPCs `complete_day`/`uncomplete_day`. These still work — as of migration
  `0012` they're thin one-line wrappers forwarding to the current
  `complete_node`/`uncomplete_node`
  (`supabase/migrations/0012_progress_timezone_and_resume.sql:375-386,
  395-402`) — but they're explicitly marked deprecated in their own
  comments. Cosmetic debt (wrong name called), not a bug. Worth renaming
  the call sites while Phase 5/6 is already touching this file.
- **`review_card_grade()`** (`0008_retention.sql:215-278`) still calls
  `perform public.touch_streak(c.user_id)` at line 268 — but
  `touch_streak(uuid)` was **fully dropped**, not wrapped, in
  `0011_streaks_v2.sql:173`, and no migration from 0009–0024 redefines
  `review_card_grade()` to stop calling it. As written in the migration
  history, grading a review card today should raise a Postgres
  undefined-function error. **This needs a direct check against the live
  database before Phase 6 (or anything) relies on review-card point
  awards** — `/review` already has a live route
  (`apps/web/src/app/(auth)/review/page.tsx`), so this may be actively
  broken in production right now, unrelated to anything about the
  redesign.

### 0.4 Two internal docs are partly stale — don't read them at face value

- **`docs/ARCHITECTURE.md`** carries an explicit banner:
  `> **SUPERSEDED (August 2026 pivot).**` — self-aware, fine, its product
  sections (§4 "the grading pipeline") are dead history, kept for the
  reasoning that survives.
- **`docs/design/LEGAL.md` has no such banner but is partially stale in
  the same way.** Its general rules (third-party content handling, the
  18+ hard gate, granular unticked consent, `notice_version`, the banned
  outcome-claim strings) still hold and match `CLAUDE.md` and the live
  code. But its specifics describe the deleted product: a
  `whatsapp_updates` consent purpose (the real, current one is the
  channel-neutral `reminders` — confirmed in
  `supabase/migrations/0001_identity.sql:117-122` and
  `packages/contracts/src/auth.ts:16` comment), phone as "the primary
  identifier" (§2.4 — no longer true, see §3.1 below), a `/p/[slug]`
  public-profile route (the real one is `/u/<handle>`-shaped, built on
  `public_profiles.handle`, though the route itself doesn't exist yet —
  see §3.6), and all of §3/§4's `outcomes`/readiness-score/AI-grading
  material, which belongs to the deleted product. **Cross-check any
  LEGAL.md specific against the live migrations, not the document, during
  this build.**

### 0.5 The domain is confused in the live code right now, independent of the redesign

`apps/web/src/lib/env.ts:161-206`'s `getSiteUrl()` resolves the canonical
base URL from `NEXT_PUBLIC_SITE_URL`, then Vercel's own production-URL env
var, then localhost — with a comment recording that the base URL used to
be hardcoded to `https://jintu.in`, and **`jintu.in` does not currently
resolve** ("verified, the connection fails," line 168). Despite that fix,
`jintu.in` is still hardcoded as branding/copy in a dozen other places that
didn't get the same treatment: `apps/web/src/app/manifest.ts`,
`opengraph-image.tsx` (×3, including literal "jintu.in" watermark text
rendered into the OG image), `site-footer.tsx:24`'s `hello@jintu.in`
mailto, every legal page's `privacy@jintu.in`. Meanwhile
`apps/web/src/app/sitemap.ts:19`'s *fallback* (if the env var is unset) is
`https://jintu-mvp.vercel.app`. **This is `BUILD-PLAN.md` decision #4,
except it's already a live inconsistency, not a hypothetical** — see §1.

---

## 1. Decisions — `BUILD-PLAN.md §1`, plus what exploration added, and answers

Asked and answered 2026-10-18; recorded here as the standing reference for
every later phase.

**1. Sign-in method → Restyle only.** Phase 3 keeps the exact flow (email
code, password, Google OAuth, email-link reset) and re-skins it. Dormant
phone/WhatsApp OTP code stays as-is — not wired on, not deleted.

**2. Lesson step types → Self-check only.** `UniChoose`/`UniFind`/
`UniFormula`/`UniNumber`/`UniWrite` and the quiz type get richer
interactive presentation (pick an option, type an answer, see it compared
visually) but **never store or score correctness anywhere** — same
self-check model `node_checks` already uses today, just a nicer widget. No
schema change, no CLAUDE.md conflict, no amendment needed. **This is now a
hard constraint on Phase 5's design, not just a recommendation** — any
step-type component that writes a right/wrong result to the database is
out of scope without a separate, explicit conversation first.

**3. Settings canonical page → `/profile`.** `/account` retires with a 301
to `/profile` once Phase 3 ships. Until then both stay live.

**4. Domain → fix now.** Every hardcoded `jintu.in` reference (manifest,
OG images, footer mailto, legal pages) gets replaced with the env-driven
`getSiteUrl()`/`NEXT_PUBLIC_SITE_URL` value, which currently resolves to
`jintu-mvp.vercel.app`. Scoped as early Phase 1 work (it touches the public
pages' metadata/footer, not Phase 0's foundations).

**5. Reminders — provider answered, sender deferred.** Email already runs
on SendGrid in production; no decision needed there. The actual
reminder-*sending* mechanism (reading `reminder_prefs`, firing an email on
schedule) doesn't exist and is being treated as **out of scope for this
redesign** unless raised again — restyle the preference UI in Phase 6
Settings, but don't build the sender.

**6. Pair learning → later**, per `BUILD-PLAN.md`'s own suggestion.
Phase 8, not touched until everything before it ships.

**Still open: the `review_card_grade()` bug (§0.3)** — proposed as a tiny,
isolated patch to `main`, separate from the redesign branch, since it's a
live production bug unrelated to the redesign's product questions. Asked
alongside the Phase 0 proposal below; not yet answered.

1. **Sign-in method** — turns out to be essentially already decided and
   built: see §3.1. The live question is narrower than "which to build."
2. **Lesson content model** — see §0.1/§0.2. The live question is whether
   any new step type ever evaluates an answer, even locally.
3. **Which roadmaps are published** — answered outright, no decision
   needed: `roadmaps.status` is `text check (status in ('draft',
   'published'))` (`0002_roadmaps.sql:28`), gating every downstream RLS
   policy. Not a boolean.
4. **Domain** — real inconsistency per §0.5; needs a call either way.
5. **Reminders/email provider** — partly answered: email already runs on
   SendGrid in production (chosen over Resend specifically for
   sender-domain verification — see commits `5a39003`, `467b534` on
   `main`), configured at the Supabase-project level
   (`supabase/config.toml:292-307`), not called from the Next app at all.
   What's genuinely undecided: `reminder_prefs` (the stored
   time/toggle/streak-warning preference, `0013_account_settings.sql:27-33`)
   is written and editable from `/profile` today, but **nothing anywhere
   reads it to send anything** — confirmed by grep, no cron, no scheduled
   edge function, no call site. Building the actual send mechanism is
   wholly new work, not a finish-what's-started task.
6. **Pair learning** — `BUILD-PLAN.md` itself suggests later (Phase 8);
   no code for it exists at all (confirmed — no route, no table, no
   component).

---

## 2. Phase-by-phase: what exists, what's reusable, what's missing

### Phase 0 — Foundations

**Exists / reusable:**
- Monorepo: pnpm workspaces (`apps/*`, `packages/*`), Turborepo, Next
  16.3.0 / React 19.2.8 / Tailwind 4.3.3 (CSS-first `@theme`, no JS
  config) / TypeScript 5.9.3.
- Design tokens: `packages/config/tailwind/preset.css` — brand ramp
  (`brand-50`…`brand-950`, `brand-500 #43b4c8` fill-only at 2.44:1,
  `brand-700 #17758a` the accessible shade at 5.32:1), ink neutrals, status
  colours (`ok`/`warn`/`risk`), and — notably — `check-machine`/`check-peer`/
  `check-model` tokens still present, leftover semantic colours from the
  deleted grading product (likely dead weight, confirm no live usage
  before deleting). Every colour is annotated with its measured WCAG
  ratio. One custom radius token (`--radius-card: 12px`); everything else
  is Tailwind's default scale.
- Fluid type scale: `packages/config/tailwind/type-scale.css` —
  `clamp()`-based display sizes 390px→1280px, one fluid spacing token
  (`--space-section`), fixed 15px body text with a 62ch max-width (matches
  CLAUDE.md's invariant exactly).
- Fonts actually loaded: **Inter + JetBrains Mono**
  (`apps/web/src/app/layout.tsx:2,16-17`), deliberately split
  sans-for-prose / mono-for-anything-measured. The designs specify
  **Bricolage Grotesque + Figtree + JetBrains Mono** — real, scoped swap
  work, not a check-the-box step.
- Shared component layer, two tiers:
  - `components/ui/`: `icons.tsx` (11 stroke icons), `category-accent.ts`
    (category→colour map), `field-shell.tsx` (input chrome), `patterns.tsx`
    — the real pattern language: `Eyebrow`, `SectionHead`, `StatBadge`,
    `ChipRow`/`Chip`, `TagPair`, `NumberedRow`, `ProgressRule`,
    `PrimaryLink`.
  - `components/site/`: `SiteNav` (overlay/solid variants),
    `SiteNavMenu` (mobile/account menu), `SiteFooter`.
  - `components/marketing/product-miniatures.tsx`: `ModuleSpine`,
    `DayCardMini`, `StreakStrip`, `ContribGrid`, `LinkCardMini`,
    `CategoryCap` — exactly the "day card"/"streak strip"/"module spine"
    primitives the designs need, already built, decorative (`aria-hidden`)
    but illustrating real computed data.
  - **All of the above need a full re-skin to the new tokens — they are
    reusable logic/structure, not reusable visuals.**
- PWA/offline: fully wired — `manifest.ts`, `sw.ts` (Serwist: precache,
  navigation preload, offline fallback to `/~offline`, and a deliberate
  cache-bypass for private paths `/account|onboarding|profile|join|
  dashboard|review` so a shared device never serves a previous user's
  cached account page — `sw.ts:40`).
- Guard/CI scaffolding — see §4. Extensive, already enforces most of
  CLAUDE.md/LEGAL.md as code, not just docs.

**Missing:**
- Dark theme: **zero code anywhere.** No toggle, no dark CSS variables, no
  theme-context. Confirmed by grep across the app — only static
  theme-color meta tags for the browser chrome exist, nothing
  user-facing.
- Vitest, React Testing Library, Playwright, @axe-core/playwright: **none
  installed in `apps/web` or at root.** Vitest exists only in
  `packages/notify`, `packages/analytics`, `packages/contracts` — three
  small non-UI packages. `apps/web`'s test runner is a custom
  `node --test` sandbox (`apps/web/sandbox/run-tests.mjs`) asserting on
  raw source text, not rendered DOM — valuable (it's wired into CI and
  catches real regressions) and worth keeping *alongside* the new layers,
  not replacing.
- Full token set from `HANDOFF.md` (radii 3/10/12/14/16/20/22/24/28,
  the richer colour list, Bricolage/Figtree): none of it exists yet.
  `HANDOFF.md` rule 3 ("tokens first") is the right call and a real
  Phase-0-sized task, not a formality.
- `.env.example` doesn't need new entries for anything above except
  possibly a reminder-send provider if decision 5 says build it now.

### Phase 1 — Public pages

**Exists today, confirmed working:** `/` (home, `force-dynamic`,
`(home)/page.tsx`), `/pricing`, `/contact`, `/privacy`, `/terms`,
`/refunds`, `/report` — all with real `metadata` exports, all server
components. `/404`/`/error`/`global-error.tsx` all exist with proper
boundaries. This phase is close to a pure restyle, per `HANDOFF.md`'s own
framing — no backend gaps found.

### Phase 2 — Roadmaps & roles (read-only)

**Exists today:**
- `/learn` (catalogue, `force-dynamic`), `/learn/[slug]` (one roadmap,
  `generateMetadata`), `/learn/[slug]/[node]` — **this is the exact lesson
  route pattern**, not `/learn/[slug]/[lesson]` as `HANDOFF.md`'s route
  map guesses. Has its own `error.tsx`/`not-found.tsx`/`loading.tsx`/
  `opengraph-image.tsx`.
- `/roles` (static), `/roles/[slug]` (fully static, `generateStaticParams`,
  content-file driven — no DB read at all), `/roles/compare/[slug]`
  (same). All already exist, matching `HANDOFF.md`'s route map closely —
  only the exact path for comparison differs slightly
  (`/roles/compare/[slug]`, not `/roles/compare`).
- Group filter via `?c=` already works (`CataloguePage`, filters parsed
  server-side).

**Missing:** nothing structural — this phase is genuinely close to a pure
restyle too.

### Phase 3 — Auth & account

**Exists today, fully wired and working — this phase is much smaller than
`BUILD-PLAN.md` assumes:**

- **Email 6-digit OTP** (primary) + **password sign-in** (secondary,
  optional) + **Google OAuth** + **password reset via emailed link** — all
  four real, all cross-enforced by DB constraints, confirmed by reading
  `apps/web/src/actions/auth.ts` and `apps/web/src/components/
  join-form.tsx` end to end. This already matches the designs'
  `V2Login → V2Code → V2SetPass → V2Join` sequence closely. **Decision 1 is
  effectively: restyle this working flow, unless you want to change the
  flow itself while we're in here.**
- Git archaeology on the branches you might expect to hold unmerged auth
  work (`feat/auth-phone-otp`, `feat/phone-otp-provider`,
  `feat/password-signin`, `feat/auth-v3`, `feat/auth-onboarding`): **every
  one is fully merged**, zero commits ahead of `main`. They tell a
  coherent evolution (phone-first → email-first, for TRAI-DLT-cost reasons
  documented inline at `packages/contracts/src/auth.ts:48-65` → password
  escape hatch added to avoid burning Supabase's email quota → today's
  UI consolidation). Nothing to recover.
- **Phone/WhatsApp OTP: built, but switched off.** Real edge function
  (`supabase/functions/send-sms/index.ts`), real notifier package
  (`packages/notify`), disabled at the provider level
  (`supabase/config.toml:361-366`) and the delivery hook commented out
  (`:451-454`). A phone number is still collected at onboarding — just for
  reminders, never for identity. Needs a decision: leave dormant
  (recommended — restyle around the real flow) or rip out.
- **Consents and the 18+ gate: definitively real, not aspirational** —
  the one CLAUDE.md invariant I'd call fully proven. Three independent,
  un-pre-ticked checkboxes (`reminders`/`analytics`/`public_profile`) on
  `/onboarding`, each becomes its own `consents` row with its own
  `notice_version` and `granted_at`; `core_service` inserted
  unconditionally, not a checkbox. Enforced twice — in app code and in a
  DB CHECK constraint (`profiles_must_be_adult`) that makes a non-adult
  profile row unrepresentable.
- **Two parallel settings surfaces exist simultaneously** — `/account`
  (older, simpler) and `/profile` (newer, richer: identity, timezone,
  reminders incl. time, public-profile toggle, full JSON data export via
  `/profile/export`, real cascading delete via `/profile/delete` using the
  service-role key). Both work independently against the same tables.
  **Needs a decision: which becomes canonical** (almost certainly
  `/profile`, given it's the superset — `/account` would then redirect or
  retire, with a 301 per `HANDOFF.md`'s rule).
- `/profile/saved` exists (not `/saved` top-level) — see Phase 6.
- `/profile/consents` exists — per-purpose list with granted date and a
  withdraw toggle per row.
- Middleware (`apps/web/src/proxy.ts` — renamed from `middleware.ts` per
  Next 16 convention) protects `/onboarding`, `/account`, `/profile`,
  `/dashboard`, `/review` and redirects back to the original URL after
  login via a sanitized `?next=` (open-redirect-proofed,
  `packages/contracts/src/auth.ts:177-186`). `/admin/metrics` is
  **outside** this protected list — it's gated (if at all) entirely by its
  own in-page check, and that page's allowlist is currently **empty**
  (`apps/web/src/app/(auth)/admin/metrics/page.tsx:28`), i.e. nobody can
  currently see it. Low stakes, but worth a one-line fix regardless of the
  redesign.

**Missing:** theme toggle (see Phase 0), the reminder-send mechanism
(see Decision 5), `/u/<handle>` route (see Phase 6), `/settings` as a
single page (it's really `/profile` already — naming only).

### Phase 4 — First run

`/onboarding` exists and is where decision 1's consent/18+ work actually
happens (see Phase 3) — it currently collects full name, college name,
mobile, batch year, the 18+ confirmation, and the three consents. It does
**not** yet collect a "goal" or "need" (`V2Goal`/`V2Need` in the designs)
— that's genuinely new, both as UI and as whatever decides what Home opens
on. `V2Avatar` (avatar picker) — no avatar system exists in the schema at
all (profiles has no avatar/image column); fully new.

### Phase 5 — Lesson engine (biggest phase, confirmed)

See §0.1 and §0.2 above for the two load-bearing findings. Summary:

- **Content model, by field**: fully mapped in the live audit — `nodes`
  carries `title`/`summary`/`learning_objectives`/`why_today`/`principle`/
  `common_mistake`/`challenge`/`challenge_minutes`/`est_minutes`/
  `points`/`difficulty`/`slug`, each a flat column; `node_topics` and
  `node_checks` and `resources` are genuine **child tables**, not JSON
  blobs. Importantly, three fields the importer writes are **never
  selected by the app today**: `node_checks.kind`/`difficulty`/
  `asked_in_interviews` and `resources.license`/`self_check` — meaning
  173 authored `kind: "interview"` checks across `docs/roadmaps/**`
  currently render identically to comprehension checks. If the redesign
  wants to visually distinguish them (the designs might), that's a small,
  real addition — add three fields to one `select()` call in
  `apps/web/src/lib/roadmaps.ts:253` — not a schema change.
- **No step engine exists** — a node is one scrolling page with six
  sections in a fixed, tested order. Building `V2Step`/`V2Turn` as true
  one-at-a-time steps is a real rebuild of `lesson-page.tsx` and
  `lesson-route.tsx`'s structure.
- **Progress granularity**: binary per-node (`node_progress.status`), plus
  a coarser-than-step "furthest block reached" bookmark
  (`last_block_position`, written by an RPC that's never actually called
  from the app — the live reading-progress UI uses `localStorage`
  instead, confirmed by the code's own comment admitting this is the seam
  that changes once a real per-section table exists).
- **DSA language switch, `UniChoose`/`UniFind`/`UniFormula`/`UniNumber`/
  `UniWrite`, "Mine looks different," `help_requests`**: none of it
  exists. All net new, pending Decision 2.

### Phase 6 — Progress & motivation

**Far more exists than the build plan assumes — mostly a re-skin phase,
modulo the two bugs in §0.3:**

- Streaks: `activity_days` (source of truth, one row per user per day with
  ≥1 completion) + `streaks` (derived cache) + `streak_status` (the one
  view the UI may read, which decays `current_days` to 0 the moment the
  user's own `user_today()` has moved past `last_done_on`). Fully
  timezone-aware per user (`profiles.timezone`, an IANA name captured at
  signup, validated by a DB trigger against `pg_timezone_names`). Freezes
  existed once and were deliberately removed ("freezes are OUT — hard
  reset on a missed day"); `total_days` (never decreases) is the stated
  replacement. All writes go through `SECURITY DEFINER` RPCs
  (`complete_node`/`uncomplete_node`); clients have no write grant at all.
- Points: one ledger, `point_events`, server-only, idempotent **by
  construction** via three partial unique indexes (once-ever for
  node/module completion, once-per-card-per-day for reviews, once-per-day
  for the streak bonus) rather than application-level checks that could
  drift. A 150-points/day cap from node completion is enforced in the
  award function.
- `/review` route exists; `review_cards` table exists with genuinely
  SM-2/FSRS-shaped columns (`stability`, `difficulty`, `due_on`, `reps`,
  `lapses`) and a grading RPC — **but see §0.3, the RPC currently calls a
  dropped function and needs verifying against the live database before
  anything in Phase 6 depends on it.**
- `saved_resources` exists (save/consumed-at), with a working
  `/profile/saved` page already — matches `V2Saved`'s save/mark-as-read/
  remove shape closely. Just needs the top-level `/saved` route (or a
  redirect) and a re-skin, per Decision on canonical settings location.
- `public_profiles` (handle + `is_public` toggle, RLS already allows
  anonymous reads when public) exists — the **backend** for `/u/<handle>`
  is built. Only the route itself is missing (confirmed: no `app/u/`
  directory anywhere), despite the site's own copy at
  `/profile/consents` already promising "Publishes a page at
  jintu.in/u/your-name." **This is a real, currently-live broken promise
  in the product, independent of the redesign** — worth fixing regardless.
- Share-card OG generation (`next/og`): the pattern already exists for
  roadmaps/nodes (`opengraph-image.tsx` at three route levels); extending
  it to `/u/<handle>` is the same technique, not new infrastructure.

### Phase 7 — Dark theme + motion

Zero code exists for either (confirmed by grep — no theme context, no
dark CSS variable set, no motion library wired beyond ordinary CSS
transitions already used sparingly in existing components). Fully new,
exactly as `BUILD-PLAN.md` assumes.

### Phase 8 — Pair learning

Zero code exists — no route, no table, no component, nothing in
`grep`-able history either. `BUILD-PLAN.md` already suggests deferring
this; nothing found here changes that recommendation.

---

## 3. Testing & CI — current state vs. `BUILD-PLAN.md §4`

**What's already real:**
- CI (`.github/workflows/ci.yml`) runs on every push/PR: install → lint →
  typecheck → `node --test` → build → then **17 named guard scripts**,
  each enforcing a specific CLAUDE.md/LEGAL.md/ARCHITECTURE.md rule as
  code (schema RLS shape, banned outcome-claim strings, nocookie-only
  embeds, WCAG contrast, no hand-placed `<br>` in headings, role-page
  honesty, dead-code detection, licence-vocabulary agreement across four
  places, the full post-pivot baseline — one ledger, RLS everywhere,
  published-is-public/draft-is-private, no client-mintable points — import
  verification, retention/streak-RPC edge cases, bundle-size budget,
  env-template leak scanning, edge-function import resolution, and a
  meta-guard proving every guard above is actually wired into both
  `package.json` and `ci.yml`). A separate `database` CI job runs every
  migration against a real local Postgres on every PR via the Supabase
  CLI (`supabase start` → `db:verify`/`db:lint` → `supabase stop`) — this
  already covers much of `BUILD-PLAN §4`'s "Database" testing layer.
- A separate weekly `link-check.yml` crawls every published resource's URL
  — doesn't fail the build on a dead link, only on a crawl that couldn't
  run at all.
- Local Supabase genuinely works (not just talks to the hosted project);
  the hosted project is only touched by the link-checker and by
  hand-pasted import bundles.

**What's missing, matching `BUILD-PLAN §4` exactly:**
- **Vitest at the `apps/web` level**: not installed (exists only in three
  small non-UI packages). The existing `node --test` sandbox suite tests
  real invariants via source-text assertions (no DOM, no render) and is
  worth keeping *alongside* Vitest, not replacing.
- **React Testing Library**: not installed anywhere.
- **Playwright**: not installed anywhere — confirmed by grepping every
  `package.json` in the repo.
- **@axe-core/playwright**: not installed (follows from the above).
- **Vercel preview deploys are not gated on CI.** No Vercel step exists in
  any GitHub Actions workflow, and no `vercel.json` exists in the repo —
  whatever triggers the preview is Vercel's own GitHub-app integration,
  independent of whether `ci.yml` is green. **A green preview URL is not
  evidence tests passed; I'll confirm CI status directly, not infer it
  from the preview existing.**

All of the above is genuinely Phase-0 work: add Vitest + RTL + Playwright
+ axe to `apps/web`, wire them into `ci.yml` alongside (not instead of)
the existing guard suite, and — separately — consider gating the Vercel
preview on CI passing, or at minimum treating "preview is up" and "tests
pass" as two different facts throughout this build.

---

## 4. Full guard-script reference (for Definition-of-Done checks each phase)

| Script | Enforces |
|---|---|
| `schema:rules` | Every migration enables RLS; no bare `auth.uid()` |
| `claims` | No banned outcome-claim strings near outcome words (LEGAL.md §3) |
| `embeds` | YouTube nocookie-only, no direct media/transcript fetches (LEGAL.md §1) |
| `contrast` | No Tailwind text/button colour token below WCAG AA 4.5:1 |
| `typography` | No hand-placed `<br>` in headings; per-breakpoint display sizing |
| `roles` | Every role page routes to a real roadmap slug or honestly says none exists; no undated salary figures |
| `retention:verify` | Streak/points RPC edge cases: IST/timezone boundary, same-day dedup, undo/redo idempotency, lapse-to-zero, restart-at-1 |
| `import:verify` | An unchecked import stays draft/invisible; a checked one fully publishes with matching counts |
| `licences` | Licence vocabulary agrees across `scripts/lib/licenses.mjs`, the DB CHECK, and generated `may_reuse` |
| `baseline:verify` | Migrations apply clean from scratch; RLS everywhere; published-is-public/draft-is-private; progress private; no client-mintable points; one ledger |
| `dead-modules` | No file nothing imports (excluding Next.js route-convention files) |
| `bundle:budget` | First-load JS stays under 350KB |
| `env:templates` | No real credential committed in a `.env.example` |
| `fn:imports` | Every edge-function import resolves under Deno's extension-required rules |
| `guards` | Meta-guard: every guard above is wired into both `package.json` and `ci.yml` |

This redesign should keep every one of these green throughout — relaxing
any of them would be a regression against what the codebase already
enforces, not a reasonable cost of a UI rewrite.
