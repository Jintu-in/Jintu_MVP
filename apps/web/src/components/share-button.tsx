"use client";

import { useState } from "react";

/**
 * Copies a link to one request.
 *
 * navigator.share where it exists, which on an Android phone is the system
 * sheet with WhatsApp near the front — the actual way one of these reaches a
 * classmate. Clipboard everywhere else, with the button saying so, because a
 * button that appears to do nothing has done nothing as far as anyone can tell.
 *
 * The link needs a session to open. That is the point rather than a limitation:
 * the row is free text somebody typed, and a link forwarded out of a group
 * chat should not publish it to the web.
 */
export function ShareButton({ id, subtle = false }: { id: string; subtle?: boolean }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/requests/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "A course I asked Jintu for", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Dismissing the share sheet throws, and so does a clipboard the browser
      // declines to grant. Neither is worth interrupting anyone over.
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className={
        subtle
          ? "text-sm text-brand-800 underline hover:text-brand-900"
          : "flex h-12 items-center justify-center rounded-lg border border-ink-200 px-5 font-medium text-ink-800 hover:border-brand-600 hover:text-brand-800"
      }
    >
      {copied ? "Link copied" : "Share this request"}
    </button>
  );
}
