"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { NEEDS_ACCOUNT, NEEDS_PROFILE } from "@jintu/contracts";
import { enrol } from "@/actions/enrolment";
import { SignInDialog } from "@/components/sign-in-dialog";

/**
 * The enrol button on a track page, shown only when an open cohort exists.
 *
 * The three refusals each become movement rather than a message:
 *
 *   no session  -> the sign-in dialog opens over the page, and on success the
 *                  enrolment retries itself — same pattern as requesting a
 *                  track, for the same reason: the person already pressed the
 *                  button that means "do this"
 *   no profile  -> /onboarding, with ?next pointing back here, because the
 *                  18+ confirmation cannot happen in a dialog — it creates
 *                  consents, and that page owns that responsibility
 *   enrolled    -> /dashboard, where the week's work is
 *
 * Payment is deliberately absent. Phase 0 is concierge: the seat is reserved
 * here, the ₹999 moves by UPI, and a person reconciles it — the copy under
 * the button says exactly that, because a button that takes a seat silently
 * looks free, and this is not free.
 */
export function EnrolButton({ cohortId, slug }: { cohortId: string; slug: string }) {
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { execute, status } = useAction(enrol, {
    onSuccess: ({ data }) => {
      if (data?.enrolmentId) router.push("/dashboard");
    },
    onError: ({ error }) => {
      if (error.serverError === NEEDS_ACCOUNT) {
        setSigningIn(true);
        return;
      }
      if (error.serverError === NEEDS_PROFILE) {
        router.push(`/onboarding?next=/learn/${slug}`);
        return;
      }
      setMessage(error.serverError ?? "That did not work. Try again.");
    },
  });

  const pending = status === "executing";

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => execute({ cohortId })}
        className="flex h-12 shrink-0 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
      >
        {pending ? "Reserving…" : "Enrol — ₹999"}
      </button>

      {message ? (
        <p role="alert" className="mt-2 text-sm text-risk-800">
          {message}
        </p>
      ) : null}

      <SignInDialog
        open={signingIn}
        reason="Enrolment needs an account — your submissions, grades and peer reviews all hang off it."
        onClose={() => setSigningIn(false)}
        onSignedIn={() => {
          setSigningIn(false);
          execute({ cohortId });
        }}
      />
    </>
  );
}
