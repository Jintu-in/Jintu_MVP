"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * StatusKit's three labels — the roadmap list, the block page and role
 * pages all use this one component rather than three near-identical
 * badges. `draft` is included for completeness (`StatusKit` draws it) even
 * though RLS hides draft roadmaps from every read this app does today —
 * nothing currently calls this with `status="draft"`.
 */
export type RoadmapStatusValue = "draft" | "self_checked" | "practitioner_reviewed";

// stroke is hardcoded, not currentColor — this sits on bg-ok-600, and
// scripts/assert-contrast.mjs reads className text-* tokens, not inline SVG
// attributes (same workaround as step-reader.tsx's correct-answer check).
const CHECK_ICON = (
  <svg aria-hidden width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#0b4a32" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

function Chip({ status }: { status: RoadmapStatusValue }) {
  if (status === "practitioner_reviewed") {
    return (
      <span className="flex h-7 flex-none items-center gap-1.5 rounded-xl bg-ok-bg px-2.5 text-[13px] font-semibold whitespace-nowrap text-ok-700">
        <span aria-hidden className="flex size-4 flex-none items-center justify-center rounded-full bg-ok-600">
          {CHECK_ICON}
        </span>
        <span>Practitioner-reviewed</span>
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="flex h-7 flex-none items-center gap-1.5 rounded-xl bg-ink-100 px-2.5 text-[13px] font-semibold whitespace-nowrap text-ink-600">
        <span aria-hidden className="size-2 flex-none rounded-full border-2 border-ink-400" />
        <span>Being rebuilt</span>
      </span>
    );
  }
  return (
    <span className="flex h-7 flex-none items-center gap-1.5 rounded-xl bg-warn-bg px-2.5 text-[13px] font-semibold whitespace-nowrap text-warn-600">
      <span aria-hidden className="size-2 flex-none rounded-full bg-amber-600" />
      <span>Self-checked</span>
    </span>
  );
}

const EXPLAIN: Record<"self_checked" | "practitioner_reviewed", { title: string; body: string }> = {
  self_checked: {
    title: "Self-checked",
    body: "Written and tested by the Jintu team and three test learners. Nobody who does this job has reviewed it yet. If something looks wrong, tell us from any lesson.",
  },
  practitioner_reviewed: {
    title: "Practitioner-reviewed",
    body: "Everything self-checked roadmaps promise, plus a named practitioner signed off: nothing wrong, nothing out of date, how the work is done in India today.",
  },
};

/**
 * The chip, plus the block page's own "What does this mean?" disclosure —
 * same closed/open/Esc/outside-click shape as every other popover built
 * this engagement (HelpBox, the consents cards). `explain` opts into the
 * button; list cards pass neither it nor reviewer info, just the chip.
 */
export function StatusLabel({
  status,
  explain,
  reviewedByName,
  reviewedByTitle,
  reviewedOn,
}: {
  status: RoadmapStatusValue;
  explain?: boolean;
  reviewedByName?: string | null;
  reviewedByTitle?: string | null;
  reviewedOn?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (!explain || status === "draft") return <Chip status={status} />;
  const info = EXPLAIN[status];

  return (
    <div ref={wrap} className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <Chip status={status} />
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="h-8 bg-transparent p-0 text-[14px] font-semibold text-link underline decoration-1 underline-offset-[3px]"
        >
          What does this mean?
        </button>
      </div>
      {open ? (
        <div
          role="dialog"
          aria-label={`What ${info.title.toLowerCase()} means`}
          className={cn(
            "flex flex-col gap-2.5 rounded-[20px] border border-ink-100 bg-white p-5 shadow-[0_10px_28px_rgba(12,42,48,0.12)]",
          )}
        >
          <div className="font-heading text-[17px] leading-[22px] font-bold text-ink-900">{info.title}</div>
          <div className="text-[14.5px] leading-[22px] text-ink-600">{info.body}</div>
          {status === "practitioner_reviewed" && reviewedByName ? (
            <div className="font-mono text-[12.5px] leading-[18px] text-ink-500">
              Reviewed by {reviewedByName}
              {reviewedByTitle ? `, ${reviewedByTitle}` : ""}
              {reviewedOn ? ` · ${reviewedOn}` : ""}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
