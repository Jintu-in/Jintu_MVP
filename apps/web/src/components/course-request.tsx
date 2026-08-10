"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useId, useRef, useState } from "react";
import { NEEDS_ACCOUNT } from "@jintu/contracts";
import { requestCourse } from "@/actions/course-request";
import { ShareButton } from "@/components/share-button";
import { SignInDialog } from "@/components/sign-in-dialog";
import { browserKey } from "@/lib/browser-key";

const MAX = 600;

/**
 * The first thing on the site: ask for the course you want.
 *
 * Deliberately almost wordless. The field, two buttons, one line of small
 * print — anything else here is read as instructions, and a box you have to be
 * briefed on is a box nobody uses. The placeholder does the explaining.
 *
 * It looks like a chat box and it is not one. There is no model behind it and
 * nothing is generated; the text is filed and a person writes the curriculum.
 *
 * ── the states ──────────────────────────────────────────────────────────────
 *
 *   asking      typing, nothing sent
 *   signing-in  the dialog is open; the draft is untouched behind it
 *   sending     the action is in flight
 *   sent        filed, with the id, so it can be shared
 *   failed      something we own broke; the text is still there to retry
 *
 * The one that matters is `signing-in`. Requesting needs an account, and the
 * worst version of that is a box that takes your paragraph, sends you to a
 * sign-in page, and hands you back an empty box. Nothing here navigates: the
 * code arrives by email and goes into a dialog, so the draft never leaves the
 * state behind it. On success the request sends itself, because the person
 * already pressed the button that means "send this".
 */

type State =
  | { name: "asking" }
  | { name: "signing-in" }
  | { name: "sending" }
  | { name: "sent"; id: string }
  | { name: "failed"; message: string };

export function CourseRequest() {
  const id = useId();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<State>({ name: "asking" });
  const [count, setCount] = useState(0);

  /**
   * undefined = not looked yet, null = looked and storage is unavailable.
   *
   * Two states, not one, because they render differently and only one of them
   * is true on the server. Initialising to null made the server HTML say
   * "Needs browser storage, which looks off here" to every visitor, including
   * the overwhelming majority whose storage is fine, until hydration replaced
   * it. A warning that is wrong on first paint is worse than no warning.
   */
  const [key, setKey] = useState<string | null | undefined>(undefined);
  useEffect(() => setKey(browserKey("course-requests")), []);

  const { execute, reset } = useAction(requestCourse, {
    onSuccess: ({ data }) => {
      if (data?.id) setState({ name: "sent", id: data.id });
      // The header shows who you are and /learn lists your requests. Both are
      // server-rendered, so without this they keep showing the signed-out view
      // until something else happens to reload them.
      router.refresh();
    },
    onError: ({ error }) => {
      if (error.serverError === NEEDS_ACCOUNT) {
        setState({ name: "signing-in" });
        return;
      }
      setState({
        name: "failed",
        message: error.serverError ?? "That did not send. Try again.",
      });
    },
  });

  const send = () => {
    if (!key) return;
    setState({ name: "sending" });
    execute({ prompt: String(formRef.current?.prompt?.value ?? ""), requesterKey: key });
  };

  if (state.name === "sent") {
    return (
      <Sent
        id={state.id}
        onAgain={() => {
          reset();
          setState({ name: "asking" });
        }}
      />
    );
  }

  const busy = state.name === "sending";
  const tooLong = count > MAX;

  return (
    <div className="mt-8">
      <form ref={formRef} noValidate action={send}>
        {/* Visually hidden, not absent: the placeholder is a hint, and a hint
            is not a label for anyone using a screen reader. */}
        <label htmlFor={id} className="sr-only">
          Describe the job you want a course for
        </label>

        <div className="rounded-card border border-ink-200 bg-white focus-within:border-brand-600">
          <textarea
            id={id}
            name="prompt"
            rows={3}
            maxLength={MAX + 100}
            onChange={(e) => setCount(e.target.value.trim().length)}
            onKeyDown={(e) => {
              // Enter sends, Shift+Enter breaks the line. Matches what the box
              // looks like; a send that only works with a mouse, in something
              // shaped like a chat input, is a small daily annoyance.
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            placeholder="What job do you want? We will write the course for it."
            className="block w-full resize-y rounded-card bg-transparent px-4 py-3.5 text-ink-900 placeholder:text-ink-500 focus:outline-none"
          />
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={busy || !key || count < 10 || tooLong}
            className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
          >
            {busy ? "Sending…" : "Request a course"}
          </button>

          <Link
            href="/learn"
            className="flex h-12 items-center justify-center rounded-lg border border-ink-200 px-5 font-medium text-ink-800 hover:border-brand-600 hover:text-brand-800"
          >
            Browse courses
          </Link>
        </div>
      </form>

      <p className="mt-3 text-sm text-ink-500" aria-live="polite">
        {tooLong
          ? `${count - MAX} characters too many`
          : key === null
            ? "Needs browser storage, which looks off here."
            : "A person reads this. No AI."}
      </p>

      {state.name === "failed" ? (
        <p role="alert" className="mt-2 text-sm text-risk-800">
          {state.message}
        </p>
      ) : null}

      <SignInDialog
        open={state.name === "signing-in"}
        reason="A person writes these and sends them back to you, so we need somewhere to send it. Your draft is safe — it is still in the box behind this."
        onClose={() => setState({ name: "asking" })}
        onSignedIn={send}
      />
    </div>
  );
}

/**
 * Filed.
 *
 * Says wait, then asks whether you would like to see what already exists — in
 * that order, because the honest answer to "what happens now" is "nothing, for
 * a bit", and a page that hurries past that to a call-to-action is pretending
 * otherwise.
 */
function Sent({ id, onAgain }: { id: string; onAgain: () => void }) {
  return (
    <div className="mt-8" role="status" aria-live="polite">
      <div className="rounded-card border border-brand-200 bg-brand-50 p-5">
        <p className="font-semibold text-ink-900">Request received.</p>
        <p className="mt-1.5 text-pretty text-ink-700">
          A person writes these by hand — no AI — so give it a little time. It
          moves under your courses as it goes.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/learn"
            className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            Browse what already exists
          </Link>
          <ShareButton id={id} />
        </div>
      </div>

      <button
        type="button"
        onClick={onAgain}
        className="mt-3 text-sm text-ink-500 underline hover:text-ink-900"
      >
        Ask for another
      </button>
    </div>
  );
}
