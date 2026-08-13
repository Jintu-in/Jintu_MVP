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

  /**
   * One representative table per migration, not just the first one.
   *
   * An earlier version probed one table alone and reported a healthy database
   * while the deployment was two migrations behind — pages were returning
   * 500 and this endpoint said ok. A health check that goes green on a
   * half-applied schema is worse than none, because it is the thing you check
   * before concluding the problem is elsewhere.
   */
  const EXPECTED = [
    { table: "profiles", migration: "0001_identity" },
    { table: "roadmaps", migration: "0002_roadmaps" },
    { table: "node_progress", migration: "0003_progress" },
    { table: "point_events", migration: "0004_engagement" },
  ] as const;

  if (env.configured) {
    try {
      const supabase = createPublicClient();

      // A real GET, not { head: true }. A HEAD response has no body, so
      // PostgREST's PGRST205 code never reaches the client and a missing
      // table comes back looking like an empty one — which is how the first
      // version of this reported four healthy tables while three of them did
      // not exist. `limit(0)` keeps it cheap and reads nobody's data.
      const results = await Promise.all(
        EXPECTED.map(async (e) => {
          const { error } = await supabase.from(e.table).select("*").limit(0);
          const absent = error?.code === "PGRST205" || error?.code === "42P01";
          return { ...e, absent, error: absent ? null : (error ?? null) };
        }),
      );

      const missing = results.filter((r) => r.absent);
      const failed = results.filter((r) => r.error);

      checks.push({
        name: "database",
        ok: missing.length === 0 && failed.length === 0,
        detail: missing.length
          ? `reachable, but ${missing.length} of ${EXPECTED.length} expected tables are absent — ` +
            `the ${[...new Set(missing.map((m) => m.migration))].join(", ")} migration(s) ` +
            `have not been applied to this project`
          : failed.length
            ? `query failed: ${failed[0]?.error?.code ?? "?"} ${failed[0]?.error?.message ?? ""}`
            : `reachable, all ${EXPECTED.length} expected tables present`,
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
