import Image from "next/image";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
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
            <span className="text-xl font-semibold tracking-tight text-ink-900">
              Jintu
            </span>
          </Link>

          {/* "Curriculum", not "Free curriculum": three links plus the wordmark
              have to fit a 360px viewport without wrapping. The word free does
              its work in the hero and the footer, where there is room. */}
          <nav className="ml-auto flex items-center gap-4 text-sm">
            <Link href="/learn" className="font-medium text-ink-600 hover:text-ink-900">
              Curriculum
            </Link>
            <Link href="/pricing" className="font-medium text-ink-600 hover:text-ink-900">
              Pricing
            </Link>
            <Link href="/join" className="font-medium text-brand-700 hover:text-brand-800">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-5 py-10 text-center">
          <span className="text-lg font-semibold tracking-tight text-ink-900">
            Jintu
          </span>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <Link href="/learn" className="text-ink-600 hover:text-brand-800">
              Free curriculum
            </Link>
            <Link href="/pricing" className="text-ink-600 hover:text-brand-800">
              Pricing
            </Link>
            <Link href="/privacy" className="text-ink-600 hover:text-brand-800">
              Privacy notice
            </Link>
          </nav>

          {/* ink-500, not ink-400: this is a legal notice and ink-400 is 3.39:1 */}
          <p className="text-sm text-ink-500">Jintu · Made in India</p>
          <p className="text-sm text-ink-500">
            Open to applicants aged 18 and over.
          </p>
        </div>
      </footer>
    </div>
  );
}
