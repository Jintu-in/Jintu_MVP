/**
 * The shared text-page layout for Privacy, Terms and Refunds —
 * V2Legal.dc.html's own note says plainly that all three "use this page
 * layout too." One component means the "On this page" jump nav cannot drift
 * from the sections it points at: the ids live on `LegalSection` itself,
 * and `LegalToc` is handed the exact same {id, label} list each page
 * already needs to render its sections, rather than a second copy typed in
 * separately.
 *
 * Two renders of the nav, each visible at one width only — the same pattern
 * `SiteNavMenu`/`SiteNav` already use for their link list. Below `lg` it is
 * a `<details>` accordion (open by default, matching V2Legal's mobile
 * screen); from `lg` it is a sticky sidebar beside the article
 * (DeskLegal.dc.html). There is no scroll-spy "current section"
 * highlighting — that needs a client-side observer for a page that is
 * otherwise a static server component, and a jump nav that goes to the
 * right place is the thing that actually matters here.
 */
export interface LegalTocEntry {
  id: string;
  label: string;
}

export function LegalHeader({ title, version }: { title: string; version?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="t-page text-ink-900">{title}</h1>
      {version ? (
        <div className="font-mono text-[13px] leading-[1.5] text-ink-600">{version}</div>
      ) : null}
    </div>
  );
}

function TocLinks({ entries, compact }: { entries: LegalTocEntry[]; compact?: boolean }) {
  return (
    <>
      {entries.map((e, i) => (
        <a
          key={e.id}
          href={`#${e.id}`}
          className={
            i === 0
              ? `flex items-center gap-2.5 rounded-xl bg-white px-3 font-medium text-ink-900 no-underline ${compact ? "min-h-11" : "min-h-9"}`
              : `flex items-center gap-2.5 rounded-xl px-3 text-ink-600 no-underline ${compact ? "min-h-11" : "min-h-9"}`
          }
        >
          <span className="font-mono text-[12px] text-ink-500">{i + 1}</span>
          <span className="text-[14.5px]">{e.label}</span>
        </a>
      ))}
    </>
  );
}

export function LegalToc({ entries }: { entries: LegalTocEntry[] }) {
  return (
    <>
      {/* Mobile: an accordion, open by default. */}
      <details open className="rounded-[20px] bg-ink-100 p-1.5 lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-3 text-[14.5px] font-semibold text-ink-900">
          <span>On this page</span>
          <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-600">
            <path d="M6 15l6-6 6 6" />
          </svg>
        </summary>
        <nav aria-label="On this page" className="flex flex-col gap-0.5 pt-1">
          <TocLinks entries={entries} compact />
        </nav>
      </details>

      {/* Desktop: a sticky sidebar beside the article. */}
      <nav
        aria-label="On this page"
        className="sticky top-24 hidden w-[260px] flex-none flex-col gap-0.5 lg:flex"
      >
        <div className="mb-2 ml-3 font-mono text-[12px] leading-4 font-semibold tracking-[.06em] text-ink-500 uppercase">
          On this page
        </div>
        <TocLinks entries={entries} />
      </nav>
    </>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="t-sub text-ink-900">{title}</h2>
      <div className="mt-2.5 flex flex-col gap-3 text-[16px] leading-[1.65] text-pretty text-ink-800">
        {children}
      </div>
    </section>
  );
}
