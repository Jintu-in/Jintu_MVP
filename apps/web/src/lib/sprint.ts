import { createClient } from "@/lib/supabase/server";
import { describeSupabaseError } from "@/lib/supabase/errors";

/**
 * The signed-in student's sprint.
 *
 * Every query runs with the session's own key, so RLS decides what comes
 * back: enrolments are filtered to the caller, submissions to their own work.
 * There is no `.eq("user_id", …)` here for the same reason as in
 * lib/curriculum.ts — the policy is the filter, and a second copy of the rule
 * is a second thing to get wrong.
 */

export type SprintAssignment = {
  id: string;
  kind: "sql" | "artifact_link" | "file" | "recording";
  spec: { prompt?: string };
  submission: {
    id: string;
    status: "submitted" | "grading" | "graded" | "needs_review";
    submitted_at: string;
    total: number | null;
    maxScore: number | null;
    feedback: string | null;
  } | null;
};

export type SprintWeek = {
  moduleId: string;
  weekNo: number;
  title: string;
  objective: string;
  assignments: SprintAssignment[];
};

export type Sprint = {
  enrollmentId: string;
  cohortStartsOn: string;
  cohortEndsOn: string;
  trackTitle: string;
  weeks: SprintWeek[];
  readiness: number | null;
};

export async function getMySprint(): Promise<Sprint | null> {
  const supabase = await createClient();

  const { data: enrolment, error: enrolmentError } = await supabase
    .from("enrollments")
    .select("id, cohort_id, cohorts ( starts_on, ends_on, path_id, paths ( tracks ( title ) ) )")
    .eq("status", "active")
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (enrolmentError) throw describeSupabaseError("loading your enrolment", enrolmentError);
  if (!enrolment) return null;

  type Cohort = {
    starts_on: string;
    ends_on: string;
    path_id: string;
    paths: { tracks: { title: string } | null } | null;
  };
  const cohort = enrolment.cohorts as unknown as Cohort | null;
  if (!cohort) return null;

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("id, week_no, title, objective, assignments ( id, kind, spec )")
    .eq("path_id", cohort.path_id)
    .order("week_no", { ascending: true });

  if (modulesError) throw describeSupabaseError("loading your weeks", modulesError);

  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select("id, assignment_id, status, submitted_at, gradings ( total, grader_type, feedback )")
    .eq("enrollment_id", enrolment.id);

  if (submissionsError) throw describeSupabaseError("loading your submissions", submissionsError);

  type SubmissionRow = {
    id: string;
    assignment_id: string;
    status: SprintAssignment["submission"] extends null ? never : "submitted";
    submitted_at: string;
    gradings: { total: number; grader_type: string; feedback: string | null }[] | null;
  };

  const byAssignment = new Map<string, SubmissionRow>();
  for (const s of (submissions ?? []) as unknown as SubmissionRow[]) {
    byAssignment.set(s.assignment_id, s);
  }

  const { data: readiness } = await supabase
    .from("readiness_scores")
    .select("overall")
    .eq("enrollment_id", enrolment.id)
    .order("computed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  type ModuleRow = {
    id: string;
    week_no: number;
    title: string;
    objective: string;
    assignments: { id: string; kind: SprintAssignment["kind"]; spec: { prompt?: string } }[] | null;
  };

  return {
    enrollmentId: enrolment.id,
    cohortStartsOn: cohort.starts_on,
    cohortEndsOn: cohort.ends_on,
    trackTitle: cohort.paths?.tracks?.title ?? "Your sprint",
    readiness: readiness?.overall ?? null,
    weeks: ((modules ?? []) as unknown as ModuleRow[]).map((m) => ({
      moduleId: m.id,
      weekNo: m.week_no,
      title: m.title,
      objective: m.objective,
      assignments: (m.assignments ?? []).map((a) => {
        const s = byAssignment.get(a.id);
        // Deterministic and mentor grades both land in `gradings`; the
        // student sees the sum, which is what the rubric's max_score is for.
        const total = s?.gradings?.length
          ? s.gradings.reduce((n, g) => n + Number(g.total), 0)
          : null;
        const feedback = s?.gradings?.find((g) => g.feedback)?.feedback ?? null;
        return {
          id: a.id,
          kind: a.kind,
          spec: a.spec ?? {},
          submission: s
            ? {
                id: s.id,
                status: s.status as SprintAssignment["submission"] extends null
                  ? never
                  : "submitted",
                submitted_at: s.submitted_at,
                total,
                maxScore: null,
                feedback,
              }
            : null,
        };
      }),
    })),
  };
}
