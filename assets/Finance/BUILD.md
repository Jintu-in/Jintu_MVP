# Finance package — build report

Built 2026-09-03 from the three files in this folder; module 1 re-authored
2026-09-04 to the owner's reference (`module-1-reference.md`, also in this
folder) — see the addendum at the end. Everything below is
committed on `feat/startup-finance`; this file is the record of what was
made from what, the decisions taken where the brief left choices open, and
the exact things still requiring a human.

---

## What was built

### 1. The roadmap — `docs/roadmaps/startup-finance.mjs` (+ two module files)

From `roadmap-startup-finance.md`, verbatim where the brief specified:
every module title, day title, principle and deliverable is the brief's.
Authored around them: the full COURSE_STANDARD day model for all 48 days.

```
48 days · 9 weeks · 5.3/week · 56 h derived
7 modules · 192 topics · 167 checks (23 interview, 0.48/day, 19 marked asked)
45 resources across 22 distinct URLs — every one verified 2026-09-03
supabase/.bundle/IMPORT-startup-finance.sql written, publishes on paste
```

All guards pass: importer + PGlite rehearsal, licences, claims, typography,
schema rules, the lot. `pnpm typecheck` and `pnpm lint` clean.

### 2. The roles — `apps/web/src/content/roles/finance.ts`

All 11 roles from `finance-roles.json`, adapted into the roles-layer page
model, plus one new comparison page the source data kept gesturing at:

- **investing-roles** — IB vs VC vs PE vs equity research vs transaction
  advisory vs portfolio management. The five-desks confusion, settled by
  who takes the risk and when they find out they were wrong.

Six roles now route into the startup-finance roadmap the source data was
written before: VC analyst, transaction advisory, IB analyst, startup CFO,
FP&A (module 5's driver modelling) and PE (as the readInstead on a notYet).
The taxonomy's own `target_roles` for the profiled customer — VC, IB,
startup CFO, transaction advisory — all end in the roadmap built for them.

### 3. The concept graph — consumed, not yet schematised

Every one of the 48 days carries a `concepts: []` array keyed to
`finance-concepts.json`. The importer ignores the field — there is no
per-day concept column in the schema — so this is authored raw material
for skip-what-you-know, not a live feature. See "decisions" below.

---

## Decisions taken (the brief said "ask if any questions" — these were
judgement calls rather than blockers, so they were taken and are recorded
here for review)

1. **Nine weeks, not ten.** The brief's own instruction: compress or add
   days, never stretch. Compressed. 5.3 days/week clears the streak target.

2. **NSE Emerge is absent.** nseindia.com returns 403 to the link checker
   on every path — same ruling as metaculus.com and cdc.gov elsewhere in
   the catalogue. BSE SME + SEBI + Zerodha Varsity carry module 7, and
   day 43 explicitly tells the learner to compare both exchanges in
   practice. MCA (403) likewise: day 5 (CCPS/CCD) carries no link and
   says why on its face.

3. **a16z and First Round dropped.** Their classic essay URLs now 404
   (`16-metrics` et al.); the YC Library covers the ground and verifies.

4. **The disclaimer rides `licenseNote`** — the one roadmap-level
   free-text field the page renders — plus a short form as the summary's
   last sentence. The brief wants it also on modules 3/6/7's footers:
   that is a UI change (no per-module note surface exists) and is left as
   a follow-up rather than half-built.

5. **Concept tagging is spec-side only.** The checklist item "tag every
   day against finance-concepts.json" cannot land in the database — no
   column exists. Tags are in the spec now, at zero cost, ready for a
   future `node_concepts` migration. Building skip-what-you-know is a
   product decision, not an authoring one.

6. **`finance-analyst` (roles layer) was replaced.** The earlier
   operations-domain page straddled financial-analyst and FP&A; the
   taxonomy in this folder splits them correctly, so the old page was
   removed in favour of the two new ones.

7. **Interview density over the flat count.** 23 questions at 0.48/day,
   inside the 0.4–0.6 band the course standard sets, concentrated on cap
   tables, valuation, unit economics, diligence and the IPO days.

---

## Verified sources (all 200 on 2026-09-03, via the importer's checker)

