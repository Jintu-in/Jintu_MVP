"use client";

import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useId, useRef, useState } from "react";
import { requestCourse } from "@/actions/course-request";
import { browserKey } from "@/lib/browser-key";

const MAX = 600;

/**
 * The first thing on the site: ask for the course you want.
 *
 * It looks like a chat box and it is not one. There is no model behind it,
 * nothing is generated, and the reply is the same sentence every time. Saying
 * that plainly in the reply is the whole design — a box that looks like an
 * assistant and answers like one, while a person quietly writes the thing by
 * hand three hours later, teaches people that this product's claims are
 * decorative. This one tells you it is a form the moment you use it.
 *
 * What it buys, before any of that is automated: the exact words people use
 * for the job they want. The vote pages capture demand for courses we already
 * named; this captures the ones we did not think of.
 */
export function CourseRequest() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [key, setKey] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [sent, setSent] = useState<string | null>(null);

  const { execute, result, status } = useAction(requestCourse, {
    onSuccess: () => setSent(formRef.current?.prompt?.value?.trim() ?? ""),
  });

  // Read after mount: localStorage does not exist while this renders on the
  // server, and reading it during render would make the first client paint
  // disagree with the HTML that arrived.
  useEffect(() => setKey(browserKey("course-requests")), []);

  const pending = status === "executing";
  const tooLong = count > MAX;

  if (sent !== null) return <Received asked={sent} onAgain={() => setSent(null)} />;

  return (
    <div className="mt-8">
      <form
        ref={formRef}
        noValidate
        action={(formData) => {
          if (!key) return;
          execute({ prompt: String(formData.get("prompt") ?? ""), requesterKey: key });
        }}
      >
        <label htmlFor={id} className="block text-sm font-medium text-ink-700">
          What job do you want? We will write the course for it.
        </label>

        <div className="mt-2 rounded-card border border-ink-200 bg-white focus-within:border-brand-600">
          <textarea
            id={id}
            name="prompt"
            rows={3}
            maxLength={MAX + 100}
            onChange={(e) => setCount(e.target.value.trim().length)}
            onKeyDown={(e) => {
              // Enter sends, Shift+Enter breaks the line. Matches what the box
              // looks like; a send button that only works with the mouse in
              // something shaped like a chat input is a small daily annoyance.
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
            placeholder="Backend engineer at a product company. I know Python but I have never shipped an API."
            className="block w-full resize-y rounded-card bg-transparent px-4 pt-3.5 pb-2 text-ink-900 placeholder:text-ink-500 focus:outline-none"
          />

          <div className="flex items-center justify-between gap-3 px-3 pb-3">
            <p className={tooLong ? "text-sm text-risk-800" : "text-sm text-ink-500"}>
              {tooLong ? `${count - MAX} characters too many` : "A person reads this. No AI."}
            </p>

            <button
              type="submit"
              disabled={pending || key === null || count < 10 || tooLong}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-700 px-4 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
            >
              {pending ? "Sending…" : "Request it"}
            </button>
          </div>
        </div>
      </form>

      {key === null ? (
        <p className="mt-2 text-sm text-ink-500">
          This needs browser storage, which looks disabled here. The curriculum
          below is free to read either way.
        </p>
      ) : null}

      {result?.serverError ? (
        <p role="alert" className="mt-2 text-sm text-risk-800">
          {result.serverError}
        </p>
      ) : null}

      <p className="mt-4 text-ink-600">
        Or{" "}
        <Link href="/learn" className="font-medium text-brand-800 underline hover:text-brand-900">
          browse the courses that already exist
        </Link>{" "}
        — all free, all readable without an account.
      </p>
    </div>
  );
}

/**
 * The reply.
 *
 * It commits to reading the request, not to writing the course. "About a day"
 * rather than a deadline, and no promise that it gets built at all, because
 * the only thing anyone can actually guarantee here is that a person will look
 * — and a landing page that overpromises on its first interaction is the kind
 * of thing the rest of this site is written to avoid.
 */
function Received({ asked, onAgain }: { asked: string; onAgain: () => void }) {
  return (
    <div className="mt-8" role="status" aria-live="polite">
      <div className="rounded-card border border-ink-100 bg-ink-50 p-4">
        <p className="text-sm font-medium text-ink-500">You asked for</p>
        <p className="mt-1 text-pretty text-ink-800">{asked}</p>
      </div>

      <div className="mt-3 rounded-card border border-brand-200 bg-brand-50 p-4">
        <p className="font-semibold text-ink-900">Got it — that is filed.</p>
        <p className="mt-2 text-pretty text-ink-700">
          Nothing is generated here. Somebody reads what you wrote and writes
          the six weeks by hand, which takes about a day. If it is a course we
          can do well, it appears under the curriculum; if it is not, we would
          rather not publish a bad one.
        </p>
        <p className="mt-3 text-pretty text-ink-700">
          There is nothing for you to do now. Put your number on the waitlist if
          you want telling when it is up, or start on a course that already
          exists.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/learn"
            className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            Browse the curriculum
          </Link>
          <a
            href="#waitlist"
            className="flex h-12 items-center justify-center rounded-lg border border-ink-200 px-5 font-medium text-ink-800 hover:border-brand-600 hover:text-brand-800"
          >
            Tell me when it is ready
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={onAgain}
        className="mt-3 text-sm text-ink-500 underline hover:text-ink-900"
      >
        Ask for another one
      </button>
    </div>
  );
}
