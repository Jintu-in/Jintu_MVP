# Jintu — Architecture & Phased Build Plan

> **Jintu.in** — a 6-week, cohort-based placement sprint. Free public content, AI-graded artifacts, peer review, and a shareable proof-of-readiness profile.
>
> **Repo:** `jintu/jintu` · **Stack:** Next.js 16 · Supabase · TypeScript · Tailwind v4 · PWA
> **Doc version:** 1.0 · **Last verified:** August 2026

### Companion document

`TRACK_MODEL.md` is the source of truth for **how a track is verified** — the
six verification archetypes, the checker registry, the tier rules, and the
points ledgers. This file stays the source of truth for **stack, data model
and compliance**.

Where they overlap, they must agree. TRACK_MODEL.md Part 11 records the five
places they currently do not, and Part 12 is the order in which to reconcile
them. When a change touches both, update both in the same PR — a fork between
these two documents is how a rule gets enforced in one place and quietly
dropped in the other.

---

## 0. Read this first — the three architectural laws

Every design decision below descends from these. If a PR violates one, reject it.

### Law 1 — No unbounded AI consumption
Every LLM call must be attached to a discrete, countable event (one submission → one grading). There is no chatbot, no "ask anything" box, no streaming assistant. Every call writes a row to `ai_usage` with its cost in paise. A budget guard hard-fails calls past the cohort's ceiling.

*Why:* the validation report modelled the original design at ₹3,500–6,000/user/month against ₹1,300 revenue. This law is what makes ~91% gross margin possible.

### Law 2 — Never store or transform third-party content
We store **URLs and metadata**. We do not store transcripts, we do not generate summaries of third-party text, we do not narrate, we do not export bundles. YouTube renders only through the official IFrame player. The `resources` table has no `transcript` or `summary` column, and it never will.

*Why:* the difference between the Google Books safe harbour (index and link out) and the Thomson Reuters v. Ross outcome (market substitute).

### Law 3 — 18+ only, consent is a first-class table
Age-gate at signup. No minors. DPDP Rule 10 prohibits profiling children outright, and readiness scoring *is* profiling. Consent is granular and purpose-specific — a `consents` table, not a boolean on `profiles`.

*Why:* ₹200 crore penalty exposure for children's-data failures, and full DPDP compliance is due 13 May 2027.

---

## 1. Stack

| Layer | Choice | Version (Aug 2026) | Why |
|---|---|---|---|
| Framework | Next.js App Router | **16.3.x** | Active LTS until Oct 2027. Turbopack is default. Do not start on 15.x — it enters EOL Oct 2026 |
| Runtime | React | 19.x | Required by Next 16 |
| Language | TypeScript | 5.x, `strict: true` | |
| Styling | Tailwind CSS v4 | 4.x | CSS-first config, no `tailwind.config.js` |
| Components | shadcn/ui | latest | Copy-in, not a dependency |
| Backend | Supabase (Postgres 15+) | — | Region **ap-south-1 (Mumbai)** |
| Auth | Supabase Auth — phone OTP | — | Phone-first is correct for India. Passkeys are in beta; revisit later |
| SSR auth glue | `@supabase/ssr` | latest | `@supabase/server` shipped in 2026 but is early-stage — do not adopt yet |
| Background jobs | Supabase Queues (pgmq) + Cron (pg_cron) + Edge Functions | — | Replaces Redis/BullMQ entirely |
| Validation | Zod | v4 | Shared between client, server actions, and edge functions |
| Server mutations | Server Actions + `next-safe-action` | — | Typed, validated, no ad-hoc API routes |
| PWA | `@serwist/next` | latest | `next-pwa` is unmaintained; Serwist is the successor and works cleanly with Next 16 |
| Payments | Razorpay (UPI intent, one-time) | — | Lowest friction for ₹999. Avoid card e-mandates |
| WhatsApp | Meta Cloud API via a BSP | — | AiSensy / Interakt / Gupshup. Abstract behind an adapter |
| Email | Resend | — | Note: new Supabase free projects can no longer customise auth email templates on default SMTP (since 3 Jun 2026) — configure your own SMTP |
| Errors | Sentry | — | |
| Product analytics | PostHog | — | Self-host or EU/India region; wire to `consents` |
| Testing | Vitest + Playwright | — | |
| CI/CD | GitHub Actions → Vercel + Supabase CLI | — | |
| Package manager | pnpm | 9+ | |
| Monorepo | Turborepo | 2.x | |

