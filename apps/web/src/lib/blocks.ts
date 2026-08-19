import type { LessonBlockSeed } from "@/components/lesson/lesson-route";
import type { RoadmapNode } from "@/lib/roadmaps";

/**
 * A day is SIX tickable sections, in this order:
 *
 *   Why today · Today · Read & do · Today's challenge · Check yourself ·
 *   The mistake almost everyone makes
 *
 * Check Yourself sits after the challenge because retrieval practice after
 * doing is learning; the same questions before doing it are a quiz. Do not
 * rearrange. (docs/design/Node reader body.)
 *
 * The principle is NOT one of the six — it is an unheaded italic line
 * between the meta and the first section, and it is not tickable. Nor is
 * the summary: the day's one-line argument is the principle, and the
 * summary already does its work in the breadcrumb metadata and the OG card.
 *
 * A section whose field is null is omitted entirely — never an empty
 * heading. So "3 of 6" on a full day may honestly be "2 of 4" on a sparse
 * one, and the rail counts what exists.
 *
 * Two screens depend on this list agreeing with itself: the reader renders
 * it, and the dashboard says "block 12 of 16" against its length.
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

/** "Quartz · github.com · 30 min · ~98 MB" — the design's mono meta line. */
function resourceMeta(r: RoadmapNode["resources"][number]): string {
  let host: string;
  try {
    host = new URL(r.url).hostname.replace(/^www\./, "");
  } catch {
    // A malformed URL is a curation bug, not a render-time crash.
    host = "";
  }
  const mins = r.durationSec ? Math.round(r.durationSec / 60) : null;
  return [
    r.sourceName,
    host && host !== r.sourceName ? host : "",
    mins ? (mins >= 90 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`) : "",
    r.estSizeMb
      ? r.estSizeMb >= 1000
        ? `~${(r.estSizeMb / 1000).toFixed(1)} GB`
        : `~${Math.round(r.estSizeMb)} MB`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

export function buildLessonBlocks(node: RoadmapNode): LessonBlockSeed[] {
  const seeds: LessonBlockSeed[] = [];

  if (node.whyToday) {
    seeds.push({
      id: "why-today",
      railTitle: "Why today",
      kind: "concept",
      heading: "Why today",
      paragraphs: [text(node.whyToday)],
    });
  }

  // "Today" — the numbered list, one section. Learning objectives stand in
  // when a day predates the topics model.
  const topics = node.topics.length
    ? node.topics.map((t) => ({ title: t.title, detail: t.detail }))
    : node.learningObjectives.map((o) => ({ title: o, detail: "" }));
  if (topics.length) {
    seeds.push({ id: "today", railTitle: "Today", kind: "topics", heading: "Today", items: topics });
  }

  if (node.resources.length) {
    seeds.push({
      id: "read-and-do",
      railTitle: "Read & do",
      kind: "resources",
      heading: "Read & do",
      items: node.resources.map((r) => ({
        id: r.id,
        typeLabel: TYPE_LABEL[r.type],
        resType: r.type === "video" ? ("video" as const) : ("doc" as const),
        title: r.title,
        href: r.url,
        meta: resourceMeta(r),
        why: r.editorNote ?? "",
        // A dead link keeps its row, its tick and its place — struck
        // through, named, and reportable. Hiding it would leave a hole in
        // the day with no explanation.
        dead: r.health === "broken",
        video: r.youtubeVideoId
          ? { videoId: r.youtubeVideoId, durationSec: r.durationSec, estSizeMb: r.estSizeMb }
          : undefined,
      })),
    });
  }

  if (node.challenge) {
    seeds.push({
      id: "challenge",
      railTitle: "Today's challenge",
      kind: "challenge",
      label: `Today's challenge${node.challengeMinutes ? ` · ~${node.challengeMinutes} min` : ""}`,
      text: text(node.challenge),
    });
  }

  // After the challenge. Never before it.
  if (node.checks.length) {
    seeds.push({
      id: "check-yourself",
      railTitle: "Check yourself",
      kind: "checks",
      heading: "Check yourself",
      items: node.checks.map((c) => ({ question: c.question, answer: c.answer })),
    });
  }

  if (node.commonMistake) {
    seeds.push({
      id: "mistake",
      railTitle: "The mistake",
      kind: "gotcha",
      heading: "The mistake almost everyone makes",
      text: text(node.commonMistake),
    });
  }

  return seeds;
}

/** How many sections this day has. The denominator in "3 of 6 done". */
export const countBlocks = (node: RoadmapNode): number => buildLessonBlocks(node).length;

/**
 * Minutes left in a day, from how far through the sections they are.
 *
 * The dashboard's whole argument is that "~9 min left" is startable on a
 * metro platform and "60 min" is not, so this is proportional to sections
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
