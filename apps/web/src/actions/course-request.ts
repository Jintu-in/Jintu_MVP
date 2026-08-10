"use server";

import { NEEDS_ACCOUNT, courseRequestInput } from "@jintu/contracts";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Files a request for a course nobody has written.
 *
 * Goes through request_course() rather than an insert. The account check, the
 * length bounds, the five-a-day limit and the same-text de-duplication all
 * live in that function, so there is no second path that skips them — the
 * table has no insert policy at all.
 *
 * Never wrapped in retryRead. That helper is for reads: a write that failed at
 * the transport layer may well have been applied, and retrying this one would
 * be harmless only by accident, because the de-duplication would absorb it.
 * The rule stays absolute rather than case-by-case.
 */

/**
 * Postgres codes request_course raises deliberately.
 *
 * 28000 invalid_authorization_specification — no session
 * 23514 check_violation                     — too short, too long
 * P0003 too_many_rows                       — five already today
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

    const { data, error } = await supabase.rpc("request_course", {
      p_prompt: parsedInput.prompt,
      p_requester: parsedInput.requesterKey,
    });

    if (error) {
      // Checked before the user-facing set: this one is not shown, it is
      // acted on.
      if (error.code === "28000") throw new UserFacingError(NEEDS_ACCOUNT);

      if (FOR_THE_USER.has(error.code ?? "")) {
        throw new UserFacingError(error.message);
      }

      if (error.code === "PGRST202") {
        // Named rather than swallowed, because "something went wrong" sends an
        // operator looking at the form instead of at the migration list.
        throw new Error(
          "request_course() does not exist — migrations 20260810010000 and " +
            "20260810040000 have not been applied to this project. Run " +
            "pnpm db:catchup 20260809050000 and paste the output into the SQL editor.",
        );
      }

      throw new Error(`course request failed: ${error.code ?? "no code"} ${error.message}`);
    }

    // The id, and only the id. It is what makes the request shareable; there
    // is still no queue position to invent and no completion time to promise.
    return { id: data as string };
  });
