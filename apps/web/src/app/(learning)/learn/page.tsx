import type { Metadata } from "next";
import { AppShell } from "@/components/shell/app-shell";
import CataloguePage from "@/components/catalogue/catalogue-page";
import { parseFilters, type CatalogueRow } from "@/lib/catalogue-filters";
import { buildCatalogue } from "@/lib/planned-roadmaps";
import { getRoadmap, listPublishedRoadmaps } from "@/lib/roadmaps";
import { getMyProgress } from "@/lib/progress";
import { getMyMomentum } from "@/lib/momentum";
import { getViewer, initialsFor } from "@/lib/session";

/**
 * The catalogue (/learn) — see catalogue-page.tsx for the design source and
 * the facet-system decision. Shelled with AppShell now that Phase 0's
 * desktop-sidebar/phone-tab-bar are being wired into something real for the
 * first time (app-shell.tsx).
 *
 * Rendered on demand: CI builds with no Supabase configured.
 */
export const dynamic = "force-dynamic";

const DESCRIPTION =
  "Deep, free roadmaps for any subject — curated reads, videos and docs in the order that teaches. Browse by subject and search.";

export const metadata: Metadata = {
  title: "Roadmaps",
  description: DESCRIPTION,
  // Canonical is the bare /learn on every filtered view. A facet combination
  // is the same roadmaps in a different order, and indexing each one is how
  // a catalogue of a dozen pages becomes a hundred near-duplicates.
  alternates: { canonical: "/learn" },
  openGraph: {
    type: "website",
    title: "Roadmaps · Jintu",
    description: DESCRIPTION,
    url: "/learn",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Jintu — one place to learn anything, properly." }],
  },
  twitter: { card: "summary_large_image", title: "Roadmaps · Jintu", description: DESCRIPTION },
};

export default async function RoadmapsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, published, viewer, momentum] = await Promise.all([
    searchParams,
    listPublishedRoadmaps().catch(() => []),
    getViewer().catch(() => null),
    getMyMomentum().catch(() => null),
  ]);
  const filters = parseFilters(params);
  const catalogue = buildCatalogue(published);

  // Real per-roadmap progress for whichever roadmaps are actually open —
  // one extra fetch each, cheap while the catalogue holds one open roadmap.
  // Never computed for a planned roadmap: there is nothing to have progress in.
  const openEntries = catalogue.filter((c) => c.open);
  const progressByRoadmap = new Map<string, { pct: number; line: string; done: boolean }>();
  if (viewer) {
    await Promise.all(
      openEntries.map(async (entry) => {
        const roadmap = await getRoadmap(entry.slug).catch(() => null);
        if (!roadmap) return;
        const nodeIds = roadmap.modules.flatMap((m) => m.nodes.map((n) => n.id));
        const progress = await getMyProgress(nodeIds).catch(() => null);
        if (!progress || nodeIds.length === 0) return;
        const done = [...progress.values()].filter((s) => s === "done").length;
        progressByRoadmap.set(entry.slug, {
          pct: Math.round((done / nodeIds.length) * 100),
          line: `${done} of ${nodeIds.length} lessons`,
          done: done === nodeIds.length,
        });
      }),
    );
  }

  const rows: CatalogueRow[] = catalogue.map((c) => {
    const prog = progressByRoadmap.get(c.slug);
    return {
      slug: c.slug,
      href: `/learn/${c.slug}`,
      title: c.title,
      summary: c.summary ?? "",
      tags: [],
      category: c.category,
      level: c.level ?? "beginner",
      weeks: c.weeks ?? null,
      open: c.open,
      metaLine: "",
      footLine: c.weeks ? `~${c.weeks} weeks` : "free · no account needed to read",
      progress: prog && !prog.done ? { pct: prog.pct, line: prog.line } : undefined,
      finished: prog?.done ? { line: prog.line } : undefined,
    };
  });

  return (
    <AppShell
      active="roadmaps"
      user={
        viewer
          ? {
              displayName: viewer.fullName ?? viewer.email ?? "You",
              initials: initialsFor(viewer),
              points: momentum?.totalPoints ?? 0,
            }
          : null
      }
    >
      <CataloguePage rows={rows} filters={filters} streakDays={momentum?.streakDays ?? null} />
    </AppShell>
  );
}
