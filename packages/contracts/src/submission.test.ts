import { describe, expect, it } from "vitest";
import { artifactSubmissionInput, checkArtifactUrl, sqlSubmissionInput } from "./submission";

const ASSIGNMENT = "72d468c8-0236-4142-bfb9-71900b4276c8";

describe("checkArtifactUrl", () => {
  it.each([
    "https://github.com/asha/analysis",
    "https://public.tableau.com/views/thing/Dashboard",
    "https://docs.google.com/document/d/abc/edit?usp=sharing",
  ])("accepts a published artifact at %s", (url) => {
    expect(checkArtifactUrl(url).ok).toBe(true);
  });

  // Each of these would make our own infrastructure issue a request a student
  // chose, which is the shape of a server-side request forgery. The
  // check-link-health cron is what would make it.
  it.each([
    ["http://example.com/work", "not-https"],
    ["file:///etc/passwd", "not-https"],
    ["gopher://example.com/", "not-https"],
    ["https://user:pass@example.com/", "has-credentials"],
    ["https://169.254.169.254/latest/meta-data/", "ip-literal"],
    ["https://127.0.0.1/admin", "ip-literal"],
    ["https://10.0.0.5/internal", "ip-literal"],
    ["https://[::1]/", "ip-literal"],
    ["https://localhost/", "internal-host"],
    ["https://db.internal/", "internal-host"],
    ["https://printer.local/", "internal-host"],
    ["https://intranet/", "internal-host"],
    ["https://example.com:8080/", "non-standard-port"],
    ["not a url at all", "not-a-url"],
    ["", "not-a-url"],
  ])("refuses %s", (url, reason) => {
    const r = checkArtifactUrl(url);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe(reason);
  });

  it("normalises the accepted URL", () => {
    const r = checkArtifactUrl("  https://example.com/a  ");
    expect(r.ok && r.url).toBe("https://example.com/a");
  });
});

describe("artifactSubmissionInput", () => {
  it("accepts a link with a note", () => {
    const r = artifactSubmissionInput.safeParse({
      assignmentId: ASSIGNMENT,
      kind: "artifact_link",
      url: "https://github.com/asha/analysis",
      note: "Dashboard is on the second tab.",
    });
    expect(r.success).toBe(true);
  });

  it("explains the refusal in words a student can act on", () => {
    const r = artifactSubmissionInput.safeParse({
      assignmentId: ASSIGNMENT,
      kind: "artifact_link",
      url: "http://example.com",
    });
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain("https://");
  });

  it("treats a blank note as absent", () => {
    const r = artifactSubmissionInput.safeParse({
      assignmentId: ASSIGNMENT,
      kind: "artifact_link",
      url: "https://example.com/a",
      note: "   ",
    });
    expect(r.success && r.data.note).toBeUndefined();
  });
});

describe("sqlSubmissionInput", () => {
  it("accepts a query", () => {
    const r = sqlSubmissionInput.safeParse({
      assignmentId: ASSIGNMENT,
      kind: "sql",
      sql: "select 1",
    });
    expect(r.success).toBe(true);
  });

  it("rejects an empty query rather than storing a blank row", () => {
    expect(
      sqlSubmissionInput.safeParse({ assignmentId: ASSIGNMENT, kind: "sql", sql: "   " }).success,
    ).toBe(false);
  });

  it("rejects a paste accident", () => {
    expect(
      sqlSubmissionInput.safeParse({
        assignmentId: ASSIGNMENT,
        kind: "sql",
        sql: "x".repeat(20_001),
      }).success,
    ).toBe(false);
  });

  it("rejects an assignment id that is not a uuid", () => {
    expect(
      sqlSubmissionInput.safeParse({ assignmentId: "1", kind: "sql", sql: "select 1" }).success,
    ).toBe(false);
  });
});
