"use client";

import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Window } from "./Window";
import { useOs } from "@/os/store";

export function WindowLayer() {
  const windows = useOs((s) => s.windows);
  const order = useOs((s) => s.order);
  const clamp = useOs((s) => s.clampAllToViewport);

  useEffect(() => {
    const onResize = () => clamp(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp]);

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-label="Window layer"
    >
      <AnimatePresence>
        {order.map((id) => {
          const w = windows[id];
          if (!w) return null;
          return <Window key={id} win={w} />;
        })}
      </AnimatePresence>
    </div>
  );
}
