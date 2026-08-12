# Authoring a track — the full structure

How to write a curriculum that the platform can actually verify. Copy
`docs/tracks/_template.mjs`, fill it in, run two commands, paste one file.
Everything below explains what each field means, what the database will
refuse, and what makes the difference between a thin track and one worth
a learner's six weeks.

---

## 1. The shape of a track

```
track                     one job you prepare someone for
├─ slug, title, summary   the /learn card and the page header
├─ tier                   'sprint' (machine-verified) | 'community' (structural+peer)
└─ version N (path)       published atomically; old versions never edited
   └─ week 1..6           one module per week
      ├─ title            what the week is called
      ├─ objective        what they CAN DO afterwards — one sentence, testable
      ├─ resources[]      links only — we never store third-party content
      ├─ reps[]           daily 10–20 min prompts, machine-checked, consistency points
      └─ artifact         ONE per week: the thing they submit
         ├─ kind          'sql' | 'artifact_link' | 'file' | 'recording'
         ├─ prompt        scenario-first (see §5)
         ├─ rubric        criteria with weights — THE contract with the learner
         │  └─ criterion  { key, label, weight, check, checker }
         └─ answer key    for sql/detectable — service-role only, never public
```

Where each piece renders: slug/title/summary → `/learn` card and OG image;
objective → the brand-washed callout at the top of each week; resources →
the week body; the rubric → the mission card with per-criterion archetype
tags and `+N` points; reps → "N daily reps this week" and the dashboard
habit board; the verification mix meters on the rail are **computed from
your criterion weights** — you don't write them, you earn them.

## 2. The rules that will refuse your work

These are database triggers and CI guards, not conventions. The generator
checks them first so you hear it from a sentence instead of a stack trace.

| Rule | Refused by |
|---|---|
| Rubric weights must sum exactly to `max_score` | generator + DB |
| Every criterion needs `key`, `label`, `weight > 0` — zero-weight promises count for nothing | DB trigger |
| `check` must be one of: `executable` `detectable` `structural` `rubric_ai` `peer` `mentor_sample` | DB trigger |
| `peer`/`mentor_sample` criteria carry `checker: null`; machine criteria must name an implemented checker | generator + DB |
| **Community tier: `structural` + `peer` ONLY.** No executable, no detectable, never `rubric_ai` | DB — three triggers |
| **Sprint tier: ≥ 50% of POINTS machine-checked** (executable+detectable+structural). Points, not criteria count | `canPublishAsVerified` |
| Every `sql` artifact needs an answer key (fixture + expected rows) | generator + publish check |
| Reps are free archetypes only (`executable`/`structural`) — never AI, never peer | DB CHECK |
| Rep points: 1–30 each; a learner caps at 30 consistency points/day regardless | DB CHECK + trigger |
| A published version is frozen. Fix content by shipping version N+1 | DB trigger |
| No week without resources; no artifact without a rubric | publish completeness check |

The 50% trap, worked: five 1-point structural checks + one 8-point
AI/peer criterion = 5 of 6 criteria machine-checked but **only 38% of
points**. Count points, not rows.

## 3. The points economy

- **Artifact points = rubric `max_score`.** DA weeks pay 5–8. Keep a
  6-week track in the 35–50 total range; the number shows on the rail.
- **Reps pay 10 by default** (1–30 allowed). Three reps/day hits the
  30/day consistency cap — that's the intended ceiling, not a bug.
- Consistency (reps) and proof (artifacts) are **separate ledgers,
  forever**. Reps never touch readiness. Don't design as if they do.
- Every point records the archetype that checked it — the public profile
  shows "how these points were checked". Peer-heavy rubrics produce
  peer-heavy profiles; that is visible and intentional.

## 4. Checker catalog — what you can actually verify

