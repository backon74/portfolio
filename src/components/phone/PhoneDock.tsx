"use client";

import { AppIcon } from "@/components/ui/icons/AppIcon";
import { links } from "@/content/site";

export type DockAction =
  | { kind: "link"; href: string; external?: boolean; label: string; icon: "linkedin" | "github" }
  | { kind: "openApp"; appId: "mail" | "welcome"; label: string; icon: "mail" | "welcome" };

const ICON = 52;

export function PhoneDock({ onOpenApp }: { onOpenApp: (appId: "mail" | "welcome") => void }) {
  const items: DockAction[] = [
    { kind: "link", href: links.linkedin, external: true, label: "LinkedIn", icon: "linkedin" },
    { kind: "link", href: links.github, external: true, label: "GitHub", icon: "github" },
    { kind: "openApp", appId: "mail", label: "Mail", icon: "mail" },
    { kind: "openApp", appId: "welcome", label: "Welcome", icon: "welcome" },
  ];

  return (
    <div
      className="hamzaos-glass pointer-events-auto mx-auto mb-[max(12px,env(safe-area-inset-bottom))] flex w-[min(360px,calc(100vw-24px))] items-center justify-around rounded-[28px] px-[12px] py-[10px]"
      style={{
        background: "var(--color-glass)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        boxShadow: "var(--shadow-glass)",
      }}
      data-phone-dock
    >
      {items.map((it) =>
        it.kind === "link" ? (
          <a
            key={it.label}
            href={it.href}
            target={it.external ? "_blank" : undefined}
            rel={it.external ? "noreferrer noopener" : undefined}
            aria-label={it.label}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <AppIcon kind={it.icon} size={ICON} />
          </a>
        ) : (
          <button
            key={it.label}
            type="button"
            aria-label={it.label}
            onClick={() => onOpenApp(it.appId)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <AppIcon kind={it.icon} size={ICON} />
          </button>
        ),
      )}
    </div>
  );
}
