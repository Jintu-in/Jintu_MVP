import Link from "next/link";
import { TopicRequestForm } from "@/components/learn/topic-request-form";
import { listPublishedRoadmaps } from "@/lib/roadmaps";

/**
 * A roadmap slug we have not written.
 *
 * Names it plainly, shows what does exist, and takes one line of input —
 * because somebody who arrived by name is the clearest demand signal the
 * product gets, and a bare 404 throws that away.
 */
export const dynamic = "force-dynamic";

export default async function RoadmapNotFound() {
  const roadmaps = await listPublishedRoadmaps().catch(() => []);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[520px] bg-white px-5 py-12">
      <h1 className="text-[22px] leading-[1.3] font-medium text-ink-900">
        We have not written that one yet.
      </h1>

      {roadmaps.length ? (
        <>
          <p className="mt-2.5 text-[15px] leading-[1.7] text-pretty text-ink-600">
            {roadmaps.length === 1 ? "Here is the one we have:" : `Here are the ${roadmaps.length} we have:`}
          </p>
          <div className="mt-4 overflow-hidden rounded-card border border-ink-100">
            {roadmaps.map((r) => (
              <Link
                key={r.slug}
                href={`/learn/${r.slug}`}
                className="flex min-h-12 flex-col justify-center border-b border-ink-100 px-4 py-3 last:border-b-0 hover:bg-ink-50"
              >
                <span className="text-[15px] leading-[1.4] text-ink-900">{r.title}</span>
                <span className="mt-1 font-mono text-[12px] leading-none text-ink-500">
                  {r.difficulty}
                  {r.estimatedWeeks ? ` · ~${r.estimatedWeeks} weeks` : ""}
                </span>
              </Link>
            ))}
          </div>
        </>
      ) : null}

      <TopicRequestForm source="not_found" label="Tell us what you were looking for" />
    </main>
  );
}