### Explicitly rejected
| Rejected | Reason |
|---|---|
| Prisma / Drizzle as primary | Supabase SQL migrations are the source of truth; ORMs fight RLS. Use `supabase gen types typescript` |
| Redis / BullMQ / Railway workers | Supabase Queues + Cron covers everything at this scale |
| A separate REST/tRPC API layer | Server Actions + RSC. Add tRPC only if a native app ever appears |
| React Native / Expo | PWA first. Indian Android users install PWAs fine and you skip Play Store review |
| `next-pwa` | Unmaintained |
| Any vector DB | There is no RAG. See Law 2 |
| Clerk / Auth0 | Supabase Auth is already there and phone OTP is cheaper |

---

## 2. Monorepo layout

```
jintu/
├── apps/
│   ├── web/                    # The single Next.js 16 app (student + TPO + admin)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (marketing)/        # landing, pricing, /learn/[track] public paths
│   │   │   │   ├── (student)/          # dashboard, sprint, submit, peer-review
│   │   │   │   ├── (tpo)/              # college batch dashboard  [Phase 3]
│   │   │   │   ├── (admin)/            # path authoring, cohort ops, cost console
│   │   │   │   ├── p/[slug]/           # PUBLIC proof-of-readiness profile
│   │   │   │   ├── api/
│   │   │   │   │   └── webhooks/
│   │   │   │   │       ├── razorpay/
│   │   │   │   │       └── whatsapp/
│   │   │   │   ├── manifest.ts         # PWA manifest (typed, not static JSON)
│   │   │   │   └── ~offline/           # offline fallback route
│   │   │   ├── sw.ts                   # Serwist service worker source
│   │   │   ├── actions/                # server actions, one file per domain
│   │   │   ├── components/
│   │   │   └── lib/
│   │   │       ├── supabase/{server,client,middleware}.ts
│   │   │       └── auth/
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   └── ops/                    # [Phase 2] internal CLI: seed cohorts, bulk enroll, cost reports
│
├── packages/
│   ├── db/                     # generated Supabase types + typed query helpers
│   ├── contracts/              # Zod schemas — the single source of truth for shapes
│   ├── grading/                # PURE TS. Runs in both Node and Deno. No node: imports
│   │   ├── deterministic/      # SQL runner, link validator, file checks
│   │   ├── rubrics/            # rubric definitions per assignment
│   │   └── ai/                 # prompt templates + response parsers (no SDK coupling)
│   ├── notify/                 # WhatsApp/email adapter interface + BSP implementations
│   ├── ui/                     # shadcn components, shared
│   ├── analytics/              # PostHog wrapper gated on consent
│   └── config/                 # eslint, tsconfig, tailwind preset
│
├── supabase/
│   ├── migrations/             # SQL — the schema source of truth
│   ├── functions/              # Deno edge functions
│   │   ├── grade-submission/
│   │   ├── send-nudges/
│   │   ├── check-link-health/
│   │   ├── compute-readiness/
│   │   └── razorpay-webhook/
│   ├── seed.sql
│   └── config.toml
│
├── docs/
│   ├── ARCHITECTURE.md         # this file
│   ├── LEGAL.md                # YouTube ToS, DPDP, CCPA ad rules — read before shipping copy
│   ├── RUNBOOK.md
│   └── decisions/              # ADRs
│
├── .github/workflows/
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Why one Next app, not three.** Student, TPO, and admin share auth, data layer, and components. Route groups give clean separation with one deploy. Split into separate apps only when a team owns each — not before.

**Why `packages/grading` must be runtime-pure.** It runs inside Next server actions (Node) *and* inside Supabase Edge Functions (Deno). No `fs`, no `path`, no Node built-ins. Enforce with an eslint rule.

---

## 3. Data model

Full DDL lives in `supabase/migrations/`. This is the shape and the reasoning.

### Identity & compliance
```sql
-- profiles: 1:1 with auth.users
profiles(
  id uuid pk references auth.users,
  phone text unique not null,
  full_name text,
  college_id uuid null references colleges,
  batch_year int,
  is_adult_confirmed boolean not null default false,  -- Law 3, hard gate
  created_at timestamptz default now()
)

