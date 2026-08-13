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
export async function createClient({ remember = true }: { remember?: boolean } = {}) {
  const env = getPublicEnv();
  const cookieStore = await cookies(); // async since Next 15

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.supabaseKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) =>
              // remember=false is "do not stay signed in on this device":
              // stripping maxAge/expires turns the auth cookies into session
              // cookies, which the browser drops when it closes. The default
              // is the long-lived cookie — AUTH.md: a habit product whose
              // sessions expire is a login screen with a roadmap attached.
              cookieStore.set(
                name,
                value,
                remember ? options : { ...options, maxAge: undefined, expires: undefined },
              ),
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
