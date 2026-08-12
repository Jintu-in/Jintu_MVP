// GENERATED from packages/grading/src by scripts/build-deno-grading.mjs.
// Do not edit: edit the package source and re-run the build. CI fails on drift.
import { describeDifference, diffResults } from "./compare.ts";
import {
  hasTableAliases,
  joinsWithoutCondition,
  planHasCrossJoin,
  usesSelectStar,
} from "./readability.ts";
import type { CriterionResult, QueryRunner, SqlAssignmentSpec, SqlGrade } from "./types.ts";

/**
 * Grades a SQL submission by running it. Zero AI cost — Law 1's whole point is
 * that this path never reaches a model.
 *
 * Weights come from the rubric when the caller passes one, and from the
 * defaults below when it does not. The defaults exist for two reasons: legacy
 * callers and tests predate rubric-driven weights, and the shipped
 * sql-correctness-v1 rubric carries exactly these keys at exactly these
 * weights — so reading from the rubric and falling back to the constants
 * produce identical grades, which is what makes this change safe against
 * work that has already been graded.
 */
const DEFAULT_WEIGHTS = {
  returns_expected_rows: 3,
  no_cartesian: 1,
  readable: 1,
} as const;

/** The criteria this grader knows how to judge. Fixed by what the code does. */
const KNOWN_KEYS = Object.keys(DEFAULT_WEIGHTS) as (keyof typeof DEFAULT_WEIGHTS)[];

export const SQL_MAX_SCORE = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);

/** The shape a rubric criterion arrives in. `checker`/`check` ride along untouched. */
export type RubricCriterion = { key: string; weight: number };

/**
 * The weights this run will grade at.
 *
 * From the rubric: only the keys this grader implements, at the rubric's
 * weights. Rubric keys the grader does not know are NOT errors — they belong
 * to other checkers or to peers, per their own `checker` field — they are
 * simply not this grader's to score.
 *
 * Returns null when a rubric was provided but contains nothing this grader
 * can judge. That is a track-authoring mistake, and the caller routes it to
 * a human rather than grading against criteria the student never saw —
 * "graded against the rubric you read before paying" is the promise, and
 * silently substituting the defaults would break it.
 */
function effectiveWeights(
  rubricCriteria?: RubricCriterion[],
): Record<string, number> | null {
  if (!rubricCriteria || rubricCriteria.length === 0) return { ...DEFAULT_WEIGHTS };

  const known = rubricCriteria.filter(
    (c) => (KNOWN_KEYS as string[]).includes(c.key) && Number.isFinite(c.weight) && c.weight > 0,
  );
  if (known.length === 0) return null;

  return Object.fromEntries(known.map((c) => [c.key, c.weight]));
}

export async function gradeSqlSubmission(
  submittedSql: string,
  spec: SqlAssignmentSpec,
  runner: QueryRunner,
  rubricCriteria?: RubricCriterion[],
): Promise<SqlGrade> {
  const weights = effectiveWeights(rubricCriteria);

  if (weights === null) {
    // Deliberately not a zero score. A zero says the student failed; this
    // says the track is misconfigured, and only one of those is true.
    return {
      criteria: [],
      total: 0,
      maxScore: 0,
      error:
        "The rubric on this assignment has no criteria this grader implements. " +
        "The track needs fixing — the submission is untouched and needs a human.",
    };
  }

  const maxScore = Object.values(weights).reduce((a, b) => a + b, 0);
  const allFailed = (detail: string): CriterionResult[] =>
    Object.entries(weights).map(([key, weight]) => ({ key, weight, passed: false, detail }));

  const empty = submittedSql.trim() === "";
  if (empty) {
    return {
      criteria: allFailed("Nothing was submitted."),
      total: 0,
      maxScore,
      error: "Nothing was submitted.",
    };
  }

  let actual;
  try {
    actual = await runner.run(submittedSql);
  } catch (e) {
    // A query that does not run scores zero, but the student gets the
    // database's own message — it is almost always the most useful sentence
    // anyone could write about what is wrong.
    const message = e instanceof Error ? e.message : String(e);
    return {
      criteria: allFailed(`The query did not run: ${message}`),
      total: 0,
      maxScore,
      error: message,
    };
  }

  const criteria: CriterionResult[] = [];

  // ── correctness ────────────────────────────────────────────────────────────
  if (weights.returns_expected_rows) {
    const differences = diffResults(spec.expected, actual, spec.orderMatters);
    criteria.push({
      key: "returns_expected_rows",
      weight: weights.returns_expected_rows,
      passed: differences.length === 0,
      detail:
        differences.length === 0
          ? "Returns exactly the expected result."
          : differences.slice(0, 3).map(describeDifference).join(" "),
    });
  }

  // ── no accidental cross join ───────────────────────────────────────────────
  if (weights.no_cartesian) {
    let crossJoin = joinsWithoutCondition(submittedSql);
    let planChecked = false;
    if (runner.explain) {
      try {
        crossJoin = planHasCrossJoin(await runner.explain(submittedSql)) || crossJoin;
        planChecked = true;
      } catch {
        // Plan unavailable — fall back to the lexical check rather than
        // penalising a student for our infrastructure.
      }
    }
    criteria.push({
      key: "no_cartesian",
      weight: weights.no_cartesian,
      passed: !crossJoin,
      detail: crossJoin
        ? "The query builds a cross product: every row of one table is paired with every row of another. Add the join condition."
        : planChecked
          ? "No cross product in the query plan."
          : "No obvious cross product.",
    });
  }

  // ── readability ────────────────────────────────────────────────────────────
  if (weights.readable) {
    const notes: string[] = [];
    if (usesSelectStar(submittedSql)) notes.push("select * — name the columns you need.");
    if (!hasTableAliases(submittedSql)) {
      notes.push(
        "Several tables and no aliases; a reviewer has to guess where each column comes from.",
      );
    }
    criteria.push({
      key: "readable",
      weight: weights.readable,
      passed: notes.length === 0,
      detail: notes.length === 0 ? "Readable as written." : notes.join(" "),
    });
  }

  return {
    criteria,
    total: criteria.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0),
    maxScore,
    error: null,
  };
}
