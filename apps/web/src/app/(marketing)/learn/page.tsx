import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedRoadmaps } from "@/lib/roadmaps";

/**
 * The catalogue: every published roadmap as a plain row, filterable by ?q=.
 *
 * The filter is a server-side substring match over title, summary and tags —
 * enough for the homepage's "what do you want to learn?" form to land
 * somewhere honest. Faceted browse and ranked search remain the phase-3
 * catalogue screen; this page holds the /learn URL they will inherit.
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

export default async function RoadmapsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  const all = await listPublishedRoadmaps();
  const roadmaps = query
    ? all.filter((r) =>
        [r.title, r.summary, ...r.subjectTags].some((s) => s.toLowerCase().includes(query)),
      )
    : all;

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

      <form action="/learn" method="get" className="mt-8 flex max-w-xl gap-2" role="search">
        <label htmlFor="learn-q" className="sr-only">
          Search roadmaps
        </label>
        <input
          id="learn-q"
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="what do you want to learn?"
          className="h-12 min-w-0 flex-1 rounded-lg border border-ink-200 bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-500 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-brand-700"
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Search
        </button>
      </form>

      {query && roadmaps.length === 0 ? (
        <p className="mt-10 max-w-[62ch] border-t border-ink-100 pt-8 text-[15px] leading-[1.7] text-ink-600">
          Nothing published matches &ldquo;{q}&rdquo; yet. New roadmaps ship
          only after every link in them has been checked by a person — tell
          us what you were looking for via the{" "}
          <Link href="/contact" className="text-brand-700 underline hover:text-brand-800">
            contact page
          </Link>{" "}
          and it joins the queue.
        </p>
      ) : roadmaps.length === 0 ? (
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
