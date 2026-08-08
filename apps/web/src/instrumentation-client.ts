import * as Sentry from "@sentry/nextjs";
import { isSentryEnabled, sentryOptions } from "@/lib/sentry";

if (isSentryEnabled()) {
  Sentry.init({
    ...sentryOptions(),
    // Session replay would record what a student types into the waitlist
    // form, including their phone number. Off, and it stays off until there
    // is a consent purpose that covers it.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
