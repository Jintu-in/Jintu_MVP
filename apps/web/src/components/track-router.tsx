"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useId, useRef, useState } from "react";
import { NEEDS_ACCOUNT } from "@jintu/contracts";
import { requestCourse } from "@/actions/course-request";
import { ShareButton } from "@/components/share-button";
import { SignInDialog } from "@/components/sign-in-dialog";
import { StatusPill } from "@/components/status-pill";
import { browserKey } from "@/lib/browser-key";

/**
 * The homepage router: type a subject, get an honest answer about it.
 *
 * Three outcomes, and the ranking between them is the whole design. A sprint
 * that matches goes first and largest, because it is the only thing here that
 * takes money. Nothing built yet goes last and stays deliberately thin — a
 * satisfying "here is a free outline" is the thing a chat window already gives
 * away for nothing, and building a better one is how you compete with Gemini
 * on its own ground and lose.
 *
 * The middle route from the spec — "closest match, 60% overlap" — is not here.
 * It needs a per-track skills overlap that nothing in this repo computes, and
 * a percentage nobody measured is exactly the kind of number the rest of this
 * page promises not to print.
 */

export type RouterTrack = {
  slug: string;
  title: string;
  summary: string;
  weeks: number;
  artifacts: number;
};

type Result =
  | { kind: "none" }
  | { kind: "sprint"; track: RouterTrack }
  | { kind: "unbuilt"; typed: string };

/**
 * Matches on words rather than substrings.
 *
 * "data" should find "Data Analyst — first job"; "data analyst at a startup"
 * should find it too, and "an" should find nothing. Scored by how many of the
 * typed words appear in the title, so a longer sentence still lands on the
 * right track rather than failing because it is not a prefix.
 */
