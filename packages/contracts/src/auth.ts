import { z } from "zod";

/**
 * The privacy notice the user is shown at the point of consent. Written to
 * `consents.notice_version` on every row.
 *
 * Bump this whenever the notice changes materially, and never edit a
 * published notice in place — a consent record that cannot show which text
 * the user actually read proves nothing (docs/LEGAL.md §2.2).
 */
// v3 (2026-08-13): the product pivoted from graded submissions to roadmap
// progress tracking, so the notice's account of what is collected and why
// changed wholesale — submissions and readiness scores out, progress,
// streaks, points and review cards in; the WhatsApp-specific reminder
// purpose became a channel-neutral one.
export const NOTICE_VERSION = "2026-08-13.v3";

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

/**
 * An Indian mobile, in the shape `profiles.phone` requires — one definition
 * of "a number we can reach you on".
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
 * The phone number is still collected, at onboarding: it is how the one
 * daily reminder reaches someone who asked for it. It is just not the thing
 * that proves who you are.
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
  "reminders",
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

  // Collected here rather than at sign-in, because sign-in is by email.
  // The purpose is stated on the form and in the privacy notice — storing it
  // is not consent to message it, which is what the separate reminders
  // purpose below is for.
  phone: indianMobile,

  batchYear: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isInteger(v) && v >= 1980 && v <= 2100), {
      message: "Enter a four-digit graduation year.",
    }),

  // DPDP restricts profiling of children, and tracking progress, streaks and
  // points is profiling — so this is not a formality, it is the condition on
  // which the profile row is allowed to exist at all. The database agrees:
  // profiles has a CHECK constraint that makes a false value unrepresentable.
  isAdultConfirmed: z.boolean().refine((v) => v, {
    message: "Jintu is only open to people aged 18 and over.",
  }),

  // Each optional purpose arrives as its own boolean, never bundled. Absent
  // means not granted; there is no third state.
  analytics: z.boolean(),
  reminders: z.boolean(),
  public_profile: z.boolean(),

  // The streak day boundary is this person's midnight, so the zone has to be
  // captured at signup — read from the browser, never guessed from an IP.
  // Shape-checked only ("Area/Location"): the database validates the name
  // against pg_timezone_names, which is the list that actually matters, and
  // an absent or unparseable value falls back to the column default rather
  // than blocking an account over a clock.
  timezone: z
    .string()
    .trim()
    .max(64)
    .regex(/^[A-Za-z]+(?:\/[A-Za-z0-9_+-]+){1,2}$/, "Not an IANA timezone name.")
    .optional()
    .catch(undefined),
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

/**
 * Signing in with a password instead of a code.
 *
 * Added because the code is the expensive half. Supabase's built-in sender
 * allows roughly two auth emails an hour per project, so a student who mistypes
 * an address, or simply signs in on a second device, can be locked out by a
 * quota that has nothing to do with them. A password costs no email at all.
 *
 * The code does not go away. It stays as the way in for a first-time visitor,
 * for anyone who has not set a password, and — usefully — as the entire
 * password-recovery story: forget your password and you ask for a code, which
 * is a flow that already exists and is already tested.
 */
export const passwordSignInInput = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email address.")
    .max(254, "That address is longer than an email address can be.")
    .pipe(z.email("That does not look like an email address.")),
  // Only presence is checked here. Length rules belong on the form that SETS a
  // password; applying them at sign-in would tell somebody with an older,
  // shorter password that their own password is invalid.
  password: z.string().min(1, "Enter your password."),
  // "Stay signed in on this device." Defaulted ON by the form — this is a
  // habit product, not a bank; a session that expires weekly breaks the
  // streak and makes the login screen the most-used screen in the product.
  remember: z.boolean().optional(),
});

/**
 * Choosing a password once you are already signed in.
 *
 * Ten characters, not the Supabase default of six. Six is two guesses shy of
 * useless and this account holds a phone number and a person's learning
 * history. No composition rules — no "one capital and one symbol" —
 * because they push people towards Password1! and away from length, which is
 * the only property that actually helps.
 */
export const setPasswordInput = z.object({
  password: z
    .string()
    .min(10, "Use at least ten characters. Length beats punctuation.")
    .max(72, "Passwords are limited to 72 characters."),
  remember: z.boolean().optional(),
});

export type PasswordSignInInput = z.infer<typeof passwordSignInInput>;
export type SetPasswordInput = z.infer<typeof setPasswordInput>;
