"use client";

import { useState } from "react";
import { AppIcon, type AppIconKind } from "@/components/ui/icons/AppIcon";
import { useOs, type AppId } from "@/os/store";
import { useReducedMotion } from "@/os/hooks/useReducedMotion";
import { links } from "@/content/site";
import { cn } from "@/lib/cn";

type DockItem =
  | { kind: "app"; appId: AppId; iconKind: AppIconKind; label: string; payload?: Record<string, unknown> }
  | { kind: "link"; href: string; iconKind: AppIconKind; label: string; download?: string }
  | { kind: "mail"; iconKind: AppIconKind; label: string };

const LEFT_GROUP: DockItem[] = [
  { kind: "link", href: links.linkedin, iconKind: "linkedin", label: "LinkedIn" },
  { kind: "link", href: links.github, iconKind: "github", label: "GitHub" },
  { kind: "mail", iconKind: "mail", label: "Mail" },
  { kind: "link", href: links.resumePdf, iconKind: "resume", label: "Résumé", download: "Hamza_Alkhaldi_Resume.pdf" },
];

const RIGHT_GROUP: DockItem[] = [];

export function Dock() {
  const open = useOs((s) => s.open);
  const windows = useOs((s) => s.windows);
  const focus = useOs((s) => s.focus);
  const restore = useOs((s) => s.restore);
  const reduced = useReducedMotion();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const all: (DockItem | null)[] =
    RIGHT_GROUP.length > 0 ? [...LEFT_GROUP, null, ...RIGHT_GROUP] : [...LEFT_GROUP];

  const runningAppIds = new Set(
    Object.values(windows).map((w) => w.appId),
  );

  const handleClick = (item: DockItem) => {
    if (item.kind === "app") {
      // If already open, focus/restore; else open
      const existing = Object.values(windows).find((w) => w.appId === item.appId);
      if (existing) {
        if (existing.minimised) restore(existing.id);
        else focus(existing.id);
      } else {
        open(item.appId, { payload: item.payload, openerEl: `dock-${item.iconKind}` });
      }
    } else if (item.kind === "mail") {
      open("mail", { openerEl: "dock-mail" });
    } else {
      window.open(item.href, item.download ? "_self" : "_blank", "noopener,noreferrer");
    }
  };

  const scaleFor = (i: number) => {
    if (reduced || hoverIdx === null) return 1;
    const h = hoverIdx;
    const d = Math.abs(i - h);
    if (d === 0) return 1.5;
    if (d === 1) return 1.22;
    if (d === 2) return 1.08;
    return 1;
  };

  return (
    <div
      className={cn(
        "liquid-glass fixed bottom-[14px] left-1/2 z-[950] -translate-x-1/2",
        "flex items-end px-[12px] py-[10px]",
      )}
      style={{
        height: 86,
        borderRadius: 28,
        gap: 10,
        overflow: "visible",
      }}
      role="toolbar"
      aria-label="Dock"
      data-testid="dock"
      onMouseLeave={() => setHoverIdx(null)}
    >
      {all.map((item, i) => {
        if (!item) {
          return (
            <span
              key={`div-${i}`}
              aria-hidden="true"
              style={{
                width: 1,
                height: 50,
                background: "linear-gradient(to bottom, rgba(10,30,60,0), rgba(34,211,255,.45), rgba(10,30,60,0))",
                alignSelf: "center",
                margin: "0 4px",
              }}
            />
          );
        }
        const running = item.kind === "app" && runningAppIds.has(item.appId);
        const scale = scaleFor(i);
        const BASE = 62;
        const slotW = Math.round(BASE * scale);
        return (
          <div
            key={item.label}
            className="relative flex flex-col items-end justify-end"
            style={{
              width: slotW,
              height: BASE,
              transition: reduced
                ? "width 80ms linear"
                : "width 180ms cubic-bezier(.2,.8,.2,1)",
            }}
          >
            {hoverIdx === i && (
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full mb-[10px] rounded-md px-2 py-0.5 text-[11px] font-medium tracking-[0.02em] whitespace-nowrap text-white"
                style={{ background: "#14171FE6" }}
              >
                {item.label}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleClick(item)}
              onMouseEnter={() => setHoverIdx(i)}
              onFocus={() => setHoverIdx(i)}
              onBlur={() => setHoverIdx(null)}
              aria-label={item.label}
              data-dock-item={item.label}
              className="flex items-end justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/50 rounded-[12px]"
              style={{
                width: slotW,
                height: Math.round(BASE * scale),
                transition: reduced
                  ? "width 80ms linear, height 80ms linear"
                  : "width 180ms cubic-bezier(.2,.8,.2,1), height 180ms cubic-bezier(.2,.8,.2,1)",
              }}
            >
              <AppIcon kind={item.iconKind} size={Math.round(BASE * scale)} />
            </button>
            {running && (
              <span
                aria-hidden="true"
                className="absolute -bottom-[8px] left-1/2 h-[4px] w-[16px] -translate-x-1/2 rounded-full"
                style={{
                  background: "linear-gradient(90deg, rgba(34,211,255,0), #22D3FF, rgba(34,211,255,0))",
                  boxShadow: "0 0 8px rgba(34,211,255,.7)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
