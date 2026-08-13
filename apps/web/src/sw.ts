import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

/**
 * Never serve a cached page for anything behind a session.
 *
 * The default runtime cache would happily hand a second person on a shared
 * phone the previous user's account page, or show a stale streak as if it
 * were current. Shared devices are normal in the market this is built for,
 * so this is a correctness rule rather than a hardening nicety.
 *
 * The public catalogue is the opposite case: it is identical for everyone
 * and is exactly what should still work on a train.
 */
const PRIVATE_PATHS = /^\/(account|onboarding|profile|join)(\/|$)/;

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && PRIVATE_PATHS.test(url.pathname)) {
    // Let it go straight to the network, and never write it to a cache.
    event.respondWith(fetch(event.request));
  }
});

serwist.addEventListeners();
