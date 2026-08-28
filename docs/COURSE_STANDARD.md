# How a Jintu course is built

The standard every roadmap is authored against, and the procedure for
producing one. Written so that a course made by following it passes
`scripts/import-roadmap.mjs`, every CI guard, and the schema, without a
second pass.

This is not a style guide with opinions in it. Nearly every rule below is
enforced somewhere — by a CHECK constraint, by the importer's validation, or
by a guard in CI — and each rule says where. A rule with no enforcement named
is a convention, and is marked as one.

**Read `CLAUDE.md` first.** The five hard invariants there are not repeated
in full here; this document says how they land in curriculum data.

---

## 0. The state of the corpus, 2026-08-22

Read this before estimating any work, because the natural assumption is
wrong.

| Field | Populated |
|---|---|
| `nodes.title`, `summary`, `learning_objectives` | 180 / 180 |
| `resources` | 228 rows across 180 nodes (1.3 per node) |
| `nodes.why_today` | **0** / 180 |
| `nodes.principle` | **0** / 180 |
| `nodes.common_mistake` | **0** / 180 |
| `nodes.challenge` | **0** / 180 |
| `node_topics` | **0** rows |
| `node_checks` | **0** rows |

The reader (`lib/blocks.ts`) builds a day out of six sections and omits any
whose field is null. With the table above, every published day renders **two
of six** — "Today", built from `learning_objectives`, and "Read & do". A live
example: `/learn/data-analyst/day-1-what-a-data-analyst-actually-does` has a
rail of two entries and a counter reading `0 of 2`.

The four specs in `docs/roadmaps/` do not carry these fields either, so this
is not a paste that fell behind. **The day-page model has never been
authored into.** Any plan that says "extract what already exists" — an
interview bank, comparison pages, concept pages, cheat sheets — is costing
work that has not been done.

---

## 1. The unit of everything is a day

A **node is a day**. One sitting, one subject, finishable on a bad evening.
That single decision drives the rest of the standard, because a day someone
cannot finish breaks a streak, and a broken streak is how people quit.

```
roadmap ── module ── node ── resource
                       ├──── node_topics
                       └──── node_checks
```

| Level | Is | Sized |
|---|---|---|
| roadmap | one subject, end to end | 2–20 modules |
| module | a several-week arc with one deliverable | 8–12 nodes — *importer fails above 12* |
| node | one day | 2–120 estimated minutes — *importer enforces* |
| resource | one third-party URL | 1–4 per node (convention) |

Nothing in the model has a deadline, a cohort, or a clock. Week ranges on a
module are **size, not schedule**.

### Pace: a roadmap has to be able to carry a streak
The streak resets on a missed day, so there has to be a day to do. Divide
days by weeks:

| Roadmap | Days/week | |
|---|---|---|
| Data analyst | 7.0 | a real daily habit |
| Git & GitHub | 6.0 | |
| Java & Spring Boot | 2.7 | streak breaks on Thursday |
| Thinking under uncertainty | 2.4 | |
| Amazon Ads | 2.1 | |

**Aim for 5–7 days a week.** The importer prints the figure on every run and
warns below 4. It warns rather than fails because three published roadmaps
would fail it, and the fix is a curriculum decision — write more days, or
state fewer weeks — not something a script should force.

---

## 2. The six sections of a day

Order is fixed. `lib/blocks.ts` renders exactly this and the sandbox suite
pins it.

| # | Section | Column | Required |
|---|---|---|---|
| 1 | Why today | `nodes.why_today` | strongly recommended |
| 2 | Today | `node_topics`, falling back to `learning_objectives` | **yes** |
| 3 | Read & do | `resources` | **yes** |
| 4 | Today's challenge | `nodes.challenge` + `challenge_minutes` | recommended |
| 5 | Check yourself | `node_checks` | **yes** — see §6 |
| 6 | The mistake almost everyone makes | `nodes.common_mistake` | recommended |

Plus `nodes.principle`: one italic line between the meta and the first
section. Not a section, not tickable, not optional in practice — it is the
day's argument in one sentence.

**Check yourself sits after the challenge and never before it.** Retrieval
practice after doing is learning; the same questions before doing are a quiz.
Do not reorder to "warm the reader up".

A section whose field is null is omitted entirely — never an empty heading.
That is why a sparse day honestly reads `2 of 4` rather than pretending to
six.

---

## 3. What a day must contain

