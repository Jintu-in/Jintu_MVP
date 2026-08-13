import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { createClient } from "@/lib/supabase/server";

/**
 * Where the emailed reset link lands (AUTH.md, screen 4).
 *
 * The link established a recovery session before this page rendered — the
 * confirm route exchanged the token for cookies. If there is no session the
 * link was expired, already spent, or prefetched to death by a mail scanner,
 * and the only honest offer is a fresh one.
 */
export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ResetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-md px-5 py-10">
      {user ? (
        <ResetPasswordForm />
      ) : (
        <>
          <h1 className="text-2xl font-medium tracking-tight text-ink-900">
            That link has expired
          </h1>
          <p className="mt-2 text-pretty text-ink-600">
            Reset links work once and last an hour — and some mail apps open
            them before you do. Ask for a new one from the sign-in screen and
            use the freshest email.
          </p>
          <a
            href="/join"
            className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand-700 px-6 font-medium text-white hover:bg-brand-800"
          >
            Back to sign in
          </a>
        </>
      )}
    </main>
  );
}
