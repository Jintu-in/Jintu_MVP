import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { safeNextPath } from "@jintu/contracts";
import { JoinForm } from "@/components/join-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * What went wrong, said in terms of what to do next.
 *
 * `otp_expired` is the one that will actually happen. A link in an email is a
 * single-use token, and Gmail's prefetcher and most corporate mail scanners
 * will spend it before the person taps it — so the link is dead on arrival
 * and the error says "expired" about something thirty seconds old. Saying so
 * is the difference between a student trying again and a student concluding
 * the product is broken.
 */
const AUTH_ERRORS: Record<string, string> = {
  otp_expired:
    "That link had already been used, or it expired. Ask for a new code below — and type the six digits rather than tapping the link, which mail apps sometimes open before you do.",
  access_denied: "That sign-in link is no longer valid. Ask for a new code below.",
  link: "That sign-in link did not work. Ask for a new code below.",
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  // typedRoutes cannot verify a route computed at runtime, so the cast is
  // unavoidable. It is sound because safeNextPath has already rejected
  // anything that is not a same-origin absolute path — see its tests.
  const target = safeNextPath(next) as Route;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(target);

  // Unknown codes fall back to a generic line rather than being echoed: the
  // value arrives in a URL a stranger can compose, and rendering it verbatim
  // is how someone gets a sentence of their choosing onto our sign-in page.
  const message = error ? (AUTH_ERRORS[error] ?? AUTH_ERRORS.access_denied) : null;

  return (
    <main className="mx-auto max-w-md px-5 py-10">
      {message ? (
        <p
          role="alert"
          className="mb-6 rounded-card border border-warn-600/20 bg-warn-600/10 px-4 py-3 text-pretty text-ink-800"
        >
          {message}
        </p>
      ) : null}
      <JoinForm next={target} />
    </main>
  );
}
