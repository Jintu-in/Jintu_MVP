import { z } from "zod";

/**
 * The one sanctioned reader of process.env — the eslint rule in
 * @jintu/config/eslint/next blocks bare reads everywhere else, because that
 * is the path by which SUPABASE_SERVICE_ROLE_KEY ends up in a client bundle.
 *
 * Validation is deliberately lazy. Doing it at module scope would run during
 * `next build`, where these variables are legitimately absent in CI, and turn
 * a missing secret into a broken build rather than a clear runtime error.
 */

const publicEnv = z.object({
  // Messages omit the variable name: the formatter below prepends it, and
  // repeating it reads as "FOO: FOO must be ...".
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1)
    .refine((v) => v.startsWith("https://") || v.startsWith("http://127.0.0.1"), {
      message:
        "must be your project URL, e.g. https://abcdefgh.supabase.co (or http://127.0.0.1:54321 for local Supabase)",
    }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export function getPublicEnv() {
  // Referenced as literals on purpose: Next inlines NEXT_PUBLIC_* only at
  // literal `process.env.X` sites. Destructuring or dynamic lookup silently
  // yields undefined in the browser bundle.
  const raw: Record<string, string | undefined> = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const parsed = publicEnv.safeParse(raw);
  if (parsed.success) return parsed.data;

  // Name the variable. Zod's type check fires before any custom message, so
  // a missing var reports as "expected string, received undefined" with no
  // clue which one — which is useless at 1am and is the whole reason this
  // function exists instead of reading process.env inline.
  const lines = parsed.error.issues.map((issue) => {
    const name = String(issue.path[0] ?? "(unknown)");
    const value = raw[name];
    return value === undefined || value === ""
      ? `  - ${name} is not set`
      : `  - ${name}: ${issue.message}`;
  });

  throw new Error(
    [
      "Supabase is not configured, so this page cannot load data.",
      "",
      ...lines,
      "",
      "Fix: cp apps/web/.env.example apps/web/.env.local  — then fill in the",
      "two values from your Supabase project under Settings > API (Project URL",
      "and the anon public key) and restart the dev server; Next reads env",
      "files once at boot.",
      "",
      "The file must sit in apps/web, next to next.config.ts. Next loads env",
      "files from the app directory — one at the monorepo root is read by",
      "nothing.",
      "",
      "The marketing pages at / and /privacy do not need this; only /learn",
      "and the waitlist form talk to the database.",
    ].join("\n"),
  );
}

/**
 * Observability config. Unlike Supabase, every one of these is optional and
 * absence is a supported state — Sentry and PostHog are simply off. Returning
 * undefined rather than throwing is what lets the app run locally, and in CI,
 * with no accounts at all.
 */
export function getObservabilityEnv() {
  return {
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
    posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || undefined,
    posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
  };
}
