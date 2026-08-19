import { describe, expect, it } from "vitest";
import {
  RESERVED_HANDLES,
  deleteAccountInput,
  handleSchema,
  publicProfileInput,
  reminderPrefsInput,
  timezoneSchema,
} from "./account";

describe("handleSchema", () => {
  it("accepts an ordinary handle", () => {
    expect(handleSchema.safeParse("priya").success).toBe(true);
    expect(handleSchema.safeParse("priya-r").success).toBe(true);
    expect(handleSchema.safeParse("a1b").success).toBe(true);
    expect(handleSchema.safeParse("9lives").success).toBe(true);
  });

  it("rejects uppercase rather than quietly lowercasing it", () => {
    // Silently rewriting the input is how someone ends up with a card that
    // does not say what they typed.
    expect(handleSchema.safeParse("Priya").success).toBe(false);
    expect(handleSchema.safeParse("PRIYA").success).toBe(false);
  });

  it("rejects every reserved word", () => {
    for (const h of RESERVED_HANDLES) {
      expect(handleSchema.safeParse(h).success, h).toBe(false);
    }
  });

  it("holds the line on length and shape", () => {
    expect(handleSchema.safeParse("ab").success).toBe(false); // 2 chars
    expect(handleSchema.safeParse("a".repeat(30)).success).toBe(true);
    expect(handleSchema.safeParse("a".repeat(31)).success).toBe(false);
    expect(handleSchema.safeParse("-priya").success).toBe(false); // leading -
    expect(handleSchema.safeParse("pri ya").success).toBe(false);
    expect(handleSchema.safeParse("priya_r").success).toBe(false); // underscore
    expect(handleSchema.safeParse("priya.r").success).toBe(false);
    expect(handleSchema.safeParse("").success).toBe(false);
  });

  it("matches the regex the database enforces", () => {
    const db = /^[a-z0-9][a-z0-9-]{2,29}$/;
    for (const h of ["priya", "a1b", "9lives", "a".repeat(30)]) {
      expect(db.test(h), h).toBe(true);
    }
    for (const h of ["Priya", "ab", "-priya", "priya_r"]) {
      expect(db.test(h), h).toBe(false);
    }
  });
});

describe("timezoneSchema", () => {
  it("takes IANA names", () => {
    for (const tz of ["Asia/Kolkata", "America/New_York", "Europe/London", "America/Argentina/Salta"]) {
      expect(timezoneSchema.safeParse(tz).success, tz).toBe(true);
    }
  });

  it("refuses things that are not zone names", () => {
    for (const tz of ["", "IST", "+05:30", "Asia/", "'; drop table profiles; --"]) {
      expect(timezoneSchema.safeParse(tz).success, tz).toBe(false);
    }
  });
});

describe("reminderPrefsInput", () => {
  it("takes a 24-hour time", () => {
    expect(reminderPrefsInput.safeParse({ dailyEnabled: true, dailyAt: "20:30", streakWarning: false }).success).toBe(true);
    expect(reminderPrefsInput.safeParse({ dailyEnabled: false, dailyAt: "00:00", streakWarning: true }).success).toBe(true);
    expect(reminderPrefsInput.safeParse({ dailyEnabled: false, dailyAt: "23:59", streakWarning: true }).success).toBe(true);
  });

  it("rejects a time that does not exist", () => {
    for (const t of ["24:00", "8:30pm", "20:60", "2030", ""]) {
      expect(
        reminderPrefsInput.safeParse({ dailyEnabled: true, dailyAt: t, streakWarning: false }).success,
        t,
      ).toBe(false);
    }
  });
});

describe("publicProfileInput", () => {
  it("carries the handle rules through", () => {
    expect(publicProfileInput.safeParse({ handle: "priya", isPublic: true }).success).toBe(true);
    expect(publicProfileInput.safeParse({ handle: "admin", isPublic: true }).success).toBe(false);
  });
});

describe("deleteAccountInput", () => {
  it("needs a real address, since it is checked against the account's", () => {
    expect(deleteAccountInput.safeParse({ confirmEmail: "p@example.com" }).success).toBe(true);
    expect(deleteAccountInput.safeParse({ confirmEmail: "not-an-email" }).success).toBe(false);
    expect(deleteAccountInput.safeParse({ confirmEmail: "" }).success).toBe(false);
  });
});
