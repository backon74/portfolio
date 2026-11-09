import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

// 10 KB max body.
const MAX_BODY_BYTES = 10 * 1024;

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Please enter a valid email").max(200),
  subject: z.string().trim().min(1).max(200),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
  // Honeypot — should be empty. Accept any string so bots don't learn why they failed.
  website: z.string().max(500).optional(),
});

// Strip HTML tags and control chars from text.
function clean(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").trim();
}

function clientIp(req: Request): string {
  const h = req.headers;
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "0.0.0.0";
}

export async function POST(req: Request) {
  // Body size guard.
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Message is too large." }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid form submission.";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot — silent 200 so bots don't retry.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Rate limit: 3 per 10 min per IP.
  const ip = clientIp(req);
  const rl = rateLimit(`contact:${ip}`, 3, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    // Client falls back to the mailto link.
    return NextResponse.json(
      {
        ok: false,
        error: "Email is temporarily unavailable. Please use the direct email link.",
        fallback: "mailto",
      },
      { status: 503 },
    );
  }

  const name = clean(data.name);
  const email = clean(data.email);
  const subject = clean(data.subject) || "Hello from your portfolio";
  const message = clean(data.message);

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const result = await resend.emails.send({
      from: "HamzaOS <onboarding@resend.dev>",
      to,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}\n`,
    });
    if ((result as { error?: unknown }).error) {
      return NextResponse.json(
        { ok: false, error: "Could not send the message. Please try again later." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not send the message. Please try again later." },
      { status: 502 },
    );
  }
}
