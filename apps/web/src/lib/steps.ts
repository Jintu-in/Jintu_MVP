import type { AuthoredStep, Panel } from "@jintu/contracts";
import { resourceMeta, text } from "@/lib/blocks";
import type { RoadmapNode } from "@/lib/roadmaps";

/**
 * Phase 5 Part A: a day as one step at a time (V2Step/V2Turn), not six
 * scrollable sections (lib/blocks.ts — kept, unchanged, still what
 * lib/dashboard.ts counts; see this file's own note in
 * (learning)/learn/[slug]/[node]/page.tsx for why the two now diverge).
 *
 * Same six source fields, same per-null-field omission rule, same order —
 * why today, today, read & do, the challenge, check yourself, the mistake —
 * just regrouped so each resource and each check is its own step instead of
 * being bundled into one long "Read & do" / "Check yourself" section. No
 * new authoring, no schema change: this is a different grouping of the
 * same data, computed fresh every render.
 *
 * Phase 5 Part B: when node.authoredSteps (nodes.steps, migration 0030) is
 * present and non-empty, it REPLACES the single generic "challenge" step
 * with one or more richer steps, spliced at the exact same position, after
 * the resources and before the checks. Everything else about the day
 * (why-today, today, resources, checks, mistake) stays exactly as Part A
 * built it; only the "doing" step gets the upgrade, and only for days that
 * have been hand-authored for it.
 *
 * Seven authored kinds in total: a terminal command (V2Step) and a fuller
 * "your turn" with its own terminal setup (V2Turn) — both Git & GitHub's —
 * plus the five Uni* kinds that generalise the pattern to other subjects: a
 * multiple-choice worked example (choose), a find-it-in-a-source task
 * (find), a spreadsheet formula (formula), a worked numeric answer
 * (number), and a fill-in-the-template calibrated sentence (write). All
 * five share the project's self-check-only posture (Decision 2, also how
 * `check` steps work below): a worked example to compare your own
 * attempt against, never a graded input — nothing here stores or scores
 * what a learner typed or picked.
 */
export type Rich = { kind: "text" | "code" | "mono"; text: string }[];

/** A terminal line, carried through from @jintu/contracts' AuthoredStep —
 *  a plain string, or `{ text, highlight }` for the one line that gets
 *  V2Step's "look for this" pill. */
export type TerminalLine = string | { text: string; highlight?: string };

export type LessonStep = { id: string; railTitle: string } & (
  | { kind: "concept"; heading?: string; paragraphs: Rich[] }
  | { kind: "topics"; heading: string; items: { title: string; detail: string }[] }
  | {
      kind: "resource";
      resType: "doc" | "video";
      title: string;
      href: string;
      meta: string;
      why: string;
      dead: boolean;
      video?: { videoId: string; durationSec: number | null; estSizeMb: number | null };
    }
  | { kind: "challenge"; label: string; text: Rich }
  | {
      kind: "command";
      promptLabel: string;
      command: string;
      outputLabel: string;
      output: TerminalLine[];
      note?: string;
    }
  | {
      kind: "turnRich";
      timeLabel: string;
      body?: string;
      startCommands?: TerminalLine[];
      thenText?: string;
      doneWhenText: string;
      doneWhenExample?: TerminalLine[];
      doneWhenNote?: string;
      ctaLabel: string;
    }
  | {
      kind: "choose";
      factsLabel: string;
      facts: { label: string; value: string }[];
      promptLabel: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      note?: string;
      ctaLabel: string;
      /** Desktop-only "your work" aside (CHANGES.md item 6); absent on phone. */
      panel?: Panel;
    }
  | {
      kind: "find";
      sourceLabel: string;
      sourceTitle: string;
      sourceUrl: string;
      lookUnder?: string[];
      answerLabel: string;
      answerCode: string;
      answerText: string;
      note?: string;
      ctaLabel: string;
      panel?: Panel;
    }
  | {
      kind: "formula";
      inputsLabel: string;
      inputs?: { label: string; value: string }[];
      cellLabel: string;
      formula: string;
      resultLabel: string;
      resultValue: string;
      resultHighlight?: string;
      note?: string;
      ctaLabel: string;
      panel?: Panel;
    }
  | {
      kind: "number";
      factsLabel: string;
      facts: { label: string; value: string }[];
      answersLabel: string;
      answers: { label: string; value: string }[];
      workingLabel: string;
      working: TerminalLine[];
      note?: string;
      ctaLabel: string;
      panel?: Panel;
    }
  | {
      kind: "write";
      template: string;
      example: string;
      parts: { label: string; value: string }[];
      note?: string;
      ctaLabel: string;
      panel?: Panel;
    }
  | { kind: "check"; number: string; question: Rich; answer: Rich[] }
  | { kind: "gotcha"; heading?: string; text: Rich }
  | {
      kind: "faq";
      items: { question: string; answer: string }[];
      /** Whether to show "Quiz me first" beside Finish — node.quiz may be
       *  null even when node.faq exists; the two are authored separately. */
      hasQuiz: boolean;
    }
);

/** The authored step's own title becomes the step's railTitle/id; command
 *  and turn steps don't share lib/blocks.ts's Rich-text shape, so they are
 *  passed through close to verbatim rather than wrapped in text(). */
