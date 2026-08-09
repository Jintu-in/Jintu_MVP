"use client";

import { useAction } from "next-safe-action/hooks";
import { useId } from "react";
import { submitAssignment } from "@/actions/submissions";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

const FIELD =
  "block w-full rounded-lg border bg-white px-3 text-ink-900 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700";

const LABEL = "block text-sm font-medium text-ink-700";

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
      <p
        role="status"
        className="mt-3 rounded-card border border-ok-600/20 bg-ok-600/10 px-4 py-3 text-sm text-pretty text-ink-800"
      >
        Submitted. It is queued for grading, and two peers will be assigned to
        review it.
      </p>
    );
  }

  return (
    <form
      noValidate
      className="mt-4"
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
          <label htmlFor={`${id}-sql`} className={LABEL}>
            Your query
          </label>
          <textarea
            id={`${id}-sql`}
            name="sql"
            rows={8}
            spellCheck={false}
            aria-invalid={firstError(errors, "sql") ? true : undefined}
            className={cn(
              FIELD,
              "mt-1.5 py-2 font-mono text-sm",
              firstError(errors, "sql") ? "border-risk-600" : "border-ink-200",
            )}
          />
          {firstError(errors, "sql") ? (
            <p className="mt-1.5 text-sm text-risk-600">{firstError(errors, "sql")}</p>
          ) : null}
          <p className="mt-1.5 text-sm text-ink-500">
            Graded by running it against the expected result — not by a model.
          </p>
        </>
      ) : (
        <>
          <label htmlFor={`${id}-url`} className={LABEL}>
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
              FIELD,
              "mt-1.5 h-12",
              firstError(errors, "url") ? "border-risk-600" : "border-ink-200",
            )}
          />
          {firstError(errors, "url") ? (
            <p className="mt-1.5 text-sm text-pretty text-risk-600">
              {firstError(errors, "url")}
            </p>
          ) : null}

          <label htmlFor={`${id}-note`} className={cn(LABEL, "mt-4")}>
            Anything a reviewer needs to know{" "}
            <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input id={`${id}-note`} name="note" className={cn(FIELD, "mt-1.5 h-12 border-ink-200")} />
          <p className="mt-1.5 text-sm text-ink-500">
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
          "mt-4 flex h-12 w-full items-center justify-center rounded-lg px-5 font-medium text-white",
          "bg-brand-700 hover:bg-brand-800 disabled:bg-ink-500",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
          "sm:w-auto",
        )}
      >
        {pending ? "Submitting…" : "Submit"}
      </button>
      <p className="mt-2 text-sm text-ink-500">
        One submission per assignment — you cannot change it once peers are
        reviewing it.
      </p>
    </form>
  );
}
