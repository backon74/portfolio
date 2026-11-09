import Link from "next/link";
import { LogoMarkStatic } from "./LogoMarkStatic";

/**
 * Top bar for Recruiter View — mirrors the HamzaOS menu bar silhouette
 * (logo + label on the left, Back-to-desktop pill on the right).
 * Static markup only, no client JS.
 */
export function RecruiterBar() {
  return (
    <div
      data-recruiter-bar
      className="sticky top-0 z-10 flex h-[44px] items-center border-b border-[color:var(--color-hairline)] bg-white/90 px-4 backdrop-blur"
    >
      <div className="flex items-center gap-2 text-[13px] font-semibold text-[color:var(--color-ink)]">
        <LogoMarkStatic size={18} />
        <span>HamzaOS</span>
        <span className="text-[color:var(--color-ink-3)]">·</span>
        <span>Recruiter View</span>
      </div>
      <div className="ml-auto">
        <Link
          href="/"
          className="inline-flex h-[28px] items-center rounded-[14px] border border-[color:var(--color-hairline-strong)] bg-white px-3 text-[12px] font-semibold text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/60"
        >
          Back to desktop
        </Link>
      </div>
    </div>
  );
}
