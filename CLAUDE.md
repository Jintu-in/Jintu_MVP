# Jintu — project rules

Jintu is a free learning AGGREGATOR and ROADMAP platform: one place to
find and follow deep, comprehensive roadmaps for any subject, built
entirely from curated third-party free content — reads, embedded YouTube
videos, official docs, case studies — sequenced into modules and nodes,
with progress tracking, streaks and points for momentum. Primary use is
MOBILE, 2–10 minute sessions; the only question the UI must answer
instantly is "what do I tap now."

There is no grading, no verification, no tiers, no votes, no credential.
That product was deliberately deleted (August 2026 pivot — see the
baseline in supabase/migrations/). Do not reintroduce it, "as an option"
or otherwise. Getting through a node IS the progress event.

## Hard invariants — never violate

1. **Never store or re-host third-party content.** URLs and metadata
   only. No transcript columns, no summaries of other people's articles,
   no TTS of third-party text, no offline bundling. This is the line
   between an aggregator and an infringer, and Section 79 safe harbour
   depends on it. YouTube renders only via the official IFrame Player on
   the nocookie domain, click-to-load, autoplay off, branding kept, ads
   never blocked, playback never gated behind an action.

2. **Never publish an unvalidated URL.** Anything a model suggested is
   `needs_verification` until a person (or the link checker) has seen it
   resolve and the title match. Roughly a fifth of LLM-suggested
   references are fabricated, and a dead link on the main surface is
   worse than a missing one. Show estimated data size on videos —
   users are on metered mobile data — and lazy-load every embed.

3. **18+ only.** Age-gate at signup. Consent is granular and
   purpose-specific — separate rows in `consents`, never one bundled
   checkbox. DPDP Rule 10 prohibits profiling minors, and tracking
   progress, streaks and points is profiling.

4. **Never promise employment.** No "guaranteed", "100% placement",
   "job assured", or any success statistic we cannot evidence with
   documentation and written consent. This is a legal constraint under
   the CCPA coaching-sector guidelines, not a style preference.

5. **Points are for momentum, not a credential.** One ledger, awarded
   server-side only for genuine node progress and completed reviews, and
   the UI says so. No readiness scores, no evidenced points, no
   credential language — ever.

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
`pnpm embeds` and `pnpm schema:rules` (rule 1 — nocookie-only embeds, no
content columns on tables that point at third-party URLs), the
`needs_verification` column and `link_checks` table carry rule 2's state,
`pnpm baseline:verify` asserts the 18+ CHECK, per-purpose consents,
private-by-default progress and that clients cannot mint points (rules 3
and 5), `pnpm claims` (rule 4).
