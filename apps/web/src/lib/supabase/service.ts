import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getServiceEnv } from "@/lib/env";

/**
 * The RLS-bypassing client. Read lib/supabase/server.ts first — that is the
 * one almost everything should use.
 *
 * This exists because two operations in the weekly loop are not expressible
 * as "things this student may do":
 *
 *   - writing a `gradings` row. `gradings` has a select policy and no insert
 *     policy on purpose. A student who could write their own grade would.
 *   - calling `allocate_peer_reviews` and `compute_readiness`, which read
 *     every submission in a cohort. EXECUTE on both is revoked from public in
 *     20260809050000_weekly_loop.sql.
 *
 * Rules for anything that imports this:
 *
 *   1. Never in a Server Component or a page. Only in a server action's
 *      `after()` callback or a route handler, where no rendered output can
 *      accidentally carry a row the caller was not allowed to see.
 *   2. Never take a table or column name from the request. The privilege is
 *      the whole risk; a parameterised privileged query is a hole.
 *   3. Prefer calling one of the migration's functions over writing rows by
 *      hand. The function is a fixed, reviewed shape; ad-hoc writes are not.
 */
export function createServiceClient() {
  if (typeof window !== "undefined") {
    // Belt and braces. The key is not in the client bundle — it has no
    // NEXT_PUBLIC_ prefix, so Next never inlines it — but an import from a
    // client component would fail confusingly at runtime instead of loudly.
    throw new Error("The service-role client must never be constructed in the browser.");
  }

  const env = getServiceEnv();
  if (!env) return null;

  return createSupabaseClient(env.url, env.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
