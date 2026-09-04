/**
 * Startup finance & fundraising — forty-eight days, nine weeks.
 *
 * Built from the owner's brief (assets/Finance/roadmap-startup-finance.md,
 * 2026-09-03) for its first clearly-defined customer: a PGDM Finance
 * graduate going into startup and SME IPO advisory. Every module title, day
 * title, principle and deliverable is the brief's, verbatim. The rest of
 * the day-page model — why-today, mistakes, challenges, topics, checks —
 * is authored against COURSE_STANDARD.
 *
 * COMPRESSED FROM TEN WEEKS TO NINE, taking the brief's own instruction:
 * 48 days over 10 weeks is 4.8 a week, under the 5–7 streak target, and
 * the brief said compress or extend, never stretch. Nine weeks is 5.3.
 *
 * ANCHOR: DAMODARAN. His young-company material is the bridge this learner
 * needs — free, unpaywalled, and authored by the person the rest of the
 * field cites. Module 3 is built on it.
 *
 * WHAT IS ABSENT, AND WHY — rule 2 rulings, verified 2026-09-03/04:
 *   - NSE Emerge: nseindia.com returns 403 to the checker on every path.
 *     BSE SME and SEBI carry the same framework and can be verified.
 *     Day 43 tells the learner to compare both exchanges in practice.
 *   - MCA: mca.gov.in returns 403. Day 5's challenge sends the learner to
 *     the portal by name instead of linking it; RBI's FEMA page (which
 *     verifies) is day 5's citable primary source.
 *   - a16z: its classic essay URLs rotted (404). First Round's hub
 *     verifies and is cited hub-level on day 6; its deep links rot too
 *     and are not used.
 *
 * FOUR DAYS CARRY NO EXTERNAL LINK, deliberately: days 27, 30, 34 and 41
 * — the capstone, reconciliation, audit and memo days, where the work is
 * building or auditing an artefact the learner already has and any
 * reading would substitute for doing it. Each renders five sections
 * without a Read & do, which is honest.
 *
 * MODULES 1, 2 AND 3 ARE THE OWNER-AUTHORED REFERENCES (assets/Finance/
 * module-1/2/3-reference.md, received 2026-09-04/05):
 * their challenges, checks, topics and named sources replaced the
 * first-pass authoring, every URL verified before use. Module 3's
 * remaining generic asks (a brokerage report, a published startup DCF)
 * are challenge instructions, not links, by design.
 *
 * ANNUAL DATA REFRESH: Damodaran's data sets update early each year and
 * his site occasionally reorganises. The quarterly review should re-click
 * datacurrent.html, spreadsh.htm and the webcast index each January
 * especially — those are the links learners follow into their own work.
 *
 * NO SELF-CHECKING RESOURCE. Nothing free marks a cap table or an
 * investment memo. The deliverables carry the verification burden instead:
 * the cap-table model has stated sanity tests (day 13), the valuation
 * reconciliation is graded by its own sensitivity drill (day 20), and the
 * memo must contain its own falsifier (day 41).
 *
 * THE DISCLAIMER. This roadmap touches securities and regulated advisory
 * activity. licenseNote carries it — the one roadmap-level free-text field
 * the page renders — and the summary's last sentence repeats the short
 * form. A dedicated disclaimer surface is a UI follow-up; until then this
 * is the honest use of the field that exists.
 *
 * CONCEPT TAGS. Every day carries a `concepts` array keyed to
 * assets/Finance/finance-concepts.json. The importer ignores the field —
 * no per-day concept column exists yet — but the tagging is the raw
 * material for skip-what-you-know, authored now while it is cheap.
 *
 * REVIEW QUARTERLY. Modules 1, 6 and 7 depend on SEBI circulars, exchange
 * criteria and market practice. reviewCadence is quarterly and the module-7
 * days teach the pull-cite-date habit as content.
 */
import m01to04 from "./startup-finance/modules-01-04.mjs";
import m05to07 from "./startup-finance/modules-05-07.mjs";

export default {
  slug: "startup-finance",
  title: "Startup finance & fundraising",
  summary:
    "Forty-eight days from the funding ladder to a filed DRHP: cap tables, startup valuation, unit economics, diligence and the Indian SME IPO route — for finance graduates entering startup advisory. Educational material about method, not investment advice.",
  subjectTags: ["finance", "fundraising", "valuation", "startup", "cap-table", "ipo"],
  category: "business",
  difficulty: "intermediate",
  estimatedWeeks: 9,
  cert: "none",
  reviewCadence: "quarterly",
  requires: [
    {
      slug: "excel-at-work",
      note: "Suggested, not required. The cap table, the operating model and the diligence work all live in Excel, and module 2 assumes lookup fluency from day 9.",
    },
  ],
  licenseNote:
    "Not investment advice. This roadmap teaches how finance professionals analyse startups and public offerings. It is educational material about method, not a recommendation about any security, company or transaction. Regulations change; verify anything you rely on professionally against the current SEBI circular.",

  modules: [...m01to04, ...m05to07],
};
