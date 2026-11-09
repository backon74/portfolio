/**
 * Static (no-"use client") SVG copy of the HamzaOS logo mark for Recruiter View.
 */
export function LogoMarkStatic({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="#2563EB" />
      <rect x="6" y="6" width="3" height="12" rx="1" fill="#fff" />
      <rect x="15" y="6" width="3" height="12" rx="1" fill="#fff" />
      <rect x="7" y="11" width="10" height="2.5" fill="#22D3FF" />
    </svg>
  );
}
