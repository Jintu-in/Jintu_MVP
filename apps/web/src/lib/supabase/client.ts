import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env";

/**
 * Browser client. Carries the publishable/anon key, so RLS applies to every
 * query exactly as it does on the server — the session is what changes which
 * rows the policies return, not which key is used.
 */
export function createClient() {
  const env = getPublicEnv();
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.supabaseKey);
}
