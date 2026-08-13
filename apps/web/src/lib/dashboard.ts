import "server-only";
import { createClient } from "@/lib/supabase/server";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { retryRead } from "@/lib/supabase/retry";

/**
 * Everything the dashboard needs, in one place, all per-user reads through
 * the cookie client. Null when signed out.
 */

export type DueCard = {
  id: string;
  front: string;
  back: string;
  nodeId: string;
  nodeTitle: string | null;
  dueOn: string;
  reps: number;
};

export type DashboardData = {
  streak: {
    currentDays: number;
    longestDays: number;
    freezesRemaining: number;
    lastActiveOn: string | null;
  } | null;
  dueCount: number;
  pointsThisWeek: number;
  continueTargets: {
    roadmapSlug: string;
    roadmapTitle: string;
    lastNodeId: string | null;
  }[];
  savedQueue: {
    resourceId: string;
    title: string;
    url: string;
    type: string;
    sourceName: string;
    nodeId: string;
    roadmapSlug: string | null;
  }[];
};

export async function getDueCards(limit = 20): Promise<DueCard[] | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await retryRead(() =>
    supabase
      .from("review_cards")
      .select("id, front, back, node_id, due_on, reps, nodes ( title )")
      .lte("due_on", new Date().toISOString().slice(0, 10))
      .order("due_on")
      .limit(limit),
  );
  if (error) throw describeSupabaseError("reading your review queue", error);

  return (data ?? []).map((c) => ({
    id: c.id,
    front: c.front,
    back: c.back,
    nodeId: c.node_id,
    // PostgREST types a to-one embed as an array shape; runtime is object-
    // or-null. Same bridge the other adapters use.
    nodeTitle: (c.nodes as unknown as { title: string } | null)?.title ?? null,
    dueOn: c.due_on,
    reps: c.reps,
  }));
}

export async function getDashboard(): Promise<DashboardData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weekStart = monday.toISOString().slice(0, 10);

  const [streakRes, dueRes, pointsRes, enrolRes, savesRes] = await Promise.all([
    retryRead(() => supabase.from("streaks").select("*").maybeSingle()),
    retryRead(() =>
      supabase
        .from("review_cards")
        .select("id", { count: "exact", head: true })
        .lte("due_on", today.toISOString().slice(0, 10)),
    ),
    retryRead(() => supabase.from("point_events").select("points").gte("awarded_on", weekStart)),
    retryRead(() =>
      supabase
        .from("roadmap_enrollments")
        .select("last_node_id, roadmaps ( slug, title )")
        .is("completed_at", null)
        .order("started_at", { ascending: false }),
    ),
    retryRead(() =>
      supabase
        .from("saved_resources")
        .select("resource_id, resources ( title, url, type, source_name, node_id, nodes ( modules ( roadmaps ( slug ) ) ) )")
        .is("consumed_at", null)
        .order("saved_at", { ascending: false })
        .limit(10),
    ),
  ]);
  for (const [label, r] of [
    ["streak", streakRes],
    ["review count", dueRes],
    ["points", pointsRes],
    ["enrollments", enrolRes],
    ["saves", savesRes],
  ] as const) {
    if (r.error) throw describeSupabaseError(`reading your ${label}`, r.error);
  }

  return {
    streak: streakRes.data
      ? {
          currentDays: streakRes.data.current_days,
          longestDays: streakRes.data.longest_days,
          freezesRemaining: streakRes.data.freezes_remaining,
          lastActiveOn: streakRes.data.last_active_on,
        }
      : null,
    dueCount: dueRes.count ?? 0,
    pointsThisWeek: (pointsRes.data ?? []).reduce((a, p) => a + p.points, 0),
    continueTargets: (enrolRes.data ?? []).map((e) => {
      const rm = e.roadmaps as unknown as { slug: string; title: string } | null;
      return {
        roadmapSlug: rm?.slug ?? "",
        roadmapTitle: rm?.title ?? "",
        lastNodeId: e.last_node_id,
      };
    }),
    savedQueue: (savesRes.data ?? []).flatMap((s) => {
      const r = s.resources as unknown as {
        title: string;
        url: string;
        type: string;
        source_name: string;
        node_id: string;
        nodes: { modules: { roadmaps: { slug: string } | null } | null } | null;
      } | null;
      if (!r) return [];
      return [
        {
          resourceId: s.resource_id,
          title: r.title,
          url: r.url,
          type: r.type,
          sourceName: r.source_name,
          nodeId: r.node_id,
          roadmapSlug: r.nodes?.modules?.roadmaps?.slug ?? null,
        },
      ];
    }),
  };
}
