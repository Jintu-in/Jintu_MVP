import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * V2Done/DeskDone's "Share your progress" card — the text formatting lives
 * here so the inline preview (lesson-states.tsx, rendered in the browser)
 * and the downloadable PNG (api/share-card/[slug]/[node]/route.tsx,
 * rendered independently on its own request) say exactly the same thing.
 * Only the name is fetched, not a full account read (lib/account.ts's
 * getAccount() pulls six tables for /profile; this needs one row).
 */

function firstNameOf(name: string | null): string | null {
  const first = name?.trim().split(/\s+/)[0];
  return first ? first : null;
}

export async function getMyFirstName(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("full_name, display_name").eq("id", user.id).maybeSingle();
    return firstNameOf(data?.display_name ?? data?.full_name ?? null);
  } catch {
    return null;
  }
}

/** "Asha finished Git basics." — "You" when the name is unknown, never blank. */
export function shareHeadline(firstName: string | null, nodeTitle: string): string {
  return `${firstName ?? "You"} finished ${nodeTitle}.`;
}

/** "Lesson 1 of 12 · Git & GitHub". */
export function shareLessonLine(lessonNumber: number, totalLessons: number, roadmapTitle: string): string {
  return `Lesson ${lessonNumber} of ${totalLessons} · ${roadmapTitle}`;
}

/** "1 day streak" — singular "day" at every count, matching StatCard's own
 *  label (lesson-states.tsx) rather than inventing pluralisation the mockup
 *  never draws. */
export function shareStreakLine(days: number): string {
  return `${days} day streak`;
}
