import { describe, expect, it } from "vitest";
import {
  OPTIONAL_PURPOSES,
  onboardingInput,
  otpRequestInput,
  otpVerifyInput,
  safeNextPath,
} from "./auth";

const validOnboarding = {
  fullName: "Asha",
  collegeName: "NIT Trichy",
  phone: "98765 43210",
  batchYear: "2027",
  isAdultConfirmed: true,
  analytics: false,
  whatsapp_updates: false,
  public_profile: false,
};

describe("otpRequestInput", () => {
  it("accepts an email address", () => {
    const r = otpRequestInput.safeParse({ email: "asha@example.com" });
    expect(r.success).toBe(true);
    expect(r.data?.email).toBe("asha@example.com");
  });

  // Phones autocapitalise the first letter of a field, and Supabase treats
  // the address as a key. "Asha@Example.com" and "asha@example.com" must not
  // become two accounts for the same person.
  it("lowercases and trims, so one person is one account", () => {
    const r = otpRequestInput.safeParse({ email: "  Asha@Example.COM " });
    expect(r.data?.email).toBe("asha@example.com");
  });

  it.each([["asha"], ["asha@"], ["@example.com"], ["asha example.com"], [""]])(
    "rejects %s",
    (email) => {
      expect(otpRequestInput.safeParse({ email }).success).toBe(false);
    },
  );
});

describe("otpVerifyInput", () => {
  it("accepts a six-digit code", () => {
    const r = otpVerifyInput.safeParse({ email: "asha@example.com", token: "123456" });
    expect(r.success).toBe(true);
  });

  it.each([["12345"], ["1234567"], ["12a456"], [""]])("rejects the code %s", (token) => {
    expect(
      otpVerifyInput.safeParse({ email: "asha@example.com", token }).success,
    ).toBe(false);
  });
});

describe("onboardingInput", () => {
  it("accepts a complete submission", () => {
    const r = onboardingInput.safeParse(validOnboarding);
    expect(r.success).toBe(true);
    expect(r.data?.batchYear).toBe(2027);
  });

  // The number moved here when sign-in became email, and it is required:
  // deadline nudges are the product, and profiles.phone is NOT NULL.
  it("normalises the mobile number into E.164", () => {
    const r = onboardingInput.safeParse(validOnboarding);
    expect(r.data?.phone).toBe("+919876543210");
  });

  it.each([["+14155550123"], ["1234567890"], ["98765"], [""]])(
    "rejects the mobile number %s",
    (phone) => {
      expect(onboardingInput.safeParse({ ...validOnboarding, phone }).success).toBe(false);
    },
  );

  // Law 3. A profile row cannot exist without this, enforced again by a CHECK
  // constraint in the database — the form must not be the only thing stopping it.
  it("rejects onboarding without the 18+ confirmation", () => {
    const r = onboardingInput.safeParse({ ...validOnboarding, isAdultConfirmed: false });
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain("18 and over");
  });

  // docs/LEGAL.md §2.2: declining an optional purpose must never block the
  // service. If any of these ever fails, the consent has become a condition
  // of signing up and is defective as a matter of law.
  it.each(OPTIONAL_PURPOSES)("accepts onboarding that declines %s", (purpose) => {
    const r = onboardingInput.safeParse({ ...validOnboarding, [purpose]: false });
    expect(r.success).toBe(true);
  });

  it("accepts onboarding that declines every optional purpose at once", () => {
    const all = Object.fromEntries(OPTIONAL_PURPOSES.map((p) => [p, false]));
    expect(onboardingInput.safeParse({ ...validOnboarding, ...all }).success).toBe(true);
  });

  it("treats blank name and college as absent", () => {
    const r = onboardingInput.safeParse({ ...validOnboarding, fullName: "", collegeName: "  " });
    expect(r.success).toBe(true);
    expect(r.data?.fullName).toBeUndefined();
    expect(r.data?.collegeName).toBeUndefined();
  });

  it.each([["1979"], ["2101"], ["20x7"]])("rejects batch year %s", (batchYear) => {
    expect(onboardingInput.safeParse({ ...validOnboarding, batchYear }).success).toBe(false);
  });

  it("allows batch year to be omitted", () => {
    const { batchYear: _omit, ...rest } = validOnboarding;
    expect(onboardingInput.safeParse(rest).success).toBe(true);
  });

  // core_service is not offered as a checkbox: it is what the account is for,
  // and a box implying it is refusable would be misleading.
  it("does not offer core_service as an optional purpose", () => {
    expect(OPTIONAL_PURPOSES).not.toContain("core_service");
  });
});

describe("safeNextPath", () => {
  it.each([
    ["/account", "/account"],
    ["/dashboard/week/3", "/dashboard/week/3"],
    ["/learn?x=1", "/learn?x=1"],
  ])("keeps the same-origin path %s", (input, expected) => {
    expect(safeNextPath(input)).toBe(expected);
  });

  // Each of these would send a freshly-authenticated user off-site from a URL
  // that looks like ours.
  it.each([
    ["//evil.com"],
    ["///evil.com"],
    ["https://evil.com"],
    ["http://evil.com"],
    ["/\\evil.com"], // backslash: some browsers normalise it to a second slash
    ["javascript:alert(1)"],
    ["evil.com"],
    [""],
  ])("refuses %s", (input) => {
    expect(safeNextPath(input)).toBe("/account");
  });

  it("falls back when nothing is supplied", () => {
    expect(safeNextPath(undefined)).toBe("/account");
    expect(safeNextPath(undefined, "/onboarding")).toBe("/onboarding");
  });
});
