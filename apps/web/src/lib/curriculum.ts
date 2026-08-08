import { createPublicClient } from "@/lib/supabase/public";

/**
 * Read side of the public curriculum.
 *
 * These queries run with the anon key and rely entirely on RLS to return only
 * published rows — there is no `.eq("status", "published")` filter here on
 * purpose. Duplicating the predicate in application code creates two sources
 * of truth, and the one that gets forgotten during a refactor is the one that
 * leaks a draft.
 *
 * Types are hand-written because packages/db has no generated types yet: that
 * needs a linked Supabase project. Replace these with the generated Database
 * types the moment `pnpm db:types` can run.
 */

export type Resource = {
  id: string;
  kind: "video" | "article" | "docs" | "dataset" | "tool";
  provider: "youtube" | "web";
  external_url: string;
  youtube_video_id: string | null;
  title: string;
  duration_sec: number | null;
  position: number;
  health: "ok" | "degraded" | "dead";
};

export type Module = {
  id: string;
  week_no: number;
  title: string;
  objective: string;
  resources: Resource[];
  assignments: { id: string; kind: string; spec: { prompt?: string } }[];
};

export type TrackPage = {
  slug: string;
  title: string;
  summary: string;
  version: number;
  modules: Module[];
};

export async function getPublishedTrack(slug: string): Promise<TrackPage | null> {
  const supabase = createPublicClient();

  const { data: track, error: trackError } = await supabase
    .from("tracks")
    .select("id, slug, title, summary")
    .eq("slug", slug)
    .maybeSingle();

  if (trackError) throw new Error(`track lookup failed: ${trackError.message}`);
  if (!track) return null;

  // Highest published version wins. RLS has already excluded drafts, so the
  // newest row visible here is by definition the live one.
  const { data: path, error: pathError } = await supabase
    .from("paths")
    .select("id, version")
    .eq("track_id", track.id)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (pathError) throw new Error(`path lookup failed: ${pathError.message}`);
  if (!path) return null;

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select(
      `id, week_no, title, objective,
       resources ( id, kind, provider, external_url, youtube_video_id, title, duration_sec, position, health ),
       assignments ( id, kind, spec )`,
    )
    .eq("path_id", path.id)
    .order("week_no", { ascending: true });

  if (modulesError) throw new Error(`module lookup failed: ${modulesError.message}`);

  return {
    slug: track.slug,
    title: track.title,
    summary: track.summary,
    version: path.version,
    modules: ((modules ?? []) as unknown as Module[]).map((m) => ({
      ...m,
      // Dead links stay in the database for the ops queue but are not shown
      // to a student — §6 flags them for a human, it does not auto-repair.
      resources: [...(m.resources ?? [])]
        .filter((r) => r.health !== "dead")
        .sort((a, b) => a.position - b.position),
      assignments: m.assignments ?? [],
    })),
  };
}

export async function listPublishedTrackSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("tracks").select("slug");
  if (error) throw new Error(`track list failed: ${error.message}`);
  return (data ?? []).map((t) => t.slug as string);
}
