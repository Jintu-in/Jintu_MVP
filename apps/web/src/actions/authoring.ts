"use server";

import {
  NEEDS_ACCOUNT,
  NEEDS_PROFILE,
  communityOutlineInput,
  communityTrackInput,
} from "@jintu/contracts";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * Community authoring, through the two RPCs and nothing else. The ownership
 * check, the three-unpublished cap, the outline bounds and the whole-list
 * replacement all live in the database — there is no insert policy to slip
 * past, so there is no second path that skips them.
 *
 * Codes the RPCs raise deliberately:
 *
 *   28000  no session          → NEEDS_ACCOUNT, the client opens sign-in
 *   P0002  no profile          → NEEDS_PROFILE, the client goes to onboarding
 *   P0001  not yours / gone    → shown as written; it is one sentence on purpose
 *   23514  bounds              → shown as written
 *   23505  same title again    → shown as written
 *   P0003  three unfinished    → shown as written
 *
 * PGRST202 is an operator problem (migration not applied) and is named as
 * one rather than shown to a person who cannot act on it.
 */
const FOR_THE_USER = new Set(["P0001", "23514", "23505", "P0003"]);

const MIGRATION_HINT =
  "does not exist — migration 20260812020000_community_tier.sql has not been " +
  "applied to this project. Run pnpm db:catchup and paste the output into the SQL editor.";

export const createCommunityTrack = actionClient
  .inputSchema(communityTrackInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("author_community_track", {
      p_title: parsedInput.title,
      p_summary: parsedInput.summary,
    });

    if (error) {
      if (error.code === "28000") throw new UserFacingError(NEEDS_ACCOUNT);
      if (error.code === "P0002") throw new UserFacingError(NEEDS_PROFILE);
      if (FOR_THE_USER.has(error.code ?? "")) throw new UserFacingError(error.message);
      if (error.code === "PGRST202") throw new Error(`author_community_track() ${MIGRATION_HINT}`);
      throw new Error(`starting a track failed: ${error.code ?? "no code"} ${error.message}`);
    }

    return { slug: data as string };
  });

export const saveCommunityOutline = actionClient
  .inputSchema(communityOutlineInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("set_community_outline", {
      p_slug: parsedInput.slug,
      p_weeks: parsedInput.weeks,
    });

    if (error) {
      if (error.code === "28000") throw new UserFacingError(NEEDS_ACCOUNT);
      if (FOR_THE_USER.has(error.code ?? "")) throw new UserFacingError(error.message);
      if (error.code === "PGRST202") throw new Error(`set_community_outline() ${MIGRATION_HINT}`);
      throw new Error(`saving the outline failed: ${error.code ?? "no code"} ${error.message}`);
    }

    return { weeks: data as number };
  });
