import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * The OAuth return leg — AUTH.md v2's Google path lands here with a code,
 * and this exchanges it for a session cookie before sending the person back
 * to wherever they pressed the button.
 *
 * Email OTP never touches this route: the code is typed into the dialog and
 * verified in place. Only full-redirect providers need a return address.
 *
 * `next` is pinned to same-origin paths. An open redirect on the auth
 * callback is the classic way a phishing page borrows a real domain's
 * credibility, so anything absolute is dropped on the floor.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const rawNext = url.searchParams.get("next") ?? "/";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // Say it went wrong without saying anything usable to an attacker;
      // the person just tries the button again.
      return NextResponse.redirect(new URL("/?auth=failed", url.origin));
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
