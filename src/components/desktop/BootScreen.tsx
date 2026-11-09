"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

/**
 * HamzaOS v2 boot: scanline sweep → halftone-dot logo forms → progress bar
 * → crossfade to desktop. 1.2 s total. Click or key skips.
 */
export function BootScreen({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 1200);
    const skip = () => setLeaving(true);
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  // Halftone H monogram — dots converge from scatter to logo
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = (c.width = 320);
    const H = (c.height = 160);

    const dots: { x: number; y: number; tx: number; ty: number }[] = [];
    // Target shape: "H" monogram dot grid
    const cols = 24;
    const rows = 12;
    const cellW = W / cols;
    const cellH = H / rows;
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const inLeft = col >= 3 && col <= 5;
        const inRight = col >= 18 && col <= 20;
        const inBar = r >= 5 && r <= 6 && col > 5 && col < 18;
        if (inLeft || inRight || inBar) {
          dots.push({
            x: Math.random() * W,
            y: Math.random() * H,
            tx: col * cellW + cellW / 2,
            ty: r * cellH + cellH / 2,
          });
        }
      }
    }

    const start = performance.now();
    let raf = 0;
    const draw = () => {
      const t = Math.min(1, (performance.now() - start) / 900);
      const e = 1 - Math.pow(1 - t, 3);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0B1A33";
      for (const d of dots) {
        const x = d.x + (d.tx - d.x) * e;
        const y = d.y + (d.ty - d.y) * e;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      // cyan glow on bar when near final
      if (e > 0.6) {
        ctx.fillStyle = `rgba(34,211,255,${(e - 0.6) * 1.2})`;
        ctx.fillRect(cellW * 6, cellH * 5.3, cellW * 12, cellH * 1.4);
      }
      if (t < 1) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-label="HamzaOS booting"
      data-testid="boot-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (leaving) onDone();
      }}
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, #0E1D38 0%, #04091A 70%, #000 100%)",
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      {/* Scanline sweep — single bright line bottom → top */}
      <motion.div
        aria-hidden="true"
        initial={{ y: "100vh" }}
        animate={{ y: "-100vh" }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        className="pointer-events-none absolute left-0 right-0 h-[120px]"
        style={{
          background:
            "linear-gradient(to top, transparent 0%, rgba(34,211,255,.08) 50%, rgba(34,211,255,.45) 85%, rgba(34,211,255,.9) 100%)",
          filter: "blur(2px)",
        }}
      />

      {/* Persistent fine scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(34,211,255,.07) 0 1px, transparent 1px 3px)",
          opacity: 0.6,
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <canvas
          ref={canvasRef}
          width={320}
          height={160}
          style={{
            width: 240,
            height: 120,
            filter: "drop-shadow(0 0 24px rgba(34,211,255,.5))",
          }}
          aria-hidden="true"
        />
        <div
          className="mono-stroke"
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "rgba(34,211,255,.75)",
          }}
        >
          HAMZAOS · v2 · BOOT
        </div>
        <div
          className="relative overflow-hidden"
          style={{
            width: 180,
            height: 2,
            background: "rgba(255,255,255,.1)",
            borderRadius: 2,
          }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.95, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-y-0 left-0 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #22D3FF 70%, #ffffff 100%)",
              boxShadow: "0 0 10px #22D3FF",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
