import Link from "next/link";
import type { Route } from "next";

/**
 * The one site footer, on every screen.
 *
 * Three columns and the wordmark, from the homepage design. It is the
 * only place Privacy, Terms and Refunds are reachable from a deep page,
 * which is a legal requirement as much as a navigational one.
 */
const COLUMNS = [
  {
    head: "Product",
    links: [
      ["Roadmaps", "/learn"],
      ["How it works", "/#how-it-works"],
      ["Free", "/pricing"],
    ],
  },
  {
    head: "Company",
    links: [
      ["Contact", "/contact"],
      ["hello@jintu.in", "mailto:hello@jintu.in"],
    ],
  },
  {
    head: "Legal",
    links: [
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Refunds", "/refunds"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-100 bg-white px-5 py-12 sm:px-12">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 sm:flex-row sm:justify-between">
        <Link
          href="/"
          className="text-[28px] leading-none font-medium tracking-[-0.02em] text-ink-900"
        >
          jintu
        </Link>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-16">
          {COLUMNS.map((col) => (
            <div key={col.head}>
              <div className="font-mono text-[11px] leading-none tracking-[.08em] text-ink-500 uppercase">
                {col.head}
              </div>
              <ul className="mt-3 flex flex-col gap-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("mailto:") ? (
                      <a href={href} className="text-[13.5px] text-brand-700 hover:text-brand-800">
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href as Route}
                        className="text-[13.5px] text-brand-700 hover:text-brand-800"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1280px] border-t border-ink-100 pt-6 font-mono text-[12.5px] leading-none text-ink-500">
        Made in India
      </div>
    </footer>
  );
}
