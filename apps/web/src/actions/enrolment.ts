"use server";

import { z } from "zod";
import { NEEDS_ACCOUNT, NEEDS_PROFILE } from "@jintu/contracts";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Reserve a seat in an open cohort.
 *
 * Thin on purpose: every rule — session, profile, open, capacity, idempotence
 * — lives in enrol_me() in the database, where it cannot be skipped by a
 * different caller. This maps its error codes onto actions the client can
 * take, because "ERROR: P0002" is not an instruction anyone can follow.
 */

export const enrol = actionClient
  .inputSchema(z.object({ cohortId: z.uuid() }))
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("enrol_me", {
      p_cohort_id: parsedInput.cohortId,
    });

    if (error) {
      switch (error.code) {
        case "28000":
          throw new UserFacingError(NEEDS_ACCOUNT);
        case "P0002":
          // Covers both "no profile" and "no such cohort". The first is
          // overwhelmingly the real case from this page, and the second still
          // lands somewhere sensible: onboarding, then back here.
          throw new UserFacingError(NEEDS_PROFILE);
        case "P0001":
          throw new UserFacingError(
            "Enrolment for this cohort has closed. Join the waitlist and we will tell you when the next one opens.",
          );
        case "P0003":
          throw new UserFacingError(
            "This cohort is full. Join the waitlist — a seat sometimes frees up in week zero, and you hear first about the next cohort.",
          );
        default:
          throw new Error(`enrolment failed: ${error.code ?? "no code"} ${error.message}`);
      }
    }

    return { enrolmentId: data as string };
  });

/**
 * V3's "Start this track" — free, self-paced, no seats.
 *
 * Delegates to start_track(), which finds or creates the rolling intake for
 * the track's live path and enrols through the same enrol_me gates. The
 * client behaviour on refusal is identical to enrolling, because the gates
 * are: sign in first, then the 18+ onboarding.
 */
export const startTrack = actionClient
  .inputSchema(z.object({ slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/) }))
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("start_track", {
      p_slug: parsedInput.slug,
    });

    if (error) {
      switch (error.code) {
        case "28000":
          throw new UserFacingError(NEEDS_ACCOUNT);
        case "P0002":
          throw new UserFacingError(NEEDS_PROFILE);
        case "P0001":
          throw new UserFacingError("This track is not open to start yet.");
        case "PGRST202":
          throw new Error(
            "start_track() does not exist — migration 20260812030000_open_start.sql " +
              "has not been applied. Run pnpm db:catchup and paste the output into the SQL editor.",
          );
        default:
          throw new Error(`start failed: ${error.code ?? "no code"} ${error.message}`);
      }
    }

    return { enrolmentId: data as string };
  });
