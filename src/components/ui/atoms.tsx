"use client";

import { isTodo, type Maybe } from "@/content/types";
import { IS_DEV } from "@/lib/content";
import { cn } from "@/lib/cn";

export function Chip({
  children,
  selected,
  onClick,
  as = "span",
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  as?: "span" | "button";
}) {
  const className = cn(
    "inline-flex items-center justify-center rounded-full px-[12px] text-[11px] font-semibold tracking-[0.04em] uppercase",
    "h-[26px] leading-none transition-all whitespace-nowrap",
    selected
      ? "text-white"
      : "text-[color:var(--color-ink-2)] hover:text-[color:var(--color-ink)]",
    onClick && "cursor-pointer",
  );
  const style: React.CSSProperties = selected
    ? {
        background: "linear-gradient(180deg, #2E7BF6 0%, #1D4FD3 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.35), 0 0 0 1px rgba(10,30,60,.1), 0 0 12px rgba(34,211,255,.45)",
      }
    : {
        background: "rgba(255,255,255,.55)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.8), 0 0 0 1px rgba(10,30,60,.08)",
        backdropFilter: "blur(8px)",
      };
  if (as === "button" || onClick) {
    return (
      <button type="button" onClick={onClick} className={className} style={style} aria-pressed={selected}>
        {children}
      </button>
    );
  }
  return <span className={className} style={style}>{children}</span>;
}

const PROOF_GLYPHS: Record<string, string> = {
  award: "🏆",
  paper: "📄",
  live: "🌐",
  industry: "🏢",
  course: "🎓",
  hackathon: "⚡",
};

export function ProofBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <span
      className="inline-flex items-center gap-[4px] rounded-[6px] bg-white px-[8px] text-[11px] font-semibold tracking-[0.02em] text-[color:var(--color-ink)]"
      style={{
        height: 22,
        border: "1px solid var(--color-hairline)",
      }}
    >
      <span aria-hidden="true">{PROOF_GLYPHS[icon] ?? "•"}</span>
      <span>{text}</span>
    </span>
  );
}

export function MetricTile({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex flex-col gap-1 p-4"
      style={{
        background: "var(--color-surface-2)",
        borderRadius: 12,
      }}
    >
      <div
        className="text-[32px] leading-9 font-bold tabular-nums tracking-[-0.02em] text-[color:var(--color-ink)]"
      >
        {value}
      </div>
      <div className="text-[12px] leading-4 font-medium tracking-[0.01em] text-[color:var(--color-ink-2)]">
        {label}
      </div>
    </div>
  );
}

/**
 * Renders a Maybe<string>. In production, TODO values show "—". In development
 * they also show an amber dot with the todo text as a title tooltip.
 */
export function MaybeText({ value, fallback = "—" }: { value: Maybe<string>; fallback?: string }) {
  if (isTodo(value)) {
    if (IS_DEV) {
      return (
        <span className="inline-flex items-center gap-1">
          <span aria-hidden="true">{fallback}</span>
          <span
            title={value.todo}
            aria-label={`TODO: ${value.todo}`}
            className="inline-block h-[6px] w-[6px] rounded-full"
            style={{ background: "var(--color-warning)" }}
          />
        </span>
      );
    }
    return <span>{fallback}</span>;
  }
  return <>{value}</>;
}

export function Button({
  children,
  onClick,
  href,
  variant = "secondary",
  target,
  size = "default",
  disabled,
  type = "button",
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  target?: string;
  size?: "default" | "sm";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}) {
  const h = size === "sm" ? 28 : 32;
  const base = cn(
    "inline-flex items-center justify-center gap-[6px] rounded-[10px] px-3 text-[13px] font-medium",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variant === "primary" &&
      "bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-hover)]",
    variant === "secondary" &&
      "bg-white text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-2)]",
    variant === "ghost" &&
      "text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)]",
  );
  const style =
    variant === "secondary"
      ? { height: h, border: "1px solid var(--color-hairline-strong)" }
      : { height: h };
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={base}
        style={style}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={base}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
