import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { DesktopSidebar } from "./desktop-sidebar";

describe("DesktopSidebar", () => {
  test("marks exactly the active item with aria-current, and only that one", () => {
    render(<DesktopSidebar active="roadmaps" user={null} />);
    const current = screen.getAllByRole("link").filter((a) => a.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("Roadmaps");
  });

  test("links to the real, already-shipped routes, not placeholders", () => {
    render(<DesktopSidebar active="today" user={null} />);
    expect(screen.getByRole("link", { name: /roadmaps/i })).toHaveAttribute("href", "/learn");
    expect(screen.getByRole("link", { name: /roles/i })).toHaveAttribute("href", "/roles");
    expect(screen.getByRole("link", { name: /profile/i })).toHaveAttribute("href", "/profile");
  });

  test("renders no account chip when signed out, rather than a skeleton", () => {
    render(<DesktopSidebar active="today" user={null} />);
    expect(screen.queryByText(/points$/)).toBeNull();
  });

  test("renders the account chip's name and points when signed in", () => {
    render(<DesktopSidebar active="today" user={{ displayName: "Asha Verma", initials: "AV", points: 75 }} />);
    expect(screen.getByText("Asha Verma")).toBeVisible();
    expect(screen.getByText("75 points")).toBeVisible();
  });
});
