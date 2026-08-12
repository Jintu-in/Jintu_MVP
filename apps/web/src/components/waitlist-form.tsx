"use client";

import { useAction } from "next-safe-action/hooks";
import { useId, useState } from "react";
import { joinWaitlist } from "@/actions/waitlist";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;

function firstError(errors: FieldErrors | undefined, field: string) {
  return errors?.[field]?._errors?.[0];
}

export function WaitlistForm() {
  const id = useId();
  const [showAdultError, setShowAdultError] = useState(false);
  const { execute, result, status } = useAction(joinWaitlist);

  const pending = status === "executing";
  const fieldErrors = result?.validationErrors as FieldErrors | undefined;
  const serverError = result?.serverError;

  if (result?.data?.joined) {
    return (
      <div role="status" className="rounded-card border border-brand-200 bg-brand-50 p-6">
        <p className="font-medium text-ink-900">You&rsquo;re on the list.</p>
        <p className="mt-2 text-pretty text-ink-600">
          We&rsquo;ll message you when the next cohort opens. Twenty places,
          and we pick for fit rather than first-come.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      action={(formData) => {
        setShowAdultError(true);
        execute({
          phone: String(formData.get("phone") ?? ""),
          fullName: String(formData.get("fullName") ?? ""),
          collegeName: String(formData.get("collegeName") ?? ""),
          isAdultConfirmed: formData.get("isAdultConfirmed") === "on",
          consentContact: formData.get("consentContact") === "on",
          consentWhatsapp: formData.get("consentWhatsapp") === "on",
        });
      }}
      className="rounded-card border border-ink-100 bg-white p-6"
    >
      <h2 className="text-xl font-medium tracking-tight text-ink-900">
        Join the waitlist
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Twenty places in the first cohort.
      </p>

      <div className="mt-5 space-y-4">
        <Field
          id={`${id}-phone`}
          name="phone"
          label="Mobile number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="98765 43210"
          required
          hint="Indian mobile. For deadline reminders and cohort updates — signing in is by email."
          error={firstError(fieldErrors, "phone")}
        />
        <Field
          id={`${id}-name`}
          name="fullName"
          label="Name"
          optional
          autoComplete="name"
          error={firstError(fieldErrors, "fullName")}
        />
        <Field
          id={`${id}-college`}
          name="collegeName"
          label="College"
          optional
          autoComplete="organization"
          error={firstError(fieldErrors, "collegeName")}
        />
      </div>

      <fieldset className="mt-6 space-y-3">
        <legend className="text-sm font-medium text-ink-900">
          Before you join
        </legend>

        <Check
          id={`${id}-adult`}
          name="isAdultConfirmed"
          error={showAdultError ? firstError(fieldErrors, "isAdultConfirmed") : undefined}
        >
          I am 18 or older.
        </Check>

        <Check
          id={`${id}-contact`}
          name="consentContact"
          error={showAdultError ? firstError(fieldErrors, "consentContact") : undefined}
        >
          Jintu may contact me about the cohort — dates, price, and how to
          join.
        </Check>

        <Check id={`${id}-whatsapp`} name="consentWhatsapp">
          Send me deadline reminders on WhatsApp.{" "}
          <span className="text-ink-500">Optional.</span>
        </Check>
      </fieldset>

      {serverError ? (
        <p role="alert" className="mt-4 text-sm text-risk-600">
          {serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "mt-6 flex h-12 w-full items-center justify-center rounded-lg font-medium text-white transition-colors",
          "bg-brand-700 hover:bg-brand-800",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
          "disabled:cursor-not-allowed disabled:bg-ink-500",
        )}
      >
        {pending ? "Joining…" : "Join the waitlist"}
      </button>

      <p className="mt-3 text-xs text-ink-500">
        We store your number to contact you about the cohort, and nothing else.
        You can ask us to delete it at any time. See our{" "}
        <a href="/privacy" className="underline hover:text-brand-800">
          privacy notice
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  hint,
  error,
  optional,
  ...input
}: {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

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
        aria-describedby={describedBy || undefined}
        className={cn(
          "mt-1.5 block h-12 w-full rounded-lg border bg-white px-3 text-ink-900",
          "focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-700",
          error ? "border-risk-600" : "border-ink-200",
        )}
      />
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
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
  error,
  children,
}: {
  id: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex gap-2.5">
        {/* Never defaultChecked. A pre-ticked box is not a clear affirmative
            action, which makes the consent defective — docs/LEGAL.md §2.2. */}
        <input
          type="checkbox"
          id={id}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-4 shrink-0 accent-brand-700"
        />
        <label htmlFor={id} className="text-sm text-pretty text-ink-700">
          {children}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 ml-6.5 text-sm text-risk-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
