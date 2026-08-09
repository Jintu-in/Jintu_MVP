import base from "@jintu/config/eslint/base";
import runtimePure from "@jintu/config/eslint/runtime-pure";

/**
 * ARCHITECTURE.md §2: this package runs in Next server actions (Node) AND in
 * Supabase Edge Functions (Deno). runtime-pure bans every Node built-in so a
 * `node:fs` import cannot reach an edge function and fail there in production.
 *
 * Tests are exempt: they run under Vitest on Node only, and they need a real
 * Postgres to drive the QueryRunner.
 */
export default [
  ...base,
  ...runtimePure,
  {
    files: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": "off",
      "no-restricted-globals": "off",
    },
  },
];
