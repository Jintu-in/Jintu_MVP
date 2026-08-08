import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workspace packages ship TS source, not build output.
  transpilePackages: ["@jintu/ui", "@jintu/grading", "@jintu/contracts"],
  images: {
    // YouTube thumbnails only. Law 2 — we link and embed, never rehost.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  typedRoutes: true,
};

export default nextConfig;
