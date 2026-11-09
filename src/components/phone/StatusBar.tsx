"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { LogoMark } from "@/components/ui/icons/LogoMark";

function fmtTime(d: Date): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Bahrain",
    }).format(d);
  } catch {
    return d.toLocaleTimeString();
  }
}

export function StatusBar() {
  const [time, setTime] = useState<string>(() => fmtTime(new Date()));

  useEffect(() => {
    const tick = () => setTime(fmtTime(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative z-20 flex h-[44px] shrink-0 items-center justify-between px-4"
      data-phone-statusbar
    >
      <span
        className="mono-stroke text-[13px] tabular-nums text-[color:var(--color-ink)]"
        style={{ letterSpacing: "0.1em" }}
      >
        {time}
      </span>
      <div className="flex items-center gap-2">
        <LogoMark size={14} color="var(--color-ink)" />
        <Link
          href="/recruiter"
          className="inline-flex h-[22px] items-center gap-1 rounded-[11px] px-[10px] text-[11px] font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          style={{
            background: "linear-gradient(180deg, #2E7BF6 0%, #1D4FD3 100%)",
            boxShadow: "0 0 0 0.5px rgba(10,30,60,.25), inset 0 1px 0 rgba(255,255,255,.35), 0 0 10px rgba(34,211,255,.4)",
          }}
          aria-label="Open Recruiter View"
        >
          <Zap size={10} />
          Recruiter
        </Link>
      </div>
    </div>
  );
}
