/**
 * Verifies that a request really came from Supabase Auth.
 *
 * The send-sms hook is a public HTTPS endpoint. Without this, anyone who
 * learns the URL can POST a phone number and a string and make us send a
 * WhatsApp message to it — at our cost, from our verified sender, saying
 * whatever they like. That is not a hypothetical abuse of an OTP endpoint;
 * it is the standard one.
 *
 * Supabase signs hook requests with the Standard Webhooks scheme:
 *
 *   webhook-id         opaque delivery id
 *   webhook-timestamp  unix seconds
 *   webhook-signature  space-separated list of `v1,<base64 hmac>`
 *
 * The signed content is `${id}.${timestamp}.${body}` and the key is the
 * decoded secret. The signature list is plural because a secret being rotated
 * produces two valid signatures at once; accepting any one of them is what
 * makes rotation a non-event rather than an outage.
 *
 * Web Crypto only — this runs in Deno.
 */

export type WebhookHeaders = {
  id: string | null;
  timestamp: string | null;
  signature: string | null;
};

export type VerifyResult = { ok: true } | { ok: false; reason: string };

/**
 * How far out of date a delivery may be. Without a bound, a signature stays
 * valid forever and anyone who captures one request can replay it
 * indefinitely — the signature proves origin, not freshness.
 */
const TOLERANCE_SECONDS = 5 * 60;

/**
 * Supabase hands the secret out as `v1,whsec_<base64>`. The `v1,` is a scheme
 * marker and `whsec_` is a human-readable prefix; neither is key material,
 * and including them in the HMAC produces a signature that never matches.
 */
export function decodeSecret(raw: string): Uint8Array {
  const withoutScheme = raw.startsWith("v1,") ? raw.slice(3) : raw;
  const base64 = withoutScheme.startsWith("whsec_") ? withoutScheme.slice(6) : withoutScheme;

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function toBase64(bytes: ArrayBuffer): string {
  const view = new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/**
 * Compares in time independent of where the first difference falls.
 *
 * `a === b` on secrets leaks their contents: it returns as soon as two bytes
 * differ, so the time taken says how many leading bytes were right, and an
 * attacker who can measure that can build a valid signature a byte at a time.
 * The lengths are compared first and separately because they are not secret.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

export async function verifyWebhook(
  rawBody: string,
  headers: WebhookHeaders,
  secret: string,
  /** Injected so the tolerance check is testable without waiting five minutes. */
  now: Date = new Date(),
): Promise<VerifyResult> {
  const { id, timestamp, signature } = headers;

  if (!id || !timestamp || !signature) {
    return { ok: false, reason: "missing webhook signature headers" };
  }

  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt)) {
    return { ok: false, reason: "webhook timestamp is not a number" };
  }

  const drift = Math.abs(Math.floor(now.getTime() / 1000) - sentAt);
  if (drift > TOLERANCE_SECONDS) {
    return { ok: false, reason: "webhook timestamp is outside the replay window" };
  }

  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey(
      "raw",
      decodeSecret(secret) as unknown as ArrayBuffer,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
  } catch {
    // A malformed secret is our misconfiguration, not a hostile request, and
    // the two must not be reported the same way — one needs a deploy, the
    // other needs ignoring.
    return { ok: false, reason: "hook secret is not valid base64" };
  }

  const signed = new TextEncoder().encode(`${id}.${timestamp}.${rawBody}`);
  const expected = toBase64(await crypto.subtle.sign("HMAC", key, signed as unknown as ArrayBuffer));

  // Space-separated, and each entry is `v<version>,<base64>`. Unknown
  // versions are skipped rather than rejected, so a future scheme arriving
  // alongside v1 does not break a verifier that still understands v1.
  const candidates = signature
    .split(" ")
    .filter((part) => part.startsWith("v1,"))
    .map((part) => part.slice(3));

  if (candidates.length === 0) {
    return { ok: false, reason: "no v1 signature in the header" };
  }

  for (const candidate of candidates) {
    if (timingSafeEqual(candidate, expected)) return { ok: true };
  }

  return { ok: false, reason: "signature does not match" };
}
