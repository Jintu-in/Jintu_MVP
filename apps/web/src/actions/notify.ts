"use server";

import { z } from "zod";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { notifyRequestLimited, record } from "@/lib/auth-limits";
import { getDraftRoadmaps } from "@/lib/draft-roadmaps";
import { getServiceEnv } from "@/lib/env";

/**
 * The holding page's "Tell me when these open" form (design pack update 3
 * §A). Insert-only, and the only thing it ever promises is "we recorded
 * that you asked" — the actual sending job and the unsubscribe-link route
 * are separate, explicitly gated pieces of work (CHANGES.md: "ask Saurav
 * which email provider, and whether WhatsApp sending is in scope").
 *
 * Works signed out — the service role does the write, not the cookie-
 * bound client, because a draft roadmap's id has to be resolved from its
 * slug and RLS hides draft rows from every anon/authenticated read on
 * purpose (0034). The real access control here is this action's own
 * logic (only ever inserting against roadmaps getDraftRoadmaps() already
 * says are draft), not a client-visible policy.
 */

const CONSENT_TEXT = {
  email: "Email me once when the roadmaps I picked open.",
  whatsapp: "Also tell me on WhatsApp when the roadmaps I picked open.",
} as const;

const notifyInput = z.object({
  email: z.string().trim().toLowerCase().email("Enter a real email address."),
  roadmapSlugs: z.array(z.string()).min(1, "Pick at least one roadmap."),
  whatsapp: z.boolean(),
  phone: z.string().trim().max(20).optional(),
  // Invisible to a person, filled only by a bot filling every field it can
  // see. Never rejected with an error — that would just teach the bot to
  // leave it blank next time — the action simply does nothing real.
  website: z.string().max(0).or(z.literal("")).optional(),
});

export const requestNotify = actionClient.inputSchema(notifyInput).action(async ({ parsedInput }) => {
  if (parsedInput.website) return { sent: true };

  if (await notifyRequestLimited(parsedInput.email)) {
    throw new UserFacingError("Too many requests from here for now — try again in a bit.");
  }
  await record("notify_request", parsedInput.email);

  if (parsedInput.whatsapp && !parsedInput.phone) {
    throw new UserFacingError("Add a WhatsApp number, or untick WhatsApp.");
  }

  const env = getServiceEnv();
  if (!env) throw new Error("notify insert failed: service credentials are not configured");
  const admin = createSupabaseClient(env.url, env.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const drafts = await getDraftRoadmaps();
  const picked = drafts.filter((d) => parsedInput.roadmapSlugs.includes(d.slug));
  if (picked.length === 0) {
    throw new UserFacingError("Those roadmaps aren't waiting to open any more — refresh the page.");
  }

  const rows = picked.flatMap((d) => {
    const base = {
      email: parsedInput.email,
      roadmap_id: d.id,
      consent_text: CONSENT_TEXT.email,
    };
    return parsedInput.whatsapp
      ? [
          { ...base, channel: "email" },
          { ...base, channel: "whatsapp", phone: parsedInput.phone, consent_text: CONSENT_TEXT.whatsapp },
        ]
      : [{ ...base, channel: "email" }];
  });

  // A second submit for the same roadmap+channel is not an error — the
  // unique constraint (0035) already means "we heard you the first time".
  const { error } = await admin.from("notify_requests").upsert(rows, {
    onConflict: "email,roadmap_id,channel",
    ignoreDuplicates: true,
  });
  if (error) throw new Error(`notify insert failed: ${error.message}`);

  return { sent: true };
});
