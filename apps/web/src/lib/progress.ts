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
