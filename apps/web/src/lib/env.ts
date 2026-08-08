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
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_URL is not set")
    .refine((v) => v.startsWith("https://") || v.startsWith("http://127.0.0.1"), {
      message: "NEXT_PUBLIC_SUPABASE_URL must be an https URL (or local Supabase)",
    }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"),
});

export function getPublicEnv() {
  // Referenced as literals on purpose: Next inlines NEXT_PUBLIC_* only at
  // literal `process.env.X` sites. Destructuring or dynamic lookup silently
  // yields undefined in the browser bundle.
  const parsed = publicEnv.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      `Environment is not configured:\n` +
        parsed.error.issues.map((i) => `  - ${i.message}`).join("\n") +
        `\nCopy .env.example to .env.local and fill it in.`,
    );
  }

  return parsed.data;
}