-- DPDP requires granular, purpose-specific consent. Not a boolean.
consents(
  id uuid pk,
  user_id uuid references profiles,
  purpose text not null,        -- 'core_service' | 'analytics' | 'whatsapp_updates' | 'public_profile'
  notice_version text not null, -- which privacy notice they saw
  granted_at timestamptz,
  withdrawn_at timestamptz null
)

colleges(id, name, city, state, tier, tpo_name, tpo_phone, created_at)
```

### Curriculum (versioned, reusable, no third-party content stored)
```sql
tracks(id, slug, title, summary, is_published)          -- 'data-analyst-fresher'
paths(id, track_id, version int, status, published_at)  -- immutable once published
modules(id, path_id, week_no, title, objective)

-- Law 2: URLs and metadata only. No transcript. No summary. Ever.
resources(
  id uuid pk,
  module_id uuid references modules,
  kind text,                    -- 'video' | 'article' | 'docs' | 'dataset' | 'tool'
  provider text,                -- 'youtube' | 'web'
  external_url text not null,
  youtube_video_id text null,   -- for official IFrame embed only
  title text,                   -- our own words or public metadata
  duration_sec int,
  position int,
  health text default 'ok',     -- 'ok' | 'degraded' | 'dead'
  last_checked_at timestamptz
)

rubrics(id, name, criteria jsonb, max_score)
assignments(id, module_id, kind, spec jsonb, rubric_id, weight)
  -- kind: 'sql' | 'artifact_link' | 'file' | 'recording'
```

### Cohorts & the loop
```sql
cohorts(id, path_id, college_id null, mode, starts_on, ends_on, capacity, status)
  -- mode: 'public' | 'campus'

enrollments(id, cohort_id, user_id, status, order_id null, joined_at, completed_at)
  unique(cohort_id, user_id)

submissions(id, enrollment_id, assignment_id, week_no, payload jsonb, submitted_at, status)

gradings(
  id, submission_id,
  grader_type text,   -- 'deterministic' | 'ai' | 'peer' | 'mentor'
  scores jsonb, total numeric, feedback text,
  model text null, cost_paise int default 0,
  created_at
)

peer_reviews(id, submission_id, reviewer_enrollment_id, scores jsonb, status, due_at)
```

### The moat tables
```sql
readiness_scores(id, enrollment_id, computed_at, overall numeric, breakdown jsonb)

-- THIS is the defensible asset. Guard it. Never delete rows.
outcomes(
  id, enrollment_id,
  event text,        -- 'interview_call' | 'offer' | 'joined'
  company text, role text, reported_at,
  source text        -- 'self_reported' | 'tpo_confirmed' | 'document_verified'
)
```
> `outcomes.source` matters legally as much as analytically. CCPA fined BYJU'S ₹10 lakh for success claims it could not evidence with consent forms and documentation. You may only ever advertise `document_verified` rows, with written consent on file.

### Cost & ops
```sql
ai_usage(id, cohort_id, enrollment_id null, function_name, model,
         input_tokens, output_tokens, cost_paise, created_at)

budget_guards(id, scope, scope_id, ceiling_paise, spent_paise, period_start)

notifications(id, user_id, channel, template, payload jsonb, status, cost_paise, sent_at)
public_profiles(slug pk, enrollment_id, visibility, published_at)
orders(id, user_id, cohort_id, amount_paise, provider, provider_order_id, status)
link_health_checks(id, resource_id, checked_at, status_code, ok)
audit_log(id, actor_id, action, entity, entity_id, diff jsonb, created_at)
```

### RLS — non-negotiable, enabled on every table
```sql
alter table submissions enable row level security;

create policy "own submissions"
  on submissions for all
  using (
    enrollment_id in (
      select id from enrollments where user_id = (select auth.uid())
    )
  );

-- peer reviewers see the artifact, never the author's identity
create policy "assigned peer review"
  on submissions for select
  using (
    id in (
      select submission_id from peer_reviews
      where reviewer_enrollment_id in (
        select id from enrollments where user_id = (select auth.uid())
      )
    )
  );

-- TPOs see aggregates for their college only
create policy "tpo college scope"
  on readiness_scores for select
  using (
    enrollment_id in (
      select e.id from enrollments e
      join profiles p on p.id = e.user_id
      where p.college_id = (select college_id from staff where user_id = (select auth.uid()))
    )
  );
```
> Use `(select auth.uid())` rather than bare `auth.uid()` — Postgres caches the subquery per statement instead of re-evaluating per row. On a 600-student batch this is the difference between fast and unusable.

---

## 4. The grading pipeline

This is the only place AI touches the product, and it is strictly bounded.

```
Student submits
      │
      ▼
