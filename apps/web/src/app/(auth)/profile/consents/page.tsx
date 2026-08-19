import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { OptionalPurpose } from "@jintu/contracts";
import { ConsentRow } from "@/components/account/consent-row";
import { BackIcon } from "@/components/ui/icons";
import { getAccount } from "@/lib/account";

/**
 * What you agreed to.
 *
 * The required purpose is visually distinct from the optional ones — it has
 * no toggle at all, rather than a disabled one. A disabled control says
 * "you may not"; no control says "this is not that kind of thing", which is
 * the truth: core service is the basis on which the account exists.
 */
export const metadata: Metadata = {
  title: "What you agreed to",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const COPY: Record<string, { label: string; description: string }> = {
  analytics: {
    label: "Analytics",
    description:
      "Anonymous usage data, so we can see which days people abandon and fix them. Never sold, never used to build a profile of you.",
  },
  reminders: {
    label: "Daily reminders",
    description:
      "One message a day at the time you choose, plus an optional warning before a streak breaks. Nothing else.",
  },
  public_profile: {
    label: "Public profile",
    description:
      "Publishes a page at jintu.in/u/your-name showing days learned and your grid. Your email is never on it.",
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function ConsentsPage() {
  const account = await getAccount();
  if (!account) redirect("/join?next=/profile/consents");

  const core = account.consents.find((c) => c.purpose === "core_service");
  const optional = account.consents.filter((c) => c.purpose !== "core_service");

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[720px] bg-white px-5 pt-4 pb-12">
      <Link
        href="/profile"
        className="-ml-2 inline-flex h-12 items-center gap-1.5 px-2 text-[14px] text-brand-700"
      >
        <BackIcon />
        Profile
      </Link>

      <h1 className="mt-2 text-[22px] leading-[1.3] font-medium text-ink-900">
        What you agreed to
      </h1>

      {/* Required: no toggle, because this is not a choice you can revoke and
          keep the account. Saying so plainly beats a switch you cannot move. */}
      <div className="mt-5 rounded-card bg-ink-50 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[15px] leading-[1.4] font-medium text-ink-900">Core service</span>
          <span className="font-mono text-[11px] leading-none tracking-[.06em] text-ink-500 uppercase">
            required
          </span>
        </div>
        <p className="mt-2 text-[13.5px] leading-[1.7] text-ink-600">
          Needed to hold an account.
        </p>
        {core?.grantedAt ? (
          <p className="mt-1.5 font-mono text-[12.5px] leading-[1.5] text-ink-500">
            Agreed {formatDate(core.grantedAt)}
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        {optional.map((c) => {
          const copy = COPY[c.purpose];
          if (!copy) return null;
          return (
            <ConsentRow
              key={c.purpose}
              purpose={c.purpose as OptionalPurpose}
              label={copy.label}
              description={copy.description}
              granted={Boolean(c.grantedAt) && !c.withdrawnAt}
              agreedOn={c.grantedAt ? formatDate(c.grantedAt) : null}
            />
          );
        })}
      </div>

      <p className="mt-6 border-t border-ink-100 pt-4 max-w-[62ch] text-[13px] leading-[1.7] text-pretty text-ink-500">
        Withdrawing consent stops that use immediately. It does not delete
        anything you have already done.
      </p>
    </main>
  );
}
