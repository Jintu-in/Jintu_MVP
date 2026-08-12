import { describe, expect, it } from "vitest";
import { DB_ARCHETYPES, toDbArchetype, toEngineCheck } from "./archetypes";
import { grade } from "./engine";

describe("archetype round-trip: database enum ↔ engine union", () => {
  it("all six database values survive the round trip unchanged", () => {
    for (const db of DB_ARCHETYPES) {
      expect(toDbArchetype(toEngineCheck(db))).toBe(db);
    }
  });

  it("an unknown archetype throws rather than misclassifying", () => {
    expect(() => toEngineCheck("vibes")).toThrow("not a verification archetype");
  });

  it("every mapped value lands in the branch of grade() it belongs to", async () => {
    // The bug this prevents: DB 'mentor' passed through unmapped is neither
    // peer/mentor_sample (goes to a person) nor a machine archetype with a
    // checker — it would sit in pendingHuman labelled as a broken machine
    // criterion. Mapped, each archetype behaves per its class.
    for (const db of DB_ARCHETYPES) {
      const check = toEngineCheck(db);
      const report = await grade(
        { id: "rt", payload: { text: "has words" } },
        { criteria: [{ key: "k", label: "l", weight: 2, check, checker: db === "rubric_ai" ? null : "non_empty" }] },
      );
      if (check === "peer" || check === "mentor_sample") {
        expect(report.pendingHuman[0]?.reason).toContain("a person marks this");
      } else if (check === "rubric_ai") {
        expect(report.pendingHuman[0]?.reason).toContain("no model configured");
      } else {
        expect(report.results[0]?.verification).toBe(check);
        expect(report.evidencedScore).toBe(2);
      }
    }
  });
});
