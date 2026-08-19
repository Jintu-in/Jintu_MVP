import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteForm } from "@/components/account/delete-form";
import { BackIcon } from "@/components/ui/icons";
import { getAccount } from "@/lib/account";

/**
 * Deleting the account. A page, not a modal — a modal is dismissible chrome
 * for a decision that deserves its own address, its own back button, and
 * enough room to list what actually goes.
 *
 * The list is counted from real rows. No persuasion copy of any kind.
 */
export const metadata: Metadata = {
  title: "Delete account",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function DeleteAccountPage() {
  const account = await getAccount();
  if (!account) redirect("/join?next=/profile");

  const removes = [
    account.counts.days > 0
      ? `${account.counts.days} ${account.counts.days === 1 ? "day" : "days"} of progress`
      : null,
    account.counts.saved > 0
      ? `${account.counts.saved} saved ${account.counts.saved === 1 ? "link" : "links"}`
      : null,
    account.publicProfile.handle ? "your public profile" : null,
    "your account",
  ].filter((x): x is string => Boolean(x));

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[520px] bg-white px-5 pt-4 pb-12">
      <Link
        href="/profile"
        className="-ml-2 inline-flex h-12 items-center gap-1.5 px-2 text-[14px] text-brand-700"
      >
        <BackIcon />
        Profile
      </Link>

      <h1 className="mt-2 text-[22px] leading-[1.3] font-medium text-ink-900">
        Delete your account?
      </h1>

      <h2 className="mt-5 font-mono text-[11.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
        This removes
      </h2>
      <ul className="mt-2.5 flex flex-col gap-1.5">
        {removes.map((r) => (
          <li key={r} className="text-[15px] leading-[1.6] text-ink-900">
            {r}
          </li>
        ))}
      </ul>

      <p className="mt-4 max-w-[62ch] text-[14px] leading-[1.7] text-pretty text-ink-600">
        This is immediate and cannot be undone. Download your data first if you
        want it.
      </p>

      <a
        href="/profile/export"
        className="mt-4 inline-flex h-12 items-center rounded-lg border border-ink-100 bg-white px-4 text-[15px] font-medium text-brand-700 hover:border-brand-700"
      >
        Download everything first
      </a>

      <DeleteForm email={account.email} />
    </main>
  );
}
