import { afterEach, describe, expect, it, vi } from "vitest";

import { sendEmail } from "../src/notifications";

describe("notifications/sendEmail", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("skips when the Brevo API key is missing", async () => {
    const result = await sendEmail(
      {
        DB: {} as D1Database,
        BREVO_FROM_EMAIL: "noreply@example.com",
      },
      {
        kind: "test_notification",
        subject: "Test subject",
        text: "Test body",
        to: ["person@example.com"],
      },
    );

    expect(result).toEqual({
      ok: false,
      reason: "missing_api_key",
      skipped: true,
    });
  });

  it("sends a Brevo request with a sanitized payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ messageId: "<123@example.com>" }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const result = await sendEmail(
      {
        DB: {} as D1Database,
        BREVO_API_KEY: "test_api_key",
        BREVO_FROM_EMAIL: "noreply@example.com",
        BREVO_FROM_NAME: "EBMS Notifications",
      },
      {
        html: "<p>Hello</p>",
        kind: "test_notification",
        subject: "Test subject",
        text: "Hello",
        to: ["Person@example.com", "person@example.com", " "],
      },
    );

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, requestInit] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(requestInit.method).toBe("POST");
    expect(requestInit.headers).toEqual({
      "accept": "application/json",
      "api-key": "test_api_key",
      "Content-Type": "application/json",
    });

    const payload = JSON.parse(String(requestInit.body));
    expect(payload).toEqual({
      htmlContent: "<p>Hello</p>",
      sender: {
        email: "noreply@example.com",
        name: "EBMS Notifications",
      },
      subject: "Test subject",
      to: [{ email: "person@example.com" }],
    });
  });
});
