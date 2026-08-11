"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useId, useState } from "react";
import { NEEDS_ACCOUNT, NEEDS_PROFILE } from "@jintu/contracts";
import { createCommunityTrack } from "@/actions/authoring";
import { SignInDialog } from "@/components/sign-in-dialog";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

const FIELD =
  "block w-full rounded-lg border bg-white px-3 text-base text-ink-900 placeholder:text-ink-500 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700";

/**
 * Starts a community track. The refusals become movement, same as enrolling:
 * no session opens sign-in over the page and retries itself; no profile goes
 * to onboarding with the way back in ?next. Everything else the database
 * says — three unfinished, same title again — is shown as written, because
 * those sentences were written to be shown.
 */
export function WriteTrackForm() {
  const id = useId();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [last, setLast] = useState<{ title: string; summary: string } | null>(null);

  const { execute, result, status } = useAction(createCommunityTrack, {
    onSuccess: ({ data }) => {
      if (data?.slug) router.push(`/write/${data.slug}`);
    },
    onError: ({ error }) => {
      if (error.serverError === NEEDS_ACCOUNT) {
        setSigningIn(true);
        return;
      }
      if (error.serverError === NEEDS_PROFILE) {
        router.push("/onboarding?next=/write");
        return;
      }
      setMessage(error.serverError ?? "That did not work. Try again.");
    },
  });

  const errors = result?.validationErrors as FieldErrors | undefined;
  const pending = status === "executing";

  const submit = (fd: FormData) => {
    const input = {
      title: String(fd.get("title") ?? ""),
      summary: String(fd.get("summary") ?? ""),
    };
    setMessage(null);
    setLast(input);
    execute(input);
  };

  return (
    <form noValidate action={submit} className="mt-6">
      <label htmlFor={`${id}-title`} className="block text-sm font-medium text-ink-700">
        Title
      </label>
      <input
        id={`${id}-title`}
        name="title"
        placeholder="Guitar for beginners"
        aria-invalid={firstError(errors, "title") ? true : undefined}
        className={cn(
          FIELD,
          "mt-1.5 h-12",
          firstError(errors, "title") ? "border-risk-600" : "border-ink-200",
        )}
      />
      {firstError(errors, "title") ? (
        <p className="mt-1.5 text-sm text-pretty text-risk-600">{firstError(errors, "title")}</p>
      ) : null}

      <label htmlFor={`${id}-summary`} className="mt-4 block text-sm font-medium text-ink-700">
        What does it prepare someone for?
      </label>
      <textarea
        id={`${id}-summary`}
        name="summary"
        rows={3}
        placeholder="Play three songs from open chords, on a schedule that survives a job."
        aria-invalid={firstError(errors, "summary") ? true : undefined}
        className={cn(
          FIELD,
          "mt-1.5 py-2.5",
          firstError(errors, "summary") ? "border-risk-600" : "border-ink-200",
        )}
      />
      {firstError(errors, "summary") ? (
        <p className="mt-1.5 text-sm text-pretty text-risk-600">{firstError(errors, "summary")}</p>
      ) : null}

      {message ? (
        <p role="alert" className="mt-3 text-sm text-pretty text-risk-600">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500 sm:w-auto"
      >
        {pending ? "Starting…" : "Start writing"}
      </button>

      <SignInDialog
        open={signingIn}
        reason="A track needs an author on record — sign in and yours is saved under your name."
        onClose={() => setSigningIn(false)}
        onSignedIn={() => {
          setSigningIn(false);
          if (last) execute(last);
        }}
      />
    </form>
  );
}
