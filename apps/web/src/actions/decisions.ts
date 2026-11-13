"use server";

import { z } from "zod";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * The Decide step's one write (V2Decide/V2DecideReveal/DeskDecide, design
 * pack update 3 §B): "Lock in" and "Change my answer" are the same call —
 * an upsert on (user, node, step) (migration 0036's own unique constraint)
 * rather than two separate code paths, since a changed answer is the same
 * row with new values, not a new decision.
 *
 * A plain RLS insert/update, same shape as reviews.ts's createCard: the
 * 15-character reason floor is enforced again here even though the client
 * already disables Lock in below it (CHANGES.md), because the table's own
 * CHECK (0036) is the real floor and a direct call must hit it too.
 */

const decisionInput = z.object({
  roadmapId: z.string().uuid(),
  nodeId: z.string().uuid(),
  stepId: z.string().min(1),
  optionId: z.string().min(1),
  reason: z.string().trim().min(15, "Say a little more — at least 15 characters."),
  covered: z.array(z.string()).max(4),
});

export const saveDecision = actionClient.inputSchema(decisionInput).action(async ({ parsedInput }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UserFacingError("Sign in to save your decision.");

  const { error } = await supabase
    .from("decisions")
    .upsert(
      {
        user_id: user.id,
        roadmap_id: parsedInput.roadmapId,
        node_id: parsedInput.nodeId,
        step_id: parsedInput.stepId,
        option_id: parsedInput.optionId,
        reason: parsedInput.reason,
        covered: parsedInput.covered,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,node_id,step_id" },
    );
  if (error) {
    if (error.code === "23503") {
      throw new UserFacingError("This lesson changed since you loaded it. Refresh and retry.");
    }
    throw new Error(`decision upsert failed: ${error.message}`);
  }

  return { saved: true };
});
