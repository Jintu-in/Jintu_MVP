import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import RoadmapRoute from "@/components/roadmap/roadmap-route";
import type {
  RoadmapDay,
  RoadmapFilterOption,
  RoadmapModule as RoadmapModuleProps,
} from "@/components/roadmap/roadmap-page";
import { getMyMomentum } from "@/lib/momentum";
import { getMyProgress } from "@/lib/progress";
import { getRoadmap, type RoadmapNode } from "@/lib/roadmaps";

/**
 * The roadmap page, rendered through the design-set RoadmapPage component
 * (docs/design/Roadmap page + Roadmap body). This file's whole job is
 * shaping data into the component's strings — every number below is
 * computed from real rows, never typed in.
 *
 * Rendered on demand: CI builds with no Supabase configured, and a public
 * page this deep changes whenever curation does.
 */
export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug).catch(() => null);
  if (!roadmap) return { title: "Roadmap" };
  const description = `${roadmap.summary} Free, self-paced, no account needed to read.`;
  return {
    title: roadmap.title,
    description,
    alternates: { canonical: `/learn/${slug}` },
    openGraph: {
      title: `${roadmap.title} — a free roadmap`,
      description,
      url: `/learn/${slug}`,
      type: "website",
    },
  };
}

/** "2 reads · 1 video · 45 min · 25 pts" — the day row's honest price. */
function nodeMeta(node: RoadmapNode): string {
  const reads = node.resources.filter(
    (r) => r.type === "read" || r.type === "doc" || r.type === "case_study",
  ).length;
  const videos = node.resources.filter((r) => r.type === "video").length;
  const parts = [];
  if (reads) parts.push(`${reads} ${reads === 1 ? "read" : "reads"}`);
  if (videos) parts.push(`${videos} ${videos === 1 ? "video" : "videos"}`);
  parts.push(`${node.estMinutes} min`);
  parts.push(`${node.points} pts`);
  if (node.isOptional) parts.push("optional");
  return parts.join(" · ");
}

function sizeLabel(mb: number): string {
  return mb >= 1000 ? `~${(mb / 1000).toFixed(1)} GB` : `~${Math.round(mb)} MB`;
}

export default async function RoadmapScreen({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  const roadmap = await getRoadmap(slug);
  if (!roadmap) notFound();

  const allNodes = roadmap.modules.flatMap((m) => m.nodes);
  const [progress, momentum] = await Promise.all([
    getMyProgress(allNodes.map((n) => n.id)),
    getMyMomentum(),
  ]);
  const signedIn = progress !== null;
  const isDone = (id: string) => progress?.get(id) === "done";

  const doneTotal = allNodes.filter((n) => isDone(n.id)).length;
  const nextNode = allNodes.find((n) => !isDone(n.id)) ?? allNodes[0]!;
  const nextIndex = allNodes.findIndex((n) => n.id === nextNode.id);
  const nextModule = roadmap.modules.find((m) => m.nodes.some((n) => n.id === nextNode.id));
  const pct = allNodes.length ? Math.round((doneTotal / allNodes.length) * 100) : 0;
  const allDone = doneTotal === allNodes.length && allNodes.length > 0;

  // The bandwidth filter's consequence line, in real megabytes: the sum of
  // est_size_mb over every video resource in the roadmap. No estimate in
  // the data, no number in the line — never invent one.
  const videoMb = allNodes
    .flatMap((n) => n.resources)
    .filter((r) => r.type === "video")
    .reduce((a, r) => a + (r.estSizeMb ?? 0), 0);
  const filterOptions: RoadmapFilterOption[] = [
    {
      id: "all",
      label: "Everything",
      note: videoMb > 0 ? `${sizeLabel(videoMb)} of video if you load every player` : "",
    },
    {
      id: "reads",
      label: "Reads only",
      note:
        videoMb > 0
          ? `skips ${sizeLabel(videoMb)} of video`
          : "no videos in this roadmap — nothing to skip",
    },
    {
      id: "videos",
      label: "Videos only",
      note: videoMb > 0 ? `${sizeLabel(videoMb)} of video in total` : "no videos in this roadmap",
    },
  ];

  // "~35 min left in module 01" — the next session's honest cost.
  const remainMin = nextModule
    ? nextModule.nodes.filter((n) => !isDone(n.id)).reduce((a, n) => a + n.estMinutes, 0)
    : 0;
  const lastOpenedLine = !signedIn
    ? "free · no account needed to read"
    : allDone
      ? `all ${allNodes.length} days done`
      : `~${remainMin} min left in module ${String(nextModule?.position ?? 1).padStart(2, "0")}`;

  let dayCounter = 0;
  const modules: RoadmapModuleProps[] = roadmap.modules.map((m) => {
    const moduleDone = m.nodes.filter((n) => isDone(n.id)).length;
    const days: RoadmapDay[] = m.nodes.map((n) => {
      dayCounter += 1;
      return {
        id: n.id,
        href: `/learn/${slug}/${n.slug}`,
        state: isDone(n.id) ? "done" : n.id === nextNode.id && !allDone ? "next" : "todo",
        dayNumber: String(dayCounter),
        title: n.title,
        summary: n.summary ?? "",
        meta: nodeMeta(n),
      };
    });
    const metaParts = [
      signedIn ? `${moduleDone} of ${m.nodes.length} days` : `${m.nodes.length} days`,
    ];
    if (m.estHours) metaParts.push(`~${m.estHours} hrs`);
    return {
      id: m.id,
      label: `Module ${String(m.position).padStart(2, "0")}${m.weekRange ? ` · ${m.weekRange}` : ""}`,
      title: m.title,
      tools: m.objective ?? "",
      meta: metaParts.join(" · "),
      progressPct: m.nodes.length ? Math.round((moduleDone / m.nodes.length) * 100) : 0,
      defaultOpen: m.id === nextModule?.id || (!nextModule && m.position === 1),
      days,
      deliverable: m.deliverable
        ? // +50 is the module-completion award in the points schema (0008) —
          // the one number here that is a rule rather than a sum.
          { text: m.deliverable, meta: "module bonus +50 pts" }
        : undefined,
    };
  });

  const statChips = [
    { label: `${allNodes.length} days` },
    { label: `${roadmap.modules.length} modules` },
    ...(roadmap.estimatedHours ? [{ label: `~${roadmap.estimatedHours} hours` }] : []),
    { label: "free", accent: true },
  ];

  const footnote = [
    "Every resource on this page lives on its author's own site. We link and sequence; we never copy, and nothing here was paywalled when a person last checked it.",
    roadmap.licenseNote ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <RoadmapRoute
      backHref={"/learn" as Route}
      continueHref={`/learn/${slug}/${nextNode.slug}` as Route}
      breadcrumb={{ list: "Roadmaps", category: roadmap.subjectTags[0] ?? roadmap.difficulty }}
      title={roadmap.title}
      description={roadmap.summary}
      statChips={statChips}
      progress={{
        daysCount: `${doneTotal} of ${allNodes.length}`,
        statLine: momentum ? `${pct}% · ${momentum.totalPoints} pts` : `${pct}%`,
        pct,
        continueDayNumber: String(nextIndex + 1),
        continueTitle: nextNode.title,
        lastOpenedLine,
      }}
      filter={{ question: "On metered data?", options: filterOptions }}
      modules={modules}
      footnote={footnote}
    />
  );
}
