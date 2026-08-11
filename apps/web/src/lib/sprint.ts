import type { Resource, Rubric, RubricCriterion } from "@/lib/curriculum";
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
  spec: { prompt?: string; codes?: string[] };
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
    assignments: { id: string; kind: SprintAssignment["kind"]; spec: { prompt?: string; codes?: string[] } }[] | null;
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
        // Machine grades only. Peer reviews also land in `gradings`, and
        // summing them in would make the headline number move every time a
        // classmate was generous — the same reason compute_readiness leaves
        // peer scores out of readiness. They are shown as peer marks, on the
        // feedback page, attributed to nobody.
        const machine = (s?.gradings ?? []).filter(
          (g) => g.grader_type === "deterministic" || g.grader_type === "ai",
        );
        const total = machine.length
          ? machine.reduce((n, g) => n + Number(g.total), 0)
          : null;
        const feedback = machine.find((g) => g.feedback)?.feedback ?? null;
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

// ─────────────────────────────────────────────────────────────────────────────
// One week
// ─────────────────────────────────────────────────────────────────────────────

export type WeekAssignment = SprintAssignment & { rubric: Rubric | null };

export type WeekDetail = {
  weekNo: number;
  title: string;
  objective: string;
  resources: Resource[];
  assignments: WeekAssignment[];
  /** For the prev/next links, so a student can walk the sprint without the dashboard. */
  weeksInPath: number[];
};

/**
 * The week the student is actually working on, with the reading list beside
 * the thing they have to submit.
 *
 * The dashboard is a list of six weeks and deliberately shallow; this is the
 * page you sit on for a week. Same data source as the public syllabus — the
 * curriculum is free and identical either way — plus the state that only
 * exists once you are enrolled.
 */
