"use client";

import { useAction } from "next-safe-action/hooks";
import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/actions/auth";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

/**
 * The consent screen. Every rule here comes from docs/LEGAL.md §2.2:
 *
 *   - one checkbox per purpose, never bundled
 *   - nothing pre-ticked, because a pre-ticked box is not a clear
 *     affirmative action and makes the consent defective
 *   - declining an optional purpose does not block the account
 *   - the notice version in force is written to every consent row
 */
const OPTIONAL = [
  {
    name: "whatsapp_updates",
    label: "Deadline reminders on WhatsApp",
    detail: "Missed submissions, peer reviews waiting on you, weekly deadlines.",
  },
  {
    name: "analytics",
    label: "Product analytics",
    detail: "How people move through the app, so we can fix what is confusing.",
  },
  {
    name: "public_profile",
    label: "A public proof-of-readiness profile",
    detail: "A shareable page at jintu.in/p/… . Off until you turn it on.",
  },
] as const;

export function OnboardingForm() {
  const id = useId();
  const router = useRouter();
  const { execute, result, status } = useAction(completeOnboarding, {
    onSuccess: () => router.replace("/account"),
  });

  const errors = result?.validationErrors as FieldErrors | undefined;

  return (
    <form
      noValidate
      action={(fd) =>
        execute({
          fullName: String(fd.get("fullName") ?? ""),
          collegeName: String(fd.get("collegeName") ?? ""),
          batchYear: String(fd.get("batchYear") ?? ""),
          isAdultConfirmed: fd.get("isAdultConfirmed") === "on",
          analytics: fd.get("analytics") === "on",
          whatsapp_updates: fd.get("whatsapp_updates") === "on",
          public_profile: fd.get("public_profile") === "on",
        })
      }
    >
      <div className="space-y-4">
        <Field id={`${id}-name`} name="fullName" label="Name" optional autoComplete="name" />
        <Field
          id={`${id}-college`}
          name="collegeName"
          label="College"
          optional
          autoComplete="organization"
        />
        <Field
          id={`${id}-year`}
          name="batchYear"
          label="Graduation year"
          optional
          inputMode="numeric"
          placeholder="2027"
          error={firstError(errors, "batchYear")}
        />
      </div>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-ink-900">Required</legend>
        <div className="mt-3">
          <Check id={`${id}-adult`} name="isAdultConfirmed" error={firstError(errors, "isAdultConfirmed")}>
            I am 18 years old or older.
          </Check>
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-ink-900">
          Optional — none of these affect your place
        </legend>
        <div className="mt-3 space-y-4">
          {OPTIONAL.map((o) => (
            <Check key={o.name} id={`${id}-${o.name}`} name={o.name} detail={o.detail}>
              {o.label}
            </Check>
          ))}
        </div>
      </fieldset>

      {result?.serverError ? (
        <p role="alert" className="mt-5 text-sm text-risk-600">
          {result.serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "executing"}
        className={cn(
          "mt-8 w-full rounded-card px-4 py-3 font-medium text-white",
          "bg-brand-700 hover:bg-brand-800 disabled:bg-ink-300",
        )}
      >
        {status === "executing" ? "Saving…" : "Create my account"}
      </button>

      <p className="mt-3 text-xs text-ink-500">
        You can change or withdraw any of the optional choices at any time, as
        easily as you gave them. See the{" "}
        <Link href="/privacy" className="underline hover:text-brand-800">
          privacy notice
        </Link>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  optional,
  error,
  ...input
}: {
  id: string;
  name: string;
  label: string;
  optional?: boolean;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-700">
        {label}
        {optional ? <span className="ml-1 text-ink-500">(optional)</span> : null}
      </label>
      <input
        {...input}
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "mt-1 block w-full rounded-card border px-3 py-2 text-ink-900",
          "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700",
          error ? "border-risk-600" : "border-ink-300",
        )}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-risk-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Check({
  id,
  name,
  detail,
  error,
  children,
}: {
  id: string;
  name: string;
  detail?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex gap-2.5">
        {/* Never defaultChecked — see the note at the top of this file. */}
        <input
          type="checkbox"
          id={id}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={detail ? `${id}-detail` : undefined}
          className="mt-1 size-4 shrink-0 accent-brand-700"
        />
        <div>
          <label htmlFor={id} className="text-sm text-pretty text-ink-800">
            {children}
          </label>
          {detail ? (
            <p id={`${id}-detail`} className="text-sm text-pretty text-ink-500">
              {detail}
            </p>
          ) : null}
        </div>
      </div>
      {error ? (
        <p className="mt-1 ml-6.5 text-sm text-risk-600">{error}</p>
      ) : null}
    </div>
  );
}
