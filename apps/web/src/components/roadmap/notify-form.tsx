"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { requestNotify } from "@/actions/notify";
import type { DraftRoadmap } from "@/lib/draft-roadmaps";
import { cn } from "@/lib/utils";

const CHECK_ICON = (
  <svg aria-hidden width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label
      className={cn(
        "flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-3.5 text-[15px]",
        checked ? "bg-brand-50 font-semibold text-link" : "bg-ink-50 font-medium text-ink-900",
      )}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden
        className={cn(
          "flex size-[22px] flex-none items-center justify-center rounded-[7px] border-2",
          checked ? "border-night-900 bg-night-900 text-white" : "border-ink-400 bg-white",
        )}
      >
        {checked ? CHECK_ICON : null}
      </span>
      <span>{children}</span>
    </label>
  );
}

export function NotifyForm({
  drafts,
  preselectedSlug,
  prefillEmail,
}: {
  drafts: DraftRoadmap[];
  preselectedSlug?: string;
  prefillEmail?: string | null;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(preselectedSlug && drafts.some((d) => d.slug === preselectedSlug) ? [preselectedSlug] : []),
  );
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [whatsapp, setWhatsapp] = useState(false);
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const { execute, isExecuting, result } = useAction(requestNotify, {
    onSuccess: () => setSent(true),
  });

  const toggle = (slug: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-1.5 rounded-2xl bg-ok-bg p-4 text-ok-700">
        <div className="text-[15px] leading-[1.5] font-semibold">We'll tell you.</div>
        <div className="text-[13.5px] leading-[1.5]">One message per roadmap, when it opens — nothing else.</div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <p className="text-[15px] leading-[1.6] text-pretty text-ink-600">
        Nothing is waiting to open right now — check back soon.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        execute({
          email,
          roadmapSlugs: [...selected],
          whatsapp,
          phone: whatsapp ? phone : undefined,
          website: "",
        });
      }}
      className="flex flex-col gap-4"
    >
      <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
        <legend className="t-sub mb-1 p-0 text-ink-900">Tell me when these open</legend>
        {drafts.map((d) => (
          <Checkbox key={d.slug} checked={selected.has(d.slug)} onChange={() => toggle(d.slug)}>
            {d.title}
          </Checkbox>
        ))}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notify-email" className="text-[14px] leading-5 font-semibold text-ink-900">
          Email
        </label>
        <input
          id="notify-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 rounded-2xl border-[1.5px] border-ink-200 px-4 text-[16px] text-ink-900"
        />
      </div>

      {/* Honeypot — never shown to a real visitor, never required. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      <label className="flex cursor-pointer items-start gap-3 text-[14.5px] leading-[1.45] text-ink-600">
        <input
          type="checkbox"
          checked={whatsapp}
          onChange={(e) => setWhatsapp(e.target.checked)}
          className="sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex size-[22px] flex-none items-center justify-center rounded-[7px] border-2",
            whatsapp ? "border-night-900 bg-night-900 text-white" : "border-ink-400 bg-white",
          )}
        >
          {whatsapp ? CHECK_ICON : null}
        </span>
        <span>Also tell me on WhatsApp. Your choice, nothing is ticked for you.</span>
      </label>

      {whatsapp ? (
        <input
          type="tel"
          required
          placeholder="WhatsApp number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-14 rounded-2xl border-[1.5px] border-ink-200 px-4 text-[16px] text-ink-900"
        />
      ) : null}

      <button
        type="submit"
        disabled={isExecuting || selected.size === 0}
        className="flex h-14 items-center justify-center rounded-2xl bg-night-900 text-[16.5px] font-semibold text-on-night disabled:bg-ink-100 disabled:text-ink-600"
      >
        {isExecuting ? "Saving…" : "Tell me when they open"}
      </button>

      {result.serverError ? (
        <p role="alert" className="text-[13.5px] leading-5 text-risk-600">
          {result.serverError}
        </p>
      ) : null}
    </form>
  );
}
