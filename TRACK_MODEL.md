# Jintu — Canonical Track Model
### One reference curriculum, specified so the backend generalizes to anything

> **What this document is:** a single track defined completely enough to build the backend around, plus proof that the same shape holds for guitar and Amazon Ads without new code.
>
> **The claim being made:** adding a subject to Jintu should be inserting rows, never writing a grader.

---

## Part 1 — The insight this is all built on

Content does not generalize. Verification does.

"Learn anything" fails economically the moment you assume every subject needs its own grading logic. It succeeds the moment you notice there are only six ways to check whether a human actually did something, and every subject on earth is a mix of them.

Guitar and SQL look nothing alike as content. As verification problems they are nearly identical: a thing was produced, its *form* can be machine-checked for free, and its *quality* needs a human or a rubric.

So: **the track is data. The verifier is code. There are six verifiers, forever.**

---

## Part 2 — The six verification archetypes

Every artifact in every track on Jintu resolves to one or more of these. This list is closed. If a new subject seems to need a seventh, it almost certainly needs a better artifact instead.

| # | Archetype | How it works | Ground truth? | Cost | Example |
|---|---|---|---|---|---|
| 1 | `executable` | Run it, diff against expected output | Yes | **₹0** | SQL query, Python function, spreadsheet formula |
| 2 | `detectable` | Compare against a private answer key | Yes | **₹0** | Find 8 of 10 planted data defects; spot 5 of 7 misconfigurations in an ad account |
| 3 | `structural` | Check form and completeness, not quality | Yes | **₹0** | Recording is 2–5 min and has audio; campaign has ≥3 ad groups and negative keywords; memo has 5 required sections |
| 4 | `rubric_ai` | Model scores prose or transcript against named criteria | No | ~₹4 | Findings memo, verbal defense, written critique |
| 5 | `peer` | 2 classmates score against a fixed rubric | No | **₹0 to you** | Dashboard legibility, guitar tone, pitch delivery |
| 6 | `mentor_sample` | Human spot-checks a random 10–20% | No | Your time | Quality control on 4 and 5 |

### The economics rule that follows

**A track can only be sold as a paid cohort if ≥50% of its artifact points come from archetypes 1–3.**

That's not a philosophy, it's the margin. Data Analyst hits 44% deterministic by points (18 of 41) plus heavy peer weight — it works. Guitar hits ~25% deterministic and leans on peer review — it works as a *free community track* but not as a paid sprint, because you cannot honestly charge for a credential that rests entirely on strangers' opinions.

This single rule is what lets you say yes to every topic without going broke.

---

## Part 3 — Three track tiers

The platform accepts anything. What differs is what happens after.

| Tier | Who makes it | Verification | Price | Credential | Volume |
|---|---|---|---|---|---|
| `sprint` | Jintu | ≥50% deterministic, AI rubric, peer, mentor sample | ₹999 | Full verified profile | ~5 tracks |
| `community` | Any user | `structural` + `peer` only. No AI calls, ever | Free | "Community-verified" badge, visually distinct | Hundreds |
| `draft` | Generated once, cached by topic | None | Free | None | Unlimited |

**Why `community` costs you nothing.** Structural checks are code you already wrote. Peer review is labour the learners supply. A guitar track with 400 people in it consumes zero API budget. That's how "learn anything" becomes affordable rather than fatal.

**Why `draft` exists.** Someone types "Amazon PPC for handmade soap." No track exists. Generate one outline, cache it by normalized topic key forever, show a vote counter. Ten thousand people typing the same thing cost one API call total.

**The promotion path:** `draft` → (100 votes) → `community` → (someone designs deterministic checks) → `sprint`. Tier is a column, not a rewrite.

---

## Part 4 — The canonical track definition

This is the schema the backend implements. Data Analyst is the reference instance.

