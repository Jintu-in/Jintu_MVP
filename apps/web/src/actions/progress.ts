"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Tick and untick a node. The only write the roadmap page makes.
 *
 * Getting through a node IS the progress event, so this is deliberately a
 * plain upsert of the user's own row — no points here. Points are awarded
 * server-side in the retention phase, precisely so that this action staying
 * simple can never become a way to mint anything.
 *
 * The enrollment upsert keeps "what do I tap now" answerable from the
 * dashboard later: last_node_id is the most recent node you touched.
 */
const input = z.object({
  nodeId: z.string().uuid(),
  roadmapId: z.string().uuid(),
  roadmapSlug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "not a roadmap slug"),
  done: z.boolean(),
});

export const setNodeDone = actionClient.inputSchema(input).action(async ({ parsedInput }) => {
  const { nodeId, roadmapId, roadmapSlug, done } = parsedInput;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UserFacingError("Sign in to track your progress.");

  // RLS scopes both writes to the user; user_id is set explicitly as well so
  // a policy regression shows up as a refused insert, not someone else's row.
  const { error } = await supabase.from("node_progress").upsert(
    {
      user_id: user.id,
      node_id: nodeId,
      status: done ? "done" : "in_progress",
      completed_at: done ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,node_id" },
  );
  if (error) {
    // 23503: the node id did not survive a re-import. Stale page, not a bug.
    if (error.code === "23503") {
      throw new UserFacingError("This roadmap changed since you loaded it. Refresh and retry.");
    }
    throw new Error(`node_progress upsert failed: ${error.message}`);
  }

  const { error: enrolError } = await supabase.from("roadmap_enrollments").upsert(
    { user_id: user.id, roadmap_id: roadmapId, last_node_id: nodeId },
    { onConflict: "user_id,roadmap_id" },
  );
  if (enrolError) throw new Error(`enrollment upsert failed: ${enrolError.message}`);

  revalidatePath(`/learn/${roadmapSlug}`);
  return { done };
});
