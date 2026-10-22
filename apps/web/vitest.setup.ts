// Adds the jest-dom matchers (toBeVisible, toHaveTextContent, ...) to
// Vitest's `expect`. Imported once, here, rather than per-test-file.
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * React Testing Library's auto-cleanup normally self-registers against a
 * global `afterEach` — but this project calls `describe`/`test`/`afterEach`
 * explicitly from "vitest" rather than enabling Vitest's `globals: true`
 * (vitest.config.ts), so there is no global for RTL's side-effecting
 * import to find. Without this, a second test in the same file renders
 * into a DOM the first test's render never left — exactly the kind of
 * "every link appears twice" failure that looks like a component bug and
 * is actually a missing teardown.
 */
afterEach(() => {
  cleanup();
});

/**
 * next/link uses IntersectionObserver to decide when a viewport-visible
 * link is worth prefetching. jsdom doesn't implement it at all, and
 * without a stub the resulting error surfaces as a confusing, unrelated
 * "window is not defined" AFTER a later test file's environment has
 * already torn down — not at the point Link actually fails. A minimal
 * no-op class (never actually observes anything) is the standard fix:
 * it satisfies the `typeof IntersectionObserver === "function"` check
 * Link makes and nothing ever calls the callback, which is correct for a
 * unit test that isn't asserting on prefetch behaviour.
 */
class NoopIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}
globalThis.IntersectionObserver = NoopIntersectionObserver;
