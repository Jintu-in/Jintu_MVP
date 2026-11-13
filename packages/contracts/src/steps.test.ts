import { describe, expect, it } from "vitest";
import { authoredStepSchema, decideStepSchema } from "./steps";

const validDecide = {
  kind: "decide" as const,
  title: "Raise the price, cut a cost, or shrink the jar?",
  scenario: "You sell a spice blend online. Your jar supplier raises prices by 20%.",
  options: [
    { id: "a", label: "Raise the price by ₹15 for everyone", pro: "Protects the margin at once", con: "Some buyers leave" },
    { id: "b", label: "Keep the price, cut ad spend", pro: "Buyers see no change", con: "Fewer new customers" },
  ],
  realCase: {
    who: "A real spice-blend founder",
    chose: "to raise the price",
    outcome: "Orders dipped 8% for two weeks, then recovered as repeat buyers kept ordering.",
    sourceTitle: "Founder interview",
    sourceUrl: "https://example.org/interview",
  },
  coverChecklist: ["the margin per jar", "how buyers might react"],
};

describe("decideStepSchema", () => {
  it("accepts a well-formed decide step", () => {
    expect(decideStepSchema.safeParse(validDecide).success).toBe(true);
  });

  it("defaults reasonPrompt when the author doesn't set one", () => {
    const parsed = decideStepSchema.parse(validDecide);
    expect(parsed.reasonPrompt).toBe("Why this one? One or two lines");
  });

  // CHANGES.md update 3 §B: "A Decide step without a real, linked source
  // must fail validation" — every realCase field is required, not just
  // sourceUrl, but sourceUrl is the one CLAUDE.md rule 2 cares about most
  // (an unlinked claim is exactly what "never fabricate" exists to catch).
  it("fails without realCase.sourceUrl", () => {
    const { realCase: _realCase, ...rest } = validDecide;
    const { sourceUrl: _sourceUrl, ...realCaseWithoutSource } = _realCase;
    const result = decideStepSchema.safeParse({ ...rest, realCase: realCaseWithoutSource });
    expect(result.success).toBe(false);
  });

  it("fails when sourceUrl is not a real URL", () => {
    const result = decideStepSchema.safeParse({
      ...validDecide,
      realCase: { ...validDecide.realCase, sourceUrl: "see the interview" },
    });
    expect(result.success).toBe(false);
  });

  it("fails without a real case at all", () => {
    const { realCase: _realCase, ...rest } = validDecide;
    expect(decideStepSchema.safeParse(rest).success).toBe(false);
  });

  it("requires at least two options and at most four", () => {
    expect(decideStepSchema.safeParse({ ...validDecide, options: [validDecide.options[0]] }).success).toBe(false);
    const five = [0, 1, 2, 3, 4].map((i) => ({ id: `o${i}`, label: `Option ${i}`, pro: "pro", con: "con" }));
    expect(decideStepSchema.safeParse({ ...validDecide, options: five }).success).toBe(false);
  });

  it("rejects duplicate option ids", () => {
    const result = decideStepSchema.safeParse({
      ...validDecide,
      options: [validDecide.options[0], { ...validDecide.options[1], id: validDecide.options[0]!.id }],
    });
    expect(result.success).toBe(false);
  });

  it("requires 2-4 cover-checklist items", () => {
    expect(decideStepSchema.safeParse({ ...validDecide, coverChecklist: ["one"] }).success).toBe(false);
    expect(decideStepSchema.safeParse({ ...validDecide, coverChecklist: ["a", "b", "c", "d", "e"] }).success).toBe(false);
  });

  it("joins the authored union alongside the other eight kinds", () => {
    expect(authoredStepSchema.safeParse(validDecide).success).toBe(true);
  });
});
