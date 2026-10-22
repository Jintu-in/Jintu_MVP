import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import base from "./base.js";

/** Flat config for `apps/web` — base rules plus Next's core-web-vitals set. */
export default [
  ...base,
  // v16 exposes flat configs under `configs`; the `*-legacy` keys are eslintrc.
  nextPlugin.configs["core-web-vitals"],
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.serviceworker },
    },
    rules: {
      // ARCHITECTURE.md §7: the service-role key must never reach the client.
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message:
            "Read env through a validated module, not process.env directly — " +
            "it is how SUPABASE_SERVICE_ROLE_KEY leaks into a client bundle.",
        },
      ],
    },
  },
  {
    // The validated env module and next.config are the sanctioned readers.
    // vitest.config.ts/playwright.config.ts join them for the same reason as
    // next.config.ts: build/test tooling that runs in Node only and is never
    // part of the client bundle `no-restricted-properties` is guarding.
    files: [
      "**/src/lib/env.ts",
      "**/next.config.ts",
      "**/src/lib/supabase/**",
      "**/vitest.config.ts",
      "**/playwright.config.ts",
      "**/playwright.auth.config.ts",
    ],
    rules: { "no-restricted-properties": "off" },
  },
];
