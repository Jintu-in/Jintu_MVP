import { describe, expect, it } from "vitest";
import { CHECKERS, CHECKER_NAMES, parseCheck, runCheck } from "./registry";

/**
 * The registry is the extensibility story — a rubric names a checker as a
 * string, and this is what the string resolves to. Two properties matter
 * beyond each checker's own behaviour:
 *
 *   - a checker never throws; malformed input or malformed args come back as
 *     a legible refusal, because a throw turns a track author's typo into a
 *     crashed grading run
 *   - an unknown name refuses with a detail blaming the track, not the
 *     student, since the student cannot fix it
 */

describe("the registry itself", () => {
  it("holds fifteen names, exactly as the README v2 fixes them", () => {
    // README: twelve free + rubric_score, plus contains_join (legacy, kept
    // because published reps reference it) and code_test_suite (planned).
    expect(CHECKER_NAMES).toHaveLength(15);
  });

  it("implements thirteen of them today — only the sandboxed and the paid stay out", () => {
    expect(Object.keys(CHECKERS).sort()).toEqual(
      [
        "answer_key_match",
        "consistent_with",
        "contains_join",
        "contains_pattern",
        "duration_between",
        "formula_present",
        "has_sections",
        "media_has_audio",
        "non_empty",
        "numeric_cells",
        "row_count_ceiling",
        "sql_diff",
        "url_reachable",
      ].sort(),
    );
  });

  it("every implemented name is in the registry list", () => {
    for (const name of Object.keys(CHECKERS)) {
      expect(CHECKER_NAMES).toContain(name);
    }
  });

  it("an unknown checker refuses and blames the track, not the student", async () => {
    const r = await runCheck("tarot_reading:3", "anything");
    expect(r.passed).toBe(false);
    expect(r.detail).toMatch(/track needs fixing/);
  });
});

describe("parseCheck", () => {
  it("splits name and args", () => {
    expect(parseCheck("duration_between:60,180")).toEqual({
      name: "duration_between",
      args: ["60", "180"],
    });
  });

  it("handles a bare name", () => {
    expect(parseCheck("non_empty")).toEqual({ name: "non_empty", args: [] });
  });

  it("trims whitespace people will inevitably type", () => {
    expect(parseCheck(" has_sections : Findings , Caveats ")).toEqual({
      name: "has_sections",
      args: ["Findings", "Caveats"],
    });
  });
});

describe("non_empty", () => {
  it("passes real text, as a string or on .text", async () => {
    expect((await runCheck("non_empty", "select 1")).passed).toBe(true);
    expect((await runCheck("non_empty", { text: "a memo" })).passed).toBe(true);
  });

  it("refuses blank and whitespace", async () => {
    expect((await runCheck("non_empty", "")).passed).toBe(false);
    expect((await runCheck("non_empty", "   \n\t ")).passed).toBe(false);
    expect((await runCheck("non_empty", {})).passed).toBe(false);
  });
});

describe("duration_between", () => {
  it("passes inside the bracket and refuses outside it", async () => {
    expect((await runCheck("duration_between:60,180", { durationSec: 90 })).passed).toBe(true);
    expect((await runCheck("duration_between:60,180", { durationSec: 20 })).passed).toBe(false);
    expect((await runCheck("duration_between:60,180", { durationSec: 400 })).passed).toBe(false);
  });

  it("tells the student which way they missed", async () => {
    const short = await runCheck("duration_between:60,180", { durationSec: 20 });
    const long = await runCheck("duration_between:60,180", { durationSec: 400 });
    expect(short.detail).toMatch(/at least 60/);
    expect(long.detail).toMatch(/under 180/);
  });

  it("refuses a submission with no measured duration", async () => {
    const r = await runCheck("duration_between:60,180", {});
    expect(r.passed).toBe(false);
    expect(r.detail).toMatch(/duration/i);
  });

  it("refuses malformed args rather than inventing a bracket", async () => {
    expect((await runCheck("duration_between:180,60", { durationSec: 90 })).passed).toBe(false);
    expect((await runCheck("duration_between:abc", { durationSec: 90 })).passed).toBe(false);
  });
});

describe("has_sections", () => {
  const memo = [
    "# Findings",
    "The top store is Pune.",
    "## Caveats:",
    "One month of data only.",
    "- Method",
    "Grouped by store.",
  ].join("\n");

  it("finds markdown headings, colon headings, and list headings", async () => {
    const r = await runCheck("has_sections:Findings,Caveats,Method", memo);
    expect(r.passed).toBe(true);
  });

  it("is case-insensitive", async () => {
    expect((await runCheck("has_sections:findings", memo)).passed).toBe(true);
  });

  it("names what is missing", async () => {
    const r = await runCheck("has_sections:Findings,Budget", memo);
    expect(r.passed).toBe(false);
    expect(r.detail).toMatch(/Budget/);
    expect(r.detail).not.toMatch(/Findings/);
  });

  it("a sentence MENTIONING the section is not the section", async () => {
    const dodge = "I decided not to include a Caveats section in this memo.";
    expect((await runCheck("has_sections:Caveats", dodge)).passed).toBe(false);
  });

  it("refuses when given no section names — a misconfigured track, said so", async () => {
    const r = await runCheck("has_sections", memo);
    expect(r.passed).toBe(false);
  });
});

