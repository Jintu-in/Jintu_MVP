"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Save a resource for later, or unsave it.
 *
 * A save stays attached to its node and resurfaces in the daily loop until
 * consumed — that is the schema's whole argument against the read-later
 * graveyard. This action only toggles the row; the surfacing is the
 * dashboard's job in a later phase.
 */
const input = z.object({
  resourceId: z.string().uuid(),
  roadmapSlug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  nodeId: z.string().uuid(),
  saved: z.boolean(),
});

export const setResourceSaved = actionClient.inputSchema(input).action(async ({ parsedInput }) => {
  const { resourceId, roadmapSlug, nodeId, saved } = parsedInput;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UserFacingError("Sign in to save things for later.");

  if (saved) {
    const { error } = await supabase
      .from("saved_resources")
      .upsert({ user_id: user.id, resource_id: resourceId }, { onConflict: "user_id,resource_id" });
    if (error) {
      if (error.code === "23503") {
        throw new UserFacingError("This roadmap changed since you loaded it. Refresh and retry.");
      }
      throw new Error(`save failed: ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from("saved_resources")
      .delete()
      .eq("user_id", user.id)
      .eq("resource_id", resourceId);
    if (error) throw new Error(`unsave failed: ${error.message}`);
  }

  revalidatePath(`/learn/${roadmapSlug}/${nodeId}`);
  return { saved };
});
