# Jintu — project rules

Jintu sells accountability and proof, not content. Since v3 (see V3.md)
it is a free, open, self-paced platform: anyone signs in, learns anything,
earns points only for submissions that something checked, and builds a
public proof-of-readiness profile. No cohorts, no ₹999 — monetization
comes later as pay-to-verify. The rule that replaces the cohort rule:
**no point is ever awarded for consumption.**

## Hard invariants — never violate

1. **Never store or transform third-party content.** We store URLs and
   metadata only. No transcript columns, no summary columns, no
   AI-generated summaries of other people's articles, no text-to-speech,
   no EPUB/PDF bundling. YouTube renders only via the official IFrame
   embed and is never gated behind a quiz.

2. **No unbounded AI consumption.** Every LLM call attaches to one
   discrete graded submission and writes a row to `ai_usage` with its
   cost in paise. No chatbot, no "ask anything" box, no streaming
   assistant. If a feature can be invoked unlimited times, it does not ship.

3. **18+ only.** Age-gate at signup. Consent is granular and
   purpose-specific — separate rows in `consents`, never one bundled
   checkbox. DPDP Rule 10 prohibits profiling minors and our readiness
   scoring is profiling.

4. **Never promise employment.** No "guaranteed", "100% placement",
   "job assured", or any success statistic we cannot evidence with
   documentation and written consent. This is a legal constraint under
   the CCPA coaching-sector guidelines, not a style preference.

5. **Consistency points never become proof points.** Two separate
   ledgers. `readiness_score` reads only from `ledger = 'proof'`,
   enforced in the view definition.

## Design system

- `#43B4C8` (brand teal) — logo and large decorative fills ONLY.
  It is 2.44:1 on white and fails WCAG AA. Never text, never buttons.
- `#17758A` — all buttons, links, and teal text. This is the accessible shade.
- Neutrals: `#0B0B0B` text, `#5F5E5A` secondary, `#E8E8E5` hairlines,
  `#FFFFFF` surface, `#FAFAF8` page.
- Two font weights: 400 and 500. Never 700.
- Sentence case everywhere. Never Title Case headings.
- 8px radius on buttons/inputs, 12px on cards. 1px hairline borders.
  No shadows, no gradients.
- Body text minimum 15px, line-height 1.7, max-width 62ch.
- Touch targets minimum 48px. Users are on mid-range Android in daylight.

## Voice

Serious, calm, plain. Closer to Linear than to Duolingo. No mascots, no
illustrated people, no gamified confetti. These are adults with a real
career problem.

## Before you finish any task

- `pnpm typecheck` and `pnpm lint` pass
- No `#43B4C8` used as a text or button colour anywhere
- No new dependency added without saying why

---

## How the design system maps onto this repo

The rules above are the intent. The repo expresses them as tokens in
`packages/config/tailwind/preset.css`, and the tokens are what the
automated guards read — `scripts/assert-contrast.mjs` checks class names,
not raw hexes, so **always use tokens, never inline hex values**. A page
built from raw hexes silently stops being contrast-checked.

| Rule | Token to use |
|---|---|
| `#43B4C8` decorative fill | `brand-500` (annotated fill-only in the preset) |
| `#17758A` buttons/links | `brand-700` (hover `brand-800`) |
| Text | `ink-900`, secondary `ink-500`/`ink-600` |
| Hairlines | `ink-100` (subtle) / `ink-200` |
| Page ground | `ink-50` |
| 12px card radius | `rounded-card` |
| 8px control radius | `rounded-lg` |
| 48px targets | `h-12` |

Two knowing deltas, kept deliberately:

- The neutral tokens are `#231f20` / `#706d6e` / `#ededed` / `#f7f7f7`,
  not the round-number hexes above. They are close in appearance, but the
  tokens carry **measured contrast ratios as comments in the preset**, and
  every guard and annotation is built on them. Changing the palette means
  re-measuring every ratio — do it as its own change or not at all.
- The preset has no 700 weight in use; the enforcement is convention plus
  review, not a guard. `font-medium` is 500; `font-semibold` (600) and
  `font-bold` (700) are both off-limits.

The invariants are enforced by CI guards where a guard can reach them:
`pnpm embeds` (rule 1), `ai_usage`/`budget_guards` tables ahead of any AI
call and `pnpm ai:verify` proving the spend gate cannot leak (rule 2),
`pnpm db:simulate` asserts the 18+ CHECK and per-purpose consents
(rule 3), `pnpm claims` (rule 4), `pnpm points:verify` asserts the
proof_totals wall (rule 5).
