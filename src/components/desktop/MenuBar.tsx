"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Volume2, VolumeX, Zap } from "lucide-react";
import { useOs } from "@/os/store";
import { APPS } from "@/os/apps";
import { LogoMark } from "@/components/ui/icons/LogoMark";
import { SpectrumBar } from "./SpectrumBar";
import { cn } from "@/lib/cn";
import { links } from "@/content/site";

type MenuName = "file" | "view" | "help";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  if (!now) return "";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bahrain",
  }).format(now);
}

export function MenuBar({
  soundOn,
  onToggleSound,
}: {
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  const router = useRouter();
  const focusedId = useOs((s) => s.focusedId);
  const windows = useOs((s) => s.windows);
  const open = useOs((s) => s.open);
  const close = useOs((s) => s.close);
  const cascade = useOs((s) => s.cascade);
  const minimiseAll = useOs((s) => s.minimiseAll);

  const focusedApp = focusedId ? windows[focusedId]?.appId : null;
  const focusedTitle = focusedApp ? APPS[focusedApp].title : "HamzaOS";

  const clock = useClock();

  const [openMenu, setOpenMenu] = useState<MenuName | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const closeMenu = () => setOpenMenu(null);

  const downloadResume = () => {
    const a = document.createElement("a");
    a.href = links.resumePdf;
    a.download = "Hamza_Alkhaldi_Resume.pdf";
    a.click();
  };

  const menus: Record<MenuName, { label: string; onSelect: () => void; disabled?: boolean }[]> = {
    file: [
      { label: "New window", onSelect: () => {}, disabled: true },
      {
        label: "Close window  ⌘W",
        onSelect: () => {
          if (focusedId) close(focusedId);
        },
        disabled: !focusedId,
      },
      { label: "Download résumé", onSelect: downloadResume },
    ],
    view: [
      {
        label: "Recruiter View",
        onSelect: () => router.push("/recruiter"),
      },
      { label: "Arrange windows", onSelect: cascade },
      { label: "Minimise all", onSelect: minimiseAll },
    ],
    help: [
      {
        label: "Show welcome",
        onSelect: () => open("welcome"),
      },
      {
        label: "Keyboard shortcuts",
        onSelect: () => open("shortcuts"),
      },
      {
        label: "Contact Hamza",
        onSelect: () => open("mail"),
      },
    ],
  };

  return (
    <div
      ref={barRef}
      className={cn(
        "liquid-glass fixed inset-x-0 top-0 z-[1000] flex h-[32px] items-center px-[14px]",
        "text-[12px] font-medium tracking-[0.01em] text-[color:var(--color-ink)]",
      )}
      style={{ borderRadius: 0, overflow: "visible" }}
      role="menubar"
      aria-label="HamzaOS menu bar"
    >
      {/* Data-stream micro-line under menu bar */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(34,211,255,.65) 0 2px, transparent 2px 10px)",
          opacity: 0.55,
          animation: "data-stream 6s linear infinite",
        }}
      />
      <button
        type="button"
        className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-[color:var(--color-surface-3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40"
        onClick={() => open("aboutOs")}
        aria-label="About HamzaOS"
      >
        <LogoMark size={16} />
      </button>

      <span
        className="ml-[18px] font-semibold text-[color:var(--color-ink)]"
        style={{ fontFamily: "var(--font-display), var(--font-sans)", letterSpacing: "-0.01em" }}
      >
        {focusedTitle}
      </span>

      <nav className="ml-[18px] flex items-center gap-[18px]" role="menubar">
        {(Object.keys(menus) as MenuName[]).map((name) => (
          <MenuDropdown
            key={name}
            name={name}
            label={name[0].toUpperCase() + name.slice(1)}
            items={menus[name]}
            open={openMenu === name}
            onOpen={() => setOpenMenu(name)}
            onClose={closeMenu}
            onHover={() => openMenu && setOpenMenu(name)}
          />
        ))}
      </nav>

      <div className="mx-auto hidden md:block">
        <SpectrumBar bars={7} />
      </div>

      <div className="ml-auto flex items-center gap-[12px]">
        <a
          href="/recruiter"
          className={cn(
            "inline-flex items-center gap-1 rounded-[11px] px-[10px] text-[11px] font-semibold tracking-[0.02em] text-white",
            "transition-colors hover:bg-[color:var(--color-accent-hover)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/60",
          )}
          style={{
            height: 22,
            background: "linear-gradient(180deg, #2E7BF6 0%, #1D4FD3 100%)",
            boxShadow: "0 0 0 0.5px rgba(10,30,60,.25), inset 0 1px 0 rgba(255,255,255,.35), 0 0 12px rgba(34,211,255,.45)",
          }}
          data-testid="recruiter-pill"
        >
          <Zap size={10} strokeWidth={2.5} />
          Recruiter View
        </a>
        <button
          type="button"
          onClick={onToggleSound}
          className="rounded p-1 text-[color:var(--color-ink-2)] hover:bg-[color:var(--color-surface-3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40"
          aria-label={soundOn ? "Mute sound" : "Enable sound"}
          data-testid="sound-toggle"
        >
          {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>
        <span
          suppressHydrationWarning
          className="mono-stroke text-[11px] tabular-nums text-[color:var(--color-ink)]"
          aria-label="Muharraq time"
          style={{ letterSpacing: "0.08em" }}
        >
          {clock}
        </span>
      </div>
    </div>
  );
}

function MenuDropdown({
  name,
  label,
  items,
  open,
  onOpen,
  onClose,
  onHover,
}: {
  name: MenuName;
  label: string;
  items: { label: string; onSelect: () => void; disabled?: boolean }[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onHover: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIdx(0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        btnRef.current?.focus();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => (i + 1) % items.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => (i - 1 + items.length) % items.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = items[activeIdx];
        if (item && !item.disabled) {
          item.onSelect();
          onClose();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, items, activeIdx, onClose]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "rounded px-1 py-0.5 text-[12px] font-medium",
          "hover:bg-[color:var(--color-surface-3)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40",
          open && "bg-[color:var(--color-surface-3)]",
        )}
        onClick={() => (open ? onClose() : onOpen())}
        onMouseEnter={onHover}
        data-menu={name}
      >
        {label}
      </button>
      {open && (
        <div
          role="menu"
          aria-label={label}
          className="absolute top-full left-0 mt-1 min-w-[200px] rounded-[10px] border border-[color:var(--color-hairline)] bg-white py-1 shadow-[var(--shadow-pop)]"
        >
          {items.map((item, i) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={cn(
                "flex w-full items-center px-3 py-1 text-left text-[13px]",
                "disabled:cursor-not-allowed disabled:text-[color:var(--color-ink-3)]",
                !item.disabled && "hover:bg-[color:var(--color-accent-soft)]",
                i === activeIdx && !item.disabled && "bg-[color:var(--color-accent-soft)]",
              )}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => {
                if (item.disabled) return;
                item.onSelect();
                onClose();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
