import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotifyForm } from "./notify-form";

// useAction is mocked, not the server action itself — this suite is about
// the form's OWN logic (what it shows, what it sends, when it flips to
// "sent"), not about requestNotify, which the DB-level tests in
// scripts/assert-baseline.mjs already cover (duplicate submit, bad email).
// @/actions/notify is mocked too, purely so its `import "server-only"`
// chain (via lib/auth-limits.ts) never loads into this jsdom test — the
// real export is never called since useAction itself is mocked below.
let onSuccess: (() => void) | undefined;
const execute = vi.fn();
vi.mock("@/actions/notify", () => ({ requestNotify: vi.fn() }));
vi.mock("next-safe-action/hooks", () => ({
  useAction: (_action: unknown, opts?: { onSuccess?: () => void }) => {
    onSuccess = opts?.onSuccess;
    return { execute, isExecuting: false, result: {} };
  },
}));

const DRAFTS = [
  { id: "r1", slug: "ml-engineer", title: "Machine learning engineer" },
  { id: "r2", slug: "product-manager", title: "Product manager" },
];

describe("NotifyForm", () => {
  test("nothing to tick renders a quiet message instead of an empty form", () => {
    render(<NotifyForm drafts={[]} />);
    expect(screen.getByText(/Nothing is waiting to open right now/)).toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  test("WhatsApp starts unticked, and the phone field only appears once it is ticked", async () => {
    const user = userEvent.setup();
    render(<NotifyForm drafts={DRAFTS} />);
    const whatsapp = screen.getByRole("checkbox", { name: /Also tell me on WhatsApp/ });
    expect(whatsapp).not.toBeChecked();
    expect(screen.queryByPlaceholderText("WhatsApp number")).not.toBeInTheDocument();

    await user.click(whatsapp);
    expect(screen.getByPlaceholderText("WhatsApp number")).toBeInTheDocument();
  });

  test("the preselected slug pre-ticks only that roadmap, and submit stays disabled until one is ticked", async () => {
    const user = userEvent.setup();
    render(<NotifyForm drafts={DRAFTS} preselectedSlug="product-manager" />);
    expect(screen.getByRole("checkbox", { name: "Product manager" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Machine learning engineer" })).not.toBeChecked();

    const submit = screen.getByRole("button", { name: "Tell me when they open" });
    expect(submit).toBeEnabled();

    await user.click(screen.getByRole("checkbox", { name: "Product manager" }));
    expect(submit).toBeDisabled();
  });

  test("submitting sends the ticked slugs and the prefilled email, honeypot empty", async () => {
    const user = userEvent.setup();
    render(<NotifyForm drafts={DRAFTS} preselectedSlug="ml-engineer" prefillEmail="a@example.org" />);
    await user.click(screen.getByRole("button", { name: "Tell me when they open" }));
    expect(execute).toHaveBeenCalledWith({
      email: "a@example.org",
      roadmapSlugs: ["ml-engineer"],
      whatsapp: false,
      phone: undefined,
      website: "",
    });
  });

  test("the sent confirmation only appears once the action actually succeeds, not on submit itself", async () => {
    const user = userEvent.setup();
    render(<NotifyForm drafts={DRAFTS} preselectedSlug="ml-engineer" />);
    await user.click(screen.getByRole("button", { name: "Tell me when they open" }));
    // execute() was called, but the hook's onSuccess has not fired yet —
    // the old bug set `sent` straight from the submit handler regardless.
    expect(screen.queryByText("We'll tell you.")).not.toBeInTheDocument();

    onSuccess?.();
    expect(await screen.findByText("We'll tell you.")).toBeInTheDocument();
  });
});
