"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import RoadmapPage, { type RoadmapPageProps } from "@/components/roadmap/roadmap-page";

/**
 * The client seam for the roadmap surface: the server page fetches and
 * shapes every string; this wrapper only supplies navigation, which
 * cannot cross the server boundary as a callback. The bandwidth filter
 * needs no handler — its state and consequence line live inside
 * RoadmapPage, ported from the design's DCLogic.
 */
export interface RoadmapRouteProps
  extends Omit<RoadmapPageProps, "onBack" | "onBookmark" | "onContinue" | "onFilterChange"> {
  backHref: Route;
  continueHref: Route;
}

export default function RoadmapRoute({ backHref, continueHref, ...page }: RoadmapRouteProps) {
  const router = useRouter();
  return (
    <RoadmapPage
      {...page}
      onBack={() => router.push(backHref)}
      onContinue={() => router.push(continueHref)}
    />
  );
}
