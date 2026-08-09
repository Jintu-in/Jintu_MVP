export { handleSendSmsHook, type HookPayload, type HookResponse } from "./hook";
export type { Notifier, SendResult } from "./types";
export { createWhatsAppNotifier, type WhatsAppConfig } from "./whatsapp";
export {
  decodeSecret,
  verifyWebhook,
  type VerifyResult,
  type WebhookHeaders,
  // Extensionless: moduleResolution is "bundler" and this package ships TS
  // source. See the note in @jintu/contracts index.ts.
} from "./webhook";
