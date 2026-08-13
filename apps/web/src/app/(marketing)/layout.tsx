import Image from "next/image";
import Link from "next/link";
import { AvatarMenu } from "@/components/avatar-menu";
import { getMyMomentum } from "@/lib/momentum";
import { getViewer, initialsFor } from "@/lib/session";

/**
 * Reading the viewer here is what makes these routes render per request.
 *
 * `/`, `/pricing` and `/privacy` were prerendered static and `/learn/[track]`
 * was SSG; a layout that touches cookies makes all four dynamic. That was a
 * deliberate trade, taken because the alternative — filling the avatar in
 * after hydration — means a signed-in student watches the header change under
 * them on every marketing page, and a header that rearranges itself reads as a
 * bug even when it is not.
 *
 * The way to have both is Partial Prerendering: a static shell with the avatar
 * streaming into a hole. That needs `cacheComponents`, which turns data
 * fetching dynamic-by-default across the whole app and would want its own
 * change rather than riding along with a header.
 *
 * Declared force-dynamic rather than left for Next to infer from the cookie
 * read. Inference is not reliable here: createClient() validates the
 * environment BEFORE it touches cookies, so on a build with no Supabase
 * project — which is exactly what CI does, on purpose — the env error is
 * raised during the prerender attempt and Next never gets as far as the
 * dynamic bail-out. The result was a green local build and a red CI one,
 * "Export encountered an error on /(marketing)/page: /". Saying it outright
 * means the two agree.
 */
export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const viewer = await getViewer();
  // The header's momentum chip. Only worth a query when there is a person.
  const momentum = viewer?.hasProfile ? await getMyMomentum() : null;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* First focusable thing on the page. Invisible until keyboard focus,
          then a real button — a keyboard or screen-reader user should not have
          to walk the whole header to reach the content. */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      {/* Sticky, because the curriculum page is long and the sign-in and
          curriculum links are the two things a visitor leaves this page for.
          h-16 keeps both tap targets at 44px with room around them. */}
      <header className="sticky top-0 z-50 border-b border-ink-100 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-5">
          <Link href="/" className="flex items-center gap-2.5">
            {/* Decorative — the wordmark beside it carries the name. */}
            {/* Sized to the rendered 32px, not the source's 512px — the width
                prop drives srcset generation, and 640w/1080w candidates for a
                32px mark is dead weight on a mid-range phone. */}
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="text-xl font-medium tracking-tight text-ink-900">
              Jintu
            </span>
          </Link>

          {/* Everything plus the wordmark has to fit a 360px viewport without
              wrapping. Search lost its nav slot to the momentum chip: search
              lives inside /learn (one tap away via Roadmaps), whereas the
              streak is the thing a daily-habit product should surface on
              every page — seeing the number is half of keeping it. */}
          <nav className="ml-auto flex items-center gap-4 text-sm">
            <Link href="/learn" className="font-medium text-ink-600 hover:text-ink-900">
              Roadmaps
            </Link>
            {momentum ? (
              <Link
                href="/dashboard"
                aria-label={`${momentum.streakDays}-day streak, ${momentum.totalPoints} points — open dashboard`}
                className="flex items-center gap-1 font-mono text-[13px] text-ink-600 hover:text-ink-900"
              >
                {/* The one emoji in the product, by owner's call: the streak
                    flame. Decorative — the numbers beside it carry the fact. */}
                <span aria-hidden>🔥</span>
                {momentum.streakDays}d · {momentum.totalPoints} pts
              </Link>
            ) : null}

            {/*
              Three states, not two. Someone who has authenticated but not
              finished onboarding has no profiles row — under Law 3 that means
              they have never confirmed being 18, so they are not yet a user of
              anything and must not be handed an account menu. Showing them
              "Sign in" would be worse: they are signed in, and the link would
              bounce them through a flow they are already inside.
            */}
            {viewer?.hasProfile ? (
              <AvatarMenu
                initials={initialsFor(viewer)}
                fullName={viewer.fullName}
                email={viewer.email}
              />
            ) : viewer ? (
              <Link
                href="/onboarding"
                className="font-medium text-brand-700 hover:text-brand-800"
              >
                Finish signing up
              </Link>
            ) : (
              <Link href="/join" className="font-medium text-brand-700 hover:text-brand-800">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <div id="content" className="flex-1">{children}</div>

      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-5 py-10 text-center">
          <span className="text-lg font-medium tracking-tight text-ink-900">
            Jintu
          </span>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <Link href="/learn" className="text-ink-600 hover:text-brand-800">
              Tracks
            </Link>
            <Link href="/pricing" className="text-ink-600 hover:text-brand-800">
              Pricing
            </Link>
            <Link href="/terms" className="text-ink-600 hover:text-brand-800">
              Terms
            </Link>
            <Link href="/refunds" className="text-ink-600 hover:text-brand-800">
              Refunds
            </Link>
            <Link href="/contact" className="text-ink-600 hover:text-brand-800">
              Contact
            </Link>
            <Link href="/privacy" className="text-ink-600 hover:text-brand-800">
              Privacy notice
            </Link>
          </nav>

          {/* ink-500, not ink-400: this is a legal notice and ink-400 is 3.39:1 */}
          <p className="text-sm text-ink-500">Jintu · Made in India</p>
        </div>
      </footer>
    </div>
  );
}