export async function getSprintWeek(weekNo: number): Promise<WeekDetail | null> {
  const supabase = await createClient();

  const { data: enrolment, error: enrolmentError } = await supabase
    .from("enrollments")
    .select("id, cohorts ( path_id )")
    .eq("status", "active")
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (enrolmentError) throw describeSupabaseError("loading your enrolment", enrolmentError);
  if (!enrolment) return null;

  const pathId = (enrolment.cohorts as unknown as { path_id: string } | null)?.path_id;
  if (!pathId) return null;

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select(
      `id, week_no, title, objective,
       resources ( id, kind, provider, external_url, youtube_video_id, title, duration_sec, position, health ),
       assignments ( id, kind, spec, rubrics ( name, max_score, criteria ) )`,
    )
    .eq("path_id", pathId)
    .order("week_no", { ascending: true });

  if (modulesError) throw describeSupabaseError("loading this week", modulesError);

  type ModuleRow = {
    id: string;
    week_no: number;
    title: string;
    objective: string;
    resources: Resource[] | null;
    assignments:
      | { id: string; kind: SprintAssignment["kind"]; spec: { prompt?: string; codes?: string[] }; rubrics: Rubric | null }[]
      | null;
  };

  const rows = (modules ?? []) as unknown as ModuleRow[];
  const thisWeek = rows.find((m) => m.week_no === weekNo);
  if (!thisWeek) return null;

  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select("id, assignment_id, status, submitted_at, gradings ( total, grader_type, feedback )")
    .eq("enrollment_id", enrolment.id);

  if (submissionsError) throw describeSupabaseError("loading your submissions", submissionsError);

  type SubmissionRow = {
    id: string;
    assignment_id: string;
    status: string;
    submitted_at: string;
    gradings: { total: number; grader_type: string; feedback: string | null }[] | null;
  };

  const byAssignment = new Map(
    ((submissions ?? []) as unknown as SubmissionRow[]).map((s) => [s.assignment_id, s]),
  );

  return {
    weekNo: thisWeek.week_no,
    title: thisWeek.title,
    objective: thisWeek.objective,
    // Dead links stay in the database for the ops queue but are not shown to a
    // student — ARCHITECTURE.md §6 flags them for a human, it does not
    // auto-repair. Same rule as the public syllabus, for the same reason.
    resources: [...(thisWeek.resources ?? [])]
      .filter((r) => r.health !== "dead")
      .sort((a, b) => a.position - b.position),
    weeksInPath: rows.map((m) => m.week_no),
    assignments: (thisWeek.assignments ?? []).map((a) => {
      const s = byAssignment.get(a.id);
      // Only machine grades. A peer's marks are shown as a peer's marks on the
      // feedback page and are not added into the score the student sees here —
      // see compute_readiness in 20260809050000_weekly_loop.sql for why.
      const machine = (s?.gradings ?? []).filter(
        (g) => g.grader_type === "deterministic" || g.grader_type === "ai",
      );
      return {
        id: a.id,
        kind: a.kind,
        spec: a.spec ?? {},
        rubric: a.rubrics ?? null,
        submission: s
          ? {
              id: s.id,
              status: s.status as NonNullable<SprintAssignment["submission"]>["status"],
              submitted_at: s.submitted_at,
              total: machine.length ? machine.reduce((n, g) => n + Number(g.total), 0) : null,
              maxScore: a.rubrics?.max_score ?? null,
              feedback: machine.find((g) => g.feedback)?.feedback ?? null,
            }
          : null,
      };
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Feedback on one submission
// ─────────────────────────────────────────────────────────────────────────────

export type ScoredCriterion = RubricCriterion & { awarded: number | null };

export type GradeCard = {
  graderType: "deterministic" | "ai" | "peer" | "mentor";
  total: number;
  criteria: ScoredCriterion[];
  feedback: string | null;
  createdAt: string;
};

export type Feedback = {
  submissionId: string;
  weekNo: number;
  prompt: string;
  rubric: Rubric | null;
  status: string;
  submittedAt: string;
  machine: GradeCard | null;
  peers: GradeCard[];
};

/**
 * Every grade on one submission, each number sitting next to the rubric
 * criterion it was given for.
 *
 * A total on its own is not feedback. The rubric is public and the student
 * read it before they started, so the only useful shape for this page is the
 * same list they already saw, with what they scored against each line.
 *
 * RLS does the access control: `gradings` is readable only by the author of
 * the submission it belongs to. There is no ownership check in this function
 * because a second copy of that rule is a second thing to get wrong.
 */
export async function getFeedback(submissionId: string): Promise<Feedback | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("submissions")
    .select(
      `id, week_no, status, submitted_at,
       assignments ( spec, rubrics ( name, max_score, criteria ) ),
       gradings ( grader_type, scores, total, feedback, created_at )`,
    )
    .eq("id", submissionId)
    .maybeSingle();

  if (error) throw describeSupabaseError("loading your feedback", error);
  if (!data) return null;

  type Row = {
    id: string;
    week_no: number;
    status: string;
    submitted_at: string;
    assignments: { spec: { prompt?: string; codes?: string[] } | null; rubrics: Rubric | null } | null;
    gradings:
      | {
          grader_type: GradeCard["graderType"];
          scores: Record<string, unknown> | null;
          total: number;
          feedback: string | null;
          created_at: string;
        }[]
      | null;
  };

  const row = data as unknown as Row;
  const rubric = row.assignments?.rubrics ?? null;
  const criteria = rubric?.criteria ?? [];

  const card = (g: NonNullable<Row["gradings"]>[number]): GradeCard => ({
    graderType: g.grader_type,
    total: Number(g.total),
    // Driven by the rubric, not by the keys in `scores`: a criterion the
    // grader did not report should read as "not scored", not vanish. That is
    // the difference between a grader that missed something and a rubric line
    // that was never applied.
    criteria: criteria.map((c) => {
      const raw = g.scores?.[c.key];
      const awarded = typeof raw === "number" ? raw : Number(raw);
      return { ...c, awarded: Number.isFinite(awarded) ? awarded : null };
    }),
    feedback: g.feedback,
    createdAt: g.created_at,
  });

  const gradings = row.gradings ?? [];

  return {
    submissionId: row.id,
    weekNo: row.week_no,
    prompt: row.assignments?.spec?.prompt ?? "This week's artifact",
    rubric,
    status: row.status,
    submittedAt: row.submitted_at,
    machine:
      gradings
        .filter((g) => g.grader_type === "deterministic" || g.grader_type === "ai")
        .map(card)
        .at(-1) ?? null,
    // Anonymous by construction: `gradings` has no reviewer column, so there
    // is nothing here to attribute even if this page wanted to.
    peers: gradings.filter((g) => g.grader_type === "peer").map(card),
  };
}
