"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion } from "motion/react";
import { ProfileWidget } from "./ProfileWidget";
import { GitHubWidget } from "./GitHubWidget";
import { WeatherWidget } from "./WeatherWidget";
import { NowPlayingWidget } from "./NowPlayingWidget";
import { useReducedMotion } from "@/os/hooks/useReducedMotion";

// PRD §3.4: hide Now Playing < 1180, also hide Weather < 1024.
function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
function getSnapshot() {
  return window.innerWidth;
}
function getServerSnapshot() {
  return 1440;
}

/** Stagger fade-up 6 px, 40 ms apart, only on first boot. (DESIGN.md §6) */
function Staggered({
  index,
  animate,
  children,
}: {
  index: number;
  animate: boolean;
  children: ReactNode;
}) {
  if (!animate) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.24, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function WidgetsColumn({ firstBoot = false }: { firstBoot?: boolean }) {
  const w = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduced = useReducedMotion();
  const showWeather = w >= 1024;
  const showSong = w >= 1180;
  const stagger = firstBoot && !reduced;

  return (
    <div
      className="pointer-events-auto absolute flex flex-col gap-[16px]"
      style={{ top: 54, right: 24, width: 340 }}
      aria-label="Widgets"
    >
      <Staggered index={0} animate={stagger}>
        <ProfileWidget />
      </Staggered>
      {showSong && (
        <Staggered index={1} animate={stagger}>
          <NowPlayingWidget />
        </Staggered>
      )}
      {showWeather && (
        <Staggered index={2} animate={stagger}>
          <WeatherWidget />
        </Staggered>
      )}
      <Staggered index={3} animate={stagger}>
        <GitHubWidget />
      </Staggered>
    </div>
  );
}
