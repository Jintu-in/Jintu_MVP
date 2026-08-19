"use client";

import { useEffect } from "react";

/**
 * The homepage's motion, ported from the design project's DCLogic rather
 * than reinvented. Renders nothing — it only attaches observers.
 *
 * Three separate gates, each for a different reason:
 *
 *   1. Reveals fill once. Chromium drives them from a CSS scroll timeline;
 *      Safari and Firefox get a one-shot IntersectionObserver that
 *      unobserves on first intersection. Both are forwards-filling, so
 *      scrolling back up never replays a section.
 *   2. Looping animations (glow, marquee) stay paused until their .jloop
 *      wrapper is in view, so nothing burns a phone battery off-screen.
 *   3. The cursor spotlight binds only under hover + fine pointer, so it
 *      never attaches on touch, and it is rAF-throttled: pointermove fires
 *      far more often than a frame can paint, and the extra work is thrown
 *      away by definition.
 *
 * No scroll listener drives layout anywhere here. The page scrolls at the
 * native rate and nothing is scroll-jacked.
 */
export function HomepageEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".jhome .jreveal"));

    // Reduced motion: land everything in its final state immediately. Not
    // "freeze mid-animation" — a half-faded section is worse than no effect.
    if (reduced) {
      for (const el of reveals) el.classList.add("jreveal-done");
      return;
    }

    const observers: IntersectionObserver[] = [];

    const supportsTimeline =
      typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()");
    if (!supportsTimeline && reveals.length) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add("jreveal-done");
            io.unobserve(e.target); // once, never again
          }
        },
        { threshold: 0.2 },
      );
      for (const el of reveals) io.observe(el);
      observers.push(io);
    }

    const loopers = document.querySelectorAll<HTMLElement>(".jhome .jloop");
    if (loopers.length) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) e.target.classList.toggle("in-view", e.isIntersecting);
        },
        { threshold: 0.1 },
      );
      for (const el of loopers) io.observe(el);
      observers.push(io);
    }

    const cleanups: (() => void)[] = [];
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      let frame: number | null = null;
      let x = 0;
      let y = 0;
      let target: HTMLElement | null = null;
      const apply = () => {
        frame = null;
        target?.style.setProperty("--mx", `${x}px`);
        target?.style.setProperty("--my", `${y}px`);
      };
      for (const card of document.querySelectorAll<HTMLElement>(".jhome .jspot")) {
        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          x = e.clientX - r.left;
          y = e.clientY - r.top;
          target = card;
          if (frame === null) frame = requestAnimationFrame(apply);
        };
        card.addEventListener("pointermove", onMove);
        cleanups.push(() => card.removeEventListener("pointermove", onMove));
      }
      cleanups.push(() => {
        if (frame !== null) cancelAnimationFrame(frame);
      });
    }

    return () => {
      for (const io of observers) io.disconnect();
      for (const c of cleanups) c();
    };
  }, []);

  return null;
}