function match(typed: string, tracks: RouterTrack[]): RouterTrack | null {
  const words = typed
    .toLowerCase()
    .split(/[^a-z0-9+#]+/)
    .filter((w) => w.length > 2);

  if (!words.length) return null;

  let best: { track: RouterTrack; score: number } | null = null;

  for (const track of tracks) {
    const haystack = `${track.title} ${track.slug}`.toLowerCase();
    const score = words.filter((w) => haystack.includes(w)).length;
    if (score > 0 && (!best || score > best.score)) best = { track, score };
  }

  return best?.track ?? null;
}

export function TrackRouter({
  tracks,
  signedIn,
}: {
  tracks: RouterTrack[];
  signedIn: boolean;
}) {
  const id = useId();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [result, setResult] = useState<Result>({ kind: "none" });
  const [signingIn, setSigningIn] = useState(false);
  const [requested, setRequested] = useState<string | null>(null);

  const { execute, status } = useAction(requestCourse, {
    onSuccess: ({ data }) => {
      if (data?.id) setRequested(data.id);
      router.refresh();
    },
    onError: ({ error }) => {
      if (error.serverError === NEEDS_ACCOUNT) setSigningIn(true);
    },
  });

  const check = () => {
    const typed = String(formRef.current?.q?.value ?? "").trim();
    if (!typed) return;
    setRequested(null);
    const found = match(typed, tracks);
    setResult(found ? { kind: "sprint", track: found } : { kind: "unbuilt", typed });
  };

  const ask = () => {
    if (result.kind !== "unbuilt") return;
    const key = browserKey("course-requests");
    if (!key) return;
    execute({ prompt: result.typed, requesterKey: key });
  };

  return (
    <div>
      <form
        ref={formRef}
        noValidate
        action={check}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor={id} className="sr-only">
          What do you want to learn?
        </label>
        {/* min-w-0 so the input can actually shrink inside the flex row;
            without it a long placeholder sets a floor and the button is
            pushed off a narrow screen. */}
        <input
          id={id}
          name="q"
          type="text"
          maxLength={120}
          placeholder="data analyst"
          className="h-12 w-full min-w-0 flex-1 rounded-lg border border-ink-200 px-4 text-[15px] text-ink-900 placeholder:text-ink-500 focus-visible:border-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:max-w-md"
        />
        {/* The only primary button on the page. Full width on a phone, where a
            half-width button beside nothing looks like a mistake. */}
        <button
          type="submit"
          className="h-12 w-full shrink-0 rounded-lg bg-brand-700 px-6 text-[15px] font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:w-auto"
        >
          Check
        </button>
      </form>

      {/*
        Real examples only — every one of these resolves to something.

        Chips rather than a sentence of inline links. Inline text links inside
        13px copy are a ~16px tap target on a phone, which is half what a thumb
        needs; a bordered chip with h-9 and horizontal padding is a real one,
        and wraps cleanly at 360px instead of reflowing mid-list.
      */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-ink-500">Try</span>
        {tracks.slice(0, 3).map((t) => (
          <Chip
            key={t.slug}
            onClick={() => {
              if (formRef.current?.q) formRef.current.q.value = t.title;
              check();
            }}
          >
            {t.title.split(" — ")[0]}
          </Chip>
        ))}
        <Chip
          onClick={() => {
            if (formRef.current?.q) formRef.current.q.value = "battery pack engineering";
            check();
          }}
        >
          Something else
        </Chip>
      </div>

      <div aria-live="polite">
        {result.kind === "sprint" ? <SprintResult track={result.track} /> : null}
        {result.kind === "unbuilt" ? (
          <UnbuiltResult
            signedIn={signedIn}
            typed={result.typed}
            requestedId={requested}
            pending={status === "executing"}
            onAsk={ask}
          />
        ) : null}
      </div>

      <SignInDialog
        open={signingIn}
        reason="A person writes these and sends them back to you, so we need somewhere to send it."
        onClose={() => setSigningIn(false)}
        onSignedIn={() => {
          setSigningIn(false);
          ask();
        }}
      />
    </div>
  );
}

/** A tappable example. h-9 plus padding is a real target; 13px inline text is not. */
function Chip({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 items-center rounded-full border border-ink-200 bg-white px-3.5 text-[13px] text-ink-600 hover:border-brand-600 hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
    >
      {children}
    </button>
  );
}

/**
 * Route A — a sprint exists.
 *
 * The heaviest thing on the page, deliberately: it is the only outcome that
 * leads to money, and the brief's warning is that a homepage about "learn
 * anything" buries the one thing that earns. So it gets the filled button and
 * Route C does not.
 *
 * Deliberately does not print a cohort date or a seat count. There is no
 * cohort row in the database; a date here would be a commitment somebody could
 * plan around, invented by a component. When cohorts exist this reads them and
 * says so.
 */
function SprintResult({ track }: { track: RouterTrack }) {
  return (
    <div className="mt-6 rounded-card border border-ink-100 bg-white p-5 sm:p-6">
      <StatusPill tone="active">Sprint</StatusPill>

      <h2 className="mt-3 text-lg leading-snug font-medium text-balance text-ink-900 sm:text-xl">
        {track.title}
      </h2>

      <p className="mt-1.5 font-mono text-[13px] text-ink-500">
        {track.weeks} weeks · {track.artifacts}{" "}
        {track.artifacts === 1 ? "artifact" : "artifacts"} · ₹999 once
      </p>

      <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
        {track.summary}
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Link
          href={`/learn/${track.slug}`}
          className="flex h-11 items-center justify-center rounded-lg bg-brand-700 px-4 text-[15px] font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Read the curriculum — free
        </Link>
        <a
          href="#waitlist"
          className="flex h-11 items-center justify-center rounded-lg border border-ink-200 px-4 text-[15px] font-medium text-ink-800 hover:border-brand-600 hover:text-brand-800"
        >
          Join the waitlist
        </a>
      </div>
    </div>
  );
}

/**
 * Route C — nothing built.
 *
 * Thinner than Route A on purpose, and it does not generate an outline. There
 * is no model behind this box; a plausible six-week plan produced in a second
 * is the thing a chat window already gives away, and shipping a worse copy of
 * it would undercut the one thing here that is different.
 */
function UnbuiltResult({
  signedIn,
  typed,
  requestedId,
  pending,
  onAsk,
}: {
  signedIn: boolean;
  typed: string;
  requestedId: string | null;
  pending: boolean;
  onAsk: () => void;
}) {
  if (requestedId) {
    return (
      <div className="mt-6 rounded-card border border-ink-100 bg-white p-5 sm:p-6" role="status">
        <StatusPill tone="active">Requested</StatusPill>
        <h2 className="mt-3 text-lg leading-snug font-medium break-words text-ink-900">{typed}</h2>
        <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
          A person reads these and writes the weeks by hand, so give it a little
          time. It moves under your courses as it goes.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Link
            href="/tracks"
            className="flex h-11 items-center justify-center rounded-lg bg-brand-700 px-4 text-[15px] font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            See it in your tracks
          </Link>
          <Link
            href="/learn"
            className="flex h-11 items-center justify-center rounded-lg border border-ink-200 px-4 text-[15px] font-medium text-ink-800 hover:border-brand-600 hover:text-brand-800"
          >
            Browse what exists
          </Link>
        </div>
        <div className="mt-3">
          <ShareButton id={requestedId} subtle />
        </div>
      </div>
    );
  }

  return (
    // Dashed and unfilled, against Route A's solid border and filled button.
    // The brief is explicit that this must stay visibly thinner: a satisfying
    // "nothing here yet" is the free thing a chat window already does.
    <div className="mt-6 rounded-card border border-dashed border-ink-200 bg-ink-50 p-5 sm:p-6">
      <StatusPill>Not built yet</StatusPill>
      <h2 className="mt-3 text-lg leading-snug font-medium break-words text-ink-900">{typed}</h2>

      <p className="mt-2 max-w-[62ch] text-[15px] leading-[1.7] text-pretty text-ink-600">
        No outline, and not a generated one either — a person writes these. Ask
        for it and it joins the queue.
      </p>

      {/*
        Said before the button, not after the attempt.
        The gate used to be a surprise: press "ask", get a dialog. Telling
        people up front costs one line and removes the moment where a page
        appears to reject you. The button still works — pressing it opens the
        same dialog and sends the request once you are through it — so this is
        a warning, not a wall.
      */}
      {!signedIn ? (
        <p className="mt-3 text-[13px] text-ink-500">
          You will need to sign in first — a person writes these and sends them
          back to you, so we need somewhere to send it.
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={onAsk}
          disabled={pending}
          className="flex h-11 items-center justify-center rounded-lg border border-brand-700 bg-white px-4 text-[15px] font-medium text-brand-800 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:border-ink-200 disabled:text-ink-500"
        >
          {pending ? "Asking…" : signedIn ? "Ask for this course" : "Sign in and ask for this"}
        </button>
        <Link
          href="/learn"
          className="flex h-11 items-center justify-center rounded-lg px-4 text-[15px] font-medium text-ink-700 hover:text-brand-800"
        >
          Browse what exists
        </Link>
      </div>
    </div>
  );
}
