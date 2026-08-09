/**
 * Deterministic grading for SQL assignments.
 *
 * Weeks 1-2 are graded by running the query and diffing the result, which
 * costs nothing (ARCHITECTURE.md §4, Law 1). Only prose reaches a model.
 *
 * This package is runtime-pure: it must run inside Next server actions (Node)
 * AND inside Supabase Edge Functions (Deno), so it imports no Node built-ins
 * and opens no connections. The database is injected as a `QueryRunner`, which
 * also means the tests can drive it with an in-process Postgres and the edge
 * function can drive it with a pooled connection, without the grading logic
 * knowing the difference.
 */

export type Cell = string | number | boolean | null;
export type Row = Record<string, Cell>;

export type QueryResult = {
  columns: string[];
  rows: Row[];
};

/**
 * Executes untrusted student SQL.
 *
 * Implementations MUST enforce, at the database:
 *   - a read-only transaction, so a submission cannot write or drop anything
 *   - a statement timeout, so a cartesian product cannot pin a CPU
 * Neither can be enforced here: this package cannot see the connection.
 */
export type QueryRunner = {
  run: (sql: string) => Promise<QueryResult>;
  /** Query plan as JSON, used to detect an accidental cross join. */
  explain?: (sql: string) => Promise<unknown>;
};

export type SqlAssignmentSpec = {
  /** The reference query's result, computed when the assignment was authored. */
  expected: QueryResult;
  /**
   * Whether row order is part of the answer. True when the prompt says
   * "top ten by revenue" — the ordering IS the question.
   */
  orderMatters: boolean;
};

export type CriterionResult = {
  key: string;
  passed: boolean;
  weight: number;
  /** Shown to the student. Says what is wrong, not merely that something is. */
  detail: string;
};

export type SqlGrade = {
  criteria: CriterionResult[];
  total: number;
  maxScore: number;
  /** Set when the query could not run at all. */
  error: string | null;
};
