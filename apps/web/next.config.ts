import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  // A service worker in development caches the very files you are editing and
  // then serves them back after you change them. The confusion it causes is
  // worse than the fidelity it buys.
  disable: process.env.NODE_ENV === "development",
  // No `exclude` here on purpose. It was tried, and the emitted sw.js was
  // byte-identical: @serwist/next precaches only the offline fallback and
  // leaves everything else to runtime caching. Keeping an option that changes
  // nothing would imply private routes are kept out of the cache by config,
  // when the fetch handler in src/sw.ts is what actually does it.
});

const nextConfig: NextConfig = {
  // Workspace packages ship TS source, not build output.
  transpilePackages: ["@jintu/ui", "@jintu/grading", "@jintu/contracts"],
  images: {
    // YouTube thumbnails only. Law 2 — we link and embed, never rehost.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  typedRoutes: true,
  // sandbox/run-sql.mjs is spawned as a child process, so nothing imports it
  // and the tracer would not find it. Its one dependency has to come along
  // explicitly for the same reason: file tracing follows the module graph,
  // and this file is not in it.
  outputFileTracingIncludes: {
    "/**": ["./sandbox/**", "../../node_modules/.pnpm/@electric-sql+pglite@*/**"],
  },
};

export default withSerwist(nextConfig);
