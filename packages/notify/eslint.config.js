import base from "@jintu/config/eslint/base";
import runtimePure from "@jintu/config/eslint/runtime-pure";

/**
 * ARCHITECTURE.md §2. This package is imported by the `send-sms` edge
 * function, which is Deno — so the same rule that guards packages/grading
 * guards this one, and for a sharper reason: a Node built-in here fails in
 * production at the moment someone tries to sign in.
 *
 * Everything it needs is a web standard that both runtimes have: fetch,
 * crypto.subtle, TextEncoder.
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
