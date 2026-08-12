import { describe, expect, it } from "vitest";
// Deliberately imports the GENERATED Deno mirror, .ts extensions and all —
// this test is what proves the extensioned import graph resolves and runs,
// which is the property Deno needs. It lives outside src/ because the
// package tsconfig (rightly) refuses .ts-suffixed imports; vitest's
// transformer accepts them, same as Deno does.
//
// The three-way story this file completes:
//   tsc/Next  -> consume packages/grading/src, extensionless (in prod today)
//   Deno      -> consumes supabase/functions/_shared/grading, extensioned
//   this test -> executes the Deno-shaped graph so drift or a broken
//                rewrite fails CI as a test, not as a deploy
import { canPublishAsVerified, grade, runCheck } from "../../../supabase/functions/_shared/grading/index.ts";

describe("the Deno mirror is a working grading engine", () => {
  it("grades through the extensioned import graph end to end", async () => {
    const report = await grade(
      { id: "smoke-1", payload: { text: "select 1 from a join b" } },
      {
        criteria: [
          { key: "words", label: "Not empty", weight: 2, check: "structural", checker: "non_empty" },
          { key: "join", label: "Has a join", weight: 1, check: "structural", checker: "contains_pattern:join" },
        ],
      },
    );
    expect(report.score).toBe(3);
    expect(report.evidencedScore).toBe(3);
    expect(report.fullyVerified).toBe(true);
  });

  it("carries the whole registry across, including the paid-path refusals", async () => {
    const verdict = await runCheck("answer_key_match:2", {
      found: ["dupes", "ghost"],
      planted: ["dupes", "nulls"],
    });
    expect(verdict.passed).toBe(false); // decoy penalty travelled with the code

    const publish = canPublishAsVerified([
      { criteria: [{ key: "k", label: "l", weight: 5, check: "rubric_ai", checker: "rubric_score" }] },
    ]);
    expect(publish.ok).toBe(false); // and so did the 50%-of-points rule
  });
});
