import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonRoute from "@/components/lesson/lesson-route";
import { buildLessonBlocks } from "@/lib/blocks";
import { getMyProgress } from "@/lib/progress";
import { getRoadmap } from "@/lib/roadmaps";

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

  // The seven-block model, built by the one shared builder so the
  // dashboard's "block 12 of 16" counts the same blocks this page renders.
  const seeds = buildLessonBlocks(node);

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
