import { z } from "zod";

/**
 * The account half of /profile: timezone, identity, reminders, the public
 * handle, and deletion.
 *
 * Every rule here is also enforced in the database (0013). These schemas
 * exist so the person gets a sentence instead of a constraint violation —
 * they are not the security boundary.
 */

/**
 * Path segments we own or may own. A handle that collided with one would
 * either shadow a route or be shadowed by it, and either way the person who
 * picked it loses their page.
 *
 * Kept in step with the CHECK constraint in 0013 — the database is the one
 * that actually decides, this list is the one that explains.
 */
export const RESERVED_HANDLES = [
  "admin",
  "api",
  "app",
  "auth",
  "help",
  "jintu",
  "learn",
  "login",
  "profile",
  "roadmap",
  "settings",
  "signin",
  "signup",
  "support",
  "u",
  "www",
] as const;

export const handleSchema = z
  .string()
  .trim()
  // Not .toLowerCase(): silently changing what someone typed is how you get
  // a person who thinks their handle is "Priya" and finds "priya" on their
  // card. Reject and say so.
  .regex(
    /^[a-z0-9][a-z0-9-]{2,29}$/,
    "Use 3–30 characters: lowercase letters, numbers and hyphens, starting with a letter or number.",
  )
  .refine((h) => !(RESERVED_HANDLES as readonly string[]).includes(h), {
    message: "That name is reserved for the site itself. Pick another.",
  });

/**
 * The timezone. Shape-checked only ("Area/Location"): the real list is
 * pg_timezone_names, which the database checks on write, and duplicating
 * 1200 zone names into the bundle would be worse than one round trip.
 */
export const timezoneSchema = z
  .string()
  .trim()
  .max(64)
  .regex(/^[A-Za-z]+(?:\/[A-Za-z0-9_+-]+){1,2}$/, "That is not a timezone name.");

export const timezoneUpdateInput = z.object({ timezone: timezoneSchema });

export const displayNameInput = z.object({
  displayName: z
    .string()
    .trim()
    .max(60, "Sixty characters is the limit.")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

export const reminderPrefsInput = z.object({
  dailyEnabled: z.boolean(),
  // "20:30" — the database column is `time`, so seconds are optional here.
  dailyAt: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a 24-hour time like 20:30."),
  streakWarning: z.boolean(),
});

export const publicProfileInput = z.object({
  handle: handleSchema,
  isPublic: z.boolean(),
});

/**
 * Deletion. The typed confirmation is the whole safeguard, so it is checked
 * server-side too — a disabled button is a suggestion, not a control.
 */
export const deleteAccountInput = z.object({
  confirmEmail: z.string().trim().email("Type the email address on this account."),
});

export type ReminderPrefsInput = z.infer<typeof reminderPrefsInput>;
export type PublicProfileInput = z.infer<typeof publicProfileInput>;

/**
 * Phase 4 Part B: the avatar (V2Avatar/AvatarKit). The 16 animals and 8
 * colours are the mockup's own fixed lists, transcribed verbatim — kept
 * here as the one place both the validation and the UI (avatar-kit.tsx,
 * apps/web) read them from, and the shape the 0029 migration's CHECK
 * constraints mirror.
 */
export const ANIMALS = [
  "bear", "lion", "elephant", "hippo", "koala", "panda", "monkey", "pig",
  "penguin", "rabbit", "fox", "sheep", "tiger", "cat", "owl", "frog",
] as const;
export type AnimalKey = (typeof ANIMALS)[number];

export const COLORS = [
  { key: "teal", hex: "#43B4C8" },
  { key: "amber", hex: "#FFB627" },
  { key: "green", hex: "#7CCB8F" },
  { key: "coral", hex: "#F4795B" },
  { key: "pink", hex: "#F29AB8" },
  { key: "violet", hex: "#A99AE0" },
  { key: "sky", hex: "#8EC5F0" },
  { key: "sand", hex: "#F2D9A6" },
] as const;
export type ColorKey = (typeof COLORS)[number]["key"];

export const DEFAULT_ANIMAL: AnimalKey = "fox";
export const DEFAULT_COLOR: ColorKey = "teal";

export function colorHex(key: ColorKey): string {
  return COLORS.find((c) => c.key === key)?.hex ?? COLORS[0].hex;
}

export const avatarInput = z.object({
  avatarAnimal: z.enum(ANIMALS),
  avatarColor: z.enum(COLORS.map((c) => c.key) as [ColorKey, ...ColorKey[]]),
});
export type AvatarInput = z.infer<typeof avatarInput>;
