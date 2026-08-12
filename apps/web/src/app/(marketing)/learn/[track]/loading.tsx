/**
 * Skeleton for the track page: the map's real proportions, no fake content.
 * Six grey tiles because six is the house shape — a reader on a slow
 * connection learns the page's size before its words, which is the map's
 * whole argument anyway.
 */
export default function Loading() {
  return (
    <main aria-busy className="mx-auto max-w-3xl px-5 pt-10 pb-24 sm:px-6">
      <div className="h-3 w-40 animate-pulse rounded bg-ink-100" />
      <div className="mt-6 h-8 w-3/4 animate-pulse rounded bg-ink-100" />
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-ink-100" />
      <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-ink-100" />
        ))}
      </div>
      <div className="mt-9 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-ink-100" />
        ))}
      </div>
    </main>
  );
}
