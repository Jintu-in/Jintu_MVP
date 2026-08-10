# The abstract-topic curriculum
### Page architecture + one complete example: Search & AI Visibility

> The category where Jintu can beat a free frontier model, and the page design that makes a six-week track legible in one screen.

---

## Part 1 — Why abstract topics are your strongest category

You cannot out-curriculum Gemini on Python. Thirty years of settled pedagogy sit in its training data; it will produce a better roadmap than you will, instantly, free.

Now ask it for a Generative Engine Optimization curriculum. It will produce something confident and largely invented, because **as of early 2026 there is no consensus academic definition even distinguishing GEO from AEO** — the terms are used interchangeably across practitioners and vendors, alongside LLMO, AIO, and "AI SEO."

That's not a model failure. It's a gap in the world. Gaps in the world are the only thing you can defensibly build on.

### The specific opening in this field

Google's own official guidance, published July 2026, tells site owners to **ignore** llms.txt files, content "chunking," and other AEO/GEO hacks — and to prioritise effective SEO over them. An entire vendor industry sells precisely those tactics.

Meanwhile the pressure is real: <cite index="7-1">Gartner predicted traditional search volume would drop 25% by 2026, and by July 2026 that had become reality.</cite> <cite index="14-1">Over 60% of Google searches now end without a click.</cite> The Seer Interactive study of 3,119 queries found organic click-through fell 61% where an AI Overview appears.

So you have a field where the stakes are high, the advice is contradictory, and the official guidance contradicts the commercial guidance.

**That contradiction is the curriculum.** Every guru course in this space teaches tactics. The employable skill — the one nobody teaches and the one that stays valuable when the tactics rot in six months — is *being able to test whether anything you did worked.*

Which is convenient, because measurement is gradeable and tactics aren't.

### The category rule

An abstract topic is a good Jintu track when all four hold:

1. **No canonical curriculum exists.** Nobody can just ask a chatbot.
2. **Money is attached.** Real job titles, real freelance rates.
3. **The advice is contested.** Which means judgement is the skill, not recall.
4. **Outputs are artifacts.** Audits, markup, campaigns, reports — things that can be checked.

SEO/AEO/GEO hits all four. So does Amazon Ads, marketplace operations, technical writing for APIs, and RevOps. Guitar hits 1, 2, and 4 but not 3, which is why it's a community track rather than a sprint.

---

## Part 2 — The curriculum page: showing everything at once

### What's wrong with your current page

The accordion hides the product. A visitor deciding whether to spend ₹999 has to click six times to see what they'd be doing, can't compare weeks against each other, and never sees the rubric unless they dig. For an abstract topic this is fatal, because the buyer's real question isn't "is week 3 good" — it's **"is this a real thing or is it invented?"** That question is answered by seeing the whole shape at once.

### The spine view

One vertical timeline, all six weeks visible without interaction. Each row carries five things and nothing else:

`week number · title · one-line objective · points · how it's graded`

Expansion adds resources and the rubric table in place. Nothing collapses out of view — the spine stays.

### Five things every curriculum page needs that yours doesn't

**1. A grading-method chip on every week.** Auto-graded / Peer-reviewed / Model-graded, colour-coded, visible without clicking. No competitor publishes how work is assessed *before* purchase. It converts your biggest operational constraint into your most differentiated trust signal, and it makes the "62% auto-graded" claim legible rather than abstract.

**2. A summary strip with the deterministic percentage.** Weeks, artifacts, points, auto-graded share, free sources. The auto-graded figure is the one that means something — it says a machine checks your work against a right answer, not a model's opinion.

**3. A freshness date and a changelog.** For a field that turns over quarterly, `Reviewed 4 Aug 2026` is a competitive weapon. Add `/learn/[slug]/changelog` listing what changed and why. When Google published its "ignore llms.txt" guidance, a curriculum that updated within a week and *said so* is demonstrably alive. Guru courses sold in 2024 are still selling 2024 tactics.

**4. A "what you'll own at the end" strip.** Six artifact cards showing the actual deliverables — an audit report, validated schema, an experiment writeup, a campaign teardown, a client report, a recording. This is the emotional payoff and it's entirely missing from your page. It's also the closest a prospect gets to seeing the proof profile before buying.

**5. An honest "what this won't do" block.** For abstract topics especially. Something like: *"This will not get you ranked. It will teach you to find out whether anything you did moved a number."* Under the CCPA coaching-sector guidelines you need this anyway; here it also happens to be the most credible sentence on the page.

### Page order

