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

/**
 * Step 1 — send a code.
 *
 * By email rather than SMS; the reasoning is in @jintu/contracts auth.ts.
 * `shouldCreateUser` is left at its default of true because this one form is
 * both sign-in and sign-up: an account exists from the moment someone proves
 * they hold the address, and the profile — with the 18+ gate on it — is
 * created separately at onboarding.
 */
export const requestOtp = actionClient
  .inputSchema(otpRequestInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({ email: parsedInput.email });

    if (error) {
      // The operational cause goes to the log, where whoever can fix it will
      // look. It does not go to the student: "configure SMTP in the
      // dashboard" is not a sentence anyone signing up can act on, and
      // `over_email_send_rate_limit` is worse — it reads as an accusation.
      console.error("[auth] otp send failed", error.status, error.code, error.message);

      // Supabase's built-in sender allows about two auth emails an hour, so
      // this is the failure a project without custom SMTP hits first and
      // hits constantly. It is a quota, not the student doing anything wrong,
      // and telling them to wait is the only true and useful thing to say.
      if (error.status === 429 || /rate limit/i.test(error.message)) {
        throw new Error(
          "We have sent too many codes in the last hour. Wait a few minutes and try again — this is our limit, not yours.",
        );
      }

      throw new Error("We could not send the code just now. Try again in a moment.");
    }

    return { sent: true, email: parsedInput.email };
  });

/**
 * Step 2 — verify it. Establishes the session via cookies.
 *
 * type "email" covers the six-digit code sent by `signInWithOtp({ email })`.
 * Note that the code only reaches the student if the Magic Link email
 * template contains `{{ .Token }}` — the stock template is a link and nothing
 * else, and a template that never renders the code produces a flow where the
 * email arrives and every code entered is wrong.
 */
export const verifyOtp = actionClient
  .inputSchema(otpVerifyInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    // Which type a code carries is decided by the project, not by this app.
    // With email confirmations on, an address Supabase has never seen gets a
    // signup confirmation and its code verifies as "signup"; a returning
    // address, or any address with confirmations off, gets a magic link and
    // verifies as "email". The app cannot know which without first knowing
    // whether the account existed — which is exactly the thing it is trying
    // to find out.
    //
    // So try both. The alternative is a flow that works only while one
    // dashboard toggle is in one position, and silently rejects every code
    // the day somebody flips it.
    let error = null;
    for (const type of ["email", "signup"] as const) {
      const result = await supabase.auth.verifyOtp({
        email: parsedInput.email,
        token: parsedInput.token,
        type,
      });
      if (!result.error) {
        error = null;
        break;
      }
      error = result.error;
    }

    if (error) {
      // Deliberately the same message for a wrong code and an expired one:
      // distinguishing them tells an attacker which addresses have live codes.
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

    // The phone comes from this form, not from `user.phone`. Sign-in is by
    // email, so `user.phone` is always null — reading it here is what used to
    // make this step fail with "this account has no phone number on it".
    //
    // `profiles.phone` is unique, so the same number cannot be attached to two
    // accounts. That surfaces below as 23505, and it is not the same case as a
    // profile that already exists.
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      phone: parsedInput.phone,
      full_name: parsedInput.fullName ?? null,
      batch_year: parsedInput.batchYear ?? null,
      is_adult_confirmed: parsedInput.isAdultConfirmed,
    });

    if (profileError) {
      // 23505 now has two causes and they are not the same event. On the
      // primary key it means onboarding was completed in another tab or the
      // user came back to the URL — harmless, carry on. On phone it means
      // somebody else's account already holds this number, which the person
      // filling in the form needs told, because only they can fix it.
      const duplicatePhone =
        profileError.code === "23505" && /phone/i.test(profileError.message);

      if (duplicatePhone) {
        throw new Error(
          "That mobile number is already on another account. Sign in with the email you used before, or message us if you think this is wrong.",
        );
      }
      if (profileError.code !== "23505") {
        throw new Error(`Could not create your profile: ${profileError.message}`);
      }
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
