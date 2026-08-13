import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getServiceEnv } from "@/lib/env";

/**
 * The rate limits around the auth flow's two sensitive doors (AUTH.md):
 * the existence check (6/email/hour, 20/IP/hour) and password sign-ins
 * (backoff after 5 failures in the hour).
 *
 * Counting happens in auth_attempts through the service role — the table is
 * unreachable by clients, and everything stored is a SHA-256 hex, never a
 * plaintext address or IP. If the service key is not configured the helpers
 * degrade OPEN with a loud log: a missing env var must never lock every
 * user out, and the flow it degrades to (send a code) is itself safe.
 */

export const sha256 = (s: string) => createHash("sha256").update(s.toLowerCase()).digest("hex");

export async function requestIpHash(): Promise<string | null> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || h.get("x-real-ip") || "";
  return ip ? sha256(ip) : null;
}

function admin() {
  const env = getServiceEnv();
  if (!env) return null;
  return createSupabaseClient(env.url, env.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

type Kind = "exists_check" | "password_fail";

/** Rows for (kind, hash column) in the last hour, newest first. */
async function recent(kind: Kind, column: "email_hash" | "ip_hash", hash: string) {
  const db = admin();
  if (!db) return null;
  const { data, error } = await db
    .from("auth_attempts")
    .select("created_at")
    .eq("kind", kind)
    .eq(column, hash)
    .gte("created_at", new Date(Date.now() - 3_600_000).toISOString())
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[auth] attempt count failed", error.code, error.message);
    return null;
  }
  return data;
}

export async function record(kind: Kind, email: string) {
  const db = admin();
  if (!db) {
    console.error("[auth] SUPABASE_SECRET_KEY missing — attempts are not being recorded");
    return;
  }
  const { error } = await db.from("auth_attempts").insert({
    kind,
    email_hash: sha256(email),
    ip_hash: await requestIpHash(),
  });
  if (error) console.error("[auth] attempt record failed", error.code, error.message);
}

/** True when the existence check should be refused for now. */
export async function existsCheckLimited(email: string): Promise<boolean> {
  const byEmail = await recent("exists_check", "email_hash", sha256(email));
  if (byEmail && byEmail.length >= 6) return true;
  const ip = await requestIpHash();
  if (ip) {
    const byIp = await recent("exists_check", "ip_hash", ip);
    if (byIp && byIp.length >= 20) return true;
  }
  return false;
}

/**
 * Exponential backoff after five failures in the hour: the sixth try waits
 * two minutes, the seventh four, capped at thirty. Returns minutes still to
 * wait, or 0 when the attempt may proceed.
 */
export async function passwordBackoffMinutes(email: string): Promise<number> {
  const fails = await recent("password_fail", "email_hash", sha256(email));
  const latest = fails?.[0];
  if (!fails || fails.length < 5 || !latest) return 0;
  const waitMin = Math.min(30, 2 ** (fails.length - 4));
  const sinceLastMs = Date.now() - new Date(latest.created_at).getTime();
  return Math.max(0, Math.ceil(waitMin - sinceLastMs / 60_000));
}

/** The service-role existence probe. Null when unanswerable (no key). */
export async function emailRegistered(email: string): Promise<boolean | null> {
  const db = admin();
  if (!db) {
    console.error("[auth] SUPABASE_SECRET_KEY missing — cannot check existence, degrading to the code flow");
    return null;
  }
  const { data, error } = await db.rpc("email_registered", { p_email: email });
  if (error) {
    console.error("[auth] email_registered failed", error.code, error.message);
    return null;
  }
  return Boolean(data);
}
