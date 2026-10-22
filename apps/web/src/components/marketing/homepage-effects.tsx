"use client";

import { useEffect } from "react";

/**
 * The homepage's motion. Renders nothing — it only attaches observers.
 *
 * Two gates:
 *
 *   1. Reveals fill ONCE. The observer adds the class and immediately
 *      unobserves, so scrolling back up never replays a section — a page
 *      that re-animates on every pass reads as a demo rather than a
 *      product.
 *   2. Reduced motion lands everything in its final state up front. Not
 *      "freeze mid-animation": a half-faded section is worse than no
 *      effect at all.
 *
 * The nav flips to a solid surface once the hero has scrolled past. It
 * starts transparent with white text over the dark hero; leaving it that
 * way over a pale page would be white on white. Tracked with an observer on
 * a sentinel rather than a scroll listener, so nothing runs on the scroll
 * thread, and it runs even under reduced motion — it is not decoration.
 */
export function HomepageEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".jhome .jreveal"));
    const nav = document.querySelector<HTMLElement>(".jhome .jnav");
    const sentinel = document.querySelector<HTMLElement>(".jhome [data-nav-sentinel]");

    const observers: IntersectionObserver[] = [];

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
      return () => {
        for (const io of observers) io.disconnect();
      };
    }

    if (reveals.length) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add("jrevealed");
            io.unobserve(e.target);
          }
        },
        { threshold: 0.15 },
      );
      for (const el of reveals) io.observe(el);
      observers.push(io);
    }

    return () => {
      for (const io of observers) io.disconnect();
    };
  }, []);

  return null;
}
