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
 * Deliberately almost wordless. The field, two buttons, one line of small
 * print — anything else here is read as instructions, and a box you have to
 * be briefed on is a box nobody uses. The placeholder does the explaining.
 *
 * It looks like a chat box and it is not one. There is no model behind it and
 * nothing is generated; the text is filed and a person writes the curriculum.
 * The "No AI" line stays even in the trimmed version, because a box shaped
 * like an assistant that quietly turns into a person three hours later teaches
 * people that this site's claims are decorative.
 */
export function CourseRequest() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
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
  const [count, setCount] = useState(0);
  const [sent, setSent] = useState(false);

  const { execute, result, status } = useAction(requestCourse, {
    onSuccess: () => setSent(true),
  });

  // Read after mount: localStorage does not exist while this renders on the
  // server, and reading it during render would make the first client paint
  // disagree with the HTML that arrived.
  useEffect(() => setKey(browserKey("course-requests")), []);

  const pending = status === "executing";
  const tooLong = count > MAX;

  if (sent) return <Received onAgain={() => setSent(false)} />;

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
            disabled={pending || !key || count < 10 || tooLong}
            className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-ink-500"
          >
            {pending ? "Sending…" : "Request a course"}
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

      {result?.serverError ? (
        <p role="alert" className="mt-2 text-sm text-risk-800">
          {result.serverError}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The reply.
 *
 * Commits to reading the request, not to writing the course, and gives a day
 * rather than a deadline — on a page whose own copy says we will never publish
 * a figure we cannot evidence, the first interaction is a poor place to start.
 */
function Received({ onAgain }: { onAgain: () => void }) {
  return (
    <div className="mt-8" role="status" aria-live="polite">
      <div className="rounded-card border border-brand-200 bg-brand-50 p-5">
        <p className="font-semibold text-ink-900">Request received.</p>
        <p className="mt-1.5 text-pretty text-ink-700">
          A person writes these by hand — no AI. Check your courses for the
          status.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/learn"
            className="flex h-12 items-center justify-center rounded-lg bg-brand-700 px-5 font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            Check your courses
          </Link>
          <a
            href="#waitlist"
            className="flex h-12 items-center justify-center rounded-lg border border-ink-200 px-5 font-medium text-ink-800 hover:border-brand-600 hover:text-brand-800"
          >
            Tell me when it is up
          </a>
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
