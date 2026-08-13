import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NodeTick } from "@/components/node-tick";
import { getMyProgress } from "@/lib/progress";
import { getRoadmap, type RoadmapNode } from "@/lib/roadmaps";
import { cn } from "@/lib/utils";

/**
 * The roadmap page — phase-3 screen 1.
 *
 * Linear and collapsible, never a diagram: modules are native <details>, the
 * one holding your next node open by default, so the page answers "what do I
 * tap now" without JS. Reading it needs no account; ticks appear only with a
 * session. The reads/videos filter is a DATA filter — its job is "I am on
 * metered mobile data", not a learning-style theory.
 *
 * Rendered on demand: CI builds with no Supabase configured, and a public
 * page this deep changes whenever curation does.
 */
export const dynamic = "force-dynamic";

type Params = { slug: string };
type Search = { focus?: string };

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

const FOCUS = {
  reads: { types: ["read", "doc", "case_study"], label: "reads" },
  videos: { types: ["video"], label: "videos" },
} as const;
type FocusKey = keyof typeof FOCUS;

const isFocus = (v: string | undefined): v is FocusKey => v === "reads" || v === "videos";

function nodeMeta(node: RoadmapNode): string {
  const reads = node.resources.filter((r) => r.type === "read" || r.type === "doc" || r.type === "case_study").length;
  const videos = node.resources.filter((r) => r.type === "video").length;
  const parts = [];
  if (reads) parts.push(`${reads} ${reads === 1 ? "read" : "reads"}`);
  if (videos) parts.push(`${videos} ${videos === 1 ? "video" : "videos"}`);
  parts.push(`${node.estMinutes} min`);
  parts.push(`${node.points} pts`);
  return parts.join(" · ");
}

