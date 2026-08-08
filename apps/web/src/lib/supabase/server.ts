import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicEnv } from "@/lib/env";

/**
 * Server-side Supabase client carrying the ANON key, so every query is
 * subject to RLS. Nothing here can read a table the policies do not allow.
 *
 * The service-role key bypasses RLS entirely and must never be used from a
 * request path that a user can reach — it belongs in edge functions and
 * audited ops routes only.
 */
export async function createClient() {
  const env = getPublicEnv();
  const cookieStore = await cookies(); // async since Next 15

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Middleware refreshes the session instead.
          }
        },
      },
    },
  );
}
