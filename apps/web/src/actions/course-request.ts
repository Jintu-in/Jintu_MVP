"use server";

import { courseRequestInput } from "@jintu/contracts";
import { actionClient, UserFacingError } from "@/lib/safe-action";
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

/**
 * Postgres error codes the function raises deliberately, each carrying a
 * sentence written for the person who typed the box.
 *
 * 23514 check_violation — too short, too long
 * P0003 too_many_rows   — five already today
 *
 * Everything else is ours and must not reach the browser. PGRST202 in
 * particular means the migration has not been applied, which is an operator
 * problem and reads as nonsense to a student.
 */
const FOR_THE_USER = new Set(["23514", "P0003"]);

export const requestCourse = actionClient
  .inputSchema(courseRequestInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { error } = await supabase.rpc("request_course", {
      p_prompt: parsedInput.prompt,
      p_requester: parsedInput.requesterKey,
    });

    if (error) {
      if (FOR_THE_USER.has(error.code ?? "")) {
        throw new UserFacingError(error.message);
      }

      if (error.code === "PGRST202") {
        // Named rather than swallowed, because "something went wrong" sends an
        // operator looking at the form instead of at the migration list.
        throw new Error(
          "request_course() does not exist — migration 20260810010000 has not " +
            "been applied to this project. Run pnpm db:push, or paste the " +
            "migration into the SQL editor.",
        );
      }

      throw new Error(`course request failed: ${error.code ?? "no code"} ${error.message}`);
    }

    // Deliberately returns nothing about the request itself. There is no id to
    // show, no queue position to invent, and no completion time to promise.
    return { received: true };
  });
