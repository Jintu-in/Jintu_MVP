import { z } from "zod";

/**
 * What a student may submit, and what we refuse to store.
 *
 * The artifact URL rules are stricter than "is it a URL" on purpose. That
 * value is later fetched server-side by the check-link-health cron
 * (ARCHITECTURE.md §6), which turns a text field a stranger controls into a
 * request our infrastructure makes — the shape of a server-side request
 * forgery. Validating it here is the first of two layers; the fetcher must
 * still refuse private addresses AFTER DNS resolution, because a public
 * hostname can resolve to 127.0.0.1 and no amount of string checking sees
 * that coming.
 */

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const IPV6_ISH = /^\[?[0-9a-f]*:[0-9a-f:]*\]?$/i;

/** Hostnames that are never a student's published work. */
const BLOCKED_HOSTS = new Set(["localhost", "localhost.localdomain", "ip6-localhost"]);
const BLOCKED_SUFFIXES = [".local", ".internal", ".localdomain", ".home.arpa"];

export type UrlRejection =
  | "not-a-url"
  | "not-https"
  | "has-credentials"
  | "ip-literal"
  | "non-standard-port"
  | "internal-host";

export function checkArtifactUrl(raw: string): { ok: true; url: string } | { ok: false; reason: UrlRejection } {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return { ok: false, reason: "not-a-url" };
  }

  // https only. http is eavesdroppable, and the exotic schemes (file:, data:,
  // gopher:) exist in this list because they are how a fetcher gets talked
  // into reading a local disk.
  if (parsed.protocol !== "https:") return { ok: false, reason: "not-https" };

  if (parsed.username || parsed.password) return { ok: false, reason: "has-credentials" };

  const host = parsed.hostname.toLowerCase();

  // An IP literal is never a link to published work, and is the direct route
  // to cloud metadata endpoints and loopback.
  if (IPV4.test(host) || IPV6_ISH.test(host)) return { ok: false, reason: "ip-literal" };

  if (BLOCKED_HOSTS.has(host)) return { ok: false, reason: "internal-host" };
  if (BLOCKED_SUFFIXES.some((s) => host.endsWith(s))) return { ok: false, reason: "internal-host" };
  // A bare hostname with no dot is an intranet name, not a public site.
  if (!host.includes(".")) return { ok: false, reason: "internal-host" };

  // Only the default port. A published artifact does not live on :8080, and
  // allowing arbitrary ports turns the cron into a port scanner.
  if (parsed.port !== "") return { ok: false, reason: "non-standard-port" };

  return { ok: true, url: parsed.toString() };
}

export const URL_REJECTION_MESSAGE: Record<UrlRejection, string> = {
  "not-a-url": "That does not look like a link. Paste the full address, starting with https://",
  "not-https": "The link must start with https:// so your work is not sent over plain HTTP.",
  "has-credentials": "Remove the username and password from the link before sharing it.",
  "ip-literal": "Paste the published address of your work, not an IP address.",
  "non-standard-port": "Links with a port number are not reachable by a reviewer.",
  "internal-host": "That address only resolves on your own network, so nobody else can open it.",
};

const artifactUrl = z
  .string()
  .trim()
  .min(1, "Paste the link to your work.")
  .max(2000, "That link is longer than we can store.")
  .superRefine((value, ctx) => {
    const result = checkArtifactUrl(value);
    if (!result.ok) {
      ctx.addIssue({ code: "custom", message: URL_REJECTION_MESSAGE[result.reason] });
    }
  });

export const sqlSubmissionInput = z.object({
  assignmentId: z.string().uuid(),
  kind: z.literal("sql"),
  sql: z
    .string()
    .trim()
    .min(1, "Write your query before submitting.")
    // Long enough for a real analyst query with CTEs, short enough that a
    // paste accident does not become a database row.
    .max(20_000, "That query is longer than we can store."),
});

export const artifactSubmissionInput = z.object({
  assignmentId: z.string().uuid(),
  kind: z.literal("artifact_link"),
  url: artifactUrl,
  note: z
    .string()
    .trim()
    .max(500, "Keep the note under 500 characters.")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

export const submissionInput = z.discriminatedUnion("kind", [
  sqlSubmissionInput,
  artifactSubmissionInput,
]);

export type SubmissionInput = z.infer<typeof submissionInput>;
