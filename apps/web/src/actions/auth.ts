"use server";

import { redirect } from "next/navigation";
import {
  NOTICE_VERSION,
  OPTIONAL_PURPOSES,
  consentToggleInput,
  onboardingInput,
  otpRequestInput,
  otpVerifyInput,
} from "@jintu/contracts";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/** Step 1 — send a code. */
export const requestOtp = actionClient
  .inputSchema(otpRequestInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({ phone: parsedInput.phone });

    if (error) {
      // The most common cause by far is the Phone provider being switched off
      // on the project, which reads as an opaque 422 otherwise.
      throw new Error(
        `Could not send the code: ${error.message}. ` +
          `If this says the provider is disabled, enable Phone auth and an SMS ` +
          `provider in the Supabase dashboard.`,
      );
    }

    return { sent: true, phone: parsedInput.phone };
  });

/** Step 2 — verify it. Establishes the session via cookies. */
export const verifyOtp = actionClient
  .inputSchema(otpVerifyInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      phone: parsedInput.phone,
      token: parsedInput.token,
      type: "sms",
    });

    if (error) {
      // Deliberately the same message for a wrong code and an expired one:
      // distinguishing them tells an attacker which numbers have live codes.
      throw new Error("That code is not valid. Ask for a new one.");
    }

    return { verified: true };
  });

/**
 * Step 3 — create the profile. This is where Law 3 is enforced in the
 * application, and the database enforces it again with a CHECK constraint.
 *
 * The profile is created here rather than at verification, because a profile
 * row may not exist for anyone who has not affirmed they are 18 or over.
 */
export const completeOnboarding = actionClient
  .inputSchema(onboardingInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error("Your session expired. Sign in again.");
    if (!user.phone) throw new Error("This account has no phone number on it.");

    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      phone: `+${user.phone.replace(/^\+/, "")}`,
      full_name: parsedInput.fullName ?? null,
      batch_year: parsedInput.batchYear ?? null,
      is_adult_confirmed: parsedInput.isAdultConfirmed,
    });

    // 23505 = the profile already exists, which means onboarding was completed
    // in another tab or the user came back to the URL. Not an error.
    if (profileError && profileError.code !== "23505") {
      throw new Error(`Could not create your profile: ${profileError.message}`);
    }

    // core_service is not in this list and is not a checkbox: it is what the
    // account is for. It is recorded as granted because using the service is
    // the affirmative action, and the notice explains it.
    const granted = [
      { purpose: "core_service" as const, on: true },
      ...OPTIONAL_PURPOSES.map((p) => ({ purpose: p, on: parsedInput[p] })),
    ].filter((c) => c.on);

    if (granted.length > 0) {
      const { error: consentError } = await supabase.from("consents").insert(
        granted.map((c) => ({
          user_id: user.id,
          purpose: c.purpose,
          notice_version: NOTICE_VERSION,
        })),
      );

      // A duplicate here means the same purposes were already recorded; the
      // partial unique index is doing its job.
      if (consentError && consentError.code !== "23505") {
        throw new Error(`Could not record your choices: ${consentError.message}`);
      }
    }

    return { onboarded: true };
  });

/**
 * Withdrawal must be as easy as granting (docs/LEGAL.md §2.2), which is why
 * this is one action behind one toggle rather than an email to support.
 *
 * Withdrawing sets withdrawn_at; it never deletes. The row is the evidence
 * that consent existed for the period it covered.
 */
export const toggleConsent = actionClient
  .inputSchema(consentToggleInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Your session expired. Sign in again.");

    if (parsedInput.granted) {
      const { error } = await supabase.from("consents").insert({
        user_id: user.id,
        purpose: parsedInput.purpose,
        notice_version: NOTICE_VERSION,
      });
      if (error && error.code !== "23505") {
        throw new Error(`Could not record that: ${error.message}`);
      }
    } else {
      const { error } = await supabase
        .from("consents")
        .update({ withdrawn_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("purpose", parsedInput.purpose)
        .is("withdrawn_at", null);
      if (error) throw new Error(`Could not withdraw that: ${error.message}`);
    }

    return { purpose: parsedInput.purpose, granted: parsedInput.granted };
  });

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
