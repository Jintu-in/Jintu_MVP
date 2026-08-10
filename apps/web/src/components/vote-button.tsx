"use client";

import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { voteForCourse } from "@/actions/proposals";
import { browserKey, isDone, markDone } from "@/lib/browser-key";

export function VoteButton({ slug, votes }: { slug: string; votes: number }) {
  const { execute, result, status } = useAction(voteForCourse);
  const [key, setKey] = useState<string | null>(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  // localStorage is not available during render on the server, and reading it
  // in render would make the first client paint disagree with the HTML.
  useEffect(() => {
    const k = browserKey("votes");
    setKey(k);
    if (k) setAlreadyVoted(isDone("votes", slug));
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
            markDone("votes", slug);
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
