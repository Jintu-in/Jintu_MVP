"use server";

import { courseRequestInput } from "@jintu/contracts";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Files a request for a course nobody has written.
 *
 * Goes through request_course() rather than an insert. The length bounds, the
 * five-a-day limit and the same-text de-duplication all live in that function,
 * so there is no second path that skips them — the table has no insert policy
 * at all.
 *
 * Never wrapped in retryRead. That helper is for reads: a write that failed at
 * the transport layer may well have been applied, and retrying this one would
 * be harmless only by accident, because the de-duplication would absorb it.
 * The rule stays absolute rather than case-by-case.
 */
export const requestCourse = actionClient
  .inputSchema(courseRequestInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { error } = await supabase.rpc("request_course", {
      p_prompt: parsedInput.prompt,
      p_requester: parsedInput.requesterKey,
    });

    if (error) {
      // The function raises sentences meant for the person who typed the box —
      // too short, too long, five already today. Those are surfaced as written.
      // Anything else is ours and gets the generic handler's message.
      const isForUser = ["23514", "P0003", "22023"].includes(error.code ?? "");
      throw new Error(
        isForUser ? error.message : `course request failed: ${error.code ?? "no code"} ${error.message}`,
      );
    }

    // Deliberately returns nothing about the request itself. There is no id to
    // show, no queue position to invent, and no completion time to promise.
    return { received: true };
  });
