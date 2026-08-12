import { describe, expect, it } from "vitest";
import {
  canPublishAsVerified,
  grade,
  type EngineRubric,
  type EngineSubmission,
} from "./engine";
import { runCheck } from "./registry";

const sub = (over: Partial<EngineSubmission> = {}): EngineSubmission => ({
  id: "s1",
  payload: { text: "The revenue total is 4820 and churn is concentrated in Q3." },
  ...over,
});

const CTX_WITH_MODEL = (reply: string, cost = 4) => ({
  budgetOk: async () => true,
  callModel: async () => ({ text: reply, costPaise: cost }),
});

describe("grade — machine criteria", () => {
  const rubric: EngineRubric = {
    name: "r",
    criteria: [
      { key: "words", label: "Not empty", weight: 2, check: "structural", checker: "non_empty" },
      { key: "join", label: "Uses a join", weight: 1, check: "structural", checker: "contains_pattern:join" },
    ],
  };

  it("pays the weight on pass and zero on fail, and sums evidencedScore", async () => {
    const r = await grade(sub({ payload: { text: "select * from a join b" } }), rubric);
    expect(r.score).toBe(3);
    expect(r.evidencedScore).toBe(3);
    expect(r.fullyVerified).toBe(true);
  });

  it("an unknown checker routes to pendingHuman, never a silent zero", async () => {
    const r = await grade(sub(), {
      criteria: [{ key: "k", label: "l", weight: 3, check: "structural", checker: "tarot_reading" }],
    });
    expect(r.results).toHaveLength(0);
    expect(r.pendingHuman[0]?.reason).toContain("tarot_reading");
    expect(r.fullyVerified).toBe(false);
  });

  it("a failed key load parks every machine criterion for a human", async () => {
    const r = await grade(
      sub({ answerKeyRef: "keys/x.json" }),
      rubric,
      { loadKey: async () => { throw new Error("storage down"); } },
    );
    expect(r.results).toHaveLength(0);
    expect(r.pendingHuman).toHaveLength(2);
  });

  it("peer criteria are pendingHuman by design, not failures", async () => {
    const r = await grade(sub(), {
      criteria: [{ key: "p", label: "peers judge", weight: 3, check: "peer", checker: null }],
    });
    expect(r.pendingHuman[0]?.reason).toContain("a person marks this");
  });
});

describe("grade — rubric_score, the only paid checker", () => {
  const rubric: EngineRubric = {
    criteria: [{ key: "clear", label: "Names the metric", weight: 4, check: "rubric_ai" }],
  };

  it("pays a clamped score when the evidence quote is real", async () => {
    const r = await grade(sub(), rubric, CTX_WITH_MODEL(
      '{"points": 9, "evidence": "revenue total is 4820", "comment": "Names the figure."}',
    ));
    expect(r.results[0]?.points).toBe(4); // clamped from 9 to the weight
    expect(r.score).toBe(4);
    expect(r.evidencedScore).toBe(0); // AI is never the publishable number
    expect(r.costPaise).toBe(4);
  });

  it("zeroes the score when the quote is empty — confident generosity dies here", async () => {
    const r = await grade(sub(), rubric, CTX_WITH_MODEL(
      '{"points": 4, "evidence": "", "comment": "Great work!"}',
    ));
    expect(r.results[0]?.points).toBe(0);
    expect(r.results[0]?.passed).toBe(false);
  });

  it("zeroes the score when the quote is not actually in the submission", async () => {
    const r = await grade(sub(), rubric, CTX_WITH_MODEL(
      '{"points": 4, "evidence": "a sentence the learner never wrote", "comment": "ok"}',
    ));
    expect(r.results[0]?.points).toBe(0);
  });

  it("unparseable model output is pendingHuman — and the cost is still counted", async () => {
    const r = await grade(sub(), rubric, CTX_WITH_MODEL("Sure! I'd score this a 4."));
    expect(r.pendingHuman[0]?.reason).toContain("not valid JSON");
    expect(r.costPaise).toBe(4);
  });

  it("a dry budget parks the criterion without calling the model", async () => {
    let called = false;
    const r = await grade(sub(), rubric, {
      budgetOk: async () => false,
      callModel: async () => { called = true; return { text: "{}", costPaise: 4 }; },
    });
    expect(called).toBe(false);
    expect(r.pendingHuman[0]?.reason).toBe("ai budget exhausted");
  });

  it("no budget gate is a budget of zero, not infinity", async () => {
    const r = await grade(sub(), rubric, { callModel: async () => ({ text: "{}", costPaise: 4 }) });
    expect(r.pendingHuman[0]?.reason).toContain("no budget gate");
  });
});

