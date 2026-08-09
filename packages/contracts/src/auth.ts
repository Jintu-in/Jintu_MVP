import { z } from "zod";
import { NOTICE_VERSION, normaliseIndianMobile } from "./waitlist";

export { NOTICE_VERSION };

const E164_INDIAN_MOBILE = /^\+91[6-9]\d{9}$/;

/**
 * An Indian mobile, in the shape `profiles.phone` and `waitlist_signups.phone`
 * both require. Shared by onboarding and the waitlist so there is one
 * definition of "a number we can reach you on".
 */
export const indianMobile = z
  .string()
  .trim()
  .transform(normaliseIndianMobile)
  .refine((v) => E164_INDIAN_MOBILE.test(v), {
    message: "Enter a 10-digit Indian mobile number.",
  });

/**
 * Sign-in is by email, not SMS — for now.
 *
 * ARCHITECTURE.md §1 says phone-first is correct for India, and it is: a
 * unique mobile is what makes one-account-per-person nearly free to enforce,
 * and Android autofills an SMS code. What it does not price in is TRAI's DLT
 * registration, which every A2P sender to an Indian number needs before a
 * single OTP goes out — a registered entity, PAN and GST paperwork, and weeks
 * of waiting, all of it bought purely for authentication. WhatsApp needs Meta
 * business verification instead, so none of that work carries over.
 *
 * Email costs nothing to start and the flow is identical — Supabase's
 * `signInWithOtp` takes `{ email }` or `{ phone }` and the six-digit code
 * behaves the same either way. Switching back is this file plus the two calls
 * in apps/web/src/actions/auth.ts, not a rewrite.
 *
 * The phone number is still collected, at onboarding: WhatsApp is the nudge
 * channel in Phase 2, and ops needs to reach a paying student. It is just no
 * longer the thing that proves who you are.
 */
export const otpRequestInput = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email address.")
    .max(254, "That address is longer than an email address can be.")
    .pipe(z.email("That does not look like an email address.")),
});

/** Step 2: prove you received it. */
export const otpVerifyInput = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("That address does not look right. Start again.")),
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

  // Collected here rather than at sign-in, because sign-in is by email now.
  // Required: deadline nudges are the product, and a cohort we cannot reach is
  // a cohort that silently stops submitting. The purpose is stated on the form
  // and in the privacy notice — storing it is not consent to message it, which
  // is what the separate whatsapp_updates purpose below is for.
  phone: indianMobile,

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
