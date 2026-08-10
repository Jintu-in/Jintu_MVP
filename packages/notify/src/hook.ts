import type { Notifier } from "./types.ts";
import { verifyWebhook, type WebhookHeaders } from "./webhook.ts";

/**
 * The Supabase send-sms hook, as a function of its inputs.
 *
 * All of the behaviour lives here rather than in the edge function so that it
 * can be tested under Vitest on Node. The function itself is then a dozen
 * lines of glue that read environment variables and call this — which matters
 * because the edge function is the one file in this repo that CI cannot run:
 * it needs Deno, and `supabase functions serve` needs Docker.
 *
 * Supabase's contract:
 *   in   POST with `{ user: { phone }, sms: { otp } }`, Standard Webhooks signed
 *   out  200 and any body on success
 *        non-2xx with `{ error: { http_code, message } }` to fail the sign-in
 */

export type HookPayload = {
  user?: { id?: string; phone?: string | null };
  sms?: { otp?: string };
};

export type HookResponse = {
  status: number;
  body: string;
};

function failure(status: number, message: string): HookResponse {
  return {
    status,
    // Supabase surfaces this shape to the client. The wording reaches a
    // student mid sign-in, so it says what to do, not what broke.
    body: JSON.stringify({ error: { http_code: status, message } }),
  };
}

export async function handleSendSmsHook(
  rawBody: string,
  headers: WebhookHeaders,
  secret: string,
  notifier: Notifier,
  now: Date = new Date(),
): Promise<HookResponse> {
  const verified = await verifyWebhook(rawBody, headers, secret, now);
  if (!verified.ok) {
    // 401 and a fixed message. An unsigned request is either an attacker or a
    // misconfiguration, and telling the caller which of the two — or which
    // header was wrong — helps only the first of them.
    return failure(401, "Unauthorized.");
  }

  let payload: HookPayload;
  try {
    payload = JSON.parse(rawBody) as HookPayload;
  } catch {
    return failure(400, "Malformed request.");
  }

  const phone = payload.user?.phone;
  const otp = payload.sms?.otp;

  if (!phone || !otp) {
    return failure(400, "Malformed request.");
  }

  // Supabase stores E.164; anything else means the number reached the auth
  // system by a route that skipped validation, and sending to it would be
  // guessing at a country code on someone's behalf.
  if (!/^\+?[1-9]\d{7,14}$/.test(phone)) {
    return failure(400, "That phone number is not one we can send to.");
  }

  const result = await notifier.sendOtp(phone.startsWith("+") ? phone : `+${phone}`, otp);

  if (!result.ok) {
    // 429 rather than 500 when it is worth trying again: Supabase surfaces
    // the status, and a retryable failure told to the student as "something
    // went wrong" gets a support message, while "try again in a moment" gets
    // a retry.
    return result.retryable
      ? failure(429, "We could not send your code just now. Try again in a moment.")
      : failure(500, "We could not send your code. Please tell us — this one is on us.");
  }

  return { status: 200, body: JSON.stringify({}) };
}
