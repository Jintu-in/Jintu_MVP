"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { updatePublicProfile } from "@/actions/account";
import { cn, formatCount } from "@/lib/utils";

/**
 * The public-profile toggle, with a live preview of what a stranger sees.
 *
 * Nobody should switch on a public page without seeing its contents, so the
 * preview is not a description of the page — it is the page's actual
 * contents at miniature: monogram, handle, the four numbers, the grid.
 *
 * The numbers arrive as props and are zero-state placeholders until the
 * record half of this screen exists (session P2). Showing the real shape
 * with honest zeros is the point: a preview that invented numbers would be
 * worse than no preview.
 */
export interface PublicPreviewStats {
  daysLearned: number;
  currentStreak: number;
  longestStreak: number;
  points: number;
}

function Preview({
  initials,
  handle,
  stats,
}: {
  initials: string;
  handle: string;
  stats: PublicPreviewStats;
}) {
  const numbers = [
    { value: stats.daysLearned, label: "days" },
    { value: stats.currentStreak, label: "streak" },
    { value: stats.longestStreak, label: "longest" },
    { value: stats.points, label: "points" },
  ];
  return (
    <div className="mt-3 rounded-card border border-ink-100 bg-ink-50 p-3.5">
      <div className="font-mono text-[11px] leading-none tracking-[.06em] text-ink-500 uppercase">
        What a stranger would see
      </div>
      <div className="mt-3 rounded-lg border border-ink-100 bg-white p-3.5">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex size-8 flex-none items-center justify-center rounded-lg bg-brand-50 font-mono text-[13px] font-medium text-brand-700"
          >
            {initials}
          </span>
          <span className="font-mono text-[13px] text-ink-900">/u/{handle}</span>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {numbers.map((n) => (
            <div key={n.label}>
              <div className="font-mono text-[15px] leading-none font-medium text-ink-900">
                {formatCount(n.value)}
              </div>
              <div className="mt-1 text-[11px] leading-none text-ink-500">{n.label}</div>
            </div>
          ))}
        </div>
        {/* The grid, at miniature. One element, decorative — the numbers
            above already carry the fact for a screen reader. */}
        <div aria-hidden className="mt-3 grid grid-cols-[repeat(28,1fr)] gap-[2px]">
          {Array.from({ length: 56 }, (_, i) => (
            <span key={i} className="aspect-square rounded-[1px] border border-ink-100 bg-ink-50" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PublicProfileCard({
  initials,
  initialHandle,
  initialIsPublic,
  suggestedHandle,
  stats,
  siteHost,
}: {
  initials: string;
  initialHandle: string | null;
  initialIsPublic: boolean;
  suggestedHandle: string;
  stats: PublicPreviewStats;
  siteHost: string;
}) {
  const [handle, setHandle] = useState(initialHandle ?? suggestedHandle);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [copied, setCopied] = useState(false);
  const { execute, result, status } = useAction(updatePublicProfile, {
    onSuccess: ({ data }) => {
      if (data) setIsPublic(data.isPublic);
    },
    onError: () => setIsPublic(initialIsPublic),
  });

  const url = `${siteHost}/u/${handle}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="border-t border-ink-100 py-6">
      <h2 className="text-[15px] leading-[1.4] font-medium text-ink-900">Public profile</h2>

      <div className="mt-3 flex items-start justify-between gap-4">
        <label htmlFor="public-toggle" className="max-w-[46ch] text-[14px] leading-[1.7] text-ink-600">
          {isPublic ? "Show a public profile at" : "Show a public profile"}
          {isPublic ? <span className="mt-1 block font-mono text-[13px] text-ink-900">{url}</span> : null}
        </label>
        <button
          id="public-toggle"
          type="button"
          role="switch"
          aria-checked={isPublic}
          aria-label="Show a public profile"
          disabled={status === "executing"}
          onClick={() => {
            const next = !isPublic;
            setIsPublic(next); // optimistic
            execute({ handle, isPublic: next });
          }}
          className={cn(
            "relative h-7 w-12 flex-none rounded-full border transition-colors",
            isPublic ? "border-brand-700 bg-brand-700" : "border-ink-200 bg-ink-100",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute top-0.5 size-5 rounded-full bg-white transition-[left]",
              isPublic ? "left-[26px]" : "left-0.5",
            )}
          />
        </button>
      </div>

      {isPublic ? (
        <div className="mt-3 flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 font-mono text-[13px] text-ink-900">
            {url}
          </span>
          <button
            type="button"
            onClick={copy}
            className="flex h-12 shrink-0 items-center rounded-lg border border-ink-100 bg-white px-3.5 text-[14px] font-medium text-brand-700 hover:border-brand-700"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : (
        <div className="mt-3">
          <label htmlFor="handle" className="block text-[13px] text-ink-600">
            Your address
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="font-mono text-[13px] text-ink-500">{siteHost}/u/</span>
            <input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="h-12 min-w-0 flex-1 rounded-lg border border-ink-100 bg-white px-3 font-mono text-[14px] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            />
          </div>
        </div>
      )}

      <Preview initials={initials} handle={handle} stats={stats} />

      <p className="mt-3 max-w-[62ch] text-[13px] leading-[1.7] text-pretty text-ink-500">
        Your email is never shown. You can turn this off at any time and the page
        disappears immediately.
      </p>

      {result?.serverError ? (
        <p role="alert" className="mt-2 text-[14px] text-ink-900">
          {result.serverError}
        </p>
      ) : null}
      {result?.validationErrors?.handle?._errors?.[0] ? (
        <p role="alert" className="mt-2 text-[14px] text-ink-900">
          {result.validationErrors.handle._errors[0]}
        </p>
      ) : null}
    </section>
  );
}
