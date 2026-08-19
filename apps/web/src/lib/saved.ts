import "server-only";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { retryRead } from "@/lib/supabase/retry";
import { createClient } from "@/lib/supabase/server";

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
           nodes ( slug, modules ( roadmaps ( slug, status ) ) )
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
      nodes: { slug: string; modules: { roadmaps: { slug: string; status: string } | null } | null } | null;
    } | null;
  };

  const items: SavedItem[] = ((data ?? []) as unknown as Row[])
    .filter((r) => r.resources)
    .map((r) => {
      const res = r.resources!;
      const roadmap = res.nodes?.modules?.roadmaps ?? null;
      return {
        resourceId: r.resource_id,
        title: res.title,
        url: res.url,
        sourceName: res.source_name,
        sourceLine: sourceLine(res.source_name, res.duration_sec, res.est_size_mb),
        editorNote: res.editor_note,
        // Only link into a roadmap that is actually published — a link to a
        // draft would 404 for the person who saved from it.
        nodeHref:
          roadmap && roadmap.status === "published" && res.nodes?.slug
            ? `/learn/${roadmap.slug}/${res.nodes.slug}`
            : null,
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
