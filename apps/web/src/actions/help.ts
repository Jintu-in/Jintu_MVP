"use server";

import { helpRequestInput } from "@jintu/contracts";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * "Stuck? Tell us what you see" (V2Help/DeskHelp) — a plain RLS insert,
 * same shape as reviews.ts's createCard. Nothing on the page reads this
 * back (it's a message sent, not state the UI shows), so there is
 * deliberately no cache-revalidation call here.
 */
export const submitHelpRequest = actionClient.inputSchema(helpRequestInput).action(async ({ parsedInput }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UserFacingError("Sign in to ask for help on a step.");

  const { error } = await supabase.from("help_requests").insert({
    user_id: user.id,
    node_id: parsedInput.nodeId,
    step_context: parsedInput.stepContext,
    message: parsedInput.message,
  });
  if (error) {
    if (error.code === "23503") {
      throw new UserFacingError("This lesson changed since you loaded it. Refresh and retry.");
    }
    throw new Error(`help request insert failed: ${error.message}`);
  }

  return { sent: true };
});
