import { describe, expect, it } from "vitest";
import { decodeSecret, verifyWebhook } from "./webhook.ts";

/**
 * The send-sms hook is a public endpoint that spends money. These tests are
 * the reason to believe only Supabase can make it do so.
 */

const SECRET_BYTES = new Uint8Array([
  0x6a, 0x69, 0x6e, 0x74, 0x75, 0x2d, 0x74, 0x65, 0x73, 0x74, 0x2d, 0x73, 0x65, 0x63, 0x72, 0x65,
]);
const SECRET_B64 = btoa(String.fromCharCode(...SECRET_BYTES));
const SECRET = `v1,whsec_${SECRET_B64}`;

const BODY = JSON.stringify({ user: { phone: "+919876543210" }, sms: { otp: "123456" } });
const ID = "msg_2abc";
const NOW = new Date("2026-08-10T12:00:00Z");
const TIMESTAMP = String(Math.floor(NOW.getTime() / 1000));

/** Signs exactly as Supabase does, so a passing test means a real delivery passes. */
async function sign(body: string, id: string, timestamp: string, secret = SECRET) {
  const key = await crypto.subtle.importKey(
    "raw",
    decodeSecret(secret) as unknown as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${id}.${timestamp}.${body}`) as unknown as ArrayBuffer,
  );
  return `v1,${btoa(String.fromCharCode(...new Uint8Array(mac)))}`;
}

describe("decodeSecret", () => {
  it("strips the scheme and the whsec_ prefix", () => {
    expect(decodeSecret(SECRET)).toEqual(SECRET_BYTES);
  });

  // Supabase's dashboard, its CLI and its docs have each shown this value in
  // a different shape at some point. All three have to work.
  it.each([SECRET, `whsec_${SECRET_B64}`, SECRET_B64])("accepts %s", (variant) => {
    expect(decodeSecret(variant)).toEqual(SECRET_BYTES);
  });
});

describe("verifyWebhook", () => {
  it("accepts a correctly signed request", async () => {
    const signature = await sign(BODY, ID, TIMESTAMP);
    const result = await verifyWebhook(
      BODY,
      { id: ID, timestamp: TIMESTAMP, signature },
      SECRET,
      NOW,
    );
    expect(result.ok).toBe(true);
  });

  it("rejects a body that changed after signing", async () => {
    const signature = await sign(BODY, ID, TIMESTAMP);
    const tampered = JSON.stringify({
      user: { phone: "+919999999999" },
      sms: { otp: "123456" },
    });
    const result = await verifyWebhook(
      tampered,
      { id: ID, timestamp: TIMESTAMP, signature },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: false, reason: "signature does not match" });
  });

  // The id and timestamp are inside the signed content precisely so that
  // neither can be swapped for another delivery's.
  it("rejects a signature lifted from a different delivery id", async () => {
    const signature = await sign(BODY, "msg_other", TIMESTAMP);
    const result = await verifyWebhook(
      BODY,
      { id: ID, timestamp: TIMESTAMP, signature },
      SECRET,
      NOW,
    );
    expect(result.ok).toBe(false);
  });

  it("rejects a signature made with a different secret", async () => {
    const signature = await sign(BODY, ID, TIMESTAMP, `v1,whsec_${btoa("sixteen-byte-key")}`);
    const result = await verifyWebhook(
      BODY,
      { id: ID, timestamp: TIMESTAMP, signature },
      SECRET,
      NOW,
    );
    expect(result.ok).toBe(false);
  });

  // Without this a captured request stays replayable forever: the signature
  // proves where it came from, never when.
  it("rejects a request older than the replay window", async () => {
    const old = String(Math.floor(NOW.getTime() / 1000) - 6 * 60);
    const signature = await sign(BODY, ID, old);
    const result = await verifyWebhook(BODY, { id: ID, timestamp: old, signature }, SECRET, NOW);
    expect(result).toEqual({
      ok: false,
      reason: "webhook timestamp is outside the replay window",
    });
  });

  it("rejects a request from too far in the future", async () => {
    const ahead = String(Math.floor(NOW.getTime() / 1000) + 6 * 60);
    const signature = await sign(BODY, ID, ahead);
    const result = await verifyWebhook(BODY, { id: ID, timestamp: ahead, signature }, SECRET, NOW);
    expect(result.ok).toBe(false);
  });

  it.each([
    ["id", { id: null, timestamp: TIMESTAMP, signature: "v1,x" }],
    ["timestamp", { id: ID, timestamp: null, signature: "v1,x" }],
    ["signature", { id: ID, timestamp: TIMESTAMP, signature: null }],
  ])("rejects a request with no %s header", async (_name, headers) => {
    const result = await verifyWebhook(BODY, headers, SECRET, NOW);
    expect(result).toEqual({ ok: false, reason: "missing webhook signature headers" });
  });

  it("rejects a header carrying only an unknown signature version", async () => {
    const result = await verifyWebhook(
      BODY,
      { id: ID, timestamp: TIMESTAMP, signature: "v2,abcdef" },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: false, reason: "no v1 signature in the header" });
  });

  // Rotation publishes both signatures at once. If this failed, every rotation
  // would be an outage.
  it("accepts when the valid signature is one of several", async () => {
    const signature = await sign(BODY, ID, TIMESTAMP);
    const result = await verifyWebhook(
      BODY,
      { id: ID, timestamp: TIMESTAMP, signature: `v1,wrongsignature ${signature}` },
      SECRET,
      NOW,
    );
    expect(result.ok).toBe(true);
  });
});