export default async function RoadmapPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const [{ slug }, { focus: rawFocus }] = await Promise.all([params, searchParams]);
  const focus = isFocus(rawFocus) ? rawFocus : undefined;

  const roadmap = await getRoadmap(slug);
  if (!roadmap) notFound();

  const allNodes = roadmap.modules.flatMap((m) => m.nodes);
  const progress = await getMyProgress(allNodes.map((n) => n.id));
  const signedIn = progress !== null;
  const isDone = (id: string) => progress?.get(id) === "done";

  const nextNode = allNodes.find((n) => !isDone(n.id)) ?? null;
  const nextModule = roadmap.modules.find((m) => m.nodes.some((n) => n.id === nextNode?.id));
  const doneTotal = allNodes.filter((n) => isDone(n.id)).length;

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      {/* ── header ────────────────────────────────────────────────────────── */}
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">Roadmap</p>
      <h1 className="mt-3 text-3xl leading-tight font-medium text-balance text-ink-900 sm:text-4xl">
        {roadmap.title}
      </h1>
      <p className="mt-4 max-w-[62ch] text-lg text-pretty text-ink-600">{roadmap.summary}</p>

      <p className="mt-4 font-mono text-[13px] text-ink-500">
        {roadmap.difficulty}
        {roadmap.estimatedWeeks ? ` · ~${roadmap.estimatedWeeks} weeks` : ""}
        {roadmap.estimatedHours ? ` · ~${roadmap.estimatedHours} hours` : ""}
        {` · ${roadmap.modules.length} modules · ${allNodes.length} nodes`}
      </p>

      {/* ── continue ──────────────────────────────────────────────────────── */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        {nextNode ? (
          <a
            href={`#node-${nextNode.id}`}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-700 px-6 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            {doneTotal > 0 ? "Continue — " : "Start — "}
            {nextNode.title}
          </a>
        ) : (
          <p className="text-[15px] font-medium text-ink-900">
            Every node done. That is the whole roadmap.
          </p>
        )}
        {signedIn ? (
          doneTotal > 0 ? (
            <span className="font-mono text-[13px] text-ink-500">
              {doneTotal}/{allNodes.length} done
            </span>
          ) : null
        ) : (
          <Link
            href={`/join?next=/learn/${slug}`}
            className="text-[15px] text-brand-700 underline hover:text-brand-800"
          >
            Sign in to keep your progress
          </Link>
        )}
      </div>

      {/* ── data filter ───────────────────────────────────────────────────── */}
      <nav aria-label="Save data" className="mt-8 flex items-center gap-2 text-sm">
        <span className="text-ink-500">On mobile data?</span>
        <FilterChip href={`/learn/${slug}`} active={!focus}>
          Everything
        </FilterChip>
        <FilterChip href={`/learn/${slug}?focus=reads`} active={focus === "reads"}>
          Reads only
        </FilterChip>
        <FilterChip href={`/learn/${slug}?focus=videos`} active={focus === "videos"}>
          Videos only
        </FilterChip>
      </nav>

      {/* ── modules ───────────────────────────────────────────────────────── */}
      <div className="mt-6 space-y-4">
        {roadmap.modules.map((module) => {
          const moduleDone = module.nodes.filter((n) => isDone(n.id)).length;
          return (
            <details
              key={module.id}
              open={module.id === nextModule?.id || !nextModule}
              className="rounded-card border border-ink-100 bg-white"
            >
              <summary className="flex min-h-12 cursor-pointer list-none flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-[13px] text-ink-500">
                  {String(module.position).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[15px] font-medium text-ink-900">{module.title}</span>
                <span className="font-mono text-[13px] text-ink-500">
                  {module.weekRange ? `${module.weekRange} · ` : ""}
                  {signedIn ? `${moduleDone}/${module.nodes.length}` : `${module.nodes.length} nodes`}
                </span>
              </summary>

              <div className="border-t border-ink-100 px-5 pb-5">
                {module.objective ? (
                  <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
                    {module.objective}
                  </p>
                ) : null}

                <ul className="mt-4 divide-y divide-ink-100">
                  {module.nodes.map((node) => {
                    const matches =
                      !focus ||
                      node.resources.some((r) =>
                        (FOCUS[focus].types as readonly string[]).includes(r.type),
                      );
                    const missingLabel = focus ? FOCUS[focus].label : "";
                    return (
                      <li
                        key={node.id}
                        id={`node-${node.id}`}
                        className={cn(
                          "flex scroll-mt-24 items-center gap-4 py-3",
                          !matches && "opacity-45",
                        )}
                      >
                        <span className="w-6 shrink-0 font-mono text-[13px] text-ink-500">
                          {node.position}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] leading-snug text-ink-900">
                            {node.title}
                            {node.isOptional ? (
                              <span className="ml-2 text-[13px] text-ink-500">optional</span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block font-mono text-[13px] text-ink-500">
                            {nodeMeta(node)}
                            {!matches ? ` — no ${missingLabel} in this node` : ""}
                          </span>
                        </span>
                        {signedIn ? (
                          <NodeTick
                            nodeId={node.id}
                            roadmapId={roadmap.id}
                            roadmapSlug={slug}
                            nodeTitle={node.title}
                            done={isDone(node.id)}
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>

                {module.deliverable ? (
                  <p className="mt-4 border-t border-ink-100 pt-4 text-[15px] leading-[1.7] text-ink-600">
                    <span className="font-medium text-ink-900">Worth having at the end: </span>
                    {module.deliverable}
                  </p>
                ) : null}
              </div>
            </details>
          );
        })}
      </div>

      {roadmap.licenseNote ? (
        <p className="mt-8 max-w-[62ch] text-[13px] leading-[1.7] text-ink-500">
          {roadmap.licenseNote}
        </p>
      ) : null}

      <p className="mt-3 max-w-[62ch] text-[13px] leading-[1.7] text-ink-500">
        Every resource on this page lives on its author&apos;s own site. We link and
        sequence; we never copy, and nothing here was paywalled when a person
        last checked it.
      </p>
    </main>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: Route<`/learn/${string}`>;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex h-9 items-center rounded-lg border px-3",
        active
          ? "border-brand-700 font-medium text-brand-700"
          : "border-ink-200 text-ink-600 hover:border-ink-200 hover:text-ink-900",
      )}
    >
      {children}
    </Link>
  );
}
