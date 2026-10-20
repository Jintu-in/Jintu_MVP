"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  deleteAccountInput,
  displayNameInput,
  publicProfileInput,
  reminderPrefsInput,
  timezoneUpdateInput,
} from "@jintu/contracts";
import { recordConsentEventBestEffort } from "@/lib/consent-events";
import { getServiceEnv } from "@/lib/env";
import { UserFacingError, actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * The account settings behind /profile.
 *
 * Every one of these writes a row the person can see the effect of, so the
 * errors are user-facing sentences rather than generic apologies. RLS is the
 * boundary; the `.eq("id", user.id)` filters are the second lock.
 */

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new UserFacingError("Your session expired. Sign in again.");
  return { supabase, user };
}

/**
 * The one setting that can silently break the core mechanic, so it reports
 * back what it did rather than just succeeding.
 *
 * Only future days move: activity_days rows already written keep the dates
 * they were written with, which is why the confirmation says so.
 */
export const updateTimezone = actionClient
  .inputSchema(timezoneUpdateInput)
  .action(async ({ parsedInput }) => {
    const { supabase, user } = await requireUser();

    const { error } = await supabase
      .from("profiles")
      .update({ timezone: parsedInput.timezone })
      .eq("id", user.id);

    // 22023 is the trigger in 0012 refusing a name that is not in
    // pg_timezone_names — the database owns that list, not the bundle.
    if (error) {
      throw new UserFacingError(
        error.code === "22023"
          ? "We do not recognise that timezone. Pick one from the list."
          : `Could not save your timezone: ${error.message}`,
      );
    }

    revalidatePath("/profile");
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { timezone: parsedInput.timezone };
  });

export const updateDisplayName = actionClient
  .inputSchema(displayNameInput)
  .action(async ({ parsedInput }) => {
    const { supabase, user } = await requireUser();

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: parsedInput.displayName ?? null })
      .eq("id", user.id);
    if (error) throw new UserFacingError(`Could not save that name: ${error.message}`);

    revalidatePath("/profile");
    revalidatePath("/settings");
    revalidatePath("/", "layout");
    return { displayName: parsedInput.displayName ?? null };
  });

/**
 * The one place "One reminder a day" (Settings) and "Daily reminders"
 * (Settings/Consents) both write — CHANGES.md item 2's "one source of
 * truth". `dailyEnabled` is both the operational switch and, logged
 * alongside it, the `reminders` consent: whichever row the person touched,
 * the other reads the same state next render.
 */
export const updateReminders = actionClient
  .inputSchema(reminderPrefsInput)
  .action(async ({ parsedInput }) => {
    const { supabase, user } = await requireUser();

    const { error } = await supabase.from("reminder_prefs").upsert(
      {
        user_id: user.id,
        daily_enabled: parsedInput.dailyEnabled,
        daily_at: parsedInput.dailyAt,
        streak_warning: parsedInput.streakWarning,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new UserFacingError(`Could not save your reminders: ${error.message}`);

    await recordConsentEventBestEffort(supabase, user.id, "reminders", parsedInput.dailyEnabled);

    revalidatePath("/profile");
    revalidatePath("/settings");
    revalidatePath("/settings/consents");
    return { saved: true };
  });

/**
 * The public page. The row survives being switched off so the handle stays
 * reserved for the person who chose it — turning the page back on should not
 * be a race against whoever noticed it went free.
 *
 * The one place the Settings "Public profile" toggle and the Settings/
 * Consents "Public profile" row both write — CHANGES.md item 2's "one
 * source of truth". `isPublic` is both the operational switch (what gates
 * anonymous reads via RLS) and, logged alongside it, the `public_profile`
 * consent.
 */
export const updatePublicProfile = actionClient
  .inputSchema(publicProfileInput)
  .action(async ({ parsedInput }) => {
    const { supabase, user } = await requireUser();

    const { error } = await supabase.from("public_profiles").upsert(
      {
        user_id: user.id,
        handle: parsedInput.handle,
        is_public: parsedInput.isPublic,
      },
      { onConflict: "user_id" },
    );

    if (error) {
      if (error.code === "23505") {
        throw new UserFacingError("Somebody already has that name. Try another.");
      }
      // 23514 is the reserved-word or shape CHECK in 0013.
      if (error.code === "23514") {
        throw new UserFacingError(
          "That name cannot be used. Use 3–30 lowercase letters, numbers or hyphens, and avoid names the site uses itself.",
        );
      }
      throw new UserFacingError(`Could not save your public profile: ${error.message}`);
    }

    await recordConsentEventBestEffort(supabase, user.id, "public_profile", parsedInput.isPublic);

    revalidatePath("/profile");
    revalidatePath("/settings");
    revalidatePath("/settings/consents");
    revalidatePath(`/u/${parsedInput.handle}`);
    return { handle: parsedInput.handle, isPublic: parsedInput.isPublic };
  });

/**
 * Delete. A real cascade from auth.users, never a flag.
 *
 * profiles.id references auth.users on delete cascade, and every table in
 * this subsystem references profiles the same way, so removing the auth user
 * removes the person from the database entirely. A soft-delete would leave
 * their rows readable by anything holding the service key, which is not what
 * "delete my account" means to the person asking, or to the DPDP Act.
 *
 * The typed email is checked here as well as in the form: a disabled button
 * is a suggestion.
 */
export const deleteAccount = actionClient
  .inputSchema(deleteAccountInput)
  .action(async ({ parsedInput }) => {
    const { supabase, user } = await requireUser();

    const typed = parsedInput.confirmEmail.trim().toLowerCase();
    if (!user.email || typed !== user.email.toLowerCase()) {
      throw new UserFacingError("That is not the email address on this account.");
    }

    const env = getServiceEnv();
    if (!env) {
      // Never pretend. A person told their account is gone, whose account is
      // not gone, has been lied to about the one thing they asked for.
      throw new UserFacingError(
        "Account deletion is not available right now. Email contact@tindata.com and a person will do it.",
      );
    }

    const admin = createSupabaseClient(env.url, env.secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw new UserFacingError(`Could not delete your account: ${error.message}`);

    await supabase.auth.signOut();
    return { deleted: true };
  });
