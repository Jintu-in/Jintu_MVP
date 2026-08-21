"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import RoadmapPage, { type RoadmapPageProps } from "@/components/roadmap/roadmap-page";

/**
 * The client seam for the roadmap surface: the server page fetches and
 * shapes every string; this wrapper only supplies navigation, which
 * cannot cross the server boundary as a callback. Back is not among them
 * any more: the shared SiteNav and the breadcrumb both go up. The bandwidth
 * filter
 * needs no handler — its state and consequence line live inside
 * RoadmapPage, ported from the design's DCLogic.
 */
export interface RoadmapRouteProps
  extends Omit<RoadmapPageProps, "onContinue" | "onFilterChange"> {
  continueHref: Route;
}

export default function RoadmapRoute({ continueHref, ...page }: RoadmapRouteProps) {
  const router = useRouter();
  return (
    <RoadmapPage
      {...page}
      onContinue={() => router.push(continueHref)}
    />
  );
}