```
Breadcrumb
Title + freshness pill
One-line thesis
Summary strip  (6 · 6 · 42 · 55% · 18)
[ THE SPINE — all six weeks, week 1 expanded ]
What you'll own at the end   (6 artifact cards)
How grading works            (3 chips explained, one line each)
What this won't do
Sticky bottom bar: next cohort date · Join ₹999
```

### The curriculum page's own SEO — worth doing properly here

For this track specifically, the page is a live demonstration. Add `Course` schema (schema.org/Course) with `hasCourseInstance`, a real `FAQPage` block, and a `dateModified` matching the freshness pill. If you teach structured data, ship structured data. Students will inspect it, and one of them will find a mistake — which is a good outcome and a good story.

---

## Part 3 — The track

## Search & AI Visibility
**SEO, AEO and GEO — and how to prove any of it worked.**

**6 weeks · 42 points · completion threshold 25 · tier: sprint**

### Verification profile — recomputed honestly

| Week | Deterministic | Peer | Model | Total |
|---|---|---|---|---|
| 1 | 6 | 2 | — | 8 |
| 2 | 5 | 2 | — | 7 |
| 3 | 2 | 4 | — | 6 |
| 4 | 3 | 4 | — | 7 |
| 5 | 5 | — | 2 | 7 |
| 6 | 2 | 2 | 3 | 7 |
| | **23** | **14** | **5** | **42** |

**Deterministic share: 55%.** Clears the 50% sprint threshold.

> The mockup rounds this to 62%. That was a first pass and it's wrong — use 55%. Publishing a number you haven't recomputed is exactly the failure mode this track exists to teach.

**Only 5 of 42 points are model-graded**, which puts AI grading cost at roughly ₹6 per student for the entire six weeks.

---

### Week 01 — Audit a site that is deliberately broken
**Objective:** Find what's wrong with a site you didn't build, and don't invent problems that aren't there.
**8 points · Auto-graded · ~8 hrs**

**Resources**
| Type | Title | Source |
|---|---|---|
| Site | `audit.jintu.in/site-a` | Jintu — the broken site |
| Docs | Google Search Central — crawling and indexing | `developers.google.com/search/docs/crawling-indexing` |
| Tool | Screaming Frog SEO Spider (free tier, 500 URLs) | `screamingfrog.co.uk` |
| Tool | PageSpeed Insights | `pagespeed.web.dev` |
| Tool | Google Search Console | free, needs a property |

*Video slot:* one Screaming Frog walkthrough — first crawl to first finding. Highest-value video in the track; the tool is intimidating on first open.

**What you submit — an audit log**
One row per finding: what's wrong, which URL, how you detected it, the fix, and the business consequence of leaving it.

**Rubric `technical-audit-v1` · 8 points**
| Criterion | Weight | Check |
|---|---|---|
| Planted defects found — 1 per 2, capped at 5 | 5 | `answer_key_match` |
| Each finding names the exact URL and a specific fix | 2 | peer |
| No fabricated defects | 1 | `answer_key_match` |

**Grader notes**
The decoys matter more than the defects. Two things on the site *look* broken and are correct — a deliberately noindexed thank-you page, and a canonical that legitimately points elsewhere. An auditor who flags them has demonstrated the single most expensive junior habit in this field: generating work by inventing problems. Deduct the full fabrication point for either.

---

### Week 02 — Make a machine understand what you are
**Objective:** Write structured data that validates, and entity signals that are consistent across the web.
**7 points · Auto-graded · ~8 hrs**

**Resources**
| Type | Title | Source |
|---|---|---|
| Reference | Schema.org vocabulary | `schema.org` |
| Tool | Schema Markup Validator | `validator.schema.org` |
| Tool | Rich Results Test | `search.google.com/test/rich-results` |
| Docs | Google — structured data general guidelines | `developers.google.com/search/docs/appearance/structured-data` |

**What you submit**
JSON-LD for three page types on the broken site — an Organization, a Product or Service, and a FAQPage — plus a one-paragraph note on which entity signals were inconsistent across the site's own pages and how you reconciled them.

**Rubric `structured-data-v1` · 7 points**
| Criterion | Weight | Check |
|---|---|---|
| All three blocks pass the validator with zero errors | 3 | `executable` |
| Required and recommended properties present for each type | 2 | `executable` |
| Entity name, address and identifiers consistent across all three | 2 | peer |

**Grader notes**
Fully machine-checkable — run each JSON-LD block through validation programmatically. The 2-point consistency criterion is peer-reviewed because "the same organisation described three different ways" needs a human to notice.

**Common failure:** marking up content that isn't visible on the page. Flag this explicitly; it's a guidelines violation and juniors do it constantly.

---

