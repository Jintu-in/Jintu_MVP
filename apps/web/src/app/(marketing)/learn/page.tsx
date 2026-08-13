import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedRoadmaps } from "@/lib/roadmaps";

/**
 * The catalogue, first data-bearing version: every published roadmap as a
 * plain row. Faceted browse and search are the phase-3 catalogue screen;
 * this page's only job today is to prove the pipe — database → RLS →
 * public page — and to hold the /learn URL it has always had.
 *
 * Rendered on demand: CI builds with no Supabase configured.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Roadmaps",
  description:
    "Deep, free roadmaps for any subject — curated reads, videos and docs in the order that teaches. Readable without an account.",
  alternates: { canonical: "/learn" },
};

export default async function RoadmapsPage() {
  const roadmaps = await listPublishedRoadmaps();

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">Roadmaps</p>
      <h1 className="mt-3 text-3xl leading-tight font-medium text-balance text-ink-900 sm:text-4xl">
        Pick a subject. Follow it to the end.
      </h1>
      <p className="mt-4 max-w-[62ch] text-lg text-pretty text-ink-600">
        Every roadmap is free, readable without an account, and built from the
        best free content on the internet — checked by a person before it
        ships.
      </p>

      {roadmaps.length === 0 ? (
        <p className="mt-10 max-w-[62ch] border-t border-ink-100 pt-8 text-[15px] leading-[1.7] text-ink-600">
          The first roadmaps are in link-check right now. A roadmap ships only
          after every resource in it has been seen to resolve — a dead link on
          this page would cost more trust than an empty page does.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-ink-100 border-y border-ink-100">
          {roadmaps.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/learn/${r.slug}`}
                className="group flex min-h-12 flex-col gap-1 py-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-700"
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="text-[17px] font-medium text-ink-900 group-hover:text-brand-800">
                    {r.title}
                  </span>
                  <span className="shrink-0 font-mono text-[13px] text-ink-500">
                    {r.difficulty}
                    {r.estimatedWeeks ? ` · ~${r.estimatedWeeks}w` : ""}
                  </span>
                </span>
                <span className="max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
                  {r.summary}
                </span>
                <span className="font-mono text-[13px] text-ink-500">
                  {r.moduleCount} modules · {r.nodeCount} nodes
                  {r.estimatedHours ? ` · ~${r.estimatedHours} hours` : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
