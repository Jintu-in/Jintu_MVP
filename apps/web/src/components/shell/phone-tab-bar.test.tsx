import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { PhoneTabBar } from "./phone-tab-bar";

describe("PhoneTabBar", () => {
  test("marks exactly the active item with aria-current, and only that one", () => {
    render(<PhoneTabBar active="roles" />);
    const current = screen.getAllByRole("link").filter((a) => a.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent("Roles");
  });

  test("is four equal-width columns, same order as the desktop sidebar", () => {
    render(<PhoneTabBar active="today" />);
    const labels = screen.getAllByRole("link").map((a) => a.textContent);
    expect(labels).toEqual(["Today", "Roadmaps", "Roles", "Profile"]);
  });
});