submissions row created  ──►  pgmq.send('grading_queue', {submission_id})
      │                                    │
      │                                    ▼
      │                        Edge Function: grade-submission
      │                                    │
      │                        ┌───────────┴────────────┐
      │                        ▼                        ▼
      │              DETERMINISTIC first          AI only if needed
      │              (SQL exec, link 200,         (prose rubric scoring)
      │               file present, schema)        1 call. Capped tokens.
      │                        │                        │
      │                        │                   writes ai_usage row
      │                        │                   checks budget_guard
      │                        └───────────┬────────────┘
      │                                    ▼
      │                              gradings row
      │                                    │
      ▼                                    ▼
peer_reviews assigned (2)  ────►  compute-readiness (pg_cron, nightly)
                                           │
                                           ▼
                                  readiness_scores
```

**Deterministic-first is the cost rule.** Weeks 1–2 are SQL — run the query, diff against expected output, score it. Zero LLM cost. Only prose (explanations, memos, interview transcripts) hits a model.

**Budget guard.** Before any AI call: `select spent_paise < ceiling_paise from budget_guards where scope='cohort'`. If false, queue the submission for manual review and alert ops. You will never get a surprise bill.

**Model routing.** Cheap model for extraction and structure checks; mid-tier reasoning model only for rubric judgement. Never a frontier model — the marginal quality gain on a 5-criterion rubric does not justify 10× cost.

---

## 5. Key config files

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "!.next/cache/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] },
    "db:types": { "cache": false }
  }
}
```

### `apps/web/next.config.ts` — with Serwist
```ts
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  transpilePackages: ["@jintu/ui", "@jintu/grading", "@jintu/contracts"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  experimental: { typedRoutes: true },
};

export default withSerwist(nextConfig);
```

### `apps/web/src/sw.ts`
```ts
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}
declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [{ url: "/~offline", matcher: ({ request }) => request.destination === "document" }],
  },
});

serwist.addEventListeners();
```

Add to `apps/web/tsconfig.json`:
```json
{ "compilerOptions": { "lib": ["dom", "dom.iterable", "esnext", "webworker"], "types": ["@serwist/next/typings"] } }
```

### `apps/web/src/app/manifest.ts`
```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jintu — Placement Sprints",
    short_name: "Jintu",
    description: "Six weeks. Six artifacts. One proof-of-readiness profile.",
    start_url: "/dashboard",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0b1120",
    lang: "en-IN",
    icons: [
      { src: "/icons/192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
```

### `apps/web/src/lib/supabase/server.ts`
```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@jintu/db";

export async function createClient() {
  const cookieStore = await cookies(); // async in Next 15+

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // called from a Server Component — middleware refreshes the session
          }
        },
      },
    }
  );
}
```

### `.env.example`
```bash
# Supabase (project region: ap-south-1)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server + edge functions ONLY. Never NEXT_PUBLIC_

# AI
LLM_API_KEY=
LLM_MODEL_CHEAP=
LLM_MODEL_REASONING=
AI_COHORT_CEILING_PAISE=15000       # hard budget guard per cohort

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# WhatsApp (BSP)
WA_PROVIDER=aisensy
WA_API_KEY=
WA_TEMPLATE_NUDGE=
WA_TEMPLATE_DEADLINE=

# YouTube (metadata only — never transcripts)
YOUTUBE_API_KEY=

RESEND_API_KEY=
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_SITE_URL=https://jintu.in
```

---

## 6. Phased build plan

Each phase has a **ship gate**. Do not start the next phase until the gate passes.

---

### Phase 0 — Repo + concierge (Weeks 1–3)
**Business goal: prove 20 people pay and finish. Almost no product code.**

The cohort runs on Notion + WhatsApp + Google Forms. You grade by hand. The repo exists only to hold a landing page and to start the schema.

**Build**
- [x] `pnpm dlx create-turbo@latest`, pnpm workspaces, Turborepo
- [x] `apps/web` on Next 16 + TS strict + Tailwind v4 (shadcn dropped — hand-rolled components under the design rules)
- [x] `packages/config` — shared eslint/tsconfig/tailwind preset
- [x] Supabase project in **ap-south-1**; migrations applied by SQL-editor paste (CLI link pending — needs the access token)
- [x] Landing page + waitlist (phone capture, per-purpose consents, 18+ gate); homepage is now the track router
- [x] `docs/LEGAL.md` written before any marketing copy exists; /terms, /refunds, /contact shipped
- [x] Sentry + PostHog wired (consent-gated; keys not yet set in prod)
- [x] GitHub Actions: lint, typecheck, build, and eleven database guards on PR

