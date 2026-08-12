// grade-submission — the queue consumer that turns a submission into a
// grading row, points, and (where machines could not settle it) a human's
// to-do. Runs the SAME engine Next.js runs, via the generated Deno mirror.
//
// Invoked by pg_cron (or manually) — not by browsers. verify_jwt stays on;
// callers present the service key. Every read and write in here is service
// role BY DESIGN: answer_keys has no client policy, gradings/point_events
// have no client insert policy, and this function is exactly the privileged
// path those tables exist to serve.
//
// Queue discipline: read-with-visibility-timeout, archive on success —
// at-least-once. grade() re-running is safe for gradings (a second row is a
// re-grade, the newest wins) and point_events absorbs retries through its
// unique constraint.
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  grade,
  toDbArchetype,
  toEngineCheck,
  actualCostPaise,
  RUBRIC_AI_MODEL,
  RUBRIC_AI_MAX_OUTPUT_TOKENS,
  type EngineRubric,
  type GradeReport,
} from "../_shared/grading/index.ts";

type QueueMsg = { msg_id: number; submission_id: string };

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("POST only", { status: 405 });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Drain up to a small batch per invocation; cron calls this every minute.
  const { data: batch, error: readError } = await admin.rpc("grading_queue_read", {
    p_batch: 5,
  });
  if (readError) return json({ error: `queue read failed: ${readError.message}` }, 500);

  const outcomes: Record<string, string> = {};
  for (const msg of (batch ?? []) as QueueMsg[]) {
    try {
      outcomes[msg.submission_id] = await gradeOne(admin, msg.submission_id);
      await admin.rpc("grading_queue_archive", { p_msg_id: msg.msg_id });
    } catch (e) {
      // Left un-archived on purpose: the visibility timeout will re-deliver.
      // A submission must never be lost to our bug — that is the pendingHuman
      // rule applied to the queue itself.
      outcomes[msg.submission_id] = `retry: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return json({ processed: Object.keys(outcomes).length, outcomes });
});

// deno-lint-ignore no-explicit-any
async function gradeOne(admin: any, submissionId: string): Promise<string> {
  const { data: sub, error: subError } = await admin
    .from("submissions")
    .select("id, enrollment_id, assignment_id, payload, facts, status")
    .eq("id", submissionId)
    .single();
  if (subError) throw new Error(`submission load: ${subError.message}`);
  if (sub.status !== "submitted") return `skipped: status ${sub.status}`;

  const { data: assignment, error: aError } = await admin
    .from("assignments")
    .select("id, unit_id, rubric_id, kind, points, answer_key_ref")
    .eq("id", sub.assignment_id)
    .single();
  if (aError) throw new Error(`assignment load: ${aError.message}`);

  const { data: rubric, error: rError } = await admin
    .from("rubrics")
    .select("id, slug, total, rubric_criteria ( name, weight, check_by, checker, config, position )")
    .eq("id", assignment.rubric_id)
    .single();
  if (rError) throw new Error(`rubric load: ${rError.message}`);

  const { data: enrollment, error: eError } = await admin
    .from("enrollments")
    .select("id, user_id, track_id, tracks ( tier )")
    .eq("id", sub.enrollment_id)
    .single();
  if (eError) throw new Error(`enrollment load: ${eError.message}`);
  const learner: string = enrollment.user_id;

  // DB rows → the engine's rubric. check_by is the database enum; the
  // engine's union spells mentor differently, and toEngineCheck is the one
  // sanctioned translation (round-trip tested in the package).
  type CriterionRow = {
    name: string; weight: number; check_by: string;
    checker: string | null; config: Record<string, unknown> | null; position: number;
  };
  const rows = ((rubric.rubric_criteria ?? []) as CriterionRow[])
    .sort((a, b) => a.position - b.position);
  const engineRubric: EngineRubric = {
    name: rubric.slug,
    criteria: rows.map((c) => ({
      key: c.name,
      label: c.name,
      weight: Number(c.weight),
      check: toEngineCheck(c.check_by),
      checker: toCheckerSpec(c.checker, c.config),
    })),
  };

  // Every model call writes its own ai_usage row with its real cost — the
  // ledger is written where the money moves, not summed afterwards.
  let modelCalls = 0;
  const report: GradeReport = await grade(
    {
      id: sub.id,
      payload: sub.payload ?? {},
      facts: sub.facts ?? {},
      answerKeyRef: assignment.answer_key_ref,
    },
    engineRubric,
    {
      loadKey: async (ref: string) => {
        const { data } = await admin.from("answer_keys").select("payload").eq("ref", ref).maybeSingle();
        return data?.payload ?? null;
      },
      budgetOk: async () => {
        const scopes: [string, string][] = [["global", "all"], ["user", learner]];
        for (const [scope, scopeId] of scopes) {
          const { data: ok, error } = await admin.rpc("budget_ok", {
            p_scope: scope, p_scope_id: scopeId, p_estimated_paise: 400,
          });
          if (error || ok === false) return false;
        }
        return true;
      },
      callModel: async (prompt: string) => {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: RUBRIC_AI_MODEL,
            max_tokens: RUBRIC_AI_MAX_OUTPUT_TOKENS,
            temperature: 0,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        if (!res.ok) throw new Error(`model call: HTTP ${res.status}`);
        const body = await res.json();
        const cost = actualCostPaise(
          RUBRIC_AI_MODEL,
          body.usage?.input_tokens ?? 0,
          body.usage?.output_tokens ?? 0,
        ) ?? 0;
        modelCalls++;
        const { error: usageError } = await admin.from("ai_usage").insert({
          user_id: learner,
          submission_id: sub.id,
          function_name: "rubric_score",
          model: RUBRIC_AI_MODEL,
          input_tokens: body.usage?.input_tokens ?? 0,
          output_tokens: body.usage?.output_tokens ?? 0,
          cost_paise: cost,
        });
        if (usageError) throw new Error(`SPEND NOT RECORDED: ${usageError.message}`);
        return { text: body.content?.find((c: { type: string }) => c.type === "text")?.text ?? "", costPaise: cost };
      },
      maxExamples: 3,
    },
  );

  const { error: gError } = await admin.from("gradings").insert({
    submission_id: sub.id,
    rubric_id: rubric.id,
    score: report.score,
    max_score: Number(rubric.total),
    evidenced_score: report.evidencedScore, // the publishable number, separately
    passed: report.score > 0,
    fully_verified: report.fullyVerified,
    cost_paise: report.costPaise,
    results: report.results,
    pending_human: report.pendingHuman.map((p) => p.key),
  });
  if (gError) throw new Error(`grading write: ${gError.message}`);

  // Proof points, artifacts only, verification from the archetype. The
  // schema's unique (user, source_type, source_id, ledger) allows ONE event
  // per artifact, so the event carries the archetype that contributed the
  // most points; the per-criterion split lives in gradings.results. Draft
  // tracks are refused by the database's own guard — respected, not raced.
  if (report.score > 0 && enrollment.tracks?.tier !== "draft") {
    const byArchetype = new Map<string, number>();
    for (const r of report.results) {
      if (r.points > 0) byArchetype.set(r.verification, (byArchetype.get(r.verification) ?? 0) + r.points);
    }
    const dominant = [...byArchetype.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "structural";
    const { error: pError } = await admin.from("point_events").insert({
      user_id: learner,
      ledger: "proof",
      source_type: "artifact",
      source_id: sub.id,
      points: report.score,
      verification: toDbArchetype(dominant as Parameters<typeof toDbArchetype>[0]),
    });
    // 23505 is a retry (unique absorbs it); anything else is real.
    if (pError && pError.code !== "23505") throw new Error(`points write: ${pError.message}`);
  }

  // pendingHuman → the review queue. Reviewer allocation is review-to-
  // unlock's job (a person picks work up; nobody is assigned by fiat here),
  // so the submission is marked as needing humans and surfaces in the queue
  // views; assigned peer_reviews rows are created when a reviewer claims it.
  const nextStatus = report.pendingHuman.length > 0 ? "needs_human" : "graded";
  const { error: sError } = await admin
    .from("submissions").update({ status: nextStatus }).eq("id", sub.id);
  if (sError) throw new Error(`status write: ${sError.message}`);

  // The streak: a graded artifact is the day's verified work.
  const { error: stError } = await admin.rpc("touch_streak", { target_user: learner });
  if (stError) throw new Error(`streak: ${stError.message}`);

  return `${nextStatus}: ${report.score}/${rubric.total} (${report.evidencedScore} evidenced, ${modelCalls} model calls)`;
}

/** DB checker + config → the registry's "name:arg1,arg2" spec. */
function toCheckerSpec(
  checker: string | null,
  config: Record<string, unknown> | null,
): string | null {
  if (!checker) return null;
  if (checker.includes(":")) return checker;
  const args = Array.isArray(config?.args) ? (config.args as unknown[]).map(String) : [];
  return args.length ? `${checker}:${args.join(",")}` : checker;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
