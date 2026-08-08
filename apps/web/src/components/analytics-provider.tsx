"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import type { Analytics } from "@jintu/analytics";
import { createBrowserAnalytics } from "@/lib/analytics";

const AnalyticsContext = createContext<Analytics | null>(null);

/**
 * Holds the analytics instance and feeds it the user's analytics consent.
 *
 * `consented` is a prop rather than something this component fetches, because
 * the source of truth is the `consents` table and reading it needs an
 * authenticated session. Until auth lands it is false for everyone, which is
 * the correct default: nobody has agreed to anything yet, so PostHog never
 * initialises and no cookie is set.
 */
export function AnalyticsProvider({
  consented,
  children,
}: {
  consented: boolean;
  children: React.ReactNode;
}) {
  const analytics = useMemo(() => createBrowserAnalytics(), []);

  useEffect(() => {
    analytics.setConsent(consented);
  }, [analytics, consented]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Safe to call anywhere. Outside the provider it returns null and callers
 * no-op — telemetry must never be the reason a page crashes.
 */
export function useAnalytics() {
  return useContext(AnalyticsContext);
}
