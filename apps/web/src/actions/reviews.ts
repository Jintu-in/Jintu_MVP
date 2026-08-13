"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * The review loop's two writes: make a card, grade a card.
 *
 * Creating is a plain RLS insert — the card is the user's own words about a
 * node they studied, and writing one earns nothing (or people would farm
 * cards, not memories). Grading goes through the review_card_grade RPC,
 * the one client-callable path that mints anything, and it mints one point
 * per card per day.
 */

const createInput = z.object({
  nodeId: z.string().uuid(),
  roadmapSlug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  front: z
    .string()
    .trim()
    .min(1, "Write the question side.")
    .max(500, "Keep the front under 500 characters."),
  back: z
    .string()
    .trim()
    .min(1, "Write the answer side.")
    .max(2000, "Keep the back under 2000 characters."),
});

export const createCard = actionClient.inputSchema(createInput).action(async ({ parsedInput }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UserFacingError("Sign in to make review cards.");

  const { error } = await supabase.from("review_cards").insert({
    user_id: user.id,
    node_id: parsedInput.nodeId,
    front: parsedInput.front,
    back: parsedInput.back,
  });
  if (error) {
    if (error.code === "23503") {
      throw new UserFacingError("This roadmap changed since you loaded it. Refresh and retry.");
    }
    throw new Error(`card insert failed: ${error.message}`);
  }

  revalidatePath(`/learn/${parsedInput.roadmapSlug}`, "layout");
  return { created: true };
});

const gradeInput = z.object({
  cardId: z.string().uuid(),
  rating: z.enum(["again", "hard", "good", "easy"]),
});

export const gradeCard = actionClient.inputSchema(gradeInput).action(async ({ parsedInput }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UserFacingError("Your session expired. Sign in again.");

  const { data, error } = await supabase.rpc("review_card_grade", {
    p_card: parsedInput.cardId,
    p_rating: parsedInput.rating,
  });
  if (error) {
    // P0002: not their card, or it vanished. Same sentence either way — the
    // difference is nobody's business but the audit log's.
    if (error.code === "P0002") {
      throw new UserFacingError("That card is gone. Refresh the queue.");
    }
    throw new Error(`grade failed: ${error.message}`);
  }

  revalidatePath("/review");
  revalidatePath("/dashboard");
  return { nextDue: (data as { next_due: string }[] | null)?.[0]?.next_due ?? null };
});
