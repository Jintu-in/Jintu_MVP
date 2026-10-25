import "server-only";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { retryRead } from "@/lib/supabase/retry";
import { createClient } from "@/lib/supabase/server";

/**
 * /profile's record half (V2Profile/DeskProfile), P2's deferred piece —
 * separate from lib/account.ts (settings) and lib/momentum.ts (streak
 * days + lifetime points, reused as-is rather than re-derived here).
 *
 * One query window serves both breakpoints: 16 weeks (112 days) is
 * DeskProfile's own "Last 16 weeks"; the mobile 5-week grid is just the
 * most recent 35 of the same cells, sliced in the component, not a
 * second fetch.
 */

export type WeekCell = { date: string; done: boolean; isToday: boolean; isFuture: boolean };

export type FinishedGroup = {
  roadmapTitle: string;
  roadmapSlug: string;
  nodes: { title: string }[];
};

export type ProfileRecord = {
  lessonsDone: number;
  /** Oldest→newest, exactly 112 (16 weeks × 7). */
  weeks: WeekCell[];
  /** How many of `weeks` are done — the grid's own caption count. */
  daysLearned: number;
  /** One entry per roadmap with at least one finished day. */
  finished: FinishedGroup[];
};

const WEEKS = 16;

const todayIn = (timezone: string) => new Date().toLocaleDateString("en-CA", { timeZone: timezone });

export async function getMyRecord(): Promise<ProfileRecord | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profileRes = await retryRead(() =>
    supabase.from("profiles").select("timezone").eq("id", user.id).maybeSingle(),
  );
  if (profileRes.error) throw describeSupabaseError("reading your profile", profileRes.error);
  if (!profileRes.data) return null;

  const today = todayIn(profileRes.data.timezone ?? "UTC");
  // Monday-aligned, same arithmetic as lib/dashboard.ts's weekStrip — the
  // grid is WEEKS complete Monday→Sunday weeks ending with today's own
  // (possibly partial) week, so it reshapes cleanly into either a
  // row-per-week grid (mobile, 7 cols) or a column-per-week one
  // (desktop, 7 rows) without re-querying for the other shape.
  const todayMs = Date.parse(`${today}T00:00:00Z`);
  const isoDow = new Date(todayMs).getUTCDay();
  const sinceMonday = (isoDow + 6) % 7;
  const gridStartMs = todayMs - sinceMonday * 86_400_000 - (WEEKS - 1) * 7 * 86_400_000;
  const since = new Date(gridStartMs).toISOString().slice(0, 10);

  const [daysRes, doneRes] = await Promise.all([
    retryRead(() => supabase.from("activity_days").select("done_on").gte("done_on", since)),
    retryRead(() =>
      supabase
        .from("node_progress")
        .select("nodes ( title, modules ( roadmaps ( slug, title ) ) )")
        .eq("status", "done")
        .order("updated_at", { ascending: true }),
    ),
  ]);
  if (daysRes.error) throw describeSupabaseError("reading your activity", daysRes.error);
  if (doneRes.error) throw describeSupabaseError("reading your finished days", doneRes.error);

  const doneDates = new Set((daysRes.data ?? []).map((d) => String(d.done_on).slice(0, 10)));
  const weeks: WeekCell[] = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const date = new Date(gridStartMs + i * 86_400_000).toISOString().slice(0, 10);
    return { date, done: doneDates.has(date), isToday: date === today, isFuture: date > today };
  });

  type DoneRow = { nodes: { title: string; modules: { roadmaps: { slug: string; title: string } | null } | null } | null };
  const rows = (doneRes.data ?? []) as unknown as DoneRow[];
  const groups = new Map<string, FinishedGroup>();
  for (const row of rows) {
    const roadmap = row.nodes?.modules?.roadmaps;
    if (!roadmap || !row.nodes) continue;
    const group = groups.get(roadmap.slug) ?? { roadmapTitle: roadmap.title, roadmapSlug: roadmap.slug, nodes: [] };
    group.nodes.push({ title: row.nodes.title });
    groups.set(roadmap.slug, group);
  }

  return {
    lessonsDone: rows.length,
    weeks,
    daysLearned: weeks.filter((d) => d.done).length,
    finished: [...groups.values()],
  };
}
