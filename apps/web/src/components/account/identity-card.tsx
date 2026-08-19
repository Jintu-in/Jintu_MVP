"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { updateDisplayName } from "@/actions/account";

/**
 * Who this account is. The email is shown but not editable here — changing
 * the address you sign in with is an auth flow, not a settings field.
 */
export function IdentityCard({
  initials,
  name,
  email,
  displayName,
}: {
  initials: string;
  name: string;
  email: string;
  displayName: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(displayName ?? "");
  const { execute, result, status } = useAction(updateDisplayName, {
    onSuccess: () => setEditing(false),
  });

  return (
    <section className="pb-6">
      <div className="flex items-center gap-3.5">
        <span
          aria-hidden
          className="flex size-14 flex-none items-center justify-center rounded-card bg-brand-50 font-mono text-[20px] font-medium text-brand-700"
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[20px] leading-[1.3] font-medium text-ink-900">{name}</div>
          <div className="mt-1 truncate font-mono text-[14px] leading-[1.4] text-ink-500">
            {email}
          </div>
        </div>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-12 shrink-0 items-center px-2 text-[14px] font-medium text-brand-700"
          >
            Edit
          </button>
        ) : null}
      </div>

      {editing ? (
        <form
          className="mt-4"
          action={() => execute({ displayName: value })}
        >
          <label htmlFor="display-name" className="block text-[13px] text-ink-600">
            Display name
          </label>
          <input
            id="display-name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={name}
            className="mt-1.5 h-12 w-full rounded-lg border border-ink-100 bg-white px-3 text-[15px] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          />
          <div className="mt-2.5 flex gap-2">
            <button
              type="submit"
              disabled={status === "executing"}
              className="flex h-12 flex-1 items-center justify-center rounded-lg bg-brand-700 text-[15px] font-medium text-white hover:bg-brand-800"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setValue(displayName ?? "");
                setEditing(false);
              }}
              className="flex h-12 flex-1 items-center justify-center rounded-lg border border-ink-100 bg-white text-[15px] font-medium text-brand-700 hover:border-brand-700"
            >
              Cancel
            </button>
          </div>
          {result?.serverError ? (
            <p role="alert" className="mt-2 text-[14px] text-ink-900">
              {result.serverError}
            </p>
          ) : null}
        </form>
      ) : null}
    </section>
  );
}
