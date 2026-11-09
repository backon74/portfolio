"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { DesktopIcon } from "./DesktopIcon";
import type { AppIconKind } from "@/components/ui/icons/AppIcon";
import { useOs, type AppId } from "@/os/store";

export type DesktopIconDef = {
  id: string;
  label: string;
  iconKind: AppIconKind;
  appId: AppId;
  payload?: Record<string, unknown>;
};

// Two columns, in order per PRD §3.1
export const DESKTOP_ICONS: DesktopIconDef[] = [
  { id: "welcome", label: "Welcome.txt", iconKind: "welcome", appId: "welcome" },
  { id: "projects", label: "Projects", iconKind: "projects", appId: "files", payload: { location: "projects" } },
  { id: "experience", label: "Experience", iconKind: "experience", appId: "files", payload: { location: "experience" } },
  { id: "education", label: "Education", iconKind: "education", appId: "files", payload: { location: "education" } },
  { id: "research", label: "Research", iconKind: "research", appId: "research" },
  { id: "skills", label: "Skills", iconKind: "skills", appId: "skills" },
  { id: "hamza", label: "Hamza", iconKind: "hamza", appId: "hamza" },
  { id: "resume", label: "Résumé.pdf", iconKind: "resume", appId: "resume" },
];

const COLS = 2;

export function Desktop() {
  const open = useOs((s) => s.open);
  const [selected, setSelected] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      // ignore when inside a window / input
      const target = e.target as HTMLElement | null;
      if (target && target.closest("[data-window]")) return;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      const idx = DESKTOP_ICONS.findIndex((i) => i.id === selected);
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        let next = idx;
        if (idx === -1) next = 0;
        else if (e.key === "ArrowDown") next = Math.min(DESKTOP_ICONS.length - 1, idx + 1);
        else if (e.key === "ArrowUp") next = Math.max(0, idx - 1);
        else if (e.key === "ArrowRight") next = Math.min(DESKTOP_ICONS.length - 1, idx + Math.floor(DESKTOP_ICONS.length / COLS));
        else if (e.key === "ArrowLeft") next = Math.max(0, idx - Math.floor(DESKTOP_ICONS.length / COLS));
        const def = DESKTOP_ICONS[next];
        setSelected(def.id);
        refs.current[def.id]?.focus();
      } else if (e.key === "Enter" && selected) {
        e.preventDefault();
        const def = DESKTOP_ICONS.find((i) => i.id === selected);
        if (def) open(def.appId, { payload: def.payload, openerEl: `desktop-icon-${def.id}` });
      }
    },
    [selected, open],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-label="Desktop"
    >
      <div
        className="pointer-events-auto absolute grid gap-y-1"
        style={{
          top: 54,
          left: 24,
          gridTemplateColumns: `repeat(${COLS}, 108px)`,
        }}
      >
        {DESKTOP_ICONS.map((icon) => (
          <DesktopIcon
            key={icon.id}
            ref={(el) => {
              refs.current[icon.id] = el;
            }}
            label={icon.label}
            iconKind={icon.iconKind}
            selected={selected === icon.id}
            onSelect={() => setSelected(icon.id)}
            onOpen={() => open(icon.appId, { payload: icon.payload, openerEl: `desktop-icon-${icon.id}` })}
          />
        ))}
      </div>
    </div>
  );
}
