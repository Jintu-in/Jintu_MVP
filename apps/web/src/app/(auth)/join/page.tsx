import type { Metadata, Route } from "next";
import { redirect } from "next/navigation";
import { safeNextPath } from "@jintu/contracts";
import { JoinForm } from "@/components/join-form";
import { getViewer } from "@/lib/session";

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

  // getViewer(), not a direct createClient()+getUser() call: this page is
  // reachable signed out with no Supabase configured at all (the e2e smoke
  // suite loads it that way on purpose — see smoke.spec.ts), and a raw
  // getUser() call here throws uncaught in that case, 500ing the sign-in
  // page itself. getViewer() already degrades to "signed out" for exactly
  // this condition (see its own comment in lib/session.ts).
  const viewer = await getViewer();
  if (viewer) redirect(target);

  // Unknown codes fall back to a generic line rather than being echoed: the
  // value arrives in a URL a stranger can compose, and rendering it verbatim
  // is how someone gets a sentence of their choosing onto our sign-in page.
  const message = error ? (AUTH_ERRORS[error] ?? AUTH_ERRORS.access_denied) : null;

  return (
    <main className="mx-auto max-w-md px-5 py-10 sm:py-14">
      {message ? (
        <p role="alert" className="mb-6 rounded-2xl bg-warn-bg px-4 py-3.5 text-[14.5px] text-pretty text-warn-700">
          {message}
        </p>
      ) : null}
      <JoinForm next={target} />
    </main>
  );
}
