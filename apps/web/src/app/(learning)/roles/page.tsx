import type { Metadata, Route } from "next";
import Link from "next/link";
import { AppShell } from "@/components/shell/app-shell";
import { COMPARISONS, ROLES, populatedDomains, rolesInDomain } from "@/content/roles";
import { getMyMomentum } from "@/lib/momentum";
import { getViewer, initialsFor } from "@/lib/session";
import { cn } from "@/lib/utils";

/**
 * The domain-first entry point — rebuilt against V2Roles.dc.html /
 * DeskRoles.dc.html.
 *
 * Moved from the marketing route group to (learning), and shelled with
 * AppShell: V2Roles' own mobile screen draws the real bottom tab bar with
 * Roles active, the same shell /learn now uses. (DeskRoles/DeskRole/
 * DeskCompare draw a plain top bar instead of the 248px sidebar — an
 * inconsistency against DeskRoadmaps' sidebar that reads as the same kind
 * of leftover-earlier-iteration seam already found twice elsewhere in this
 * design set (the homepage, the catalogue). Given Phase 0 built one app
 * shell for exactly these four destinations, this page uses it at every
 * width rather than reproducing a second, narrower desktop chrome that
 * only this page would have.)
 *
 * Filtering is a domain chip row + search, both in the URL
 * (?domain=&q=), same shareable-state discipline as /learn. The mobile
 * screen shows one domain at a time; the desktop screen shows all ten at
 * once — reconciled by defaulting to "all domains shown," which chip
 * selection then narrows, so neither screen is contradicted.
 */
export const metadata: Metadata = {
  title: "Roles",
  description:
    "What each job actually is, what it is not, and which roadmap gets you there. Written plainly, with no salary guesses.",
  alternates: { canonical: "/roles" },
};

const SEARCH_ICON = (
  <svg aria-hidden width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </svg>
);

