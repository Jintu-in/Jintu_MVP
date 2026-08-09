import { NextResponse } from "next/server";
import { getSupabaseEnvStatus } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Deployment self-diagnosis.
 *
 * The failure this exists for: /learn returns 500 while / and /pricing return
 * 200, which reads like a routing bug and is actually a missing environment
 * variable. In production React hides the real message on purpose, so all the
 * visitor sees is a digest and all the operator can do is dig through platform
 * logs.
 *
 * Reports presence, never values. A boolean cannot leak a key, and the whole
 * point is that this can be safe to hit from anywhere — a diagnostic you need
 * credentials to reach is no use during the incident where you cannot log in.
 *
 * Deliberately NOT included: whether the SECRET key is set. That variable is
 * server-only and confirming its presence from an unauthenticated endpoint
 * tells an attacker the service role is configured and worth hunting for.
 */
export const dynamic = "force-dynamic";

type Check = { name: string; ok: boolean; detail: string };

export async function GET() {
  const checks: Check[] = [];

  const env = getSupabaseEnvStatus();

  checks.push({
    name: "NEXT_PUBLIC_SUPABASE_URL",
    ok: env.urlSet && env.urlLooksLikeUrl,
    detail: !env.urlSet
      ? "not set"
      : env.urlLooksLikeUrl
        ? "set"
        : "set, but is not a URL — did you paste the project ref instead of https://<ref>.supabase.co?",
  });

  checks.push({
    name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ok: env.publishableSet || env.anonSet,
    detail: env.publishableSet
      ? "publishable key set"
      : env.anonSet
        ? "legacy anon key set"
        : "neither is set — note the NEXT_PUBLIC_ prefix; a bare SUPABASE_PUBLISHABLE_KEY is invisible to the browser and to the build",
  });

  // Only worth trying if there is something to try with.
  if (env.configured) {
    try {
      const supabase = createPublicClient();
      const { error } = await supabase.from("tracks").select("slug").limit(1);
      checks.push({
        name: "database",
        ok: !error,
        detail: error
          ? error.code === "PGRST205" || error.code === "42P01"
            ? "reachable, but the tables do not exist — migrations have not been applied"
            : `query failed: ${error.code ?? "?"} ${error.message}`
          : "reachable, curriculum readable by anon",
      });
    } catch (e) {
      checks.push({
        name: "database",
        ok: false,
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const ok = checks.every((c) => c.ok);

  return NextResponse.json(
    { ok, checks },
    {
      // 503 when broken, so uptime monitoring notices without parsing a body.
      status: ok ? 200 : 503,
      headers: { "cache-control": "no-store" },
    },
  );
}
