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

  /**
   * The border is always 1px and the focus ring is a `ring`, not a thicker
   * border. The design draws 2px ink on focus, but swapping 1px for 2px
   * reflows the input by a pixel on every focus and blur — the field appears
   * to twitch as you tab through it. A ring paints outside the box instead,
   * so it looks like the design and holds still.
   *
   * Only focus thickens it. A field that stays black because it has a value
   * in it looks permanently focused, and the whole sidebar then reads as
   * though the cursor is somewhere it is not.
   */
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-ink-100 bg-white",
        compact ? "h-9 pr-1 pl-2.5" : "h-12 pr-1.5 pl-3.5",
        focused && "border-ink-900 ring-1 ring-ink-900",
      )}
    >
      <svg
        aria-hidden
        width={compact ? 14 : 16}
        height={compact ? 14 : 16}
        viewBox="0 0 16 16"
        fill="none"
        className={cn("flex-none", active || focused ? "text-ink-900" : "text-ink-500")}
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
          "min-w-0 flex-1 bg-transparent text-ink-900 placeholder:text-ink-500 focus:outline-none",
          compact ? "text-[13px]" : "text-[14px]",
        )}
      />
      {/* Holds its slot whether or not there is anything to clear, so the
          text does not jump sideways on the first keystroke. */}
      <span className={cn("flex-none", compact ? "size-7" : "size-9")}>
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => commit("")}
            className="flex size-full items-center justify-center rounded text-ink-500 hover:text-ink-900"
          >
            <svg aria-hidden width={12} height={12} viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </span>
    </div>
  );
}
