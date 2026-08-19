import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SavedList } from "@/components/account/saved-list";
import { BackIcon } from "@/components/ui/icons";
import { getSavedQueue } from "@/lib/saved";

/**
 * /profile/saved — the read-later queue, with its cost stated up front.
 *
 * The header carries the count and the total time because the whole point
 * of saving is deciding later whether you have room for it, and "4 saved"
 * does not answer that. "~22 min" does.
 */
export const metadata: Metadata = {
  title: "Saved to read",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const queue = await getSavedQueue();
  if (!queue) redirect("/join?next=/profile/saved");

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[720px] bg-white px-5 pt-4 pb-12">
      <Link
        href="/profile"
        className="-ml-2 inline-flex h-12 items-center gap-1.5 px-2 text-[14px] text-brand-700"
      >
        <BackIcon />
        Profile
      </Link>

      <h1 className="mt-2 text-[22px] leading-[1.3] font-medium text-ink-900">Saved to read</h1>

      {queue.count > 0 ? (
        <p className="mt-1.5 font-mono text-[13px] leading-none text-ink-500">
          {queue.count} saved
          {queue.totalMinutes > 0 ? ` · ~${queue.totalMinutes} min` : ""}
        </p>
      ) : null}

      <SavedList items={queue.items} />
    </main>
  );
}
