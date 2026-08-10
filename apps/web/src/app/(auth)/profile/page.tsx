import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";
import { initialsFor } from "@/lib/session";
import { getMySprint } from "@/lib/sprint";
import { createClient } from "@/lib/supabase/server";

/**
 * Who you are, as we hold it.
 *
 * Distinct from the two pages either side of it, and the split is worth
 * stating because three pages about "you" invites a fourth by accident:
 *
 *   /profile   what we store about you, and the ones you can correct
 *   /account   what you have agreed to, and how to get it all back or deleted
 *   /dashboard the work due this week
 *
 * noindex, like every page in this group. It renders a name and a phone
 * number.
 */
export const metadata: Metadata = {
  title: "Your profile",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join?next=/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, batch_year, created_at")
    .eq("id", user.id)
    .maybeSingle();

  // No profile means the 18+ confirmation was never given, so there is nothing
  // to show and nothing we are permitted to hold. Same gate as /account.
  if (!profile) redirect("/onboarding");

  // Not enrolled is a normal state during the concierge phase, so this is
  // allowed to be null rather than treated as an error.
  const sprint = await getMySprint();

  const initials = initialsFor({ fullName: profile.full_name, email: user.email ?? null });

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex items-center gap-4">
        <div
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-700 text-lg font-medium text-white"
        >
          {initials ?? "—"}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-medium text-ink-900">
            {profile.full_name ?? "Your profile"}
          </h1>
          {user.email ? (
            <p className="truncate text-sm text-ink-500">{user.email}</p>
          ) : null}
        </div>
      </div>

      <section className="mt-10" aria-labelledby="details">
        <h2 id="details" className="text-lg font-medium text-ink-900">
          Your details
        </h2>
        <p className="mt-1 text-pretty text-ink-600">
          If any of this is wrong, change it here — you should not have to email
          us to fix a spelling.
        </p>

        <ProfileForm fullName={profile.full_name} batchYear={profile.batch_year} />
      </section>

      <section className="mt-10" aria-labelledby="identity">
        <h2 id="identity" className="text-lg font-medium text-ink-900">
          How you sign in
        </h2>
        <dl className="mt-4 divide-y divide-ink-100 border-y border-ink-100 text-sm">
          <Row label="Email">{user.email ?? "—"}</Row>
          <Row label="Mobile">{profile.phone}</Row>
        </dl>
        {/*
          Not editable on this form on purpose. Phone is unique across
          profiles and email is the sign-in credential, so changing either is a
          verification flow, not a text box — and a text box that silently
          failed the uniqueness check would be worse than no field at all.
        */}
        <p className="mt-3 text-sm text-pretty text-ink-500">
          Changing either of these means proving you still have it, so write to{" "}
          <a className="underline hover:text-brand-800" href="mailto:privacy@jintu.in">
            privacy@jintu.in
          </a>{" "}
          and we will do it with you.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="cohort">
        <h2 id="cohort" className="text-lg font-medium text-ink-900">
          Your cohort
        </h2>
        {sprint ? (
          <div className="mt-4 rounded-card border border-ink-100 bg-white p-5">
            <p className="font-medium text-ink-900">{sprint.trackTitle}</p>
            <Link
              href="/dashboard"
              className="mt-3 inline-block text-sm text-brand-800 underline hover:text-brand-900"
            >
              Go to this week&rsquo;s work
            </Link>
          </div>
        ) : (
          <div className="mt-4 rounded-card border border-ink-100 bg-ink-50 p-5">
            <p className="text-pretty text-ink-700">
              You are not in a cohort yet. The curriculum is free to work
              through on your own in the meantime, and nothing in it is held
              back for paying students.
            </p>
            <Link
              href="/learn"
              className="mt-3 inline-block text-sm text-brand-800 underline hover:text-brand-900"
            >
              Read the curriculum
            </Link>
          </div>
        )}
      </section>

      <section className="mt-10 rounded-card border border-ink-100 bg-white p-6" aria-labelledby="more">
        <h2 id="more" className="font-medium text-ink-900">
          Consents, and getting your data back
        </h2>
        <p className="mt-2 text-pretty text-ink-600">
          What you have agreed to — WhatsApp reminders, analytics, your public
          profile — lives on the{" "}
          <Link href="/account" className="underline hover:text-brand-800">
            account page
          </Link>
          , along with how to ask for a copy of everything we hold or have it
          deleted.
        </p>
      </section>
    </main>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-ink-500">{label}</dt>
      <dd className="truncate font-mono text-ink-800">{children}</dd>
    </div>
  );
}
