import "server-only";
import { createClient } from "@/lib/supabase/server";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { retryRead } from "@/lib/supabase/retry";

/**
 * Per-user progress reads. The mirror image of roadmaps.ts: always through
 * the cookie-bound client, always RLS-scoped to the signed-in user, never
 * cached — a shared phone must never show one person the other's ticks.
 */

export type NodeStatus = "in_progress" | "done" | "skipped";

/**
 * The signed-in user's progress over one roadmap's nodes.
 * Null when nobody is signed in — the caller renders the public view.
 */
export async function getMyProgress(nodeIds: string[]): Promise<Map<string, NodeStatus> | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || nodeIds.length === 0) return user ? new Map() : null;

  const { data, error } = await retryRead(() =>
    supabase.from("node_progress").select("node_id, status").in("node_id", nodeIds),
  );
  if (error) throw describeSupabaseError("reading your progress", error);

  return new Map((data ?? []).map((r) => [r.node_id, r.status as NodeStatus]));
}

/** IST calendar date as YYYY-MM-DD — the only calendar the streak knows. */
const istToday = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export type StreakSnapshot = {
  currentDays: number;
  longestDays: number;
  totalDays: number;
  doneToday: boolean;
  daysSince: number | null;
  /** Oldest→newest, exactly 14 entries ending today (IST). */
  last14: { date: string; done: boolean; isToday: boolean }[];
};

/**
 * The streak, read the only sanctioned way: through streak_status (which
 * decays a lapsed streak to 0 without waiting for a write — trap 4), plus
 * the last 14 activity days for the strip. Null when signed out.
 */
export async function getMyStreak(): Promise<StreakSnapshot | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const today = istToday();
  const since = new Date(Date.now() - 13 * 86_400_000)
    .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  const [statusRes, daysRes] = await Promise.all([
    retryRead(() => supabase.from("streak_status").select("*").maybeSingle()),
    retryRead(() =>
      supabase.from("activity_days").select("done_on").gte("done_on", since),
    ),
  ]);
  if (statusRes.error) throw describeSupabaseError("reading your streak", statusRes.error);
  if (daysRes.error) throw describeSupabaseError("reading your activity", daysRes.error);

  const done = new Set((daysRes.data ?? []).map((d) => String(d.done_on).slice(0, 10)));
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(Date.parse(`${today}T00:00:00Z`) - (13 - i) * 86_400_000)
      .toISOString()
      .slice(0, 10);
    return { date, done: done.has(date), isToday: date === today };
  });

  return {
    currentDays: statusRes.data?.current_days ?? 0,
    longestDays: statusRes.data?.longest_days ?? 0,
    totalDays: statusRes.data?.total_days ?? 0,
    doneToday: statusRes.data?.done_today ?? false,
    daysSince: statusRes.data?.days_since ?? null,
    last14,
  };
}

/**
 * Which of these resources the signed-in user has saved (and not yet
 * consumed — a consumed save is done doing its job).
 * Null when nobody is signed in.
 */
export async function getMySaves(resourceIds: string[]): Promise<Set<string> | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || resourceIds.length === 0) return user ? new Set() : null;

  const { data, error } = await retryRead(() =>
    supabase
      .from("saved_resources")
      .select("resource_id")
      .in("resource_id", resourceIds)
      .is("consumed_at", null),
  );
  if (error) throw describeSupabaseError("reading your saves", error);

  return new Set((data ?? []).map((r) => r.resource_id));
}
