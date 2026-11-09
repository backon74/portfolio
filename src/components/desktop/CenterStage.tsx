"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/site";

/**
 * Center-of-desktop hero card. Big typographic HAMZA, live terminal line,
 * animated availability dot. Sits in the empty middle between desktop icons
 * and the ControlDeck.
 */
const LINES = [
  "> whoami",
  "hamza · software engineer (mobile)",
  "> uptime",
  "muharraq.bah · currently open to roles",
  "> stack --primary",
  "android · kotlin · jetpack compose · react native · python",
  "> cat ~/current.job",
  "batelco (super app + m-wallet) — joining soon",
];

export function CenterStage() {
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const current = LINES[line];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTyped("");
    const id = setInterval(() => {
      i++;
      setTyped(current.slice(0, i));
      if (i >= current.length) {
        clearInterval(id);
        setTimeout(() => setLine((l) => (l + 1) % LINES.length), 2200);
      }
    }, 28);
    return () => clearInterval(id);
  }, [line]);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ width: "min(620px, 42vw)" }}
      aria-hidden="true"
    >
      {/* Giant HAMZA outline type behind */}
      <div
        className="hero-type"
        style={{
          fontSize: "clamp(96px, 11vw, 168px)",
          lineHeight: 0.84,
          textAlign: "center",
        }}
      >
        HAMZA
      </div>
      <div
        className="mono-stroke"
        style={{
          marginTop: 6,
          textAlign: "center",
          fontSize: 11,
          letterSpacing: "0.45em",
          color: "rgba(10,30,60,.5)",
        }}
      >
        · OS · v2 · {profile.location.toUpperCase()} ·
      </div>

      {/* Mini terminal */}
      <div
        className="mx-auto mt-4 rounded-[10px] px-3 py-2"
        style={{
          width: "min(460px, 38vw)",
          background: "rgba(10,20,40,0.72)",
          boxShadow: "0 0 0 1px rgba(34,211,255,.3), 0 0 24px -6px rgba(34,211,255,.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-center gap-1.5 pb-1.5">
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFBD2E" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28C940" }} />
          <span
            className="mono-stroke ml-auto"
            style={{ fontSize: 9, color: "rgba(255,255,255,.4)", letterSpacing: "0.2em" }}
          >
            ~/hamzaos
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: 12,
            color: "#9BE8FF",
            minHeight: 18,
            textShadow: "0 0 6px rgba(34,211,255,.4)",
          }}
        >
          {typed}
          <span style={{ animation: "cyan-pulse 1s steps(2) infinite" }}>▋</span>
        </div>
      </div>
    </div>
  );
}