| Anchor | What it carries |
|---|---|
| Damodaran (pages.stern.nyu.edu) | Module 3 — young-company paper, spreadsheets, data page, probabilistic paper |
| Y Combinator (library, documents, 2 essays) | Modules 1, 4, 5, 6 — SAFE originals, seed guide, raise guide |
| Carta (cap-table, term-sheets, learn hub) | Module 2 |
| Zerodha Varsity (IPO ch. 1–2, fundamental analysis) | Modules 6–7 |
| SEBI (regulations listing, public-issue filings) | Module 7 — the DRHP archive and ICDR index |
| BSE (bsesme.com, static page, publicissue) | Module 7 eligibility and process |
| Stripe Atlas guides hub | Day 33 |
| ExcelJet (xlookup, sumifs) | The Excel layer, reusing already-verified URLs |

Nine new hosts added to `scripts/lib/licenses.mjs`, all `assumed()`
proprietary — link-only under rule 1, with the Indian-government note that
sebi.gov.in is *not* public domain the way US federal works are.

---

## Still requires a human

- [ ] **Paste** `supabase/.bundle/IMPORT-startup-finance.sql` (after any
      pending migrations — none required by this roadmap).
- [ ] **Merge order**: this branch (`feat/startup-finance`) builds on
      `feat/roles-layer`; merging it brings both.
- [ ] **Quarterly review** discipline for modules 1, 6, 7 — the brief's
      own freshness warning. `reviewCadence: "quarterly"` is set; the
      link-check workflow still needs its two repo secrets to run.
- [ ] **Open the current BSE SME eligibility page and one filed DRHP by
      hand** before telling a real client anything — the roadmap teaches
      the pull-cite-date habit, and the publisher should model it once.
- [ ] Module-footer disclaimer surface (UI follow-up, decision 4).
- [ ] `node_concepts` migration if skip-what-you-know proceeds
      (decision 5).

---

## Addendum — module 1 re-authored to the owner's reference (2026-09-04)

`module-1-reference.md` arrived after the first build and replaced the
first-pass module 1 wholesale: its challenges (the SAFE conversion
arithmetic, the option-pool shuffle, the debt-vs-equity model), its
checks, its topics (fund economics, accelerators, angel tax, pool
timing — all missing from the first pass) and its named sources.

New verified sources it brought in:

