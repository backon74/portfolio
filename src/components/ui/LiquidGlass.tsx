"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * Subtle liquid-glass surface:
 *   - heavy backdrop blur + saturation → warped highlights behind
 *   - thin chromatic rim (red→cyan gradient border)
 *   - inset top highlight (specular arc) + bottom inner shade
 *   - optional cyan under-glow
 *
 * Use as a drop-in wrapper div.
 */
export function LiquidGlass({
  children,
  className,
  style,
  radius = 20,
  tint = "cool",
  glow = true,
  as: Tag = "div",
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  radius?: number;
  tint?: "cool" | "warm" | "dark";
  glow?: boolean;
  as?: "div" | "section";
}) {
  const base = tint === "dark"
    ? "rgba(10, 20, 40, 0.42)"
    : tint === "warm"
    ? "rgba(255, 250, 245, 0.42)"
    : "rgba(236, 244, 255, 0.42)";
  const chromaticRim = `
    0 0 0 0.5px rgba(255, 90, 120, 0.25),
    0 0 0 1px rgba(34, 211, 255, 0.18),
    inset 0 1px 0 rgba(255,255,255,.65),
    inset 0 -1px 0 rgba(10,20,40,.22),
    inset 1px 0 0 rgba(255,255,255,.18),
    inset -1px 0 0 rgba(34,211,255,.08)
  `;
  const shadow = glow
    ? `${chromaticRim}, 0 20px 50px -16px rgba(10,30,60,.28), 0 0 40px -8px rgba(34,211,255,.22)`
    : `${chromaticRim}, 0 10px 30px -14px rgba(10,30,60,.22)`;
  const merged: CSSProperties = {
    borderRadius: radius,
    background: base,
    backdropFilter: "blur(32px) saturate(185%)",
    WebkitBackdropFilter: "blur(32px) saturate(185%)",
    boxShadow: shadow,
    overflow: "hidden",
    isolation: "isolate",
    ...style,
  };
  return (
    <Tag className={className} style={merged}>
      {/* specular arc */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          mixBlendMode: "screen",
          opacity: 0.6,
        }}
      />
      {/* cyan under-tint */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background:
            "radial-gradient(60% 100% at 50% 100%, rgba(34,211,255,0.14) 0%, rgba(34,211,255,0) 70%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </Tag>
  );
}
