"use client";

import type { ReactNode } from "react";

/**
 * Squircle tile — the base shape under every HamzaOS app icon.
 * Uses a path (not border-radius) so the curve is smoother than a rounded rect.
 */
export function Squircle({
  size = 60,
  gradient,
  gradientId,
  children,
  className,
}: {
  size?: number;
  gradient: [string, string];
  gradientId: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradient[0]} />
          <stop offset="100%" stopColor={gradient[1]} />
        </linearGradient>
      </defs>
      {/* Squircle (superellipse approximation) */}
      <path
        d="M50,0 C82,0 100,18 100,50 C100,82 82,100 50,100 C18,100 0,82 0,50 C0,18 18,0 50,0 Z"
        fill={`url(#${gradientId})`}
      />
      {/* 1px inner highlight at 30% opacity */}
      <path
        d="M50,1 C81.5,1 99,18.5 99,50 C99,81.5 81.5,99 50,99 C18.5,99 1,81.5 1,50 C1,18.5 18.5,1 50,1 Z"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      {children}
    </svg>
  );
}
