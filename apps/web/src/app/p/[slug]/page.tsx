import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProfile } from "@/lib/profile";

/**
 * The shareable artifact — ARCHITECTURE.md §6, Phase 1.
 *
 * Outside the (marketing) route group on purpose: this page is what a student
 * sends to a recruiter, and it should not carry our pricing nav.
 *
 * Rendered on demand. Prerendering would query Supabase during `next build`,
 * and CI builds with no project configured.
 */
export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  sql: "SQL",
  data_cleaning: "Cleaning data",
  analysis: "Analysis",
  communication: "Communication",
  peer_review_participation: "Peer review",
};

/**
 * How each archetype reads to a stranger. Ordered strong-to-soft on
 * purpose: the point of the breakdown is that a recruiter can see how much
 * of the score a machine stands behind, so machine checks come first.
 */
const VERIFICATION: Record<string, string> = {
  executable: "Code that ran correctly",
  detectable: "Findings counted against a hidden key",
  structural: "Structure checked automatically",
  rubric_ai: "Scored by a model against the rubric",
  peer: "Judged by peers",
  mentor_sample: "Spot-audited by a mentor",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublicProfile(slug);
  if (!profile) return { title: "Profile not found" };

  return {
    title: `Proof of readiness · ${profile.slug}`,
    description:
      profile.headline ??
      "Artifacts graded against published rubrics, points only for checked work.",
    alternates: { canonical: `/p/${profile.slug}` },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getPublicProfile(slug);
  if (!profile) notFound();

  const entries = Object.entries(profile.breakdown).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        <header>
          <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
            Proof of readiness
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-medium text-balance text-ink-900">
            {profile.headline ?? "Work checked, counted and published on Jintu."}
          </h1>
          {profile.publishedAt ? (
            <p className="mt-2 text-sm text-ink-500">
              Published{" "}
              <time dateTime={profile.publishedAt}>
                {new Date(profile.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </p>
          ) : null}
        </header>

        {profile.overall !== null ? (
          <section
            className="mt-8 rounded-card border border-ink-100 bg-white p-6"
            aria-labelledby="score"
          >
            <h2
              id="score"
              className="text-sm font-medium tracking-wide text-ink-500 uppercase"
            >
              Readiness
            </h2>
            <p className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-5xl font-medium tabular-nums text-ink-900">
                {profile.overall}
              </span>
              <span className="text-ink-500">/ 100</span>
            </p>

            {entries.length > 0 ? (
              <dl className="mt-6 space-y-3">
                {entries.map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-baseline justify-between text-sm">
                      <dt className="text-ink-700">{LABELS[key] ?? key}</dt>
                      <dd className="font-mono tabular-nums text-ink-600">{value}</dd>
                    </div>
                    {/* aria-hidden: the number above is the accessible value;
                        this bar is decoration, not a second control. */}
                    <div aria-hidden className="mt-1 h-1.5 rounded-full bg-ink-100">
                      <div
                        className="h-1.5 rounded-full bg-brand-500"
                        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </dl>
            ) : null}
          </section>
        ) : (
          <p className="mt-8 rounded-card border border-ink-100 bg-white p-6 text-ink-600">
            This profile has no readiness score yet.
          </p>
        )}

        {profile.verification.length > 0 ? (
          <section
            className="mt-4 rounded-card border border-ink-100 bg-white p-6"
            aria-labelledby="verification"
          >
            <h2
              id="verification"
              className="text-sm font-medium tracking-wide text-ink-500 uppercase"
            >
              How these points were checked
            </h2>
            {/* V3's auditable credential: every point names the archetype
                that verified it, so this table cannot be flattered — it is
                read straight off the ledger. */}
            <dl className="mt-4 space-y-2.5">
              {profile.verification.map((v) => (
                <div key={v.archetype} className="flex items-baseline justify-between gap-4 text-sm">
                  <dt className="text-ink-700">
                    {VERIFICATION[v.archetype] ?? v.archetype}
                  </dt>
                  <dd className="font-mono tabular-nums text-ink-900">
                    {v.points} {v.points === 1 ? "point" : "points"}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-pretty text-ink-500">
              Machine-checked points cannot be earned by goodwill — the query
              ran or it did not, the defect was in the data or it was not.
            </p>
          </section>
        ) : null}

        <section
          className="mt-4 rounded-card border border-ink-100 border-l-4 border-l-brand-500 bg-white p-6"
          aria-labelledby="what"
        >
          <h2 id="what" className="font-medium text-ink-900">
            What this score is
          </h2>
          <p className="mt-2 text-pretty text-ink-600">
            A measure of work actually submitted and graded against{" "}
            <Link href="/learn" className="text-brand-700 underline hover:text-brand-800">
              published rubrics
            </Link>
            . It is not a prediction that this person will be hired, and Jintu
            makes no such claim.
          </p>
        </section>
      </main>

      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-5 py-6 text-sm text-ink-500">
          <Link href="/" className="font-medium text-ink-900 hover:text-brand-800">
            Jintu
          </Link>
          <span aria-hidden>·</span>
          <span>proof of work</span>
        </div>
      </footer>
    </div>
  );
}