**Do by hand, not in code:** curriculum, cohort ops, grading, nudges, payments (UPI QR + manual reconciliation)

**Ship gate:** ≥10 of 20 pay ₹499. ≥8 still submitting in week 4. If not, the role or audience is wrong — fix that, not the code.

---

### Phase 1 — Core sprint engine (Weeks 4–7)
**Business goal: run cohort 2 (50 students at ₹999) without you in the loop.**

**Build**
- [x] Full schema + RLS on every table + generated types
- [x] Auth: EMAIL OTP (not phone — DLT-free) + optional password; 18+ confirmation and `consents` at onboarding
- [x] Path viewer: 6 weeks, modules, resources, YouTube IFrame embeds
- [x] **Public free path** at `/learn/[track]` — the curriculum is free, indexable, and is your top-of-funnel
- [x] Submission flow (link paste; detectable checklists; file upload wired to Storage)
- [x] Deterministic SQL grader (PGlite read-only sandbox, not a container) — zero AI cost
- [x] Peer review queue: 2 per student per week, author anonymised
- [x] Public profile page `/p/[slug]`; OG images site-wide
- [ ] Razorpay UPI checkout — BLOCKED on business inputs: onboarding not started; needs registered address (see /contact), PAN, bank account. Enrolment reserves seats; payment is concierge UPI meanwhile
- [x] **PWA: Serwist, manifest, offline fallback**
- [x] `ai_usage` + `budget_guards` tables live — and no AI call exists yet, so the order held

**Ship gate:** 50 paid enrollments. Completion ≥50%. Measured COGS/student <₹150. Lighthouse PWA installable on a mid-range Android.

---

### Phase 2 — Automation & AI grading (Weeks 6–9, overlaps Phase 1)
**Business goal: remove the human from the weekly loop.**

**Build**
- [x] `packages/grading` extracted as runtime-pure TS (zero runtime deps)
- [ ] Supabase Queue (pgmq) `grading_queue` + `grade-submission` edge function
- [x] AI rubric scorer: capped tokens, strict JSON verdict (refused whole on any deviation), cost logged per call in `ai_usage`
- [x] Budget guard enforcement — reserve-before-spend against `budget_guards`, degrade to needs_review, fail-closed when unconfigured (`pnpm ai:verify`)
- [ ] WhatsApp adapter (`packages/notify`) + `send-nudges` on pg_cron
  - deadline T-24h · missed-submission · peer-review-pending · weekly streak
- [ ] `check-link-health` cron → flags dead resources for human fix (not AI auto-repair)
- [x] `compute-readiness` — runs after every grade and review rather than nightly
- [ ] Admin console: cohort ops, cost dashboard, manual grade override

**Ship gate:** <10% of submissions need human intervention. AI cost/student <₹40. Peer review participation ≥50%.

---

### Phase 3 — TPO dashboard & B2B (Weeks 8–12)
**Business goal: 2 paid college pilots.**

**Build**
- [ ] `colleges` + `staff` tables, TPO role, college-scoped RLS
- [ ] Bulk enrollment (CSV upload, batch invite via WhatsApp)
- [ ] `(tpo)` route group: batch readiness distribution, at-risk list, week-by-week completion
- [ ] **Free readiness audit** flow — the sales tool: upload a batch, get a readiness report
- [ ] Exportable batch report (PDF) for the Principal/management
- [ ] `outcomes` capture: TPO marks interview calls and offers
- [ ] Invoicing + GST fields on orders

**Ship gate:** 2 colleges paying. ≥1 TPO logs in weekly unprompted. Outcome data flowing for ≥100 students.

---

### Phase 4 — The moat (Month 4+)
**Business goal: data that no prompt can replicate.**

- [ ] Second and third track
- [ ] Outcome correlation analysis: which rubric criteria predict interview calls
- [ ] Readiness score v2, weighted by measured outcome correlation
- [ ] Path v2 generation *informed by outcome data*, not by asking a model for an ordering
- [ ] Mentor marketplace (only once demand is proven)
- [ ] DPDP: Consent Manager integration (registration opens ~Nov 2026; full compliance due 13 May 2027)
- [ ] SOC 2 readiness if enterprise/university deals appear

