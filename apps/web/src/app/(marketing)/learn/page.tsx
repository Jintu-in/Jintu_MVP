import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedRoadmaps, type RoadmapSummary } from "@/lib/roadmaps";
import { cn } from "@/lib/utils";

/**
 * The catalogue — phase-3 screen 3: faceted browse plus search.
 *
 * Every facet is a link, not a widget: subject, difficulty and time are
 * URL params filtered server-side, so the whole page works with no JS on
 * the cheapest phone, every filtered view has a shareable address, and a
 * crawler can walk the facets. Facet chips are derived from what is
 * actually published — a subject with nothing behind it is not offered.
 *
 * Rendered on demand: CI builds with no Supabase configured.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Roadmaps",
  description:
    "Deep, free roadmaps for any subject — curated reads, videos and docs in the order that teaches. Browse by subject, difficulty and time.",
  alternates: { canonical: "/learn" },
};

type Search = { q?: string; subject?: string; difficulty?: string; hours?: string };

const HOURS = {
  short: { label: "under 50 h", test: (h: number | null) => h !== null && h < 50 },
  medium: { label: "50–150 h", test: (h: number | null) => h !== null && h >= 50 && h <= 150 },
  long: { label: "150 h and up", test: (h: number | null) => h !== null && h > 150 },
} as const;
type HoursKey = keyof typeof HOURS;
const isHours = (v: string | undefined): v is HoursKey => v !== undefined && v in HOURS;

const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

/** /learn with exactly the given params — the single URL builder every chip uses. */
function href(params: Search): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);
  const s = qs.toString();
  return s ? `/learn?${s}` : "/learn";
}

export default async function RoadmapsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q, subject, difficulty, hours: rawHours } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const hours = isHours(rawHours) ? rawHours : undefined;
  const current: Search = { q, subject, difficulty, hours };

  const all = await listPublishedRoadmaps();

  const matches = (r: RoadmapSummary) =>
    (!query ||
      [r.title, r.summary, ...r.subjectTags].some((s) => s.toLowerCase().includes(query))) &&
    (!subject || r.subjectTags.includes(subject)) &&
    (!difficulty || r.difficulty === difficulty) &&
    (!hours || HOURS[hours].test(r.estimatedHours));

  const roadmaps = all.filter(matches);

  // Facet chips come from the published set, with counts computed against
  // the OTHER active filters — the number on a chip is what you would get.
  const countWith = (patch: Search) =>
    all.filter((r) => {
      const merged = { ...current, ...patch };
      return (
        (!merged.q ||
          [r.title, r.summary, ...r.subjectTags].some((s) =>
            s.toLowerCase().includes(merged.q!.trim().toLowerCase()),
          )) &&
        (!merged.subject || r.subjectTags.includes(merged.subject)) &&
        (!merged.difficulty || r.difficulty === merged.difficulty) &&
        (!isHours(merged.hours) || HOURS[merged.hours].test(r.estimatedHours))
      );
    }).length;

  const subjects = [...new Set(all.flatMap((r) => r.subjectTags))].sort();
  const anyFilter = Boolean(query || subject || difficulty || hours);

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

      {/* No search box here — the input lives on the homepage hero only
          (owner's call). Arriving with ?q= from that form still filters;
          the line below is how you see it and shed it. */}
      {query ? (
        <p className="mt-6 text-sm text-ink-600">
          Showing matches for <span className="font-medium text-ink-900">&ldquo;{q}&rdquo;</span>
          {" · "}
          <Link
            href={href({ ...current, q: undefined }) as `/learn?${string}`}
            className="text-brand-700 underline hover:text-brand-800"
          >
            clear
          </Link>
        </p>
      ) : null}

      {/* ── facets ────────────────────────────────────────────────────────── */}
      {all.length > 0 ? (
        <div className="mt-6 space-y-3">
          {subjects.length > 1 ? (
            <FacetRow label="Subject">
              {subjects.map((s) => (
                <Chip
                  key={s}
                  href={href({ ...current, subject: subject === s ? undefined : s })}
                  active={subject === s}
                  count={countWith({ subject: s })}
                >
                  {s}
                </Chip>
              ))}
            </FacetRow>
          ) : null}

          <FacetRow label="Level">
            {DIFFICULTIES.map((d) => (
              <Chip
                key={d}
                href={href({ ...current, difficulty: difficulty === d ? undefined : d })}
                active={difficulty === d}
                count={countWith({ difficulty: d })}
              >
                {d}
              </Chip>
            ))}
          </FacetRow>

          <FacetRow label="Time">
            {(Object.keys(HOURS) as HoursKey[]).map((k) => (
              <Chip
                key={k}
                href={href({ ...current, hours: hours === k ? undefined : k })}
                active={hours === k}
                count={countWith({ hours: k })}
              >
                {HOURS[k].label}
              </Chip>
            ))}
          </FacetRow>

          {anyFilter ? (
            <p className="text-sm">
              <Link href="/learn" className="text-brand-700 underline hover:text-brand-800">
                Clear everything
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      {/* ── results ───────────────────────────────────────────────────────── */}
      {roadmaps.length === 0 ? (
        <p className="mt-10 max-w-[62ch] border-t border-ink-100 pt-8 text-[15px] leading-[1.7] text-ink-600">
          {anyFilter ? (
            <>
              Nothing published matches that yet. New roadmaps ship only after
              every link in them has been checked by a person — tell us what
              you were looking for via the{" "}
              <Link href="/contact" className="text-brand-700 underline hover:text-brand-800">
                contact page
              </Link>{" "}
              and it joins the queue.
            </>
          ) : (
            <>
              The first roadmaps are in link-check right now. A roadmap ships
              only after every resource in it has been seen to resolve — a
              dead link on this page would cost more trust than an empty page
              does.
            </>
          )}
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-ink-100 border-y border-ink-100">
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

function FacetRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-14 shrink-0 text-sm text-ink-500">{label}</span>
      {children}
    </div>
  );
}

function Chip({
  href: to,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      // The URL is assembled by one builder from validated parts; the cast is
      // the typedRoutes escape hatch for runtime-computed query strings.
      href={to as `/learn?${string}`}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
        active
          ? "border-brand-700 font-medium text-brand-700"
          : "border-ink-200 text-ink-600 hover:text-ink-900",
      )}
    >
      {children}
      <span className="font-mono text-[12px] text-ink-500">{count}</span>
    </Link>
  );
}
