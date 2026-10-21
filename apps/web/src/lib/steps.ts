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
 * The five rich step types (UniChoose/UniFind/UniFormula/UniNumber/
 * UniWrite) and the Git-&-GitHub-specific "run a command" type (V2Step's
 * own terminal card) are Part B — real new authored content that cannot be
 * derived from these six fields. Every step here is one of the generic
 * kinds the old Block renderer already draws (concept/topics/resource/
 * challenge/check/gotcha); no new per-kind renderer exists yet, so nothing
 * here is Git-specific.
 */
export type Rich = { kind: "text" | "code" | "mono"; text: string }[];

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
  | { kind: "check"; number: string; question: Rich; answer: Rich[] }
  | { kind: "gotcha"; heading?: string; text: Rich }
);

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

  if (node.challenge) {
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

  return steps;
}

export const countSteps = (node: RoadmapNode): number => buildLessonSteps(node).length;
