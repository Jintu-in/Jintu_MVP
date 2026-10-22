import type { Route } from "next";
import Link from "next/link";

/**
 * One contact method — icon badge, what it's for, and a filled dark pill
 * that either opens a mail client or routes to the page that actually
 * handles it. From V2Contact.dc.html / DeskContact.dc.html: three of these
 * in a row (stacked on a phone, side by side from `lg`).
 *
 * The third design card ("Something broken or out of date?") is a `mailto:`
 * in the mockup, but this codebase already has a dedicated `/report` page
 * with the same content and a working link-health pipeline behind it —
 * pointing the card there instead keeps one real flow rather than a second,
 * disconnected mailto that duplicates it.
 */
export function ContactCard({
  icon,
  title,
  detail,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  action: { label: string; href: `mailto:${string}` | Route };
}) {
  const isMail = action.href.startsWith("mailto:");
  const content = (
    <>
      <span aria-hidden>{icon}</span>
      <span>{action.label}</span>
    </>
  );
  const className =
    "flex h-13 items-center justify-center gap-2.5 rounded-2xl bg-night-900 font-mono text-[15px] text-white no-underline";

  return (
    <div className="flex flex-1 flex-col justify-between gap-5 rounded-[26px] bg-white p-6 shadow-[0_1px_2px_rgba(12,42,48,0.06),0_10px_28px_rgba(12,42,48,0.08)] lg:p-7">
      <div className="flex flex-col gap-2.5">
        <span
          aria-hidden
          className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-link"
        >
          {icon}
        </span>
        <h2 className="t-card mt-0.5 text-ink-900">{title}</h2>
        <p className="text-[15px] leading-[1.55] text-pretty text-ink-600">{detail}</p>
      </div>
      {isMail ? (
        <a href={action.href} className={className}>
          {content}
        </a>
      ) : (
        <Link href={action.href as Route} className={className}>
          {content}
        </Link>
      )}
    </div>
  );
}

export const MailIcon = (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
    <path d="M4.5 7.5l7.5 5.5 7.5-5.5" />
  </svg>
);

export const PersonIcon = (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="3.5" />
    <path d="M5 19c1.2-3 4-4.5 7-4.5s5.8 1.5 7 4.5" />
  </svg>
);

export const BrokenLinkIcon = (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 16L16 8" />
    <path d="M9 8h7v7" />
  </svg>
);
