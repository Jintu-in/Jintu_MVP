import { sqlAnswerKey } from "@jintu/contracts";
import { gradeSqlSubmission } from "@jintu/grading";
import { SandboxUnavailable, sandboxRunner } from "@/lib/grading/sandbox";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * The weekly loop's machine half, from a submission to a grade to two peers
 * holding it.
 *
 * This is the caller ARCHITECTURE.md §4 describes as a queue consumer. There
 * is no queue yet — pgmq and the `grade-submission` edge function are Phase 2
 * — so it runs in the submitting request's `after()` callback, after the
 * response has been sent. The shape is deliberately the shape of a consumer
 * anyway: it takes a submission id, it re-reads everything it needs, it is
 * safe to run twice, and it never trusts anything the caller passed. Moving
 * it behind pgmq later is then a change of trigger and not a rewrite.
 *
 * Nothing here throws to the caller. A submission is already saved by the
 * time this runs, and a failure to grade must not turn into a failed
 * submission for the student.
 */

/** Grading is not configured. Normal locally and in CI; not normal in production. */
class GradingUnavailable extends Error {}

export async function gradeSubmission(submissionId: string): Promise<void> {
  try {
    await run(submissionId);
  } catch (error) {
    // `after()` has no caller to return an error to. Sentry picks this up
    // through the console integration; the student sees a submission that is
    // still waiting to be graded, which is true.
    console.error("[grading]", submissionId, error instanceof Error ? error.message : error);
  }
}

async function run(submissionId: string) {
  const supabase = createServiceClient();
  if (!supabase) {
    throw new GradingUnavailable(
      "SUPABASE_SECRET_KEY is not set, so submissions are stored but not graded.",
    );
  }

  const { data: submission, error } = await supabase
    .from("submissions")
    .select("id, status, enrollment_id, assignment_id, payload, assignments ( kind )")
    .eq("id", submissionId)
    .maybeSingle();

  if (error) throw new Error(`could not load the submission: ${error.message}`);
  if (!submission) throw new Error("submission not found");

  // Re-running is expected — `after()` can fire twice on a retried request,
  // and the Phase 2 queue will deliver at least once. Anything past
  // `submitted` has been through here already.
  if (submission.status !== "submitted") return;

  const assignment = submission.assignments as unknown as { kind: string } | null;

  // artifact_link, file and recording have no deterministic grader: there is
  // nothing to run. They go straight to peer review, which for those kinds is
  // the whole of the feedback until the AI scorer lands in Phase 2.
  if (assignment?.kind === "sql") {
    await gradeSql(supabase, submission.id, submission.assignment_id, submission.payload);
  }

  // Both of these read across the cohort, which is why they are database
  // functions and why this client is the service role. Neither is allowed to
  // sink the grade that was just written, so each reports rather than throws.
  const { error: allocationError } = await supabase.rpc("allocate_peer_reviews", {
    p_assignment_id: submission.assignment_id,
  });
  if (allocationError) console.error("[grading] allocation", allocationError.message);

  // Proof points, gated on the reviewer having no pending peer reviews —
  // TRACK_MODEL rule 4. Reports rather than throws, like its neighbours: the
  // grade is already written and nothing here may sink it.
  const { data: award, error: awardError } = await supabase.rpc("award_artifact_points", {
    p_submission_id: submission.id,
  });
  if (awardError) console.error("[grading] points", awardError.message);
  else if (award?.reason) console.warn("[grading] points withheld:", award.reason);

  const { error: readinessError } = await supabase.rpc("compute_readiness", {
    p_enrollment_id: submission.enrollment_id,
  });
  if (readinessError) console.error("[grading] readiness", readinessError.message);
}

/**
 * Recomputes one enrolment's readiness.
 *
 * Called from two places, and the second is the reason this is exported:
 * writing a peer review is 20% of readiness, and if only grading triggered a
 * recompute then a student's reviewing would not show up until their next
 * submission — which in week six never comes.
 *
 * Same contract as gradeSubmission: never throws, because it is always the
 * second thing a request does and the first one has already succeeded.
 */
