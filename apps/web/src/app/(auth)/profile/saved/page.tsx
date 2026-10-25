import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { SavedList } from "@/components/account/saved-list";
import { BackIcon } from "@/components/ui/icons";
import { getAccount } from "@/lib/account";
import { getMyMomentum } from "@/lib/momentum";
import { getSavedQueue } from "@/lib/saved";

/**
 * /profile/saved — the read-later queue (V2Saved/DeskSaved), restyled.
 * Stays nested under Profile, not a top-level nav item — both mockups'
 * own bottom tab bar / sidebar still highlight "Profile" here, and the
 * back control returns there, not to a separate "Saved" destination.
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
  const [queue, account, momentum] = await Promise.all([getSavedQueue(), getAccount(), getMyMomentum()]);
  if (!queue || !account) redirect("/join?next=/profile/saved");

  const name = account.displayName ?? account.fullName ?? "Your account";
  const metaLine = queue.count > 0 ? `${queue.count} saved${queue.totalMinutes > 0 ? ` · ~${queue.totalMinutes} min` : ""}` : "";

  return (
    <AppShell
      active="profile"
      user={{
        displayName: name,
        initials: account.initials,
        points: momentum?.totalPoints ?? 0,
        avatarAnimal: account.avatarAnimal,
        avatarColor: account.avatarColor,
      }}
    >
      <main className="mx-auto min-h-dvh w-full max-w-[720px] bg-white px-5 pt-4 pb-12 lg:flex lg:max-w-[1080px] lg:gap-10 lg:bg-ink-50 lg:px-12 lg:pt-7">
        <div className="min-w-0 flex-1 lg:max-w-[720px]">
          <Link
            href={"/profile" as Route}
            className="-ml-2 inline-flex h-12 items-center gap-1.5 px-2 text-[14px] font-semibold text-ink-900 no-underline lg:-ml-1.5"
          >
            <BackIcon />
            Profile
          </Link>

          <div className="mt-2 flex items-baseline justify-between gap-4">
            <h1 className="t-page m-0 font-bold text-ink-900">Saved to read</h1>
            {metaLine ? <p className="m-0 font-mono text-[13.5px] leading-5 text-ink-600">{metaLine}</p> : null}
          </div>

          <SavedList items={queue.items} />

          {queue.count > 0 ? (
            <p className="mt-3 rounded-2xl bg-brand-50 p-3.5 text-[14px] leading-[21px] text-link lg:hidden">
              Mark something as read when you finish it and it leaves the list.
            </p>
          ) : null}
        </div>

        <aside aria-label="How saving works" className="hidden w-80 flex-none flex-col gap-4 pt-[29px] lg:flex">
          <div className="flex flex-col gap-2 rounded-[22px] bg-brand-50 p-[22px] text-link">
            <div className="font-heading text-[19px] leading-[25px] font-semibold tracking-[-0.01em]">
              A queue, not an archive
            </div>
            <div className="text-[15px] leading-[23px]">
              Mark something as read when you finish it and it leaves the list.
              Remove is for links you no longer want.
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-[22px] border-[1.5px] border-dashed border-ink-400 p-[22px] text-ink-600">
            <div className="font-mono text-[12px] leading-4 font-semibold tracking-[.06em] text-ink-600 uppercase">
              When the list is empty
            </div>
            <div className="text-[15px] leading-[23px]">
              Tap save on any resource you want to come back to. They wait here,
              not in a browser tab you will close.
            </div>
          </div>
        </aside>
      </main>
    </AppShell>
  );
}
