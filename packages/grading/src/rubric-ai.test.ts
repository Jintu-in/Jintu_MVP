import { describe, expect, it } from "vitest";
import {
  RUBRIC_AI_MAX_OUTPUT_TOKENS,
  RUBRIC_AI_MODEL,
  actualCostPaise,
  aiCriteria,
  buildRubricPrompt,
  estimateCostPaise,
  parseRubricVerdict,
} from "./rubric-ai";

const CRITERIA = [
  { key: "names_metric", label: "Each fix names the metric it should move", weight: 2, check: "rubric_ai" },
  { key: "concrete", label: "Every claim points at a row, column or number", weight: 3, check: "rubric_ai" },
];

describe("aiCriteria", () => {
  it("selects only rubric_ai criteria", () => {
    const mixed = [
      ...CRITERIA,
      { key: "peers", label: "Peers judge this", weight: 2, check: "peer" },
      { key: "legacy", label: "No check at all", weight: 1 },
    ];
    expect(aiCriteria(mixed).map((c) => c.key)).toEqual(["names_metric", "concrete"]);
  });

  it("is empty for null, undefined and rubric-less assignments", () => {
    expect(aiCriteria(null)).toEqual([]);
    expect(aiCriteria(undefined)).toEqual([]);
    expect(aiCriteria([])).toEqual([]);
  });
});

describe("costing", () => {
  it("prices the default model and refuses unknown ones", () => {
    expect(estimateCostPaise(RUBRIC_AI_MODEL, 3_000, RUBRIC_AI_MAX_OUTPUT_TOKENS)).not.toBeNull();
    expect(estimateCostPaise("claude-imaginary-9", 3_000, 700)).toBeNull();
    expect(actualCostPaise("claude-imaginary-9", 100, 100)).toBeNull();
  });

  it("estimate is a ceiling on the actual cost for the same call", () => {
    // 3 chars/token in the estimate vs the realistic ~4 the API reports.
    const chars = 4_000;
    const estimate = estimateCostPaise(RUBRIC_AI_MODEL, chars, RUBRIC_AI_MAX_OUTPUT_TOKENS)!;
    const actual = actualCostPaise(RUBRIC_AI_MODEL, Math.round(chars / 4), 400)!;
    expect(actual).toBeLessThanOrEqual(estimate);
  });

  it("never rounds a real call down to zero paise", () => {
    expect(actualCostPaise(RUBRIC_AI_MODEL, 1, 1)).toBe(1);
    expect(estimateCostPaise(RUBRIC_AI_MODEL, 1, 1)).toBe(1);
  });
});

describe("buildRubricPrompt", () => {
  it("carries the assignment, every criterion with its range, and the prose", () => {
    const { system, user } = buildRubricPrompt({
      assignmentPrompt: "Audit the orders table.",
      criteria: CRITERIA,
      prose: "I found three duplicate rows.",
    });
    expect(system).toContain("ONLY a JSON object");
    expect(user).toContain("Audit the orders table.");
    expect(user).toContain('"names_metric" (0 to 2)');
    expect(user).toContain('"concrete" (0 to 3)');
    expect(user).toContain("I found three duplicate rows.");
  });
});

describe("parseRubricVerdict", () => {
  const good = '{"scores": {"names_metric": 2, "concrete": 1}, "feedback": "Names CTR twice; the third fix names no metric."}';

  it("accepts the exact shape and totals it", () => {
    const v = parseRubricVerdict(good, CRITERIA);
    expect(v).toMatchObject({ ok: true, total: 3, scores: { names_metric: 2, concrete: 1 } });
  });

  it("strips a markdown fence, because models add them anyway", () => {
    const v = parseRubricVerdict("```json\n" + good + "\n```", CRITERIA);
    expect(v.ok).toBe(true);
  });

  it.each([
    ["not JSON at all", "The submission is quite good, 3/5."],
    ["a JSON array", "[1, 2]"],
    ["missing a criterion", '{"scores": {"names_metric": 2}, "feedback": "ok"}'],
    ["a non-integer score", '{"scores": {"names_metric": 1.5, "concrete": 1}, "feedback": "ok"}'],
    ["a score above its weight", '{"scores": {"names_metric": 5, "concrete": 1}, "feedback": "ok"}'],
    ["a negative score", '{"scores": {"names_metric": -1, "concrete": 1}, "feedback": "ok"}'],
    ["an invented criterion", '{"scores": {"names_metric": 2, "concrete": 1, "vibes": 9}, "feedback": "ok"}'],
    ["empty feedback", '{"scores": {"names_metric": 2, "concrete": 1}, "feedback": "  "}'],
    ["absurdly long feedback", `{"scores": {"names_metric": 2, "concrete": 1}, "feedback": "${"x".repeat(2001)}"}`],
  ])("refuses %s whole", (_label, text) => {
    expect(parseRubricVerdict(text, CRITERIA).ok).toBe(false);
  });
});
