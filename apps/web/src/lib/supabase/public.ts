import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env";

/**
 * Session-less anon client for reading public, RLS-published data.
 *
 * The cookie-bound client in ./server.ts makes any page that touches it
 * dynamic, because reading cookies opts a route out of caching. For the free
 * curriculum that is the wrong trade: /learn/[track] is the top of the funnel
 * and every search-crawler hit would become a Postgres query for data that is
 * identical for every visitor.
 *
 * Use this only for data that is public by policy. It carries no session, so
 * RLS sees `anon` and nothing else — which is exactly the guarantee we want
 * on a page that must render for someone with no account.
 */
export function createPublicClient() {
  const env = getPublicEnv();

  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}
