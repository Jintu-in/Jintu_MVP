"use server";

import { revalidatePath } from "next/cache";
import { profileUpdateInput } from "@jintu/contracts";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Corrects your own name and graduation year.
 *
 * Scoped by `.eq("id", user.id)` as well as by RLS. The policy is the thing
 * that actually stops one student editing another's row, and the filter is
 * there so a policy regression shows up as zero rows updated rather than as a
 * quiet mass edit. Two locks on a door that only needs one is the correct
 * number for the row that carries someone's name.
 */
export const updateProfile = actionClient
  .inputSchema(profileUpdateInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Your session expired. Sign in again.");

    // Null rather than undefined: clearing a name has to be possible. An
    // undefined would be dropped from the payload and the old value would
    // survive, so "I no longer want my name stored" would silently fail —
    // which is the one outcome a correction form must never produce.
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: parsedInput.fullName ?? null,
        batch_year: parsedInput.batchYear ?? null,
      })
      .eq("id", user.id)
      .select("id");

    if (error) throw new Error(`Could not save your details: ${error.message}`);

    if (!data?.length) {
      throw new Error(
        "Nothing was updated. Your profile may not exist yet — finish signing up first.",
      );
    }

    // The name is in the header on every page, so a stale layout would show
    // the old one until the next full load.
    revalidatePath("/", "layout");

    return { saved: true };
  });
