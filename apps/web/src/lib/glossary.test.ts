import { describe, expect, test } from "vitest";
import { applyGlossary, type GlossaryEntry, type GlossaryTermSegment } from "./glossary";

const GLOSSARY: GlossaryEntry[] = [
  {
    term: "staging area",
    aliases: ["the index", "staged"],
    meaning: "The list of changes picked for your next commit.",
    taughtIn: "Lesson two",
  },
];

const FLAT_NODES = [
  { title: "Lesson one", slug: "lesson-one" },
  { title: "Lesson two", slug: "lesson-two" },
  { title: "Lesson three", slug: "lesson-three" },
];

type RichSeg = { kind: "text" | "code" | "mono"; text: string } | GlossaryTermSegment;
type ConceptStep = { id: string; kind: "concept"; paragraphs: RichSeg[][] };

const conceptStep = (id: string, text: string): ConceptStep => ({
  id,
  kind: "concept",
  paragraphs: [[{ kind: "text", text }]],
});

/** The first glossaryTerm segment in a paragraph — never assume index 0,
 *  since leading plain text (anything before the marker) splits out as
 *  its own segment ahead of it. */
function firstTerm(paragraph: RichSeg[]): GlossaryTermSegment {
  const seg = paragraph.find((s): s is GlossaryTermSegment => s.kind === "glossaryTerm");
  if (!seg) throw new Error("no glossaryTerm segment in paragraph");
  return seg;
}

describe("applyGlossary", () => {
  test("only the first occurrence of a term in a lesson is interactive — later ones are plain prose", () => {
    const steps = [
      conceptStep("s1", "The [[staging area]] holds what you are about to commit."),
      conceptStep("s2", "Clearing the staging area is as simple as `git reset`."),
    ];
    const out = applyGlossary(steps, GLOSSARY, "Git & GitHub", "git-and-github", FLAT_NODES);

    const seg1 = firstTerm(out[0]!.paragraphs[0]!);
    expect(seg1.kind).toBe("glossaryTerm");
    expect(seg1.interactive).toBe(true);
    expect(seg1.meaning).toBe("The list of changes picked for your next commit.");
  });

  test("leaves the second marked occurrence in the SAME lesson non-interactive", () => {
    const steps = [conceptStep("s1", "The [[staging area]] again: the [[staging area]] is not graded.")];
    const out = applyGlossary(steps, GLOSSARY, "Git & GitHub", "git-and-github", FLAT_NODES);
    const terms = out[0]!.paragraphs[0]!.filter((s): s is GlossaryTermSegment => s.kind === "glossaryTerm");
    expect(terms).toHaveLength(2);
    expect(terms[0]!.interactive).toBe(true);
    expect(terms[1]!.interactive).toBe(false);
  });

  test("matches an alias case-insensitively against the canonical term's entry", () => {
    const steps = [conceptStep("s1", "Also written [[Staged]] in some docs.")];
    const out = applyGlossary(steps, GLOSSARY, "Git & GitHub", "git-and-github", FLAT_NODES);
    const seg = firstTerm(out[0]!.paragraphs[0]!);
    expect(seg.kind).toBe("glossaryTerm");
    expect(seg.text).toBe("Staged"); // as-authored casing, not the entry's own
    expect(seg.meaning).toBe("The list of changes picked for your next commit.");
  });

  test("resolves taughtIn to a real lesson number and href from the live roadmap tree", () => {
    const steps = [conceptStep("s1", "The [[staging area]] explained here.")];
    const out = applyGlossary(steps, GLOSSARY, "Git & GitHub", "git-and-github", FLAT_NODES);
    const seg = firstTerm(out[0]!.paragraphs[0]!);
    expect(seg.taughtInLabel).toBe("Taught in lesson 2 · Lesson two");
    expect(seg.taughtInHref).toBe("/learn/git-and-github/lesson-two");
  });

  test("an unmatched [[term]] degrades to plain text rather than throwing or leaking brackets", () => {
    const steps = [conceptStep("s1", "A [[nonexistent term]] here.")];
    const out = applyGlossary(steps, GLOSSARY, "Git & GitHub", "git-and-github", FLAT_NODES);
    const paras = out[0]!.paragraphs[0]!;
    expect(paras.some((s) => s.text.includes("[["))).toBe(false);
    expect(paras.map((s) => s.text).join("")).toContain("nonexistent term");
  });

  test("is a no-op for a roadmap with no glossary — same array back, not a wasted scan", () => {
    const steps = [conceptStep("s1", "Nothing to mark up [[here]].")];
    const out = applyGlossary(steps, [], "Some Roadmap", "some-roadmap", FLAT_NODES);
    expect(out).toBe(steps);
  });

  test("code and mono segments are never scanned for markers, even if they contain brackets", () => {
    const steps: ConceptStep[] = [
      { id: "s1", kind: "concept", paragraphs: [[{ kind: "code", text: "echo [[staging area]]" }]] },
    ];
    const out = applyGlossary(steps, GLOSSARY, "Git & GitHub", "git-and-github", FLAT_NODES);
    const seg = out[0]!.paragraphs[0]![0]!;
    expect(seg.kind).toBe("code");
    expect(seg.text).toBe("echo [[staging area]]");
  });
});
