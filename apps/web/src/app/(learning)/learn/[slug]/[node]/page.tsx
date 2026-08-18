import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonRoute, { type LessonBlockSeed } from "@/components/lesson/lesson-route";
import { getMyProgress } from "@/lib/progress";
import { getRoadmap, type NodeResource } from "@/lib/roadmaps";

/**
 * The day page, rendered through the design-set LessonPage component via
 * the LessonRoute client seam. The seven-block model keeps the spec's
 * exact order: context before content, content before doing, doing before
 * self-testing, self-testing before the reward. "Check yourself" after
 * the challenge is retrieval practice; before it, it would be a quiz — a
 * different and weaker thing. Do not rearrange.
 *
 * Every block is optional — a day renders what it has, so pre-model
 * content stays valid while it grows in.
 */
export const dynamic = "force-dynamic";

type Params = { slug: string; node: string };

const TYPE_LABEL: Record<NodeResource["type"], string> = {
  read: "Read",
  video: "Video",
  doc: "Docs",
  case_study: "Case study",
  tool: "Tool",
  latest: "Latest",
};

function dataCost(r: NodeResource): string | null {
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

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, node: nodeParam } = await params;
  const roadmap = await getRoadmap(slug).catch(() => null);
  const flat = roadmap?.modules.flatMap((m) => m.nodes) ?? [];
  const at = flat.findIndex((n) => n.slug === nodeParam || n.id === nodeParam);
  const node = at === -1 ? undefined : flat[at];
  if (!roadmap || !node) return { title: "Node" };
  const description = `Day ${at + 1} of ${flat.length} · ${node.estMinutes} min · ${node.points} pts — ${node.summary ?? roadmap.summary}`;
  return {
    title: `${node.title} — ${roadmap.title}`,
    description,
    alternates: { canonical: `/learn/${slug}/${node.slug}` },
    openGraph: {
      title: node.title,
      description,
      url: `/learn/${slug}/${node.slug}`,
      type: "article",
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image" },
  };
}

const text = (t: string) => [{ kind: "text" as const, text: t }];

export default async function DayPage({ params }: { params: Promise<Params> }) {
  const { slug, node: nodeParam } = await params;

  const roadmap = await getRoadmap(slug);
  if (!roadmap) notFound();

  const flat = roadmap.modules.flatMap((m) => m.nodes.map((n) => ({ node: n, module: m })));
  // Slug first, id as a fallback so any pre-slug link someone saved resolves.
  const at = flat.findIndex((x) => x.node.slug === nodeParam || x.node.id === nodeParam);
  if (at === -1) notFound();
  const { node, module } = flat[at]!;
  const next = flat[at + 1] ?? null;
  const prev = flat[at - 1] ?? null;

  const progress = await getMyProgress([node.id]);
  const signedIn = progress !== null;
  const done = progress?.get(node.id) === "done";

  // ── the seven blocks, in the spec's order ──────────────────────────────
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

  const dayNumber = String(at + 1);
  const metaLine = `${node.estMinutes} min · ${node.points} pts${node.isOptional ? " · optional" : ""}`;

  return (
    <LessonRoute
      slug={slug}
      nodeSlug={node.slug}
      nodeId={node.id}
      roadmapId={roadmap.id}
      roadmapTitle={roadmap.title}
      moduleLabel={`Module ${String(module.position).padStart(2, "0")} · ${module.title}`}
      title={node.title}
      dayLabel={`Day ${dayNumber} of ${flat.length}`}
      metaLine={metaLine}
      dayNumber={dayNumber}
      points={node.points}
      signedIn={signedIn}
      initialDone={done}
      seeds={seeds}
      prev={prev ? { label: `← Day ${at} · ${prev.node.title}`, href: `/learn/${slug}/${prev.node.slug}` } : undefined}
      next={
        next
          ? { label: `Day ${at + 2} · ${next.node.title} →`, href: `/learn/${slug}/${next.node.slug}` }
          : undefined
      }
      railFooter={[metaLine, `day ${dayNumber} of ${flat.length}`]}
    />
  );
}
