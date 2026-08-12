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
  spec: { prompt?: string; codes?: string[] };
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
  /** Counted through the published path, so a half-written draft never shows. */
  weeks: number;
  resources: number;
  artifacts: number;
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

export type CourseProposal = {
  slug: string;
  title: string;
  summary: string;
  votes: number;
};

/**
 * Courses nobody has built yet, most-wanted first.
 *
 * Read through an RPC rather than a table because proposals are invisible to
 * anon under RLS on purpose — `tracks` stays gated on `is_published` alone, so
 * "is this a live course?" has exactly one answer and listPublishedTracks
 * cannot accidentally leak a proposal by forgetting a filter. The function is
 * security definer and returns only these four columns.
 */
export async function listCourseProposals(): Promise<CourseProposal[]> {
  const supabase = createPublicClient();

  const { data, error } = await retryRead(() => supabase.rpc("proposed_courses"));

  if (error) throw describeSupabaseError("listing course proposals", error);

  type Row = { slug: string; title: string; summary: string; votes: number | string };

  // count() comes back as bigint, which PostgREST serialises as a string once
  // it exceeds the safe integer range and as a number below it. Normalise
  // rather than trusting whichever one today's row count produces.
  return ((data ?? []) as unknown as Row[]).map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    votes: Number(p.votes ?? 0),
  }));
}

/** One proposal, or null if the slug is not a proposal (or is a real course). */
export async function getCourseProposal(slug: string): Promise<CourseProposal | null> {
  const all = await listCourseProposals();
  return all.find((p) => p.slug === slug) ?? null;
}

/**
 * Title and summary only, for the social preview image.
 *
 * Separate from getPublishedTrack because that one fetches every module,
 * resource, assignment and rubric across three round trips, and an OG image
 * needs one string. Returns null for an unpublished or unknown slug so the
 * caller can fall back to the generic card rather than 404 a preview.
 */
export async function getTrackCard(
  slug: string,
): Promise<{ title: string; summary: string } | null> {
  const supabase = createPublicClient();

  const { data, error } = await retryRead(() =>
    supabase.from("tracks").select("title, summary").eq("slug", slug).maybeSingle(),
  );

  if (error) throw describeSupabaseError("loading the course for its preview image", error);
  return data ?? null;
}

export async function listPublishedTracks(): Promise<TrackSummary[]> {
  const supabase = createPublicClient();

  // No is_published filter: RLS already returns only published tracks, and
  // only their published paths. Counting modules through that join therefore
  // counts the live curriculum rather than whatever is half-written in a draft.
  //
  // The nested `resources ( id )` and `assignments ( id )` are load-bearing,
  // not decorative: the reducer below counts them. A merge once resolved a
  // conflict here by keeping a narrower `paths ( modules ( id ) )` alongside
  // this mapper, and /learn advertised "Artifacts: 0" over a database holding
  // 56 of them for as long as it took someone to notice. Narrow this select
  // and the counts silently go to zero again — see the guard below.
  const { data, error } = await retryRead(() =>
    supabase
      .from("tracks")
      .select(
        "slug, title, summary, paths ( modules ( id, resources ( id ), assignments ( id ) ) )",
      )
      .order("title", { ascending: true }),
  );

  if (error) throw describeSupabaseError("listing published tracks", error);

  type Row = {
    slug: string;
    title: string;
    summary: string;
    paths:
      | {
          modules:
            | { id: string; resources: { id: string }[] | null; assignments: { id: string }[] | null }[]
            | null;
        }[]
      | null;
  };

  // The cast is a lie the compiler cannot check — packages/db has no generated
  // types, so `data` is effectively `any` and TypeScript will happily let the
  // mapper read a column the query never asked for.
  const rows = (data ?? []) as unknown as Row[];

  return rows.map((t) => {
    const modules = (t.paths ?? []).flatMap((p) => p.modules ?? []);

    // Absent, not empty. PostgREST returns `[]` for a requested relation with
    // no rows and omits the key entirely for one that was never requested, so
    // this distinguishes "no resources exist" from "the select forgot to ask".
    // Only the second is possible-but-wrong, and it is the failure that shipped.
    const notRequested = modules.find((m) => !m.resources || !m.assignments);
    if (notRequested) {
      throw new Error(
        "listPublishedTracks: the select did not request resources/assignments, " +
          "so every course would be counted as having zero of them. Restore the " +
          "nested selects rather than removing this check — silently rendering 0 " +
          "is worse than failing here.",
      );
    }

    return {
      slug: t.slug,
      title: t.title,
      summary: t.summary,
      weeks: modules.length,
      resources: modules.reduce((n, m) => n + (m.resources?.length ?? 0), 0),
      artifacts: modules.reduce((n, m) => n + (m.assignments?.length ?? 0), 0),
    };
  });
}

export type OpenCohort = {
  cohortId: string;
  startsOn: string;
  endsOn: string;
  capacity: number;
  seatsLeft: number;
};

/**
 * The open cohort for a track, if one exists.
 *
 * Null is the common case and not an error — cohorts open a few weeks a
 * year. The track page decides between "Enrol" and "Join the waitlist" on
 * exactly this.
 */
export async function getOpenCohort(slug: string): Promise<OpenCohort | null> {
  const supabase = createPublicClient();

  const { data, error } = await retryRead(() =>
    supabase.rpc("open_cohort", { p_track_slug: slug }),
  );

  // PGRST202 = the enrolment migration is not applied yet. The track page
  // must not 500 over a missing button — it falls back to the waitlist CTA,
  // which is exactly what it showed before this function existed.
  if (error) {
    if (error.code === "PGRST202") return null;
    throw describeSupabaseError("checking for an open cohort", error);
  }

  type Row = { cohort_id: string; starts_on: string; ends_on: string; capacity: number; seats_left: number };
  const row = (data as unknown as Row[] | null)?.[0];
  if (!row) return null;

  return {
    cohortId: row.cohort_id,
    startsOn: row.starts_on,
    endsOn: row.ends_on,
    capacity: row.capacity,
    seatsLeft: Number(row.seats_left),
  };
}