| Source | Where |
|---|---|
| **Aaron Harris — "How to Get Meetings with Investors and Raise Money"** (YC YouTube, 48 min) | Day 1 — the roadmap's first video |
| **Kirsty Nathoo — "Understanding SAFEs and Priced Equity Rounds"** (YC YouTube, 45 min) | Days 3–4, one half each |
| **Damodaran — young-company paper §1–2** | Day 1 (early pointer to day 15's spine) |
| **Carta — pre-money vs post-money SAFEs** | Day 3 (their older SAFE URLs 404; this one verifies) |
| **Brad Feld — term-sheet series wrap-up** | Day 4 |
| **Damodaran — data page** | Days 4 and 6 (multiples; cost of capital by sector) |
| **RBI — FEMA notifications** | Day 5 — which is therefore no longer a zero-link day |
| **Indian Angel Network** (iangroup.vc — the .com redirects there) | Day 2 |
| **Trifecta Capital + Alteria Capital** | Day 6 — "read two providers" per the reference |
| **First Round Review hub** | Day 6 (deep links rot; hub verifies) |

Reference asks that stayed linkless, deliberately: MCA (403s the checker;
day 5's challenge sends the learner to the portal by name) and "a current
angel-tax article" (any link would rot at the next budget; day 2 teaches
the check-the-date habit instead). Six licence hosts added. Zero-link
days are now four (27, 30, 34, 41).

The inventory's video sources were then carried into modules 2–7 as
well — one verified talk on the day it belongs to, all oEmbed-checked:

| Video | Day |
|---|---|
| Kirsty Nathoo — "Startup Mechanics" (Stanford CS183F, 58 min) | 7 — what a cap table is |
| Damodaran — "Valuing and Pricing Start-ups" (his channel, 29 min) | 15 — beside his paper |
| Kevin Hale — "Startup Pricing 101" (YC, 20 min) | 21 — CAC/LTV |
| Kevin Hale — "How to Pitch Your Startup" (YC, 28 min) | 28 — the deck |
| CA Rachana Ranade — Hyundai IPO review (15 min) | 45 — a worked offer-document read |

Not used: Zerodha Varsity's own IPO video (the found copy 404s) and
Ranade's 92-minute beginners lecture (wrong level for this roadmap).
Module 6 (diligence) stays text-only — no free video of comparable
quality surfaced; the Big Four thought-leadership ask remains open.

Tallies after both passes: 48 days · 54 h · 63 resources (8 video
citations, 7 unique talks) — video in the media mix for the first time,
in six of seven modules. Full check exit 0; bundle regenerated.

---

## Addendum 2 — module 3 re-authored to the owner's reference (2026-09-04)

`module-3-reference.md` (also in this folder) replaced the first-pass
days 14–20 the same way module 1 was replaced: its challenges (the
terminal-value drill, the two-peer-sets exercise, the three-method
pre-revenue valuation, the one-page critique), its topics and its
checks — with the three interview questions from the first pass kept on
top. The Damodaran video moved from day 15 to day 14, where the
reference puts it.

New verified sources:

| Source | Where |
|---|---|
| **Musings on Markets** (Damodaran's blog) | Days 14, 19, 20 — worked valuations, value-vs-price, reverse DCFs |
| **His valuation course webcast index** (spring 2025 — the current one) | Days 16–17, the relative-valuation sessions |
| **The SaaS Capital Index** | Day 16 — a public multiples tracker with history |
| **ACA — "Valuing Pre-revenue Companies"** (the Bill Payne guidance) | Day 18 — one PDF that is simultaneously the angel-network guidance, the scorecard/Berkus comparison, and worked VC-method arithmetic |
| **Hindenburg Research archive** | Day 20 — short-seller reports read for method; the note says plainly the firm wound down in 2025 and the archive stays up |
| **The FAST Standard** | Day 20 — what a well-built model looks like |

Rejected while probing, per rule 2: Meritech's comps table (redirects to
a login — the checker would pass it but the learner hits a wall), Muddy
Waters (TLS failure), Seraf's compass (cross-host redirect into an app
shell), and Damodaran's pricevalue.pdf (404). The reference's generic
asks — a free brokerage report, a published startup DCF — became
challenge instructions rather than links.

The reference's closing notes are captured in the spec header: his data
sets update each January and his site reorganises, so the quarterly
review should re-click the Damodaran links first. Five licence hosts
added. Tallies now: 48 days · 52 h · 76 resources (8 video citations) ·
23 interview checks at 0.48/day · module 3 carries 22 resources across
all seven days.

---

## Addendum 3 — module 2 re-authored to the owner's reference (2026-09-05)

`module-2-reference.md` (in this folder) replaced days 7–13 the same
way: its build-as-you-go structure (one file grown from day 9 to day
13), its numeric challenges with exact rupee inputs, its topics
(authorised-vs-issued capital, the four option states, the Indian ESOP
layer — all missing from the first pass) and its checks, with the first
pass's four interview questions kept on top.

Sources, all verified: Carta's cap-table, **share-dilution**,
**stock-options** and **waterfall-analysis** pages (the last three are
new — Carta's older dilution/ESOP/liquidation URLs all 404, so each was
re-found at its current path), Stripe Atlas, the Nathoo videos (her
SAFEs talk now carries the arithmetic on day 8 and the pool-shuffle
section on day 11, per the reference's explicit asks), YC's SAFE
documents as day 12's test cases, Brad Feld's liquidation-preference
posts, First Round's hub for the modest-exit account, and the Excel
layer reused from excel-at-work's verified set (XLOOKUP, INDEX/MATCH,
Excel Tables) plus Microsoft's data-table page for day 10's two-way
sensitivity. No new licence hosts needed.

Linkless by design: MCA (day 7's challenge sends the learner to the
portal), the law-firm CCPS explainer, and Indian ESOP taxation (day
11's challenge makes finding a dated explainer and checking its date
the exercise). The reference's own authoring note agrees — "prefer a
source with a visible date."

Modules 4–7 remain first-pass. The reference names module 4 as the
natural next one — it feeds the model built in module 5.

