/**
 * A random id for this browser, kept in localStorage.
 *
 * Used by the two places that need to tell one visitor from another without
 * knowing who either of them is: voting for a proposed course, and asking for
 * a course nobody has written. Both are unauthenticated, both need a rate
 * limit, and neither needs an identity.
 *
 * Deliberately not a cookie, an IP address, or a fingerprint. A cookie rides
 * every request and would belong inside the consent regime; an IP is personal
 * data under DPDP; a fingerprint is the thing this exists to avoid.
 *
 * It is weak, and everything built on it says so in the UI. Clearing site data
 * mints a new one. That is the right amount of effort for a rate limit on a
 * public form — enough to stop a bored person with a keyboard, not enough to
 * pretend it is authentication.
 *
 * Namespaced per purpose rather than shared. One id across both tables would
 * let anyone with database access line up "this browser voted for Android and
 * also asked for embedded systems", which is a correlation neither feature
 * needs and nobody agreed to.
 */
export function browserKey(purpose: "votes" | "course-requests"): string | null {
  if (typeof window === "undefined") return null;

  const storageKey = `jintu.${purpose}.key`;

  try {
    const existing = window.localStorage.getItem(storageKey);
    if (existing) return existing;

    const minted = crypto.randomUUID();
    window.localStorage.setItem(storageKey, minted);
    return minted;
  } catch {
    // Private mode, or storage disabled entirely. Neither feature is important
    // enough to break a page over, so the caller renders a disabled control
    // and says why.
    return null;
  }
}

/** Remembers that this browser already did something, so the UI can say so. */
export function markDone(purpose: "votes" | "course-requests", id: string): void {
  try {
    window.localStorage.setItem(`jintu.${purpose}.done.${id}`, "1");
  } catch {
    // Same as above: a lost flag means the button offers itself again, and the
    // server refuses the duplicate. The UI is the convenience, not the rule.
  }
}

export function isDone(purpose: "votes" | "course-requests", id: string): boolean {
  try {
    return window.localStorage.getItem(`jintu.${purpose}.done.${id}`) === "1";
  } catch {
    return false;
  }
}
