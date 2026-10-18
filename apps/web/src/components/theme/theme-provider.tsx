"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * The theme mechanism for the redesign's dark mode — Phase 0 scaffolding
 * only. Nothing surfaces a toggle yet (that's Phase 7, alongside the actual
 * dark CSS getting applied to real pages); this just means the plumbing is
 * in place and tested before anything depends on it.
 *
 * Three states, not two: "system" (the default — no data-theme attribute,
 * so `prefers-color-scheme` alone decides, same as before this existed)
 * plus explicit "light"/"dark" (a choice that overrides the system
 * preference). This matches how `@custom-variant dark` is wired in
 * globals.css: it keys off `[data-theme="dark"]`, so explicit mode writes
 * the attribute and system mode deliberately omits it.
 *
 * Persisted to localStorage only — a per-device UI preference, not account
 * data, so it does not need a server round trip or a consents row. If a
 * later phase wants it to follow the signed-in user across devices, that's
 * a deliberate product decision to make then, not something to smuggle in
 * here.
 */
export type ThemeChoice = "system" | "light" | "dark";
const STORAGE_KEY = "jintu-theme";

type ThemeContextValue = {
  theme: ThemeChoice;
  setTheme: (t: ThemeChoice) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: ThemeChoice) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Starts at "system" on both server and first client render — reading
  // localStorage during render would disagree between the two and React
  // would warn about a hydration mismatch. The real stored value (if any)
  // is applied in the effect below, after hydration, the same pattern the
  // rest of this codebase uses for anything that only exists in the browser.
  const [theme, setThemeState] = useState<ThemeChoice>("system");

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private browsing / storage disabled — fall back to "system"
      // silently rather than breaking the page over a preference.
    }
    if (stored === "light" || stored === "dark" || stored === "system") {
      setThemeState(stored);
      applyTheme(stored);
    }
  }, []);

  const setTheme = useCallback((next: ThemeChoice) => {
    setThemeState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Same as above — a preference that fails to save is not worth
      // surfacing an error over.
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Throws outside a ThemeProvider rather than returning a silently-wrong
 *  default — a future theme toggle that forgets to mount the provider
 *  should fail loudly in development, not render a control that does
 *  nothing. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
