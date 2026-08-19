"use server";

import { z } from "zod";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * "We have not written that one yet" — and now we know what was wanted.
 *
 * A 404 on a roadmap slug is the clearest demand signal the product gets:
 * somebody arrived looking for a subject by name. Throwing that away and
 * showing a dead end wastes the one moment they were willing to tell us.
 *
 * Works signed out, because the person asking usually has no account. The
 * row is attributed when there is a session and anonymous when there is
 * not; the RLS policy in 0015 refuses any attempt to attribute it to
 * somebody else.
 */
export const requestTopic = actionClient
  .inputSchema(
    z.object({
      wanted: z
        .string()
        .trim()
        .min(2, "Tell us the subject in a word or two.")
        .max(200, "Shorter than that, please."),
      fromSlug: z.string().trim().max(120).optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("topic_requests").insert({
      wanted: parsedInput.wanted,
      from_slug: parsedInput.fromSlug ?? null,
      user_id: user?.id ?? null,
    });
    if (error) throw new UserFacingError(`We could not record that: ${error.message}`);

    return { recorded: true };
  });