describe("canPublishAsVerified — the 50%-of-points rule", () => {
  it("blocks the 38% trap: 5 of 6 criteria deterministic, 38% of points", () => {
    const v = canPublishAsVerified([{
      name: "trap",
      criteria: [
        ...[1, 2, 3, 4, 5].map((i) => ({
          key: `s${i}`, label: "structural", weight: 1,
          check: "structural", checker: "non_empty",
        })),
        { key: "essay", label: "AI-graded artifact", weight: 8, check: "rubric_ai", checker: "rubric_score" },
      ],
    }]);
    expect(v.ok).toBe(false);
    expect(Math.round(v.machinePointShare * 100)).toBe(38);
  });

  it("passes a rubric with half its points behind machines", () => {
    const v = canPublishAsVerified([{
      criteria: [
        { key: "sql", label: "runs", weight: 5, check: "executable", checker: "sql_diff" },
        { key: "memo", label: "peers", weight: 5, check: "peer", checker: null },
      ],
    }]);
    expect(v.ok).toBe(true);
    expect(v.machinePointShare).toBe(0.5);
  });

  it("blocks a checker that does not exist, and one that is planned but unimplemented", () => {
    const ghost = canPublishAsVerified([{
      criteria: [{ key: "k", label: "l", weight: 5, check: "structural", checker: "astrology" }],
    }]);
    expect(ghost.ok).toBe(false);
    expect(ghost.problems[0] ?? "").toContain("astrology");

    const planned = canPublishAsVerified([{
      criteria: [{ key: "k", label: "l", weight: 5, check: "executable", checker: "code_test_suite" }],
    }]);
    expect(planned.ok).toBe(false);
    expect(planned.problems[0] ?? "").toContain("not implemented");
  });
});

describe("new checkers", () => {
  it("numeric_cells: names the cell and the learner's value, never the expected one", async () => {
    const v = await runCheck("numeric_cells:2", {
      cells: { B4: 4820.0, B5: 12.5 },
      expected: { B4: 4819.5, B5: 12.5 },
    });
    expect(v.passed).toBe(false);
    expect(v.detail).toContain("B4: you have 4820");
    expect(v.detail).not.toContain("4819.5"); // the key never leaks
  });

  it("numeric_cells: caps examples so feedback teaches without becoming the sheet", async () => {
    const expected = Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`C${i}`, 1]));
    const v = await runCheck("numeric_cells:2", { cells: {}, expected, maxExamples: 3 });
    expect(v.detail).toContain("and 7 more");
  });

  it("formula_present: a pasted constant is named, a formula passes", async () => {
    const bad = await runCheck("formula_present:B4,B5", {
      cellFormulas: { B4: "=SUM(A1:A9)", B5: "4820" },
    });
    expect(bad.passed).toBe(false);
    expect(bad.detail).toContain("B5");

    const good = await runCheck("formula_present:B4", { cellFormulas: { B4: "=SUM(A1:A9)" } });
    expect(good.passed).toBe(true);
  });

  it("consistent_with: agreement inside tolerance passes, outside names the gap", async () => {
    expect((await runCheck("consistent_with:1", { value: 100.5, priorValue: 100 })).passed).toBe(true);
    const off = await runCheck("consistent_with:1", { value: 120, priorValue: 100 });
    expect(off.passed).toBe(false);
    expect(off.detail).toContain("20.0%");
  });

  it("media_has_audio: silence fails even when a track exists", async () => {
    expect((await runCheck("media_has_audio", { mediaProbe: { hasAudio: true, meanVolumeDb: -18 } })).passed).toBe(true);
    expect((await runCheck("media_has_audio", { mediaProbe: { hasAudio: true, meanVolumeDb: -72 } })).passed).toBe(false);
    expect((await runCheck("media_has_audio", { mediaProbe: { hasAudio: false } })).passed).toBe(false);
  });

  it("contains_pattern: any synonym satisfies; author input is never a regex", async () => {
    expect((await runCheck("contains_pattern:join,merge", { text: "we merge the tables" })).passed).toBe(true);
    // A regex metacharacter must match literally, not explode.
    expect((await runCheck("contains_pattern:a+b", { text: "compute a+b here" })).passed).toBe(true);
  });
});

describe("answer_key_match — the decoy penalty", () => {
  it("a fabricated finding cancels a real one", async () => {
    const v = await runCheck("answer_key_match:3", {
      found: ["dupes", "nulls", "future-dates", "ghost-problem"],
      planted: ["dupes", "nulls", "future-dates"],
    });
    expect(v.passed).toBe(false); // 3 hits - 1 decoy = 2 < 3
    expect(v.detail).toContain("counts as 2");
  });

  it("matches structured (column, count) findings — the row count is the fingerprint", async () => {
    const v = await runCheck("answer_key_match:2", {
      found: [{ column: "customer_name", count: 14 }, { column: "signup_date", count: 3 }],
      planted: [{ column: "customer_name", count: 14 }, { column: "signup_date", count: 3 }],
    });
    expect(v.passed).toBe(true);
  });

  it("a wrong count is not a finding", async () => {
    const v = await runCheck("answer_key_match:1", {
      found: [{ column: "customer_name", count: 9 }],
      planted: [{ column: "customer_name", count: 14 }],
    });
    expect(v.passed).toBe(false);
  });

  it("never names what was missed", async () => {
    const v = await runCheck("answer_key_match:2", {
      found: ["dupes"],
      planted: ["dupes", "nulls", "future-dates"],
    });
    expect(v.detail).not.toContain("nulls");
    expect(v.detail).not.toContain("future-dates");
  });
});
