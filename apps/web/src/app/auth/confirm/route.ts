import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@jintu/contracts";
import { createClient } from "@/lib/supabase/server";

/**
 * Where the "sign in with one tap" link in the email lands.
 *
 * The six-digit code is the main path and this is the second one, for the
 * phone that makes copying six digits out of an email harder than tapping a
 * link. Both verify the same token; only the delivery differs.
 *
 * Why a route handler and not the stock `{{ .ConfirmationURL }}`: that URL
 * points at Supabase's own /auth/v1/verify, which redirects back with the
 * session in the URL *fragment*, and a fragment is never sent to a server. On
 * an app whose session lives in cookies set by @supabase/ssr, that flow ends
 * with a signed-in browser and a server that has no idea. Exchanging the
 * token_hash here instead means the cookie is set before anything renders.
 *
 * ARCHITECTURE.md §1 rules out ad-hoc API routes in favour of server actions,
 * and this is the exception the rule allows for: a GET arriving from an email
 * client is not something a server action can receive.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Same open-redirect guard as the sign-in page. This one matters more, not
  // less: the link is in an email, so the URL is attacker-composable and
  // arrives somewhere a user has been trained to click.
  const next = safeNextPath(searchParams.get("next") ?? undefined, "/dashboard");

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/join?error=link", request.url));
  }

  const supabase = await createClient();
  // The type is in the link, because the template that wrote it knew which
  // email it was. That is the one advantage this route has over the code
  // path, which has to try both — see verifyOtp in actions/auth.ts.
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error) {
    // A link that is expired, already used, or simply wrong all land here, and
    // all three have the same remedy: ask for another code. Saying which one
    // it was would tell someone holding a stolen link whether it is still live.
    return NextResponse.redirect(new URL("/join?error=link", request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
