import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export type WidgetFrameProps = {
  width: number;
  height: number;
  children: ReactNode;
  onClick?: () => void;
  as?: "div" | "button";
  label?: string;
  className?: string;
  /** Optional footer barcode label, e.g. "GH-001". Ignored if null. */
  code?: string | null;
};

/**
 * HamzaOS v2 widget frame: glass + cyan rim + optional barcode footer.
 */
export function WidgetFrame({
  width,
  height,
  children,
  onClick,
  as = "div",
  label,
  className,
  code,
}: WidgetFrameProps) {
  const base =
    "relative overflow-hidden rounded-[18px] text-left group";
  const style: React.CSSProperties = {
    width,
    height,
    background: "rgba(255,255,255,0.68)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    boxShadow:
      "0 0 0 0.5px rgba(10,30,60,.14), inset 0 1px 0 rgba(255,255,255,.75), inset 0 0 0 1px rgba(34,211,255,.08), 0 10px 30px -14px rgba(10,30,60,.25), 0 0 20px -6px rgba(34,211,255,.18)",
  };
  const inner = (
    <>
      {children}
      {code ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[6px] left-[12px] right-[12px] flex items-center justify-between opacity-55"
        >
          <span
            className="barcode"
            style={{ display: "inline-block", height: 7, width: 42, borderRadius: 1 }}
          />
          <span
            className="mono-stroke"
            style={{ fontSize: 8, color: "var(--color-ink-2)", letterSpacing: "0.2em" }}
          >
            {code}
          </span>
        </div>
      ) : null}
    </>
  );
  if (as === "button") {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={cn(
          base,
          "cursor-pointer transition-[transform,box-shadow] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
          className,
        )}
        style={style}
      >
        {inner}
      </button>
    );
  }
  return (
    <div className={cn(base, className)} style={style} aria-label={label}>
      {inner}
    </div>
  );
}
