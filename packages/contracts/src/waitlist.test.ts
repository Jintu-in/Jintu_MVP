import { describe, expect, it } from "vitest";
import { normaliseIndianMobile, waitlistInput } from "./waitlist";

/** A submission that should always pass, for tests that vary one field. */
const valid = {
  phone: "9876543210",
  fullName: "Asha",
  collegeName: "NIT Trichy",
  isAdultConfirmed: true,
  consentContact: true,
  consentWhatsapp: false,
};

describe("normaliseIndianMobile", () => {
  it.each([
    ["9876543210", "+919876543210"],
    ["98765 43210", "+919876543210"],
    ["+91 98765-43210", "+919876543210"],
    ["919876543210", "+919876543210"],
    ["09876543210", "+919876543210"],
    ["+919876543210", "+919876543210"],
  ])("normalises %s", (input, expected) => {
    expect(normaliseIndianMobile(input)).toBe(expected);
  });

  it("leaves input it cannot confidently normalise alone", () => {
    // Returned unchanged so the schema rejects it, rather than being coerced
    // into a number belonging to someone else.
    expect(normaliseIndianMobile("12345")).toBe("12345");
    expect(normaliseIndianMobile("+14155550123")).toBe("+14155550123");
  });
});

describe("waitlistInput", () => {
  it("accepts a valid submission and returns E.164", () => {
    const result = waitlistInput.safeParse(valid);
    expect(result.success).toBe(true);
    expect(result.data?.phone).toBe("+919876543210");
  });

  it.each([
    ["too short", "98765"],
    ["starts with 5 — not an Indian mobile prefix", "5876543210"],
    ["a non-Indian number", "+14155550123"],
    ["letters", "abcdefghij"],
    ["empty", ""],
  ])("rejects a phone that is %s", (_label, phone) => {
    expect(waitlistInput.safeParse({ ...valid, phone }).success).toBe(false);
  });

  // ── Law 3 ──────────────────────────────────────────────────────────────────
  it("rejects a submission without the 18+ confirmation", () => {
    const result = waitlistInput.safeParse({ ...valid, isAdultConfirmed: false });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain("18 and over");
  });

  // ── DPDP: the required purpose ─────────────────────────────────────────────
  it("rejects a submission without consent to be contacted", () => {
    const result = waitlistInput.safeParse({ ...valid, consentContact: false });
    expect(result.success).toBe(false);
  });

  // ── DPDP: the optional purpose must stay optional ──────────────────────────
  // If this test ever fails, the WhatsApp consent has become a condition of
  // signing up, which makes it not freely given and defective as a matter of
  // law — see docs/LEGAL.md §2.2. It is not a UX regression.
  it("accepts a submission that declines WhatsApp updates", () => {
    const result = waitlistInput.safeParse({ ...valid, consentWhatsapp: false });
    expect(result.success).toBe(true);
    expect(result.data?.consentWhatsapp).toBe(false);
  });

  it("treats blank optional text as absent rather than empty string", () => {
    const result = waitlistInput.safeParse({
      ...valid,
      fullName: "",
      collegeName: "   ",
    });
    expect(result.success).toBe(true);
    expect(result.data?.fullName).toBeUndefined();
    expect(result.data?.collegeName).toBeUndefined();
  });

  it("rejects an over-long name rather than silently truncating it", () => {
    const result = waitlistInput.safeParse({ ...valid, fullName: "a".repeat(121) });
    expect(result.success).toBe(false);
  });
});
