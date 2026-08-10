import { z } from "zod";

/**
 * Correcting your own details.
 *
 * DPDP gives a data principal the right to have inaccurate personal data
 * corrected. Until now the only route was emailing privacy@jintu.in, which is
 * a valid answer and a slow one — a misspelled name is a correction someone
 * should be able to make themselves.
 *
 * Deliberately narrow. Phone and email are identity here: phone is unique
 * across profiles and email is the sign-in credential, so changing either is a
 * different operation with its own verification, not a text field on a form.
 * is_adult_confirmed is absent because the database will not accept false —
 * withdrawing it means closing the account, not editing a checkbox.
 */
export const profileUpdateInput = z.object({
  fullName: z
    .string()
    .trim()
    .max(120, "That is longer than we can store.")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),

  // Same shape as onboarding's, because it is the same field and a form that
  // accepted a value onboarding rejected would be its own small betrayal.
  batchYear: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isInteger(v) && v >= 1980 && v <= 2100), {
      message: "Enter a four-digit graduation year.",
    }),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateInput>;
