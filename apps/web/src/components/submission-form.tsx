"use client";

import { useAction } from "next-safe-action/hooks";
import { useId } from "react";
import { submitAssignment } from "@/actions/submissions";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

export function SubmissionForm({
  assignmentId,
  kind,
}: {
  assignmentId: string;
  kind: "sql" | "artifact_link";
}) {
  const id = useId();
  const { execute, result, status } = useAction(submitAssignment);
  const errors = result?.validationErrors as FieldErrors | undefined;
  const pending = status === "executing";

  if (result?.data?.submitted) {
    return (
      <p role="status" className="mt-3 rounded-card bg-ok-600/10 px-4 py-3 text-sm text-ink-800">
        Submitted. It is queued for grading, and two peers will be assigned to
        review it.
      </p>
    );
  }

  return (
    <form
      noValidate
      className="mt-3"
      action={(fd) =>
        execute(
          kind === "sql"
            ? { assignmentId, kind: "sql", sql: String(fd.get("sql") ?? "") }
            : {
                assignmentId,
                kind: "artifact_link",
                url: String(fd.get("url") ?? ""),
                note: String(fd.get("note") ?? ""),
              },
        )
      }
    >
      {kind === "sql" ? (
        <>
          <label htmlFor={`${id}-sql`} className="block text-sm font-medium text-ink-700">
            Your query
          </label>
          <textarea
            id={`${id}-sql`}
            name="sql"
            rows={8}
            spellCheck={false}
            aria-invalid={firstError(errors, "sql") ? true : undefined}
            className={cn(
              "mt-1 block w-full rounded-card border px-3 py-2 font-mono text-sm text-ink-900",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700",
              firstError(errors, "sql") ? "border-risk-600" : "border-ink-300",
            )}
          />
          {firstError(errors, "sql") ? (
            <p className="mt-1 text-sm text-risk-600">{firstError(errors, "sql")}</p>
          ) : null}
          <p className="mt-1 text-xs text-ink-500">
            Graded by running it against the expected result — not by a model.
          </p>
        </>
      ) : (
        <>
          <label htmlFor={`${id}-url`} className="block text-sm font-medium text-ink-700">
            Link to your work
          </label>
          <input
            id={`${id}-url`}
            name="url"
            type="url"
            inputMode="url"
            placeholder="https://…"
            aria-invalid={firstError(errors, "url") ? true : undefined}
            className={cn(
              "mt-1 block w-full rounded-card border px-3 py-2 text-ink-900",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700",
              firstError(errors, "url") ? "border-risk-600" : "border-ink-300",
            )}
          />
          {firstError(errors, "url") ? (
            <p className="mt-1 text-sm text-pretty text-risk-600">{firstError(errors, "url")}</p>
          ) : null}

          <label htmlFor={`${id}-note`} className="mt-3 block text-sm font-medium text-ink-700">
            Anything a reviewer needs to know <span className="text-ink-500">(optional)</span>
          </label>
          <input
            id={`${id}-note`}
            name="note"
            className="mt-1 block w-full rounded-card border border-ink-300 px-3 py-2 text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700"
          />
          <p className="mt-1 text-xs text-ink-500">
            The link must be public — a reviewer who cannot open it cannot mark it.
          </p>
        </>
      )}

      {result?.serverError ? (
        <p role="alert" className="mt-3 text-pretty text-sm text-risk-600">
          {result.serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "mt-4 rounded-card px-4 py-2.5 font-medium text-white",
          "bg-brand-700 hover:bg-brand-800 disabled:bg-ink-500",
        )}
      >
        {pending ? "Submitting…" : "Submit"}
      </button>
      <p className="mt-2 text-xs text-ink-500">
        One submission per assignment — you cannot change it once peers are
        reviewing it.
      </p>
    </form>
  );
}
