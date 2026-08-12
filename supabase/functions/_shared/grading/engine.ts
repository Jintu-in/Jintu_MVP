// GENERATED from packages/grading/src by scripts/build-deno-grading.mjs.
// Do not edit: edit the package source and re-run the build. CI fails on drift.
import { CHECKERS, CHECKER_NAMES, parseCheck, type CheckerName } from "./registry.ts";

/**
 * The grade() orchestrator and the platform rules as code — README's second
 * half. Pure like everything here: the impure edges (answer keys, budget,
 * the model call) arrive through ctx as functions, so the same file runs in
 * Node and Deno and every test can hand in fakes.
 *
 * Three rules this file owns:
 *
 *   1. A checker that errors is never a pass and never a silent zero — it
 *      routes the criterion to pendingHuman and clears fullyVerified.
 *   2. evidencedScore counts only executable/detectable/structural points.
 *      That is the number a public profile may show; `score` includes the
 *      model's opinion and is for the learner's own progress.
 *   3. rubric_score cannot pay without evidence: an empty or fabricated
 *      quote zeroes the criterion no matter what the model claimed, and the
 *      score is clamped to the declared weight because we sum, not it.
 */

const MACHINE = new Set(["executable", "detectable", "structural"]);

export type EngineCriterion = {
  key: string;
  label: string;
  weight: number;
  /** Archetype: executable | detectable | structural | rubric_ai | peer | mentor_sample */
  check?: string | null;
  /** Registry spec, e.g. "duration_between:60,180". Null for peer/mentor rows. */
  checker?: string | null;
};

export type EngineRubric = { name?: string; criteria: EngineCriterion[] };

export type EngineSubmission = {
  id: string;
  /** The learner's own material: text, sql, findings, url, cells… */
  payload?: Record<string, unknown>;
  /** What adapters produced: sqlResults, mediaProbe, parsedCells, priorSubmissions… */
  facts?: Record<string, unknown>;
  /** Service-role reference to the private key, resolved via ctx.loadKey. */
  answerKeyRef?: string | null;
};

export type GradeCtx = {
  /** Service-role only. Never client-reachable. */
  loadKey?: (ref: string) => Promise<unknown | null>;
  /** The spend gate. Absent = no budget = the paid checker never runs. */
  budgetOk?: () => Promise<boolean>;
  /** The one paid call. Returns the model's raw text and what it cost. */
  callModel?: (prompt: string) => Promise<{ text: string; costPaise: number }>;
  /** Feedback policy: examples per refusal. Three teach; twenty are the answer sheet. */
  maxExamples?: number;
};

export type CriterionResult = {
  key: string;
  passed: boolean;
  points: number;
  weight: number;
  verification: string;
  detail: string;
  /** rubric_score only: the exact span that earned the points. */
  evidence?: string;
};

export type GradeReport = {
  submissionId: string;
  results: CriterionResult[];
  /** Everything, including the model's opinion. The learner's own number. */
  score: number;
  /** Executable + detectable + structural only. The publishable number. */
  evidencedScore: number;
  /** Criteria no machine could settle — errors, missing keys, peer rows, dry budget. */
  pendingHuman: { key: string; reason: string }[];
  fullyVerified: boolean;
  costPaise: number;
};

/**
 * Grades one submission against one rubric. Never throws: every failure mode
 * is a pendingHuman entry, because a learner must not lose points to our bug
 * nor gain them from one.
 */
export async function grade(
  submission: EngineSubmission,
  rubric: EngineRubric,
  ctx: GradeCtx = {},
): Promise<GradeReport> {
  const results: CriterionResult[] = [];
  const pendingHuman: { key: string; reason: string }[] = [];
  let costPaise = 0;

  // The key is loaded once, up front, through the service-role edge —
  // checkers only ever see plain data on their input.
  let key: unknown | null = null;
  let keyFailed = false;
  if (submission.answerKeyRef && ctx.loadKey) {
    try {
      key = await ctx.loadKey(submission.answerKeyRef);
      if (key === null) keyFailed = true;
    } catch {
      keyFailed = true;
    }
  }

  for (const c of rubric.criteria) {
    const archetype = c.check ?? "peer";

    // People-verified rows are pendingHuman by definition — that is not a
    // failure, it is the queue working as designed.
    if (archetype === "peer" || archetype === "mentor_sample") {
      pendingHuman.push({ key: c.key, reason: `${archetype} criterion — a person marks this` });
      continue;
    }

    if (archetype === "rubric_ai") {
      const r = await runRubricScore(submission, c, ctx);
      costPaise += r.costPaise;
      if (r.pending) pendingHuman.push({ key: c.key, reason: r.pending });
      else results.push(r.result!);
      continue;
    }

    // Machine archetypes need a resolvable checker.
    if (!c.checker) {
      pendingHuman.push({ key: c.key, reason: "machine archetype with no checker declared" });
      continue;
    }
    const { name, args } = parseCheck(c.checker);
    const checker = CHECKERS[name as CheckerName];
    if (!checker) {
      pendingHuman.push({ key: c.key, reason: `no checker named "${name}" is implemented` });
      continue;
    }
    if (keyFailed) {
      pendingHuman.push({ key: c.key, reason: "the answer key could not be loaded" });
      continue;
    }

    try {
      const input = {
        ...(submission.payload ?? {}),
        ...(submission.facts ?? {}),
        ...(typeof key === "object" && key !== null ? (key as Record<string, unknown>) : {}),
        maxExamples: ctx.maxExamples ?? 3,
      };
      const verdict = await checker(input, args);
      results.push({
        key: c.key,
        passed: verdict.passed,
        points: verdict.passed ? c.weight : 0,
        weight: c.weight,
        verification: archetype,
        detail: verdict.detail,
      });
    } catch (cause) {
      // Rule 3: an exception is our bug, not the learner's zero.
      pendingHuman.push({
        key: c.key,
        reason: `checker threw: ${cause instanceof Error ? cause.message : String(cause)}`,
      });
    }
  }

  const score = results.reduce((n, r) => n + r.points, 0);
  const evidencedScore = results
    .filter((r) => MACHINE.has(r.verification))
    .reduce((n, r) => n + r.points, 0);

  return {
    submissionId: submission.id,
    results,
    score,
    evidencedScore,
    pendingHuman,
    fullyVerified: pendingHuman.length === 0,
    costPaise,
  };
}

