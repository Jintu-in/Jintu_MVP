import { describeSupabaseError } from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";

/**
 * Today's reps: the day-sized prompts for the week the cohort is in.
 *
 * Everything here reads through RLS with the caller's own session —
 * daily_reps is public curriculum, rep_submissions and streaks and
 * point_events are policy-scoped to the caller — so this needs no service
 * client and can leak nothing that RLS would not.
 */

export type DailyRep = {
  id: string;
  dayNo: number;
  prompt: string;
  points: number;
  done: boolean;
};

export type RepBoard = {
  weekNo: number;
  reps: DailyRep[];
  streakDays: number;
  freezesRemaining: number;
  /** Consistency points earned today, against the 30/day cap. */
  pointsToday: number;
};

/**
 * Which week the cohort is in today. Clamped: before the start it is week 1
 * (the cohort is open, early reps are allowed and welcome), after the end it
 * stays on the last week rather than counting into week nine of a six-week
 * sprint.
 */
export function currentWeekNo(startsOn: string, totalWeeks: number): number {
  const start = new Date(`${startsOn}T00:00:00Z`).getTime();
  const days = Math.floor((Date.now() - start) / 86_400_000);
  return Math.min(Math.max(Math.floor(days / 7) + 1, 1), Math.max(totalWeeks, 1));
}

export async function getRepBoard(
  moduleId: string,
  weekNo: number,
): Promise<RepBoard | null> {
  const supabase = await createClient();

  const { data: reps, error } = await supabase
    .from("daily_reps")
    .select("id, day_no, prompt, points")
    .eq("module_id", moduleId)
    .order("day_no", { ascending: true });

  if (error) {
    // PGRST205: the ledgers migration is not applied yet. The dashboard must
    // not 500 over a missing habit loop — it simply has no board.
    if (error.code === "PGRST205") return null;
    throw describeSupabaseError("loading this week's reps", error);
  }
  if (!reps?.length) return null;

  const [{ data: done }, { data: streak }, { data: today }] = await Promise.all([
    supabase
      .from("rep_submissions")
      .select("daily_rep_id")
      .in(
        "daily_rep_id",
        reps.map((r) => r.id),
      ),
    supabase.from("streaks").select("current_days, freezes_remaining").maybeSingle(),
    supabase
      .from("point_events")
      .select("points")
      .eq("ledger", "consistency")
      .is("voided_at", null)
      .gte("awarded_at", new Date().toISOString().slice(0, 10)),
  ]);

  const doneSet = new Set((done ?? []).map((d) => d.daily_rep_id as string));

  return {
    weekNo,
    reps: reps.map((r) => ({
      id: r.id as string,
      dayNo: r.day_no as number,
      prompt: r.prompt as string,
      points: r.points as number,
      done: doneSet.has(r.id as string),
    })),
    streakDays: streak?.current_days ?? 0,
    freezesRemaining: streak?.freezes_remaining ?? 2,
    pointsToday: (today ?? []).reduce((n, e) => n + Number(e.points), 0),
  };
}
