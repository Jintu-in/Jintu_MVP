import { z } from "zod";

/**
 * The answer key a SQL assignment is graded against, as it comes out of
 * `public.assignment_answer_keys`.
 *
 * That column set is jsonb and text, which means the database will accept
 * almost anything and the first thing to discover a malformed key would
 * otherwise be the grader, at 2am, on a student's submission. Parsing it
 * through here turns that into a submission that stays visibly ungraded and
 * an error in the log, rather than a zero against someone's work.
 *
 * Why the fixture lives in a row rather than in a container image:
 * ARCHITECTURE.md §4 calls the SQL grader a "containerised runner", and the
 * container was always going to be the expensive part of it. A week-one
 * fixture is a few dozen rows. Shipping it as SQL text means the grader needs
 * no image registry, no warm pool and no network, and it means the assignment
 * and the data it is graded against are versioned together — a published path
 * is immutable and so is its answer key, so neither can drift out from under
 * a cohort mid-sprint.
 *
 * Field names are the database's, not JavaScript's. This object is a row.
 */

const cell = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const queryResult = z.object({
  columns: z.array(z.string()),
  rows: z.array(z.record(z.string(), cell)),
});

export const sqlAnswerKey = z.object({
  /**
   * DDL and rows, applied to an empty database before the student's query
   * runs. Authored input, not student input: it runs with full rights,
   * because it has to create tables.
   */
  setup: z.string().min(1),
  /** The reference answer, captured when the assignment was authored. */
  expected: queryResult,
  /**
   * True when the prompt made ordering part of the question ("top three by
   * revenue"). Default false: marking a correct answer wrong because the rows
   * came back in another order is the worse of the two failures.
   */
  order_matters: z.boolean().default(false),
});

export type SqlAnswerKey = z.infer<typeof sqlAnswerKey>;

/**
 * A peer's marks. Keys are rubric criterion keys, values are the points given
 * for that criterion.
 *
 * The keys are not checked here — this schema cannot know which rubric the
 * assignment carries. The server action loads the rubric and rejects any key
 * it does not name and any value above that criterion's weight, which is also
 * the only place the check can be made against the real thing.
 */
export const peerReviewInput = z.object({
  peerReviewId: z.string().uuid(),
  scores: z.record(z.string(), z.number().min(0).max(100)),
  feedback: z
    .string()
    .trim()
    .min(20, "Write at least a sentence — a number on its own tells them nothing.")
    .max(2000, "Keep it under 2000 characters."),
});

export type PeerReviewInput = z.infer<typeof peerReviewInput>;
