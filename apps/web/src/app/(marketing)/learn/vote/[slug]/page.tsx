import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VoteButton } from "@/components/vote-button";
import { getCourseProposal } from "@/lib/curriculum";

/**
 * A course nobody has built yet.
 *
 * This route exists because the alternative was worse. Eighteen tracks were
 * published as six-week courses with three resources between them, so anyone
 * who clicked past the finished track found a syllabus with nothing under it.
 * The honest version of an empty course is not an empty course — it is a
 * question.
 *
 * Dynamic rather than static: the vote count is the whole point, and a
 * prerendered one would be wrong the moment anybody pressed the button.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proposal = await getCourseProposal(slug).catch(() => null);
  if (!proposal) return { title: "Course not found" };

  const title = `${proposal.title} — not built yet`;
  return {
    title,
    description: `${proposal.summary} Nobody has built this yet. Vote for it and we will build the most-wanted one next.`,
    alternates: { canonical: `/learn/vote/${proposal.slug}` },
    openGraph: { title, description: proposal.summary, type: "article" },
    twitter: { card: "summary_large_image", title, description: proposal.summary },
    // Proposals are not curriculum. Keeping eighteen thin pages out of the
    // index protects the one course that should rank.
    robots: { index: false, follow: true },
  };
}

export default async function VotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposal = await getCourseProposal(slug);

  if (!proposal) notFound();

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:py-14">
      <Link
        href="/learn"
        className="text-sm text-ink-500 underline hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        ← All courses
      </Link>

      <p className="mt-8 text-sm font-medium tracking-wide text-brand-700 uppercase">
        Not built yet
      </p>
      <h1 className="mt-3 text-3xl leading-tight font-medium text-balance text-ink-900 sm:text-4xl">
        {proposal.title}
      </h1>
      <p className="mt-4 text-lg text-pretty text-ink-600">{proposal.summary}</p>

      <div className="mt-8 rounded-card border border-ink-100 bg-white p-6">
        <p className="text-pretty text-ink-700">
          Nobody has written this one. We build one course properly rather than
          nineteen badly, so the next one is whichever the most people ask for.
        </p>

        <VoteButton slug={proposal.slug} votes={proposal.votes} />

        {/*
          Said plainly because the number is weak and the site's whole
          positioning is not publishing figures it cannot stand behind. One
          vote per browser is all this enforces — see the voter_key comment in
          the migration.
        */}
        <p className="mt-5 border-t border-ink-100 pt-4 text-sm text-pretty text-ink-500">
          One vote per browser, and no account needed — we do not know who you
          are and are not trying to find out. It is a rough count of interest,
          not a headcount, and we will not quote it back at you as proof of
          demand.
        </p>
      </div>

      <div className="mt-8 rounded-card border border-ink-100 bg-ink-50 p-6">
        <p className="font-medium text-ink-900">In the meantime, one course is finished.</p>
        <p className="mt-2 text-pretty text-ink-600">
          Data Analyst runs six weeks, every week has an artifact, and every
          rubric is published before you start. It is free to work through on
          your own.
        </p>
        <Link
          href="/learn/data-analyst-fresher"
          className="mt-4 inline-flex h-12 items-center justify-center rounded-lg border border-brand-700 px-5 font-medium text-brand-800 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Read the Data Analyst curriculum
        </Link>
      </div>
    </main>
  );
}
