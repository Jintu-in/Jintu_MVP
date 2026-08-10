import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Renamed from `middleware` in Next 16 — both the file and the export. The old
 * convention still runs and prints a deprecation warning on every `next dev`.
 *
 * The `edge` runtime is not available under `proxy`; it is Node, and not
 * configurable. That suits us: the session refresh talks to Supabase over
 * HTTP and needs nothing edge-specific.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image files. Running the session
     * refresh on /_next/static would add a round trip to every chunk request
     * for no benefit.
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
