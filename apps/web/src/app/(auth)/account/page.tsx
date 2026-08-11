import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { OptionalPurpose } from "@jintu/contracts";
import { signOut } from "@/actions/auth";
import { ConsentToggle } from "@/components/consent-toggle";
import { PasswordForm } from "@/components/password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const PURPOSES: { name: OptionalPurpose; label: string; detail: string }[] = [
  {
    name: "whatsapp_updates",
    label: "WhatsApp reminders",
    detail: "Deadlines, missed submissions, peer reviews waiting on you.",
  },
  {
    name: "analytics",
    label: "Product analytics",
    detail: "How you move through the app, so we can fix what is confusing.",
  },
  {
    name: "public_profile",
    label: "Public proof-of-readiness profile",
    detail: "A shareable page at jintu.in/p/… . Off unless you turn it on.",
  },
];

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, batch_year")
    .eq("id", user.id)
    .maybeSingle();

  // No profile means the 18+ confirmation was never given, so there is no
  // account to show yet.
  if (!profile) redirect("/onboarding");

  // Live consents only: a withdrawn row stays in the table as evidence, but it
  // is not a current permission.
  const { data: consents } = await supabase
    .from("consents")
    .select("purpose, notice_version, granted_at")
    .is("withdrawn_at", null);

  const hasPassword = Boolean(user.user_metadata?.has_password);

  const live = new Set((consents ?? []).map((c) => c.purpose as string));
  const noticeVersion = consents?.[0]?.notice_version ?? null;

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-2xl font-medium text-ink-900">
          {profile.full_name ?? "Your account"}
        </h1>
        <form action={signOut}>
          <button type="submit" className="text-sm text-ink-500 underline hover:text-ink-900">
            Sign out
          </button>
        </form>
      </div>
      <p className="mt-1 font-mono text-sm text-ink-500">{profile.phone}</p>

      <section className="mt-10" aria-labelledby="consents">
        <h2 id="consents" className="text-lg font-medium text-ink-900">
          What you have agreed to
        </h2>
        <p className="mt-1 text-pretty text-ink-600">
          Turning something off takes effect immediately. We keep a record that
          you had agreed, and when you changed your mind — that record is how we
          can show we had your permission at the time, and it is not a permission
          itself.
        </p>

        <div className="mt-4 divide-y divide-ink-100 border-y border-ink-100">
          {PURPOSES.map((p) => (
            <ConsentToggle
              key={p.name}
              purpose={p.name}
              label={p.label}
              detail={p.detail}
              granted={live.has(p.name)}
            />
          ))}
        </div>

        <p className="mt-4 text-sm text-ink-500">
          Running the sprint itself — enrolment, submissions, grading, peer
          review — is not on this list because it is what the account is for,
          not an extra you can switch off. Closing the account is how you stop
          that.{" "}
          {noticeVersion ? (
            <>
              Your choices were recorded against privacy notice{" "}
              <code className="font-mono">{noticeVersion}</code>.
            </>
          ) : null}
        </p>
      </section>

      <section className="mt-10" aria-labelledby="password">
        <h2 id="password" className="text-lg font-medium text-ink-900">
          How you sign in
        </h2>
        <p className="mt-1 max-w-[62ch] text-pretty text-ink-600">
          We email you a six-digit code, and that will always work. Setting a
          password is optional — it just saves waiting for an email every time,
          which matters on a slow connection or a second device. Forget it and
          you ask for a code, so there is nothing to reset.
        </p>
        <PasswordForm hasPassword={hasPassword} />
      </section>

      <section
        className="mt-10 rounded-card border border-ink-100 bg-white p-6"
        aria-labelledby="rights"
      >
        <h2 id="rights" className="font-medium text-ink-900">
          Your data
        </h2>
        <p className="mt-2 text-pretty text-ink-600">
          You can ask for a copy of everything we hold, ask us to correct it, or
          ask us to delete it. Write to{" "}
          <a className="underline hover:text-brand-800" href="mailto:privacy@jintu.in">
            privacy@jintu.in
          </a>
          . The{" "}
          <Link href="/privacy" className="underline hover:text-brand-800">
            privacy notice
          </Link>{" "}
          explains what we keep and for how long.
        </p>
      </section>
    </main>
  );
}
