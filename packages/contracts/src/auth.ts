import { z } from "zod";
import { NOTICE_VERSION, normaliseIndianMobile } from "./waitlist";

export { NOTICE_VERSION };

const E164_INDIAN_MOBILE = /^\+91[6-9]\d{9}$/;

/** Step 1: ask for a code. */
export const otpRequestInput = z.object({
  phone: z
    .string()
    .trim()
    .transform(normaliseIndianMobile)
    .refine((v) => E164_INDIAN_MOBILE.test(v), {
      message: "Enter a 10-digit Indian mobile number.",
    }),
});

/** Step 2: prove you received it. */
export const otpVerifyInput = z.object({
  phone: z
    .string()
    .trim()
    .transform(normaliseIndianMobile)
    .refine((v) => E164_INDIAN_MOBILE.test(v), {
      message: "That number does not look right. Start again.",
    }),
  token: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "The code is six digits."),
});

/**
 * The optional consent purposes, exactly as they appear in
 * `consents.purpose`. `core_service` is absent on purpose: it is not a choice
 * the form offers, it is what the account is for, and a checkbox implying
 * otherwise would be misleading.
 */
export const OPTIONAL_PURPOSES = [
  "analytics",
  "whatsapp_updates",
  "public_profile",
] as const;

export type OptionalPurpose = (typeof OPTIONAL_PURPOSES)[number];

/** Step 3: create the profile. This is where Law 3 is enforced. */
export const onboardingInput = z.object({
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

  batchYear: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isInteger(v) && v >= 1980 && v <= 2100), {
      message: "Enter a four-digit graduation year.",
    }),

  // Law 3. DPDP restricts profiling of children and a readiness score is
  // profiling, so this is not a formality — it is the condition on which the
  // profile row is allowed to exist at all. The database agrees: profiles has
  // a CHECK constraint that makes a false value unrepresentable.
  isAdultConfirmed: z.boolean().refine((v) => v, {
    message: "Jintu is only open to people aged 18 and over.",
  }),

  // Each optional purpose arrives as its own boolean, never bundled. Absent
  // means not granted; there is no third state.
  analytics: z.boolean(),
  whatsapp_updates: z.boolean(),
  public_profile: z.boolean(),
});

export type OnboardingInput = z.infer<typeof onboardingInput>;

/**
 * Sanitises a `?next=` redirect target.
 *
 * A sign-in page that redirects wherever the query string says is an open
 * redirect: an attacker sends `/join?next=//evil.com`, the victim signs in for
 * real, and lands on a copy of the site that asks them to "confirm" the code
 * they just used. The link looks legitimate because the domain is ours.
 *
 * Only same-origin absolute paths pass. `//evil.com` and `https://evil.com`
 * are both rejected, which is why the second character is checked and not
 * just the first — a protocol-relative URL starts with a slash too.
 */
export function safeNextPath(next: string | undefined, fallback = "/account"): string {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//")) return fallback;
  // Backslashes are normalised to slashes by some browsers, so /\evil.com can
  // behave as a protocol-relative URL too.
  if (next.startsWith("/\\")) return fallback;
  if (next.includes("://")) return fallback;
  return next;
}

/** Withdrawal is a first-class action, not an email to support. */
export const consentToggleInput = z.object({
  purpose: z.enum(OPTIONAL_PURPOSES),
  granted: z.boolean(),
});
