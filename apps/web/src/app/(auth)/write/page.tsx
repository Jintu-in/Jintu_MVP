import type { Metadata } from "next";
import Link from "next/link";
import { WriteTrackForm } from "@/components/write-track-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Write a track",
  description:
    "Author a free community track on Jintu — checked by structure and by peers, never by a model.",
};

export const dynamic = "force-dynamic";

/**
 * Where a community track starts. Renders for everyone — the sign-in moment
 * is the submit button, not the URL, same as enrolling — and for a signed-in
 * author it also lists their unfinished tracks, because the cap is three and
 * the way past the cap is finishing one.
 */
export default async function WritePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS does the filtering: an author sees exactly their own unpublished
  // tracks and this query cannot be widened from here.
  const { data: mine } = user
    ? await supabase
        .from("tracks")
        .select("slug, title, is_published")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false })
    : { data: null };

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="text-3xl font-medium tracking-tight text-balance text-ink-900">
        Write a track
      </h1>
      <p className="mt-3 text-pretty text-ink-600">
        Community tracks are free and stay free. Yours is checked by structure
        and by peers — never by a model — and it publishes when it is finished,
        not when it is started.
      </p>

      <WriteTrackForm />

      {mine && mine.length > 0 ? (
        <section className="mt-12 border-t border-ink-100 pt-8">
          <h2 className="text-lg font-medium text-ink-900">Your tracks</h2>
          <ul className="mt-4 space-y-2">
            {mine.map((t) => (
              <li key={t.slug}>
                <Link
                  href={t.is_published ? `/learn/${t.slug}` : `/write/${t.slug}`}
                  className="group flex h-12 items-center justify-between gap-3 rounded-card border border-ink-100 bg-white px-4 hover:border-brand-600"
                >
                  <span className="min-w-0 truncate font-medium text-ink-800 group-hover:text-brand-800">
                    {t.title}
                  </span>
                  <span className="shrink-0 text-sm text-ink-500">
                    {t.is_published ? "Published" : "Keep writing →"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
