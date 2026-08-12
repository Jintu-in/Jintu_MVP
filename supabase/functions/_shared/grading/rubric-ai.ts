// GENERATED from packages/grading/src by scripts/build-deno-grading.mjs.
// Do not edit: edit the package source and re-run the build. CI fails on drift.
/**
 * The pure half of rubric_ai — the only grader that costs money.
 *
 * Everything here is arithmetic and string handling: what the prompt says,
 * what a well-formed verdict looks like, and what a call costs in paise.
 * The half that actually spends — the fetch, the budget reservation, the
 * ledger row — lives in the app, because it needs the service client and
 * this package deliberately has no runtime dependencies.
 *
 * Two rules shape everything below:
 *
 * 1. Costing is fail-closed. A model this table does not price cannot be
 *    called, because a call we cannot price is a call we cannot budget.
 * 2. Parsing is fail-closed. A verdict is either exactly the shape the
 *    rubric demands — every ai criterion scored, every score within its
 *    weight — or it is refused whole and a human grades instead. There is
 *    no salvaging half a verdict.
 */

export type AiCriterion = {
  key: string;
  label: string;
  weight: number;
  check?: string;
};

export type RubricAiVerdict =
  | { ok: true; scores: Record<string, number>; total: number; feedback: string }
  | { ok: false; error: string };

/** The criteria a model is allowed to score. Everything else is peers or machines. */
export function aiCriteria(criteria: readonly AiCriterion[] | null | undefined): AiCriterion[] {
  return (criteria ?? []).filter((c) => c.check === "rubric_ai");
}

// ─────────────────────────────────────────────────────────────────────────────
// pricing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Paise per million tokens, by model. Prices are the published USD rates
 * converted at a deliberately unfavourable ₹90/USD, so the estimate errs
 * expensive and the budget guard errs cautious. Adding a model here is a
 * reviewed change — it is the price list, not a config file.
 */
const PRICE_PAISE_PER_MTOK: Record<string, { input: number; output: number }> = {
  // $1 in / $5 out per MTok
  "claude-haiku-4-5-20251001": { input: 9_000, output: 45_000 },
};

export const RUBRIC_AI_MODEL = "claude-haiku-4-5-20251001";

/** The verdict is a few sentences and a handful of integers. */
export const RUBRIC_AI_MAX_OUTPUT_TOKENS = 700;

/**
 * Worst-case cost of a call, before it is made. Overestimates on purpose:
 * input tokens from a 3-chars-per-token floor (English runs ~4), output at
 * the full max_tokens. Returns null for an unpriced model — the caller must
 * treat that as "do not call", not as free.
 */
export function estimateCostPaise(
  model: string,
  inputChars: number,
  maxOutputTokens: number,
): number | null {
  const price = PRICE_PAISE_PER_MTOK[model];
  if (!price) return null;
  const inputTokens = Math.ceil(inputChars / 3);
  const paise =
    (inputTokens * price.input + maxOutputTokens * price.output) / 1_000_000;
  return Math.max(1, Math.ceil(paise));
}

/** Actual cost from the usage block the API returned. Null for an unpriced model. */
export function actualCostPaise(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number | null {
  const price = PRICE_PAISE_PER_MTOK[model];
  if (!price) return null;
  const paise = (inputTokens * price.input + outputTokens * price.output) / 1_000_000;
  return Math.max(1, Math.ceil(paise));
}

// ─────────────────────────────────────────────────────────────────────────────
// prompt
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One prompt, one submission, one verdict. The model is a marker with a
 * rubric, not an assistant: it sees the assignment, the criteria it may
 * score, and the student's prose, and it must answer in JSON or its answer
 * is thrown away. It is told the feedback goes to the student, because
 * "terse but addressed to the author" reads very differently from a note
 * to the file.
 */
export function buildRubricPrompt(args: {
  assignmentPrompt: string;
  criteria: readonly AiCriterion[];
  prose: string;
}): { system: string; user: string } {
  const rubricLines = args.criteria
    .map((c) => `- "${c.key}" (0 to ${c.weight}): ${c.label}`)
    .join("\n");

  return {
    system: [
      "You mark one student submission against a fixed rubric.",
      "Score every criterion listed — no more, no fewer. Scores are integers.",
      "Reply with ONLY a JSON object, no markdown fences, in this shape:",
      '{"scores": {"<criterion key>": <integer>}, "feedback": "<2-4 sentences addressed to the student>"}',
      "The feedback must justify the scores from what the submission says, quote or point at specifics, and never invent facts that are not in the submission.",
    ].join("\n"),
    user: [
      `The assignment: ${args.assignmentPrompt}`,
      "",
      "The criteria you score:",
      rubricLines,
      "",
      "The student's submission:",
      "<submission>",
      args.prose,
      "</submission>",
    ].join("\n"),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// verdict
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Accepts exactly one shape and refuses everything else. Hand-rolled rather
 * than schema-library-backed so this package keeps zero dependencies; the
 * checks are the documentation of the contract.
 */
export function parseRubricVerdict(
  text: string,
  criteria: readonly AiCriterion[],
): RubricAiVerdict {
  // Models fence JSON in markdown no matter how firmly asked not to.
  const bare = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(bare);
  } catch {
    return { ok: false, error: "the verdict was not valid JSON" };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: "the verdict was not a JSON object" };
  }

  const { scores, feedback } = parsed as { scores?: unknown; feedback?: unknown };
  if (typeof scores !== "object" || scores === null || Array.isArray(scores)) {
    return { ok: false, error: "the verdict carries no scores object" };
  }
  if (typeof feedback !== "string" || feedback.trim().length === 0) {
    return { ok: false, error: "the verdict carries no feedback" };
  }
  if (feedback.length > 2_000) {
    return { ok: false, error: "the feedback is implausibly long" };
  }

  const given = scores as Record<string, unknown>;
  const out: Record<string, number> = {};
  let total = 0;

  for (const c of criteria) {
    const value = given[c.key];
    if (typeof value !== "number" || !Number.isInteger(value)) {
      return { ok: false, error: `criterion "${c.key}" was not scored with an integer` };
    }
    if (value < 0 || value > c.weight) {
      return {
        ok: false,
        error: `criterion "${c.key}" scored ${value}, outside 0..${c.weight}`,
      };
    }
    out[c.key] = value;
    total += value;
  }

  const expected = new Set(criteria.map((c) => c.key));
  for (const key of Object.keys(given)) {
    if (!expected.has(key)) {
      return { ok: false, error: `the verdict scored "${key}", which is not on the rubric` };
    }
  }

  return { ok: true, scores: out, total, feedback: feedback.trim() };
}
