import { CATEGORY_ACCENT, type CategoryKey } from "@/components/ui/category-accent";
import { cn } from "@/lib/utils";

/**
 * The product, at small scale, for the homepage.
 *
 * Every one of these replaced a sentence that described it. "Twenty modules
 * in one order, not a search results page" is a claim about something
 * visual; twenty module titles in order is the thing itself, and it cannot
 * be wrong about the product in the way a sentence can.
 *
 * Two rules held throughout:
 *
 *   - Real data where the shape allows it. The spine is the data analyst
 *     roadmap's actual twenty modules, read from the database. A drawn
 *     approximation would drift the first time the curriculum changed, and
 *     the whole point is that these are not illustrations.
 *   - Decorative only. Everything here is aria-hidden and paired with the
 *     heading it evidences — a screen reader gets the claim once, in words,
 *     rather than twenty unlabelled bars.
 */

/* ── the module spine ─────────────────────────────────────────────────────
   Sequenced, not searched. One bar per module, in order, with the week range
   beside it. `mini` is the 96px version that rides in step 01. */

export function ModuleSpine({
  modules,
  mini = false,
  className,
}: {
  modules: { position: number; title: string; weekRange: string | null }[];
  mini?: boolean;
  className?: string;
}) {
  if (modules.length === 0) return null;

  if (mini) {
    return (
      <div aria-hidden className={cn("flex flex-col justify-center gap-[3px]", className)}>
        {modules.map((m, i) => (
          <span
            key={m.position}
            className={cn("h-[3px] rounded-full", i < 3 ? "bg-brand-700" : "bg-ink-200")}
            // Widths track the title lengths, so the block reads as a list of
            // real things rather than a bar chart of nothing.
            style={{ width: `${Math.min(100, 34 + m.title.length * 1.7)}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden className={cn("flex flex-col gap-[7px]", className)}>
      {modules.map((m, i) => (
        <div key={m.position} className="flex items-center gap-2.5">
          <span className="w-4 flex-none font-mono text-[10px] leading-none text-ink-500">
            {String(m.position).padStart(2, "0")}
          </span>
          <span
            className={cn("h-[5px] flex-none rounded-full", i < 3 ? "bg-brand-700" : "bg-ink-200")}
            style={{ width: `${Math.min(52, 14 + m.title.length * 0.9)}%` }}
          />
          <span className="min-w-0 truncate text-[11.5px] leading-none text-ink-600">
            {m.title}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── one day, as a card ───────────────────────────────────────────────────
   What step 02 is talking about: a day with a length on it and a bar that
   remembers where you stopped. */

export function DayCardMini({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("flex flex-col justify-center rounded-lg border border-ink-100 bg-white p-2.5", className)}
    >
      <div className="font-mono text-[9px] leading-none text-ink-500">DAY 45 · 55 MIN</div>
      <div className="mt-1.5 text-[11px] leading-[1.25] font-medium text-ink-900">
        Window functions — frames
      </div>
      <div className="mt-auto pt-2">
        <span className="block h-[3px] overflow-hidden rounded-full bg-ink-100">
          <span className="block h-[3px] w-[62%] rounded-full bg-check-machine" />
        </span>
        <span className="mt-1.5 block font-mono text-[9px] leading-none text-ink-500">
          5 of 8 sections
        </span>
      </div>
    </div>
  );
}

/* ── the streak strip ─────────────────────────────────────────────────────
   The gap is the whole point. A strip with no missed day illustrates a claim
   nobody makes; this one shows what "miss a day and it resets" looks like. */

const STREAK_DAYS = [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1];

export function StreakStrip({ mini = false, className }: { mini?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn("flex flex-col justify-center", className)}>
      <div className={cn("flex", mini ? "gap-[3px]" : "gap-1.5")}>
        {STREAK_DAYS.map((on, i) => (
          <span
            key={i}
            className={cn(
              "flex-1 rounded-[2px]",
              mini ? "h-5" : "h-8 rounded-[3px]",
              on ? "bg-brand-500" : "border border-dashed border-ink-200 bg-transparent",
              // The run since the gap ends on today, drawn solid.
              on && i === STREAK_DAYS.length - 1 && "bg-brand-700",
            )}
          />
        ))}
      </div>
      {!mini ? (
        <div className="mt-2.5 flex items-baseline justify-between font-mono text-[11px] leading-none text-ink-500">
          <span>8-day streak</span>
          <span>63 days total</span>
        </div>
      ) : null}
    </div>
  );
}

/* ── the contribution grid ────────────────────────────────────────────────
   Step 04's "counted, not self-reported", drawn. Derived from the index
   rather than drawn at random: a server render and a hydrate have to agree,
   and a randomised fill is the classic way to get a mismatch on every load. */

const filled = (i: number) => (i * 7919) % 11;

export function ContribGrid({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("grid grid-flow-col grid-rows-4 gap-[3px]", className)}>
      {Array.from({ length: 68 }, (_, i) => {
        const v = filled(i);
        return (
          <span
            key={i}
            className={cn(
              "aspect-square rounded-[2px]",
              v > 7 ? "bg-brand-700" : v > 4 ? "bg-brand-500" : v > 2 ? "bg-brand-300" : "bg-ink-100",
            )}
          />
        );
      })}
    </div>
  );
}

/* ── a curated link, as the reader renders it ─────────────────────────────
   The source wall used to be eight names in a row. This is what one of those
   names actually produces on a day page: the title, who published it, how
   long it takes, and the line a person wrote about why this one. */

const TYPE_LABEL: Record<string, string> = {
  read: "Read",
  video: "Video",
  doc: "Docs",
  case_study: "Case study",
  tool: "Tool",
  latest: "Latest",
};

export function LinkCardMini({
  resource,
  className,
}: {
  resource: {
    title: string;
    sourceName: string;
    type: string;
    minutes: number | null;
    editorNote: string | null;
  };
  className?: string;
}) {
  return (
    <div className={cn("rounded-card border border-ink-100 bg-white p-4", className)}>
      <div className="flex items-center gap-2 font-mono text-[10.5px] leading-none tracking-[.04em] text-ink-500 uppercase">
        <span className="rounded bg-ink-50 px-1.5 py-1">{TYPE_LABEL[resource.type] ?? "Read"}</span>
        <span className="min-w-0 truncate normal-case">{resource.sourceName}</span>
        {resource.minutes ? <span>· {resource.minutes} min</span> : null}
      </div>
      <div className="mt-2.5 line-clamp-2 text-[14px] leading-[1.4] font-medium text-ink-900">
        {resource.title}
      </div>
      {resource.editorNote ? (
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-[1.55] text-pretty text-brand-700 italic">
          {resource.editorNote}
        </p>
      ) : null}
    </div>
  );
}

/* ── a roadmap's visual identity ──────────────────────────────────────────
   The same colour cap the catalogue cards wear, so a roadmap looks like
   itself on both surfaces. */

export function CategoryCap({
  category,
  className,
}: {
  category: CategoryKey;
  className?: string;
}) {
  const a = CATEGORY_ACCENT[category];
  return (
    <div aria-hidden className={cn("relative overflow-hidden rounded-lg", a.bg, className)}>
      <svg
        width={54}
        height={54}
        viewBox="0 0 24 24"
        fill="none"
        className={cn("absolute -bottom-2 left-1 opacity-20", a.dark ? "text-white" : "text-ink-900")}
      >
        <path d={a.glyph} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
