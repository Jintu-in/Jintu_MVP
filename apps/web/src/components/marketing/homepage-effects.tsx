"use client";

import { useEffect } from "react";

/**
 * The homepage's motion. Renders nothing — it only attaches observers.
 *
 * The v2 design carries no DCLogic, so the behaviour is defined here. Three
 * gates, each for a different reason:
 *
 *   1. Reveals and the 91-square grid fill ONCE. The observer adds the
 *      class and immediately unobserves, so scrolling back up never
 *      replays a section — a page that re-animates on every pass reads as
 *      a demo rather than a product.
 *   2. Reduced motion lands everything in its final state up front. Not
 *      "freeze mid-animation": a half-faded section is worse than no
 *      effect at all.
 *   3. The nav flips to a solid surface once the hero has scrolled past.
 *      It starts transparent with white text over the dark end of the
 *      gradient; leaving it that way over a pale page would be white on
 *      white. Tracked with an observer on a sentinel rather than a scroll
 *      listener, so nothing runs on the scroll thread.
 */
export function HomepageEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".jhome .jreveal"));
    const grids = Array.from(document.querySelectorAll<HTMLElement>(".jhome .jgrid91"));
    const nav = document.querySelector<HTMLElement>(".jhome .jnav");
    const sentinel = document.querySelector<HTMLElement>(".jhome [data-nav-sentinel]");

    const observers: IntersectionObserver[] = [];

    // The nav swap is not decoration — it is what keeps the links readable,
    // so it runs even under reduced motion.
    if (nav && sentinel) {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry) nav.classList.toggle("jscrolled", !entry.isIntersecting);
        },
        { threshold: 0 },
      );
      io.observe(sentinel);
      observers.push(io);
    }

    if (reduced) {
      for (const el of reveals) el.classList.add("jrevealed");
      for (const el of grids) el.classList.add("jgrid-in");
      return () => {
        for (const io of observers) io.disconnect();
      };
    }

    const once = (els: HTMLElement[], cls: string, threshold: number) => {
      if (!els.length) return;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add(cls);
            io.unobserve(e.target);
          }
        },
        { threshold },
      );
      for (const el of els) io.observe(el);
      observers.push(io);
    };

    once(reveals, "jrevealed", 0.15);
    once(grids, "jgrid-in", 0.2);

    return () => {
      for (const io of observers) io.disconnect();
    };
  }, []);

  return null;
}
