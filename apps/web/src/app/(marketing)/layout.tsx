import Image from "next/image";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-ink-100">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            {/* Decorative — the wordmark beside it carries the name. */}
            {/* Sized to the rendered 36px, not the source's 512px — the width
                prop drives srcset generation, and 640w/1080w candidates for a
                36px mark is dead weight on a mid-range phone. */}
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
            <span className="text-lg font-semibold tracking-tight text-ink-900">
              Jintu
            </span>
          </Link>

          {/* The free curriculum is the top of the funnel (§6) — it needs to be
              reachable from every page, not just findable via search. */}
          <nav className="ml-auto flex items-center gap-5">
            <Link
              href="/learn"
              className="text-sm font-medium text-brand-700 hover:text-brand-800"
            >
              Free curriculum
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-ink-600 hover:text-ink-900"
            >
              Pricing
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-ink-100">
        {/* ink-500, not ink-400: this is a legal notice and ink-400 is 3.39:1 */}
        <div className="mx-auto max-w-3xl px-6 py-6 text-sm text-ink-500">
          <p>Open to applicants aged 18 and over.</p>
        </div>
      </footer>
    </div>
  );
}
