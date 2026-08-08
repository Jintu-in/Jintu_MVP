# Jintu — Legal constraints for builders

> **Read this before writing marketing copy, adding a column that stores text
> from someone else's site, or shipping anything that collects a phone number.**
>
> **Doc version:** 1.0 · **Status:** written by the engineering team, **not
> reviewed by a lawyer**

## 0. What this document is, and what it is not

This is an engineering document. It translates three bodies of law into rules
you can apply at a keyboard, and records *why* each rule exists so you can tell
when a new situation is covered by it.

It is **not legal advice** and no one on this team is qualified to give any.
Everything in §7 is unverified and must be checked by a lawyer before launch.
Where this document and a lawyer disagree, the lawyer wins.

Three bodies of law bind us:

| Area | Instrument | What it constrains |
|---|---|---|
| Third-party content | YouTube Terms of Service; copyright | What we may store, transform, and show |
| Personal data | Digital Personal Data Protection Act, 2023 (DPDP) and its Rules | Who we may serve, what we may collect, how we ask |
| Advertising claims | Consumer Protection Act, 2019; CCPA guidelines on misleading advertisements, incl. the coaching sector | What we may say about outcomes |

Note: **CCPA here is India's Central Consumer Protection Authority**, not the
California privacy statute of the same initials. If you search for "CCPA
compliance" you will get the wrong country.

---

## 1. Third-party content — Law 2 in practice

**The rule: we store URLs and metadata. Nothing else. Ever.**

The whole curriculum is a set of links to other people's work, arranged in an
order we chose and wrapped in assignments we wrote. The arrangement and the
assignments are ours. The videos and articles are not, and we never behave as
though they are.

### Permitted

- Storing a URL, a YouTube video ID, a title, a duration, a publisher name
- Rendering a YouTube video through the **official IFrame embed**, using
  `youtube-nocookie.com`
- Linking out to an article, dataset, or docs page in a new tab
- Writing our own description of *why* a resource is on the path — in our own
  words, about the resource, not a restatement of its contents
- Recording that a link is dead (`resources.health`) and replacing it

### Prohibited — no exceptions, no "just for testing"

- Storing a transcript, caption track, summary, translation, or extract.
  `resources` has no `transcript`, `summary`, `full_text`, or `content` column
  and a CI check fails the build if one appears.
- Feeding third-party text to a model to summarise, paraphrase, narrate, or
  answer questions about
- Text-to-speech over someone else's writing
- Downloading, proxying, re-hosting, or caching the media itself
- Bundling resources into a PDF, EPUB, or "course pack" for offline use
- Stripping ads, or presenting the content in any player but YouTube's own
- Re-hosting thumbnails. `next.config.ts` allows `i.ytimg.com` as a remote
  pattern precisely so the image is fetched from YouTube, not copied to us.

### Why the line sits exactly there

Indexing and linking out is a fundamentally different act from producing
something that substitutes for the original. A search index sends users *to*
the work; a generated summary lets them skip it. The first has survived
scrutiny repeatedly; the second is how you become the defendant in a case about
market substitution. A transcript in our database is not a convenience feature,
it is the evidence that we made a copy.

There is a second, more practical reason: our entire relationship with YouTube
is governed by their Terms of Service, which permit embedded playback and
prohibit accessing the content by other means. Losing embed rights would remove
the curriculum.

### The gating rule

**Never gate a video behind a quiz.** Requiring someone to pass our assessment
before YouTube's player will load interferes with access to content we do not
own. Gate the **next module** instead — that is our arrangement, and our
arrangement is ours to gate.

---

## 2. Personal data — DPDP

### 2.1 Eighteen and over. Full stop.

We do not serve minors. Not with parental consent, not with a waiver, not for a
campus batch where the TPO vouches for them.

The reason is structural rather than squeamish: DPDP restricts the processing
of children's personal data, and specifically restricts tracking, behavioural
monitoring, and targeted advertising directed at children. **A readiness score
is behavioural profiling.** It is the core of the product. There is no version
of Jintu that both scores readiness and lawfully serves a 17-year-old, so the
age gate is not a feature flag — it is the shape of the company.

How it is enforced:

- Signup presents an explicit affirmative 18+ confirmation. Not pre-ticked, not
  bundled into the terms checkbox.
- `profiles.is_adult_confirmed` is `not null default false` **with a CHECK
  constraint requiring it to be true**. A profile row for someone who has not
  affirmed adulthood cannot be written. The default exists so that an insert
  which forgets the column fails loudly instead of silently creating one.
- Campus batches are no exception. Bulk enrolment must confirm per student.

### 2.2 Consent is granular, purpose-specific, and revocable

DPDP requires consent that is free, specific, informed, unconditional and
unambiguous, given by a clear affirmative action, and **as easy to withdraw as
it was to give**.

That is why `consents` is a table and not a boolean:

