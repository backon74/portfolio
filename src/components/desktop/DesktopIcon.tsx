"use client";

import { forwardRef } from "react";
import { AppIcon, type AppIconKind } from "@/components/ui/icons/AppIcon";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  iconKind: AppIconKind;
  selected?: boolean;
  onOpen: () => void;
  onSelect: () => void;
};

export const DesktopIcon = forwardRef<HTMLButtonElement, Props>(function DesktopIcon(
  { label, iconKind, selected, onOpen, onSelect },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "group flex h-[112px] w-[108px] flex-col items-center justify-start gap-1.5 rounded px-1 pt-1",
        "focus:outline-none",
      )}
      onClick={() => {
        onSelect();
        onOpen();
      }}
      onFocus={onSelect}
      data-icon={iconKind}
      aria-label={label}
    >
      <span
        className={cn(
          "relative inline-block rounded-[14px] transition-transform duration-150 ease-out",
          "group-hover:scale-[1.04] group-active:scale-[0.96]",
          selected && "ring-2 ring-[color:var(--color-accent)]/40 ring-offset-2 ring-offset-transparent",
        )}
      >
        <AppIcon kind={iconKind} size={76} />
      </span>
      <span
        className={cn(
          "max-w-full truncate rounded-[5px] px-1 text-center text-[12px] leading-[14px] font-medium tracking-[0.01em] text-[color:var(--color-ink)]",
          selected
            ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent-hover)]"
            : "group-hover:bg-white/50",
        )}
        style={{
          textShadow: selected ? undefined : "0 1px 2px rgba(255,255,255,.6)",
        }}
      >
        {label}
      </span>
    </button>
  );
});
