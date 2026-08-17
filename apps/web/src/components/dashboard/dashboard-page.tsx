import { DocFileIcon, ExternalIcon, VideoTileIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * The signed-in dashboard, converted from docs/design/Dashboard.dc.html.
 * One responsive component: the design's 360 returning-user and 360
 * first-week frames are the same tree with different DATA (what the props
 * contain — due cards or none, notes or an empty state, a resumed lesson
 * or a fresh one). The 1024 frame is the same tree again with the
 * two-column 60/40 split, the inline streak summary and the card surfaces
 * behind lg:.
 *
 * Colour: hexes map to the preset tokens; #8A8A85 as text renders as
 * text-ink-500 (the preset's measured muted step) because the raw hex
 * fails AA. Continue stays the only teal-bordered card and the only
 * filled button on the page.
 *
 * Server component: the dashboard has no state and no handlers — every
 * action is navigation, so the design's buttons render as links styled
 * identically. Data arrives as props — the page fetches.
 */

/** Inline rich text: prose runs and mono (counted) runs, nothing more. */
export type Rich = { kind: "text" | "mono"; text: string }[];

export type StreakCell = {
  state: "empty" | "done" | "today";
  /** Optional day-of-month numeral shown inside an empty square. */
  label?: string;
};

export interface DashboardPageProps {
  nav: { label: string; href: string; active?: boolean }[];
  searchHref: string;
  accountHref: string;
  avatarInitials: string;
  greeting: string;
  greetingSub: string;
  streak: {
    label: string;
    sideLine: string;
    /** Summary for the whole strip, e.g. "11 day streak, 2 days missed in the last 14". */
    gridLabel: string;
    cells: StreakCell[];
  };
  continueCard: {
    kicker: string;
    title: Rich;
    metaLine: string;
    /** Present only when the day was resumed mid-way. */
    progressPct?: number;
    lastBlockLine?: string;
    label: string;
    href: string;
  };
  stats: { value: string; label: string; muted?: boolean }[];
  review:
    | { headline: Rich; detail: Rich; ctaLabel: string; href: string }
    | { empty: string };
  notes: { text: string; meta: string; href: string }[];
  /** Shown when `notes` is empty. */
  notesEmpty?: { text: string; hint: string };
  allNotesHref?: string;
  saved: { kind: "doc" | "video"; title: string; meta: string; href: string }[];
  /** Shown when `saved` is empty. */
  savedEmpty?: { text: string; hint: string };
  allSavedHref?: string;
  roadmaps: { title: string; countLine: string; pct: number; href: string }[];
  browseAllHref?: string;
}

const RichText = ({ segments }: { segments: Rich }) => (
  <>
    {segments.map((s, i) =>
      s.kind === "mono" ? (
        <span key={i} className="font-mono">
          {s.text}
        </span>
      ) : (
        <span key={i}>{s.text}</span>
      ),
    )}
  </>
);

/* ── icons local to the dashboard (geometry verbatim from the design) ───── */

const SearchIcon = () => (
  <svg aria-hidden width={17} height={17} viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" />
    <path d="m12 12 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const FlameIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden width={18} height={18} viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M10 2.5c.6 2.4-.3 3.6-1.6 4.9C6.7 9 5 10.4 5 12.6a5 5 0 0 0 10 0c0-1.9-.9-3.2-1.8-4.3-.5 1-1.2 1.5-1.9 1.7.5-2.3.1-5-1.3-7.5Z"
      fill="currentColor"
    />
  </svg>
);

/** The streak-square tick — 1.7 stroke, unlike the 1.6 of the shared TickIcon. */
const GridTickIcon = () => (
  <svg aria-hidden width={11} height={11} viewBox="0 0 12 12" fill="none">
    <path
      d="M2.5 6.2 4.8 8.5 9.5 3.8"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── small shared pieces ────────────────────────────────────────────────── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[11.5px] leading-none tracking-[.06em] text-ink-500 uppercase">
    {children}
  </span>
);

const SectionHeader = ({
  label,
  link,
  className,
}: {
  label: string;
  link?: { label: string; href: string };
  className?: string;
}) => (
  <div className={cn("flex items-baseline justify-between", className)}>
    <SectionLabel>{label}</SectionLabel>
    {link ? (
      <a
        href={link.href}
        className="text-[13px] leading-none text-brand-700 no-underline hover:text-ink-900"
      >
        {link.label}
      </a>
    ) : null}
  </div>
);

/** Empty-state card: names the next action and gives a real number. */
const EmptyCard = ({ text, hint }: { text: string; hint: string }) => (
  <div className="rounded-card border border-ink-100 p-4 lg:bg-white lg:p-5">
    <p className="m-0 text-[15px] leading-[1.65] text-pretty text-ink-600">{text}</p>
    <div className="mt-2.5 font-mono text-[12px] leading-[1.6] text-ink-500">{hint}</div>
  </div>
);

const StreakSquare = ({ cell }: { cell: StreakCell }) => {
  if (cell.state === "done") {
    return (
      <div
        aria-hidden
        className="flex aspect-square items-center justify-center rounded-md bg-check-machine text-white"
      >
        <GridTickIcon />
      </div>
    );
  }
  if (cell.state === "today") {
    return <div aria-hidden className="aspect-square rounded-md border-[1.5px] border-brand-700 bg-brand-50" />;
  }
  return (
    <div
      aria-hidden
      className="flex aspect-square items-center justify-center rounded-md border border-ink-100 bg-ink-50 font-mono text-[10px] text-ink-500"
    >
      {cell.label}
    </div>
  );
};

/* ── the page ───────────────────────────────────────────────────────────── */

export default function DashboardPage({
  nav,
  searchHref,
  accountHref,
  avatarInitials,
  greeting,
  greetingSub,
  streak,
  continueCard,
  stats,
  review,
  notes,
  notesEmpty,
  allNotesHref,
  saved,
  savedEmpty,
  allSavedHref,
  roadmaps,
  browseAllHref,
}: DashboardPageProps) {
  return (
    <div className="flex h-dvh flex-col bg-white lg:bg-ink-50">
      {/* ── top bar: wordmark + (desktop) nav + search + account ─────────── */}
      <header className="flex h-[52px] flex-none items-center gap-2 border-b border-ink-100 bg-white px-4 lg:h-14 lg:gap-[18px] lg:px-[22px]">
        <span className="text-[15px] leading-none font-medium text-brand-700 lg:text-[16px]">
          Jintu
        </span>
        {nav.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "hidden text-[13.5px] leading-none no-underline hover:text-ink-900 lg:block",
              item.active ? "text-ink-900" : "text-ink-600",
            )}
          >
            {item.label}
          </a>
        ))}
        <div className="flex-1" />
        <a
          aria-label="Search"
          href={searchHref}
          className="flex size-12 items-center justify-center text-ink-900 lg:hidden"
        >
          <SearchIcon />
        </a>
        <a aria-label="Account" href={accountHref} className="flex size-12 items-center justify-center">
          <span className="flex size-7 items-center justify-center rounded-full bg-brand-50 font-mono text-[12px] font-medium text-brand-700 lg:size-[30px]">
            {avatarInitials}
          </span>
        </a>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-5 pb-8 lg:px-0 lg:pt-[26px] lg:pb-10">
        <div className="flex flex-col gap-5 lg:mx-auto lg:max-w-[940px] lg:gap-0 lg:px-[22px]">
          {/* ── greeting; on desktop the streak summary sits inline ────────── */}
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-5">
            <div>
              <h2 className="m-0 text-[20px] leading-[1.35] font-medium text-ink-900">{greeting}</h2>
              <div className="mt-1 text-[13px] leading-normal text-ink-500">{greetingSub}</div>
            </div>
            <div className="hidden lg:flex lg:items-center lg:gap-2.5">
              <FlameIcon className="text-brand-700" />
              <span className="font-mono text-[17px] leading-[1.25] font-medium text-ink-900">
                {streak.label}
              </span>
              <span className="text-[13px] leading-normal text-ink-600">{streak.sideLine}</span>
            </div>
          </div>

          {/* ── streak card with the 14-day strip — mobile only ────────────── */}
          <section className="rounded-card border border-ink-100 p-3.5 lg:hidden">
            <div className="flex items-center gap-[9px]">
              <FlameIcon className="text-brand-700" />
              <span className="font-mono text-[17px] leading-[1.25] font-medium text-ink-900">
                {streak.label}
              </span>
            </div>
            <div className="mt-[5px] text-right text-[13px] leading-normal text-ink-600">
              {streak.sideLine}
            </div>
            <div role="img" aria-label={streak.gridLabel} className="mt-3 grid grid-cols-7 gap-1">
              {streak.cells.map((cell, i) => (
                <StreakSquare key={i} cell={cell} />
              ))}
            </div>
          </section>

          {/* ── the two desktop columns; on mobile both unwrap into one list
                 and the order-* classes interleave them ─────────────────────── */}
          <div className="contents lg:mt-4 lg:flex lg:items-start lg:gap-5">
            {/* left column (60%): continue, review, roadmaps */}
            <div className="contents lg:flex lg:w-3/5 lg:max-w-3/5 lg:flex-none lg:flex-col lg:gap-4">
              {/* Continue — the only teal border and the only filled button. */}
              <section className="order-1 rounded-card border border-brand-700 bg-white p-[18px] lg:p-6">
                <div className="font-mono text-[11.5px] leading-none tracking-[.06em] text-brand-700 uppercase">
                  {continueCard.kicker}
                </div>
                <div className="mt-2.5 text-[18px] leading-[1.35] font-medium text-ink-900 lg:mt-3 lg:text-[22px] lg:leading-[1.3]">
                  <RichText segments={continueCard.title} />
                </div>
                <div className="mt-2 font-mono text-[12.5px] leading-normal text-ink-600 lg:mt-2.5 lg:text-[13px]">
                  {continueCard.metaLine}
                </div>
                {continueCard.progressPct != null ? (
                  <div className="mt-3.5 h-[3px] rounded-[2px] bg-ink-100">
                    {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
                    <div
                      className="h-[3px] rounded-[2px] bg-check-machine"
                      style={{ width: `${continueCard.progressPct}%` }}
                    />
                  </div>
                ) : null}
                <a
                  href={continueCard.href}
                  className="mt-4 flex min-h-12 w-full items-center justify-center rounded-lg border border-brand-700 bg-brand-700 text-[16px] font-medium text-white no-underline hover:bg-brand-800 lg:mt-5 lg:min-h-[52px] lg:text-[17px]"
                >
                  {continueCard.label}
                </a>
                {continueCard.lastBlockLine ? (
                  <div className="mt-3 font-mono text-[12.5px] leading-[1.6] text-ink-500">
                    {continueCard.lastBlockLine}
                  </div>
                ) : null}
              </section>

              {/* Review */}
              <section className="order-3">
                <div className="mb-2.5 lg:hidden">
                  <SectionLabel>Review</SectionLabel>
                </div>
                <div className="rounded-card border border-ink-100 p-4 lg:bg-white lg:p-5">
                  <div className="hidden lg:block">
                    <SectionLabel>Review</SectionLabel>
                  </div>
                  {"empty" in review ? (
                    <div className="text-[15px] leading-[1.6] text-ink-500">{review.empty}</div>
                  ) : (
                    <div className="lg:mt-3 lg:flex lg:flex-wrap lg:items-center lg:gap-4">
                      <div className="lg:min-w-[200px] lg:flex-1">
                        <div className="text-[16px] leading-normal text-ink-900">
                          <RichText segments={review.headline} />
                        </div>
                        <div className="mt-[5px] text-[13px] leading-[1.6] text-ink-600 lg:mt-1">
                          <RichText segments={review.detail} />
                        </div>
                      </div>
                      <a
                        href={review.href}
                        className="mt-3.5 flex min-h-12 w-full items-center justify-center rounded-lg border border-ink-100 bg-white text-[15px] font-medium text-brand-700 no-underline hover:border-brand-700 lg:mt-0 lg:w-auto lg:px-[18px]"
                      >
                        {review.ctaLabel}
                      </a>
                    </div>
                  )}
                </div>
              </section>

              {/* Roadmaps */}
              <section className="order-6">
                <div className="mb-2.5 lg:hidden">
                  <SectionLabel>Roadmaps</SectionLabel>
                </div>
                <div className="overflow-hidden rounded-card border border-ink-100 lg:overflow-visible lg:bg-white lg:p-5">
                  <SectionHeader
                    label="Roadmaps"
                    link={browseAllHref ? { label: "Browse all", href: browseAllHref } : undefined}
                    className="hidden lg:flex"
                  />
                  <div className="flex flex-col lg:mt-3.5 lg:gap-3.5">
                    {roadmaps.map((r, i) => (
                      <a
                        key={r.title}
                        href={r.href}
                        className={cn(
                          "flex flex-col p-3.5 no-underline hover:bg-ink-50 lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-x-3 lg:p-0 lg:hover:bg-transparent",
                          i < roadmaps.length - 1 && "border-b border-ink-100 lg:border-b-0",
                        )}
                      >
                        <span className="order-1 block text-[15px] leading-[1.4] text-ink-900">
                          {r.title}
                        </span>
                        <span className="order-2 mt-2.5 block h-[3px] rounded-[2px] bg-ink-100 lg:order-3 lg:mt-[9px] lg:basis-full">
                          {/* Inline on purpose: a computed percentage is genuinely dynamic. */}
                          <span
                            className="block h-[3px] rounded-[2px] bg-check-machine"
                            style={{ width: `${r.pct}%` }}
                          />
                        </span>
                        <span className="order-3 mt-2 block font-mono text-[12px] leading-none text-ink-600 lg:order-2 lg:mt-0">
                          {r.countLine}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* right column (40%): stats, notes, saved */}
            <div className="contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:gap-4">
              {/* Stats */}
              <section className="order-2 grid grid-cols-3 gap-2 lg:gap-2.5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-card border border-ink-100 p-3 lg:bg-white lg:p-3.5"
                  >
                    <div
                      className={cn(
                        "font-mono text-[19px] leading-[1.1] font-medium",
                        s.muted ? "text-ink-500" : "text-ink-900",
                      )}
                    >
                      {s.value}
                    </div>
                    <div className="mt-[5px] text-[12px] leading-[1.4] text-ink-500 lg:mt-1.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </section>

              {/* My notes */}
              <section className="order-4">
                <SectionHeader
                  label="My notes"
                  link={
                    allNotesHref && notes.length > 0
                      ? { label: "All notes", href: allNotesHref }
                      : undefined
                  }
                  className="mb-2.5 lg:hidden"
                />
                {notes.length === 0 && notesEmpty ? (
                  <EmptyCard text={notesEmpty.text} hint={notesEmpty.hint} />
                ) : (
                  <div className="flex flex-col gap-2 lg:gap-0 lg:rounded-card lg:border lg:border-ink-100 lg:bg-white lg:p-5">
                    <SectionHeader
                      label="My notes"
                      link={allNotesHref ? { label: "All notes", href: allNotesHref } : undefined}
                      className="hidden lg:flex"
                    />
                    <div className="contents lg:mt-3.5 lg:flex lg:flex-col lg:gap-3.5">
                      {notes.map((n) => (
                        <a
                          key={n.meta}
                          href={n.href}
                          className="block rounded-card border border-ink-100 p-3.5 no-underline hover:bg-ink-50 lg:rounded-none lg:border-0 lg:p-0 lg:hover:bg-transparent"
                        >
                          <span className="block lg:border-l-2 lg:border-brand-700 lg:pl-3">
                            <span className="block border-l-2 border-brand-700 pl-3 text-[15px] leading-[1.7] text-ink-900 lg:border-0 lg:pl-0">
                              {n.text}
                            </span>
                            <span className="mt-2 block font-mono text-[12px] leading-none text-ink-500 lg:mt-1.5">
                              {n.meta}
                            </span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Saved */}
              <section className="order-5">
                <SectionHeader
                  label="Saved"
                  link={
                    allSavedHref && saved.length > 0
                      ? { label: "All saved", href: allSavedHref }
                      : undefined
                  }
                  className="mb-2.5 lg:hidden"
                />
                {saved.length === 0 && savedEmpty ? (
                  <EmptyCard text={savedEmpty.text} hint={savedEmpty.hint} />
                ) : (
                  <div className="overflow-hidden rounded-card border border-ink-100 lg:overflow-visible lg:bg-white lg:p-5">
                    <SectionHeader
                      label="Saved"
                      link={allSavedHref ? { label: "All saved", href: allSavedHref } : undefined}
                      className="hidden lg:flex"
                    />
                    <div className="flex flex-col lg:mt-3">
                      {saved.map((s, i) => (
                        <a
                          key={s.title}
                          href={s.href}
                          className={cn(
                            "flex min-h-12 items-center gap-3 p-3.5 no-underline hover:bg-ink-50 lg:px-0 lg:py-3",
                            i < saved.length - 1 && "border-b border-ink-100",
                          )}
                        >
                          <span className="flex size-8 flex-none items-center justify-center rounded-lg border border-ink-100 bg-ink-50 text-ink-600">
                            {s.kind === "doc" ? <DocFileIcon /> : <VideoTileIcon />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] leading-[1.45] text-ink-900">
                              {s.title}
                            </span>
                            <span className="mt-1 block font-mono text-[12px] leading-none text-ink-500">
                              {s.meta}
                            </span>
                          </span>
                          {s.kind === "video" ? (
                            <span className="flex-none font-mono text-[11px] leading-none text-brand-700">
                              load
                            </span>
                          ) : (
                            <ExternalIcon className="flex-none text-brand-700" />
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