### `title`
Plain, specific, no day number. `"Window functions — frames"`, not
`"Day 45 — Window functions"`.

*Enforced twice*: the importer fails on a `Day N` prefix, and
`nodes_title_carries_no_day_number` (migration 0014) rejects it at the
database. The number comes from `position` and every surface renders it from
there; keeping both prints it twice.

### `summary`
One sentence, ≤ 160 characters. It is the card line, the breadcrumb, and the
OG description, so it must survive being read alone.

### `learningObjectives`
Three, each starting with a verb the reader can check themselves against
("Write a query that…", not "Understand windowing"). Used as the "Today"
section only until `topics` exist; write both.

### `topics`
Three to six, each `{ title, detail }`. **Both are required** — the importer
fails on a topic with no detail, because a bare title is a table of contents
and the detail line is the teaching.

### `estMinutes`
Honest, not aspirational. Include reading time for every resource plus the
challenge. This number is on the card before anyone opens the day, and
`media_mix` is computed against it.

### `principle`
One sentence, no hedging. *"If you cannot say what one row means, you cannot
analyse the table."*

### `challenge` / `challengeMinutes`
One thing to make. 5–120 minutes, *importer-enforced*. A challenge with no
artefact at the end is a suggestion.

### `commonMistake`
The specific error a beginner makes here, and why it is tempting. Not
"be careful with joins".

---

## 4. Resources — where the invariants bite hardest

**Never store or re-host third-party content.** URL and metadata only. No
transcripts, no summaries of someone else's article, no offline bundling.
This is the line between an aggregator and an infringer and what Section 79
safe harbour rests on. *Guard: `pnpm schema:rules`.*

| Field | Rule | Enforced by |
|---|---|---|
| `url` | must be `https://` | importer + `resources.url` CHECK |
| `type` | `read` `video` `doc` `case_study` `tool` `latest` | importer + CHECK |
| `sourceName` | the publisher's own name for the property | convention |
| `editorNote` | one line, our words: **why this link and not another** | convention — but see below |
| `youtubeVideoId` | 11 chars, and `type` must be `video` | importer + CHECK |
| `estSizeMb` | **required** when a video has a duration | importer |

### The editor note is not optional in spirit
It is the only thing on a link that is ours. A resource without one is a
bookmark; with one it is curation. The homepage's "checked by a person"
section renders real notes out of the database, so an unnoted link is also a
claim the marketing page cannot make.

### `sourceName` names the publisher, not our roadmap
Migration 0018 exists because 17 resources were filed under `Amazon Ads`,
which is also half of a roadmap title, so the homepage source wall appeared
to cite ourselves. Name the property that published the page.

### Videos
Official IFrame player, `youtube-nocookie`, click-to-load, autoplay off,
branding kept, ads never blocked, playback never gated. *Guard: `pnpm
embeds`.* Users are on metered mobile data — a 20-minute video is ~150 MB and
they are told before tapping, which is why `estSizeMb` is mandatory.

### Nothing publishes unverified
`import-roadmap.mjs` without `--check` emits every resource
`needs_verification = true` and leaves the roadmap **draft**, invisible to
every client. With `--check`, every URL is fetched and every YouTube id
resolved through oEmbed; one failure fails the whole run. You can always
generate; you cannot accidentally publish. Roughly a fifth of LLM-suggested
references are fabricated, so this gate is the whole defence.

---

## 5. Roadmap-level fields

```js
{
  slug: "data-analyst",              // ^[a-z0-9]+(-[a-z0-9]+)*$
  title: "Data analyst",
  summary: "…",                      // ≤ 200 chars; the catalogue clamps to 2 lines
  subjectTags: ["data", "sql", …],   // DESCRIPTION — search and chips
  category: "data",                  // NAVIGATION — one of exactly four
  difficulty: "beginner",            // beginner | intermediate | advanced
  estimatedWeeks: 13,
  licenseNote: null,                 // set when anything was imported wholesale
  requires: [                        // optional; see below
    { slug: "git-and-github", note: "Day one clones a repository." },
  ],
  modules: [ … ],
}
```

### There is no `estimatedHours`
It is derived by `recompute_estimated_hours()` (migration 0020) from the sum
of the roadmap's own `est_minutes`, and **the importer fails on a spec that
carries one**. The four originals had it typed in and every one was out by
almost exactly 4× — 890 hours stored against 195 authored, with the larger
number on the homepage. A roadmap total that disagrees with its own days
breaks the promise the day pages make.

