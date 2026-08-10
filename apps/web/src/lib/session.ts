import { createClient } from "@/lib/supabase/server";

/**
 * Who is looking at this page.
 *
 * Read once per request in a layout, so the header is correct in the HTML that
 * arrives rather than corrected after hydration. That choice is what makes the
 * marketing routes render per-request instead of being prerendered — see the
 * note in (marketing)/layout.tsx, which is where the cost lands.
 *
 * getUser(), never getSession(): getSession reads the cookie and trusts it,
 * which is fine in the browser and worthless on the server, because the cookie
 * is exactly the thing an attacker controls. getUser() verifies with the auth
 * server.
 */

export type Viewer = {
  id: string;
  email: string | null;
  fullName: string | null;
  /**
   * False while someone has authenticated but not yet completed onboarding.
   * They have no profiles row, which under Law 3 means they have not confirmed
   * being 18 — so they are signed in without being a user of anything yet, and
   * the UI must not offer them the account it implies.
   */
  hasProfile: boolean;
};

export async function getViewer(): Promise<Viewer | null> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // maybeSingle, not single: no row is the normal mid-onboarding state, and
    // single() would throw on it.
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    return {
      id: user.id,
      email: user.email ?? null,
      fullName: profile?.full_name ?? null,
      hasProfile: Boolean(profile),
    };
  } catch (error) {
    /*
      Never take a page down over the header.

      This is called from the layout wrapping / and /privacy, which are
      documented as working without a database — the "Supabase is not
      configured" error even says so. Letting it throw here made that false:
      an unconfigured or unreachable Supabase would 500 the landing page and
      the privacy notice, which is a worse outcome than a header that says
      "Sign in".

      Degrading to signed-out is safe in the direction that matters — it shows
      less, never more, and it is not a security boundary. Every protected
      route calls getUser() itself and redirects; this only decides which
      button to paint.

      Logged rather than swallowed, because the failure mode otherwise is
      silent: signed-in people would see "Sign in" everywhere with nothing
      anywhere saying why.
    */
    console.error("[session] could not resolve the viewer, rendering as signed out:", error);
    return null;
  }
}

/**
 * Two letters for the avatar.
 *
 * Names here are Indian and frequently mononymous, so "first initial + last
 * initial" cannot be assumed — Nandini with no surname must not render a blank
 * circle. One word gives one letter.
 *
 * Falls back to the email local part, then to a glyph the component draws
 * instead. Never falls back to the phone number: a header is a shoulder-surfable
 * surface and a contact number is not something to paint on it.
 */
export function initialsFor(viewer: Pick<Viewer, "fullName" | "email">): string | null {
  const name = viewer.fullName?.trim();
  if (name) {
    const words = name.split(/\s+/).filter(Boolean);
    const letters = [words[0], words.length > 1 ? words[words.length - 1] : undefined]
      .filter(Boolean)
      .map((w) => [...w!][0]!)
      .join("");
    if (letters) return letters.toUpperCase();
  }

  const local = viewer.email?.split("@")[0]?.trim();
  // [...str] rather than str[0]: a name or address can begin with a character
  // outside the BMP, and indexing would slice it in half.
  if (local) return [...local][0]!.toUpperCase();

  return null;
}
