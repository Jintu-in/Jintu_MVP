import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { retryRead } from "@/lib/supabase/retry";

/**
 * Read layer for the catalogue: roadmaps → modules → nodes → resources.
 *
 * Everything here goes through the session-less anon client on purpose. The
 * catalogue is public by RLS policy — a published roadmap renders for someone
 * with no account, and that is the SEO surface — so these reads must never
 * depend on a cookie. Progress is a different lib (progress.ts) precisely
 * because it is the opposite: always per-user, never public.
 *
 * Ordering happens in JS after the fetch. PostgREST can order nested embeds,
 * but the dotted referencedTable syntax is easy to get silently wrong — a
 * mis-spelled path returns unordered rows, not an error — and position sorts
 * of a few dozen rows cost nothing here.
 */

export type ResourceType = "read" | "video" | "doc" | "case_study" | "tool" | "latest";

export type NodeResource = {
  id: string;
  position: number;
  type: ResourceType;
  title: string;
  url: string;
  sourceName: string;
  author: string | null;
  youtubeVideoId: string | null;
  durationSec: number | null;
  estSizeMb: number | null;
  editorNote: string | null;
};

export type RoadmapNode = {
  id: string;
  slug: string;
  position: number;
  title: string;
  summary: string | null;
  learningObjectives: string[];
  estMinutes: number;
  points: number;
  difficulty: "intro" | "core" | "stretch" | null;
  isOptional: boolean;
  resources: NodeResource[];
};

export type RoadmapModule = {
  id: string;
  position: number;
  title: string;
  weekRange: string | null;
  objective: string | null;
  deliverable: string | null;
  estHours: number | null;
  nodes: RoadmapNode[];
};

export type Roadmap = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  subjectTags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedWeeks: number | null;
  estimatedHours: number | null;
  licenseNote: string | null;
  modules: RoadmapModule[];
};

export type RoadmapSummary = {
  slug: string;
  title: string;
  summary: string;
  subjectTags: string[];
  difficulty: Roadmap["difficulty"];
  estimatedWeeks: number | null;
  estimatedHours: number | null;
  moduleCount: number;
  nodeCount: number;
};

const byPosition = <T extends { position: number }>(a: T, b: T) => a.position - b.position;

/**
 * The resource row as PostgREST returns it. Declared rather than inferred:
 * the nested select is now deep enough that supabase-js's query parser
 * gives up on the innermost array and hands back `any`, which noImplicitAny
 * then rejects. The columns here mirror the select string below —
 * change one, change both.
 */
type RawResource = {
  id: string;
  position: number;
  type: ResourceType;
  title: string;
  url: string;
  source_name: string;
  author: string | null;
  youtube_video_id: string | null;
  duration_sec: number | null;
  est_size_mb: number | string | null;
  editor_note: string | null;
};

/** Every published roadmap, for the catalogue. */
export async function listPublishedRoadmaps(): Promise<RoadmapSummary[]> {
  const supabase = createPublicClient();

  const { data, error } = await retryRead(() =>
    supabase
      .from("roadmaps")
      .select(
        `slug, title, summary, subject_tags, difficulty, estimated_weeks,
         estimated_hours, modules ( id, nodes ( id ) )`,
      )
      .order("title"),
  );
  if (error) throw describeSupabaseError("listing published roadmaps", error);

  return (data ?? []).map((r) => ({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    subjectTags: r.subject_tags ?? [],
    difficulty: r.difficulty,
    estimatedWeeks: r.estimated_weeks,
    estimatedHours: r.estimated_hours,
    moduleCount: r.modules.length,
    nodeCount: r.modules.reduce((n, m) => n + m.nodes.length, 0),
  }));
}

/** One published roadmap, whole tree. Null when the slug is unknown or draft. */
export async function getRoadmap(slug: string): Promise<Roadmap | null> {
  const supabase = createPublicClient();

  const { data, error } = await retryRead(() =>
    supabase
      .from("roadmaps")
      .select(
        `id, slug, title, summary, subject_tags, difficulty, estimated_weeks,
         estimated_hours, license_note,
         modules (
           id, position, title, week_range, objective, deliverable, est_hours,
           nodes (
             id, slug, position, title, summary, learning_objectives, est_minutes, points, difficulty, is_optional,
             resources (
               id, position, type, title, url, source_name, author,
               youtube_video_id, duration_sec, est_size_mb, editor_note
             )
           )
         )`,
      )
      .eq("slug", slug)
      .maybeSingle(),
  );
  if (error) throw describeSupabaseError(`reading roadmap ${slug}`, error);
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    subjectTags: data.subject_tags ?? [],
    difficulty: data.difficulty,
    estimatedWeeks: data.estimated_weeks,
    estimatedHours: data.estimated_hours,
    licenseNote: data.license_note,
    modules: data.modules
      .map((m) => ({
        id: m.id,
        position: m.position,
        title: m.title,
        weekRange: m.week_range,
        objective: m.objective,
        deliverable: m.deliverable,
        estHours: m.est_hours,
        nodes: m.nodes
          .map((n) => ({
            id: n.id,
            slug: n.slug,
            position: n.position,
            title: n.title,
            summary: n.summary,
            learningObjectives: n.learning_objectives ?? [],
            estMinutes: n.est_minutes,
            points: n.points,
            difficulty: n.difficulty,
            isOptional: n.is_optional,
            resources: (n.resources as RawResource[])
              .map((res) => ({
                id: res.id,
                position: res.position,
                type: res.type,
                title: res.title,
                url: res.url,
                sourceName: res.source_name,
                author: res.author,
                youtubeVideoId: res.youtube_video_id,
                durationSec: res.duration_sec,
                estSizeMb: res.est_size_mb === null ? null : Number(res.est_size_mb),
                editorNote: res.editor_note,
              }))
              .sort(byPosition),
          }))
          .sort(byPosition),
      }))
      .sort(byPosition),
  };
}
