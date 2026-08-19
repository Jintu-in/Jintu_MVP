import Link from "next/link";

/**
 * A day slug that resolves to nothing.
 *
 * Names what happened, then what to do — in that order, with no
 * illustration and no apology. The two ways out are the roadmap this link
 * belonged to and the beginning of it, because a stale link is nearly
 * always an old bookmark rather than a typo.
 *
 * This file cannot read the params, so it speaks about "the roadmap"
 * rather than naming it; the page itself names the roadmap when it can.
 */
export default function NodeNotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col justify-center bg-white px-5 py-12">
      <h1 className="text-[22px] leading-[1.3] font-medium text-ink-900">
        That day does not exist.
      </h1>
      <p className="mt-2.5 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
        You may have followed an old link. The roadmap it belonged to is still here.
      </p>
      <div className="mt-6 flex flex-col gap-2.5">
        <Link
          href="/learn"
          className="flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 text-[16px] font-medium text-white hover:bg-brand-800"
        >
          Open the roadmaps
        </Link>
      </div>
    </main>
  );
}
