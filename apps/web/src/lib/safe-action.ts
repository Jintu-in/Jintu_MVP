import { createSafeActionClient } from "next-safe-action";

/**
 * An error whose message is meant for the person who caused it.
 *
 * Everything else a server action throws is ours: a missing migration, a
 * dropped connection, a constraint we forgot. Those get a generic sentence,
 * because the alternative is leaking schema details, constraint names, or key
 * material into the browser.
 *
 * But "too short", "you have sent five of these today" and "that number is on
 * another account" are answers, not leaks, and they were being thrown away.
 * Before this class existed, handleServerError replaced every message with
 * "Something went wrong on our end" — so a form that rejected your input told
 * you the server was broken, and you would try the same thing again.
 */
export class UserFacingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserFacingError";
  }
}

/**
 * Shared client for every server action. ARCHITECTURE.md §1 — typed,
 * validated mutations, no ad-hoc API routes.
 */
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof UserFacingError) {
      // Not logged as an error. Someone typing four characters into a box that
      // wants ten is the system working, and burying real failures under that
      // noise is how the real ones stop being noticed.
      return error.message;
    }

    console.error("[action]", error.message);
    return "Something went wrong on our end. Please try again.";
  },
});
