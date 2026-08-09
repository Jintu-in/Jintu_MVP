"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { submissionInput } from "@jintu/contracts";
import { gradeSubmission } from "@/lib/grading/grade";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

const UNIQUE_VIOLATION = "23505";

/**
 * Records a submission, then hands it to the grader.
 *
 * Grading is not on the critical path of the form POST. An untrusted query
 * there would hold the request open for the length of a student's cartesian
 * join, so it runs in `after()` — the response is already sent — and the
 * query itself runs in a separate process that we kill on a deadline
 * (lib/grading/sandbox.ts).
 *
 * `after()` is a stand-in for the queue, not a replacement for it. It is
 * bounded by the lifetime of the serverless invocation, so a grading that
 * outlives it is simply lost and the submission stays `submitted`. That is
 * the honest limit of this phase: ARCHITECTURE.md §4 puts pgmq and the
 * `grade-submission` edge function in Phase 2, and lib/grading/grade.ts is
 * written as a queue consumer so that landing it there is a change of
 * trigger.
 */
export const submitAssignment = actionClient
  .inputSchema(submissionInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Your session expired. Sign in again.");

    // RLS restricts this to the caller's own enrolments, so an id from
    // someone else's cohort simply is not visible here.
    const { data: enrolment, error: enrolmentError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (enrolmentError) throw new Error(`Could not find your enrolment: ${enrolmentError.message}`);
    if (!enrolment) throw new Error("You are not enrolled in a running cohort.");

    // week_no comes from the assignment's module, never from the client: a
    // submitted week number would let someone file week 6 work in week 1 and
    // beat a deadline that had already passed.
    const { data: assignment, error: assignmentError } = await supabase
      .from("assignments")
      .select("id, kind, modules ( week_no )")
      .eq("id", parsedInput.assignmentId)
      .maybeSingle();

    if (assignmentError) throw new Error(`Could not load the assignment: ${assignmentError.message}`);
    if (!assignment) throw new Error("That assignment is not part of a published path.");

    const weekNo = (assignment.modules as unknown as { week_no: number } | null)?.week_no;
    if (!weekNo) throw new Error("That assignment is not attached to a week.");

    if (assignment.kind !== parsedInput.kind) {
      throw new Error(
        `This assignment expects a ${assignment.kind} submission, not ${parsedInput.kind}.`,
      );
    }

    const payload =
      parsedInput.kind === "sql"
        ? { sql: parsedInput.sql }
        : { url: parsedInput.url, note: parsedInput.note ?? null };

    const { data: inserted, error } = await supabase
      .from("submissions")
      .insert({
        enrollment_id: enrolment.id,
        assignment_id: parsedInput.assignmentId,
        week_no: weekNo,
        payload,
      })
      .select("id")
      .maybeSingle();

    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        // One submission per assignment. Editing after the fact would change
        // the work under a peer who is already reviewing it.
        throw new Error(
          "You have already submitted this one. Changing it now would move it under the peers already reviewing it — message us if you submitted the wrong thing.",
        );
      }
      throw new Error(`Could not save your submission: ${error.message}`);
    }

    // The insert is subject to RLS and has no select policy problem — the
    // author may read their own submissions — but a returned row is still not
    // guaranteed, and grading is not worth failing a saved submission over.
    if (inserted?.id) after(() => gradeSubmission(inserted.id));

    revalidatePath("/dashboard");
    return { submitted: true, weekNo };
  });