### Week 03 — Write so the answer can be lifted out
**Objective:** Restructure a real page so an answer engine can extract it, without hollowing out the content.
**6 points · Peer-reviewed · ~7 hrs**

**Resources**
| Type | Title | Source |
|---|---|---|
| Docs | Google — AI features and your website | `developers.google.com/search/docs/fundamentals/ai-optimization-guide` |
| Guide | GOV.UK style guide | `gov.uk/guidance/style-guide` |
| Reference | Your week 1 audit | — |

**What you submit**
A before/after rewrite of one page from the broken site. Answer-first structure, a direct definitional sentence, scannable subheads, and a table or list where the content warrants it. Plus three sentences on what you deliberately did *not* do and why.

**Rubric `extractable-writing-v1` · 6 points**
| Criterion | Weight | Check |
|---|---|---|
| Required structure present — answer in first 60 words, subheads, one structured element | 2 | `structural` |
| A stranger can state the answer after 20 seconds | 3 | peer, timed |
| Not hollowed — still contains specifics, numbers, and caveats | 1 | peer |

**Grader notes**
The last point exists because the obvious way to score well on extractability is to strip everything interesting out. Peers are explicitly asked: *would this page be worth reading if you weren't skimming?* A page that scores 3/3 on extraction and 0/1 on substance has learned the wrong lesson, and this is the most likely wrong lesson in the entire track.

---

### Week 04 — Run an experiment that could fail
**Objective:** Measure whether an intervention changed AI visibility, and report honestly if it didn't.
**7 points · Peer-reviewed · ~9 hrs**

This is the heart of the track. Everything else is scaffolding for this week.

**Resources**
| Type | Title | Source |
|---|---|---|
| Docs | Google's guidance on generative AI features | `developers.google.com/search/docs/fundamentals/ai-optimization-guide` |
| Reference | Wikipedia — Generative engine optimization | `en.wikipedia.org/wiki/Generative_engine_optimization` |
| Paper | Aggarwal et al., the original GEO paper (Princeton, 2023) | search arXiv — **verify the identifier before publishing** |
| Vendor claim | Any GEO agency page selling llms.txt | student's choice — the object of study |

**What you submit — an experiment log**

1. Pick ten real prompts a customer might ask an AI assistant about a chosen niche.
2. Record a baseline: for each prompt, across at least two assistants, which sources are cited? Screenshot everything with dates.
3. Pick **one** intervention and state your hypothesis before you make it.
4. Wait the stated interval. Re-measure identically.
5. Report what happened, including if nothing did.

**Rubric `visibility-experiment-v1` · 7 points**
| Criterion | Weight | Check |
|---|---|---|
| Baseline is complete and timestamped — 10 prompts × 2 engines, evidence attached | 3 | `structural` |
| Hypothesis stated before the intervention, one variable changed | 2 | peer |
| Conclusion matches the evidence, including a null result reported as null | 2 | peer |

**Grader notes**
**A null result scores full marks.** Say this on the public page, in the rubric, and again in the week's intro, because students will assume otherwise and will be tempted to manufacture a finding.

The vendor-claim resource is deliberate. Students evaluate a commercial GEO claim — llms.txt is the cleanest example — against Google's explicit statement that Search doesn't use such files, and against their own measurement. Some will find the vendor is right for non-Google engines. Some will find nothing. Both are correct outcomes, and the ability to tell the difference is the entire employable skill.

**Common failures:** changing three things at once. No timestamps, making the baseline unverifiable. Measuring one engine. Concluding "it worked" from a single citation appearing — an AI answer varying between two runs is not evidence of anything, and the rubric should catch anyone who doesn't know that.

---

### Week 05 — Diagnose a campaign that is burning money
**Objective:** Read a paid search or marketplace ad account and find what's wasting spend.
**7 points · Auto-graded · ~8 hrs**

**Resources**
| Type | Title | Source |
|---|---|---|
| Export | `jintu_ads_broken.csv` | Jintu — planted misconfigurations |
| Training | Google Skillshop — Search Ads fundamentals | `skillshop.withgoogle.com` (free) |
| Training | Amazon Ads learning console | free with an ads account |
| Docs | Google Ads Help — match types and negatives | `support.google.com/google-ads` |

**What you submit**
A diagnosis log: each problem, the metric it damages, the fix, and the expected direction of change. Plus a restructure proposal for the worst-performing ad group.

**Rubric `campaign-audit-v1` · 7 points**
| Criterion | Weight | Check |
|---|---|---|
| Planted misconfigurations found — 1 per 2, capped at 4 | 4 | `answer_key_match` |
| No fabricated problems | 1 | `answer_key_match` |
| Each fix names the metric it should move and the direction | 2 | `rubric_ai` |

