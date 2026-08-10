import { describe, expect, it, vi } from "vitest";
import { createWhatsAppNotifier } from "./whatsapp.ts";

const config = {
  phoneNumberId: "1234567890",
  accessToken: "token",
  templateName: "jintu_signin_code",
  templateLanguage: "en",
};

const ok = (body: unknown) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status: 200 }));

describe("createWhatsAppNotifier", () => {
  it("posts an authentication template to the pinned Graph version", async () => {
    const fetchImpl = ok({ messages: [{ id: "wamid.ABC" }] });
    const notifier = createWhatsAppNotifier(config, fetchImpl as unknown as typeof fetch);

    const result = await notifier.sendOtp("+919876543210", "123456");

    expect(result).toEqual({ ok: true, providerMessageId: "wamid.ABC" });

    const call = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    const [url, init] = call;
    expect(url).toBe("https://graph.facebook.com/v21.0/1234567890/messages");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer token");

    const body = JSON.parse(String(init.body));
    // Meta wants the recipient without the +; Supabase stores it with one.
    expect(body.to).toBe("919876543210");
    expect(body.template.name).toBe("jintu_signin_code");
    // The code twice: once to read, once for the copy button. A template with
    // only the body parameter is rejected by Meta as malformed.
    expect(body.template.components[0].parameters[0].text).toBe("123456");
    expect(body.template.components[1].parameters[0].text).toBe("123456");
  });

  it("treats rate limiting and 5xx as worth retrying", async () => {
    for (const status of [429, 500, 503]) {
      const fetchImpl = vi.fn(
        async () => new Response(JSON.stringify({ error: { message: "slow down" } }), { status }),
      );
      const notifier = createWhatsAppNotifier(config, fetchImpl as unknown as typeof fetch);
      const result = await notifier.sendOtp("+919876543210", "123456");
      expect(result).toMatchObject({ ok: false, retryable: true });
    }
  });

  // An unapproved template returns 400 every time. Retrying it burns quota to
  // collect the same rejection.
  it("treats a 400 as ours to fix, not to retry", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          JSON.stringify({ error: { message: "Template name does not exist", code: 132001 } }),
          { status: 400 },
        ),
    );
    const notifier = createWhatsAppNotifier(config, fetchImpl as unknown as typeof fetch);
    const result = await notifier.sendOtp("+919876543210", "123456");

    expect(result).toMatchObject({ ok: false, retryable: false });
    expect(result.ok === false && result.error).toContain("Template name does not exist");
  });

  it("survives an error body that is not JSON", async () => {
    const fetchImpl = vi.fn(async () => new Response("<html>502 Bad Gateway</html>", { status: 502 }));
    const notifier = createWhatsAppNotifier(config, fetchImpl as unknown as typeof fetch);
    const result = await notifier.sendOtp("+919876543210", "123456");
    expect(result).toMatchObject({ ok: false, retryable: true });
  });

  it("retries a transport failure, since nothing was delivered", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("dns failure");
    });
    const notifier = createWhatsAppNotifier(config, fetchImpl as unknown as typeof fetch);
    const result = await notifier.sendOtp("+919876543210", "123456");
    expect(result).toMatchObject({ ok: false, retryable: true });
  });

  // A 200 we cannot parse still delivered the message; losing the id costs a
  // traceable row, not a student's code.
  it("reports success without an id when the body is unparseable", async () => {
    const fetchImpl = vi.fn(async () => new Response("okay", { status: 200 }));
    const notifier = createWhatsAppNotifier(config, fetchImpl as unknown as typeof fetch);
    expect(await notifier.sendOtp("+919876543210", "123456")).toEqual({
      ok: true,
      providerMessageId: null,
    });
  });

  it("honours a pinned Graph version", async () => {
    const fetchImpl = ok({ messages: [{ id: "x" }] });
    const notifier = createWhatsAppNotifier(
      { ...config, graphVersion: "v19.0" },
      fetchImpl as unknown as typeof fetch,
    );
    await notifier.sendOtp("+919876543210", "123456");
    const [url] = fetchImpl.mock.calls[0] as unknown as [string];
    expect(url).toContain("/v19.0/");
  });
});
