import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * "Download everything" — and everything means everything.
 *
 * DPDP gives a person the right to what is held about them, and a summary
 * does not satisfy that. If a table holds a row about this account, its rows
 * are in this file, unaggregated, with their real timestamps.
 *
 * Read through the cookie client on purpose, so RLS is doing the scoping:
 * the export cannot leak somebody else's rows even if a filter here were
 * wrong, because the policies would return nothing.
 */
export const dynamic = "force-dynamic";

/**
 * Every table that holds something about a person, and what it is for.
 * Adding a user-scoped table without adding it here is a bug — the
 * completeness test in sandbox/export-completeness.test.mjs fails on it.
 */
const TABLES = [
  ["consents", "*", "Each purpose you agreed to, when, and when withdrawn."],
  ["activity_days", "*", "Every calendar day you completed something."],
  ["streaks", "*", "Your current, longest and total day counts."],
  ["node_progress", "*", "Every day you started or finished, and where you stopped."],
  ["point_events", "*", "Every point awarded, with its source and date."],
  ["review_cards", "*", "Your review cards and their scheduling."],
  ["saved_resources", "*", "Links you saved, and whether you have read them."],
  ["roadmap_enrollments", "*", "Roadmaps you joined."],
  ["notifications", "*", "Messages we queued or sent you."],
  ["reminder_prefs", "*", "Your reminder settings."],
  ["public_profiles", "*", "Your public handle and whether the page is on."],
] as const;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // 401 rather than a redirect: this is a file endpoint, and a browser
  // following a redirect here would download the sign-in page as JSON.
  if (!user) return new NextResponse("Sign in to download your data.", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const tables: Record<string, unknown> = {};
  for (const [table, columns] of TABLES) {
    const { data, error } = await supabase.from(table).select(columns);
    // A table that errors is reported in the file rather than omitted from
    // it: a silent gap in an export is indistinguishable from "we hold
    // nothing", and those are very different statements.
    tables[table] = error ? { error: error.message } : (data ?? []);
  }

  const { data: handleRow } = await supabase
    .from("public_profiles")
    .select("handle")
    .maybeSingle();

  const today = new Date().toISOString().slice(0, 10);
  const slug = handleRow?.handle ?? user.email?.split("@")[0]?.replace(/[^a-z0-9-]/gi, "") ?? "account";

  const body = {
    exported_at: new Date().toISOString(),
    what_this_is:
      "Everything Jintu holds about this account, straight from the database. Dates are ISO 8601 UTC unless the column is a calendar date.",
    account: {
      id: user.id,
      email: user.email ?? null,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at ?? null,
    },
    profile: profile ?? null,
    // What each key holds, so the file explains itself without our docs.
    contents: Object.fromEntries(TABLES.map(([t, , why]) => [t, why])),
    ...tables,
    not_held: {
      notes:
        "Notes and highlights are not stored yet — the feature does not exist, so there is nothing to export.",
    },
  };

  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="jintu-export-${slug}-${today}.json"`,
      // Never cached, anywhere: this is the most personal payload we serve.
      "cache-control": "no-store, max-age=0",
    },
  });
}
