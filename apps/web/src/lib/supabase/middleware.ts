import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv } from "@/lib/env";

/**
 * Routes that require a session. Everything else is public.
 *
 * This list is a redirect, not the access control — every page behind it also
 * checks `getUser()`, and RLS decides what any of them can read. Its job is to
 * send someone to sign-in instead of showing them an empty page.
 */
const PROTECTED = ["/onboarding", "/account", "/profile"];

/**
 * Refreshes the auth session on every request and gates the private routes.
 *
 * The refresh has to happen in middleware rather than in a page: Server
 * Components cannot set cookies, so a token that expires mid-session would
 * never be renewed and the user would be logged out at an arbitrary moment.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  let env;
  try {
    env = getPublicEnv();
  } catch {
    // Not configured — every Supabase-backed page will say so itself with a
    // useful message. Failing here would take the static marketing pages down
    // with it, and those work fine without a database.
    return response;
  }

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser, never getSession: getSession reads the cookie and trusts it,
  // which is worthless as an authorisation check because the cookie is
  // attacker-controlled. getUser verifies the token with the auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, searchParams } = request.nextUrl;

  // Supabase redirects auth failures to site_url with the reason in the query
  // string — so a dead sign-in link lands a student on the marketing page,
  // which renders a sales pitch and says nothing about what just happened.
  // The message belongs where they can act on it.
  //
  // Not on /join already, or this redirects to itself forever.
  const authError = searchParams.get("error_code") ?? searchParams.get("error");
  if (authError && pathname !== "/join") {
    const url = request.nextUrl.clone();
    url.pathname = "/join";
    url.search = "";
    url.searchParams.set("error", authError);
    return NextResponse.redirect(url);
  }

  const needsAuth = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (needsAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/join";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
