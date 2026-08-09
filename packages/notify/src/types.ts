/**
 * Outbound messaging, behind one interface.
 *
 * ARCHITECTURE.md §1 says to abstract the WhatsApp BSP rather than call it
 * directly, and §2 puts that abstraction here. The reason is not portability
 * for its own sake: BSPs are resellers of Meta's Cloud API, they change
 * pricing and rate limits on their own schedule, and the day one of them
 * becomes untenable should be a day we write one file.
 *
 * This package is runtime-pure. It runs inside the `send-sms` edge function
 * (Deno) and, from Phase 2, inside the nudge cron as well — so it opens no
 * connections it is not handed, imports no Node built-ins, and uses only
 * `fetch`, `crypto.subtle` and `TextEncoder`.
 */

/**
 * Where a message went and what it cost us to find out.
 *
 * `retryable` is the field that matters at the call site. A 429 or a 5xx is
 * worth trying again; a template that Meta has not approved is not, and
 * retrying it burns quota to produce the same rejection. Callers that cannot
 * tell the difference end up doing one of the two wrong.
 */
export type SendResult =
  | { ok: true; providerMessageId: string | null }
  | { ok: false; retryable: boolean; error: string };

export type Notifier = {
  /**
   * Delivers a one-time code.
   *
   * Separate from the general template send on purpose. Meta treats
   * authentication as its own message category with its own template rules,
   * its own pricing, and a requirement that the code appear in a specific
   * component — a sign-in code sent as a marketing template is rejected, and
   * a marketing message sent as authentication is a policy violation.
   *
   * @param to   E.164, e.g. +919876543210
   * @param code The OTP. Generated, stored and verified by Supabase Auth;
   *             this package only carries it.
   */
  sendOtp(to: string, code: string): Promise<SendResult>;
};
