"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { voteForCourse } from "@/actions/proposals";

const STORAGE_KEY = "jintu.voter-key";

/**
 * A random id, minted once per browser and kept in localStorage.
 *
 * Deliberately not a cookie, an IP address, or a fingerprint. A cookie would
 * be sent on every request and would need to sit inside the consent regime; an
 * IP is personal data under DPDP. This is a bare uuid that exists so the same
 * browser cannot run the count up on its own, and it never leaves this
 * feature.
 *
 * It is weak on purpose-built abuse: clearing site data resets it. That is why
 * nothing here claims the number represents people.
 */
function voterKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;
    const minted = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, minted);
    return minted;
  } catch {
    // Private mode, or storage disabled. Voting is not important enough to
    // break the page over.
    return null;
  }
}

export function VoteButton({ slug, votes }: { slug: string; votes: number }) {
  const { execute, result, status } = useAction(voteForCourse);
  const [key, setKey] = useState<string | null>(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  // localStorage is not available during render on the server, and reading it
  // in render would make the first client paint disagree with the HTML.
  useEffect(() => {
    const k = voterKey();
    setKey(k);
    if (k) setAlreadyVoted(window.localStorage.getItem(`${STORAGE_KEY}.${slug}`) === "1");
  }, [slug]);

  const pending = status === "executing";
  const count = result?.data?.votes ?? votes;
  const voted = alreadyVoted || Boolean(result?.data);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={pending || voted || key === null}
          onClick={() => {
            if (!key) return;
            window.localStorage.setItem(`${STORAGE_KEY}.${slug}`, "1");
            setAlreadyVoted(true);
            execute({ slug, voterKey: key });
          }}
          // ink-500 for the disabled fill, not ink-300: the label stays white
          // in both states, and white on ink-300 is 1.89:1. "Vote counted" is
          // the message most people will actually read, so it cannot be the
          // unreadable one.
          className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
        >
          {voted ? "Vote counted" : pending ? "Counting…" : "I want this course"}
        </button>

        <p className="font-mono text-sm text-ink-500" aria-live="polite">
          {count === 1 ? "1 vote" : `${count} votes`}
        </p>
      </div>

      {key === null ? (
        <p className="mt-3 text-sm text-ink-500">
          Voting needs browser storage, which looks disabled here.
        </p>
      ) : null}

      {result?.serverError ? (
        <p role="alert" className="mt-3 text-sm text-risk-800">
          {result.serverError}
        </p>
      ) : null}
    </div>
  );
}
