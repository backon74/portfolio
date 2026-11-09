import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { __resetRateLimit } from "@/lib/rateLimit";

function makeReq(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validBody = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Hello",
  message: "This is a nice long test message from the unit tests.",
};

describe("POST /api/contact", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    __resetRateLimit();
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("returns 400 on invalid JSON body", async () => {
    const res = await POST(makeReq("{{{"));
    expect(res.status).toBe(400);
    const data = (await res.json()) as { ok: boolean };
    expect(data.ok).toBe(false);
  });

  it("rejects missing required fields (bad payload)", async () => {
    const res = await POST(makeReq({ name: "", email: "not-an-email", message: "short" }));
    expect(res.status).toBe(400);
    const data = (await res.json()) as { ok: boolean; error: string };
    expect(data.ok).toBe(false);
    expect(typeof data.error).toBe("string");
  });

  it("honeypot: silently returns 200 ok when `website` is filled", async () => {
    // Needs env so we wouldn't fall through to the 503, but honeypot runs before env check.
    const res = await POST(
      makeReq(
        { ...validBody, website: "http://spam.example" },
        { "x-forwarded-for": "9.9.9.9" },
      ),
    );
    expect(res.status).toBe(200);
    const data = (await res.json()) as { ok: boolean };
    expect(data.ok).toBe(true);
  });

  it("returns 503 + fallback: mailto when RESEND_API_KEY is missing", async () => {
    const res = await POST(makeReq(validBody, { "x-forwarded-for": "1.1.1.1" }));
    expect(res.status).toBe(503);
    const data = (await res.json()) as { ok: boolean; fallback?: string };
    expect(data.ok).toBe(false);
    expect(data.fallback).toBe("mailto");
  });

  it("rate limits after 3 requests in the window", async () => {
    // Use an IP unique to this test to avoid interference.
    const ip = "2.2.2.2";
    // First 3 attempts: valid body, but no env → 503 each (rate limit still counts them).
    for (let i = 0; i < 3; i++) {
      const res = await POST(makeReq(validBody, { "x-forwarded-for": ip }));
      expect(res.status).toBe(503);
    }
    // 4th should be rate limited.
    const res = await POST(makeReq(validBody, { "x-forwarded-for": ip }));
    expect(res.status).toBe(429);
    const data = (await res.json()) as { ok: boolean };
    expect(data.ok).toBe(false);
    expect(res.headers.get("Retry-After")).not.toBeNull();
  });
});