**Planted misconfigurations in the export (7 total, plus 2 decoys)**
Broad match with no negative keyword list · budget capped below the average CPC · one ad group with 300+ keywords · conversion tracking firing on page-load rather than purchase · duplicate keywords competing across ad groups · a paused ad group still accruing spend in the export · location targeting set to "presence or interest" for a purely local service.

Decoys: a high-CPC keyword that is genuinely profitable, and a low-CTR ad that converts well.

---

### Week 06 — Tell a client what you did and what failed
**Objective:** Present six weeks of work to someone paying for it, and volunteer what didn't work.
**7 points · Model-graded + peer · ~6 hrs**

**Resources**
Your own weeks 1–5. No new reading — the material is the work.

*Video slot:* record your own 5-minute example, including a real acknowledged failure. Model the behaviour rather than describing it.

**What you submit**
A one-page client report, and a five-minute recorded walkthrough ending with: *"What's the weakest part of this work?"*

**Rubric `client-report-v1` · 7 points**
| Criterion | Weight | Check |
|---|---|---|
| One page, all required sections present, under 5:00 | 2 | `structural` |
| Recommendations are specific and prioritised, not a list of everything | 3 | `rubric_ai` |
| Names a real weakness in the work, on camera | 2 | peer |

**Grader notes**
Never grade accent, fluency, or grammar. Transcribe first, grade the transcript, and state this policy publicly — otherwise students who are strong analysts and nervous English speakers will silently not submit in the final week, which is where you can least afford it.

---

## Part 4 — Assets Jintu must build

These are the proprietary layer. Nothing here can be replicated by prompting a model, because the answer keys don't exist on the internet.

| Asset | For | Effort | Notes |
|---|---|---|---|
| `audit.jintu.in/site-a` — a broken demo site | Weeks 1–3 | 2–3 days | 12 planted defects + 2 decoys. Static site, deploy free. **The crown jewel** |
| Answer key for site-a | Week 1 | half a day | Private storage. Never in the public repo |
| `jintu_ads_broken.csv` | Week 5 | 1 day | 7 misconfigurations + 2 decoys |
| Example client report + recording | Week 6 | half a day | Yours, with a genuine flaw in it |
| Changelog page | ongoing | — | The freshness signal |

**Rotate the defects between cohorts.** Assume any answer key more than three cohorts old is public. Build the site so defects are toggled by config rather than hand-edited, and rotation costs minutes.

**Build site-b and site-c eventually.** Different industries, different defect mixes. Same generator.

---

## Part 5 — How this templates to other abstract topics

The shape is reusable in full:

| Slot | Search & AI Visibility | Amazon Ads | Technical Writing |
|---|---|---|---|
| Broken thing to audit | Broken website | Broken ad account | Bad documentation |
| Machine-validatable artifact | JSON-LD schema | Campaign structure export | OpenAPI spec |
| Extraction/clarity rewrite | Answer-first page | Listing copy | Task-based guide |
| Falsifiable experiment | AI citation test | A/B on ad copy | Task-completion test on 5 users |
| Diagnosis with answer key | — | Wasted-spend audit | Findability audit |
| Client-facing report | Report + walkthrough | Report + walkthrough | Report + walkthrough |

**The generalisable pattern: find the thing in this field that can be deliberately broken, and break it.** That single asset converts an unteachable abstract subject into a deterministically gradeable one, and it's the piece nobody else will bother to build.

Amazon Ads is arguably the stronger commercial bet of the three — a real Indian job title, a large seller-services market, and it scores higher on deterministic verification than this track does.

---

## Part 6 — Caveats

- **Verify every URL before publishing.** I'm confident about Google Search Central, schema.org, validator.schema.org, Skillshop, PageSpeed Insights, and Screaming Frog. The Princeton GEO paper's arXiv identifier I have not verified — find it rather than trusting a remembered ID.
- **This field will change before your second cohort.** Budget a half-day review every quarter and publish the changelog. That maintenance burden is real, and it is also the moat — a competitor selling a static 2024 course cannot follow you.
- **Week 4 depends on third-party AI assistants** whose behaviour changes without notice. Design the rubric around *method quality*, not results, which is what it does — and re-verify each cohort that the measurement approach still works.
- **Don't let this track make ranking promises.** "We teach you to measure whether it worked" is defensible. "We teach you to rank" is a claim you'd have to evidence, and under the CCPA coaching-sector guidelines that's the wrong risk to take.
- The 55% deterministic figure will shift as you tune rubrics. Recompute it whenever a rubric changes and update the page — a stale number on a page that advertises measurement discipline is the worst possible look.
