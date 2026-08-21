"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toQueryString, type Filters } from "@/lib/catalogue-filters";
import { cn } from "@/lib/utils";

/**
 * The catalogue's one search field.
 *
 * The value lives in the URL like every other filter; this component only
 * owns the 200ms of typing before it gets there. Without the debounce every
 * keystroke is a navigation and a server render, and the field feels like it
 * is fighting you.
 *
 * `replace`, not `push`: the back button should undo the search, not walk
 * backwards through the letters of it.
 *
 * One field, two places — the sidebar at lg and the page above the chip row
 * below it. They are the same control at two widths, never both visible.
 */
export function CatalogueSearch({
  filters,
  size = "regular",
}: {
  filters: Filters;
  /** "compact" is the 240px sidebar; "regular" is the mobile page. */
  size?: "regular" | "compact";
}) {
  const router = useRouter();
  const [value, setValue] = useState(filters.q);
  const [focused, setFocused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);

  // The URL is the source of truth: a back navigation, a cleared pill or a
  // link from the homepage changes q under this field, and the field follows.
  useEffect(() => {
    if (!dirty.current) setValue(filters.q);
  }, [filters.q]);

  const commit = (next: string) => {
    dirty.current = true;
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      dirty.current = false;
      router.replace(`/learn${toQueryString({ ...filters, q: next.trim() })}` as Route, {
        scroll: false,
      });
    }, 200);
  };

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const compact = size === "compact";
  const active = value.length > 0;

  return (
    <div className="relative">
      <svg
        aria-hidden
        width={compact ? 14 : 16}
        height={compact ? 14 : 16}
        viewBox="0 0 16 16"
        fill="none"
        className={cn(
          "pointer-events-none absolute",
          compact ? "top-[13px] left-2.5" : "top-4 left-3.5",
          active ? "text-ink-900" : "text-ink-500",
        )}
      >
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
        <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => commit(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search roadmaps"
        aria-label="Search roadmaps"
        className={cn(
          "w-full rounded-lg bg-white text-ink-900 placeholder:text-ink-500 focus:outline-none",
          compact ? "h-10 pr-8 pl-8 text-[13px]" : "h-12 pr-10 pl-10 text-[14px]",
          // The design thickens the border to 2px ink on focus rather than
          // tinting it — the field is the only thing on the page that does
          // this, which is what makes it findable.
          focused || active ? "border-2 border-ink-900" : "border border-ink-100",
        )}
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => commit("")}
          className={cn(
            "absolute flex items-center justify-center text-ink-500 hover:text-ink-900",
            compact ? "top-1 right-1 size-8" : "top-1.5 right-1.5 size-9",
          )}
        >
          <svg aria-hidden width={13} height={13} viewBox="0 0 14 14" fill="none">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
