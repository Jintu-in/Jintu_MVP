import { z } from "zod";

/**
 * The privacy notice the user is shown at the point of consent. Written to
 * `waitlist_signups.notice_version` on every row.
 *
 * Bump this whenever the notice changes materially, and never edit a
 * published notice in place — a consent record that cannot show which text
 * the user actually read proves nothing (docs/LEGAL.md §2.2).
 */
export const NOTICE_VERSION = "2026-08-09.v1";

const E164_INDIAN_MOBILE = /^\+91[6-9]\d{9}$/;

/**
 * Accepts what people actually type — "98765 43210", "+91-98765-43210",
 * "919876543210" — and returns E.164. Anything it cannot confidently
 * normalise is returned unchanged so the refine below rejects it, rather
 * than being coerced into a number that belongs to someone else.
 */
export function normaliseIndianMobile(raw: string): string {
  const digits = raw.replace(/[\s()\-.]/g, "");
  if (E164_INDIAN_MOBILE.test(digits)) return digits;
  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0[6-9]\d{9}$/.test(digits)) return `+91${digits.slice(1)}`;
  return digits;
}

export const waitlistInput = z.object({
  phone: z
    .string()
    .trim()
    .transform(normaliseIndianMobile)
    .refine((v) => E164_INDIAN_MOBILE.test(v), {
      message: "Enter a 10-digit Indian mobile number.",
    }),

  fullName: z
    .string()
    .trim()
    .max(120, "That is longer than we can store.")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),

  collegeName: z
    .string()
    .trim()
    .max(200, "That is longer than we can store.")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),

  // Law 3. Not a formality — DPDP restricts profiling of children and a
  // readiness score is profiling, so there is no version of this product
  // that lawfully serves someone under 18.
  isAdultConfirmed: z.boolean().refine((v) => v, {
    message: "Jintu is only open to people aged 18 and over.",
  }),

  // Required: joining a waitlist and refusing contact is not a coherent
  // request. Kept as its own explicit tick rather than being implied by
  // pressing the button.
  consentContact: z.boolean().refine((v) => v, {
    message: "We need your permission to contact you about the cohort.",
  }),

  // Optional and genuinely refusable — no .refine(). If declining this ever
  // blocks the form, the consent stops being freely given and the whole
  // consent is defective (docs/LEGAL.md §2.2).
  consentWhatsapp: z.boolean(),
});

export type WaitlistInput = z.infer<typeof waitlistInput>;
