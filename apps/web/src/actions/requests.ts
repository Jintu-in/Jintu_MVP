"use server";

import { z } from "zod";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requestIpHash } from "@/lib/auth-limits";
import { getServiceEnv } from "@/lib/env";
import { actionClient, UserFacingError } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

/**
 * "We have not written that one yet" — and now we know what was wanted.
 *
 * A search with no match, or a 404 on a roadmap slug, is the clearest demand
 * signal the product gets: somebody arrived looking for a subject by name.
 * Throwing that away and showing a dead end wastes the one moment they were
 * willing to tell us. `source` says which of the three mouths it came from,
 * which is the difference between "people search for kubernetes" and "people
 * follow dead links to kubernetes".
 *
 * Works signed out, because the person asking usually has no account. The row
 * is attributed when there is a session and anonymous when there is not; the
 * RLS policy in 0015 refuses any attempt to attribute it to somebody else.
 *
 * NOT written automatically on every no-match search. A debounced field would
 * post "k", "ku", "kub" and bury the signal in prefixes, and silently
 * recording what someone typed is not the same as them choosing to tell us.
 * It is a button.
 */

/** Requests per IP per hour. Generous for a person, useless for a script. */
const PER_IP_PER_HOUR = 8;

function admin() {
  const env = getServiceEnv();
  if (!env) return null;
  return createSupabaseClient(env.url, env.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * True when this IP has asked enough for one hour.
 *
 * Counting needs the service role: RLS lets anyone insert here and lets
 * nobody read, which is the right shape for the table and means the limit
 * cannot be enforced from the caller's own client. With no service key
 * configured this degrades OPEN, loudly — same posture as auth-limits.ts. A
 * missing env var must not silence the one channel users have.
 */
async function ipLimited(ipHash: string | null): Promise<boolean> {
  if (!ipHash) return false;
  const db = admin();
  if (!db) {
    console.error("[requests] SUPABASE_SECRET_KEY missing — topic requests are not rate limited");
    return false;
  }
  const { count, error } = await db
    .from("topic_requests")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", new Date(Date.now() - 3_600_000).toISOString());
  if (error) {
    console.error("[requests] rate-limit count failed", error.code, error.message);
    return false;
  }
  return (count ?? 0) >= PER_IP_PER_HOUR;
}

export const requestTopic = actionClient
  .inputSchema(
    z.object({
      wanted: z
        .string()
        .trim()
        .min(2, "Tell us the subject in a word or two.")
        .max(200, "Shorter than that, please."),
      source: z.enum(["sidebar", "no_results", "not_found"]).default("sidebar"),
      fromSlug: z.string().trim().max(120).optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const ipHash = await requestIpHash();
    if (await ipLimited(ipHash)) {
      throw new UserFacingError(
        "That is a lot of requests from one place in an hour. Try again later — the earlier ones are safe.",
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Written through the caller's own client, under the anon insert policy —
    // the service role is for counting, not for writing on a user's behalf.
    const { error } = await supabase.from("topic_requests").insert({
      wanted: parsedInput.wanted,
      source: parsedInput.source,
      from_slug: parsedInput.fromSlug ?? null,
      ip_hash: ipHash,
      user_id: user?.id ?? null,
    });
    if (error) throw new UserFacingError(`We could not record that: ${error.message}`);

    return { recorded: true };
  });
