import type { Notifier, SendResult } from "./types";

/**
 * WhatsApp Cloud API, for one-time codes.
 *
 * Why WhatsApp rather than SMS: every A2P SMS to an Indian number needs TRAI
 * DLT registration first — a registered entity, header and template approvals
 * on each operator's portal, weeks of waiting. WhatsApp is OTT and outside
 * that regime entirely. It needs Meta business verification instead, which is
 * work this product has to do anyway for the Phase 2 deadline nudges, so
 * sign-in rides on it for free.
 *
 * Why the Cloud API directly rather than the BSP named in `WA_PROVIDER`:
 * every BSP is a reseller of this endpoint, and this is the shape their APIs
 * wrap. Writing against it means the adapter is testable against a
 * specification rather than against my recollection of a vendor's docs. An
 * AiSensy implementation of `Notifier` drops in beside this one when someone
 * has their current API reference open — the interface is the point.
 */

export type WhatsAppConfig = {
  /** From Meta > WhatsApp > API Setup. Not the phone number itself. */
  phoneNumberId: string;
  accessToken: string;
  /**
   * An approved template in the AUTHENTICATION category. Meta rejects a code
   * sent through a marketing or utility template, and treats a marketing
   * message sent through this one as a policy violation.
   */
  templateName: string;
  /** BCP-47, as registered with the template. "en" and "en_US" are not interchangeable. */
  templateLanguage: string;
  /** Pinned rather than floating: Meta ships breaking changes between versions. */
  graphVersion?: string;
};

const DEFAULT_GRAPH_VERSION = "v21.0";

/** Meta's own transient failures, plus rate limiting. Anything else is ours to fix. */
function isRetryable(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

export function createWhatsAppNotifier(
  config: WhatsAppConfig,
  /** Injected so tests drive it without a network. */
  fetchImpl: typeof fetch = fetch,
): Notifier {
  const version = config.graphVersion ?? DEFAULT_GRAPH_VERSION;
  const endpoint = `https://graph.facebook.com/${version}/${config.phoneNumberId}/messages`;

  return {
    async sendOtp(to: string, code: string): Promise<SendResult> {
      // Meta wants the recipient without the leading +. Supabase stores E.164
      // with it, so stripping here rather than at the call site keeps the
      // rest of the codebase on one representation.
      const recipient = to.replace(/^\+/, "");

      // An authentication template carries the code twice, and both are
      // required: once in the body, where the person reads it, and once in
      // the copy-code button, which is what makes it one tap on a phone
      // instead of a manual transcription between two apps.
      const body = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipient,
        type: "template",
        template: {
          name: config.templateName,
          language: { code: config.templateLanguage },
          components: [
            { type: "body", parameters: [{ type: "text", text: code }] },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [{ type: "text", text: code }],
            },
          ],
        },
      };

      let response: Response;
      try {
        response = await fetchImpl(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } catch (cause) {
        // DNS, TLS, a dropped socket. Nothing was delivered and nothing was
        // charged, so this is always worth another go.
        return {
          ok: false,
          retryable: true,
          error: `could not reach the WhatsApp API: ${cause instanceof Error ? cause.message : String(cause)}`,
        };
      }

      const text = await response.text();

      if (!response.ok) {
        // Meta's error body is JSON, but an edge or gateway in front of it
        // may answer with HTML. Parsing defensively keeps a 502 from turning
        // into a thrown SyntaxError that loses the status code entirely.
        let detail = text.slice(0, 300);
        try {
          const parsed = JSON.parse(text) as { error?: { message?: string; code?: number } };
          if (parsed.error?.message) detail = `${parsed.error.message} (code ${parsed.error.code})`;
        } catch {
          // keep the raw prefix
        }
        return {
          ok: false,
          retryable: isRetryable(response.status),
          error: `WhatsApp API returned ${response.status}: ${detail}`,
        };
      }

      let providerMessageId: string | null = null;
      try {
        const parsed = JSON.parse(text) as { messages?: { id?: string }[] };
        providerMessageId = parsed.messages?.[0]?.id ?? null;
      } catch {
        // A 200 we cannot parse still delivered the message. Losing the id
        // costs us a row in `notifications` that cannot be traced back to
        // Meta later; it does not mean the student got nothing.
      }

      return { ok: true, providerMessageId };
    },
  };
}