| Checker | Archetype | Input it reads | Needs a key? | Use for |
|---|---|---|---|---|
| `sql_diff` | executable | the learner's SQL, run against your fixture | **yes**: `setup` DDL+data, `expected` rows | any query with one right answer |
| `numeric_cells` | executable | parsed spreadsheet cells | yes: expected cells | sheet work, to stated precision |
| `formula_present` | executable | cell formulas | no (names cells in args) | "computed, not pasted" |
| `consistent_with` | executable | this figure vs their earlier one | no | cross-week coherence |
| `answer_key_match` | detectable | findings vs planted defects | **yes**: ops-held defect key | audit artifacts — the crown jewel |
| `non_empty` | structural | text | no | the floor under prose |
| `has_sections` | structural | text headings (args: names) | no | memo/report structure |
| `duration_between` | structural | measured seconds (args: min,max) | no | recordings |
| `media_has_audio` | structural | probe facts | no | "not a silent screencast" |
| `url_reachable` | structural | the submitted link | no | deployed/public artifacts |
| `contains_pattern` | structural | text (args: words, ANY matches) | no | **max 1 point — gameable by design** |
| `row_count_ceiling` | structural | result rows (args: max) | no | catches runaway joins |
| `rubric_score` | rubric_ai | prose, via the model | no | **the only paid one** — sprint only, sparingly |

Checker spec format everywhere: `"name:arg1,arg2"` — e.g.
`duration_between:120,300`, `has_sections:Findings,Method,Caveats`.

**Detectable artifacts** (planted-defect audits) are the most defensible
thing you can author — the key is not on the internet. Workflow: write
the artifact with `codes` (the checklist the learner sees, planted +
decoys shuffled); generate the dataset with
`pnpm defects:dataset --seed <secret> --label <name>` (the seed is the
secret, keep it out of the repo); upload the CSV wherever learners fetch
it; paste the emitted key SQL. A fabricated finding cancels a real one —
the form already warns them.

## 5. The quality bar — what "not thin" means

**Objectives are abilities, not topics.** ❌ "Learn GROUP BY."
✅ "Turn 40,000 rows into one number per region a board can read."

**Prompts are scenarios.** The Career Trail register works: someone real
wants something real by when, and the learner is on the hook.
❌ "Write a query that groups revenue by region."
✅ "The board deck is due tomorrow and the CEO wants revenue by region —
a summary, not a customer list. Write the query that produces it."
A strong prompt has: the person asking · the stakes · the deliverable ·
what "done" looks like (the rubric says the rest).

**Criterion labels are promises a stranger can check.**
❌ "Good analysis" (weight 5). ✅ "Every number in the memo is traceable
to a query" (weight 2, peer) + "Returns the expected result set"
(weight 3, executable).

**Resources are curated, not dumped.** 2–4 per week, each one earning
its place; titles in OUR words; YouTube only via the official embed
(store the video id); everything else an https URL you have opened this
month. We store links and metadata — never transcripts, summaries, or
full text. That line is legal, not stylistic.

**Reps are one small checked thing.** 10–20 minutes, one concept, a
check the registry can run: `"Write a query joining X to Y"` +
`contains_join` + `non_empty`. Reps are where the streak lives — make
day 3 as doable as day 1.

**Feedback never names the miss.** Checkers tell the learner what's
wrong in what THEY produced, never what they failed to produce — a
message listing missed defects is the answer sheet with extra steps.
Your rubric labels are public; your keys never are.

## 6. The workflow

```
cp docs/tracks/_template.mjs docs/tracks/my-track.mjs   # specs are gitignored — keys live in them
$EDITOR docs/tracks/my-track.mjs
pnpm track:gen docs/tracks/my-track.mjs                  # validate + emit SQL to supabase/.bundle/
pnpm track:verify docs/tracks/my-track.mjs               # applies it TWICE in real Postgres, asserts everything
# paste supabase/.bundle/track-<slug>-v<N>.sql into the Supabase SQL editor
```

The generator refuses with a teaching sentence when a rule breaks. The
verifier proves: it publishes, every week has resources, every artifact
has a rubric and (where required) a key, anon cannot read the keys,
re-running is a no-op, and prior published versions are untouched.

**Versioning:** the first paste is version 1. To improve a live track,
bump `version` and paste again — the site switches atomically to the
highest published version; students mid-track keep the version they
started. Never edit a published version; the database will refuse anyway.
