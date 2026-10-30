import "server-only";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { retryRead } from "@/lib/supabase/retry";
import { createClient } from "@/lib/supabase/server";
import { getRoadmap, isOpenRoadmapStatus } from "@/lib/roadmaps";

/**
 * The saved queue.
 *
 * A queue, not an archive: rows with consumed_at are filtered out here, so
 * "Mark as read" moves something out of the list without deleting the record
 * that the save led to reading. That distinction is the whole reason
 * consumed_at exists rather than a DELETE.
 */

export type SavedItem = {
  resourceId: string;
  title: string;
  url: string;
  sourceName: string;
  /** "postgresql.org · 12 min · ~0.3 MB" — mono, built from real columns. */
  sourceLine: string;
  /** The curator's note, when the resource carries one. */
  editorNote: string | null;
  /** Back to the exact node this was saved from, when it is published. */
  nodeHref: string | null;
  /** "Saved in Git & GitHub, lesson 4" — null wherever nodeHref is null. */
  provenance: string | null;
  savedAt: string;
  durationSec: number | null;
};

export type SavedQueue = {
  items: SavedItem[];
  /** "4 saved · ~22 min" — the header line. */
  count: number;
  totalMinutes: number;
};

function sourceLine(sourceName: string, durationSec: number | null, estSizeMb: number | null): string {
  const parts = [sourceName];
  if (durationSec) {
    const m = Math.round(durationSec / 60);
    parts.push(m >= 90 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`);
  }
  if (estSizeMb) {
    parts.push(estSizeMb >= 1000 ? `~${(estSizeMb / 1000).toFixed(1)} GB` : `~${estSizeMb} MB`);
  }
  return parts.join(" · ");
}

export async function getSavedQueue(): Promise<SavedQueue | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await retryRead(() =>
    supabase
      .from("saved_resources")
      .select(
        `saved_at,
         resource_id,
         resources (
           id, title, url, source_name, duration_sec, est_size_mb, editor_note,
           nodes ( slug, modules ( roadmaps ( slug, title, status ) ) )
         )`,
      )
      .is("consumed_at", null)
      .order("saved_at", { ascending: false }),
  );
  if (error) throw describeSupabaseError("reading your saved links", error);

  type Row = {
    saved_at: string;
    resource_id: string;
    resources: {
      title: string;
      url: string;
      source_name: string;
      duration_sec: number | null;
      est_size_mb: number | null;
      editor_note: string | null;
      nodes: { slug: string; modules: { roadmaps: { slug: string; title: string; status: string } | null } | null } | null;
    } | null;
  };
  const rows = (data ?? []) as unknown as Row[];

  // "Saved in X, lesson N" needs the node's place across the WHOLE roadmap,
  // which the nodes table itself does not carry (its own ordering column
  // restarts at 1 in every module) — one getRoadmap() per distinct roadmap
  // referenced, not per item.
  const roadmapSlugs = [
    ...new Set(
      rows
        .map((r) => r.resources?.nodes?.modules?.roadmaps)
        .filter((rm): rm is NonNullable<typeof rm> => Boolean(rm) && isOpenRoadmapStatus(rm!.status))
        .map((rm) => rm!.slug),
    ),
  ];
  const trees = await Promise.all(roadmapSlugs.map((slug) => getRoadmap(slug).catch(() => null)));
  const positionByNodeSlug = new Map<string, number>();
  trees.forEach((tree) => {
    if (!tree) return;
    tree.modules.flatMap((m) => m.nodes).forEach((n, i) => positionByNodeSlug.set(`${tree.slug}/${n.slug}`, i + 1));
  });

  const items: SavedItem[] = rows
    .filter((r) => r.resources)
    .map((r) => {
      const res = r.resources!;
      const roadmap = res.nodes?.modules?.roadmaps ?? null;
      // Only link into a roadmap that is not a draft — a link to a draft
      // would 404 for the person who saved from it.
      const published = roadmap && isOpenRoadmapStatus(roadmap.status) && res.nodes?.slug ? roadmap : null;
      const position = published ? positionByNodeSlug.get(`${published.slug}/${res.nodes!.slug}`) : undefined;
      return {
        resourceId: r.resource_id,
        title: res.title,
        url: res.url,
        sourceName: res.source_name,
        sourceLine: sourceLine(res.source_name, res.duration_sec, res.est_size_mb),
        editorNote: res.editor_note,
        nodeHref: published ? `/learn/${published.slug}/${res.nodes!.slug}` : null,
        provenance: published && position ? `Saved in ${published.title}, lesson ${position}` : null,
        savedAt: r.saved_at,
        durationSec: res.duration_sec,
      };
    });

  const totalSeconds = items.reduce((a, i) => a + (i.durationSec ?? 0), 0);
  return {
    items,
    count: items.length,
    totalMinutes: Math.round(totalSeconds / 60),
  };
}