export async function recomputeReadiness(enrollmentId: string): Promise<void> {
  try {
    const supabase = createServiceClient();
    if (!supabase) return;

    const { error } = await supabase.rpc("compute_readiness", {
      p_enrollment_id: enrollmentId,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[readiness]", enrollmentId, error instanceof Error ? error.message : error);
  }
}

type ServiceClient = NonNullable<ReturnType<typeof createServiceClient>>;

async function gradeSql(
  supabase: ServiceClient,
  submissionId: string,
  assignmentId: string,
  payload: unknown,
) {
  // The answer key is service-role only — `assignments` is anon-readable and
  // this is the answer to what it asks. Reading it here is the reason this
  // function needs the privileged client at all.
  const { data: rawKey, error: keyError } = await supabase
    .from("assignment_answer_keys")
    .select("setup, expected, order_matters")
    .eq("assignment_id", assignmentId)
    .maybeSingle();

  // The rubric the student read is the rubric the grade uses. The grader
  // falls back to weights identical to sql-correctness-v1 when this comes
  // back empty, so a rubric-less assignment grades exactly as before — but a
  // rubric with different weights now actually means something.
  const { data: withRubric } = await supabase
    .from("assignments")
    .select("rubrics ( criteria )")
    .eq("id", assignmentId)
    .maybeSingle();
  const rubricCriteria = (
    withRubric?.rubrics as unknown as { criteria?: { key: string; weight: number }[] } | null
  )?.criteria;

  if (keyError) throw new Error(`could not load the answer key: ${keyError.message}`);

  const key = sqlAnswerKey.safeParse(rawKey);
  if (!key.success) {
    // An assignment authored without a fixture and an expected result cannot
    // be graded by running it. Leave the submission visibly waiting rather
    // than scoring someone zero for our data-entry error.
    throw new Error(
      `answer key is not gradable: ${key.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`,
    );
  }

  const sql = (payload as { sql?: unknown } | null)?.sql;
  if (typeof sql !== "string") throw new Error("submission payload carries no sql");

  await supabase.from("submissions").update({ status: "grading" }).eq("id", submissionId);

  let grade;
  try {
    const runner = await sandboxRunner(key.data.setup, sql);
    grade = await gradeSqlSubmission(
      sql,
      { expected: key.data.expected, orderMatters: key.data.order_matters },
      runner,
      rubricCriteria,
    );
  } catch (cause) {
    // The sandbox itself failed. That is an operational problem, and it is
    // marked as one so it reaches the ops queue instead of the student's
    // score.
    await supabase.from("submissions").update({ status: "needs_review" }).eq("id", submissionId);
    throw cause instanceof SandboxUnavailable ? cause : new Error(String(cause));
  }

  // A rubric with nothing this grader implements is a track-authoring error,
  // and the grader says so instead of scoring. Route it to a human: a zero
  // grading row here would tell the student they failed, and that is not
  // what happened.
  if (grade.maxScore === 0 && grade.error) {
    await supabase.from("submissions").update({ status: "needs_review" }).eq("id", submissionId);
    throw new Error(`rubric not machine-gradable for assignment ${assignmentId}: ${grade.error}`);
  }

  const { error } = await supabase.from("gradings").insert({
    submission_id: submissionId,
    grader_type: "deterministic",
    // Keyed by rubric criterion key, so the feedback view can put a name
    // against every number without the grader knowing about rubric rows.
    scores: Object.fromEntries(grade.criteria.map((c) => [c.key, c.passed ? c.weight : 0])),
    total: grade.total,
    // The per-criterion detail is the feedback. "You scored 3/5" is a number;
    // "row 4, revenue: expected 300, got 8100" is something to act on.
    feedback: grade.criteria.map((c) => c.detail).join("\n"),
    // Law 1: a deterministic grade costs nothing, and the schema refuses to
    // let it claim otherwise.
  });
  if (error) throw new Error(`could not record the grade: ${error.message}`);

  await supabase.from("submissions").update({ status: "graded" }).eq("id", submissionId);
}
