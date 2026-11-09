"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { AppIcon, type AppIconKind } from "@/components/ui/icons/AppIcon";
import { ProfileWidget } from "@/components/desktop/Widgets/ProfileWidget";
import { GitHubWidget } from "@/components/desktop/Widgets/GitHubWidget";
import { WeatherWidget } from "@/components/desktop/Widgets/WeatherWidget";
import { NowPlayingWidget } from "@/components/desktop/Widgets/NowPlayingWidget";
import type { PhoneAppId } from "./types";

export type HomeGridItem = {
  id: string;
  label: string;
  iconKind: AppIconKind;
  appId: PhoneAppId;
  payload?: Record<string, unknown>;
};

export const PHONE_GRID: HomeGridItem[] = [
  { id: "projects", label: "Projects", iconKind: "projects", appId: "files", payload: { location: "projects" } },
  { id: "experience", label: "Experience", iconKind: "experience", appId: "files", payload: { location: "experience" } },
  { id: "education", label: "Education", iconKind: "education", appId: "files", payload: { location: "education" } },
  { id: "research", label: "Research", iconKind: "research", appId: "research" },
  { id: "skills", label: "Skills", iconKind: "skills", appId: "skills" },
  { id: "hamza", label: "Hamza", iconKind: "hamza", appId: "hamza" },
  { id: "resume", label: "Résumé", iconKind: "resume", appId: "resume" },
];

export function HomeScreen({
  onOpenApp,
}: {
  onOpenApp: (item: HomeGridItem) => void;
}) {
  const [page, setPage] = useState(0);
  const pagerRef = useRef<HTMLDivElement | null>(null);

  const scrollToPage = (p: number) => {
    const el = pagerRef.current;
    if (!el) return;
    el.scrollTo({ left: p * el.clientWidth, behavior: "smooth" });
    setPage(p);
  };

  const onScroll = () => {
    const el = pagerRef.current;
    if (!el) return;
    const p = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
    if (p !== page) setPage(p);
  };

  return (
    <div className="flex h-full w-full flex-col" data-phone-home>
      {/* Widget pager — 2 pages, horizontal swipe */}
      <div className="shrink-0">
        <div
          ref={pagerRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth"
          style={{ scrollbarWidth: "none" }}
          aria-label="Widget pages"
        >
          <style>{`[data-phone-home] [aria-label="Widget pages"]::-webkit-scrollbar{display:none}`}</style>
          <section
            className="flex w-full shrink-0 snap-start flex-col gap-[14px] px-4 py-2"
            aria-label="Widgets page 1"
          >
            <div className="flex w-full justify-center">
              <ProfileWidget />
            </div>
            <div className="flex w-full justify-center">
              <GitHubWidget />
            </div>
          </section>
          <section
            className="flex w-full shrink-0 snap-start flex-col gap-[14px] px-4 py-2"
            aria-label="Widgets page 2"
          >
            <div className="flex w-full justify-center">
              <WeatherWidget />
            </div>
            <div className="flex w-full justify-center">
              <NowPlayingWidget />
            </div>
          </section>
        </div>
        <div className="mt-2 flex items-center justify-center gap-[6px]" role="tablist" aria-label="Widget page dots">
          {[0, 1].map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={page === p}
              aria-label={`Widgets page ${p + 1}`}
              onClick={() => scrollToPage(p)}
              className={`h-[6px] w-[6px] rounded-full transition-colors ${
                page === p ? "bg-[color:var(--color-ink)]" : "bg-[color:var(--color-ink-3)]/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* App grid */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
        <ul
          className="mx-auto grid max-w-[360px] grid-cols-4 place-items-center"
          style={{ rowGap: 22, columnGap: 0 }}
        >
          {PHONE_GRID.map((item) => (
            <li key={item.id}>
              <motion.button
                layoutId={`phone-icon-${item.id}`}
                type="button"
                onClick={() => onOpenApp(item)}
                className="flex min-h-[88px] w-[72px] flex-col items-center justify-start gap-[6px] rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                aria-label={`Open ${item.label}`}
              >
                <AppIcon kind={item.iconKind} size={60} />
                <span
                  className="text-center text-[11px] font-medium text-[color:var(--color-ink)]"
                  style={{ textShadow: "0 1px 2px rgba(255,255,255,0.6)" }}
                >
                  {item.label}
                </span>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
