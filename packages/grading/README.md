# @jintu/grading

The verification engine. Twelve checkers — eleven free, one paid.

---

## The one architectural rule

**Comparison is pure. Execution is not.**

`sqlDiff` does not run SQL. It diffs two result sets someone else produced. Same for media: `durationBetween` reads a probe result, it doesn't shell out to ffprobe.

This is what lets the package run unchanged in Node (Next server actions) and Deno (Supabase Edge Functions) with zero dependencies. No `node:` imports, no `fs`, no `process`. `fetch` only, which is global in both.

Anything impure is an **adapter** that runs first and puts plain data on `submission.facts`:

| Adapter | Produces | Needs |
|---|---|---|
| SQL runner | `facts.sqlResults[queryId]` | read-only Postgres session, pristine dataset, statement timeout |
| Media probe | `facts.mediaProbe` | ffprobe |
| HTTP probe | `facts.httpProbe` | network (or let `urlReachable` fetch itself) |
| Sheet parser | `facts.parsedCells`, `facts.cellFormulas` | xlsx reader |
| Table parser | `facts.parsedTable` | markdown/CSV parse |
| Prior work | `facts.priorSubmissions` | DB read of the learner's earlier units |

---

## The registry

```ts
import { CHECKERS, grade, canPublishAsVerified } from '@jintu/grading';
```

| Checker | Archetype | Cost | What it does |
|---|---|---|---|
| `sql_diff` | executable | ₹0 | Diffs a result set against a private key |
| `numeric_cells` | executable | ₹0 | Every cell matches to stated precision |
| `formula_present` | executable | ₹0 | Cells hold formulas, not pasted constants |
| `consistent_with` | executable | ₹0 | This unit's figure agrees with an earlier one |
| `answer_key_match` | detectable | ₹0 | Planted-defect matching, with decoy penalty |
| `non_empty` | structural | ₹0 | Word minimum, not character minimum |
| `has_sections` | structural | ₹0 | Required sections present |
| `duration_between` | structural | ₹0 | Recording inside a time window |
| `media_has_audio` | structural | ₹0 | Audio track present *and not silent* |
| `url_reachable` | structural | ₹0 | Public link, no login wall |
| `contains_pattern` | structural | ₹0 | A construct is present (gameable — max 1 point) |
| `row_count_ceiling` | structural | ₹0 | Catches runaway joins |
| **`rubric_score`** | **rubric_ai** | **~₹4** | **The only paid checker** |

Adding a subject means inserting rows. If a track seems to need a thirteenth checker, the artifact needs redesigning.

---

## Three decisions worth knowing about

### 1. The row count is the fingerprint

A learner writes prose: *"duplicate rows, about 14 of them."* The key has a structured entry. Matching them without an LLM and without a dropdown that gives the answer away seemed impossible.

The answer: **require every finding to state its column and its row count.** The match becomes `(column, count)` — objective, cheap, unguessable. Vague prose scores nothing, not because we judged the writing, but because a finding without a count isn't a finding. Which is also true on the job.

Free-text keywords are a fallback for defects with no natural count.

### 2. No evidence quote means no points

`rubric_score` asks the model to quote the exact span that earned each point. If the quote is empty, the score is zeroed regardless of what the model claimed. This kills the most common AI-grading failure — confident generosity — and gives a human auditor something to spot-check later.

The model also cannot exceed a criterion's declared weight. We clamp and sum ourselves.

### 3. A checker that errors is never a pass, and never a silent zero

Missing answer key, thrown exception, unparseable model output, exhausted budget — all route the criterion to `pendingHuman` and set `fullyVerified: false`. A learner should never lose points to our bug, and should never gain them from one either.

---

## Platform rules, as code

```ts
canPublishAsVerified(rubrics)
```

Blocks a track from `verified` tier if under 50% of **points** are machine-checked, or if any criterion declares a checker that doesn't exist.

The points-not-criteria detail matters. Five 1-point structural checks alongside one 8-point AI-graded artifact is 5 of 6 criteria deterministic — and only **38% of points**. The test suite covers exactly this case, because it's the way a well-meaning author accidentally launches an unverifiable paid track.

```ts
grade(submission, rubric, ctx) → GradeReport
```

`GradeReport.evidencedScore` counts only executable/detectable/structural points. **That's the number for a public profile.** `score` includes AI and is for the learner's own progress.

---

## Feedback policy

Checkers name what is wrong in what the learner produced. They never print what the learner failed to produce.

- ✅ `row 3, lifetime_revenue: you have 4820.00 — that is not the expected value`
- ✅ `2 of 3 defect classes identified`
- ❌ `you're missing the row for customer 412` — hands over the key
- ❌ `the duplicate-rows defect affects customer_name` — hands over the key

Examples are capped at 3 by default (`ctx.maxExamples`). Three useful examples teach; twenty are the answer sheet.

---

## Wiring it up

```ts
// Supabase Edge Function: grade-submission
import { grade } from '../_shared/grading/grade.ts';

const report = await grade(submission, rubric, {
  loadKey: async (ref) => {            // service-role only, never client-reachable
    const { data } = await admin.storage.from('answer-keys').download(ref);
    return data ? JSON.parse(await data.text()) : null;
  },
  budgetOk: async () => {
    const { data } = await admin.from('budget_guards')
      .select('spent_paise, ceiling_paise').eq('scope_id', cohortId).single();
    return !!data && data.spent_paise < data.ceiling_paise;
  },
  callModel: callCheapReasoningModel,
  maxExamples: 3,
});

await admin.from('gradings').insert({
  submission_id: report.submissionId,
  scores: report.results,
  total: report.score,
  evidenced_total: report.evidencedScore,   // the publishable number
  cost_paise: report.costPaise,
});
if (report.pendingHuman.length) await enqueuePeerReview(report);
```

**Answer keys must never be client-reachable.** `loadKey` runs with the service role inside the edge function. There is no code path from a browser to a key, and `assignments.answer_key_ref` must be excluded from every public payload — with a test asserting it.

---

## Still to build

- **SQL runner adapter** — the real remaining work. Read-only role, statement timeout, per-user rate limit, and a pristine dataset restored per run. Untrusted SQL in a sandbox is a security job, not a feature.
- `code_test_suite` for future programming tracks
- Cross-unit `priorSubmissions` loader for `consistent_with`
- Golden-file tests per track, so a curriculum edit that breaks a key fails CI

---

## Implementation state (kept by the build, not part of the spec)

- The registry keeps `contains_join` as a legacy alias of the `contains_pattern`
  idea — DA v2 reps reference it and published rubrics are frozen. New
  authoring should use `contains_pattern`.
- `rubric_score` runs through `grade()`'s ctx (`budgetOk` + `callModel`); the
  app's existing reserve→settle spend gate (`ai_spend_reserve` et al.) is the
  production `budgetOk`/accounting implementation.
- Tests are vitest (`pnpm --filter @jintu/grading test`), matching the rest of
  the workspace rather than the spec's standalone `test/run.ts` harness.
- The PGlite sandbox in apps/web is today's SQL runner adapter; the hardened
  Postgres runner in "Still to build" replaces it for untrusted scale.
