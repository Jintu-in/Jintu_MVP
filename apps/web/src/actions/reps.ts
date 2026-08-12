"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Log one daily rep.
 *
 * Thin, like every action over a definer function: the day stamp, the 30/day
 * cap, the enrolment check, the streak arithmetic and the freeze all live in
 * submit_rep(), where no caller can reach around them. This maps codes to
 * sentences and refreshes the dashboard.
 */
export const logRep = actionClient
  .inputSchema(z.object({ dailyRepId: z.uuid(), note: z.string().trim().max(2000).optional() }))
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("submit_rep", {
      p_daily_rep_id: parsedInput.dailyRepId,
      p_payload: parsedInput.note ? { note: parsedInput.note } : {},
    });

    if (error) {
      // The dashboard only renders for the signed-in and enrolled, so these
      // are belt-and-braces rather than expected paths — but a session can
      // expire mid-page, and the sentence should still make sense.
      if (error.code === "28000") throw new UserFacingError("Your session expired. Sign in again.");
      if (error.code === "P0001") {
        throw new UserFacingError("This rep belongs to a cohort you are not enrolled in.");
      }
      throw new Error(`rep failed: ${error.code ?? "no code"} ${error.message}`);
    }

    revalidatePath("/dashboard");

    return data as {
      already_logged: boolean;
      points_awarded: number;
      capped?: boolean;
      streak_days: number;
      freezes_remaining: number;
    };
  });