### `requires` — prerequisites are an edge
Each entry is a slug, or `{ slug, note }` where the note is one line shown on
the card. The paste inserts into `roadmap_prerequisites` and skips silently if
the other roadmap is not in the database yet, so build order is not
load-bearing — re-paste once it is. Cycles are refused by a trigger, and
`has_prereqs` is derived from the edges, never set by hand.

### `category` vs `subjectTags` — do not merge them
`category` is one of `data`, `software`, `marketing`, `judgement` and is a
closed set, CHECK-constrained by migration 0017. It is navigation: it drives
the catalogue rail, the homepage chips, and the card colour.

`subjectTags` is description: unbounded, per-roadmap, feeds search and card
chips. `sql`, `pandas`, `spring-boot` live here.

The catalogue used to build its Subject filter from `subjectTags[0]`, which
put "java" beside "marketing" as though they were the same kind of thing and
would have grown a filter per import. **A category is added only by amending
the CHECK, deliberately, when a fifth genuinely exists.**

### Derived — never hand-set
`media_mix` is computed by `recompute_media_mix()` from video minutes over
estimated minutes. `has_free_cert` is set when the subject has a real,
free, first-party certification (not ours — we issue nothing).
`has_prereqs` is `false` unless a maintainer genuinely means it; a facet that
matches everything is hidden by the catalogue as a no-op.

---

## 6. Questions: `node_checks` after migration 0019

One table, two audiences, and the row says which.

```js
checks: [
  { question: "…", answer: "…" },                                  // defaults
  { question: "…", answer: "…", kind: "interview",
    difficulty: "hard", askedInInterviews: true },
]
```

| Field | Values | Default |
|---|---|---|
| `kind` | `comprehension` \| `interview` | `comprehension` |
| `difficulty` | `easy` \| `medium` \| `hard` | `medium` |
| `askedInInterviews` | boolean | `false` |

**`difficulty` here is not `nodes.difficulty`.** A node is `intro`/`core`/
`stretch` — where a day sits in a curriculum. A question is `easy`/`medium`/
`hard` — how hard it is to answer. Two axes, deliberately different
vocabularies so they cannot be conflated.

**`askedInInterviews` is a claim about the world.** It means a person reports
having been asked this. Never inferred, never set in bulk. A CHECK refuses it
on a comprehension row, and the importer fails the spec before you get there.

### How many, of which
| Kind | Per day | Where it appears |
|---|---|---|
| `comprehension` | **3** (5 is the ceiling, *importer-enforced*) | the day's "Check yourself" |
| `interview` | 0–3, only where the subject warrants | `/interview`, never the day page |

Target roughly **one interview question every other day — 0.4 to 0.6 per
day** — concentrated on the days that carry the interviewable material
rather than spread evenly. On a 91-day roadmap that is 40–60; on a 12-day
one it is 5–7.

**This used to read "40–60 per roadmap" flat, and that was wrong.** Applied
to `git-and-github` it demanded three questions on every one of twelve days,
which is the opposite of "concentrated" — and it made four roadmaps look
delinquent when only their absolute count was small. Density is the measure
because it is the one that scales.

Two things the target does not mean. It is a ceiling as much as a floor: a
subject nobody interviews on should carry few, and padding to hit a number
produces questions no interviewer would ask. And where a roadmap sits below
the band because the subject genuinely has no interview surface, say so in
the spec header rather than inventing questions to close the gap.

### Writing a comprehension check
Answerable from the day, in one or two sentences, testing recall of something
that matters. Not trivia about the material's phrasing.

### Writing an interview question
Asked cold by someone who has not read the day. It should be answerable by a
person who did the day and hard for one who only skimmed a blog post. The
`answer` is what a good candidate says, not a paragraph of teaching — the
link to the day is what does the teaching, and that link is the only reason
the bank is worth building.

---

## 7. Points

Each node carries a price. Conventions from the data-analyst curriculum:

| Day | Points |
|---|---|
| ordinary weekday | 25–35 |
| build / project day | 40 |
| weekly review day | 15 |

Range 5–100, *importer-enforced*, default 25. Module, week and streak bonuses
are award-RPC rules, not spec data.

**Points are momentum, never a credential.** Awarded server-side only, for
genuine node progress. No readiness scores, no evidenced points, no
credential language — ever. *Guard: `pnpm baseline:verify` asserts clients
cannot mint points.*

