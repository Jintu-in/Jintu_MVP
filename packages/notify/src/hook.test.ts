import { describe, expect, it, vi } from "vitest";
import { handleSendSmsHook } from "./hook.ts";
import type { Notifier } from "./types.ts";
import { decodeSecret } from "./webhook.ts";

const SECRET = `v1,whsec_${btoa("sixteen-byte-key")}`;
const ID = "msg_1";
const NOW = new Date("2026-08-10T12:00:00Z");
const TIMESTAMP = String(Math.floor(NOW.getTime() / 1000));

async function sign(body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    decodeSecret(SECRET) as unknown as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${ID}.${TIMESTAMP}.${body}`) as unknown as ArrayBuffer,
  );
  return `v1,${btoa(String.fromCharCode(...new Uint8Array(mac)))}`;
}

const sent = (): Notifier => ({
  sendOtp: vi.fn(async () => ({ ok: true as const, providerMessageId: "wamid.1" })),
});

async function call(body: string, notifier: Notifier, signature?: string) {
  return handleSendSmsHook(
    body,
    { id: ID, timestamp: TIMESTAMP, signature: signature ?? (await sign(body)) },
    SECRET,
    notifier,
    NOW,
  );
}

const VALID = JSON.stringify({ user: { phone: "+919876543210" }, sms: { otp: "123456" } });

describe("handleSendSmsHook", () => {
  it("sends the code and answers 200", async () => {
    const notifier = sent();
    const response = await call(VALID, notifier);

    expect(response.status).toBe(200);
    expect(notifier.sendOtp).toHaveBeenCalledWith("+919876543210", "123456");
  });

  // The endpoint is public and spends money. This is the test that says only
  // Supabase can make it do so.
  it("refuses an unsigned request without sending anything", async () => {
    const notifier = sent();
    const response = await call(VALID, notifier, "v1,forged");

    expect(response.status).toBe(401);
    expect(notifier.sendOtp).not.toHaveBeenCalled();
  });

  // 401 with a fixed message: which header was wrong is information only an
  // attacker benefits from.
  it("says nothing about why the signature failed", async () => {
    const response = await call(VALID, sent(), "v1,forged");
    expect(response.body).not.toContain("signature");
    expect(JSON.parse(response.body).error.message).toBe("Unauthorized.");
  });

  it.each([
    ["not json at all", "{{{"],
    ["no phone", JSON.stringify({ user: {}, sms: { otp: "123456" } })],
    ["no otp", JSON.stringify({ user: { phone: "+919876543210" }, sms: {} })],
    ["a phone that is not E.164", JSON.stringify({ user: { phone: "hello" }, sms: { otp: "1" } })],
  ])("rejects a payload with %s", async (_case, body) => {
    const notifier = sent();
    const response = await call(body, notifier);

    expect(response.status).toBe(400);
    expect(notifier.sendOtp).not.toHaveBeenCalled();
  });

  // Supabase stores E.164 with the +, but the hook must not assume it: a
  // number arriving without one is still the same number.
  it("normalises a recipient that arrives without a plus", async () => {
    const notifier = sent();
    const body = JSON.stringify({ user: { phone: "919876543210" }, sms: { otp: "123456" } });
    await call(body, notifier);
    expect(notifier.sendOtp).toHaveBeenCalledWith("+919876543210", "123456");
  });

  // 429 rather than 500, because Supabase surfaces the status and the two
  // produce different behaviour from the student: retry, or write to support.
  it("answers 429 when the provider failure is worth retrying", async () => {
    const notifier: Notifier = {
      sendOtp: vi.fn(async () => ({ ok: false as const, retryable: true, error: "rate limited" })),
    };
    const response = await call(VALID, notifier);

    expect(response.status).toBe(429);
    expect(JSON.parse(response.body).error.message).toContain("Try again");
  });

  it("answers 500 when it is not", async () => {
    const notifier: Notifier = {
      sendOtp: vi.fn(async () => ({
        ok: false as const,
        retryable: false,
        error: "template not approved",
      })),
    };
    const response = await call(VALID, notifier);
    expect(response.status).toBe(500);
  });

  // The provider's message names our template and our config. It reaches a
  // student mid sign-in, so it must not reach them.
  it("never leaks the provider's error to the caller", async () => {
    const notifier: Notifier = {
      sendOtp: vi.fn(async () => ({
        ok: false as const,
        retryable: false,
        error: "Template jintu_signin_code does not exist in en_US",
      })),
    };
    const response = await call(VALID, notifier);
    expect(response.body).not.toContain("jintu_signin_code");
  });
});
