"use client";

import dynamic from "next/dynamic";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { PhoneRoute } from "./types";

const WelcomeApp = dynamic(() => import("@/components/apps/Welcome"), { ssr: false });
const FilesApp = dynamic(() => import("@/components/apps/Files"), { ssr: false });
const CaseStudyApp = dynamic(() => import("@/components/apps/CaseStudy"), { ssr: false });
const ResearchApp = dynamic(() => import("@/components/apps/Research"), { ssr: false });
const SkillsApp = dynamic(() => import("@/components/apps/Skills"), { ssr: false });
const HamzaApp = dynamic(() => import("@/components/apps/Hamza"), { ssr: false });
const PhotosApp = dynamic(() => import("@/components/apps/Photos"), { ssr: false });
const ResumeApp = dynamic(() => import("@/components/apps/Resume"), { ssr: false });
const MailApp = dynamic(() => import("@/components/apps/Mail"), { ssr: false });

type Props = {
  route: Extract<PhoneRoute, { kind: "app" }>;
  onBack: () => void;
};

function renderApp(route: Props["route"]) {
  switch (route.appId) {
    case "welcome":
      return <WelcomeApp />;
    case "files":
      return <FilesApp payload={route.payload} />;
    case "caseStudy":
      return <CaseStudyApp payload={route.payload} />;
    case "research":
      return <ResearchApp />;
    case "skills":
      return <SkillsApp />;
    case "hamza":
      return <HamzaApp />;
    case "photos":
      return <PhotosApp />;
    case "resume":
      return <ResumeApp />;
    case "mail":
      return <MailApp />;
  }
}

export function AppScreen({ route, onBack }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  // Collapsible large-title: show large title until scrolled > 24px
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      setCollapsed(el.scrollTop > 24);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Edge-swipe to go back (from the left edge)
  useEffect(() => {
    let startX: number | null = null;
    let startY: number | null = null;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      if (t.clientX <= 20) {
        startX = t.clientX;
        startY = t.clientY;
      } else {
        startX = null;
      }
    };
    const onEnd = (e: TouchEvent) => {
      if (startX == null) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = Math.abs(t.clientY - (startY ?? t.clientY));
      if (dx > 70 && dy < 50) {
        onBack();
      }
      startX = null;
    };
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, [onBack]);

  const layoutId = route.iconId ? `phone-icon-${route.iconId}` : undefined;

  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.9 }}
      className="absolute inset-0 z-30 flex flex-col overflow-hidden bg-[color:var(--color-surface)]"
      data-phone-app={route.appId}
    >
      {/* Nav bar */}
      <div
        className="relative z-10 flex h-[44px] shrink-0 items-center justify-between px-2"
        style={{
          borderBottom: collapsed ? "1px solid var(--color-hairline)" : "1px solid transparent",
          background: collapsed ? "var(--color-surface)" : "transparent",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to home"
          className="flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-[10px] px-2 text-[15px] text-[color:var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <ChevronLeft size={22} />
          <span>Home</span>
        </button>
        <div
          className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold text-[color:var(--color-ink)]"
          style={{ opacity: collapsed ? 1 : 0, transition: "opacity 160ms var(--ease-standard)" }}
          aria-hidden={!collapsed}
        >
          {route.title}
        </div>
        <div className="min-w-[44px]" />
      </div>

      {/* Scroll area with collapsible large title */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
        <div
          className="px-4 pt-2 pb-3"
          style={{
            opacity: collapsed ? 0 : 1,
            transform: collapsed ? "translateY(-8px)" : "translateY(0)",
            transition: "opacity 160ms var(--ease-standard), transform 160ms var(--ease-standard)",
          }}
        >
          <h1 className="text-[28px] leading-[34px] font-bold tracking-[-0.015em] text-[color:var(--color-ink)]">
            {route.title}
          </h1>
        </div>

        {/* App body — fills remaining; many of our app components already scroll internally,
            so give them a sensible minimum height and let them handle their own layout. */}
        <div className="min-h-[calc(100dvh-44px-44px-60px)]">{renderApp(route)}</div>
      </div>
    </motion.div>
  );
}
