import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * Vitest + React Testing Library, new for the redesign (Phase 0, §4 of
 * BUILD-PLAN.md). This is a SEPARATE layer from `sandbox/run-tests.mjs`'s
 * `node --test` suite, not a replacement for it — that suite asserts on
 * raw source text (no render step) and catches a different class of
 * regression; both run under `pnpm test` (see package.json) and both stay
 * required in CI.
 *
 * Component tests live co-located with what they test, as `*.test.tsx`
 * (Vitest's default include pattern), so a test moves or deletes with its
 * component rather than living in a parallel tree that can go stale.
 *
 * jsdom, not happy-dom: the redesign's component tests will exercise real
 * keyboard/focus behaviour (BUILD-PLAN.md §4's "forms — validation,
 * errors" and §5's "axe clean, keyboard usable, focus visible"), and jsdom
 * is the more complete DOM implementation for that — happy-dom is faster
 * but trades away some of the exact behaviour those tests need to assert.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
