import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false },
};

/**
 * Served by the service worker when a navigation fails and nothing cached
 * matches. Static on purpose — a page shown when the network is gone cannot
 * fetch anything.
 */
export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-medium text-ink-900">You are offline</h1>
      <p className="mt-3 text-pretty text-ink-600">
        This page needs a connection. Weeks you have already opened are still
        readable — the curriculum is cached once you have visited it.
      </p>
      <p className="mt-6">
        <Link href="/learn" className="text-brand-700 underline hover:text-brand-800">
          Back to the curriculum
        </Link>
      </p>
      <p className="mt-8 text-sm text-ink-500">
        Anything you submit needs a connection, so nothing you type while
        offline is saved. Come back to it when you have signal.
      </p>
    </main>
  );
}
