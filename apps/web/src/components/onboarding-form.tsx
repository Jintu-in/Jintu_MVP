"use client";

import { useAction } from "next-safe-action/hooks";
import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/actions/auth";
import { FieldInput, FieldShell } from "@/components/ui/field-shell";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, { _errors?: string[] } | undefined>;
const firstError = (e: FieldErrors | undefined, f: string) => e?.[f]?._errors?.[0];

const ARROW_RIGHT = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

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
    name: "reminders",
    label: "A daily reminder",
    detail: "One well-timed nudge a day, on the channel and at the time you pick.",
  },
  {
    name: "analytics",
    label: "Product analytics",
    detail: "How people move through the app, so we can fix what is confusing.",
  },
  {
    name: "public_profile",
    label: "A public profile",
    detail: "A shareable page about your learning, if we build one. Off until you turn it on.",
  },
] as const;

/**
 * Restyled against V2Join.dc.html's "one last step" card. One real
 * deviation from the mockup, preserving real, already-reasoned behaviour:
 * the mockup shows only a name and a phone field, but collegeName and
 * batchYear are real, validated fields (packages/contracts/src/auth.ts) —
 * the mockup appears to predate them, so both stay, styled to match.
 */
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
          phone: String(fd.get("phone") ?? ""),
          batchYear: String(fd.get("batchYear") ?? ""),
          isAdultConfirmed: fd.get("isAdultConfirmed") === "on",
          analytics: fd.get("analytics") === "on",
          reminders: fd.get("reminders") === "on",
          public_profile: fd.get("public_profile") === "on",
          // Not a field on the form — the browser already knows, and asking
          // someone their timezone is a question with no good answer. The
          // streak's day boundary is this value's midnight.
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
        })
      }
    >
      <div className="flex flex-col gap-4">
        <Field id={`${id}-name`} name="fullName" label="Full name" optional autoComplete="name" />
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
        {/* Required, and the only required field here besides the 18+ box.
            Sign-in is by email, so this is the one place the number is asked
            for — and the sentence under it is not decoration: DPDP wants the
            purpose stated where the data is collected, not only in a notice
            nobody opens. */}
        <div>
          <label htmlFor={`${id}-phone`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
            Mobile number
          </label>
          <FieldShell className="h-14">
            <span aria-hidden className="font-mono text-[14px] font-medium text-ink-600">
              +91
            </span>
            <span aria-hidden className="h-5 w-px flex-none bg-ink-100" />
            <FieldInput
              id={`${id}-phone`}
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="98765 43210"
              aria-invalid={firstError(errors, "phone") ? true : undefined}
              aria-describedby={`${id}-phone-hint${firstError(errors, "phone") ? ` ${id}-phone-error` : ""}`}
              className="text-[16px]"
            />
          </FieldShell>
          <p id={`${id}-phone-hint`} className="mt-1.5 text-[14px] text-pretty text-ink-500">
            For deadline reminders and so we can reach you about your cohort. Indian mobile numbers
            only.
          </p>
          {firstError(errors, "phone") ? (
            <p id={`${id}-phone-error`} className="mt-1.5 text-[14px] text-pretty text-risk-600">
              {firstError(errors, "phone")}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset className="mt-8">
        <legend className="text-[13.5px] font-semibold text-ink-700">Required</legend>
        <div className="mt-3">
          <label
            htmlFor={`${id}-adult`}
            className={cn(
              "flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 border-ink-100 bg-white px-4 text-[15.5px] font-semibold text-ink-900",
              "has-[:checked]:border-ink-900",
              firstError(errors, "isAdultConfirmed") && "border-risk-600",
            )}
          >
            <input
              type="checkbox"
              id={`${id}-adult`}
              name="isAdultConfirmed"
              aria-invalid={firstError(errors, "isAdultConfirmed") ? true : undefined}
              aria-describedby={firstError(errors, "isAdultConfirmed") ? `${id}-adult-error` : undefined}
              className="size-5 shrink-0 accent-brand-700"
            />
            I am 18 years old or older.
          </label>
          {firstError(errors, "isAdultConfirmed") ? (
            <p id={`${id}-adult-error`} className="mt-1.5 ml-1 text-[14px] text-risk-600">
              {firstError(errors, "isAdultConfirmed")}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-[13.5px] font-semibold text-ink-700">
          Optional — none of these affect your place
        </legend>
        <div className="mt-3 flex flex-col divide-y divide-ink-100 overflow-hidden rounded-[20px] bg-white">
          {OPTIONAL.map((o) => (
            <Check key={o.name} id={`${id}-${o.name}`} name={o.name} detail={o.detail}>
              {o.label}
            </Check>
          ))}
        </div>
      </fieldset>

      {result?.serverError ? (
        <p role="alert" className="mt-5 text-[14px] text-risk-600">
          {result.serverError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "executing"}
        className="mt-8 flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-500 text-[16px] font-semibold text-on-brand hover:bg-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-100 disabled:text-ink-600"
      >
        <span>{status === "executing" ? "Saving…" : "Create my account"}</span>
        {status === "executing" ? null : ARROW_RIGHT}
      </button>

      <p className="mt-3 text-[13px] leading-[1.45] text-ink-500">
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
      <label htmlFor={id} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
        {label}
        {optional ? <span className="ml-1 font-normal text-ink-500">(optional)</span> : null}
      </label>
      <FieldShell className="h-14">
        <FieldInput
          {...input}
          id={id}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="text-[16px]"
        />
      </FieldShell>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[14px] text-pretty text-risk-600">
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
  children,
}: {
  id: string;
  name: string;
  detail?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-[60px] cursor-pointer items-center gap-3 px-4 py-3"
    >
      {/* Never defaultChecked — see the note at the top of this file. */}
      <input
        type="checkbox"
        id={id}
        name={name}
        aria-describedby={detail ? `${id}-detail` : undefined}
        className="size-5 shrink-0 accent-brand-700"
      />
      <div>
        <span className="block text-[15px] font-medium text-ink-900">{children}</span>
        {detail ? (
          <span id={`${id}-detail`} className="block text-[13px] text-pretty text-ink-500">
            {detail}
          </span>
        ) : null}
      </div>
    </label>
  );
}
