import type { MetadataRoute } from "next";

/**
 * Typed manifest rather than a static JSON file (ARCHITECTURE.md §2), so the
 * icon paths are checked against the ones `pnpm icons` actually writes.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jintu — Placement Sprints",
    short_name: "Jintu",
    description: "Six weeks. Six artifacts. One proof-of-readiness profile.",
    // The curriculum, not the dashboard: an installed app should open on
    // something that works before you have signed in, and /learn is the only
    // full-value screen that needs no session.
    start_url: "/learn",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#43b4c8",
    lang: "en-IN",
    dir: "ltr",
    categories: ["education"],
    icons: [
      { src: "/icons/192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
