import "server-only";
import { OPTIONAL_PURPOSES } from "@jintu/contracts";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { retryRead } from "@/lib/supabase/retry";
import { createClient } from "@/lib/supabase/server";

/**
 * Everything the account half of /profile reads.
 *
 * The record half — stats, the contribution grid, roadmaps — is session P2
 * and deliberately absent. What is here instead is `hasRecord`, the one bit
 * the settings page needs to decide between "your record" and the quiet card
 * that replaces it, so a new account never renders a wall of zeros.
 */

export type ConsentRow = {
  purpose: string;
  grantedAt: string | null;
  withdrawnAt: string | null;
  noticeVersion: string | null;
};

export type AccountData = {
  userId: string;
  email: string;
  fullName: string | null;
  displayName: string | null;
  initials: string;
  timezone: string;
  reminders: { dailyEnabled: boolean; dailyAt: string; streakWarning: boolean };
  publicProfile: { handle: string | null; isPublic: boolean };
  suggestedHandle: string;
  consents: ConsentRow[];
  /** False for an account that has not finished a day — no zeros are drawn. */
  hasRecord: boolean;
  /** Counts for the delete page's "this removes" list. */
  counts: { days: number; saved: number; notes: number };
};

/** "Priya Raghavan" → "PR". Falls back to the email's first letter. */
function initialsFrom(name: string | null, email: string): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts.at(-1)![0]!).toUpperCase();
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (email[0] ?? "?").toUpperCase();
}

/** A first guess at a handle, from the name or the email local part. */
function suggestHandle(name: string | null, email: string): string {
  const base = (name ?? email.split("@")[0] ?? "learner")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const trimmed = base.slice(0, 30);
  return trimmed.length >= 3 ? trimmed : `${trimmed}-jintu`.slice(0, 30);
}

export async function getAccount(): Promise<AccountData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, remindersRes, publicRes, consentsRes, daysRes, savedRes] = await Promise.all([
    retryRead(() =>
      supabase.from("profiles").select("full_name, display_name, timezone").eq("id", user.id).maybeSingle(),
    ),
    retryRead(() => supabase.from("reminder_prefs").select("*").maybeSingle()),
    retryRead(() => supabase.from("public_profiles").select("handle, is_public").maybeSingle()),
    retryRead(() =>
      supabase.from("consents").select("purpose, granted_at, withdrawn_at, notice_version").order("granted_at"),
    ),
    retryRead(() => supabase.from("activity_days").select("done_on", { count: "exact", head: true })),
    retryRead(() =>
      supabase.from("saved_resources").select("resource_id", { count: "exact", head: true }),
    ),
  ]);

  if (profileRes.error) throw describeSupabaseError("reading your profile", profileRes.error);
  if (!profileRes.data) return null; // authenticated but never onboarded

  for (const [what, res] of [
    ["your reminders", remindersRes],
    ["your public profile", publicRes],
    ["your consents", consentsRes],
    ["your activity", daysRes],
    ["your saved links", savedRes],
  ] as const) {
    if (res.error) throw describeSupabaseError(`reading ${what}`, res.error);
  }

  const email = user.email ?? "";
  const fullName = profileRes.data.full_name ?? null;
  const displayName = profileRes.data.display_name ?? null;

  // Latest row per purpose — a purpose can be granted, withdrawn and granted
  // again, and the current state is the last word.
  const byPurpose = new Map<string, ConsentRow>();
  for (const c of consentsRes.data ?? []) {
    byPurpose.set(c.purpose, {
      purpose: c.purpose,
      grantedAt: c.granted_at,
      withdrawnAt: c.withdrawn_at,
      noticeVersion: c.notice_version,
    });
  }
  const consents: ConsentRow[] = ["core_service", ...OPTIONAL_PURPOSES].map(
    (p) => byPurpose.get(p) ?? { purpose: p, grantedAt: null, withdrawnAt: null, noticeVersion: null },
  );

  return {
    userId: user.id,
    email,
    fullName,
    displayName,
    initials: initialsFrom(displayName ?? fullName, email),
    timezone: profileRes.data.timezone ?? "UTC",
    reminders: {
      dailyEnabled: remindersRes.data?.daily_enabled ?? false,
      // The column is `time`, which comes back as "20:30:00".
      dailyAt: String(remindersRes.data?.daily_at ?? "20:30").slice(0, 5),
      streakWarning: remindersRes.data?.streak_warning ?? false,
    },
    publicProfile: {
      handle: publicRes.data?.handle ?? null,
      isPublic: publicRes.data?.is_public ?? false,
    },
    suggestedHandle: suggestHandle(displayName ?? fullName, email),
    consents,
    hasRecord: (daysRes.count ?? 0) > 0,
    counts: {
      days: daysRes.count ?? 0,
      saved: savedRes.count ?? 0,
      // Notes do not exist yet; the delete page must not claim otherwise.
      notes: 0,
    },
  };
}
