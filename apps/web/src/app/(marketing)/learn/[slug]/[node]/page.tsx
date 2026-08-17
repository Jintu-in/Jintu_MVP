import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddCardForm } from "@/components/add-card-form";
import { MarkDoneButton } from "@/components/mark-done-button";
import { ResourceIcon } from "@/components/resource-icon";
import { SaveResourceButton } from "@/components/save-resource-button";
import { StreakStrip } from "@/components/streak-strip";
import { VideoFacade } from "@/components/video-facade";
import { getMyProgress, getMySaves, getMyStreak } from "@/lib/progress";
import { getRoadmap, type NodeResource } from "@/lib/roadmaps";

/**
 * The day page — the seven-block model in the spec's exact order:
 * context before content, content before doing, doing before self-testing,
 * self-testing before the reward. "Check yourself" after the challenge is
 * retrieval practice; before it, it would be a quiz — a different and
 * weaker thing. Do not rearrange.
 *
 * Reading stays open to everyone; the streak strip and the two buttons
 * appear only with a session. Every block is optional — a day renders
 * what it has, so pre-model content stays valid while it grows in.
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

  const [progress, saves, streak] = await Promise.all([
    getMyProgress([node.id]),
    getMySaves(node.resources.map((r) => r.id)),
    getMyStreak(),
  ]);
  const signedIn = progress !== null;
  const done = progress?.get(node.id) === "done";

  return (
    <main className="mx-auto max-w-2xl px-5 pb-8 sm:pb-12">
      {/* 1 — the streak strip, the reason the app was opened */}
      {streak ? <StreakStrip streak={streak} /> : null}

      <div className="pt-6 sm:pt-8">
        {/* 2 — breadcrumb */}
        <nav className="text-sm text-ink-500">
          <Link
            href={`/learn/${slug}#node-${node.id}`}
            className="text-brand-700 underline hover:text-brand-800"
          >
            {roadmap.title}
          </Link>{" "}
          · Module {module.position} · {module.title}
        </nav>

        {/* 3 — title + meta */}
        <h1 className="mt-4 text-2xl leading-tight font-medium text-balance text-ink-900 sm:text-3xl">
          {node.title}
        </h1>
        <p className="mt-2 font-mono text-[13px] text-ink-500">
          Day {at + 1} of {flat.length} · {node.estMinutes} min · {node.points} pts
          {node.isOptional ? " · optional" : ""}
          {done ? " · done" : ""}
        </p>

        {/* 4 — summary */}
        {node.summary ? (
          <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
            {node.summary}
          </p>
        ) : null}

        {/* 5 — why today exists */}
        {node.whyToday ? (
          <div className="mt-6 max-w-[62ch] rounded-card bg-brand-50 p-5">
            <p className="text-[13px] font-medium tracking-wide text-brand-800 uppercase">
              Why today exists
            </p>
            <p className="mt-2 text-[15px] leading-[1.7] text-pretty text-ink-800">
              {node.whyToday}
            </p>
          </div>
        ) : null}

        {/* 6 — today's topics (objectives list until content grows in) */}
        {node.topics.length > 0 ? (
          <ol className="mt-6 max-w-[62ch] space-y-3">
            {node.topics.map((t, i) => (
              <li key={t.position} className="flex gap-3">
                <span className="w-5 shrink-0 font-mono text-[13px] text-ink-500">{i + 1}</span>
                <span>
                  <span className="block text-[15px] font-medium text-ink-900">{t.title}</span>
                  <span className="block text-[15px] leading-[1.7] text-ink-600">{t.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        ) : node.learningObjectives.length > 0 ? (
          <ul className="mt-5 max-w-[62ch] space-y-2 border-l-2 border-ink-100 pl-4">
            {node.learningObjectives.map((o) => (
              <li key={o} className="text-[15px] leading-[1.7] text-ink-700">
                {o}
              </li>
            ))}
          </ul>
        ) : null}

        {/* 7 — read & watch */}
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
                      {r.health === "broken" ? (
                        <p className="mt-2 text-sm text-ink-600">
                          This link failed our last check — it may have moved.
                          If it is dead for you too,{" "}
                          <Link href="/report" className="underline hover:text-ink-900">
                            tell us
                          </Link>{" "}
                          and a person fixes it.
                        </p>
                      ) : null}
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
            No links today — this one is practice and review. The work above
            is the whole session.
          </p>
        )}

        {/* 8 — today's challenge */}
        {node.challenge ? (
          <div className="mt-8 rounded-card border-2 border-brand-700 bg-white p-5">
            <p className="flex items-baseline justify-between gap-4">
              <span className="text-[13px] font-medium tracking-wide text-brand-800 uppercase">
                Today&apos;s challenge
              </span>
              {node.challengeMinutes ? (
                <span className="font-mono text-[13px] text-ink-500">
                  ~{node.challengeMinutes} min
                </span>
              ) : null}
            </p>
            <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-800">
              {node.challenge}
            </p>
          </div>
        ) : null}

        {/* 9 — check yourself: retrieval practice AFTER doing, never before */}
        {node.checks.length > 0 ? (
          <section className="mt-8" aria-labelledby="checks">
            <h2 id="checks" className="text-lg font-medium text-ink-900">
              Check yourself
            </h2>
            <div className="mt-3 space-y-2">
              {node.checks.map((c) => (
                <details
                  key={c.position}
                  className="rounded-card border border-ink-100 bg-white"
                >
                  <summary className="flex min-h-12 cursor-pointer list-none items-center px-5 text-[15px] text-ink-900 [&::-webkit-details-marker]:hidden">
                    {c.question}
                  </summary>
                  <p className="border-t border-ink-100 px-5 py-4 text-[15px] leading-[1.7] text-pretty text-ink-700">
                    {c.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {/* 10 — the mistake almost everyone makes */}
        {node.commonMistake ? (
          <div className="mt-8 max-w-[62ch] rounded-card border border-ink-100 bg-ink-50 p-5">
            <p className="text-[13px] font-medium tracking-wide text-ink-500 uppercase">
              The mistake almost everyone makes
            </p>
            <p className="mt-2 text-[15px] leading-[1.7] text-pretty text-ink-700">
              {node.commonMistake}
            </p>
          </div>
        ) : null}

        {/* 11 — principle */}
        {node.principle ? (
          <p className="mt-8 max-w-[62ch] border-l-4 border-brand-500 pl-4 text-[15px] leading-[1.7] text-ink-700 italic">
            {node.principle}
          </p>
        ) : null}

        {/* 12 — mark done, and what it earns */}
        <div className="mt-10 space-y-4">
          {signedIn ? (
            <>
              <MarkDoneButton
                nodeId={node.id}
                roadmapId={roadmap.id}
                roadmapSlug={slug}
                nodeTitle={node.title}
                points={node.points}
                done={done}
              />
              <AddCardForm nodeId={node.id} roadmapSlug={slug} />
            </>
          ) : (
            <p className="text-[15px] text-ink-600">
              <Link
                href={`/join?next=/learn/${slug}/${node.slug}`}
                className="text-brand-700 underline hover:text-brand-800"
              >
                Sign in
              </Link>{" "}
              to mark this day done and keep your streak.
            </p>
          )}

          {/* 13 — prev / next, named */}
          <div className="flex items-center justify-between gap-4 border-t border-ink-100 pt-4 text-[15px]">
            {prev ? (
              <Link
                href={`/learn/${slug}/${prev.node.slug}`}
                className="flex min-h-12 items-center text-ink-600 hover:text-ink-900"
              >
                ← {prev.node.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/learn/${slug}/${next.node.slug}`}
                className="flex min-h-12 items-center text-right font-medium text-brand-700 hover:text-brand-800"
              >
                Next: {next.node.title} →
              </Link>
            ) : (
              <span className="flex min-h-12 items-center font-medium text-ink-900">
                That was the last day. The whole roadmap is behind you.
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
