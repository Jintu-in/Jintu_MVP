import * as Sentry from "@sentry/nextjs";
import { isSentryEnabled, sentryOptions } from "@/lib/sentry";

/** Server and edge runtime init. No DSN configured means no init at all. */
export async function register() {
  if (!isSentryEnabled()) return;
  Sentry.init(sentryOptions());
}

export const onRequestError = Sentry.captureRequestError;
