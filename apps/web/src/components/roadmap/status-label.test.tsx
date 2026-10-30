import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusLabel } from "./status-label";

describe("StatusLabel", () => {
  test("renders the right chip text for each of the three levels", () => {
    render(<StatusLabel status="draft" />);
    expect(screen.getByText("Being rebuilt")).toBeInTheDocument();

    render(<StatusLabel status="self_checked" />);
    expect(screen.getByText("Self-checked")).toBeInTheDocument();

    render(<StatusLabel status="practitioner_reviewed" />);
    expect(screen.getByText("Practitioner-reviewed")).toBeInTheDocument();
  });

  test("the disclosure button is absent without explain, and for draft even with it", () => {
    render(<StatusLabel status="self_checked" />);
    expect(screen.queryByRole("button", { name: "What does this mean?" })).not.toBeInTheDocument();

    render(<StatusLabel status="draft" explain />);
    expect(screen.queryByRole("button", { name: "What does this mean?" })).not.toBeInTheDocument();
  });

  test("opens on click, closes on Escape, and closes on an outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <StatusLabel status="self_checked" explain />
        <button>outside</button>
      </div>,
    );
    const toggle = screen.getByRole("button", { name: "What does this mean?" });

    await user.click(toggle);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(toggle);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("practitioner_reviewed's popover names the reviewer when given one, and stays silent without one", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <StatusLabel status="practitioner_reviewed" explain reviewedByName="Asha Verma" reviewedByTitle="Senior backend engineer" reviewedOn="7 Oct 2026" />,
    );
    await user.click(screen.getByRole("button", { name: "What does this mean?" }));
    expect(screen.getByText(/Reviewed by Asha Verma, Senior backend engineer · 7 Oct 2026/)).toBeInTheDocument();

    rerender(<StatusLabel status="practitioner_reviewed" explain />);
    expect(screen.queryByText(/Reviewed by/)).not.toBeInTheDocument();
  });
});
