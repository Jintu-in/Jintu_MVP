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
      OG tags do not point at the wrong host
