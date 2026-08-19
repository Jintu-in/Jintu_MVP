"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { deleteAccount } from "@/actions/account";

/**
 * The typed confirmation.
 *
 * No persuasion of any kind on this page — no second-guessing prompt, no
 * offer of a lesser option, no list of what they forfeit. Someone who wants
 * to leave is helped to leave: that is the product's voice, and under DPDP
 * it is also the obligation. The only friction is proving the act is
 * deliberate, which is what typing the address does.
 *
 * Cancel is the visually dominant action because it is the safe one, not
 * because we would rather they stayed.
 */
export function DeleteForm({ email }: { email: string }) {
  const router = useRouter();
  const [typed, setTyped] = useState("");
  const { execute, result, status } = useAction(deleteAccount, {
    onSuccess: () => {
      router.replace("/");
      router.refresh();
    },
  });

  const matches = typed.trim().toLowerCase() === email.toLowerCase();

  return (
    <form
      className="mt-6"
      action={() => {
        if (matches) execute({ confirmEmail: typed });
      }}
    >
      <label htmlFor="confirm" className="block text-[14px] leading-[1.6] text-ink-900">
        Type <span className="font-mono text-[13.5px]">{email}</span> to confirm
      </label>
      <input
        id="confirm"
        type="email"
        autoComplete="off"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        className="mt-2 h-12 w-full rounded-lg border border-ink-100 bg-white px-3 font-mono text-[14px] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
      />

      {/* Cancel first and filled: the dominant action on the page. */}
      <div className="mt-5 flex flex-col gap-2.5">
        <Link
          href="/profile"
          className="flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 text-[16px] font-medium text-white hover:bg-brand-800"
        >
          Cancel, keep my account
        </Link>
        <button
          type="submit"
          disabled={!matches || status === "executing"}
          className="flex h-12 w-full items-center justify-center rounded-lg border border-ink-100 bg-white text-[15px] font-medium text-risk-600 hover:border-risk-600 disabled:text-ink-500 disabled:hover:border-ink-100"
        >
          {status === "executing" ? "Deleting…" : "Delete my account"}
        </button>
      </div>

      {result?.serverError ? (
        <p role="alert" className="mt-3 text-[14px] leading-[1.7] text-ink-900">
          {result.serverError}
        </p>
      ) : null}
    </form>
  );
}