const ARROW_RIGHT = (
  <svg aria-hidden width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export default async function RolesIndex({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const read = (k: string) => {
    const v = params[k];
    return (Array.isArray(v) ? v[0] : v) ?? "";
  };
  const domainParam = read("domain");
  const q = read("q").trim().toLowerCase().slice(0, 120);

  const [viewer, momentum] = await Promise.all([
    getViewer().catch(() => null),
    getMyMomentum().catch(() => null),
  ]);

  const domains = populatedDomains();
  const activeDomain = domains.find((d) => d.key === domainParam) ?? null;
  const shownDomains = activeDomain ? [activeDomain] : domains;

  const matches = (title: string, aliases: string[] | undefined) =>
    !q || title.toLowerCase().includes(q) || (aliases ?? []).some((a) => a.toLowerCase().includes(q));

  const href = (next: { domain?: string | null; q?: string }) => {
    const p = new URLSearchParams();
    const d = next.domain !== undefined ? next.domain : domainParam;
    const query = next.q !== undefined ? next.q : q;
    if (d) p.set("domain", d);
    if (query) p.set("q", query);
    const s = p.toString();
    return `/roles${s ? `?${s}` : ""}` as Route;
  };

  const resultCount = shownDomains.reduce(
    (n, d) => n + rolesInDomain(d.key).filter((r) => matches(r.title, r.aliases)).length,
    0,
  );
  const [firstComparison] = COMPARISONS;

  return (
    <AppShell
      active="roles"
      user={
        viewer
          ? { displayName: viewer.fullName ?? viewer.email ?? "You", initials: initialsFor(viewer), points: momentum?.totalPoints ?? 0 }
          : null
      }
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-5 px-5 py-6 sm:px-8 lg:px-12 lg:py-9">
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="t-sect text-ink-900">What job is this, and is it me?</h1>
            <p className="max-w-[62ch] text-[15.5px] leading-[1.55] text-pretty text-ink-600 lg:text-[16px]">
              {ROLES.length} roles. Each page says what the job is, what it is not, and what is hard about it.
            </p>
          </div>
          <form action="/roles" method="GET" role="search" className="lg:w-[320px] lg:flex-none">
            {domainParam ? <input type="hidden" name="domain" value={domainParam} /> : null}
            <label htmlFor="role-search" className="sr-only">
              Search {ROLES.length} roles
            </label>
            <div className="flex h-13 items-center gap-2.5 rounded-full border border-ink-200 bg-white px-4">
              <span aria-hidden className="flex-none text-ink-600">
                {SEARCH_ICON}
              </span>
              <input
                id="role-search"
                name="q"
                type="search"
                defaultValue={q}
                placeholder={`Search ${ROLES.length} roles`}
                className="min-w-0 flex-1 bg-transparent text-[15px] text-ink-900 placeholder:text-ink-500 focus:outline-none"
              />
            </div>
          </form>
        </div>

        <div role="group" aria-label="Fields" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
          <Link
            href={href({ domain: null })}
            scroll={false}
            className={cn(
              "flex min-h-11 flex-none items-center rounded-2xl border px-4 text-[14px] whitespace-nowrap no-underline",
              !activeDomain ? "border-night-900 bg-night-900 text-white font-semibold" : "border-ink-100 bg-white text-ink-900",
            )}
          >
            All {ROLES.length}
          </Link>
          {domains.map((d) => (
            <Link
              key={d.key}
              href={href({ domain: activeDomain?.key === d.key ? null : d.key })}
              scroll={false}
              className={cn(
                "flex min-h-11 flex-none items-center rounded-2xl border px-4 text-[14px] whitespace-nowrap no-underline",
                activeDomain?.key === d.key ? "border-night-900 bg-night-900 text-white font-semibold" : "border-ink-100 bg-white text-ink-900",
              )}
            >
              {d.label}
            </Link>
          ))}
        </div>

        {firstComparison ? (
          <Link
            href={`/roles/compare/${firstComparison.slug}` as Route}
            className="flex min-h-[64px] items-center gap-3.5 rounded-[20px] bg-brand-50 px-4 py-3.5 text-night-900 no-underline"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-mono text-[12.5px] font-semibold text-link">Often confused</span>
              <span className="text-[14.5px] font-semibold">
                {firstComparison.title}
                {COMPARISONS.length > 1 ? ` · ${COMPARISONS.length - 1} more` : null}
              </span>
            </span>
            {ARROW_RIGHT}
          </Link>
        ) : null}

        <div className="font-mono text-[12.5px] leading-none text-ink-500">
          {resultCount} {resultCount === 1 ? "role" : "roles"}
          {q ? ` matching "${q}"` : activeDomain ? ` in ${activeDomain.label}` : null}
        </div>

        {resultCount > 0 ? (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {shownDomains.map((d) => {
              const roles = rolesInDomain(d.key).filter((r) => matches(r.title, r.aliases));
              if (roles.length === 0) return null;
              return (
                <section key={d.key} className="flex min-w-0 flex-col gap-1 rounded-[20px] bg-white p-4">
                  <h2 className="t-card text-ink-900">{d.label}</h2>
                  <div className="mb-1.5 text-[12.5px] leading-[1.4] text-ink-500">{d.blurb}</div>
                  <div className="flex flex-col">
                    {roles.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/roles/${r.slug}` as Route}
                        className="flex min-h-12 items-center justify-between gap-3 border-t border-ink-50 text-[15px] font-medium text-ink-900 no-underline first:border-t-0"
                      >
                        <span className="min-w-0 truncate">{r.title}</span>
                        <span aria-hidden className="flex-none text-ink-500">
                          {ARROW_RIGHT}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[22px] bg-white p-6">
            <div className="t-card text-ink-900">Nothing matches that yet.</div>
            <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.5] text-pretty text-ink-600">
              Try a different field, or a shorter search.
            </p>
            <Link href="/roles" className="mt-3 inline-flex min-h-11 items-center text-[13.5px] font-semibold text-ink-900">
              Clear filters
            </Link>
          </div>
        )}

        <div className="flex flex-col items-start gap-3 rounded-[22px] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="t-card text-ink-900">Know what you want already?</div>
            <p className="max-w-[52ch] text-[14px] leading-[1.5] text-ink-600">
              Skip all of this and go straight to the material.
            </p>
          </div>
          <Link
            href="/learn"
            className="flex h-12 flex-none items-center justify-center gap-2.5 rounded-2xl bg-brand-500 px-5 text-[15px] font-semibold text-on-brand hover:bg-brand-400"
          >
            Browse the roadmaps
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