```jsonc
{
  "slug": "data-analyst-fresher",
  "title": "Data Analyst — first job",
  "tier": "sprint",
  "domain": "data",
  "locale": "en-IN",
  "version": 1,
  "duration_weeks": 6,

  "verification_profile": {
    "executable": 11,
    "detectable": 7,
    "structural": 3,
    "rubric_ai": 12,
    "peer": 8,
    "deterministic_share": 0.51
  },

  "points": {
    "proof_total": 41,
    "completion_threshold": 24,
    "consistency_per_rep": 10,
    "consistency_per_peer_review": 5
  },

  "weeks": [
    {
      "week_no": 1,
      "title": "SQL that answers a question",
      "objective": "Write joins and aggregates against a real schema without reaching for a tutorial.",
      "est_minutes": 480,

      "resources": [
        { "kind": "dataset", "title": "Pagila sample database",
          "url": "https://github.com/devrimgunduz/pagila",
          "source": "github.com", "required": true },
        { "kind": "docs", "title": "PostgreSQL tutorial — joins",
          "url": "https://www.postgresql.org/docs/current/tutorial-join.html",
          "source": "postgresql.org", "required": true },
        { "kind": "practice", "title": "PostgreSQL Exercises — basic and joins",
          "url": "https://pgexercises.com", "source": "pgexercises.com", "required": true },
        { "kind": "video", "title": "Postgres + Pagila setup",
          "provider": "youtube", "youtube_video_id": "TODO_VERIFY",
          "duration_sec": 900, "required": true }
      ],

      "daily_reps": [
        { "day": 1, "prompt": "Complete 3 pgexercises questions. Paste your queries.",
          "verification": "executable", "points": 10 },
        { "day": 2, "prompt": "Complete 3 more. Paste your queries.",
          "verification": "executable", "points": 10 },
        { "day": 3, "prompt": "Write one query you could not have written last week.",
          "verification": "structural", "checks": ["non_empty", "contains_join"], "points": 10 }
      ],

      "artifacts": [
        {
          "id": "1.1",
          "kind": "sql_file",
          "prompt": "Return the ten customers with the highest lifetime rental revenue.",
          "verification": "executable",
          "expected_result_ref": "keys/da-v1/1.1.json",
          "compare": "unordered_rows",
          "rubric_id": "sql-correctness-v1",
          "points": 5
        }
      ]
    }
    // weeks 2-6 follow the same shape; full content in curriculum-data-analyst-fresher.md
  ],

  "rubrics": [
    {
      "id": "sql-correctness-v1",
      "total": 5,
      "criteria": [
        { "name": "Query 1.1 returns the expected result set", "weight": 2,
          "check": "executable", "checker": "sql_diff" },
        { "name": "Query 1.2 returns the expected result set", "weight": 1,
          "check": "executable", "checker": "sql_diff" },
        { "name": "No accidental cross join", "weight": 1,
          "check": "structural", "checker": "row_count_ceiling" },
        { "name": "Aliases and formatting a reviewer can follow", "weight": 1,
          "check": "peer", "checker": null }
      ]
    }
  ]
}
```

### The one field that matters most

`verification.checker` is a **string naming a function in a registry**, never inline logic. That registry is the entire extensibility story:

```ts
// packages/grading/registry.ts — runtime-pure, Node + Deno
export const CHECKERS = {
  sql_diff,              // executable
  code_test_suite,       // executable
  answer_key_match,      // detectable
  non_empty,             // structural
  duration_between,      // structural
  has_sections,          // structural
  url_reachable,         // structural
  media_has_audio,       // structural
  contains_join,         // structural
  row_count_ceiling,     // structural
  rubric_score,          // rubric_ai — the ONLY function that spends money
} as const;
```

Eleven checkers cover every subject. Ten of them are free. **Exactly one costs money, in one place, easy to guard.**

---

## Part 5 — Proof it generalizes

Same schema, no new code. Only the rows change.

### Guitar — `community` tier

