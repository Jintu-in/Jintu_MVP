import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { ProfileHeader } from "@/components/profile/profile-header";
import { FinishedLists, RecordEmptyState, WeeksGrid } from "@/components/profile/profile-record";
import { getAccount } from "@/lib/account";
import { getMyMomentum } from "@/lib/momentum";
import { getMyRecord } from "@/lib/profile-record";
import { getSiteUrl } from "@/lib/env";

/**
 * /profile — the identity half: who this is, the public link, and (once a
 * day is finished) the record. Settings moved out entirely (Decision 3,
 * design/jintu-design/CURRENT-STATE.md §5) — this page no longer edits
 * anything but what ProfileHeader itself does (sharing).
 *
 * The record half (Phase 6 Part B, V2Profile/DeskProfile): stats, the
 * weeks grid, and "finished in X" lists — fetched only when hasRecord is
 * true, so day one pays nothing for a record it doesn't have yet.
 */
export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const [account, momentum] = await Promise.all([getAccount(), getMyMomentum()]);
  if (!account) redirect("/join?next=/profile");

  const record = account.hasRecord ? await getMyRecord() : null;
  const name = account.displayName ?? account.fullName ?? "Your account";
  const points = momentum?.totalPoints ?? 0;

  return (
    <AppShell
      active="profile"
      user={{
        displayName: name,
        initials: account.initials,
        points,
        avatarAnimal: account.avatarAnimal,
        avatarColor: account.avatarColor,
      }}
    >
      <main className="mx-auto min-h-dvh w-full max-w-[720px] bg-ink-50 px-5 pt-6 pb-12 lg:max-w-[1040px] lg:px-0 lg:pt-9">
        <ProfileHeader
          avatarAnimal={account.avatarAnimal}
          avatarColor={account.avatarColor}
          name={name}
          handle={account.publicProfile.handle}
          suggestedHandle={account.suggestedHandle}
          isPublic={account.publicProfile.isPublic}
          siteHost={getSiteUrl().host}
          stats={record ? { streakDays: momentum?.streakDays ?? 0, points, daysLearned: record.daysLearned } : undefined}
        />

        {!record ? (
          <RecordEmptyState />
        ) : (
          <>
            <div className="mt-4 flex flex-none gap-2.5 lg:hidden">
              <div className="flex flex-1 flex-col gap-0.5 rounded-20 bg-warn-bg p-3.5 text-warn-700">
                <div className="font-heading text-[24px] leading-7 font-bold tracking-[-0.02em]">
                  {momentum?.streakDays ?? 0}
                </div>
                <div className="text-[12.5px] leading-[18px]">day streak</div>
              </div>
              <div className="flex flex-1 flex-col gap-0.5 rounded-20 bg-white p-3.5">
                <div className="font-heading text-[24px] leading-7 font-bold tracking-[-0.02em] text-ink-900">
                  {points}
                </div>
                <div className="text-[12.5px] leading-[18px] text-ink-600">points</div>
              </div>
              <div className="flex flex-1 flex-col gap-0.5 rounded-20 bg-white p-3.5">
                <div className="font-heading text-[24px] leading-7 font-bold tracking-[-0.02em] text-ink-900">
                  {record.lessonsDone}
                </div>
                <div className="text-[12.5px] leading-[18px] text-ink-600">lessons</div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 lg:mt-6 lg:flex-row lg:items-start lg:gap-6">
              <WeeksGrid weeks={record.weeks} />
              <div className="flex flex-col gap-4 lg:flex-1 lg:gap-6">
                <FinishedLists finished={record.finished} />
              </div>
            </div>
          </>
        )}

        <section className="mt-4 rounded-[20px] bg-white p-5 lg:mt-6 lg:rounded-[24px] lg:p-7">
          <h2 className="text-[15px] leading-[1.4] font-medium text-ink-900">Saved</h2>
          <Link
            href="/profile/saved"
            className="mt-3 inline-flex h-12 items-center rounded-lg border border-ink-100 bg-white px-4 text-[15px] font-medium text-brand-700 hover:border-brand-700"
          >
            {account.counts.saved > 0 ? `${account.counts.saved} saved to read` : "Saved to read"}
          </Link>
        </section>

        <footer className="mt-6 border-t border-ink-100 pt-5">
          <p className="text-[13px] leading-[1.7] text-ink-500">Jintu does not certify skills.</p>
          <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
            <Link href="/privacy" className="text-brand-700 hover:text-brand-800">Privacy</Link>
            <Link href="/terms" className="text-brand-700 hover:text-brand-800">Terms</Link>
            <Link href="/contact" className="text-brand-700 hover:text-brand-800">Contact</Link>
          </nav>
        </footer>
      </main>
    </AppShell>
  );
}
