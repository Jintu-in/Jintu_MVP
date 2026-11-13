import Link from "next/link";
import type { Route } from "next";
import { JintuWordmark } from "@/components/site/jintu-wordmark";
import { getSiteUrl } from "@/lib/env";

/**
 * The one site footer, on every screen — rebuilt against the redesign's own
 * footer (V2Landing.dc.html / DeskHome.dc.html): a dark band, "Learn /
 * Jintu / The small print" rather than "Product / Company / Legal", and a
 * bottom bar carrying the two legal lines every page needs reachable from
 * a deep page: the 18+ gate, and the plain statement that a job is not what
 * this product promises (CLAUDE.md rules 3 and 4).
 */
const COLUMNS = [
  {
    head: "Learn",
    links: [
      ["Roadmaps", "/learn"],
      ["Roles", "/roles"],
    ],
  },
  {
    head: "Jintu",
    links: [
      ["Pricing", "/pricing"],
      ["Contact", "/contact"],
      ["Report a problem", "/report"],
    ],
  },
  {
    head: "The small print",
    links: [
      ["Privacy notice", "/privacy"],
      ["Terms", "/terms"],
      ["Refunds", "/refunds"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-night-950 px-5 py-14 text-white sm:px-12 lg:py-16">
      <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-8 lg:flex-row lg:gap-16">
        <div className="flex max-w-[340px] flex-col gap-3">
          <Link href="/" aria-label="jintu home" className="flex items-center">
            {/* logo/jintu-wordmark-white.svg (design pack update 3 §D) — see
                site-nav.tsx's JintuWordmark comment for why this replaced
                the old literal "j" + "jintu" text pair. */}
            <JintuWordmark aria-hidden className="h-5 w-auto text-white" />
          </Link>
          <p className="hidden text-[15px] leading-[1.45] text-on-night-muted sm:block">
            Free roadmaps you do with your own hands, one clear step at a time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-20">
          {COLUMNS.map((col) => (
            <div key={col.head} className="min-w-0">
              <div className="mb-2 font-mono text-[12px] leading-4 font-semibold tracking-[.06em] text-dark-link uppercase">
                {col.head}
              </div>
              {col.links.map(([label, href]) => (
                <Link
                  key={label}
                  href={href as Route}
                  className="flex min-h-9 items-center text-[15px] text-on-night no-underline sm:min-h-8"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1280px] flex-col gap-2 border-t border-white/10 pt-5 text-[13.5px] leading-[1.45] text-on-night-muted-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div>For people aged 18 and over. We do not promise you a job.</div>
        {/* The real current host (decision 4, CURRENT-STATE.md §1): jintu.in
            does not resolve today, so this reads getSiteUrl() rather than
            the mockup's own literal "jintu.in" — it will say jintu.in on
            its own, correctly, the day NEXT_PUBLIC_SITE_URL points there. */}
        <div className="font-mono text-[12.5px]">{getSiteUrl().host}</div>
      </div>
    </footer>
  );
}