/**
 * The only paid path. Asks for a score AND the exact quote that earned it;
 * no quote (or a quote that is not actually in the submission) zeroes the
 * criterion regardless of the claimed score — confident generosity is the
 * failure mode this exists to kill. Unparseable output and a dry budget are
 * pendingHuman, never a zero: those are our problems.
 */
async function runRubricScore(
  submission: EngineSubmission,
  c: EngineCriterion,
  ctx: GradeCtx,
): Promise<{ costPaise: number; pending?: string; result?: CriterionResult }> {
  if (!ctx.callModel) return { costPaise: 0, pending: "no model configured for rubric_score" };
  if (ctx.budgetOk) {
    try {
      if (!(await ctx.budgetOk())) return { costPaise: 0, pending: "ai budget exhausted" };
    } catch {
      return { costPaise: 0, pending: "the budget gate could not be read" };
    }
  } else {
    // No gate is a budget of zero, not a budget of infinity — same fail-closed
    // stance as ai_spend_reserve.
    return { costPaise: 0, pending: "no budget gate configured for rubric_score" };
  }

  const text = String(submission.payload?.text ?? submission.payload?.note ?? "");
  if (!text.trim()) return { costPaise: 0, pending: "no prose on the submission to score" };

  const prompt = [
    `Score one criterion of a student submission. Criterion: "${c.label}".`,
    `Maximum points: ${c.weight}. Integer scores only.`,
    `Reply with ONLY JSON: {"points": <int>, "evidence": "<exact quote from the submission that earns the points>", "comment": "<one sentence to the student>"}`,
    `If nothing in the submission earns points, points is 0 and evidence is "".`,
    "",
    "<submission>",
    text,
    "</submission>",
  ].join("\n");

  let raw: { text: string; costPaise: number };
  try {
    raw = await ctx.callModel(prompt);
  } catch (cause) {
    return {
      costPaise: 0,
      pending: `the model call failed: ${cause instanceof Error ? cause.message : String(cause)}`,
    };
  }

  let parsed: { points?: unknown; evidence?: unknown; comment?: unknown };
  try {
    parsed = JSON.parse(raw.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""));
  } catch {
    return { costPaise: raw.costPaise, pending: "the model's verdict was not valid JSON" };
  }

  const claimed = Number(parsed.points);
  if (!Number.isInteger(claimed) || claimed < 0) {
    return { costPaise: raw.costPaise, pending: "the model's score was not a non-negative integer" };
  }

  // We clamp and sum ourselves — the model cannot exceed the declared weight.
  let points = Math.min(claimed, c.weight);
  const evidence = String(parsed.evidence ?? "").trim();

  // No evidence quote means no points; a quote the submission does not
  // contain is a fabricated quote and means the same.
  if (points > 0 && (evidence.length === 0 || !text.includes(evidence))) {
    points = 0;
  }

  return {
    costPaise: raw.costPaise,
    result: {
      key: c.key,
      passed: points > 0,
      points,
      weight: c.weight,
      verification: "rubric_ai",
      detail: String(parsed.comment ?? "").slice(0, 500) || "Scored against the rubric.",
      evidence,
    },
  };
}

export type PublishVerdict = {
  ok: boolean;
  /** Share of POINTS (not criteria) behind machine checks. */
  machinePointShare: number;
  problems: string[];
};

/**
 * The 50% rule as code — README: blocks `verified` tier when under half the
 * POINTS are machine-checked, or when any criterion declares a checker that
 * does not exist. Points, not criteria: five 1-point structural checks
 * beside one 8-point AI artifact is 5 of 6 criteria and 38% of points, and
 * that track is not verifiable no matter how the criteria count reads.
 */
export function canPublishAsVerified(rubrics: EngineRubric[]): PublishVerdict {
  const problems: string[] = [];
  let machinePts = 0;
  let totalPts = 0;

  for (const rubric of rubrics) {
    for (const c of rubric.criteria) {
      totalPts += c.weight;
      const archetype = c.check ?? "peer";

      if (c.checker) {
        const { name } = parseCheck(c.checker);
        if (!(CHECKER_NAMES as readonly string[]).includes(name)) {
          problems.push(
            `${rubric.name ?? "rubric"} · ${c.key}: no checker named "${name}" exists`,
          );
          continue;
        }
        if (!CHECKERS[name as CheckerName] && MACHINE.has(archetype)) {
          problems.push(
            `${rubric.name ?? "rubric"} · ${c.key}: "${name}" is planned but not implemented — it cannot verify anything yet`,
          );
          continue;
        }
      }

      if (MACHINE.has(archetype) && c.checker) machinePts += c.weight;
    }
  }

  const share = totalPts > 0 ? machinePts / totalPts : 0;
  if (share < 0.5) {
    problems.push(
      `only ${Math.round(share * 100)}% of points are machine-checked; verified needs at least 50%`,
    );
  }

  return { ok: problems.length === 0, machinePointShare: share, problems };
}
