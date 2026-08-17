"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Marking a day done — and taking it back.
 *
 * Both go through the definer RPCs from 0011 (complete_day /
 * uncomplete_day), which own the streak: progress row, activity day,
 * streak arithmetic and any streak bonus, atomically, on IST dates. The
 * action returns the streak result so the UI can reconcile its optimistic
 * update and, when a break happened, say so honestly — naming the miss and
 * protecting the total in the same sentence.
 */
const input = z.object({
  nodeId: z.string().uuid(),
  roadmapId: z.string().uuid(),
  roadmapSlug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "not a roadmap slug"),
  done: z.boolean(),
});

export type StreakResult = {
  currentDays: number;
  longestDays: number;
  totalDays: number;
  isNewDay: boolean;
  wasBroken: boolean;
  daysMissed: number;
};

export const setNodeDone = actionClient.inputSchema(input).action(async ({ parsedInput }) => {
  const { nodeId, roadmapId, roadmapSlug, done } = parsedInput;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UserFacingError("Sign in to track your progress.");

  const rpc = done ? "complete_day" : "uncomplete_day";
  const { data, error } = await supabase.rpc(rpc, { p_node_id: nodeId });
  if (error) {
    if (error.code === "23503") {
      throw new UserFacingError("This roadmap changed since you loaded it. Refresh and retry.");
    }
    if (error.code === "28000") {
      throw new UserFacingError("Sign in to track your progress.");
    }
    throw new Error(`${rpc} failed: ${error.message}`);
  }

  // Enrollment keeps "continue where you were" answerable from the dashboard.
  const { error: enrolError } = await supabase.from("roadmap_enrollments").upsert(
    { user_id: user.id, roadmap_id: roadmapId, last_node_id: nodeId },
    { onConflict: "user_id,roadmap_id" },
  );
  if (enrolError) throw new Error(`enrollment upsert failed: ${enrolError.message}`);

  revalidatePath(`/learn/${roadmapSlug}`, "layout");
  revalidatePath("/dashboard");

  const row = (data as Record<string, unknown>[] | null)?.[0] ?? null;
  const streak: StreakResult | null = row
    ? {
        currentDays: Number(row.current_days ?? 0),
        longestDays: Number(row.longest_days ?? 0),
        totalDays: Number(row.total_days ?? 0),
        isNewDay: Boolean(row.is_new_day ?? false),
        wasBroken: Boolean(row.was_broken ?? false),
        daysMissed: Number(row.days_missed ?? 0),
      }
    : null;

  return { done, streak };
});
