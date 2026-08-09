import type { Rubric, RubricCriterion } from "@/lib/curriculum";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";

/**
 * Read side of the peer review queue.
 *
 * Everything a reviewer sees comes through `public.peer_review_queue`, never
 * through `submissions`. That is not a convention this file is keeping — the
 * reviewer has no select policy on `submissions` at all, so a query against
 * it returns nothing (20260809050000_weekly_loop.sql). The view has no column
 * naming the author, which is what makes "the reviewer does not know whose
 * work this is" a property of the data rather than of this code remembering
 * not to select a column.
 *
 * If you find yourself adding a join here to work out who wrote something,
 * stop: that is the anonymity going.
 */

export type ReviewTask = {
  peerReviewId: string;
  dueAt: string;
  status: "pending" | "submitted" | "skipped";
  weekNo: number;
  /** What the author submitted: a query, or a link and a note. */
  payload: { sql?: string; url?: string; note?: string | null };
  prompt: string;
  kind: "sql" | "artifact_link" | "file" | "recording";
  rubric: Rubric | null;
};

type QueueRow = {
  peer_review_id: string;
  due_at: string;
  status: ReviewTask["status"];
  submission_id: string;
  week_no: number;
  payload: ReviewTask["payload"];
  assignment_id: string;
};

type AssignmentRow = {
  id: string;
  kind: ReviewTask["kind"];
  spec: { prompt?: string } | null;
  rubrics: Rubric | null;
};

async function assignmentsFor(ids: string[]) {
  const supabase = await createClient();
  if (ids.length === 0) return new Map<string, AssignmentRow>();

  // Assignments and rubrics are anon-readable — the rubric is public because
  // the landing page promises you can read it before you start.
  const { data, error } = await supabase
    .from("assignments")
    .select("id, kind, spec, rubrics ( name, max_score, criteria )")
    .in("id", ids);

  if (error) throw describeSupabaseError("loading what you are reviewing", error);

  return new Map(
    ((data ?? []) as unknown as AssignmentRow[]).map((a) => [a.id, a]),
  );
}

function toTask(row: QueueRow, assignment: AssignmentRow | undefined): ReviewTask {
  return {
    peerReviewId: row.peer_review_id,
    dueAt: row.due_at,
    status: row.status,
    weekNo: row.week_no,
    payload: row.payload ?? {},
    prompt: assignment?.spec?.prompt ?? "This week's artifact",
    kind: assignment?.kind ?? "artifact_link",
    rubric: assignment?.rubrics ?? null,
  };
}

export async function getReviewQueue(): Promise<ReviewTask[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("peer_review_queue")
    .select("peer_review_id, due_at, status, submission_id, week_no, payload, assignment_id")
    .order("due_at", { ascending: true });

  if (error) throw describeSupabaseError("loading your review queue", error);

  const rows = (data ?? []) as unknown as QueueRow[];
  const assignments = await assignmentsFor([...new Set(rows.map((r) => r.assignment_id))]);

  return rows.map((row) => toTask(row, assignments.get(row.assignment_id)));
}

export async function getReviewTask(peerReviewId: string): Promise<ReviewTask | null> {
  const supabase = await createClient();

  // No ownership check here on purpose: the view's own predicate is the
  // check. An id belonging to someone else's queue simply is not visible.
  const { data, error } = await supabase
    .from("peer_review_queue")
    .select("peer_review_id, due_at, status, submission_id, week_no, payload, assignment_id")
    .eq("peer_review_id", peerReviewId)
    .maybeSingle();

  if (error) throw describeSupabaseError("loading the review", error);
  if (!data) return null;

  const row = data as unknown as QueueRow;
  const assignments = await assignmentsFor([row.assignment_id]);
  return toTask(row, assignments.get(row.assignment_id));
}

/** Criteria with a sane fallback, so an assignment with no rubric is still reviewable. */
export function criteriaOf(rubric: Rubric | null): RubricCriterion[] {
  if (rubric?.criteria?.length) return rubric.criteria;
  return [{ key: "overall", label: "Is this good work?", weight: 5 }];
}

/**
 * How many reviews are waiting, for the dashboard's nudge.
 *
 * `head: true` — the dashboard needs the number and not the rows, and the
 * rows are other people's work.
 */
export async function countPendingReviews(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("peer_review_queue")
    .select("peer_review_id", { count: "exact", head: true })
    .eq("status", "pending");

  // A dashboard that fails to load because the review count did not is a bad
  // trade. Zero reads as "nothing to do", which is the safe direction to be
  // wrong in for a nudge.
  if (error) return 0;
  return count ?? 0;
}
