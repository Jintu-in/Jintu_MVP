import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The pattern language — the handful of primitives every screen in
 * "Pattern language screens" is assembled from.
 *
 * The point of the design is that /learn, a roadmap, the dashboard, the
 * profile and the reader stop being five bespoke layouts and become one
 * vocabulary used five times. Building that vocabulary once is the only
 * way it stays true: five copies of an eyebrow pill drift within a month.
 *
 * Every piece here is presentational and server-safe. Nothing holds state.
 */

/**
 * The small capsule that names a region — "Roadmap", "Continue", "Your
 * record", "Why today". It is the label a heading would otherwise have to
 * carry, moved out so the heading can be a sentence.
 */
export function Eyebrow({
  children,
  glyph,
  className,
  tone = "quiet",
}: {
  children: React.ReactNode;
  /** A single character. Decorative — the words carry the meaning. */
  glyph?: string;
  className?: string;
  /** `brand` for a region that is the next action, `quiet` otherwise. */
  tone?: "quiet" | "brand";
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] leading-none whitespace-nowrap",
        tone === "brand"
          ? "border-brand-100 bg-brand-50 text-brand-900"
          : "border-ink-100 bg-ink-50 text-ink-500",
        className,
      )}
    >
      {glyph ? <span aria-hidden>{glyph}</span> : null}
      {children}
    </span>
  );
}

/**
 * An eyebrow with the statement under it. Every section on every screen
 * opens this way, which is what makes the screens feel like one product
 * rather than five.
 */
export function SectionHead({
  eyebrow,
  glyph,
  tone,
  title,
  sub,
  action,
  className,
}: {
  eyebrow: string;
  glyph?: string;
  tone?: "quiet" | "brand";
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: { label: string; href: Route };
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        <Eyebrow glyph={glyph} tone={tone}>
          {eyebrow}
        </Eyebrow>
        <h2 className="mt-3 text-[22px] leading-[1.25] font-medium text-balance text-ink-900 sm:text-[26px]">
          {title}
        </h2>
        {sub ? (
          <p className="mt-2 max-w-[60ch] text-[14.5px] leading-[1.6] text-pretty text-ink-600">
            {sub}
          </p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="flex min-h-11 shrink-0 items-center text-[13.5px] font-medium text-brand-700 hover:text-brand-800"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

/**
 * One measured fact. Mono, because every number in this product is mono —
 * that is the rule that lets you tell a count from a label at a glance.
 */
export function StatBadge({
  children,
  glyph,
  className,
}: {
  children: React.ReactNode;
  glyph?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3 py-1.5 font-mono text-[12px] leading-none whitespace-nowrap text-ink-700",
        className,
      )}
    >
      {glyph ? <span aria-hidden>{glyph}</span> : null}
      {children}
    </span>
  );
}

/**
 * The horizontally scrolling chip row.
 *
 * Scrolls rather than wraps, on purpose: at 390px a wrapping filter row
 * pushes the content it filters below the fold, and the whole screen is
 * built so the next action stays visible. The scrollbar is hidden and the
 * row is keyboard-reachable because it is a list of real links.
 */
export function ChipRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:px-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Chip({
  children,
  href,
  active,
}: {
  children: React.ReactNode;
  href: Route;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex min-h-10 flex-none items-center rounded-full border px-3.5 text-[13.5px] whitespace-nowrap",
        active
          ? "border-brand-700 bg-brand-700 text-white"
          : "border-ink-100 bg-white text-ink-900 hover:border-brand-700",
      )}
    >
      {children}
    </Link>
  );
}

/**
 * The two-character subject/level tags that sit above a card title.
 * "Data · Beg." — enough to sort by, short enough not to wrap.
 */
export function TagPair({ subject, level }: { subject: string; level: string }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <span className="rounded-md bg-brand-50 px-2 py-1 text-[11px] leading-none text-brand-900">
        {subject}
      </span>
      <span className="rounded-md bg-ink-100 px-2 py-1 text-[11px] leading-none text-ink-600">
        {level}
      </span>
    </span>
  );
}

/**
 * A numbered row — modules on a roadmap, topics inside a day, the steps on
 * the homepage. The number is mono and quiet; the title carries the line.
 */
export function NumberedRow({
  n,
  title,
  detail,
  meta,
  children,
}: {
  n: string;
  title: React.ReactNode;
  detail?: React.ReactNode;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5">
      <span className="w-6 shrink-0 pt-0.5 font-mono text-[12px] leading-[1.6] text-ink-500">
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] leading-[1.45] font-medium text-ink-900">{title}</div>
        {detail ? (
          <p className="mt-1.5 text-[14px] leading-[1.6] text-pretty text-ink-600">{detail}</p>
        ) : null}
        {meta ? (
          <div className="mt-2 font-mono text-[12px] leading-none text-ink-500">{meta}</div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/**
 * The thin progress rule used on cards and rows. Never labelled on its own
 * — a bar with no number beside it is decoration.
 */
export function ProgressRule({ pct, className }: { pct: number; className?: string }) {
  const width = Math.max(0, Math.min(100, pct));
  return (
    <span
      aria-hidden
      className={cn("block h-1 overflow-hidden rounded-full bg-ink-100", className)}
    >
      {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
      <span className="block h-1 rounded-full bg-brand-700" style={{ width: `${width}%` }} />
    </span>
  );
}

/** The page's one filled action. */
export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: Route;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-12 items-center justify-center rounded-lg bg-brand-700 px-5 text-[15px] font-medium text-white hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
        className,
      )}
    >
      {children}
    </Link>
  );
}
