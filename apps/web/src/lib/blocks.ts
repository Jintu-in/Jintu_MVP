import type { LessonBlockSeed } from "@/components/lesson/lesson-route";
import type { RoadmapNode } from "@/lib/roadmaps";

/**
 * A day's content blocks, in the spec's fixed order: context before content,
 * content before doing, doing before self-testing, self-testing before the
 * reward. "Check yourself" sits after the challenge because that makes it
 * retrieval practice; before it, it would be a quiz. Do not rearrange.
 *
 * This lives here rather than in the lesson route because two screens have
 * to agree on it. The dashboard says "block 12 of 16", and that 16 has to be
 * the same 16 the reader scrolls through — a count computed twice is a count
 * that drifts.
 *
 * Every block is optional: a day renders what it has, so content written
 * before the day-page model existed still works.
 */
const text = (t: string) => [{ kind: "text" as const, text: t }];

const TYPE_LABEL: Record<RoadmapNode["resources"][number]["type"], string> = {
  read: "Read",
  video: "Video",
  doc: "Docs",
  case_study: "Case study",
  tool: "Tool",
  latest: "Latest",
};

function dataCost(r: RoadmapNode["resources"][number]): string | null {
  const mins = r.durationSec ? Math.round(r.durationSec / 60) : null;
  const parts = [
    mins ? (mins >= 90 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`) : null,
    r.estSizeMb
      ? r.estSizeMb >= 1000
        ? `~${(r.estSizeMb / 1000).toFixed(1)} GB data`
        : `~${Math.round(r.estSizeMb)} MB data`
      : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

export function buildLessonBlocks(node: RoadmapNode): LessonBlockSeed[] {
  const seeds: LessonBlockSeed[] = [];

  if (node.summary) {
    seeds.push({ id: "brief", railTitle: "Brief", kind: "brief", text: text(node.summary) });
  }
  if (node.whyToday) {
    seeds.push({
      id: "why-today",
      railTitle: "Why today",
      kind: "concept",
      heading: "Why today exists",
      paragraphs: [text(node.whyToday)],
    });
  }
  if (node.topics.length > 0) {
    for (const t of node.topics) {
      seeds.push({
        id: `topic-${t.position}`,
        railTitle: t.title,
        kind: "concept",
        heading: t.title,
        paragraphs: [text(t.detail)],
      });
    }
  } else if (node.learningObjectives.length > 0) {
    seeds.push({
      id: "objectives",
      railTitle: "Today",
      kind: "concept",
      heading: "Today",
      paragraphs: node.learningObjectives.map(text),
    });
  }

  for (const r of node.resources) {
    const cost = dataCost(r);
    const metaParts = [
      TYPE_LABEL[r.type],
      [r.sourceName, r.author].filter(Boolean).join(" · "),
      cost ?? "",
      // Rule 2's state on the surface that matters: a link that failed the
      // last check says so where the person is about to tap it.
      r.health === "broken" ? "link failed our last check — it may have moved" : "",
    ].filter(Boolean);
    seeds.push({
      id: `res-${r.id}`,
      railTitle: `${TYPE_LABEL[r.type]} · ${r.title}`,
      kind: "resource",
      resType: r.type === "video" ? "video" : "doc",
      title: r.title,
      href: r.url,
      meta: metaParts.join(" · "),
      why: r.editorNote ?? "",
      video: r.youtubeVideoId
        ? { videoId: r.youtubeVideoId, durationSec: r.durationSec, estSizeMb: r.estSizeMb }
        : undefined,
    });
  }

  if (node.challenge) {
    seeds.push({
      id: "challenge",
      railTitle: "Challenge",
      kind: "challenge",
      label: `Today's challenge${node.challengeMinutes ? ` · ~${node.challengeMinutes} min` : ""}`,
      text: text(node.challenge),
    });
  }
  for (const c of node.checks) {
    seeds.push({
      id: `check-${c.position}`,
      railTitle: `Check ${String(c.position).padStart(2, "0")}`,
      kind: "check",
      number: String(c.position).padStart(2, "0"),
      question: text(c.question),
      answer: [text(c.answer)],
    });
  }
  if (node.commonMistake) {
    seeds.push({
      id: "mistake",
      railTitle: "Gotcha",
      kind: "gotcha",
      text: text(node.commonMistake),
    });
  }
  if (node.principle) {
    seeds.push({
      id: "principle",
      railTitle: "The principle",
      kind: "summary",
      lead: node.principle,
      bullets: [],
    });
  }

  return seeds;
}

/** How many blocks this day has. The denominator in "block 12 of 16". */
export const countBlocks = (node: RoadmapNode): number => buildLessonBlocks(node).length;

/**
 * Minutes left in a day, from how far through the blocks they are.
 *
 * The dashboard's whole argument is that "~9 min left" is startable on a
 * metro platform and "60 min" is not, so this is proportional to blocks
 * remaining rather than the day's full length. Never returns 0 for an
 * unfinished day — "0 min left" on something you have not finished reads
 * as broken.
 */
export function minutesLeft(estMinutes: number, blocks: number, position: number | null): number {
  if (!blocks || position === null || position <= 0) return estMinutes;
  const remaining = Math.max(0, blocks - position);
  if (remaining === 0) return 1;
  return Math.max(1, Math.round((estMinutes * remaining) / blocks));
}
