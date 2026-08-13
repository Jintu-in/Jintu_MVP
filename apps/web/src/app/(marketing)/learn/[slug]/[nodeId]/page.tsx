import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddCardForm } from "@/components/add-card-form";
import { MarkDoneButton } from "@/components/mark-done-button";
import { ResourceIcon } from "@/components/resource-icon";
import { SaveResourceButton } from "@/components/save-resource-button";
import { VideoFacade } from "@/components/video-facade";
import { getMyProgress, getMySaves } from "@/lib/progress";
import { getRoadmap, type NodeResource } from "@/lib/roadmaps";

/**
 * The node reader — THE core screen. A two-minute session:
 * open, read or watch one thing, tick, see what is next.
 *
 * Everything renders for anon except the two buttons that need somebody to
 * be someone (mark-done, save). Videos never load until tapped, and the tap
 * states its price — the person deciding is on metered data.
 */
export const dynamic = "force-dynamic";

type Params = { slug: string; nodeId: string };

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
  const { slug, nodeId } = await params;
  const roadmap = await getRoadmap(slug).catch(() => null);
  const node = roadmap?.modules.flatMap((m) => m.nodes).find((n) => n.id === nodeId);
  if (!roadmap || !node) return { title: "Node" };
  return {
    title: `${node.title} — ${roadmap.title}`,
    description: node.summary ?? roadmap.summary,
    alternates: { canonical: `/learn/${slug}/${nodeId}` },
  };
}

export default async function NodeReaderPage({ params }: { params: Promise<Params> }) {
  const { slug, nodeId } = await params;

  const roadmap = await getRoadmap(slug);
  if (!roadmap) notFound();

  const flat = roadmap.modules.flatMap((m) => m.nodes.map((n) => ({ node: n, module: m })));
  const at = flat.findIndex((x) => x.node.id === nodeId);
  if (at === -1) notFound();
  const { node, module } = flat[at]!;
  const next = flat[at + 1] ?? null;
  const prev = flat[at - 1] ?? null;

  const [progress, saves] = await Promise.all([
    getMyProgress([node.id]),
    getMySaves(node.resources.map((r) => r.id)),
  ]);
  const signedIn = progress !== null;
  const done = progress?.get(node.id) === "done";

  return (
    <main className="mx-auto max-w-2xl px-5 py-8 sm:py-12">
      {/* ── where am I ────────────────────────────────────────────────────── */}
      <nav className="text-sm text-ink-500">
        <Link
          href={`/learn/${slug}#node-${node.id}`}
          className="text-brand-700 underline hover:text-brand-800"
        >
          {roadmap.title}
        </Link>{" "}
        · {module.title}
      </nav>

      <h1 className="mt-4 text-2xl leading-tight font-medium text-balance text-ink-900 sm:text-3xl">
        {node.title}
      </h1>
      <p className="mt-2 font-mono text-[13px] text-ink-500">
        {node.estMinutes} min · {node.points} pts
        {node.isOptional ? " · optional" : ""}
        {done ? " · done" : ""}
      </p>

      {node.summary ? (
        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
          {node.summary}
        </p>
      ) : null}

      {node.learningObjectives.length > 0 ? (
        <ul className="mt-5 max-w-[62ch] space-y-2 border-l-2 border-ink-100 pl-4">
          {node.learningObjectives.map((o) => (
            <li key={o} className="text-[15px] leading-[1.7] text-ink-700">
              {o}
            </li>
          ))}
        </ul>
      ) : null}

      {/* ── the resources ─────────────────────────────────────────────────── */}
      {node.resources.length > 0 ? (
        <ul className="mt-8 space-y-6">
          {node.resources.map((r) => {
            const cost = dataCost(r);
            return (
              <li key={r.id} className="rounded-card border border-ink-100 bg-white p-5">
                <div className="flex items-start gap-4">
                  <ResourceIcon kind={r.type} className="mt-1 size-5 shrink-0 text-ink-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium tracking-wide text-ink-500 uppercase">
                      {TYPE_LABEL[r.type]}
                      {cost ? <span className="font-mono normal-case"> · {cost}</span> : null}
                    </p>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-[17px] leading-snug font-medium text-brand-700 underline hover:text-brand-800"
                    >
                      {r.title}
                    </a>
                    <p className="mt-1 text-sm text-ink-500">
                      {r.sourceName}
                      {r.author ? ` · ${r.author}` : ""}
                    </p>
                    {r.editorNote ? (
                      <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
                        {r.editorNote}
                      </p>
                    ) : null}
                  </div>
                  {signedIn ? (
                    <SaveResourceButton
                      resourceId={r.id}
                      roadmapSlug={slug}
                      nodeId={node.id}
                      saved={saves?.has(r.id) ?? false}
                    />
                  ) : null}
                </div>

                {r.youtubeVideoId ? (
                  <div className="mt-4">
                    <VideoFacade
                      videoId={r.youtubeVideoId}
                      title={r.title}
                      durationSec={r.durationSec}
                      estSizeMb={r.estSizeMb}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-8 max-w-[62ch] rounded-card border border-ink-100 bg-ink-50 p-5 text-[15px] leading-[1.7] text-ink-600">
          No links today — this one is practice and review. The objectives
          above are the whole session.
        </p>
      )}

      {/* ── done, and what's next ─────────────────────────────────────────── */}
      <div className="mt-10 space-y-4">
        {signedIn ? (
          <>
            <MarkDoneButton
              nodeId={node.id}
              roadmapId={roadmap.id}
              roadmapSlug={slug}
              nodeTitle={node.title}
              done={done}
            />
            <AddCardForm nodeId={node.id} roadmapSlug={slug} />
          </>
        ) : (
          <p className="text-[15px] text-ink-600">
            <Link
              href={`/join?next=/learn/${slug}/${node.id}`}
              className="text-brand-700 underline hover:text-brand-800"
            >
              Sign in
            </Link>{" "}
            to tick this node and keep your streak.
          </p>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-ink-100 pt-4 text-[15px]">
          {prev ? (
            <Link
              href={`/learn/${slug}/${prev.node.id}`}
              className="flex min-h-12 items-center text-ink-600 hover:text-ink-900"
            >
              ← {prev.node.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/learn/${slug}/${next.node.id}`}
              className="flex min-h-12 items-center text-right font-medium text-brand-700 hover:text-brand-800"
            >
              Next: {next.node.title} →
            </Link>
          ) : (
            <span className="flex min-h-12 items-center font-medium text-ink-900">
              That was the last node. The whole roadmap is behind you.
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