---

## 7. Compliance checklist — wire into CI

Add these as lint rules or PR-template checks. They are cheaper than a lawyer.

- [ ] `resources` table has no `transcript`, `summary`, `full_text`, or `content` column
- [ ] No TTS dependency in any `package.json`
- [ ] No EPUB/PDF-bundling of third-party content
- [ ] YouTube rendered only via `<iframe src="https://www.youtube-nocookie.com/embed/...">`
- [ ] Video access is never gated behind a quiz — gate the *next module* instead
- [ ] Signup blocks under-18 and records `is_adult_confirmed`
- [ ] Privacy notice is standalone and itemised, separate from ToS, with a version string
- [ ] Consent is granular per purpose — no bundled "I agree"
- [ ] No marketing string anywhere contains "guaranteed", "100% placement", or "job assured"
- [ ] Any published success statistic maps to `outcomes.source = 'document_verified'` with consent on file
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never appears in a `NEXT_PUBLIC_` var
- [ ] RLS enabled on every table (test asserts this)

---

## 8. Bootstrap commands

```bash
# 1. Monorepo
pnpm dlx create-turbo@latest jintu --package-manager pnpm
cd jintu

# 2. Web app
pnpm dlx create-next-app@latest apps/web \
  --typescript --tailwind --app --src-dir --import-alias "@/*" --turbopack

# 3. Core deps
cd apps/web
pnpm add @supabase/supabase-js @supabase/ssr zod next-safe-action
pnpm add @serwist/next serwist -D
pnpm add @sentry/nextjs posthog-js
pnpm dlx shadcn@latest init

# 4. Supabase (choose ap-south-1 in the dashboard first)
cd ../..
pnpm add -D supabase
pnpm supabase init
pnpm supabase link --project-ref <ref>
pnpm supabase migration new init_schema
pnpm supabase db push
pnpm supabase gen types typescript --linked > packages/db/src/types.ts

# 5. Enable extensions (in a migration)
#   create extension if not exists pg_cron;
#   create extension if not exists pgmq;
#   create extension if not exists pg_net;
```

**`package.json` scripts (root)**
```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "db:new": "supabase migration new",
    "db:push": "supabase db push",
    "db:types": "supabase gen types typescript --linked > packages/db/src/types.ts",
    "fn:deploy": "supabase functions deploy"
  }
}
```

---

## 9. Things I could not verify — check before relying on them

- **Current WhatsApp Business API conversation pricing for India** (utility vs marketing category). This materially affects COGS/student. Get live rates from Meta or your BSP before committing to notification volume.
- **`@supabase/server`** shipped in 2026 as an SSR-auth simplification but the team described it as early-stage and was soliciting tester feedback. Stay on `@supabase/ssr` until it stabilises.
- **Exact LLM API pricing** at build time — moving monthly. Re-verify and set `AI_COHORT_CEILING_PAISE` from measured numbers, not estimates.
- **Tailwind v4 + shadcn/ui compatibility** for the specific components you pick — check the shadcn docs at scaffold time.
- **Razorpay's current UPI intent flow and MDR** for one-time sub-₹1,000 collections.

---

## 10. First ten commits

```
1.  chore: init turborepo + pnpm workspaces
2.  chore(config): shared eslint, tsconfig, tailwind preset
3.  feat(web): next 16 app router scaffold + tailwind v4 + shadcn
4.  feat(db): supabase init, ap-south-1, first migration (profiles, consents, colleges)
5.  feat(web): phone OTP auth + 18+ gate + granular consent capture
6.  docs: LEGAL.md — youtube ToS, DPDP, CCPA advertising rules
7.  feat(web): PWA via serwist + typed manifest + offline route
8.  feat(db): curriculum schema (tracks, paths, modules, resources) + RLS
9.  feat(web): public free path viewer at /learn/[track]
10. ci: github actions — lint, typecheck, build, rls-enabled assertion
```

---

**The discipline that matters:** Phase 0 has almost no code on purpose. The temptation will be to skip it and start building the schema properly, because that feels like progress. It isn't. Twenty students in a WhatsApp group with a Notion page will teach you more about what to build in three weeks than three months of architecture will. The repo above is what you build *after* those twenty people prove they'll pay and finish.
