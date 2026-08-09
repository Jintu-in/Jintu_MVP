/**
 * Supabase Auth's send-sms hook, delivering over WhatsApp.
 *
 * Supabase still owns the one-time code — generating it, hashing it, expiring
 * it, verifying it. This function only carries the message, which is what
 * makes the channel a detail: nothing about the sign-in flow, the forms, or
 * the actions knows it is not an SMS.
 *
 * Why WhatsApp and not SMS: every A2P SMS to an Indian number needs TRAI DLT
 * registration first — a registered entity, header and template approvals on
 * each operator portal, weeks of waiting, all of it bought for authentication
 * alone. WhatsApp is OTT and outside that regime. It needs Meta business
 * verification, which this product needs anyway for the Phase 2 deadline
 * nudges, so sign-in rides on work already committed to.
 *
 * ── Deliberately almost empty ────────────────────────────────────────────────
 * Every decision — signature verification, replay window, payload validation,
 * which failures are worth retrying — lives in @jintu/notify and is tested
 * under Vitest. This file reads environment variables and calls one function.
 *
 * That split is not tidiness. This is the only file in the repo that CI
 * cannot execute: it needs Deno, and `supabase functions serve` needs Docker.
 * Anything written here is code nothing runs until a student tries to sign in.
 *
 * ── Deploying ────────────────────────────────────────────────────────────────
 *   pnpm fn:deploy send-sms
 *   supabase secrets set --env-file .env      # the WA_* vars and the hook secret
 * then point [auth.hook.send_sms] at it in supabase/config.toml and
 * `supabase config push`.
 */
import { createWhatsAppNotifier, handleSendSmsHook } from "../../../packages/notify/src/index.ts";

/** Present in every Deno runtime; declared because this file is outside the TS project. */
declare const Deno: { env: { get(key: string): string | undefined } };

const required = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) {
    // Fail at boot rather than on the first sign-in. A missing secret that
    // surfaces as a 500 during someone's first minute with the product is the
    // same bug, found later and by the wrong person.
    throw new Error(`${name} is not set. supabase secrets set ${name}=…`);
  }
  return value;
};

const hookSecret = required("SEND_SMS_HOOK_SECRET");
const notifier = createWhatsAppNotifier({
  phoneNumberId: required("WA_PHONE_NUMBER_ID"),
  accessToken: required("WA_ACCESS_TOKEN"),
  // An AUTHENTICATION-category template. Meta rejects a code sent through a
  // marketing or utility one.
  templateName: required("WA_TEMPLATE_OTP"),
  // Must match the language the template was approved in. "en" and "en_US"
  // are different templates as far as Meta is concerned.
  templateLanguage: Deno.env.get("WA_TEMPLATE_LANG") ?? "en",
});

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: { http_code: 405, message: "Method not allowed." } }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // The raw text, not request.json(): the signature covers the exact bytes
  // Supabase sent, and parsing then re-serialising changes them.
  const rawBody = await request.text();

  const { status, body } = await handleSendSmsHook(
    rawBody,
    {
      id: request.headers.get("webhook-id"),
      timestamp: request.headers.get("webhook-timestamp"),
      signature: request.headers.get("webhook-signature"),
    },
    hookSecret,
    notifier,
  );

  return new Response(body, { status, headers: { "Content-Type": "application/json" } });
});