| `purpose` | Covers | Refusable? |
|---|---|---|
| `core_service` | Running the sprint: enrolment, submissions, grading, peer review | No — without it there is no service to deliver |
| `analytics` | PostHog product analytics | **Yes** |
| `whatsapp_updates` | Deadline reminders, nudges, streaks | **Yes** |
| `public_profile` | Publishing the proof-of-readiness page at `/p/[slug]` | **Yes** |

Rules for the code:

- **One checkbox per purpose.** No bundled "I agree to the Terms and Privacy
  Policy and to receive updates". Bundling makes the whole consent defective.
- **Nothing is pre-ticked.** A pre-ticked box is not a clear affirmative action.
- **`notice_version` is mandatory** on every consent row. A consent record that
  cannot show *which notice the user read* proves nothing. Bump the version
  string whenever the notice text changes materially, and never edit a
  published notice in place — publish a new version.
- **Refusing an optional purpose must not degrade the core service.** If
  declining `analytics` blocks the dashboard, the consent was conditional and
  therefore invalid.
- **Withdrawal sets `withdrawn_at`.** It never deletes the row — the record is
  the evidence that consent existed for the period it covered. There is
  deliberately no delete policy on the table.
- **Check consent at the point of use, not at signup.** Before any PostHog
  call, before any WhatsApp send, before rendering a public profile.

### 2.3 Notice

The privacy notice must be **standalone** — its own page, not a section of the
Terms of Service — itemised, in plain language, and carry a version string that
matches what goes into `consents.notice_version`. It must state what we collect,
for which purpose, how long we keep it, who it is shared with, and how to
withdraw consent or complain.

### 2.4 Data we hold, and why

| Data | Purpose | Notes |
|---|---|---|
| Phone number | Authentication, service delivery | The primary identifier. Auth factor, so it cannot be optional. |
| Name | Addressing the user; the public profile if consented | Optional |
| College, batch year | Cohort placement; TPO reporting | Optional |
| Submissions and artifacts | Grading, peer review | Peer reviewers see the artifact, never the author's identity |
| Readiness scores | The product | **Profiling.** The reason for the 18+ rule. |
| Outcomes (interviews, offers) | Improving the path; evidence for claims | See §3 |
| TPO name and phone | B2B relationship | Personal data of a named individual. **Never exposed to students** — that is why they read the `public_colleges` view, which does not contain those columns. |

### 2.5 Rights, retention, breach

- **Access, correction, erasure, grievance.** Every one of these needs a
  working path before launch, not after the first request. Erasure runs through
  an audited server-side route, never a client holding the anon key.
- **Erasure has a limit.** We do not delete `outcomes` rows or consent records
  on request without legal review: one is the evidence base for any claim we
  make, the other is the evidence that we had permission. Anonymise rather than
  delete where the law allows, and get advice on where it does.
- **Retention must be stated and finite.** "Forever" is not a retention period.
- **Breach notification is mandatory and fast.** Have the runbook written
  before you need it; see `docs/RUNBOOK.md`.
- **Region.** The Supabase project is `ap-south-1` (Mumbai). Do not add a
  processor in another region without checking transfer rules first — that
  includes analytics and any model provider.

---

## 3. What we may say — advertising claims

The CCPA polices misleading advertisements under the Consumer Protection Act,
and has given the coaching and education sector specific attention: success
claims, selective use of toppers, and disclaimers that quietly contradict the
headline are all live enforcement areas. Fines have been levied against much
larger edtech companies for exactly this.

### Banned outright

No string anywhere in the product, the marketing site, an ad, a WhatsApp
template, or a college deck may contain:

- "guaranteed" (in relation to a job, placement, or outcome)
- "100% placement"
- "job assured", "placement assured", "assured selection"
- Any figure implying a placement rate we cannot evidence per §3.1

A CI check greps for the first three. The fourth needs a human.

### Also prohibited, less obviously

- **Selective toppers.** Showing three success stories out of a cohort of two
  hundred, without the denominator, is misleading by omission.
- **Disclaimers that contradict the claim.** A headline promising an outcome
  cannot be rescued by fine print retracting it.
- **Borrowed credibility.** Company logos under "our students work at" unless
  we hold documented, consented proof for a current, non-trivial number.
- **Fabricated scarcity.** "2 seats left" must be true.
- **Unearned comparatives.** "India's best" needs a basis.

### What we say instead

Describe the process, not the outcome. The honest version is also the more
credible one:

> Six weeks. Six artifacts, graded against a rubric you can read before you
> start. A profile you can show anyone. We do not promise you a job.

The landing page already says the second half of that out loud. Keep it.

### 3.1 Outcome claims and the evidence bar

`outcomes.source` has three values and only one of them may ever appear in
public:

| `source` | Meaning | May we publish it? |
|---|---|---|
| `self_reported` | The student told us | **No** |
| `tpo_confirmed` | The placement officer confirmed | **No** |
| `document_verified` | We hold the offer letter or equivalent | **Yes — with written consent on file** |

