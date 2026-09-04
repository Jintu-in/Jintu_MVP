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
days are now four (27, 30, 34, 41). Tallies moved to 48 days · 54 h ·
58 resources, with video in the media mix for the first time.

The reference's pattern — named sources with a "why this one" note per
day — is how modules 2–7 should be upgraded too, if the owner authors
references for them; its source inventory names the channels to draw on
(Damodaran's full lecture courses, CA Rachana Ranade for the regulatory
layer, NSE/BSE investor education videos for module 7).
