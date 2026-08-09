import { createPublicClient } from "@/lib/supabase/public";
import { describeSupabaseError } from "@/lib/supabase/errors";

/**
 * The public proof-of-readiness profile.
 *
 * Everything here is reachable with the anon key, and that is deliberate — a
 * profile nobody can open is not proof of anything. What makes it safe is
 * that RLS only exposes rows for a profile the student has switched to
 * public: there is no `visibility` filter in the queries below, because the
 * policy is the filter and a second copy of the rule is a second thing to get
 * wrong.
 *
 * Submissions are NOT here. The student agreed to publish a score and its
 * breakdown, not their coursework.
 */

export type ReadinessBreakdown = Record<string, number>;

export type PublicProfile = {
  slug: string;
  headline: string | null;
  publishedAt: string | null;
  fullName: string | null;
  trackTitle: string | null;
  overall: number | null;
  breakdown: ReadinessBreakdown;
};

export async function getPublicProfile(slug: string): Promise<PublicProfile | null> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from("public_profiles")
    .select("slug, headline, published_at, enrollment_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw describeSupabaseError("looking up the profile", error);
  if (!data) return null;

  // Separate query rather than a nested select: enrollments and profiles are
  // author-only under RLS, so embedding them would return null and quietly
  // render a blank profile. Only readiness has a public-profile policy.
  const { data: readiness, error: readinessError } = await supabase
    .from("readiness_scores")
    .select("overall, breakdown")
    .eq("enrollment_id", data.enrollment_id)
    .order("computed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (readinessError) {
    throw describeSupabaseError("loading the readiness score", readinessError);
  }

  return {
    slug: data.slug,
    headline: data.headline,
    publishedAt: data.published_at,
    // Reserved for when a name is explicitly consented for publication; the
    // profiles table is author-only, so this is null today rather than a leak
    // waiting to be noticed.
    fullName: null,
    trackTitle: null,
    overall: readiness?.overall ?? null,
    breakdown: (readiness?.breakdown ?? {}) as ReadinessBreakdown,
  };
}
