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
  // Supabase is migrating from JWT `anon` keys to `sb_publishable_…`. New
  // projects issue the latter and may have legacy keys disabled entirely, so
  // accept either and let the caller not care which one it got.
  supabaseKey: z.string().min(1),
});

/** Reject anything that would put an RLS-bypassing key in the browser. */
function assertNotASecretKey(name: string, value: string) {
  if (/^sb_secret_/.test(value)) {
    throw new Error(
      `${name} holds a Supabase SECRET key (sb_secret_…).\n\n` +
        `Secret keys bypass every RLS policy in the database, and anything\n` +
        `named NEXT_PUBLIC_* is inlined into the browser bundle. Use the\n` +
        `publishable key here and keep the secret one in a server-only\n` +
        `variable with no NEXT_PUBLIC_ prefix.`,
    );
  }
}

export function getPublicEnv() {
  // Referenced as literals on purpose: Next inlines NEXT_PUBLIC_* only at
  // literal `process.env.X` sites. Destructuring or dynamic lookup silently
  // yields undefined in the browser bundle.
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (publishable) assertNotASecretKey("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", publishable);
  if (anon) assertNotASecretKey("NEXT_PUBLIC_SUPABASE_ANON_KEY", anon);

  const raw: Record<string, string | undefined> = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    // Publishable wins: on a project that has both, the legacy JWT is the one
    // being retired.
    supabaseKey: publishable || anon,
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
    // `supabaseKey` is synthesised from two possible variables, so report the
    // names someone can actually set rather than the internal field name.
    const shown =
      name === "supabaseKey"
        ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)"
        : name;
    return value === undefined || value === ""
      ? `  - ${shown} is not set`
      : `  - ${shown}: ${issue.message}`;
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
      "The marketing pages at / and /privacy do not need this; only the",
      "signed-in pages talk to the database.",
    ].join("\n"),
  );
}

/**
 * Non-throwing view of the Supabase config, for the health endpoint.
 *
 * getPublicEnv throws, which is right for a page that cannot work without
 * configuration and wrong for the one endpoint whose job is to report that
 * configuration is missing. This lives here rather than in the route because
 * the eslint rule confines process.env reads to this module — and it caught
 * me putting them in the route, which is exactly what it is for.
 *
 * Returns presence and shape only. Never a value: the endpoint is public.
 */
export function getSupabaseEnvStatus() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    urlSet: Boolean(url),
    urlLooksLikeUrl: Boolean(url?.startsWith("https://") || url?.startsWith("http://127.0.0.1")),
    publishableSet: Boolean(publishable),
    anonSet: Boolean(anon),
    configured: Boolean(url && (publishable || anon)),
  };
}

/**
 * The service-role credentials, for work that cannot run as the signed-in
 * user: awarding points, maintaining streaks, writing link-check results.
 *
 * Absence is a supported state and returns null rather than throwing —
 * CI, a fresh clone and a preview deploy all run without it. Nothing here is
 * NEXT_PUBLIC_, and it must never become so: this key bypasses every RLS
 * policy in the database.
 */
export function getServiceEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Supabase issues `sb_secret_…` on new projects and the legacy JWT
  // service-role key on older ones. Take either.
  const secret =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secret) return null;
  return { url, secretKey: secret };
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

/**
 * The origin this deployment actually answers on.
 *
 * Everything canonical and social resolves against this: `<link rel=canonical>`,
 * `og:url`, and the absolute URLs Next builds for generated OG images.
 *
 * It used to be `new URL("https://jintu.in")`, hard-coded in the root layout,
 * and jintu.in does not resolve — verified, the connection fails. Every page
 * was therefore telling Google that the real version of itself lived at a
 * hostname with no DNS. A canonical pointing somewhere unreachable is worse
 * than no canonical at all, because the tag is an instruction, not a hint.
 *
 * NEXT_PUBLIC_SITE_URL was already in .env.example and on the checklist in
 * docs/DEPLOY.md. Nothing read it. This does.
 *
 * Must be present at BUILD time, not just runtime: static routes bake their
 * canonical during `next build`. See the note in docs/DEPLOY.md.
 *
 * Never throws on absence — unlike a missing database key, a missing origin
 * has a sane answer, and failing the build over a URL would be worse than
 * falling back.
 */
export function getSiteUrl(): URL {
  // Literal read, so Next inlines it. See the note in getPublicEnv.
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(configured);
    } catch {
      throw new Error(
        `NEXT_PUBLIC_SITE_URL is not a valid absolute URL: ${JSON.stringify(configured)}\n` +
          `It needs the scheme, e.g. https://jintu.in — not a bare hostname.`,
      );
    }
  }

  // Vercel sets this at build time. Deliberately not VERCEL_URL, which is the
  // per-deployment hostname and would make every preview claim to be the
  // canonical copy of the site.
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return new URL(`https://${production}`);

  // Local. OG tags have to be absolute to be testable at all, and a localhost
  // origin is at least true here.
  return new URL(`http://localhost:${process.env.PORT ?? 3000}`);
}
