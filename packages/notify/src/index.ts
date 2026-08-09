export { handleSendSmsHook, type HookPayload, type HookResponse } from "./hook.ts";
export type { Notifier, SendResult } from "./types.ts";
export { createWhatsAppNotifier, type WhatsAppConfig } from "./whatsapp.ts";
export {
  decodeSecret,
  verifyWebhook,
  type VerifyResult,
  type WebhookHeaders,
  // Explicit ".ts", unlike every other package here — and this is the one
  // that has to be. Deno resolves nothing without an extension, so the
  // extensionless style @jintu/contracts uses for Turbopack's sake makes a
  // module Deno cannot load. CI found it the only way it could: `supabase
  // start` parsed the send-sms function and reported "failed to read file:
  // open packages/notify/src/webhook".
  //
  // allowImportingTsExtensions in this package's tsconfig is what lets TS
  // accept the specifier. Nothing in apps/web imports this package yet; if
  // that changes, check Turbopack still maps these.
} from "./webhook.ts";
