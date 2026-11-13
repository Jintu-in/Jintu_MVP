import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { LessonStep } from "@/lib/steps";
import { StepReader, type StepReaderProps } from "./step-reader";

// saveDecision is mocked purely so its import chain (lib/supabase/server,
// which calls next/headers' cookies()) never loads into this jsdom test —
// useAction itself is mocked below, so the real export is never called.
// Storage/RLS behavior for the action is covered in scripts/assert-baseline.mjs.
const execute = vi.fn();
vi.mock("@/actions/decisions", () => ({ saveDecision: vi.fn() }));
vi.mock("@/actions/help", () => ({ submitHelpRequest: vi.fn() }));
vi.mock("next-safe-action/hooks", () => ({
  useAction: (_action: unknown, opts?: { onSuccess?: (r: { data?: unknown }) => void }) => ({
    execute: (input: unknown) => {
      execute(input);
      opts?.onSuccess?.({ data: { saved: true } });
    },
    isExecuting: false,
    result: {},
  }),
}));

const DECIDE_STEP: Extract<LessonStep, { kind: "decide" }> = {
  id: "authored-day-1-0",
  railTitle: "Raise the price, cut a cost, or shrink the jar?",
  kind: "decide",
  scenario: "You sell a spice blend online. Your jar supplier raises prices by 20%.",
  options: [
    { id: "a", label: "Raise the price by ₹15 for everyone", pro: "Protects the margin at once", con: "Some buyers leave" },
    { id: "b", label: "Keep the price, cut ad spend", pro: "Buyers see no change", con: "Fewer new customers" },
  ],
  reasonPrompt: "Why this one? One or two lines",
  realCase: {
    who: "A real spice-blend founder",
    chose: "to raise the price",
    outcome: "Orders dipped briefly, then recovered.",
    sourceTitle: "Founder interview",
    sourceUrl: "https://example.org/interview",
  },
  coverChecklist: ["the margin per jar", "how buyers might react"],
};

function baseProps(step: LessonStep): StepReaderProps {
  return {
    roadmapTitle: "Startup finance",
    moduleLabel: "Module 01 · Pricing",
    nodeId: "node-1",
    roadmapId: "roadmap-1",
    quizHref: "/learn/startup-finance/day-1/quiz",
    steps: [step],
    stepIndex: 0,
    total: 1,
    furthest: 0,
    step,
    estMinutes: 15,
    codeLanguage: "py",
    onCodeLanguageChange: vi.fn(),
    founderLog: [],
    online: true,
    onBack: vi.fn(),
    onContinue: vi.fn(),
    onJump: vi.fn(),
  };
}

describe("StepReader — decide step", () => {
  test("renders the scenario and both options, with Lock in disabled until an option and a 15+ character reason are given", async () => {
    const user = userEvent.setup();
    render(<StepReader {...baseProps(DECIDE_STEP)} />);

    expect(screen.getByText(/jar supplier raises prices/)).toBeInTheDocument();
    const lockInButtons = screen.getAllByRole("button", { name: /Lock in and see what happened/ });
    for (const btn of lockInButtons) expect(btn).toBeDisabled();

    await user.click(screen.getAllByRole("radio", { name: /Raise the price by ₹15/ })[0]!);
    for (const btn of lockInButtons) expect(btn).toBeDisabled(); // option alone isn't enough

    const textareas = screen.getAllByLabelText("Why this one? One or two lines");
    await user.type(textareas[0]!, "Repeat buyers already trust the taste.");
    for (const btn of lockInButtons) expect(btn).toBeEnabled();
  });

  test("locking in saves the decision and the reveal shows the real case with a working source link", async () => {
    const user = userEvent.setup();
    render(<StepReader {...baseProps(DECIDE_STEP)} />);

    await user.click(screen.getAllByRole("radio", { name: /Raise the price by ₹15/ })[0]!);
    await user.type(screen.getAllByLabelText("Why this one? One or two lines")[0]!, "Repeat buyers already trust the taste.");
    await user.click(screen.getAllByRole("button", { name: /Lock in and see what happened/ })[0]!);

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({ roadmapId: "roadmap-1", nodeId: "node-1", stepId: "authored-day-1-0", optionId: "a" }),
    );
    expect(await screen.findAllByText(/You chose A/)).not.toHaveLength(0);
    const sourceLinks = screen.getAllByRole("link", { name: "Founder interview" });
    for (const link of sourceLinks) expect(link).toHaveAttribute("href", "https://example.org/interview");
    // No score anywhere — CLAUDE.md: no grading.
    expect(screen.queryByText(/score/i, { selector: "button" })).not.toBeInTheDocument();
  });

  test("the footer CTA is generic Continue for every other step kind, untouched by the decide-only wiring", () => {
    const checkStep: LessonStep = {
      id: "check-0",
      railTitle: "Check 1",
      kind: "check",
      number: "01",
      question: [{ kind: "text", text: "What is a servlet?" }],
      answer: [[{ kind: "text", text: "A Java class." }]],
    };
    render(<StepReader {...baseProps(checkStep)} />);
    expect(screen.getAllByRole("button", { name: "Finish" }).length).toBeGreaterThan(0);
  });
});
