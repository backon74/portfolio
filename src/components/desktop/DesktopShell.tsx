"use client";

import { useEffect, useState } from "react";
import { MenuBar } from "./MenuBar";
import { ShaderBackground } from "./ShaderBackground";
import { Desktop } from "./Desktop";
import { Dock } from "./Dock";
import { WindowLayer } from "./WindowLayer";
import { ControlDeck } from "./Widgets/ControlDeck";
import { BootScreen } from "./BootScreen";
import { HeroType } from "./HeroType";
import { AmbientLayer } from "./AmbientLayer";
import { CenterStage } from "./CenterStage";
import { useOs, type AppId } from "@/os/store";
import { APPS } from "@/os/apps";
import { rehydrateFromSession } from "@/os/store";
import {
  initSoundFromStorage,
  playSoundNow,
  setSoundOn,
  useSound,
} from "@/os/hooks/useSound";

const BOOT_KEY = "hamzaos.boot.seen";

// Module-level flag so React Strict Mode's double effect invocation
// doesn't flip firstBoot/seenBoot between the two passes.
let bootDecided = false;
let bootFirstVisit = false;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function DesktopShell() {
  const open = useOs((s) => s.open);
  const close = useOs((s) => s.close);
  const minimise = useOs((s) => s.minimise);
  const focusedId = useOs((s) => s.focusedId);
  const windows = useOs((s) => s.windows);
  const order = useOs((s) => s.order);

  const { on: soundOn, toggle: toggleSound } = useSound();
  const [hydrated, setHydrated] = useState(false);
  const [showBoot, setShowBoot] = useState(false);
  const [firstBoot, setFirstBoot] = useState(false);

  useEffect(() => {
    rehydrateFromSession();
    initSoundFromStorage();
    const reduced = prefersReducedMotion();

    // Deep link handling
    let openedFromDeepLink = false;
    let hasDeepLink = false;
    try {
      const url = new URL(window.location.href);
      const openParam = url.searchParams.get("open");
      if (openParam) {
        hasDeepLink = true;
        if (openParam.startsWith("project:")) {
          const slug = openParam.slice("project:".length);
          open("caseStudy", { payload: { slug } });
          openedFromDeepLink = true;
        } else {
          const appIds = Object.keys(APPS) as AppId[];
          if (appIds.includes(openParam as AppId)) {
            open(openParam as AppId);
            openedFromDeepLink = true;
          }
        }
      }

      // Boot screen gating (PRD §3.3). Decide once per page load so
      // React Strict Mode's double-invoked effect doesn't flip the state.
      if (!bootDecided) {
        let seenBoot = false;
        try {
          seenBoot = window.localStorage.getItem(BOOT_KEY) === "1";
        } catch {
          /* ignore */
        }
        bootFirstVisit = !seenBoot;
        bootDecided = true;
        try {
          window.localStorage.setItem(BOOT_KEY, "1");
        } catch {
          /* ignore */
        }
      }
      const shouldBoot = bootFirstVisit && !hasDeepLink && !reduced;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBoot(shouldBoot);
      setFirstBoot(bootFirstVisit);

      // Welcome auto-open
      const forceWelcome = url.searchParams.get("welcome") === "1";
      let firstVisit = false;
      try {
        const seen = window.localStorage.getItem("hamzaos.welcome.seen");
        if (seen !== "1") firstVisit = true;
      } catch {
        /* ignore */
      }
      if (forceWelcome || (firstVisit && !openedFromDeepLink)) {
        open("welcome");
      }
      try {
        window.localStorage.setItem("hamzaos.welcome.seen", "1");
      } catch {
        /* ignore */
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep URL in sync with focused window
  useEffect(() => {
    if (!hydrated) return;
    try {
      const url = new URL(window.location.href);
      if (focusedId) {
        const win = windows[focusedId];
        if (!win) return;
        let value: string;
        if (win.appId === "caseStudy" && win.payload && typeof win.payload.slug === "string") {
          value = `project:${win.payload.slug}`;
        } else {
          value = win.appId;
        }
        url.searchParams.set("open", value);
      } else {
        url.searchParams.delete("open");
      }
      window.history.replaceState({}, "", url.toString());
    } catch {
      /* ignore */
    }
  }, [focusedId, windows, hydrated]);

  // Subscribe to store changes for sound effects.
  useEffect(() => {
    let prevIds = new Set(Object.keys(useOs.getState().windows));
    let prevMin = new Set(
      Object.values(useOs.getState().windows).filter((w) => w.minimised).map((w) => w.id),
    );
    const unsub = useOs.subscribe((state) => {
      const ids = new Set(Object.keys(state.windows));
      const min = new Set(
        Object.values(state.windows).filter((w) => w.minimised).map((w) => w.id),
      );
      for (const id of ids) if (!prevIds.has(id)) playSoundNow("open");
      for (const id of prevIds) if (!ids.has(id)) playSoundNow("close");
      for (const id of min) if (!prevMin.has(id) && ids.has(id)) playSoundNow("minimise");
      prevIds = ids;
      prevMin = min;
    });
    return unsub;
  }, []);

  // Hotkeys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inForm =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      const meta = e.metaKey || e.ctrlKey;

      if (e.key === "Escape" && focusedId && !inForm) {
        e.preventDefault();
        close(focusedId);
        return;
      }
      if (meta && (e.key === "w" || e.key === "W")) {
        if (focusedId) {
          e.preventDefault();
          close(focusedId);
        }
        return;
      }
      if (meta && (e.key === "m" || e.key === "M")) {
        if (focusedId) {
          e.preventDefault();
          minimise(focusedId);
        }
        return;
      }
      if (meta && e.key === "`") {
        e.preventDefault();
        const visible = order.filter((id) => !windows[id]?.minimised);
        if (visible.length < 2) return;
        const focusAction = useOs.getState().focus;
        const i = visible.findIndex((id) => id === focusedId);
        const next = visible[(i + 1) % visible.length];
        focusAction(next);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [focusedId, close, minimise, order, windows]);

  const handleToggleSound = () => {
    // toggleSound() handles persist + first-enable chime.
    // Keep a defensive path in case hook state is stale: use module getter.
    try {
      toggleSound();
    } catch {
      setSoundOn(!soundOn, { chime: !soundOn });
    }
  };

  return (
    <main
      className="hamzaos-wallpaper hamzaos-grain relative h-screen w-screen overflow-hidden"
      data-shell="desktop"
      data-first-boot={firstBoot ? "1" : "0"}
    >
      {/* Rendered wallpaper image sits on top of the CSS gradient fallback. */}
      <ShaderBackground />
      <AmbientLayer />
      <div className="relative z-[1] h-full w-full">
        <MenuBar soundOn={soundOn} onToggleSound={handleToggleSound} />
        <HeroType enabled={firstBoot && !showBoot} />
        <CenterStage />
        <Desktop />
        <ControlDeck firstBoot={firstBoot} />
        <WindowLayer />
        <Dock />
      </div>
      {showBoot && <BootScreen onDone={() => setShowBoot(false)} />}
    </main>
  );
}
