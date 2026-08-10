"use server";

import { revalidatePath } from "next/cache";
import { courseVoteInput } from "@jintu/contracts";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Votes for a course that has not been built.
 *
 * Goes through cast_course_vote() rather than an insert: the "one vote per
 * browser per track" rule and the "you may only vote for a proposal, not a
 * real course" rule both live in that function, so there is no version of
 * this that a client can talk its way around by posting a different table.
 *
 * Not wrapped in retryRead, and it must never be. That helper is for reads —
 * a write that failed at the transport layer may well have been applied, and
 * retrying it here would be harmless only by accident (the unique constraint
 * would absorb it). The rule is worth keeping absolute rather than
 * case-by-case.
 */
export const voteForCourse = actionClient
  .inputSchema(courseVoteInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("cast_course_vote", {
      p_slug: parsedInput.slug,
      p_voter_key: parsedInput.voterKey,
    });

    if (error) {
      throw new Error(`vote failed: ${error.code ?? "no code"} ${error.message}`);
    }

    // The vote count is rendered on the index too, so both surfaces would
    // otherwise disagree until the next deploy.
    revalidatePath("/learn");
    revalidatePath(`/learn/vote/${parsedInput.slug}`);

    return { votes: Number(data ?? 0) };
  });
