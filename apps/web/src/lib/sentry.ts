import { redactPayload, redactString } from "@jintu/analytics";
import type { ErrorEvent, EventHint } from "@sentry/nextjs";
import { getObservabilityEnv } from "@/lib/env";

/**
 * Shared Sentry options for browser, server, and edge.
 *
 * Error reporting is not analytics and is not consent-gated: it is processed
 * to keep the service working, which is the core_service purpose. That makes
 * it more important, not less, that nothing identifying rides along — hence
 * sendDefaultPii false and a redaction pass over everything on the way out.
 */
export function sentryOptions() {
  const { sentryDsn, environment } = getObservabilityEnv();

  return {
    dsn: sentryDsn,
    environment,
    // Never attach IP addresses, cookies, or user identifiers automatically.
    sendDefaultPii: false,
    tracesSampleRate: environment === "production" ? 0.1 : 0,
    beforeSend(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
      if (event.request?.url) event.request.url = redactString(event.request.url);
      if (event.request?.query_string && typeof event.request.query_string === "string") {
        event.request.query_string = redactString(event.request.query_string);
      }
      if (event.message) event.message = redactString(event.message);

      for (const value of event.exception?.values ?? []) {
        if (value.value) value.value = redactString(value.value);
      }

      if (event.extra) event.extra = redactPayload(event.extra) as typeof event.extra;
      // A phone number is our natural key. It must never become a Sentry user.
      delete event.user;

      return event;
    },
  };
}

/** Sentry stays off entirely when no DSN is configured. */
export function isSentryEnabled() {
  return Boolean(getObservabilityEnv().sentryDsn);
}
