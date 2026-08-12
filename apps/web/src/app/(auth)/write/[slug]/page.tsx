import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { OutlineEditor } from "@/components/outline-editor";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit your track",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * The outline editor for one of the author's own unpublished tracks.
 *
 * Everything here reads through the session client, so RLS answers the only
 * question that matters: is this yours and still unpublished? Someone else's
 * slug, a published track, a typo — all of them are the same 404, which is
 * exactly what set_community_outline() would say anyway.
 */
export default async function EditTrackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/join?next=/write/${slug}`);

  const { data: track } = await supabase
    .from("tracks")
    .select("id, slug, title, summary, is_published, author_id")
    .eq("slug", slug)
    .eq("author_id", user.id)
    .maybeSingle();
  if (!track || track.is_published) notFound();

  const { data: path } = await supabase
    .from("paths")
    .select("id")
    .eq("track_id", track.id)
    .eq("status", "draft")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: modules } = path
    ? await supabase
        .from("modules")
        .select("title, objective, week_no")
        .eq("path_id", path.id)
        .order("week_no", { ascending: true })
    : { data: [] };

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        Your track · unpublished
      </p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-balance text-ink-900">
        {track.title}
      </h1>
      <p className="mt-3 text-pretty text-ink-600">{track.summary}</p>

      <h2 className="mt-10 text-lg font-medium text-ink-900">The outline</h2>
      <p className="mt-2 text-sm text-pretty text-ink-600">
        One row per week: what it is called, and what someone can do after it.
        Up to twelve. We review it with you before it publishes.
      </p>

      <OutlineEditor
        slug={track.slug}
        initial={(modules ?? []).map((m) => ({ title: m.title, objective: m.objective }))}
      />
    </main>
  );
}
