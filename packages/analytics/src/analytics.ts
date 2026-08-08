import { redactPayload } from "./redact";

/**
 * Consent-gated analytics. ARCHITECTURE.md §2 — "PostHog wrapper gated on
 * consent"; docs/LEGAL.md §2.2 for why the gate is where it is.
 *
 * The important property is that the transport is not merely *silenced*
 * before consent — it is never initialised. PostHog drops a cookie and starts
 * a session on init, so an init-then-suppress design has already processed
 * personal data by the time it decides not to. Nothing happens until someone
 * has ticked a box.
 */

export type AnalyticsTransport = {
  init: (key: string, host: string) => void;
  capture: (event: string, properties?: Record<string, unknown>) => void;
  identify: (distinctId: string, properties?: Record<string, unknown>) => void;
  /** Must clear any stored identifiers and stop the session. */
  reset: () => void;
};

export type AnalyticsConfig = {
  key: string | undefined;
  host: string;
  transport: AnalyticsTransport;
  onDropped?: (reason: string, event: string) => void;
};

export type Analytics = ReturnType<typeof createAnalytics>;

export function createAnalytics({ key, host, transport, onDropped }: AnalyticsConfig) {
  let consented = false;
  let initialised = false;

  const drop = (reason: string, event: string) => onDropped?.(reason, event);

  function ensureInitialised() {
    if (initialised || !key) return;
    transport.init(key, host);
    initialised = true;
  }

  return {
    get isActive() {
      return consented && initialised;
    },

    /**
     * Called when consent is granted or withdrawn. Withdrawal resets the
     * transport so the stored distinct_id does not survive to be re-attached
     * if the user later consents again — that would link two sessions the
     * user intended to keep separate.
     */
    setConsent(next: boolean) {
      if (next === consented) return;
      consented = next;
      if (next) ensureInitialised();
      else if (initialised) transport.reset();
    },

    capture(event: string, properties?: Record<string, unknown>) {
      if (!consented) return drop("no-consent", event);
      if (!key) return drop("not-configured", event);
      ensureInitialised();
      transport.capture(event, redactPayload(properties) as Record<string, unknown>);
    },

    /**
     * `distinctId` must be an opaque internal id — a profile UUID. Never a
     * phone number, which is our natural key and precisely the thing that
     * must not leave for a third-party processor.
     */
    identify(distinctId: string, properties?: Record<string, unknown>) {
      if (!consented) return drop("no-consent", "$identify");
      if (!key) return drop("not-configured", "$identify");
      ensureInitialised();
      transport.identify(
        distinctId,
        redactPayload(properties) as Record<string, unknown>,
      );
    },
  };
}

/** A transport that does nothing — the default until PostHog is configured. */
export const noopTransport: AnalyticsTransport = {
  init: () => {},
  capture: () => {},
  identify: () => {},
  reset: () => {},
};