Both conditions are required. A verified offer letter without consent to
publicise it is still not publishable. Any aggregate statistic must be
computable from `document_verified` rows alone, and must state its denominator
and its period.

This is why `outcomes` rows are never deleted.

---

## 4. AI and grading

Law 1 is a cost rule, but it has a legal edge:

- **Never send third-party content to a model.** Not a transcript, not an
  article body. Student submissions are fine; the resource they watched is not.
- **Never send more personal data than the rubric needs.** The grader needs the
  artifact, not the student's phone number.
- **AI output is a score, not a verdict on a person.** Every AI grade must be
  overridable by a human, and the override path must exist before the grader
  ships. An automated decision a student cannot contest is a problem in itself.
- **Say that grading is automated.** Do not imply a human read it when a model
  did.

---

## 5. Before anything ships publicly

- [ ] Standalone, itemised privacy notice, live, with a version string
- [ ] Terms of Service, separate from the privacy notice
- [ ] Refund and cancellation policy — required for online payments
- [ ] Contact details and grievance officer published
- [ ] 18+ gate on every signup path, including bulk campus enrolment
- [ ] One consent checkbox per purpose, none pre-ticked, none bundled
- [ ] `notice_version` written on every consent row
- [ ] Withdrawal path works and is no harder than granting
- [ ] Access / correction / erasure paths work
- [ ] No banned claim strings anywhere, including WhatsApp templates
- [ ] No published statistic that is not computable from `document_verified`
- [ ] YouTube rendered only via the official `youtube-nocookie.com` embed
- [ ] No video gated behind a quiz
- [ ] `resources` has no content-bearing column
- [ ] Analytics and WhatsApp both gated on their specific consent at call time
- [ ] **A lawyer has read §7 and this checklist**

---

## 6. Where these rules live in the code

| Rule | Enforced by |
|---|---|
| RLS on every table; no Law 2 content column; no bare `auth.uid()` | `scripts/assert-schema-rules.mjs`, CI |
| Same, verified against the live catalog | `supabase/tests/schema_guarantees.sql`, CI |
| 18+ hard gate | `profiles_must_be_adult` CHECK constraint |
| One live consent per purpose | `consents_one_active_per_purpose` index |
| TPO contact details never reach students | `public_colleges` view |
| Service-role key never in a client bundle | `@jintu/config/eslint/next` |
| Laws restated at review time | `.github/pull_request_template.md` |

A rule with no enforcement is a rule that will be broken by a tired person on a
Friday. If you add a rule here, add the check too.

---

## 7. Unverified — a lawyer must confirm before launch

Everything in this section is restated from `ARCHITECTURE.md` or from general
reading. **None of it has been verified by a qualified person**, and some of it
is time-sensitive in a way that makes today's answer wrong next quarter.

1. **DPDP Rules commencement dates and the compliance deadline.** The
   architecture doc states full compliance is due **13 May 2027** and that
   Consent Manager registration opens around **November 2026**. Confirm both,
   and confirm which obligations bite earlier.
2. **Whether we must register with, or route consent through, a Consent
   Manager**, and what that means for the `consents` table.
3. **The penalty schedule.** The architecture doc cites **₹200 crore** exposure
   for children's-data failures. Confirm the figure and which breaches attract
   it.
4. **Exactly which processing is prohibited for children**, and whether any
   reading of the Act would permit a 17-year-old on a non-scored track. We
   assume not, and have built as though not.
5. **Whether readiness scoring triggers any additional obligation** as
   automated decision-making or profiling of adults.
6. **The BYJU'S penalty** cited in `ARCHITECTURE.md` (₹10 lakh, CCPA, for
   unevidenced success claims) — confirm amount, authority, and date before
   repeating it anywhere outside this repo.
7. **The CCPA coaching-sector advertising guidelines** — obtain the current
   text. They are more specific than the general misleading-advertisement rules
   and may impose disclosure duties we have not designed for.
8. **Whether we are a "coaching centre"** under those guidelines, or a
   cohort-based course outside their scope. This materially changes §3.
9. **YouTube Terms of Service and API Services Terms, current text.** Confirm
   that metadata retrieval and IFrame embedding as we do them are within scope,
   and whether attribution or branding requirements apply.
10. **GST treatment and invoicing requirements** for both B2C enrolments and
    B2B college contracts.
11. **Refund policy requirements** for online course sales.
12. **Whether peer review creates any obligation** around students seeing each
    other's work, even anonymised.
13. **Data transfer implications** of any processor outside India — the model
    provider especially.

---

## 8. If you are about to do something this document does not cover

Ask, in this order:

1. Does it store, transform, or substitute for someone else's content? → §1
2. Does it touch a phone number, a score, or anything about a person? → §2
3. Does it make a claim a prospective student might rely on? → §3
4. Still unsure? Do not ship it. Ask a lawyer. The cost of asking is a few
   thousand rupees; §7 item 3 is the cost of not asking.
