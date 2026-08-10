"use client";

import { useAction } from "next-safe-action/hooks";
import { useId } from "react";
import { updateProfile } from "@/actions/profile";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;

const firstError = (errors: FieldErrors | undefined, field: string) =>
  errors?.[field]?._errors?.[0];

/**
 * Correcting your own details.
 *
 * Pre-filled with what is stored rather than left blank with placeholders: a
 * correction form has to show you the thing being corrected, or you cannot
 * tell whether it is already right.
 */
export function ProfileForm({
  fullName,
  batchYear,
}: {
  fullName: string | null;
  batchYear: number | null;
}) {
  const id = useId();
  const { execute, result, status } = useAction(updateProfile);

  const pending = status === "executing";
  const fieldErrors = result?.validationErrors as FieldErrors | undefined;

  return (
    <form
      noValidate
      action={(formData) =>
        execute({
          fullName: String(formData.get("fullName") ?? ""),
          batchYear: String(formData.get("batchYear") ?? ""),
        })
      }
      className="mt-4 space-y-5"
    >
      <div>
        <label htmlFor={`${id}-name`} className="block text-sm font-medium text-ink-800">
          Full name
        </label>
        <input
          id={`${id}-name`}
          name="fullName"
          type="text"
          defaultValue={fullName ?? ""}
          maxLength={120}
          autoComplete="name"
          aria-describedby={`${id}-name-help`}
          className="mt-1.5 h-12 w-full rounded-lg border border-ink-200 px-3 text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        />
        <p id={`${id}-name-help`} className="mt-1.5 text-sm text-ink-500">
          Leaving this empty removes your name from our records.
        </p>
        {firstError(fieldErrors, "fullName") ? (
          <p role="alert" className="mt-1.5 text-sm text-risk-800">
            {firstError(fieldErrors, "fullName")}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${id}-year`} className="block text-sm font-medium text-ink-800">
          Graduation year
        </label>
        <input
          id={`${id}-year`}
          name="batchYear"
          // inputMode numeric rather than type="number": a spinner on a year is
          // useless, and type=number on Android has historically dropped
          // leading characters on some keyboards.
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          defaultValue={batchYear ?? ""}
          className="mt-1.5 h-12 w-32 rounded-lg border border-ink-200 px-3 text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        />
        {firstError(fieldErrors, "batchYear") ? (
          <p role="alert" className="mt-1.5 text-sm text-risk-800">
            {firstError(fieldErrors, "batchYear")}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>

        {result?.data?.saved ? (
          <p role="status" className="text-sm text-ok-800">
            Saved.
          </p>
        ) : null}
      </div>

      {result?.serverError ? (
        <p role="alert" className="text-sm text-risk-800">
          {result.serverError}
        </p>
      ) : null}
    </form>
  );
}
