"use client";

import { FieldInput, FieldShell } from "@/components/ui/field-shell";

const EYE_OPEN = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EYE_CLOSED = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3l18 18" />
    <path d="M6.5 7C4 8.8 2.5 12 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.3-1.1" />
    <path d="M10 5.8c.6-.2 1.3-.3 2-.3 6 0 9.5 6.5 9.5 6.5s-.8 1.5-2.3 3" />
  </svg>
);

/**
 * The one password field, shared by join-form.tsx (both its "returning,
 * enter your password" and "new account, set a password" steps) and
 * reset-password-form.tsx — three places that used to each carry their own
 * copy of the same input + show/hide button. Built on FieldShell/FieldInput
 * (Phase 0) rather than a one-off border, so it gets the same 1px-border-
 * always focus ring every other field in the app already uses.
 */
export function PasswordField({
  id,
  show,
  onToggle,
  autoComplete,
  autoFocus,
  defaultValue,
}: {
  id: string;
  show: boolean;
  onToggle: () => void;
  autoComplete: "new-password" | "current-password";
  autoFocus?: boolean;
  defaultValue?: string;
}) {
  return (
    <FieldShell className="h-14">
      <FieldInput
        id={id}
        name="password"
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        className="text-[16px]"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="flex size-10 flex-none items-center justify-center rounded-xl text-ink-600 hover:text-ink-900"
      >
        {show ? EYE_CLOSED : EYE_OPEN}
      </button>
    </FieldShell>
  );
}
