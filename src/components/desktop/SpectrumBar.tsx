"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/os/hooks/useReducedMotion";

/**
 * Mini spectrum visualiser for the menu bar. Idle sine wave; subscribers can
 * bump it by dispatching a `hamzaos:spectrum-bump` CustomEvent.
 */
export function SpectrumBar({ bars = 7 }: { bars?: number }) {
  const reduced = useReducedMotion();
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.06;
      for (let i = 0; i < bars; i++) {
        const el = refs.current[i];
        if (!el) continue;
        const v = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t + i * 0.9));
        el.style.transform = `scaleY(${v.toFixed(3)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onBump = () => {
      for (let i = 0; i < bars; i++) {
        const el = refs.current[i];
        if (!el) continue;
        el.style.transition = "transform 420ms cubic-bezier(.22,1,.36,1)";
        el.style.transform = "scaleY(1)";
        setTimeout(() => (el.style.transition = ""), 420);
      }
    };
    window.addEventListener("hamzaos:spectrum-bump", onBump);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hamzaos:spectrum-bump", onBump);
    };
  }, [bars, reduced]);

  return (
    <div
      aria-hidden="true"
      className="flex items-end gap-[2px]"
      style={{ height: 14 }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          style={{
            display: "inline-block",
            width: 2,
            height: 14,
            borderRadius: 1,
            background:
              "linear-gradient(to top, rgba(34,211,255,.3), rgba(34,211,255,.95))",
            transformOrigin: "bottom",
            transform: "scaleY(0.3)",
            boxShadow: "0 0 4px rgba(34,211,255,.5)",
          }}
        />
      ))}
    </div>
  );
}