```jsonc
{
  "slug": "guitar-first-song",
  "tier": "community",
  "duration_weeks": 6,
  "verification_profile": { "structural": 12, "peer": 24, "deterministic_share": 0.33 },
  "weeks": [{
    "week_no": 3,
    "title": "Clean chord changes at tempo",
    "daily_reps": [
      { "day": 1, "prompt": "Record 60 seconds of the G–C–D change at 70 bpm.",
        "verification": "structural",
        "checks": ["media_has_audio", "duration_between:50,90"], "points": 10 }
    ],
    "artifacts": [{
      "id": "3.1", "kind": "recording",
      "prompt": "Play the full progression at 80 bpm with a metronome audible.",
      "verification": ["structural", "peer"],
      "checks": ["media_has_audio", "duration_between:60,180"],
      "rubric_id": "guitar-timing-v1", "points": 8
    }]
  }],
  "rubrics": [{
    "id": "guitar-timing-v1", "total": 8,
    "criteria": [
      { "name": "Metronome audible throughout", "weight": 2, "check": "structural", "checker": "media_has_audio" },
      { "name": "No pause longer than one beat at a chord change", "weight": 3, "check": "peer" },
      { "name": "All six strings ring — no muted notes", "weight": 2, "check": "peer" },
      { "name": "Plays the full progression without restarting", "weight": 1, "check": "peer" }
    ]
  }]
}
```

Note what happened: **"metronome audible" is a free structural check.** The subjective part shrank to what genuinely requires an ear. That's the pattern — always push as much as possible into archetypes 1–3.

### Amazon Ads — `community` tier, promotable to `sprint`

```jsonc
{
  "slug": "amazon-ads-sponsored-products",
  "tier": "community",
  "duration_weeks": 6,
  "verification_profile": { "detectable": 14, "structural": 10, "rubric_ai": 8, "peer": 8,
                            "deterministic_share": 0.60 },
  "weeks": [{
    "week_no": 2,
    "title": "Diagnose a broken campaign",
    "artifacts": [{
      "id": "2.1", "kind": "audit_log",
      "prompt": "Here is an exported campaign report. Find everything wrong with it.",
      "verification": "detectable",
      "answer_key_ref": "keys/amz-v1/2.1.json",
      "rubric_id": "campaign-audit-v1", "points": 7
    }]
  }],
  "rubrics": [{
    "id": "campaign-audit-v1", "total": 7,
    "criteria": [
      { "name": "Planted misconfigurations found — 1 per 2, capped at 4", "weight": 4,
        "check": "detectable", "checker": "answer_key_match" },
      { "name": "No fabricated problems", "weight": 1, "check": "detectable", "checker": "answer_key_match" },
      { "name": "Each fix names the metric it should move", "weight": 2, "check": "rubric_ai" }
    ]
  }]
}
```

**Amazon Ads scores 60% deterministic — higher than Data Analyst.** Because you can plant defects in an exported ad report exactly like you plant them in a CSV: missing negative keywords, a broken match-type mix, budget capped below the bid, one ad group with 400 keywords. This is a *stronger* paid sprint candidate than guitar will ever be. The archetype model tells you that before you build anything.

---

## Part 6 — The points system

### Two ledgers, never convertible

```sql
point_events(
  id uuid pk,
  user_id uuid references profiles,
  ledger text not null,          -- 'consistency' | 'proof'  -- CHECK constrained
  source_type text not null,     -- 'daily_rep' | 'artifact' | 'peer_review'
  source_id uuid not null,
  points int not null,
  awarded_at timestamptz default now(),
  voided_at timestamptz null,    -- for retroactive peer-review invalidation
  unique(user_id, source_type, source_id)
);

streaks(
  user_id uuid pk references profiles,
  current_days int default 0,
  longest_days int default 0,
  last_active_date date,
  freezes_remaining int default 2
);
```

**`readiness_score` reads only from `ledger = 'proof'`.** Enforce it in the view definition, not in application code, so no future feature can quietly break it.

### What each ledger buys

| | Consistency | Proof |
|---|---|---|
| Earned from | Daily reps, completed peer reviews | Graded artifacts only |
| Cost to grade | ₹0 | ₹0–6 |
| Visible on public profile | Yes, as `"41-day streak"` | Yes, as scores and artifacts |
| Feeds readiness score | **Never** | Yes |
| Can be spent | Discount on next sprint, mentor slot, leaderboard | Nothing — it isn't currency |

A streak on the profile is honest and recruiters genuinely read it. What it must never do is add a single point to the score that claims you can do the work.

### Streak freezes — a specifically Indian design detail

Two freezes per sprint, auto-applied. Power cuts, exam weeks, festivals, and a sibling's wedding are not motivation failures, and a streak that snaps on day 19 for reasons outside the student's control converts a motivated learner into a churned one. This is a small feature with a large retention effect.

