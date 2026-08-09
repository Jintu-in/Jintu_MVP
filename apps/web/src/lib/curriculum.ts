import { createPublicClient } from "@/lib/supabase/public";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { retryRead } from "@/lib/supabase/retry";

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

export type RubricCriterion = { key: string; label: string; weight: number };

export type Rubric = {
  name: string;
  max_score: number;
  criteria: RubricCriterion[];
};

export type Assignment = {
  id: string;
  kind: "sql" | "artifact_link" | "file" | "recording";
  spec: { prompt?: string };
  /** Null only if an assignment was authored without one — visible in the UI. */
  rubrics: Rubric | null;
};

export type Module = {
  id: string;
  week_no: number;
  title: string;
  objective: string;
  resources: Resource[];
  assignments: Assignment[];
};

export type TrackPage = {
  slug: string;
  title: string;
  summary: string;
  version: number;
  modules: Module[];
};

export type TrackSummary = {
  slug: string;
  title: string;
  summary: string;
  weeks: number;
};

export async function getPublishedTrack(slug: string): Promise<TrackPage | null> {
  const supabase = createPublicClient();

  const { data: track, error: trackError } = await retryRead(() =>
    supabase.from("tracks").select("id, slug, title, summary").eq("slug", slug).maybeSingle(),
  );

  if (trackError) throw describeSupabaseError("looking up the track", trackError);
  if (!track) return null;

  // Highest published version wins. RLS has already excluded drafts, so the
  // newest row visible here is by definition the live one.
  const { data: path, error: pathError } = await retryRead(() =>
    supabase
      .from("paths")
      .select("id, version")
      .eq("track_id", track.id)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle(),
  );

  if (pathError) throw describeSupabaseError("looking up the published path", pathError);
  if (!path) return null;

  const { data: modules, error: modulesError } = await retryRead(() =>
    supabase
      .from("modules")
      .select(
        `id, week_no, title, objective,
       resources ( id, kind, provider, external_url, youtube_video_id, title, duration_sec, position, health ),
       assignments ( id, kind, spec, rubrics ( name, max_score, criteria ) )`,
      )
      .eq("path_id", path.id)
      .order("week_no", { ascending: true }),
  );

  if (modulesError) throw describeSupabaseError("loading the weekly modules", modulesError);

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

export async function listPublishedTracks(): Promise<TrackSummary[]> {
  const supabase = createPublicClient();

  // No is_published filter: RLS already returns only published tracks, and
  // only their published paths. Counting modules through that join therefore
  // counts the live curriculum rather than whatever is half-written in a draft.
  const { data, error } = await retryRead(() =>
    supabase
      .from("tracks")
      .select("slug, title, summary, paths ( modules ( id ) )")
      .order("title", { ascending: true }),
  );

  if (error) throw describeSupabaseError("listing published tracks", error);

  type Row = {
    slug: string;
    title: string;
    summary: string;
    paths: { modules: { id: string }[] | null }[] | null;
  };

  return ((data ?? []) as unknown as Row[]).map((t) => ({
    slug: t.slug,
    title: t.title,
    summary: t.summary,
    weeks: (t.paths ?? []).reduce((n, p) => n + (p.modules?.length ?? 0), 0),
  }));
}
