"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { NEEDS_ACCOUNT, NEEDS_PROFILE, peerReviewInput } from "@jintu/contracts";
import { recomputeReadiness } from "@/lib/grading/grade";
import { criteriaOf, getReviewTask } from "@/lib/review";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Records a peer's marks.
 *
 * The write is a plain UPDATE under the reviewer's own session. Three
 * database rules do the work this action does not have to:
 *
 *   - the update policy restricts it to the reviewer's own row
 *   - `peer_reviews_assignment_is_fixed` refuses any change to which
 *     submission this is, who is reviewing it, or when it was due, and
 *     refuses a second submission of a review already sent
 *   - `peer_reviews_record_grade` writes the anonymous `gradings` row and
 *     totals the scores in SQL
 *
 * What is left for this action is the one check the database cannot make:
 * that the marks correspond to the rubric the student was told they would be
 * graded against.
 */
export const submitPeerReview = actionClient
  .inputSchema(peerReviewInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Your session expired. Sign in again.");

    // Reached through the queue view, so an id from someone else's queue is
    // simply not found. This is also where the rubric comes from — taking it
    // from the form would let a reviewer invent a criterion worth 100.
    const task = await getReviewTask(parsedInput.peerReviewId);
    if (!task) throw new Error("That review is not in your queue.");
    if (task.status === "submitted") throw new Error("You have already sent this review.");

    const criteria = criteriaOf(task.rubric);
    const byKey = new Map(criteria.map((c) => [c.key, c]));

    for (const [key, value] of Object.entries(parsedInput.scores)) {
      const criterion = byKey.get(key);
      if (!criterion) throw new Error(`"${key}" is not one of this rubric's criteria.`);
      if (value > criterion.weight) {
        throw new Error(
          `"${criterion.label}" is worth ${criterion.weight}; ${value} is more than the rubric allows.`,
        );
      }
    }

    // Every criterion, not just the ones the reviewer felt strongly about. A
    // partial review scores the author low on the criteria nobody looked at,
    // and they cannot tell which of the two happened.
    const missing = criteria.filter((c) => !(c.key in parsedInput.scores));
    if (missing.length > 0) {
      throw new Error(
        `Score every criterion before sending: ${missing.map((c) => c.label).join(", ")}.`,
      );
    }

    const { error } = await supabase
      .from("peer_reviews")
      .update({
        status: "submitted",
        scores: parsedInput.scores,
        feedback: parsedInput.feedback,
      })
      .eq("id", parsedInput.peerReviewId);

    if (error) throw new Error(`Could not send your review: ${error.message}`);

    // Reviews written are 20% of readiness. Recompute after the response, and
    // through RLS for the enrolment id — the reviewer's own row is the only
    // one this session can see, which is the whole check.
    const { data: enrolment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("status", "active")
      .limit(1)
      .maybeSingle();
    if (enrolment?.id) after(() => recomputeReadiness(enrolment.id));

    revalidatePath("/review");
    revalidatePath("/dashboard");
    return { sent: true };
  });

/**
 * V3's review-to-unlock: pick up the oldest claimable submission instead of
 * waiting for allocation. Every rule lives in claim_review() — the caller's
 * enrolment, never-your-own, the two-reviewer cap, and the author's own
 * feed-the-queue debt — so there is no second path that skips them.
 */
export const claimReview = actionClient.action(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("claim_review");

  if (error) {
    if (error.code === "28000") throw new UserFacingError(NEEDS_ACCOUNT);
    if (error.code === "P0002") throw new UserFacingError(NEEDS_PROFILE);
    if (error.code === "P0001") throw new UserFacingError(error.message);
    if (error.code === "PGRST202") {
      throw new Error(
        "claim_review() does not exist — migration 20260812080000_review_to_unlock.sql " +
          "has not been applied. Run pnpm db:catchup and paste the output into the SQL editor.",
      );
    }
    throw new Error(`claiming a review failed: ${error.code ?? "no code"} ${error.message}`);
  }

  revalidatePath("/review");
  return { reviewId: data as string };
});
