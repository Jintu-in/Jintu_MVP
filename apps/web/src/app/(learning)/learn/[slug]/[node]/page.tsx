import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonRoute from "@/components/lesson/lesson-route";
import { buildLessonSteps } from "@/lib/steps";
import { getMyCodeLanguage } from "@/lib/code-language";
import { getSiteUrl } from "@/lib/env";
import { getMyMomentum } from "@/lib/momentum";
import { getMyProgress } from "@/lib/progress";
import { getRoadmap } from "@/lib/roadmaps";
import { getMyFirstName, shareHeadline, shareLessonLine } from "@/lib/share-card";
import { DEFAULT_CODE_LANGUAGE } from "@jintu/contracts";

/**
 * The day page, rendered one step at a time through LessonRoute/StepReader
 * (Phase 5 Part A). Steps come from lib/steps.ts, NOT lib/blocks.ts — the
 * dashboard (lib/dashboard.ts) still counts the old six-block model, by
 * design unchanged (see steps.ts's own header comment for why these two
 * counts are now allowed to diverge rather than share one builder, as the
 * six-block page used to require).
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
  const description = `Lesson ${at + 1} of ${flat.length} · ${node.estMinutes} min · ${node.points} pts — ${node.summary ?? roadmap.summary}`;
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

  // All of this roadmap's nodes, not just the current one — the done
  // screen's "lessons" stat counts the whole roadmap, not this day alone.
  const [progress, momentum, firstName] = await Promise.all([
    getMyProgress(flat.map((x) => x.node.id)),
    getMyMomentum(),
    getMyFirstName(),
  ]);
  const signedIn = progress !== null;
  const done = progress?.get(node.id) === "done";
  const doneCount = progress ? [...progress.values()].filter((s) => s === "done").length : 0;

  const steps = buildLessonSteps(node);
  const lessonNumber = String(at + 1);

  // The DSA language switch's remembered choice — read only when this day
  // actually has a codeMulti step, so the other ~100% of lessons (no real
  // DSA roadmap exists yet) pay nothing for a preference they never use.
  const codeLanguage = steps.some((s) => s.kind === "codeMulti")
    ? await getMyCodeLanguage()
    : DEFAULT_CODE_LANGUAGE;

  return (
    <LessonRoute
      slug={slug}
      nodeSlug={node.slug}
      nodeId={node.id}
      roadmapId={roadmap.id}
      roadmapTitle={roadmap.title}
      moduleLabel={`Module ${String(module.position).padStart(2, "0")} · ${module.title}`}
      lessonNumber={lessonNumber}
      points={node.points}
      signedIn={signedIn}
      initialDone={done}
      steps={steps}
      estMinutes={node.estMinutes}
      initialCodeLanguage={codeLanguage}
      next={
        next
          ? {
              lessonNumber: String(at + 2),
              title: next.node.title,
              metaLine: `${next.node.estMinutes} min · ${next.node.points} pts`,
              href: `/learn/${slug}/${next.node.slug}`,
            }
          : undefined
      }
      // Pre-completion counts for the done screen — correct at the only
      // moment they are shown (after completion settles, see
      // lesson-route.tsx), and the right fallback for a revisit to an
      // already-done lesson, which never calls setNodeDone again.
      streakDaysNow={momentum?.streakDays ?? 0}
      lessonsLine={`${Math.min(doneCount + (done ? 0 : 1), flat.length)} of ${flat.length}`}
      accomplishmentLine={`You finished ${node.title}.`}
      // "Share your progress" (Phase 5 Part D, 2/2) — the same strings the
      // downloadable card (api/share-card/[slug]/[node]) renders, built
      // from the same lib/share-card.ts helpers, so the on-screen preview
      // never says something different from what gets shared or saved.
      shareHeadline={shareHeadline(firstName, node.title)}
      shareLessonLine={shareLessonLine(at + 1, flat.length, roadmap.title)}
      shareUrl={new URL(`/learn/${slug}/${node.slug}`, getSiteUrl()).toString()}
      shareImagePath={`/api/share-card/${slug}/${node.slug}`}
    />
  );
}
