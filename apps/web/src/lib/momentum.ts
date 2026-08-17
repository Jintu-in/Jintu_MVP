import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * The header chip's numbers: streak days and lifetime points.
 *
 * Deliberately forgiving: the header renders on every page, and a momentum
 * read that fails must never take the site down with it — null just means
 * the chip does not render this time. The points sum is computed in JS over
 * the user's own rows; at the plan's ~200 points/week that is a few hundred
 * rows a year, and a PostgREST aggregate can replace it when it ever isn't.
 */
export type Momentum = { streakDays: number; totalPoints: number };

export async function getMyMomentum(): Promise<Momentum | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const [streakRes, pointsRes] = await Promise.all([
      supabase.from("streak_status").select("current_days").maybeSingle(), // the decaying view — never the raw table
      supabase.from("point_events").select("points"),
    ]);
    if (streakRes.error || pointsRes.error) return null;

    return {
      streakDays: streakRes.data?.current_days ?? 0,
      totalPoints: (pointsRes.data ?? []).reduce((a, p) => a + p.points, 0),
    };
  } catch {
    return null;
  }
}
