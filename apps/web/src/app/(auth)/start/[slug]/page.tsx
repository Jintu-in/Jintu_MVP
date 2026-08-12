import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Starting…",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * /start/[slug] — the curriculum page's "Start unit NN" target.
 *
 * Not a page so much as a door: signed out goes to /join with the way back,
 * signed in starts the track through the same start_track() gates as the
 * button on the track page (18+ profile, published, idempotent restart) and
 * lands on the dashboard where the work is. The ?unit param rides along so
 * the dashboard can deep-link the week later; it is not trusted for anything.
 */
export default async function StartPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ unit?: string }>;
}) {
  const [{ slug }, { unit }] = await Promise.all([params, searchParams]);
  const next = `/start/${slug}${unit ? `?unit=${encodeURIComponent(unit)}` : ""}`;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/join?next=${encodeURIComponent(next)}`);

  const { error } = await supabase.rpc("start_track", { p_slug: slug });

  if (error?.code === "P0002") redirect(`/onboarding?next=${encodeURIComponent(next)}`);
  if (error?.code === "P0001") redirect(`/learn/${slug}`); // not startable; the page explains itself
  if (error) {
    // Anything else is ours. The track page renders fine and its start
    // button surfaces real messages; a broken door should not trap anyone.
    console.error("[start]", slug, error.code, error.message);
    redirect(`/learn/${slug}`);
  }

  redirect("/dashboard");
}
