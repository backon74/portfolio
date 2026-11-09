"use client";

import { useEffect, useState } from "react";

/**
 * First-boot typographic hero. Big outline display type that fades out after
 * 6 s or on first user interaction. Only shown on first boot.
 */
export function HeroType({ enabled }: { enabled: boolean }) {
  const [hidden, setHidden] = useState(!enabled);
  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => setHidden(true), 6500);
    const dismiss = () => setHidden(true);
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        left: 24,
        top: 80,
        opacity: hidden ? 0 : 0.92,
        transform: hidden ? "translateY(-8px)" : "none",
        transition: "opacity 800ms ease, transform 800ms ease",
        maxWidth: "48vw",
      }}
    >
      <div
        className="hero-type"
        style={{
          fontSize: "clamp(72px, 10vw, 148px)",
          lineHeight: 0.86,
        }}
      >
        HAMZA
        <br />
        ALKHALDI
      </div>
      <div
        className="mono-stroke"
        style={{
          marginTop: 10,
          fontSize: 11,
          color: "var(--color-ink-2)",
          letterSpacing: "0.3em",
        }}
      >
        · SOFTWARE ENGINEER · MOBILE · AI/ML ·
      </div>
    </div>
  );
}
