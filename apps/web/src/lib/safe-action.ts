import { createSafeActionClient } from "next-safe-action";

/**
 * Shared client for every server action. ARCHITECTURE.md §1 — typed,
 * validated mutations, no ad-hoc API routes.
 */
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    // Log the real cause server-side; return something that cannot leak
    // schema details, constraint names, or key material to the browser.
    console.error("[action]", error.message);
    return "Something went wrong on our end. Please try again.";
  },
});
