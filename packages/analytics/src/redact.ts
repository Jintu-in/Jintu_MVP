/**
 * Strips things that identify a person out of telemetry payloads.
 *
 * Both PostHog and Sentry use this. Neither is supposed to receive a phone
 * number, but "supposed to" is not a control: a phone number reaches Sentry
 * the first time someone puts one in an error message, and reaches PostHog
 * the first time someone passes a whole form object as event properties.
 * This makes that a redaction rather than a breach.
 */

// Indian mobiles in every shape our own normaliser accepts, plus bare
// 10-digit runs, which is what an unnormalised form field looks like.
//
// Digit-run guards, not \b: in "+919876543210" there is no word boundary
// between the "91" prefix and the number, because both sides are word
// characters. A \b here silently fails to match the single most likely
// format — the one our own normaliser produces.
const PHONE = /(?<!\d)(?:\+?91[-\s]?)?[6-9]\d{9}(?!\d)/g;
const EMAIL = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g;
// Supabase/JWT-shaped tokens — three base64url segments.
const JWT = /\beyJ[\w-]+\.[\w-]+\.[\w-]+\b/g;

export const REDACTED = "[redacted]";

/** Redact identifiers from a string. */
export function redactString(input: string): string {
  return input
    .replace(JWT, REDACTED)
    .replace(EMAIL, REDACTED)
    .replace(PHONE, REDACTED);
}

/** True if a string still contains something that identifies a person. */
export function containsIdentifier(input: string): boolean {
  // Fresh lastIndex each call — these are /g regexes and .test is stateful.
  return (
    new RegExp(PHONE.source).test(input) ||
    new RegExp(EMAIL.source).test(input) ||
    new RegExp(JWT.source).test(input)
  );
}

/**
 * Deep-redact an arbitrary payload. Keys whose names suggest an identifier
 * are dropped entirely rather than pattern-matched, because a value we fail
 * to recognise is more dangerous than one we do.
 */
const SENSITIVE_KEY = /phone|mobile|email|password|token|otp|secret|key|aadhaar/i;

export function redactPayload(value: unknown, depth = 0): unknown {
  if (depth > 8) return REDACTED; // cyclic or absurdly nested — do not walk it
  if (typeof value === "string") return redactString(value);
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((v) => redactPayload(v, depth + 1));

  const out: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
    out[key] = SENSITIVE_KEY.test(key) ? REDACTED : redactPayload(v, depth + 1);
  }
  return out;
}
