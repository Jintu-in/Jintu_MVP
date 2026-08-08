import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAnalytics, type AnalyticsTransport } from "./analytics";
import { containsIdentifier, redactPayload, redactString } from "./redact";

function spyTransport() {
  return {
    init: vi.fn(),
    capture: vi.fn(),
    identify: vi.fn(),
    reset: vi.fn(),
  } satisfies AnalyticsTransport;
}

describe("consent gate", () => {
  let transport: ReturnType<typeof spyTransport>;

  beforeEach(() => {
    transport = spyTransport();
  });

  const make = () =>
    createAnalytics({ key: "phc_test", host: "https://eu.posthog.com", transport });

  // This is the one that matters. PostHog drops a cookie and starts a session
  // on init, so initialising and then suppressing events has already
  // processed personal data. Nothing may happen before the tick.
  it("does not initialise the transport before consent", () => {
    const a = make();
    a.capture("page_view");
    a.identify("user-1");
    expect(transport.init).not.toHaveBeenCalled();
    expect(transport.capture).not.toHaveBeenCalled();
    expect(transport.identify).not.toHaveBeenCalled();
  });

  it("initialises once when consent is granted, then captures", () => {
    const a = make();
    a.setConsent(true);
    a.capture("page_view");
    a.capture("submitted");
    expect(transport.init).toHaveBeenCalledTimes(1);
    expect(transport.capture).toHaveBeenCalledTimes(2);
  });

  // Withdrawal must be as effective as refusal, not just prospective.
  it("resets the transport and stops capturing when consent is withdrawn", () => {
    const a = make();
    a.setConsent(true);
    a.capture("before");
    a.setConsent(false);
    a.capture("after");
    expect(transport.reset).toHaveBeenCalledTimes(1);
    expect(transport.capture).toHaveBeenCalledTimes(1);
    expect(transport.capture).toHaveBeenCalledWith("before", undefined);
  });

  it("is inert when PostHog is not configured, even with consent", () => {
    const a = createAnalytics({ key: undefined, host: "https://eu.posthog.com", transport });
    a.setConsent(true);
    a.capture("page_view");
    expect(transport.init).not.toHaveBeenCalled();
    expect(transport.capture).not.toHaveBeenCalled();
  });

  it("reports why an event was dropped", () => {
    const onDropped = vi.fn();
    const a = createAnalytics({
      key: "phc_test",
      host: "https://eu.posthog.com",
      transport,
      onDropped,
    });
    a.capture("page_view");
    expect(onDropped).toHaveBeenCalledWith("no-consent", "page_view");
  });

  it("redacts identifiers out of event properties", () => {
    const a = make();
    a.setConsent(true);
    a.capture("waitlist_joined", {
      phone: "+919876543210",
      note: "reach me on 9876543210 or a@b.com",
      cohort: "aug-2026",
    });
    const props = transport.capture.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(props.phone).toBe("[redacted]");
    expect(props.note).toBe("reach me on [redacted] or [redacted]");
    expect(props.cohort).toBe("aug-2026");
  });
});

describe("redaction", () => {
  it.each([
    ["+919876543210", true],
    ["9876543210", true],
    ["91 9876543210", true],
    ["asha@example.com", true],
    ["eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.abc-_123", true],
    ["cohort aug-2026, score 82", false],
    ["1234567890", false], // starts with 1 — not an Indian mobile
  ])("containsIdentifier(%s) === %s", (input, expected) => {
    expect(containsIdentifier(input)).toBe(expected);
  });

  it("drops sensitive keys wholesale rather than pattern-matching the value", () => {
    // A value we fail to recognise is more dangerous than one we do.
    const out = redactPayload({ otp: "000000", apiKey: "xyz", week: 3 }) as Record<
      string,
      unknown
    >;
    expect(out.otp).toBe("[redacted]");
    expect(out.apiKey).toBe("[redacted]");
    expect(out.week).toBe(3);
  });

  it("walks nested structures", () => {
    const out = redactPayload({
      user: { phone: "+919876543210" },
      items: ["mail asha@example.com", "fine"],
    }) as { user: { phone: string }; items: string[] };
    expect(out.user.phone).toBe("[redacted]");
    expect(out.items[0]).toBe("mail [redacted]");
    expect(out.items[1]).toBe("fine");
  });

  it("terminates on cyclic input instead of hanging", () => {
    const cyclic: Record<string, unknown> = { name: "x" };
    cyclic.self = cyclic;
    expect(() => redactPayload(cyclic)).not.toThrow();
  });

  it("leaves ordinary text alone", () => {
    expect(redactString("readiness 74, week 3")).toBe("readiness 74, week 3");
  });
});
