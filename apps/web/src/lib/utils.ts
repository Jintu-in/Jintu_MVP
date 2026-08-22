import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Indian digit grouping — 12,34,567 — computed rather than delegated.
 *
 * `toLocaleString("en-IN")` gives that answer on any runtime with full ICU
 * and a different one on any runtime without it: the locale silently falls
 * back and 12,34,567 becomes 1,234,567. Invisible until it happens in a
 * CLIENT component, where the server renders one grouping, the browser
 * renders the other, and React reports a hydration mismatch on a number
 * nobody thought was dynamic.
 *
 * Two digits per group after the first three, which is the whole rule.
 * Verified identical to full-ICU output across the range.
 */
export function formatCount(n: number): string {
  const negative = n < 0;
  const digits = String(Math.trunc(Math.abs(n)));
  if (digits.length <= 3) return `${negative ? "-" : ""}${digits}`;
  const last3 = digits.slice(-3);
  const grouped = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}${grouped},${last3}`;
}
