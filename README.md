# Jintu

A 6-week, cohort-based placement sprint. Free public curriculum, AI-graded
artifacts, peer review, and a shareable proof-of-readiness profile.

**Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) before writing code** —
especially §0, the three architectural laws. They are not style preferences;
they are what keeps the margin viable and the company out of court.

**Read [`docs/LEGAL.md`](docs/LEGAL.md) before writing marketing copy**, adding
a column that stores text from someone else's site, or shipping anything that
collects a phone number.

## Requirements

- Node `>=20.9.0` (Next 16 floor)
- pnpm 9+ (`corepack enable`)

## Getting started

```bash
pnpm install
pnpm dev        # nothing to run yet — apps/web lands in the next PR
pnpm lint
pnpm typecheck
pnpm build
```

## Layout

```
apps/
  web/            # the single Next.js 16 app (student + TPO + admin)
packages/
  config/         # shared eslint, tsconfig, tailwind preset  ← you are here
supabase/         # migrations, edge functions — schema source of truth
docs/             # ARCHITECTURE.md, LEGAL.md, decisions/
```

The rest of the tree is built out phase by phase; see ARCHITECTURE.md §6.

## Shared config

`@jintu/config` is consumed by every workspace package:

| Export | Use |
|---|---|
| `@jintu/config/eslint/base` | every package |
| `@jintu/config/eslint/next` | `apps/web` — adds core-web-vitals |
| `@jintu/config/eslint/runtime-pure` | `packages/grading` — bans Node built-ins so the code also runs on Deno |
| `@jintu/config/typescript/base.json` | every package |
| `@jintu/config/typescript/nextjs.json` | `apps/web` |
| `@jintu/config/tailwind/preset.css` | `apps/web` |

## Current phase

**Phase 0 — repo + concierge.** Almost no product code on purpose. The first
cohort runs on Notion, WhatsApp, and Google Forms, graded by hand. The ship
gate is ≥10 of 20 people paying and ≥8 still submitting in week 4 — not a
feature list. See ARCHITECTURE.md §6.