### Anti-gaming rules — implement all four

1. **Daily consistency cap.** Maximum 30 points per calendar day. Grinding twelve reps on Sunday does not buy a week.
2. **Reps are day-stamped, not backfillable.** A rep submitted Thursday cannot claim Tuesday.
3. **Peer reviews are quality-gated retroactively.** If a mentor sample finds a review was low-effort, set `voided_at` on its point event. Students learn this happens.
4. **Proof points require the peer reviews to be done.** Ship an artifact but review nobody, and your score stays locked. This is what makes peer review actually happen, and peer review is what makes `community` tier free.

---

## Part 7 — Schema additions

On top of the tables in `ARCHITECTURE.md`:

```sql
tracks         add tier text not null default 'draft'
                     check (tier in ('sprint','community','draft'));
tracks         add verification_profile jsonb;
tracks         add author_id uuid null references profiles;  -- community tracks
tracks         add deterministic_share numeric generated;

assignments    add verification text[] not null;   -- ['structural','peer']
assignments    add checks text[];                  -- ['media_has_audio','duration_between:60,180']
assignments    add answer_key_ref text null;       -- private storage path, never public

daily_reps(id, week_id, day_no, prompt, verification, checks text[], points int)
rep_submissions(id, enrollment_id, daily_rep_id, payload jsonb, submitted_on date,
                status, unique(enrollment_id, daily_rep_id))

point_events   -- above
streaks        -- above

topic_queries(id, raw_query, normalized_key, route, user_id null, created_at)
topic_votes(id, normalized_key, user_id, unique(normalized_key, user_id))
draft_outlines(normalized_key pk, outline jsonb, model, cost_paise, generated_at)
```

**Two hard constraints to write as DB-level checks, not app logic:**

```sql
-- Answer keys must never be publicly readable
alter table assignments enable row level security;
-- (no select policy exposes answer_key_ref to non-staff)

-- A paid sprint must clear the economics bar
alter table tracks add constraint sprint_needs_deterministic
  check (tier <> 'sprint' or deterministic_share >= 0.50);
```

That second constraint is your margin, expressed as a database check. It will stop a future you from launching a paid guitar cohort at 2am.

---

## Part 8 — Build order

| Phase | Build | Why now |
|---|---|---|
| 1 | Track JSON loader, `structural` + `executable` checkers, artifacts, one sprint | The paid product. Zero AI. |
| 1 | `daily_reps` + consistency ledger + streaks | Habit loop is what drives completion, and it's free |
| 2 | `detectable` checker + answer-key storage | Unlocks the strongest weeks in every track |
| 2 | `rubric_ai` with budget guard, `peer` queue | First and only spend |
| 3 | `community` tier + user-authored tracks | "Learn anything" goes live, still at ₹0 |
| 3 | `draft` tier + topic routing + votes | Demand capture, tells you track #2 |
| 4 | `mentor_sample` + retroactive voiding | Quality control once volume justifies it |

Note that `community` — the whole "learn anything" promise — arrives in Phase 3 and costs nothing to run. It was never the expensive part. **Per-user AI generation was the expensive part, and it isn't in this design at all.**

---

## Part 9 — The four rules that keep this honest

1. **A track is data. A verifier is code. Eleven checkers, forever.** If a subject seems to need a twelfth, redesign the artifact.
2. **Consistency never becomes proof.** Enforced in the view, not the app.
3. **No paid cohort below 50% deterministic verification.** Enforced as a DB constraint.
4. **Community tracks never call a model.** Structural plus peer only. This is what makes unlimited breadth affordable.

---

## Part 10 — Caveats

- `deterministic_share` should be computed from artifact points, not artifact counts. Counting artifacts lets a 1-point structural check offset an 8-point AI-rubric artifact.
- The `contains_join` style checkers are crude string matching and are gameable. This is acceptable: a student who games "must contain a join" has still written a join. Never use crude checkers for anything carrying more than 1 point.
- Peer review quality degrades as cohort size grows past roughly 60. Budget for mentor sampling before you scale a single cohort beyond that.
- The `answer_key_ref` files are the most valuable and most leakable asset in the system. Rotate planted defects every cohort, and assume any key older than three cohorts is public.
