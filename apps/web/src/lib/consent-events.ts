import "server-only";
import { NOTICE_VERSION, type OptionalPurpose } from "@jintu/contracts";
import type { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

/**
 * The append-only consent log (migration 0026), shared by every action that
 * changes a consent — directly (the analytics toggle) or as a side effect of
 * an operational setting (reminders, public profile). One purpose, one
 * grant/withdraw event, every time: never an update, never a delete.
 */
export async function recordConsentEvent(
  supabase: SupabaseClient,
  userId: string,
  purpose: OptionalPurpose | "core_service",
  granted: boolean,
  source = "settings",
) {
  const { error } = await supabase.from("consent_events").insert({
    user_id: userId,
    purpose,
    granted,
    notice_version: NOTICE_VERSION,
    source,
  });
  if (error) throw new Error(`Could not record that: ${error.message}`);
}

/**
 * For a caller where the consent log is a side effect of an operational
 * write that has already succeeded (reminders, public profile): log and
 * swallow rather than fail the whole action over the secondary record —
 * the setting itself was genuinely saved, and telling the user otherwise
 * would be wrong.
 */
export async function recordConsentEventBestEffort(
  ...args: Parameters<typeof recordConsentEvent>
) {
  try {
    await recordConsentEvent(...args);
  } catch (error) {
    console.error("[consent-events] record failed", args[2], error);
  }
}

export type ConsentState = { granted: boolean; at: string | null };

/** Latest event per purpose — "current state" as CHANGES.md defines it. */
export async function latestConsents(
  supabase: SupabaseClient,
  userId: string,
): Promise<Record<string, ConsentState>> {
  const { data, error } = await supabase
    .from("consent_events")
    .select("purpose, granted, at")
    .eq("user_id", userId)
    .order("at", { ascending: false });
  if (error) throw error;

  const state: Record<string, ConsentState> = {};
  for (const row of data ?? []) {
    // First row seen per purpose is the latest, because of the order() above.
    if (!(row.purpose in state)) {
      state[row.purpose] = { granted: row.granted, at: row.granted ? row.at : null };
    }
  }
  return state;
}
