/**
 * Thinking clearly under uncertainty — twenty-four days, five weeks.
 *
 * BACKFILLED to COURSE_STANDARD. Every title, summary, learning objective,
 * module objective, deliverable and link is the original owner curriculum's
 * (2026-08-13), unchanged. What is new is the day-page model: each of the
 * twenty-four days now carries a why-today, a principle, the mistake, a
 * challenge with an artefact, three to five topics with detail lines, and
 * three comprehension checks — plus interview questions on the three days
 * where the subject genuinely produces one.
 *
 * That model shipped in migration 0010 and was never authored into. Until
 * now every day here rendered two of six sections.
 *
 * RE-CUT FROM TEN WEEKS TO FIVE. Twenty-four days over ten weeks is 2.4 a
 * week, and the streak resets on a missed day — so the product punished a
 * reader for finishing the material it gave them. Five weeks is 4.8 a week.
 * The content is identical; only the stated span changed, and the span was
 * always a claim about size rather than a schedule. The module week ranges
 * moved with it, one module per week.
 *
 * ONE DAY CARRIES NO EXTERNAL LINK, deliberately: day 14, the Bayesian
 * diagnostic matrix, is a day where the work is doing the arithmetic on
 * your own thesis rather than reading something. It renders five sections
 * without a Read & do, which is honest.
 *
 * SELF-CHECKING: Good Judgment Open scores the learner's forecasts against
 * real resolutions. Day 23 registers there and day 24's capstone lives
 * there — the only place in this subject where something other than the
 * learner marks the work.
 *
 * METACULUS IS ABSENT, and it was in the original spec. The host returns
 * 403 to our link checker on every path, so rule 2 forbids publishing it —
 * the same call made for cdc.gov and hhs.gov in medical coding. Good
 * Judgment Open does the same job and can be verified, and day 23 now says
 * to keep one track record rather than spread across platforms, which was
 * the better advice anyway.
 *
 * Sourcing notes:
 * - LessWrong rate-limits automated fetches (429 on every attempt), which
 *   would fail --check on every regeneration. The Sequences therefore ship
 *   via readthesequences.com — the complete, stable community mirror — and
 *   the owner's LessWrong anchor is honoured through it.
 * - The owner's anti-pattern guardrails (no bias listicles, no resulting,
 *   no epistemic arrogance, no passive consumption) ride as editor notes
 *   on the nodes where each trap actually bites.
 * - Our World in Data is CC BY, so unlike most of this roadmap it may be
 *   quoted with attribution. Everything else is link-only.
 */
import m01to03 from "./thinking-under-uncertainty/modules-01-03.mjs";
import m04to05 from "./thinking-under-uncertainty/modules-04-05.mjs";

export default {
  slug: "thinking-under-uncertainty",
  title: "Thinking clearly under uncertainty",
  summary:
    "Twenty-four days of mental models, bias detection, Bayesian updating, data literacy and calibrated forecasting — the meta-skill behind every high-stakes decision, from free material only.",
  subjectTags: ["thinking", "decision-making", "statistics", "forecasting", "rationality"],
  category: "judgement",
  difficulty: "intermediate",
  estimatedWeeks: 5,
  cert: "none",
  reviewCadence: "annual",
  licenseNote: null,

  modules: [...m01to03, ...m04to05],
};
