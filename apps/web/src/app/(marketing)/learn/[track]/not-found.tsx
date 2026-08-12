import Link from "next/link";

/**
 * No published track has this address. Deliberately does not distinguish
 * "never existed" from "not published yet" — unpublished work is nobody's
 * business, the same stance the RPCs take.
 */
export default function TrackNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-16 text-center">
      <h1 className="text-2xl font-medium text-ink-900">
        No track lives at this address
      </h1>
      <p className="mx-auto mt-3 max-w-md text-pretty text-ink-600">
        It may have moved, or it is not published. Everything that is live is
        on the tracks page — and if what you wanted is not there, ask for it.
      </p>
      <Link
        href="/learn"
        className="mt-6 inline-flex h-12 items-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      >
        See every track
      </Link>
    </main>
  );
}
