## What & why

<!-- One paragraph. Link the ARCHITECTURE.md section or phase this advances. -->

## The three laws

Tick or strike through with a reason. A PR that violates one gets rejected —
see [ARCHITECTURE.md §0](../docs/ARCHITECTURE.md). For what each law means at a
keyboard, see [LEGAL.md](../docs/LEGAL.md).

- [ ] **Law 1 — no unbounded AI consumption.** Every LLM call is attached to a
      discrete countable event, writes an `ai_usage` row with cost in paise, and
      is gated by a `budget_guards` check. No chatbot, no streaming assistant.
- [ ] **Law 2 — no third-party content stored or transformed.** URLs and
      metadata only. No transcript, summary, full_text, or content column. No
      TTS. No bundling/export. YouTube renders only via the official
      `youtube-nocookie.com` IFrame embed.
- [ ] **Law 3 — 18+ only, granular consent.** No under-18 path. Consent is a
      row in `consents` with a purpose and a notice version, never a boolean.

## Compliance checklist (ARCHITECTURE.md §7)

Only tick what this PR actually touches.

- [ ] `resources` has no `transcript` / `summary` / `full_text` / `content` column
- [ ] Video access is not gated behind a quiz (gate the *next module* instead)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` appears in no `NEXT_PUBLIC_` var and no client bundle
- [ ] RLS is enabled on every new table, with a policy and a test asserting it
- [ ] No marketing string contains "guaranteed", "100% placement", or "job assured"
- [ ] Any published success statistic maps to `outcomes.source = 'document_verified'`

## Verification

<!-- What you actually ran, and what it printed. Not "should work". -->
