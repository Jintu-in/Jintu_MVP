import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/**
 * The root 404. Reached by `notFound()` — which /learn/[track] and /p/[slug]
 * both call — and by any URL that matches no route.
 *
 * It lives at the root rather than inside a route group because a mistyped or
 * expired link is not confined to one section, and the two callers above sit
 * in different groups. It carries no nav: someone who followed a dead profile
 * link is not shopping, and the useful thing to offer is the free curriculum.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 py-16">
      <p className="font-mono text-sm text-ink-500">404</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-balance text-ink-900">
        That page is not here
      </h1>
      <p className="mt-3 text-pretty text-ink-600">
        The link may be mistyped, or it may point at a profile whose owner has
        since made it private. Either way, nothing on your side went wrong.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Link
          href="/learn"
          className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Open the free curriculum
        </Link>
        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-lg px-5 font-medium text-brand-700 hover:text-brand-800"
        >
          Go to the home page
        </Link>
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