---

## 8. Voice

Serious, calm, plain. Closer to Linear than to Duolingo. Sentence case
everywhere, never Title Case headings. No mascots, no confetti, no
motivational copy. These are adults with a real career problem.

**Never promise employment.** No "guaranteed", "100% placement", "job
assured", or any success statistic we cannot evidence with documentation and
written consent — a CCPA coaching-sector constraint, not a style preference.
*Guard: `pnpm claims` fails on `guarantee` within 80 characters of an outcome
word.* Saying plainly that we do **not** promise a job is fine and is what
the homepage does.

---

## 9. The procedure

### 9.1 Write the spec
`docs/roadmaps/<slug>.mjs`, default-exporting the object in §5. Split into
`docs/roadmaps/<slug>/modules-NN-NN.mjs` past about 600 lines — `data-analyst`
does this across five files.

### 9.2 Validate without touching the network
```
node scripts/import-roadmap.mjs docs/roadmaps/<slug>.mjs
```
Every structural rule in §§3–7 is checked and reported as a sentence.
Produces `supabase/.bundle/IMPORT-<slug>.sql`, **draft only**.

### 9.3 Verify every link, then generate the real paste
```
node scripts/import-roadmap.mjs docs/roadmaps/<slug>.mjs --check
```
Fetches every URL and resolves every video. All must pass. Only this mode
emits a paste that publishes.

### 9.4 Run the guards
```
pnpm typecheck && pnpm import:verify && pnpm schema:rules
pnpm embeds && pnpm claims && pnpm baseline:verify
pnpm --filter @jintu/web test && pnpm contrast && pnpm lint
```
Lint last, after every file is written.

### 9.5 Paste
`supabase/.bundle/IMPORT-<slug>.sql` into the SQL editor, by hand.

### 9.6 Nothing — the paste already recomputes
Every generated paste ends with the three derivations, so there is no manual
step to forget:

```sql
select public.recompute_estimated_hours();
select public.recompute_media_mix();
select public.recompute_has_prereqs();
```

---

## 10. Re-importing destroys progress

The generated paste deletes the roadmap by slug and reinserts the whole tree.
That cascades away every `node_progress` row for it.

**Before launch that is the right semantics.** After real users exist it is
unacceptable, and the paste's own header says so. Once anyone has progress on
a roadmap, changes must be surgical UPDATEs, and this pipeline stops being
the update path.

---

## 11. Checklist

Structure

- [ ] 2–20 modules; 8–12 nodes each
- [ ] 5–7 days a week — the importer prints it and warns below 4
- [ ] `category` set; **no `estimatedHours`** (derived)
- [ ] `requires` set where the roadmap genuinely assumes another
- [ ] every node 2–120 minutes, honestly estimated
- [ ] no `Day N` in any title
- [ ] `category` is one of the four; `subjectTags` carries the specifics

Every day

- [ ] summary ≤ 160 chars, readable alone
- [ ] 3 learning objectives, each verb-led and checkable
- [ ] 3–6 topics, **every one with a detail line**
- [ ] a principle — one sentence, no hedging
- [ ] a challenge with an artefact, 5–120 minutes
- [ ] a common mistake that is specific
- [ ] **3 comprehension checks**
- [ ] 1–4 resources, each with an editor note saying why this one
- [ ] every video: nocookie id, duration, `estSizeMb`

The roadmap

- [ ] 40–60 `kind: "interview"` questions, on the days that warrant them
- [ ] `askedInInterviews` only where somebody actually reports it
- [ ] points follow §7
- [ ] `--check` passes with zero failures
- [ ] every guard in §9.4 passes

---

## 12. What a course must never contain

| Never | Why |
|---|---|
| stored article text, transcripts, or summaries of others' writing | rule 1 — the aggregator/infringer line |
| a URL nobody has resolved | rule 2 — ~1 in 5 model-suggested references is fabricated |
| a video without `estSizeMb` | metered mobile data |
| a certificate, credential, grade, or verification | deliberately deleted in the August 2026 pivot. Do not reintroduce, "as an option" or otherwise |
| an employment claim | rule 4, and a legal constraint |
| points for anything but genuine progress | rule 5 |
| content aimed at under-18s | 18+ only; DPDP Rule 10 forbids profiling minors, and progress tracking is profiling |
