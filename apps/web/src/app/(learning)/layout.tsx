import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { getViewer } from "@/lib/session";

/**
 * The learning surfaces — the catalogue, a roadmap, a day.
 *
 * They carry the same header and footer as everything else. The reader and
 * the roadmap used to own the whole viewport with their own internal
 * scroll, which is why neither had a footer and why the wordmark was
 * missing from both; they are ordinary documents now, and the page scrolls.
 */
export const dynamic = "force-dynamic";

export default async function LearningLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const viewer = await getViewer().catch(() => null);

  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <SiteNav signedIn={Boolean(viewer?.hasProfile)} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
