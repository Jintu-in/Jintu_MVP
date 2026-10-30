import type { Metadata, Route } from "next";
import Link from "next/link";
import { StatusLabel } from "@/components/roadmap/status-label";
import { NotifyForm } from "@/components/roadmap/notify-form";
import { ChevronRightIcon } from "@/components/ui/icons";
import { getDraftRoadmaps } from "@/lib/draft-roadmaps";
import { getViewer } from "@/lib/session";
import { ROLES } from "@/content/roles";

/**
 * The holding page every draft roadmap's URL 302s to (design pack update 3
 * §A, V2Holding/DeskHolding). The mockup draws its own small header
 * instead of the usual nav, but (learning)/layout.tsx's own header
 * comment is explicit that EVERY page under it "carries the same header
 * and footer as everything else" — a deliberate site-wide call, not an
 * oversight this page gets to quietly opt out of. SiteNav/SiteFooter
 * supply that; this page starts straight at the dark band the mockup
 * draws below its header.
 *
 * `?from=<slug>` names the specific roadmap that sent someone here and
 * pre-ticks it in the form; without it (someone just browsing here
 * directly), the headline is generic and nothing is pre-ticked — same
 * posture when `from` doesn't match a real draft roadmap.
 *
 * Not built here, by scope decision: the "Opening first" card (CHANGES.md
 * wants it ranked by an `open_order` column this migration doesn't add —
 * there is also currently nothing draft to rank). Nothing invented in its
 * place; the card is simply absent until there is real data to drive it.
 */
export const metadata: Metadata = {
  title: "Roadmaps being rebuilt",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

const WHY_WE_TOOK_THEM_DOWN = [
  "Days ran 45 to 120 minutes. Lessons now aim for 15.",
  "You read before you did anything. Now you act in the first two minutes.",
  "There was no way to check your own work. Every step now shows what you should see.",
];

export default async function HoldingPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const [drafts, viewer] = await Promise.all([getDraftRoadmaps(), getViewer()]);
  const named = from ? drafts.find((d) => d.slug === from) : undefined;

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <div className="flex flex-col items-start gap-3.5 bg-night-900 px-5 pt-8 pb-[72px] text-white lg:px-10 lg:pt-12 lg:pb-20">
        <StatusLabel status="draft" />
        <h1 className="t-page text-white">
          {named ? `${named.title} is being rebuilt.` : "Roadmaps are being rebuilt."}
        </h1>
        <p className="max-w-[62ch] text-[16px] leading-[25px] text-on-night-muted">
          We took every roadmap down to rewrite it as short lessons you do, each checked before it
          opens. They come back one at a time. If you started one, your progress is kept.
        </p>
      </div>

      <main className="flex flex-col gap-4 px-5 pb-8 lg:mx-auto lg:w-full lg:max-w-[720px] lg:gap-5 lg:px-0">
        <section className="-mt-11 rounded-[24px] bg-white p-5 shadow-[0_1px_2px_rgba(12,42,48,0.06),0_10px_28px_rgba(12,42,48,0.08)] lg:p-7">
          <NotifyForm drafts={drafts} preselectedSlug={named?.slug} prefillEmail={viewer?.email} />
        </section>

        <section className="rounded-[22px] bg-white p-5 lg:p-7">
          <h2 className="t-sub m-0 mb-2.5 text-ink-900">Why we took them down</h2>
          <ul className="m-0 flex list-disc flex-col gap-2 pl-[18px] text-[15px] leading-[23px] text-ink-600">
            {WHY_WE_TOOK_THEM_DOWN.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <Link
          href={"/roles" as Route}
          className="flex items-center gap-3.5 rounded-[20px] bg-white p-4 text-ink-900 no-underline"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[16px] leading-[22px] font-semibold text-link">
              Meanwhile, read what the job involves
            </span>
            <span className="block text-[14px] leading-5 text-ink-600">
              {ROLES.length} role guides stay open while we rebuild
            </span>
          </span>
          <ChevronRightIcon className="flex-none text-ink-500" />
        </Link>
      </main>
    </div>
  );
}
