import Link from "next/link";
import { AvatarMenu } from "@/components/avatar-menu";
import { getViewer, initialsFor } from "@/lib/session";

/**
 * The shell for sign-in, onboarding and the signed-in pages.
 *
 * Deliberately thinner than the marketing header: no Curriculum/Pricing/Sign
 * in nav. Someone halfway through an OTP flow has one thing to do, and a nav
 * bar full of exits is how a half-created account happens. The way out is the
 * wordmark, which goes home.
 *
 * The avatar appears only once a profile exists, which is the same line the
 * rule above draws: no profile means onboarding is unfinished, so the header
 * stays bare. Past that point this group is the dashboard, the profile and the
 * account page, where having no way to move between them is its own problem.
 *
 * Costs nothing here — every route in this group is already force-dynamic.
 */
export default async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const viewer = await getViewer();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex h-12 max-w-2xl items-center px-5">
          <Link
            href="/"
            className="-ml-1 flex items-center gap-1 text-brand-700 hover:text-brand-800"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
            <span className="text-lg font-medium tracking-tight">Jintu</span>
          </Link>

          {viewer?.hasProfile ? (
            <div className="ml-auto">
              <AvatarMenu
                initials={initialsFor(viewer)}
                fullName={viewer.fullName}
                email={viewer.email}
              />
            </div>
          ) : null}
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-6 text-sm text-ink-500">
          <Link href="/privacy" className="hover:text-brand-800">
            Privacy notice
          </Link>
          <span>Open to applicants aged 18 and over.</span>
        </div>
      </footer>
    </div>
  );
}
