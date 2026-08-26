/**
 * Amazon Ads & retail media — twenty-seven days, five weeks.
 *
 * BACKFILLED to COURSE_STANDARD. Every title, summary, learning objective and
 * link is the original spec's, unchanged. What is new is the day-page model:
 * each of the twenty-seven days now carries a why-today, a principle, the
 * mistake, a challenge with an artefact, three to five topics with detail
 * lines, and three comprehension checks — plus interview questions where the
 * subject warrants one.
 *
 * That model shipped in migration 0010 and was never authored into. Until
 * now every day here rendered two of six sections, which reads as an empty
 * page next to Git or Excel.
 *
 * RE-CUT FROM THIRTEEN WEEKS TO FIVE. Twenty-seven days over thirteen weeks
 * is 2.1 a week, and the streak resets on a missed day — so the product
 * punished a reader for finishing the material it gave them. Five weeks is
 * 5.4 a week, which a streak can survive. The content is identical; only the
 * stated span changed, and the span was always a claim about size rather
 * than a schedule.
 *
 * FIVE DAYS CARRY NO EXTERNAL LINKS, deliberately: day 10 (when high ACoS is
 * correct), 15 (the daily rep), 16 (naming conventions), and 27 (the
 * capstone) are days where the work is doing something rather than reading
 * something. Each renders five sections without a Read & do, which is honest.
 * Day 13 gained one — the impression-share definitions live in the Ads help
 * centre rather than the Academy.
 *
 * Sourcing: Amazon's own documentation and the free Ads Academy throughout.
 * The four certifications are free; the exams cost nothing and are
 * retakeable, which day 26 says on its face.
 */
import m01to04 from "./amazon-ads/modules-01-04.mjs";
import m05to11 from "./amazon-ads/modules-05-11.mjs";

export default {
  slug: "amazon-ads",
  title: "Amazon Ads & retail media",
  summary:
    "Twenty-seven days from retail readiness to clean-room SQL and incrementality — for sellers on Amazon.in and agency account managers alike.",
  subjectTags: ["marketing", "amazon-ads", "ecommerce", "retail-media", "advertising", "sql"],
  category: "business",
  difficulty: "intermediate",
  estimatedWeeks: 5,
  licenseNote: null,

  modules: [...m01to04, ...m05to11],
};
