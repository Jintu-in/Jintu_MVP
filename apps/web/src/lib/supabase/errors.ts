import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Turns a Postgres/PostgREST error into something that says what to do next.
 *
 * "Could not find the table 'public.tracks' in the schema cache" is a precise
 * and completely unactionable sentence for someone who has just cloned the
 * repo. The cause is almost always that migrations have not been applied, and
 * the fix is one command — so say the command.
 */
export function describeSupabaseError(context: string, error: PostgrestError): Error {
  const code = error.code ?? "";

  // No code means the request never reached PostgREST — DNS, TLS, a dropped
  // socket. "listing published tracks failed [no code]: TypeError: fetch
  // failed" is technically accurate and tells an operator nothing about where
  // to look, so say which layer broke.
  if (!code && /fetch failed|network|ECONN|ETIMEDOUT|EAI_AGAIN|socket hang up|terminated/i.test(error.message ?? "")) {
    return new Error(
      `Could not reach the database while ${context}. This is a network ` +
        `failure between the server and Supabase, not a bad query — the ` +
        `request never arrived. Already retried. Check Supabase status and ` +
        `outbound connectivity from the host.\n\nUnderlying: ${error.message}`,
    );
  }

  // PGRST205: PostgREST cannot see the table. 42P01: Postgres says it does
  // not exist. PGRST202: same, for a function — an RPC added by a migration
  // nobody applied. All three mean the same thing in practice here, and the
  // fix is the same command.
  if (code === "PGRST205" || code === "42P01" || code === "PGRST202") {
    return new Error(
      [
        `The database is missing something this needs, so ${context} failed.`,
        "",
        "Apply the migrations, either:",
        "  pnpm supabase login && pnpm supabase link --project-ref <ref> && pnpm db:push",
        "",
        "or, without the CLI:",
        "  pnpm db:bundle --seed",
        "  then paste supabase/.bundle/apply-all.sql into the Supabase",
        "  dashboard SQL editor and run it.",
        "",
        `Postgres said: ${error.message}`,
      ].join("\n"),
    );
  }

  // The published curriculum is anon-readable by policy. An empty result is
  // normal; a permission error means a policy regressed.
  if (code === "42501") {
    return new Error(
      `${context} was refused by row-level security. The published curriculum ` +
        `is meant to be readable by anon — check the policies in ` +
        `supabase/migrations. Postgres said: ${error.message}`,
    );
  }

  return new Error(`${context} failed [${code || "no code"}]: ${error.message}`);
}
