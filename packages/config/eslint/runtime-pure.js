/**
 * ARCHITECTURE.md §2: `packages/grading` runs in BOTH Next server actions (Node)
 * and Supabase Edge Functions (Deno). A `node:fs` import that type-checks fine
 * in CI will fail at runtime inside an edge function, in production, on a
 * student's submission. This config makes that a lint error instead.
 *
 * Apply on top of ./eslint/base in any package that must stay runtime-pure.
 */

const NODE_BUILTINS = [
  "assert",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "diagnostics_channel",
  "dns",
  "domain",
  "events",
  "fs",
  "fs/promises",
  "http",
  "http2",
  "https",
  "inspector",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "sys",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "wasi",
  "worker_threads",
  "zlib",
];

const MESSAGE =
  "Node built-ins are unavailable in Supabase Edge Functions (Deno). " +
  "Keep this package runtime-pure — see ARCHITECTURE.md §2.";

export default [
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: NODE_BUILTINS.flatMap((name) => [
            { name, message: MESSAGE },
            { name: `node:${name}`, message: MESSAGE },
          ]),
        },
      ],
      "no-restricted-globals": [
        "error",
        { name: "__dirname", message: MESSAGE },
        { name: "__filename", message: MESSAGE },
        { name: "require", message: MESSAGE },
      ],
    },
  },
];