describe("url_reachable", () => {
  const fetchReturning = (status: number) => async () =>
    ({ status }) as Response;

  it("passes a 200 and a redirect-resolved 3xx", async () => {
    expect(
      (await runCheck("url_reachable", { url: "https://a.example", fetch: fetchReturning(200) }))
        .passed,
    ).toBe(true);
    expect(
      (await runCheck("url_reachable", { url: "https://a.example", fetch: fetchReturning(304) }))
        .passed,
    ).toBe(true);
  });

  it("refuses a 404 with the status in the detail", async () => {
    const r = await runCheck("url_reachable", {
      url: "https://a.example",
      fetch: fetchReturning(404),
    });
    expect(r.passed).toBe(false);
    expect(r.detail).toMatch(/404/);
  });

  it("refuses non-https before ever fetching", async () => {
    let called = false;
    const spy = async () => {
      called = true;
      return { status: 200 } as Response;
    };
    const r = await runCheck("url_reachable", { url: "http://a.example", fetch: spy });
    expect(r.passed).toBe(false);
    expect(called).toBe(false);
  });

  it("a fetch that rejects is a refusal, not a crash", async () => {
    const r = await runCheck("url_reachable", {
      url: "https://a.example",
      fetch: async () => {
        throw new Error("ECONNREFUSED");
      },
    });
    expect(r.passed).toBe(false);
    expect(r.detail).toMatch(/did not answer/);
  });
});

describe("contains_join", () => {
  it("finds a join in any casing", async () => {
    expect((await runCheck("contains_join", "SELECT * FROM a JOIN b ON …")).passed).toBe(true);
    expect((await runCheck("contains_join", "select 1 from a left join b on 1=1")).passed).toBe(true);
  });

  it("refuses a join-free query", async () => {
    expect((await runCheck("contains_join", "select * from customers")).passed).toBe(false);
  });

  it("is gameable by a comment, and that is documented as acceptable", async () => {
    // TRACK_MODEL Part 10: a student who games "must contain a join" has
    // still typed a join; never attach more than one point to this checker.
    // The test pins the behaviour so nobody "fixes" it into an SQL parser.
    expect((await runCheck("contains_join", "select 1 -- join")).passed).toBe(true);
  });
});

describe("row_count_ceiling", () => {
  it("passes under the ceiling, refuses over it", async () => {
    expect((await runCheck("row_count_ceiling:100", { rows: Array(10) })).passed).toBe(true);
    expect((await runCheck("row_count_ceiling:100", { rows: Array(4000) })).passed).toBe(false);
  });

  it("accepts a bare rowCount when rows are not shipped", async () => {
    expect((await runCheck("row_count_ceiling:100", { rowCount: 99 })).passed).toBe(true);
  });

  it("suggests the likely cause when it refuses", async () => {
    const r = await runCheck("row_count_ceiling:100", { rowCount: 480000 });
    expect(r.detail).toMatch(/join without its condition/);
  });

  it("refuses malformed args", async () => {
    expect((await runCheck("row_count_ceiling:0", { rowCount: 1 })).passed).toBe(false);
    expect((await runCheck("row_count_ceiling", { rowCount: 1 })).passed).toBe(false);
  });
});

describe("answer_key_match", () => {
  const key = { planted: ["dup-rows", "neg-budget", "mixed-types", "future-dates"] };

  it("passes at or above the threshold", async () => {
    const r = await runCheck("answer_key_match:3", {
      ...key,
      found: ["dup-rows", "neg-budget", "mixed-types"],
    });
    expect(r.passed).toBe(true);
  });

  it("refuses below it, counting fabrications", async () => {
    const r = await runCheck("answer_key_match:3", {
      ...key,
      found: ["dup-rows", "made-up-problem"],
    });
    expect(r.passed).toBe(false);
    expect(r.detail).toMatch(/1 of the planted/);
    expect(r.detail).toMatch(/not in the data/);
  });

  it("never names the missed defects — the detail must not leak the key", async () => {
    const r = await runCheck("answer_key_match:4", { ...key, found: ["dup-rows"] });
    expect(r.detail).not.toMatch(/neg-budget|mixed-types|future-dates/);
  });

  it("counting is by set, so repeating a finding does not double it", async () => {
    const r = await runCheck("answer_key_match:2", {
      ...key,
      found: ["dup-rows", "dup-rows", "dup-rows"],
    });
    expect(r.passed).toBe(false);
  });

  it("refuses when the key or findings are missing from the input", async () => {
    expect((await runCheck("answer_key_match:2", { found: ["x"] })).passed).toBe(false);
    expect((await runCheck("answer_key_match:2", { planted: ["x"] })).passed).toBe(false);
  });
});

describe("sql_diff through the registry", () => {
  // A one-table in-memory runner: enough to prove the registry entry drives
  // the same grader the pipeline calls directly.
  const expected = { columns: ["n"], rows: [{ n: 1 }] };
  const runner = {
    run: async (sql: string) => {
      if (/select 1/i.test(sql)) return expected;
      return { columns: ["n"], rows: [{ n: 2 }] };
    },
  };

  it("passes the query that produces the expected result", async () => {
    const r = await runCheck("sql_diff", {
      sql: "select 1 as n",
      spec: { expected, orderMatters: false },
      runner,
    });
    expect(r.passed).toBe(true);
  });

  it("refuses the query that does not", async () => {
    const r = await runCheck("sql_diff", {
      sql: "select 2 as n",
      spec: { expected, orderMatters: false },
      runner,
    });
    expect(r.passed).toBe(false);
  });

  it("refuses legibly without a runner or spec — misconfiguration, not a crash", async () => {
    const r = await runCheck("sql_diff", { sql: "select 1" });
    expect(r.passed).toBe(false);
    expect(r.detail).toMatch(/answer key|runner/);
  });
});
