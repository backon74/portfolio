"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/os/hooks/useReducedMotion";

/**
 * Faint ambient scanline + grain overlay drifting slowly. Disabled under
 * reduced motion or low-end devices.
 */
export function AmbientLayer() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const nav = navigator as Navigator & { deviceMemory?: number };
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
  }, [reduced]);
  if (!enabled) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, rgba(10,30,60,0.06) 0 1px, transparent 1px 3px)",
        opacity: 0.35,
        mixBlendMode: "multiply",
        animation: "scanline-drift 40s linear infinite",
      }}
    />
  );
}
