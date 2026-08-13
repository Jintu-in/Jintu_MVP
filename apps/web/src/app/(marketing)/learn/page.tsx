import type { Metadata } from "next";

/**
 * The catalogue route, held while the roadmap screens are built.
 *
 * /learn keeps its URL through the pivot — it is the address printed on the
 * homepage and anywhere else "browse" will ever point — but the faceted
 * catalogue is a next-phase screen. Until then the page says plainly what is
 * coming instead of rendering an empty grid, and reads nothing from the
 * database because there is nothing published to read yet.
 */
export const metadata: Metadata = {
  title: "Roadmaps",
  description:
    "Deep, free roadmaps for any subject — curated reads, videos and docs in the order that teaches. First roadmaps arriving now.",
  alternates: { canonical: "/learn" },
};

export default function RoadmapsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <p className="text-sm font-medium tracking-wide text-brand-700 uppercase">
        Roadmaps
      </p>
      <h1 className="mt-3 text-3xl leading-tight font-medium text-balance text-ink-900 sm:text-4xl">
        The catalogue is being curated.
      </h1>
      <p className="mt-4 max-w-[62ch] text-lg text-pretty text-ink-600">
        Each roadmap ships only after every link in it has been checked by a
        person — a dead link on the first screen would cost more trust than a
        missing roadmap does. The first two, Data analyst and Amazon Ads, are
        in review now.
      </p>
      <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.7] text-ink-600">
        Everything here will be free and readable without an account.
      </p>
    </main>
  );
}
