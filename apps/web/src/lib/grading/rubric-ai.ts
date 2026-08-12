import {
  RUBRIC_AI_MAX_OUTPUT_TOKENS,
  RUBRIC_AI_MODEL,
  actualCostPaise,
  aiCriteria,
  buildRubricPrompt,
  estimateCostPaise,
  parseRubricVerdict,
} from "@jintu/grading";
import { getAnthropicEnv } from "@/lib/env";
import type { createServiceClient } from "@/lib/supabase/service";

/**
 * The spending half of rubric_ai. The prompt, the price list and the verdict
 * parser live in @jintu/grading; this file is the part that holds money and
 * a network connection, and its rule is single: NO paise leave without a
 * reservation first, and every paise that leaves ends up as one ai_usage row.
 *
 * The failure ladder, in order of when things can go wrong:
 *
 *   no rubric_ai criteria      → not this grader's submission; do nothing
 *   no prose to grade          → needs_review (an authoring/UX gap, not a zero)
 *   no API key configured      → needs_review (normal locally and in CI)
 *   budget refused (53400)     → needs_review — the degrade TRACK_MODEL names:
 *                                a human marks it, the student never blocks
 *   fetch failed / non-200     → release the reservation, needs_review
 *   verdict unparseable        → SETTLE (the money is spent and the ledger
 *                                records it), then needs_review
 *
 * Every rung lands on needs_review rather than a score, because a missing
 * grade is recoverable by a human and a wrong grade is a broken promise.
 */

type ServiceClient = NonNullable<ReturnType<typeof createServiceClient>>;

/** Grades the rubric_ai criteria of one artifact submission, if it has any. */
export async function gradeRubricAi(
  supabase: ServiceClient,
  submissionId: string,
  assignmentId: string,
  enrollmentId: string,
  payload: unknown,
): Promise<void> {
  const { data: assignment, error: loadError } = await supabase
    .from("assignments")
    .select("spec, rubrics ( criteria )")
    .eq("id", assignmentId)
    .maybeSingle();
  if (loadError) throw new Error(`could not load the rubric: ${loadError.message}`);

  const criteria = aiCriteria(
    (assignment?.rubrics as unknown as { criteria?: never[] } | null)?.criteria,
  );
  if (criteria.length === 0) return; // peers' and machines' submission, not ours

  const needsReview = async (why: string) => {
    await supabase.from("submissions").update({ status: "needs_review" }).eq("id", submissionId);
    console.error("[rubric_ai]", submissionId, why);
  };

  const prose = String((payload as { note?: unknown } | null)?.note ?? "").trim();
  if (prose.length === 0) {
    // The rubric demands prose and the submission carries none. That is a
    // gap between what the form collects and what the rubric expects — an
    // authoring problem to fix, not a zero to hand a student.
    return needsReview("rubric has rubric_ai criteria but the submission has no prose");
  }

  const anthropic = getAnthropicEnv();
  if (!anthropic) {
    return needsReview("ANTHROPIC_API_KEY is not set, so ai criteria go to manual review");
  }

  // The ledgers want to know which cohort's budget this call burns.
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("cohort_id")
    .eq("id", enrollmentId)
    .maybeSingle();
  const cohortId: string | null = enrollment?.cohort_id ?? null;

  const prompt = buildRubricPrompt({
    assignmentPrompt: String((assignment?.spec as { prompt?: unknown } | null)?.prompt ?? ""),
    criteria,
    prose,
  });
  const inputChars = prompt.system.length + prompt.user.length;
  const estimate = estimateCostPaise(RUBRIC_AI_MODEL, inputChars, RUBRIC_AI_MAX_OUTPUT_TOKENS);
  if (estimate === null) {
    return needsReview(`model ${RUBRIC_AI_MODEL} has no price; refusing to call it`);
  }

  // Reserve before anything can cost. 53400 is the guard saying no — either
  // exhausted or never configured — and both degrade the same way.
  const { error: reserveError } = await supabase.rpc("ai_spend_reserve", {
    p_estimate_paise: estimate,
    p_cohort_id: cohortId,
  });
  if (reserveError) {
    return needsReview(`budget refused the call: ${reserveError.message}`);
  }

  await supabase.from("submissions").update({ status: "grading" }).eq("id", submissionId);

  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropic.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: RUBRIC_AI_MODEL,
        max_tokens: RUBRIC_AI_MAX_OUTPUT_TOKENS,
        temperature: 0,
        system: prompt.system,
        messages: [{ role: "user", content: prompt.user }],
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (cause) {
    await supabase.rpc("ai_spend_release", { p_estimate_paise: estimate, p_cohort_id: cohortId });
    return needsReview(`the API call failed before it was billed: ${String(cause)}`);
  }

  if (!response.ok) {
    // A non-200 is not billed. (429 and 5xx certainly are not; a 4xx of our
    // own making is a bug to fix, and eating the estimate would hide it.)
    await supabase.rpc("ai_spend_release", { p_estimate_paise: estimate, p_cohort_id: cohortId });
    return needsReview(`the API answered ${response.status}: ${await response.text()}`);
  }

  const body = (await response.json()) as {
    content?: { type: string; text?: string }[];
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const inputTokens = body.usage?.input_tokens ?? 0;
  const outputTokens = body.usage?.output_tokens ?? 0;
  const actual = actualCostPaise(RUBRIC_AI_MODEL, inputTokens, outputTokens) ?? estimate;

  // The call happened, so the ledger row is owed no matter what the verdict
  // says. Settling before parsing is deliberate: invariant 2 is about money,
  // and the money is already gone.
  const { error: settleError } = await supabase.rpc("ai_spend_settle", {
    p_estimate_paise: estimate,
    p_actual_paise: actual,
    p_function_name: "rubric_score",
    p_model: RUBRIC_AI_MODEL,
    p_input_tokens: inputTokens,
    p_output_tokens: outputTokens,
    p_cohort_id: cohortId,
    p_enrollment_id: enrollmentId,
  });
  if (settleError) {
    // The ledger row failed to write. Do not grade on top of an unrecorded
    // spend — surface it loudly instead; this is the one failure that is
    // worse than not grading.
    return needsReview(`SPEND NOT RECORDED: ${settleError.message}`);
  }

  const text = body.content?.find((c) => c.type === "text")?.text ?? "";
  const verdict = parseRubricVerdict(text, criteria);
  if (!verdict.ok) {
    return needsReview(`the verdict was refused: ${verdict.error}`);
  }

  const { error: gradeError } = await supabase.from("gradings").insert({
    submission_id: submissionId,
    grader_type: "ai",
    scores: verdict.scores,
    total: verdict.total,
    feedback: verdict.feedback,
    model: RUBRIC_AI_MODEL,
    cost_paise: actual,
  });
  if (gradeError) throw new Error(`could not record the ai grade: ${gradeError.message}`);

  await supabase.from("submissions").update({ status: "graded" }).eq("id", submissionId);
}
