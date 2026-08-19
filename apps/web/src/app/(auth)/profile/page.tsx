import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IdentityCard } from "@/components/account/identity-card";
import { PublicProfileCard } from "@/components/account/public-profile-card";
import { RemindersCard } from "@/components/account/reminders-card";
import { TimezoneCard } from "@/components/account/timezone-card";
import { getAccount } from "@/lib/account";
import { getSiteUrl } from "@/lib/env";

/**
 * /profile — the account half: identity, how the day is counted, reminders,
 * the public page, and the data controls.
 *
 * The record half (stats, contribution grid, roadmaps) is session P2. Where
 * it will go, a new account sees one quiet card rather than a row of zeros:
 * "0 days · 0 streak · 0 points" on day one is a product telling somebody
 * they have failed before they started.
 *
 * Nine hairline-separated sections, no sidebar — delete and download sit in
 * plain outline buttons, findable and not styled as danger.
 */
export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const account = await getAccount();
  if (!account) redirect("/join?next=/profile");

  const name = account.displayName ?? account.fullName ?? "Your account";
  const host = getSiteUrl().host;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[720px] bg-white px-5 pt-6 pb-12">
      <h1 className="sr-only">Profile</h1>

      <IdentityCard
        initials={account.initials}
        name={name}
        email={account.email}
        displayName={account.displayName}
      />

      {/* Where the record goes in P2. Until this account has finished a day,
          it says so in a sentence instead of drawing an empty grid. */}
      {!account.hasRecord ? (
        <section className="border-t border-ink-100 py-6">
          <h2 className="text-[15px] leading-[1.4] font-medium text-ink-900">Your record</h2>
          <div className="mt-3 rounded-card bg-ink-50 p-4">
            <p className="text-[15px] leading-[1.65] text-pretty text-ink-600">
              Your record starts when you finish your first day.
            </p>
            <Link
              href="/learn"
              className="mt-3 inline-flex h-12 items-center rounded-lg border border-ink-100 bg-white px-4 text-[15px] font-medium text-brand-700 hover:border-brand-700"
            >
              Open a roadmap
            </Link>
          </div>
        </section>
      ) : null}

      {/* Notes and saved. Notes are S7 — the user_notes table does not exist
          yet, so this links only what is real rather than showing a count of
          nothing behind a dead link. */}
      <section className="border-t border-ink-100 py-6">
        <h2 className="text-[15px] leading-[1.4] font-medium text-ink-900">Saved</h2>
        <Link
          href="/profile/saved"
          className="mt-3 inline-flex h-12 items-center rounded-lg border border-ink-100 bg-white px-4 text-[15px] font-medium text-brand-700 hover:border-brand-700"
        >
          {account.counts.saved > 0
            ? `${account.counts.saved} saved to read`
            : "Saved to read"}
        </Link>
      </section>

      {/* How your day is counted */}
      <TimezoneCard current={account.timezone} />

      <RemindersCard
        dailyEnabled={account.reminders.dailyEnabled}
        dailyAt={account.reminders.dailyAt}
        streakWarning={account.reminders.streakWarning}
      />

      <PublicProfileCard
        initials={account.initials}
        initialHandle={account.publicProfile.handle}
        initialIsPublic={account.publicProfile.isPublic}
        suggestedHandle={account.suggestedHandle}
        siteHost={host}
        // Zero-state placeholders until P2 builds the record. Honest shape,
        // honest numbers — the component takes them as props.
        stats={{ daysLearned: account.counts.days, currentStreak: 0, longestStreak: 0, points: 0 }}
      />

      {/* Your data */}
      <section className="border-t border-ink-100 py-6">
        <h2 className="text-[15px] leading-[1.4] font-medium text-ink-900">Your data</h2>

        <div className="mt-3 flex flex-col gap-3">
          <div>
            <a
              href="/profile/export"
              className="inline-flex h-12 items-center rounded-lg border border-ink-100 bg-white px-4 text-[15px] font-medium text-brand-700 hover:border-brand-700"
            >
              Download everything
            </a>
            <p className="mt-2 max-w-[62ch] text-[13px] leading-[1.7] text-ink-500">
              Every day, setting and saved link, as JSON.
            </p>
          </div>

          <div>
            <Link
              href="/profile/consents"
              className="inline-flex h-12 items-center rounded-lg border border-ink-100 bg-white px-4 text-[15px] font-medium text-brand-700 hover:border-brand-700"
            >
              Manage what you agreed to
            </Link>
            <p className="mt-2 max-w-[62ch] text-[13px] leading-[1.7] text-ink-500">
              Opens the consent list, each purpose with its date and a withdraw control.
            </p>
          </div>

          <div>
            <Link
              href="/profile/delete"
              className="inline-flex h-12 items-center rounded-lg border border-ink-100 bg-white px-4 text-[15px] font-medium text-brand-700 hover:border-brand-700"
            >
              Delete account
            </Link>
            <p className="mt-2 max-w-[62ch] text-[13px] leading-[1.7] text-ink-500">
              Removes your account, progress and notes permanently. Your public
              profile disappears immediately.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-100 pt-5">
        <p className="text-[13px] leading-[1.7] text-ink-500">Jintu does not certify skills.</p>
        <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
          <Link href="/privacy" className="text-brand-700 hover:text-brand-800">Privacy</Link>
          <Link href="/terms" className="text-brand-700 hover:text-brand-800">Terms</Link>
          <Link href="/contact" className="text-brand-700 hover:text-brand-800">Contact</Link>
        </nav>
      </footer>
    </main>
  );
}
