# Deploying

## Environment variables on Vercel

`.env.local` is gitignored, so **the deployment has none of your values**. This
is the correct arrangement and also the thing that breaks the first deploy:
pages that touch Supabase return 500 while every static page looks fine, which
reads like a routing bug rather than missing configuration.

The symptom is React error **#441** in the browser console — "an error occurred
in the Server Components render, the specific message is omitted in production
builds". The message is hidden on purpose; the real one is in the Vercel
function logs against the `digest` shown on the error page.

Set these in **Vercel → Project → Settings → Environment Variables**, for
Production, Preview and Development:

| Variable | Where it comes from | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API keys | one of these two |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | legacy JWT key, if your project still issues one | one of these two |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry project settings | no — off if absent |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project settings | no — off if absent |
| `NEXT_PUBLIC_POSTHOG_HOST` | e.g. `https://eu.i.posthog.com` | no |

**Never set `SUPABASE_SECRET_KEY` (or the old `service_role`) with a
`NEXT_PUBLIC_` prefix.** It bypasses every RLS policy and `NEXT_PUBLIC_` means
"inline into the browser bundle". The app throws at startup if it sees one, but
that check is the last line of defence, not the first.

Redeploy after adding them — environment variables are read at build and boot,
not per request.

## Diagnosing a broken deploy

```bash
curl -s https://<your-domain>/api/health
```

Reports which variables are present and whether the database is reachable —
presence only, never values, so it is safe to hit from anywhere. Returns 503
when something is wrong, so uptime monitoring notices without parsing a body.

It deliberately does not report whether the secret key is set. That variable
is server-only, and confirming it from an unauthenticated endpoint tells an
attacker the service role is configured and worth hunting for.

The three failures it distinguishes, which otherwise all present as a 500 with
an opaque digest:

| `checks` says | Means |
|---|---|
| `not set` | The variable is missing from this environment |
| `is not a URL` | The project *ref* was pasted where the URL belongs |
| `tables do not exist` | Env is fine; migrations have not been applied |

## Which pages need the database

| Route | Needs Supabase | Rendering |
|---|---|---|
| `/`, `/pricing`, `/privacy` | no | static |
| `/learn` | yes | on demand |
| `/learn/[track]` | yes | ISR, generated on first request |
| `/p/[slug]` | yes | on demand |

Nothing is prerendered against the database at build time. That is deliberate:
CI builds this app with no project configured, and a build that needs a
database is a build that cannot be verified.

## After the first deploy

- [ ] Environment variables set for all three Vercel environments
- [ ] Migrations applied to the project (`pnpm db:push`, or paste
      `pnpm db:bundle --seed` output into the SQL editor)
- [ ] `/learn` returns 200 and lists at least one track
- [ ] `/favicon.ico` returns 200
- [ ] `NEXT_PUBLIC_SITE_URL` matches the real domain, so canonical URLs and
      OG tags do not point at the wrong host.

      It must be set as a **build-time** variable, not just a runtime one.
      `/` and the other static routes are prerendered during `next build`, so
      whatever the origin resolves to then is baked into their `<link
      rel=canonical>` and `og:image` forever. Verified: building without it and
      then setting it at `next start` left the homepage claiming
      `http://localhost:3000` while the dynamic course pages picked up the new
      value — a split that is easy to miss because the page you are most likely
      to spot-check is the one that still looks right.

      If it is unset, `apps/web/src/lib/site.ts` falls back to
      `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel does provide at build time.
      That is a safety net, not the plan: it is the *project* production URL, so
      it stays a `*.vercel.app` host even after a custom domain is attached.

- [ ] The canonical host actually resolves. `jintu.in` did not — every page was
      telling Google its real self lived at a hostname with no DNS. A canonical
      is an instruction, not a hint, so pointing one at a dead host is worse
      than omitting it.