function authoredToLessonSteps(authored: AuthoredStep[], nodeSlug: string): LessonStep[] {
  return authored.map((a, i) => {
    const id = `authored-${nodeSlug}-${i}`;
    if (a.kind === "command") {
      return {
        id,
        railTitle: a.title,
        kind: "command",
        promptLabel: a.promptLabel,
        command: a.command,
        outputLabel: a.outputLabel,
        output: a.output,
        note: a.note,
      };
    }
    if (a.kind === "turn") {
      return {
        id,
        railTitle: a.title,
        kind: "turnRich",
        timeLabel: a.timeLabel,
        body: a.body,
        startCommands: a.startCommands,
        thenText: a.thenText,
        doneWhenText: a.doneWhenText,
        doneWhenExample: a.doneWhenExample,
        doneWhenNote: a.doneWhenNote,
        ctaLabel: a.ctaLabel,
      };
    }
    if (a.kind === "choose") {
      return {
        id,
        railTitle: a.title,
        kind: "choose",
        factsLabel: a.factsLabel,
        facts: a.facts,
        promptLabel: a.promptLabel,
        options: a.options,
        correctIndex: a.correctIndex,
        explanation: a.explanation,
        note: a.note,
        ctaLabel: a.ctaLabel,
        panel: a.panel,
      };
    }
    if (a.kind === "find") {
      return {
        id,
        railTitle: a.title,
        kind: "find",
        sourceLabel: a.sourceLabel,
        sourceTitle: a.sourceTitle,
        sourceUrl: a.sourceUrl,
        lookUnder: a.lookUnder,
        answerLabel: a.answerLabel,
        answerCode: a.answerCode,
        answerText: a.answerText,
        note: a.note,
        ctaLabel: a.ctaLabel,
        panel: a.panel,
      };
    }
    if (a.kind === "formula") {
      return {
        id,
        railTitle: a.title,
        kind: "formula",
        inputsLabel: a.inputsLabel,
        inputs: a.inputs,
        cellLabel: a.cellLabel,
        formula: a.formula,
        resultLabel: a.resultLabel,
        resultValue: a.resultValue,
        resultHighlight: a.resultHighlight,
        note: a.note,
        ctaLabel: a.ctaLabel,
        panel: a.panel,
      };
    }
    if (a.kind === "number") {
      return {
        id,
        railTitle: a.title,
        kind: "number",
        factsLabel: a.factsLabel,
        facts: a.facts,
        answersLabel: a.answersLabel,
        answers: a.answers,
        workingLabel: a.workingLabel,
        working: a.working,
        note: a.note,
        ctaLabel: a.ctaLabel,
        panel: a.panel,
      };
    }
    return {
      id,
      railTitle: a.title,
      kind: "write",
      template: a.template,
      example: a.example,
      parts: a.parts,
      note: a.note,
      ctaLabel: a.ctaLabel,
      panel: a.panel,
    };
  });
}

export function buildLessonSteps(node: RoadmapNode): LessonStep[] {
  const steps: LessonStep[] = [];

  if (node.whyToday) {
    steps.push({
      id: "why-today",
      railTitle: "Why today",
      kind: "concept",
      heading: "Why today",
      paragraphs: [text(node.whyToday)],
    });
  }

  const topics = node.topics.length
    ? node.topics.map((t) => ({ title: t.title, detail: t.detail }))
    : node.learningObjectives.map((o) => ({ title: o, detail: "" }));
  if (topics.length) {
    steps.push({ id: "today", railTitle: "Today", kind: "topics", heading: "Today", items: topics });
  }

  // One step per resource — each is a real, distinct "what do I tap now",
  // not a row in a list to scroll past.
  for (const r of node.resources) {
    steps.push({
      id: `resource-${r.id}`,
      railTitle: r.title,
      kind: "resource",
      resType: r.type === "video" ? "video" : "doc",
      title: r.title,
      href: r.url,
      meta: resourceMeta(r),
      why: r.editorNote ?? "",
      dead: r.health === "broken",
      video: r.youtubeVideoId
        ? { videoId: r.youtubeVideoId, durationSec: r.durationSec, estSizeMb: r.estSizeMb }
        : undefined,
    });
  }

  if (node.authoredSteps && node.authoredSteps.length > 0) {
    steps.push(...authoredToLessonSteps(node.authoredSteps, node.slug));
  } else if (node.challenge) {
    steps.push({
      id: "challenge",
      railTitle: "Today's challenge",
      kind: "challenge",
      label: `Today's challenge${node.challengeMinutes ? ` · ~${node.challengeMinutes} min` : ""}`,
      text: text(node.challenge),
    });
  }

  // One step per check — self-check only (Decision 2): reveals on tap,
  // never stores or scores whether the answer given matched.
  node.checks.forEach((c, i) => {
    steps.push({
      id: `check-${i}`,
      railTitle: `Check ${i + 1}`,
      kind: "check",
      number: String(i + 1).padStart(2, "0"),
      question: text(c.question),
      answer: [text(c.answer)],
    });
  });

  if (node.commonMistake) {
    steps.push({
      id: "mistake",
      railTitle: "The mistake",
      kind: "gotcha",
      heading: "The mistake almost everyone makes",
      text: text(node.commonMistake),
    });
  }

  // Last, not spliced in anywhere else — V2Questions/DeskQuestions sits
  // after "your turn" and the mistake, right before Finish. Deliberately
  // NOT repeating node.commonMistake here even though the mockup's own
  // card does: it already rendered above as its own gotcha step, and a
  // second copy in the same lesson would be a real duplication.
  if (node.faq && node.faq.length > 0) {
    steps.push({
      id: "faq",
      railTitle: "Questions you might have",
      kind: "faq",
      items: node.faq,
      hasQuiz: Boolean(node.quiz && node.quiz.length > 0),
    });
  }

  return steps;
}

export const countSteps = (node: RoadmapNode): number => buildLessonSteps(node).length;
