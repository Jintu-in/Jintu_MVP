import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { ProgressRule, StatBadge } from "./patterns";

/**
 * The first Vitest + RTL test in the repo — proves the new test layer
 * (Phase 0, BUILD-PLAN.md §4) actually renders real components, not just
 * that the config file parses. `ProgressRule` is picked because it has
 * real logic (clamping) rather than being static markup: a test that only
 * ever renders fixed props would pass just as well with the config
 * entirely missing its jsdom environment.
 */
describe("ProgressRule", () => {
  test("clamps the width to [0, 100] and never exceeds the bar", () => {
    const { container, rerender } = render(<ProgressRule pct={150} />);
    const fill = container.querySelector("span > span");
    expect(fill).toHaveStyle({ width: "100%" });

    rerender(<ProgressRule pct={-20} />);
    expect(container.querySelector("span > span")).toHaveStyle({ width: "0%" });

    rerender(<ProgressRule pct={42} />);
    expect(container.querySelector("span > span")).toHaveStyle({ width: "42%" });
  });

  test("is aria-hidden — a bar with no number beside it is decoration, never announced alone", () => {
    const { container } = render(<ProgressRule pct={50} />);
    expect(container.firstChild).toHaveAttribute("aria-hidden");
  });
});

describe("StatBadge", () => {
  test("renders its glyph as decorative and its children as the announced content", () => {
    const { getByText, container } = render(<StatBadge glyph="⚡">9 roadmaps</StatBadge>);
    expect(getByText("9 roadmaps")).toBeVisible();
    const glyph = container.querySelector("[aria-hidden]");
    expect(glyph).toHaveTextContent("⚡");
  });

  test("omits the glyph span entirely when none is given, rather than rendering an empty one", () => {
    const { container } = render(<StatBadge>228 links checked</StatBadge>);
    expect(container.querySelector("[aria-hidden]")).toBeNull();
  });
});
