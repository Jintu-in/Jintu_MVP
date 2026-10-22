import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { ProfileHeader } from "@/components/profile/profile-header";
import { getAccount } from "@/lib/account";
import { getMyMomentum } from "@/lib/momentum";
import { getSiteUrl } from "@/lib/env";

const ARROW_RIGHT = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

/**
 * /profile — the identity half: who this is, the public link, and (once a
 * day is finished) the record. Settings moved out entirely (Decision 3,
 * design/jintu-design/CURRENT-STATE.md §5) — this page no longer edits
 * anything but what ProfileHeader itself does (sharing).
 *
 * The record half (stats, contribution grid, roadmaps) is session P2.
 * Until this account has finished a day, V2ProfileNew's quiet card replaces
 * it — "0 days · 0 streak · 0 points" on day one is a product telling
 * somebody they have failed before they started.
 */
export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const [account, momentum] = await Promise.all([getAccount(), getMyMomentum()]);
  if (!account) redirect("/join?next=/profile");

  const name = account.displayName ?? account.fullName ?? "Your account";

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
      <main className="mx-auto min-h-dvh w-full max-w-[720px] bg-ink-50 px-5 pt-6 pb-12">
        <ProfileHeader
          avatarAnimal={account.avatarAnimal}
          avatarColor={account.avatarColor}
          name={name}
          handle={account.publicProfile.handle}
          suggestedHandle={account.suggestedHandle}
          isPublic={account.publicProfile.isPublic}
          siteHost={getSiteUrl().host}
        />

        {/* Where the record goes in P2 — V2ProfileNew's quiet card. */}
        {!account.hasRecord ? (
          <section className="mt-4 flex flex-none flex-col gap-4 rounded-[20px] bg-white p-5">
            <p className="text-[16px] leading-[24px] text-pretty text-ink-600">
              Your record starts after you finish your first day.
            </p>
            <Link
              href="/learn"
              className="flex h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-night-900 text-[15.5px] font-semibold text-on-night hover:bg-night-950"
            >
              <span>Open a roadmap</span>
              {ARROW_RIGHT}
            </Link>
          </section>
        ) : null}

        <section className="mt-4 rounded-[20px] bg-white p-5">
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
