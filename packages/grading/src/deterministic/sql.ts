import { describeDifference, diffResults } from "./compare";
import {
  hasTableAliases,
  joinsWithoutCondition,
  planHasCrossJoin,
  usesSelectStar,
} from "./readability";
import type { CriterionResult, QueryRunner, SqlAssignmentSpec, SqlGrade } from "./types";

/**
 * Grades a SQL submission by running it. Zero AI cost — Law 1's whole point is
 * that this path never reaches a model.
 *
 * Weights match the `sql-correctness-v1` rubric that students can read before
 * they start (docs/LEGAL.md §3 — the landing page promises exactly that).
 */
const WEIGHTS = {
  returns_expected_rows: 3,
  no_cartesian: 1,
  readable: 1,
} as const;

export const SQL_MAX_SCORE = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

export async function gradeSqlSubmission(
  submittedSql: string,
  spec: SqlAssignmentSpec,
  runner: QueryRunner,
): Promise<SqlGrade> {
  const criteria: CriterionResult[] = [];

  const empty = submittedSql.trim() === "";
  if (empty) {
    return {
      criteria: Object.entries(WEIGHTS).map(([key, weight]) => ({
        key,
        weight,
        passed: false,
        detail: "Nothing was submitted.",
      })),
      total: 0,
      maxScore: SQL_MAX_SCORE,
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
      criteria: Object.entries(WEIGHTS).map(([key, weight]) => ({
        key,
        weight,
        passed: false,
        detail: `The query did not run: ${message}`,
      })),
      total: 0,
      maxScore: SQL_MAX_SCORE,
      error: message,
    };
  }

  // ── correctness ────────────────────────────────────────────────────────────
  const differences = diffResults(spec.expected, actual, spec.orderMatters);
  criteria.push({
    key: "returns_expected_rows",
    weight: WEIGHTS.returns_expected_rows,
    passed: differences.length === 0,
    detail:
      differences.length === 0
        ? "Returns exactly the expected result."
        : differences.slice(0, 3).map(describeDifference).join(" "),
  });

  // ── no accidental cross join ───────────────────────────────────────────────
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
    weight: WEIGHTS.no_cartesian,
    passed: !crossJoin,
    detail: crossJoin
      ? "The query builds a cross product: every row of one table is paired with every row of another. Add the join condition."
      : planChecked
        ? "No cross product in the query plan."
        : "No obvious cross product.",
  });

  // ── readability ────────────────────────────────────────────────────────────
  const notes: string[] = [];
  if (usesSelectStar(submittedSql)) notes.push("select * — name the columns you need.");
  if (!hasTableAliases(submittedSql)) {
    notes.push("Several tables and no aliases; a reviewer has to guess where each column comes from.");
  }
  criteria.push({
    key: "readable",
    weight: WEIGHTS.readable,
    passed: notes.length === 0,
    detail: notes.length === 0 ? "Readable as written." : notes.join(" "),
  });

  return {
    criteria,
    total: criteria.reduce((sum, c) => sum + (c.passed ? c.weight : 0), 0),
    maxScore: SQL_MAX_SCORE,
    error: null,
  };
}
