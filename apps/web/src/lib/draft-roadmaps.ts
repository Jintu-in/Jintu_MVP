import "server-only";
import { cache } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getServiceEnv } from "@/lib/env";

/**
 * The one place anything reads a `draft` roadmap's existence — RLS hides
 * draft rows from the anon/authenticated reads the rest of lib/roadmaps.ts
 * uses (0034), on purpose, so a signed-out visitor can never learn a draft
 * roadmap exists through the ordinary catalogue queries. The holding page,
 * the catalogue's "Being rebuilt" card, and the draft-URL redirect all need
 * that one fact anyway (which slugs are currently draft, and their title),
 * so they share this single service-role read rather than each inventing
 * their own.
 *
 * Degrades to an empty list if the service key is not configured — the
 * catalogue and draft redirects simply behave as if nothing is draft,
 * which is the safe direction to fail in (a missing env var must never
 * start redirecting or hiding roadmaps that are actually open).
 */
export type DraftRoadmap = { id: string; slug: string; title: string };

/** One read per request, not per call site — three call sites in the same
 *  request (catalogue card, redirect check, holding page) share it.
 *  `cache()` memoizes per server request only, never across requests — a
 *  plain module-level variable would leak a stale list across users on a
 *  warm server instance, which a status check must never do. */
export const getDraftRoadmaps = cache(async (): Promise<DraftRoadmap[]> => {
  const env = getServiceEnv();
  if (!env) {
    // warn, not error: this runs on every /learn, /learn/[slug] and
    // /roles/[slug] page load, unlike auth-limits.ts's and requests.ts's
    // same-shaped checks, which only fire from a submitted action. An
    // error here would fail e2e/smoke's "no console errors" check on
    // every anonymous page view in any environment without the key set —
    // including this repo's own local dev and CI, which don't set it.
    console.warn("[draft-roadmaps] SUPABASE_SECRET_KEY missing — treating every roadmap as open");
    return [];
  }
  const admin = createSupabaseClient(env.url, env.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await admin.from("roadmaps").select("id, slug, title").eq("status", "draft");
  if (error) {
    console.error("[draft-roadmaps] read failed", error.code, error.message);
    return [];
  }
  return data ?? [];
});
