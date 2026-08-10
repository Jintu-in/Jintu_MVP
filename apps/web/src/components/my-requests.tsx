"use client";

import { useEffect, useState } from "react";
import { browserKey } from "@/lib/browser-key";
import { createClient } from "@/lib/supabase/client";

/**
 * The courses you asked for, and where each one has got to.
 *
 * A client component rather than part of the server-rendered page, because the
 * anonymous half of this is keyed on a uuid that only exists in localStorage.
 * Someone signed in gets their requests on any device; someone who is not gets
 * the ones this browser filed. One RPC covers both — see my_course_requests.
 *
 * Renders nothing at all when there are no requests, so /learn is unchanged
 * for the overwhelming majority who have never used the box.
 */

type Request = {
  id: string;
  prompt: string;
  status: "new" | "triaged" | "writing" | "published" | "declined";
  created_at: string;
};

/**
 * Statuses in the student's words, not the ops queue's.
 *
 * "new" says received, because that is what it means to the person waiting.
 * Nothing here states a completion time — a person writes these, and the queue
 * length is not something to promise against.
 */
const STATUS: Record<Request["status"], { label: string; detail: string; tone: string }> = {
  new: { label: "Received", detail: "Waiting for someone to read it.", tone: "text-ink-600" },
  triaged: { label: "Read", detail: "We have looked at it and it is in the queue.", tone: "text-ink-600" },
  writing: { label: "Being written", detail: "Someone is working on this one now.", tone: "text-brand-800" },
  published: { label: "Published", detail: "It is live — find it in the list above.", tone: "text-ok-800" },
  declined: {
    label: "Not building this",
    detail: "We could not do this one well enough to publish it.",
    tone: "text-ink-600",
  },
};

export function MyRequests() {
  const [requests, setRequests] = useState<Request[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const key = browserKey("course-requests");
      const supabase = createClient();

      // Passing null is fine and meaningful: a signed-in visitor with no key
      // still gets everything filed under their account.
      const { data, error } = await supabase.rpc("my_course_requests", {
        p_requester: key,
      });

      // Silent on failure, including the case where the migration has not been
      // applied. This is a personal extra on a public page; it must never be
      // the reason /learn looks broken.
      if (cancelled || error) return;
      setRequests((data ?? []) as Request[]);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!requests?.length) return null;

  return (
    <section className="mt-14 border-t border-ink-100 pt-10" aria-labelledby="my-requests">
      <h2 id="my-requests" className="text-2xl font-semibold text-balance text-ink-900">
        Courses you asked for
      </h2>

      <ul className="mt-5 space-y-3">
        {requests.map((r) => {
          const s = STATUS[r.status] ?? STATUS.new;
          return (
            <li key={r.id} className="rounded-card border border-ink-100 bg-white p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className={`text-sm font-semibold ${s.tone}`}>{s.label}</p>
                <p className="font-mono text-xs text-ink-500">
                  {new Date(r.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <p className="mt-1.5 text-pretty text-ink-800">{r.prompt}</p>
              <p className="mt-1 text-sm text-ink-500">{s.detail}</p>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-sm text-pretty text-ink-500">
        Signed out, this is what this browser asked for. Sign in and your
        requests follow you between devices.
      </p>
    </section>
  );
}
