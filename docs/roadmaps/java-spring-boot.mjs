/**
 * Java & Spring Boot 3 backend developer — thirty-eight days, eight weeks.
 *
 * BACKFILLED to COURSE_STANDARD. Every title, summary, learning objective,
 * module objective, deliverable and link is the original owner curriculum's
 * (2026-08-13), unchanged. What is new is the day-page model: each of the
 * thirty-eight days now carries a why-today, a principle, the mistake, a
 * challenge with an artefact, three to five topics with detail lines, and
 * three comprehension checks — plus interview questions on the four days
 * where this stack genuinely produces one.
 *
 * That model shipped in migration 0010 and was never authored into. Until
 * now every day here rendered two of six sections.
 *
 * RE-CUT FROM FOURTEEN WEEKS TO EIGHT. Thirty-eight days over fourteen weeks
 * is 2.7 a week, and the streak resets on a missed day — so the product
 * punished a reader for finishing the material it gave them. Eight weeks is
 * 4.75 a week, one module per week, and the module boundaries already fell
 * that way. The content is identical; only the stated span changed, and the
 * span was always a claim about size rather than a schedule.
 *
 * ONE DAY CARRIES NO EXTERNAL LINK, deliberately: day 37, the capstone build,
 * is a day where the work is building rather than reading. It renders five
 * sections without a Read & do, which is honest.
 *
 * SELF-CHECKING: SQLBolt (day 12) and pgexercises (day 13) both mark the
 * learner's SQL. Nothing in the Java half of the roadmap does — the free
 * Java exercise platforms either require an account we cannot verify or fail
 * our link checker, so the challenges carry that burden instead, and the
 * capstone's concurrency requirement is the one test that cannot be faked.
 *
 * Explicitly Java 17+ (LTS) and Spring Boot 3.x / Spring Framework 6. The
 * owner's legacy guardrails ride as principles and common-mistake lines on
 * the days where the traps actually live, because over half the free Java
 * content online still teaches Java 8 / Spring Boot 2 idioms:
 *   - jakarta.* imports, never javax.*                    (days 23, 25)
 *   - SecurityFilterChain @Bean, never WebSecurityConfigurerAdapter (31)
 *   - requestMatchers(), never antMatchers()              (31)
 *   - Java Records over verbose DTOs                      (4, 22)
 *   - constructor injection, never field @Autowired       (17)
 *
 * Anchors per the owner's source matrix: dev.java + official docs (core),
 * Telusko and Java Brains (concept videos, channel links until specific
 * ids are verified), Baeldung (patterns), spring.io/guides (walk-throughs).
 * Every URL here resolved live on 2026-08-13; --check re-verifies before
 * any paste can publish.
 */
import m01to03 from "./java-spring-boot/modules-01-03.mjs";
import m04to06 from "./java-spring-boot/modules-04-06.mjs";
import m07to08 from "./java-spring-boot/modules-07-08.mjs";

export default {
  slug: "java-spring-boot",
  title: "Java & Spring Boot backend developer",
  summary:
    "Thirty-eight days from zero to a deployed backend: modern Java 17+, SQL, Spring Boot 3, JPA, security and testing — the highest-volume fresher hiring stack in India, on free content only.",
  subjectTags: ["java", "spring-boot", "backend", "sql", "programming"],
  category: "software",
  difficulty: "beginner",
  estimatedWeeks: 8,
  cert: "none",
  reviewCadence: "annual",
  // Day one opens a terminal and clones a repository, and the roadmap never
  // says so. 0020 makes that assumption an edge instead of a surprise: an
  // eight-week commitment with a two-week first step is a different offer.
  requires: [{ slug: "git-and-github", note: "Day one clones a repository and never explains how." }],
  licenseNote: null, // hand-curated link by link; nothing imported wholesale

  modules: [...m01to03, ...m04to06, ...m07to08],
};
