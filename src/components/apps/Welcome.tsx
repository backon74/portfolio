"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/atoms";
import { welcome } from "@/content/site";
import { useOs } from "@/os/store";

export default function Welcome() {
  const router = useRouter();
  const close = useOs((s) => s.close);
  const focusedId = useOs((s) => s.focusedId);
  const windows = useOs((s) => s.windows);

  const closeSelf = () => {
    const id = Object.values(windows).find((w) => w.appId === "welcome")?.id ?? focusedId;
    if (id) close(id);
  };

  return (
    <div className="flex h-full w-full flex-col" data-app-welcome>
      {/* Hero */}
      <div
        className="relative overflow-hidden px-7 pt-6 pb-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,211,255,.15) 0%, rgba(37,99,235,.08) 60%, transparent 100%)",
          borderBottom: "1px solid rgba(34,211,255,.18)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="mono-stroke"
            style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--color-accent)" }}
          >
            WELCOME.TXT · READY
          </span>
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22D3FF",
              boxShadow: "0 0 8px #22D3FF",
              animation: "cyan-pulse 2s ease-in-out infinite",
            }}
          />
        </div>
        <h1
          className="mt-3 text-[32px] leading-[1] font-bold text-[color:var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
        >
          {welcome.heading}
        </h1>
        <div
          className="mt-2 text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-ink-3)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          HAMZAOS · v2
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-7 py-5">
        <div className="flex flex-col gap-3 text-[13px] leading-[1.65] text-[color:var(--color-ink)]">
          {welcome.lines.map((line, i) => (
            <p key={i} className="relative pl-4">
              <span
                aria-hidden="true"
                className="absolute left-0 top-[9px]"
                style={{
                  width: 6,
                  height: 2,
                  background: "linear-gradient(90deg, #22D3FF, transparent)",
                }}
              />
              {line}
            </p>
          ))}
        </div>
      </div>

      <div
        className="flex shrink-0 items-center justify-between gap-3 px-7 py-4"
        style={{
          borderTop: "1px solid rgba(34,211,255,.18)",
          background: "linear-gradient(0deg, rgba(220,232,255,.5), rgba(255,255,255,0))",
        }}
      >
        <span
          className="mono-stroke"
          style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--color-ink-3)" }}
        >
          {welcome.hint}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => router.push("/recruiter")}>
            {welcome.secondary}
          </Button>
          <Button variant="primary" onClick={closeSelf}>
            {welcome.primary}
          </Button>
        </div>
      </div>
    </div>
  );
}
