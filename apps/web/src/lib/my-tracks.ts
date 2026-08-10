import { describeSupabaseError } from "@/lib/supabase/errors";
import { createClient } from "@/lib/supabase/server";

/**
 * Everything of yours, in one place: tracks you are enrolled in, and courses
 * you have asked for.
 *
 * Distinct from getMySprint(), which answers "what is due this week" for the
 * one cohort you are currently running. This answers "what have I got going
 * on", which is a different question and has to cope with none, one, or
 * several — including the common early state of no enrolment and two requests.
 */

export type EnrolledTrack = {
  enrollmentId: string;
  slug: string | null;
  title: string;
  status: "active" | "withdrawn" | "completed";
  startsOn: string | null;
  endsOn: string | null;
};

export type MyRequest = {
  id: string;
  prompt: string;
  status: "new" | "triaged" | "writing" | "published" | "declined";
  createdAt: string;
};

export async function listMyTracks(): Promise<EnrolledTrack[]> {
  const supabase = await createClient();

  // RLS already scopes enrollments to the caller, so there is no user filter
  // here — the policy is the filter, and a second copy is a second thing to
  // get wrong.
  const { data, error } = await supabase
    .from("enrollments")
    .select("id, status, cohorts ( starts_on, ends_on, paths ( tracks ( slug, title ) ) )")
    .order("joined_at", { ascending: false });

  if (error) throw describeSupabaseError("loading your tracks", error);

  type Row = {
    id: string;
    status: EnrolledTrack["status"];
    cohorts: {
      starts_on: string | null;
      ends_on: string | null;
      paths: { tracks: { slug: string; title: string } | null } | null;
    } | null;
  };

  return ((data ?? []) as unknown as Row[]).map((e) => ({
    enrollmentId: e.id,
    slug: e.cohorts?.paths?.tracks?.slug ?? null,
    // A cohort whose track was unpublished still has to render as something.
    title: e.cohorts?.paths?.tracks?.title ?? "Your track",
    status: e.status,
    startsOn: e.cohorts?.starts_on ?? null,
    endsOn: e.cohorts?.ends_on ?? null,
  }));
}

/**
 * Your course requests.
 *
 * Server-side and account-scoped, unlike the client component on /learn which
 * also has to cope with a browser key. Signed in, the account is the better
 * handle and the only one that follows you between devices — so this passes no
 * key at all.
 */
export async function listMyRequests(): Promise<MyRequest[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("my_course_requests", {
    p_requester: null,
  });

  if (error) throw describeSupabaseError("loading your requests", error);

  type Row = { id: string; prompt: string; status: MyRequest["status"]; created_at: string };

  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    prompt: r.prompt,
    status: r.status,
    createdAt: r.created_at,
  }));
}
