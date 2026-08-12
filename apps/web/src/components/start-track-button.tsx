"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { NEEDS_ACCOUNT, NEEDS_PROFILE } from "@jintu/contracts";
import { startTrack } from "@/actions/enrolment";
import { SignInDialog } from "@/components/sign-in-dialog";

/**
 * V3's one call to action on a track page. Free, self-paced, no seats, no
 * dates — so the button says what happens and nothing needs a caveat.
 *
 * The refusals become movement, same pattern as everything else: no session
 * opens sign-in over the page and retries itself; no profile goes to
 * onboarding with the way back in ?next; started lands on the dashboard,
 * where the work is.
 */
export function StartTrackButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { execute, status } = useAction(startTrack, {
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
        onClick={() => execute({ slug })}
        className="flex h-12 shrink-0 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
      >
        {pending ? "Starting…" : "Start this track"}
      </button>

      {message ? (
        <p role="alert" className="mt-2 text-sm text-pretty text-risk-800">
          {message}
        </p>
      ) : null}

      <SignInDialog
        open={signingIn}
        reason="Starting a track needs an account — your submissions, scores and streak all hang off it. Reading never does."
        onClose={() => setSigningIn(false)}
        onSignedIn={() => {
          setSigningIn(false);
          execute({ slug });
        }}
      />
    </>
  );
}