---

## Addendum 4 — module 4 re-authored to the owner's reference (2026-09-05)

`module-4-reference.md` (in this folder) replaced days 21–27 with its
definition–use–manipulation framing: the two-retention-assumption LTV
drill, the CM1/CM2/CM3 delivery model, the cohort table with the three
written questions, the MRR bridge, the GMV mix-shift scenario, the
18-month cash model, and day 27's manipulation catalogue with its
five clarification-not-accusation questions. All five first-pass
interview checks kept on top.

Source findings worth recording:

- **a16z's "16 Startup Metrics" and "16 More Startup Metrics" are back**
  — the 2015-dated URLs that 404'd in the first build resolve at
  `a16z.com/16-startup-metrics/` and `/16-more-startup-metrics/`. Cited
  on days 21, 22, 23, 25 and 27 (day 27 reads the list as a
  manipulation catalogue, which is the reference's framing).
- **Paul Graham's "Default Alive or Default Dead"** verifies at
  `paulgraham.com/aord.html` — day 26, link-only per the inventory's
  own note on PG essays.
- **David Skok's SaaS Metrics 2.0** (forentrepreneurs.com) — the
  payback sections on day 21, the NRR/churn sections on day 24.
- **Damodaran's user/subscriber valuation deck** verifies on his own
  site (`pdfiles/blog/UserbasedValue.pdf`); the SSRN copy 403s and is
  not used.
- **SaaS Capital's research page** carries the segmented NRR benchmarks
  day 24 asks for.
- Rejected: David Sacks' burn-multiple Substack post (404) — the burn
  multiple is taught in-topic with its formula instead.
- **Day 27 is no longer a zero-link day** (a16z + Hindenburg + SEBI
  filings). Zero-link days are now three: 30, 34, 41.

Three licence hosts added (paulgraham.com, forentrepreneurs.com,
a16z.com). The reference's cross-references — data-analyst roadmap day
47 on day 23, the day-20 audit drill on day 27 — are woven into
whyToday text rather than faked as resources.

Modules 5–7 remain first-pass. The reference names module 5 next — the
operating model is built from this module's drivers.

---

## Addendum 5 — module 5 re-authored to the owner's reference (2026-09-05)

`module-5-reference.md` (in this folder) replaced days 28–34: the
two-connected-deliverables structure (deck reconciling to a driver-based
model, built across the week), the slide-by-objection drill, the
bottom-up market build with cited Indian sources, the one-source rule,
the 18-month driver model with the CAC-shock test, the switch-cell
scenarios, the Indian Series A data room, and day 34's audit — at 45
points, the highest in the roadmap, as the reference insists. The three
first-pass interview checks (the $50bn/1% TAM, the downside that still
works, the model-an-hour-before-a-call) stay on top.

New verified sources:

| Source | Where |
|---|---|
| **Sequoia — "Writing a Business Plan"** (the original ten-slide template) | Day 28 |
| **YC Library — "How to design a better pitch deck"** (talk page, video embedded) | Day 28 |
| **MoSPI** (mospi.gov.in — real Indian denominators) | Day 29 |
| **Microsoft — Scenario Manager** and **formula auditing** pages | Days 31, 34 |
| **ExcelJet — named ranges** (the one-source rule's mechanics) | Day 30 |
| **EuSpRIG spreadsheet horror stories** (documented modelling errors with consequences) | Day 34 |

Reused where the reference asks for what is already verified: FAST
(days 30, 34), Damodaran's spreadsheets and probabilistic paper, Skok
read a third time as a model specification, First Round's hub, SEBI
filings for the DRHP industry section, the data-table page. ExcelJet's
Goal Seek page 404s — the data-table page carries the mechanics.
Generic asks (published decks, model templates, an Indian diligence
checklist with a date on it) are challenge instructions.

**Days 30 and 34 are no longer zero-link.** Day 41 (the memo) is now
the roadmap's only zero-link day, and the index header says why. Three
licence hosts added (sequoiacap.com, mospi.gov.in, eusprig.org).

Modules 6–7 remain first-pass. The reference: module 6 follows
naturally from day 34 — same skill, applied to a company rather than a
spreadsheet; module 7 needs the most verification and rots fastest.
