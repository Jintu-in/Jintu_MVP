"use server";

import { revalidatePath } from "next/cache";
import { submissionInput } from "@jintu/contracts";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

const UNIQUE_VIOLATION = "23505";

/**
 * Records a submission.
 *
 * Grading is NOT done here. Deterministic SQL grading needs a sandboxed
 * database with the assignment's dataset, which is the containerised runner
 * in ARCHITECTURE.md §4 — a queue consumer, not a request handler. Doing it
 * inline would put an untrusted query on the critical path of a form POST
 * and hold a web worker open for the length of a student's cartesian join.
 * The row lands as `submitted`; the queue moves it on.
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

    const { error } = await supabase.from("submissions").insert({
      enrollment_id: enrolment.id,
      assignment_id: parsedInput.assignmentId,
      week_no: weekNo,
      payload,
    });

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

    revalidatePath("/dashboard");
    return { submitted: true, weekNo };
  });
