"use client";

/**
 * HamzaOS v2 logo: chrome "H" monogram with cyan crossbar.
 */
export function LogoMark({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="3" width="4" height="18" rx="1.2" fill={color} />
      <rect x="17" y="3" width="4" height="18" rx="1.2" fill={color} />
      <rect x="7" y="10" width="10" height="4" rx="1" fill="#22D3FF" />
      <rect
        x="7"
        y="10"
        width="10"
        height="4"
        rx="1"
        fill="none"
        stroke="rgba(10,30,60,.25)"
        strokeWidth="0.4"
      />
    </svg>
  );
}
