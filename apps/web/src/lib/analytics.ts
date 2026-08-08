import {
  createAnalytics,
  noopTransport,
  type AnalyticsTransport,
} from "@jintu/analytics";
import type { PostHog } from "posthog-js";
import { getObservabilityEnv } from "@/lib/env";

/**
 * PostHog bound to the consent-gated wrapper.
 *
 * posthog-js is imported lazily inside init(), so the library lands in its
 * own chunk (measured: 232 KB) that the landing page never references. A
 * visitor who has not consented does not download it; one who declines never
 * downloads it at all. Only this ~14 KB wrapper is in the initial payload.
 *
 * If you change this to a static import, that 232 KB moves onto the critical
 * path of a mid-range Android on mobile data, for a library that is not
 * allowed to run.
 */
function posthogTransport(): AnalyticsTransport {
  // Type-only import above; the runtime import below is what stays lazy.
  let client: PostHog | undefined;

  return {
    init(key, host) {
      void import("posthog-js").then(({ default: posthog }) => {
        client = posthog;
        posthog.init(key, {
          api_host: host,
          // Consent is explicit and per-purpose; PostHog's own opt-in cookie
          // machinery would be a second, competing source of truth.
          persistence: "localStorage",
          autocapture: false,
          capture_pageview: false,
          disable_session_recording: true,
        });
      });
    },
    capture(event, properties) {
      client?.capture(event, properties);
    },
    identify(distinctId, properties) {
      client?.identify(distinctId, properties);
    },
    reset() {
      client?.reset();
    },
  };
}

export function createBrowserAnalytics() {
  const { posthogKey, posthogHost } = getObservabilityEnv();
  return createAnalytics({
    key: posthogKey,
    host: posthogHost,
    transport: posthogKey ? posthogTransport() : noopTransport,
  });
}
