"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, Mail as MailIcon } from "lucide-react";
import { Button } from "@/components/ui/atoms";
import { links } from "@/content/site";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";

const DEFAULT_SUBJECT = "Hello from your portfolio";

function buildMailto(subject: string, body: string): string {
  const { user, domain } = links.emailParts;
  const to = `${user}@${domain}`;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const q = params.toString();
  return `mailto:${to}${q ? `?${q}` : ""}`;
}

export default function Mail() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  const mailto = useMemo(
    () => buildMailto(subject || DEFAULT_SUBJECT, message),
    [subject, message],
  );

  const canSubmit =
    name.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(email.trim()) &&
    message.trim().length >= 10 &&
    message.trim().length <= 2000 &&
    status !== "sending";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    setError(null);
    setShowFallback(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: (subject || DEFAULT_SUBJECT).trim(),
          message: message.trim(),
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fallback?: string;
      };
      if (res.ok && data.ok) {
        setStatus("sent");
        track("contact_sent");
        return;
      }
      setStatus("error");
      setError(data.error ?? "Could not send the message. Please try again.");
      if (data.fallback === "mailto" || res.status === 503) setShowFallback(true);
      else setShowFallback(true);
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
      setShowFallback(true);
    }
  };

  if (status === "sent") {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center"
        style={{ background: "var(--color-surface)" }}
        data-app-mail
        data-mail-state="sent"
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-white"
          style={{ background: "var(--color-accent)" }}
          aria-hidden="true"
        >
          <Check size={22} />
        </div>
        <h2 className="text-[18px] font-[650] tracking-[-0.01em] text-[color:var(--color-ink)]">
          Thanks — I&apos;ll reply within a couple of days
        </h2>
        <p className="max-w-[40ch] text-[13px] text-[color:var(--color-ink-2)]">
          Your message is on its way. If you don&apos;t hear back within a few days, feel free to
          email me directly.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setStatus("idle");
            setName("");
            setEmail("");
            setSubject(DEFAULT_SUBJECT);
            setMessage("");
          }}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex h-full w-full flex-col"
      style={{ background: "var(--color-surface)" }}
      data-app-mail
      data-mail-state={status}
      onSubmit={onSubmit}
      noValidate
    >
      <header
        className="shrink-0 px-6 py-4"
        style={{ borderBottom: "1px solid var(--color-hairline)" }}
      >
        <div className="flex items-center gap-2 text-[color:var(--color-ink)]">
          <MailIcon size={16} />
          <h1 className="text-[15px] font-[650] tracking-[-0.01em]">New message</h1>
        </div>
        <p className="mt-1 text-[12px] text-[color:var(--color-ink-3)]">
          This sends straight to Hamza. No tracking, no list.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        <div className="flex flex-col gap-3">
          <Field id="mail-name" label="Your name">
            <input
              id="mail-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              autoComplete="name"
            />
          </Field>

          <Field id="mail-email" label="Your email">
            <input
              id="mail-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              autoComplete="email"
            />
          </Field>

          <Field id="mail-subject" label="Subject">
            <input
              id="mail-subject"
              name="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field id="mail-message" label="Message" hint={`${message.trim().length}/2000`}>
            <textarea
              id="mail-message"
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={cn(inputCls, "min-h-[140px] resize-y py-2")}
            />
          </Field>

          {/* Honeypot — hidden from humans, must stay empty */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              top: "auto",
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
          >
            <label htmlFor="mail-website">Website</label>
            <input
              id="mail-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {status === "error" && error && (
            <div
              role="alert"
              className="rounded-[10px] px-3 py-2 text-[12px]"
              style={{
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-hairline-strong)",
                color: "var(--color-ink)",
              }}
              data-mail-error
            >
              {error}
            </div>
          )}
        </div>
      </div>

      <footer
        className="flex shrink-0 items-center justify-between gap-3 px-6 py-4"
        style={{
          borderTop: "1px solid var(--color-hairline)",
          background: "var(--color-surface-2)",
        }}
      >
        <div className="text-[12px] text-[color:var(--color-ink-3)]">
          {showFallback ? (
            <a
              href={mailto}
              className="font-medium text-[color:var(--color-accent)] underline underline-offset-2"
              data-mail-mailto
            >
              Email me directly instead
            </a>
          ) : (
            <span>Takes about two days for a reply.</span>
          )}
        </div>
        <Button
          variant="primary"
          type="submit"
          disabled={!canSubmit}
        >
          {status === "sending" ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Sending…
            </>
          ) : (
            "Send"
          )}
        </Button>
      </footer>
    </form>
  );
}

const inputCls = cn(
  "w-full rounded-[10px] bg-white px-3 py-1.5 text-[13px] text-[color:var(--color-ink)]",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40",
);

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="text-[11px] font-semibold tracking-[0.02em] text-[color:var(--color-ink-3)] uppercase"
        >
          {label}
        </label>
        {hint && <span className="text-[11px] text-[color:var(--color-ink-3)]">{hint}</span>}
      </div>
      <div
        style={{
          borderRadius: 10,
          border: "1px solid var(--color-hairline-strong)",
          background: "white",
        }}
      >
        {children}
      </div>
    </div>
  );
}
